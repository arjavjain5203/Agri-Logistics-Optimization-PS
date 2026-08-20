"""
KISAN GUARD — Market Intelligence Agent
========================================
Stateless Market Intelligence layer for the KISAN GUARD system.
Consumes Crop Vulnerability Agent output + real AGMARKNET market data
to produce structured market recommendations.

Provider: AgMarket-API (Flask wrapper over agmarknet.gov.in)
LLM: Gemini (google-genai SDK, same as Crop Agent)
Observability: LangSmith (safe, graceful degradation)
Validation: Pydantic v2
"""

import os
import json
import math
import urllib.request
import urllib.error
import urllib.parse
import time
import functools
import traceback
from datetime import datetime, timezone, timedelta
from typing import Optional, List, Literal, Dict, Any
from pydantic import BaseModel, Field
# pyrefly: ignore [missing-import]
from dotenv import load_dotenv

load_dotenv()

# ============================================================
# OBSERVABILITY (LANGSMITH TRACING)
# ============================================================
# Identical safe-tracing pattern used by the Crop Agent.
# If LangSmith is unavailable, the agent continues working.

def safe_traceable(name, run_type="chain"):
    """Decorator that enables LangSmith tracing when available and configured, no-ops otherwise."""
    def decorator(func):
        if not os.environ.get("LANGSMITH_API_KEY"):
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                return func(*args, **kwargs)
            return wrapper

        try:
            from langsmith import traceable
            return traceable(name=name, run_type=run_type)(func)
        except Exception:
            @functools.wraps(func)
            def wrapper(*args, **kwargs):
                return func(*args, **kwargs)
            return wrapper
    return decorator

def add_run_metadata(metadata: dict):
    """Attach metadata to the current LangSmith run if available."""
    try:
        from langsmith.run_helpers import get_current_run
        run = get_current_run()
        if run:
            if hasattr(run, 'add_metadata'):
                run.add_metadata(metadata)
            else:
                run.extra = run.extra or {}
                run.extra.setdefault("metadata", {}).update(metadata)
    except Exception:
        pass


# ============================================================
# CONFIGURATION
# ============================================================

# AgMarket-API base URL (Flask scraper of agmarknet.gov.in)
# Can be overridden via environment variable
AGMARKET_API_BASE_URL = os.environ.get(
    "AGMARKET_API_BASE_URL",
    "https://agmarknet-api.onrender.com"  # Default Render deployment
)

# State mapping: latitude ranges to likely Indian states (simplified geo-lookup)
# Used when no explicit state is provided
COORD_TO_STATE = [
    # (lat_min, lat_max, lon_min, lon_max, state_name)
    (28.0, 31.0, 76.0, 78.5, "Haryana"),
    (26.0, 28.0, 77.0, 84.0, "Uttar Pradesh"),
    (28.0, 32.0, 74.5, 77.5, "Punjab"),
    (22.0, 26.0, 72.0, 76.0, "Madhya Pradesh"),
    (18.0, 22.0, 72.0, 81.0, "Maharashtra"),
    (15.0, 19.0, 73.0, 78.5, "Karnataka"),
    (12.0, 15.0, 74.5, 80.5, "Karnataka"),
    (10.0, 13.0, 76.0, 80.5, "Tamil Nadu"),
    (20.0, 24.0, 84.0, 88.0, "Odisha"),
    (22.0, 27.5, 86.0, 89.0, "West Bengal"),
    (21.0, 24.5, 69.5, 74.5, "Gujarat"),
    (24.0, 30.5, 69.5, 76.0, "Rajasthan"),
    (28.4, 29.5, 76.5, 78.0, "Delhi"),
    (20.0, 24.0, 80.0, 84.0, "Chhattisgarh"),
    (21.5, 25.5, 83.5, 87.5, "Jharkhand"),
    (24.0, 27.5, 83.0, 88.5, "Bihar"),
    (8.0, 13.0, 74.5, 77.5, "Kerala"),
    (13.0, 20.0, 78.0, 84.5, "Telangana"),
    (13.0, 19.5, 77.0, 84.0, "Andhra Pradesh"),
    (29.0, 31.5, 75.5, 78.0, "Uttarakhand"),
]

# Supported commodities (mapping to AgMarket-API commodity names)
SUPPORTED_COMMODITIES = {
    "potato", "tomato", "onion", "rice", "wheat", "maize",
    "apple", "banana", "orange", "mango", "grapes", "watermelon",
    "coconut", "sugarcane", "cotton", "jute", "coffee", "tea",
}


# ============================================================
# UNIT CONVERSION CONSTANTS (DETERMINISTIC)
# ============================================================

UNIT_CONVERSIONS_TO_KG = {
    "quintal": 100.0,    # 1 quintal = 100 kg
    "tonne": 1000.0,     # 1 tonne = 1000 kg
    "kg": 1.0,           # 1 kg = 1 kg
    "ton": 1000.0,       # alias
}


# ============================================================
# PYDANTIC MODELS — INPUT CONTRACTS
# ============================================================

class LocationInput(BaseModel):
    latitude: float = Field(..., ge=-90.0, le=90.0)
    longitude: float = Field(..., ge=0.0, le=180.0)

class CropInput(BaseModel):
    name: str
    variety: Optional[str] = None
    quantity_t: Optional[float] = Field(None, ge=0.0, description="Quantity in tonnes")

class RiskDetailInput(BaseModel):
    """Subset of Crop Agent's RiskAssessment that Market Agent consumes."""
    vulnerability_score: float = Field(..., ge=0.0, le=1.0)
    risk_level: Literal["LOW", "MEDIUM", "HIGH", "CRITICAL"]
    spoilage_risk: float = Field(..., ge=0.0, le=1.0)
    harvest_urgency: float = Field(..., ge=0.0, le=1.0)
    recommended_action_window_hours: int
    recommended_urgency: Literal[
        "NORMAL", "PREPARE_FOR_HARVEST", "PROTECT_AND_STORE",
        "MOVE_TO_MARKET_SOON", "URGENT_MOVEMENT"
    ]

class CropRiskInput(BaseModel):
    """Structured subset of Crop Vulnerability Agent output consumed by Market Agent."""
    crop_state: Literal["FIELD_GROWING", "HARVEST_READY", "POST_HARVEST"]
    risk: RiskDetailInput
    confidence: float = Field(..., ge=0.0, le=1.0)
    evidence_consistency: Literal["CONSISTENT", "CONFLICTING", "LIMITED"]


# ============================================================
# PYDANTIC MODELS — OUTPUT CONTRACTS
# ============================================================

class MarketOption(BaseModel):
    """Single market/mandi opportunity with normalized pricing."""
    market_name: str
    state: str
    district: Optional[str] = None
    commodity: str
    variety: Optional[str] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    modal_price: Optional[float] = None
    original_unit: str = "quintal"
    normalized_price_per_kg: Optional[float] = None
    normalized_price_per_tonne: Optional[float] = None
    arrival_date: Optional[str] = None
    freshness: Literal["CURRENT", "HISTORICAL", "STALE", "UNAVAILABLE"]
    source: str = "agmarknet.gov.in"
    retrieval_timestamp: str

class MarketDataQuality(BaseModel):
    provider: str
    provider_status: str
    total_records_fetched: int
    valid_records: int
    stale_records: int
    data_age_description: Optional[str] = None

class MarketEvidence(BaseModel):
    provider: str
    api_url_used: str
    retrieved_at: str
    raw_record_count: int
    records: List[Dict[str, Any]] = []

class MarketAssessment(BaseModel):
    """Final structured output of the Market Intelligence Agent."""
    crop: str
    quantity_t: Optional[float] = None
    market_options: List[MarketOption]
    recommended_market: Optional[str] = None
    expected_gross_revenue: Optional[float] = None
    recommendation: str
    confidence: float = Field(..., ge=0.0, le=1.0)
    urgency_context: str
    uncertainties: List[str]
    data_quality: MarketDataQuality
    evidence: MarketEvidence
    status: Literal[
        "SUCCESS", "NO_MARKET_DATA", "API_FAILURE",
        "UNSUPPORTED_CROP", "PARTIAL_DATA"
    ]
    generated_at: str


# ============================================================
# MARKET DATA PROVIDER
# ============================================================

class AgMarketProvider:
    """
    Fetches real market data from the AgMarket-API
    (Flask wrapper over agmarknet.gov.in scraping).

    Endpoint: GET /request?commodity=X&state=Y
    """

    def __init__(self, base_url: str = None):
        self.base_url = (base_url or AGMARKET_API_BASE_URL).rstrip("/")

    @safe_traceable(name="market_data_fetch", run_type="tool")
    def fetch_market_data(self, commodity: str, state: str, market: Optional[str] = None) -> dict:
        """
        Fetch market price data from AgMarket-API.

        Returns dict with:
            - success: bool
            - data: list of market records (if successful)
            - error: str (if failed)
            - url: the API URL called
            - retrieved_at: ISO timestamp
        """
        params = {
            "commodity": commodity.capitalize(),
            "state": state.lower(),
        }
        if market:
            params["market"] = market.lower()

        query_string = urllib.parse.urlencode(params)
        url = f"{self.base_url}/request?{query_string}"
        retrieved_at = datetime.now(timezone.utc).isoformat()

        try:
            req = urllib.request.Request(
                url,
                headers={"User-Agent": "KisanGuard-MarketAgent/1.0", "Accept": "application/json"}
            )
            with urllib.request.urlopen(req, timeout=15) as response:
                raw = response.read().decode("utf-8")
                data = json.loads(raw)

            # The API may return different formats; normalize
            records = []
            if isinstance(data, list):
                records = data
            elif isinstance(data, dict):
                if "data" in data:
                    records = data["data"] if isinstance(data["data"], list) else [data["data"]]
                elif "error" in data:
                    return {
                        "success": False,
                        "data": [],
                        "error": data.get("error", "Unknown API error"),
                        "url": url,
                        "retrieved_at": retrieved_at,
                    }
                else:
                    records = [data]

            return {
                "success": True,
                "data": records,
                "error": None,
                "url": url,
                "retrieved_at": retrieved_at,
            }

        except urllib.error.HTTPError as e:
            return {
                "success": False,
                "data": [],
                "error": f"HTTP {e.code}: {e.reason}",
                "url": url,
                "retrieved_at": retrieved_at,
            }
        except urllib.error.URLError as e:
            return {
                "success": False,
                "data": [],
                "error": f"Connection failed: {str(e.reason)}",
                "url": url,
                "retrieved_at": retrieved_at,
            }
        except json.JSONDecodeError as e:
            return {
                "success": False,
                "data": [],
                "error": f"Invalid JSON response: {str(e)}",
                "url": url,
                "retrieved_at": retrieved_at,
            }
        except Exception as e:
            return {
                "success": False,
                "data": [],
                "error": f"Unexpected error: {str(e)}",
                "url": url,
                "retrieved_at": retrieved_at,
            }


# ============================================================
# DETERMINISTIC LOGIC — NO LLM
# ============================================================

@safe_traceable(name="market_data_normalization", run_type="chain")
def normalize_price(price_value, source_unit: str = "quintal") -> dict:
    """
    Deterministic price normalization.
    Converts price from source_unit to ₹/kg and ₹/tonne.

    Returns:
        dict with normalized_price_per_kg, normalized_price_per_tonne,
        or None values if conversion is not possible.
    """
    if price_value is None:
        return {"normalized_price_per_kg": None, "normalized_price_per_tonne": None}

    try:
        price = float(price_value)
    except (ValueError, TypeError):
        return {"normalized_price_per_kg": None, "normalized_price_per_tonne": None}

    unit_key = source_unit.lower().strip()
    if unit_key not in UNIT_CONVERSIONS_TO_KG:
        # Reject unsupported/ambiguous units
        return {"normalized_price_per_kg": None, "normalized_price_per_tonne": None}

    kg_per_unit = UNIT_CONVERSIONS_TO_KG[unit_key]
    price_per_kg = round(price / kg_per_unit, 2)
    price_per_tonne = round(price_per_kg * 1000, 2)

    return {
        "normalized_price_per_kg": price_per_kg,
        "normalized_price_per_tonne": price_per_tonne,
    }


@safe_traceable(name="freshness_evaluation", run_type="chain")
def evaluate_freshness(date_str: Optional[str], retrieval_time: datetime = None) -> str:
    """
    Deterministic freshness classification.

    Returns: CURRENT | HISTORICAL | STALE | UNAVAILABLE
    """
    if not date_str:
        return "UNAVAILABLE"

    if retrieval_time is None:
        retrieval_time = datetime.now(timezone.utc)

    try:
        # Try multiple date formats commonly seen in AGMARKNET data
        market_date = None
        for fmt in ("%d/%m/%Y", "%Y-%m-%d", "%d-%m-%Y", "%d %b %Y", "%Y-%m-%dT%H:%M:%S"):
            try:
                market_date = datetime.strptime(date_str.strip(), fmt)
                break
            except ValueError:
                continue

        if market_date is None:
            return "UNAVAILABLE"

        # Make timezone-aware if needed
        if market_date.tzinfo is None:
            market_date = market_date.replace(tzinfo=timezone.utc)
        if retrieval_time.tzinfo is None:
            retrieval_time = retrieval_time.replace(tzinfo=timezone.utc)

        age_days = (retrieval_time - market_date).days

        if age_days <= 1:
            return "CURRENT"
        elif age_days <= 3:
            return "HISTORICAL"
        elif age_days <= 7:
            return "STALE"
        else:
            return "UNAVAILABLE"

    except Exception:
        return "UNAVAILABLE"


@safe_traceable(name="revenue_calculation", run_type="chain")
def calculate_gross_revenue(quantity_t: Optional[float], price_per_tonne: Optional[float]) -> Optional[float]:
    """
    Deterministic gross revenue calculation.

    expected_gross_revenue = quantity_t × normalized_price_per_tonne

    Returns None if either input is missing. Never fabricates data.
    """
    if quantity_t is None or price_per_tonne is None:
        return None
    if quantity_t <= 0 or price_per_tonne <= 0:
        return None
    return round(quantity_t * price_per_tonne, 2)


def geo_to_state(lat: float, lon: float) -> Optional[str]:
    """
    Simple geographic lookup to estimate Indian state from coordinates.
    Returns the first matching state or None.
    """
    for lat_min, lat_max, lon_min, lon_max, state_name in COORD_TO_STATE:
        if lat_min <= lat <= lat_max and lon_min <= lon <= lon_max:
            return state_name
    return None


def haversine_distance_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Straight-line distance in km between two coordinates.
    NOTE: This is NOT road distance — that belongs to the Logistics Agent.
    """
    R = 6371.0
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2) ** 2)
    c = 2 * math.asin(math.sqrt(a))
    return round(R * c, 2)


# ============================================================
# MARKET INTELLIGENCE AGENT
# ============================================================

class MarketAgent:
    """
    KISAN GUARD Market Intelligence Agent.

    Stateless, independently callable agent that:
    1. Validates inputs
    2. Fetches real market evidence from AgMarket-API (agmarknet.gov.in)
    3. Normalizes prices deterministically (Python, not LLM)
    4. Evaluates data freshness
    5. Calculates gross revenue
    6. Uses Gemini LLM to interpret verified evidence and crop urgency
    7. Returns Pydantic-validated structured JSON
    8. Records LangSmith traces

    Does NOT:
    - Analyze crop images
    - Calculate crop vulnerability
    - Optimize transport routes
    - Assign trucks
    """

    def __init__(self):
        self.gemini_api_key = os.environ.get("GEMINI_API_KEY")
        self.gemini_client = None
        if self.gemini_api_key:
            try:
                # pyrefly: ignore [missing-import]
                from google import genai
                # pyrefly: ignore [missing-import]
                from google.genai import types
                self.gemini_client = genai.Client(api_key=self.gemini_api_key)
                self.genai_types = types
            except ImportError:
                print("WARNING: google-genai package not installed. LLM reasoning will be unavailable.")

        self.provider = AgMarketProvider()

    def assess_market(
        self,
        location: dict,
        crop: dict,
        crop_risk: Optional[dict] = None,
    ) -> str:
        """
        Main entrypoint. Accepts the same contract style as the Crop Agent.

        Args:
            location: {"latitude": float, "longitude": float}
            crop: {"name": str, "variety": str (optional), "quantity_t": float (optional)}
            crop_risk: Subset of Crop Vulnerability Agent output (optional).
                       If None, market analysis proceeds with lower confidence.

        Returns:
            Pydantic-validated JSON string (MarketAssessment).
        """
        @safe_traceable(name="assess_market", run_type="chain")
        def _traced_assess(loc, crp, risk_data):
            return self._run_assessment(loc, crp, risk_data)

        return _traced_assess(location, crop, crop_risk)

    def _run_assessment(self, location: dict, crop: dict, crop_risk: Optional[dict]) -> str:
        """Core assessment logic."""
        now = datetime.now(timezone.utc)

        # ── Step 1: Input Validation ──────────────────────────────
        @safe_traceable(name="input_validation", run_type="chain")
        def _validate_inputs(loc, crp, risk):
            errors = []
            if not loc or "latitude" not in loc or "longitude" not in loc:
                errors.append("Invalid location: latitude and longitude required.")
            if not crp or "name" not in crp:
                errors.append("Invalid crop: 'name' is required.")
            if errors:
                return None, None, None, errors

            try:
                loc_model = LocationInput(**loc)
            except Exception as e:
                errors.append(f"Location validation failed: {str(e)}")

            try:
                crp_model = CropInput(**crp)
            except Exception as e:
                errors.append(f"Crop validation failed: {str(e)}")

            risk_model = None
            if risk:
                try:
                    risk_model = CropRiskInput(**risk)
                except Exception as e:
                    # Crop risk is optional; if invalid, proceed without it
                    risk_model = None

            if errors:
                return None, None, None, errors

            return loc_model, crp_model, risk_model, []

        loc_model, crp_model, risk_model, validation_errors = _validate_inputs(location, crop, crop_risk)

        if validation_errors:
            return self._build_error_response(
                crop_name=crop.get("name", "unknown"),
                status="API_FAILURE",
                error_msg="; ".join(validation_errors),
                now=now,
            )

        commodity_name = crp_model.name.lower()

        # Check supported commodities
        if commodity_name not in SUPPORTED_COMMODITIES:
            return self._build_error_response(
                crop_name=crp_model.name,
                status="UNSUPPORTED_CROP",
                error_msg=f"Commodity '{crp_model.name}' is not supported. Supported: {', '.join(sorted(SUPPORTED_COMMODITIES))}",
                now=now,
            )

        # ── Step 2: Determine State from Location ─────────────────
        state = geo_to_state(loc_model.latitude, loc_model.longitude)
        if not state:
            # Fallback: try multiple nearby states
            state = "Uttar Pradesh"  # Default for demo; document this assumption

        # ── Step 3: Fetch Market Data ─────────────────────────────
        api_result = self.provider.fetch_market_data(
            commodity=commodity_name,
            state=state,
        )

        if not api_result["success"] or not api_result["data"]:
            # Try alternate nearby states if first fails
            alternate_states = self._get_nearby_states(loc_model.latitude, loc_model.longitude, exclude=state)
            for alt_state in alternate_states[:2]:
                api_result = self.provider.fetch_market_data(
                    commodity=commodity_name,
                    state=alt_state,
                )
                if api_result["success"] and api_result["data"]:
                    state = alt_state
                    break

        if not api_result["success"]:
            return self._build_error_response(
                crop_name=crp_model.name,
                status="API_FAILURE",
                error_msg=f"Market data fetch failed: {api_result.get('error', 'Unknown')}",
                now=now,
                api_url=api_result.get("url", ""),
            )

        raw_records = api_result["data"]
        if not raw_records:
            return self._build_error_response(
                crop_name=crp_model.name,
                status="NO_MARKET_DATA",
                error_msg=f"No market records found for {crp_model.name} in {state}.",
                now=now,
                api_url=api_result.get("url", ""),
            )

        # ── Step 4: Normalize & Validate Market Records ───────────
        market_options = self._process_market_records(raw_records, now, api_result["retrieved_at"])

        if not market_options:
            return self._build_error_response(
                crop_name=crp_model.name,
                status="NO_MARKET_DATA",
                error_msg="All fetched market records had invalid or missing price data.",
                now=now,
                api_url=api_result.get("url", ""),
            )

        # ── Step 5: Calculate Gross Revenue for each option ───────
        for opt in market_options:
            if opt.normalized_price_per_tonne and crp_model.quantity_t:
                opt_revenue = calculate_gross_revenue(crp_model.quantity_t, opt.normalized_price_per_tonne)
            else:
                opt_revenue = None

        # ── Step 6: Build Urgency Context ─────────────────────────
        urgency_context = self._build_urgency_context(risk_model)

        # ── Step 7: LLM Market Analysis ───────────────────────────
        @safe_traceable(name="llm_market_analysis", run_type="llm")
        def _run_llm_analysis(options, urgency, crp, risk):
            return self._llm_analyze_markets(options, urgency, crp, risk)

        llm_result = _run_llm_analysis(market_options, urgency_context, crp_model, risk_model)

        # ── Step 8: Determine Recommended Market & Revenue ────────
        recommended_market = llm_result.get("recommended_market")
        best_option = None
        if recommended_market:
            for opt in market_options:
                if opt.market_name.lower() == recommended_market.lower():
                    best_option = opt
                    break
        if not best_option and market_options:
            # Fallback: pick highest modal price
            best_option = max(
                [o for o in market_options if o.normalized_price_per_kg],
                key=lambda o: o.normalized_price_per_kg or 0,
                default=market_options[0]
            )
            recommended_market = best_option.market_name

        expected_gross_revenue = None
        if best_option and best_option.normalized_price_per_tonne:
            expected_gross_revenue = calculate_gross_revenue(
                crp_model.quantity_t, best_option.normalized_price_per_tonne
            )

        # ── Step 9: Calculate Confidence ──────────────────────────
        confidence = self._calculate_confidence(market_options, risk_model)

        # ── Step 10: Build Uncertainties ──────────────────────────
        uncertainties = self._build_uncertainties(market_options, risk_model, crp_model)

        # ── Step 11: Determine Status ─────────────────────────────
        stale_count = sum(1 for o in market_options if o.freshness in ("STALE", "UNAVAILABLE"))
        status = "SUCCESS"
        if stale_count == len(market_options):
            status = "PARTIAL_DATA"
        elif stale_count > len(market_options) // 2:
            status = "PARTIAL_DATA"

        # ── Step 12: Assemble & Validate Output ───────────────────
        data_quality = MarketDataQuality(
            provider="AgMarket-API (agmarknet.gov.in)",
            provider_status="AVAILABLE" if api_result["success"] else "DEGRADED",
            total_records_fetched=len(raw_records),
            valid_records=len(market_options),
            stale_records=stale_count,
            data_age_description=self._describe_data_age(market_options),
        )

        evidence = MarketEvidence(
            provider="AgMarket-API (agmarknet.gov.in)",
            api_url_used=api_result.get("url", ""),
            retrieved_at=api_result.get("retrieved_at", now.isoformat()),
            raw_record_count=len(raw_records),
            records=raw_records[:10],  # Preserve first 10 raw records for audit
        )

        @safe_traceable(name="pydantic_validation", run_type="parser")
        def _validate_output(assessment_dict):
            return MarketAssessment(**assessment_dict)

        assessment_dict = {
            "crop": crp_model.name,
            "quantity_t": crp_model.quantity_t,
            "market_options": [opt.model_dump() for opt in market_options],
            "recommended_market": recommended_market,
            "expected_gross_revenue": expected_gross_revenue,
            "recommendation": llm_result.get("recommendation", "Insufficient data for recommendation."),
            "confidence": confidence,
            "urgency_context": urgency_context,
            "uncertainties": uncertainties,
            "data_quality": data_quality.model_dump(),
            "evidence": evidence.model_dump(),
            "status": status,
            "generated_at": now.isoformat(),
        }

        try:
            final_validated = _validate_output(assessment_dict)
        except Exception as e:
            print(f"Pydantic validation failed: {e}")
            traceback.print_exc()
            # Return raw dict as JSON if validation fails
            return json.dumps(assessment_dict, indent=2, default=str)

        # ── Add LangSmith Metadata ────────────────────────────────
        add_run_metadata({
            "crop": crp_model.name,
            "state": state,
            "market_count": len(market_options),
            "recommended_market": recommended_market,
            "confidence": confidence,
            "status": status,
            "has_crop_risk": risk_model is not None,
        })

        return final_validated.model_dump_json(indent=2)

    # ────────────────────────────────────────────────────────────
    # INTERNAL HELPERS
    # ────────────────────────────────────────────────────────────

    @safe_traceable(name="market_data_validation", run_type="chain")
    def _process_market_records(
        self, raw_records: List[dict], now: datetime, retrieved_at: str
    ) -> List[MarketOption]:
        """
        Normalize, validate, and convert raw API records to MarketOption models.
        All price normalization is deterministic Python — NO LLM.
        """
        options = []

        for record in raw_records:
            try:
                # Extract fields from the API response (AgMarket-API format)
                market_name = (
                    record.get("market") or record.get("Market") or
                    record.get("market_name") or record.get("Market_Name") or "Unknown"
                )
                state = record.get("state") or record.get("State") or ""
                district = record.get("district") or record.get("District") or None
                commodity = record.get("commodity") or record.get("Commodity") or ""
                variety = record.get("variety") or record.get("Variety") or None

                # Price fields
                min_price = self._safe_float(
                    record.get("min_price") or record.get("Min_Price") or
                    record.get("min_x0020_price") or record.get("Min Price")
                )
                max_price = self._safe_float(
                    record.get("max_price") or record.get("Max_Price") or
                    record.get("max_x0020_price") or record.get("Max Price")
                )
                modal_price = self._safe_float(
                    record.get("modal_price") or record.get("Modal_Price") or
                    record.get("modal_x0020_price") or record.get("Modal Price")
                )

                # Date field
                arrival_date = (
                    record.get("arrival_date") or record.get("Arrival_Date") or
                    record.get("date") or record.get("Date") or None
                )

                # Skip records with no usable price
                if modal_price is None and min_price is None and max_price is None:
                    continue

                # Use modal_price as the primary price; fallback to average of min/max
                primary_price = modal_price
                if primary_price is None:
                    if min_price is not None and max_price is not None:
                        primary_price = (min_price + max_price) / 2
                    elif min_price is not None:
                        primary_price = min_price
                    elif max_price is not None:
                        primary_price = max_price

                # AGMARKNET prices are in ₹/quintal
                source_unit = "quintal"
                normalized = normalize_price(primary_price, source_unit)

                # Evaluate freshness
                freshness = evaluate_freshness(arrival_date, now)

                option = MarketOption(
                    market_name=market_name.strip(),
                    state=state.strip(),
                    district=district.strip() if district else None,
                    commodity=commodity.strip(),
                    variety=variety.strip() if variety else None,
                    min_price=min_price,
                    max_price=max_price,
                    modal_price=modal_price,
                    original_unit=source_unit,
                    normalized_price_per_kg=normalized["normalized_price_per_kg"],
                    normalized_price_per_tonne=normalized["normalized_price_per_tonne"],
                    arrival_date=arrival_date,
                    freshness=freshness,
                    source="agmarknet.gov.in",
                    retrieval_timestamp=retrieved_at,
                )
                options.append(option)

            except Exception as e:
                print(f"Skipping malformed record: {e}")
                continue

        # Sort by normalized price descending (best price first)
        options.sort(
            key=lambda o: o.normalized_price_per_kg or 0,
            reverse=True,
        )

        return options

    def _llm_analyze_markets(
        self,
        market_options: List[MarketOption],
        urgency_context: str,
        crop: CropInput,
        crop_risk: Optional[CropRiskInput],
    ) -> dict:
        """
        Use Gemini to interpret verified market evidence and crop urgency.
        The LLM does NOT invent data — it reasons over what we give it.
        """
        if not self.gemini_client:
            # Fallback: deterministic recommendation (no LLM)
            return self._deterministic_recommendation(market_options, urgency_context, crop)

        # Build concise market evidence summary for the LLM
        market_summary = []
        for i, opt in enumerate(market_options[:10], 1):  # Limit to top 10
            entry = (
                f"{i}. {opt.market_name} ({opt.state}): "
                f"Modal ₹{opt.modal_price}/{opt.original_unit}, "
                f"Normalized ₹{opt.normalized_price_per_kg}/kg, "
                f"Freshness: {opt.freshness}"
            )
            if opt.arrival_date:
                entry += f", Date: {opt.arrival_date}"
            market_summary.append(entry)

        markets_text = "\n".join(market_summary)

        # Build crop risk context
        risk_text = "No crop risk data available."
        if crop_risk:
            risk_text = (
                f"Crop State: {crop_risk.crop_state}\n"
                f"Risk Level: {crop_risk.risk.risk_level}\n"
                f"Spoilage Risk: {crop_risk.risk.spoilage_risk:.2f}\n"
                f"Harvest Urgency: {crop_risk.risk.harvest_urgency:.2f}\n"
                f"Action Window: {crop_risk.risk.recommended_action_window_hours} hours\n"
                f"Recommended Urgency: {crop_risk.risk.recommended_urgency}\n"
                f"Confidence: {crop_risk.confidence:.2f}\n"
                f"Evidence Consistency: {crop_risk.evidence_consistency}"
            )

        analyst_prompt = f"""You are the Market Intelligence Analyst for KISAN GUARD.

You have been given VERIFIED market data from agmarknet.gov.in (official Indian government source).
You must ONLY reason over the provided evidence. Do NOT invent any prices, mandi names, or market data.

CROP INFORMATION:
- Crop: {crop.name}
- Variety: {crop.variety or 'Not specified'}
- Quantity: {crop.quantity_t or 'Not specified'} tonnes

CROP RISK CONTEXT (from Crop Vulnerability Agent):
{risk_text}

URGENCY CONTEXT:
{urgency_context}

VERIFIED MARKET OPTIONS (from agmarknet.gov.in):
{markets_text}

YOUR TASK:
1. Compare the verified market options considering price, data freshness, and crop urgency.
2. If the crop has high spoilage risk or short action window, factor that into your recommendation.
3. Recommend the most favorable market, explaining your reasoning.
4. Note any uncertainties (stale data, missing prices, etc.).

RESPOND IN THIS EXACT JSON FORMAT:
{{
    "recommended_market": "<market name>",
    "recommendation": "<2-4 sentence explanation of why this market is recommended, considering price, freshness, and urgency>",
    "key_factors": ["<factor 1>", "<factor 2>"]
}}

Be concise. Do not invent data not present in the evidence above."""

        try:
            @safe_traceable(name="gemini_market_analyst_call", run_type="llm")
            def _call_gemini(prompt):
                for attempt in range(2):
                    try:
                        response = self.gemini_client.models.generate_content(
                            model='gemini-2.5-flash',
                            contents=prompt,
                            config=self.genai_types.GenerateContentConfig(
                                response_mime_type="application/json",
                                temperature=0.3,
                            )
                        )
                        return response
                    except Exception as inner_e:
                        if attempt == 0 and "503" in str(inner_e):
                            print("Gemini 503, retrying in 2 seconds...")
                            time.sleep(2)
                        else:
                            raise inner_e

            response = _call_gemini(analyst_prompt)
            result_text = response.text if hasattr(response, 'text') else str(response)

            # Parse the JSON response
            try:
                result = json.loads(result_text)
                return {
                    "recommended_market": result.get("recommended_market", ""),
                    "recommendation": result.get("recommendation", ""),
                    "key_factors": result.get("key_factors", []),
                }
            except json.JSONDecodeError:
                # If JSON parsing fails, use the raw text as recommendation
                return {
                    "recommended_market": market_options[0].market_name if market_options else "",
                    "recommendation": result_text[:500],
                    "key_factors": [],
                }

        except Exception as e:
            print(f"LLM Market Analysis failed: {e}")
            return self._deterministic_recommendation(market_options, urgency_context, crop)

    def _deterministic_recommendation(
        self,
        market_options: List[MarketOption],
        urgency_context: str,
        crop: CropInput,
    ) -> dict:
        """Fallback deterministic recommendation when LLM is unavailable."""
        if not market_options:
            return {
                "recommended_market": "",
                "recommendation": "No market data available for recommendation.",
                "key_factors": [],
            }

        # Prefer current data with best price
        current_options = [o for o in market_options if o.freshness == "CURRENT"]
        if current_options:
            best = max(current_options, key=lambda o: o.normalized_price_per_kg or 0)
        else:
            # Fall back to best price regardless of freshness
            best = max(market_options, key=lambda o: o.normalized_price_per_kg or 0)

        revenue_text = ""
        if crop.quantity_t and best.normalized_price_per_tonne:
            rev = calculate_gross_revenue(crop.quantity_t, best.normalized_price_per_tonne)
            if rev:
                revenue_text = f" Expected gross revenue: Rs. {rev:,.0f}."

        recommendation = (
            f"{best.market_name} offers the best available price at "
            f"Rs. {best.normalized_price_per_kg}/kg (Rs. {best.modal_price}/{best.original_unit}). "
            f"Data freshness: {best.freshness}.{revenue_text} {urgency_context}"
        )

        return {
            "recommended_market": best.market_name,
            "recommendation": recommendation.strip(),
            "key_factors": ["Best verified price", f"Data freshness: {best.freshness}"],
        }

    def _build_urgency_context(self, risk_model: Optional[CropRiskInput]) -> str:
        """Build human-readable urgency context from Crop Agent risk data."""
        if risk_model is None:
            return "No crop risk data provided. Market recommendation is based solely on market evidence."

        urgency = risk_model.risk.recommended_urgency
        window = risk_model.risk.recommended_action_window_hours
        spoilage = risk_model.risk.spoilage_risk

        if urgency == "URGENT_MOVEMENT":
            return (
                f"URGENT: Crop requires immediate market movement. "
                f"Spoilage risk is {spoilage:.0%} with only {window} hours action window. "
                f"Prioritize markets with fresh, verified data."
            )
        elif urgency == "MOVE_TO_MARKET_SOON":
            return (
                f"Crop should move to market soon. Spoilage risk: {spoilage:.0%}, "
                f"action window: {window} hours. Fresh market data is preferred."
            )
        elif urgency == "PREPARE_FOR_HARVEST":
            return (
                f"Crop is preparing for harvest. Spoilage risk: {spoilage:.0%}, "
                f"action window: {window} hours. Market comparison is important."
            )
        elif urgency == "PROTECT_AND_STORE":
            return (
                f"Crop needs protection/storage. Spoilage risk: {spoilage:.0%}. "
                f"Market timing is less urgent; focus on best price."
            )
        else:
            return (
                f"Normal urgency. Spoilage risk: {spoilage:.0%}, "
                f"action window: {window} hours. Focus on best market value."
            )

    def _calculate_confidence(
        self, market_options: List[MarketOption], risk_model: Optional[CropRiskInput]
    ) -> float:
        """
        Calculate overall confidence based on market data quality and crop risk context.
        This is deterministic — NOT LLM-generated.
        """
        if not market_options:
            return 0.1

        base = 0.5

        # Factor 1: Data freshness
        current_count = sum(1 for o in market_options if o.freshness == "CURRENT")
        freshness_ratio = current_count / len(market_options)
        base += freshness_ratio * 0.2

        # Factor 2: Number of markets (more data = more confidence)
        if len(market_options) >= 5:
            base += 0.1
        elif len(market_options) >= 3:
            base += 0.05

        # Factor 3: Price completeness
        priced = sum(1 for o in market_options if o.normalized_price_per_kg is not None)
        if priced == len(market_options):
            base += 0.1
        elif priced > 0:
            base += 0.05

        # Factor 4: Crop risk context
        if risk_model:
            if risk_model.evidence_consistency == "CONSISTENT":
                base += 0.05
            elif risk_model.evidence_consistency == "CONFLICTING":
                base -= 0.1
            # Blend with crop agent confidence
            base = base * 0.7 + risk_model.confidence * 0.3
        else:
            base -= 0.1  # Penalty for missing crop context

        return round(max(0.1, min(0.95, base)), 2)

    def _build_uncertainties(
        self,
        market_options: List[MarketOption],
        risk_model: Optional[CropRiskInput],
        crop: CropInput,
    ) -> List[str]:
        """Build list of explicit uncertainty factors."""
        uncertainties = []

        # Data staleness
        stale = [o for o in market_options if o.freshness in ("STALE", "UNAVAILABLE")]
        if stale:
            uncertainties.append(
                f"{len(stale)} of {len(market_options)} market records have stale or unavailable dates."
            )

        # Missing crop risk
        if risk_model is None:
            uncertainties.append(
                "No crop vulnerability data provided. Market recommendation lacks urgency context."
            )

        # Conflicting crop evidence
        if risk_model and risk_model.evidence_consistency == "CONFLICTING":
            uncertainties.append(
                "Crop vulnerability evidence is CONFLICTING. Market recommendation confidence is reduced."
            )

        # Missing quantity
        if crop.quantity_t is None:
            uncertainties.append(
                "Crop quantity not provided. Gross revenue cannot be calculated."
            )

        # Geographic approximation
        uncertainties.append(
            "Market distance is estimated by geographic proximity, not actual road distance. "
            "Actual transport feasibility belongs to the Logistics Agent."
        )

        return uncertainties

    def _describe_data_age(self, market_options: List[MarketOption]) -> str:
        """Summarize the age distribution of market data."""
        freshness_counts = {}
        for o in market_options:
            freshness_counts[o.freshness] = freshness_counts.get(o.freshness, 0) + 1
        parts = [f"{count} {status.lower()}" for status, count in freshness_counts.items()]
        return ", ".join(parts) if parts else "No data"

    def _get_nearby_states(self, lat: float, lon: float, exclude: str = None) -> List[str]:
        """Get nearby states for fallback market data fetching."""
        nearby = []
        for lat_min, lat_max, lon_min, lon_max, state_name in COORD_TO_STATE:
            if state_name == exclude:
                continue
            center_lat = (lat_min + lat_max) / 2
            center_lon = (lon_min + lon_max) / 2
            dist = haversine_distance_km(lat, lon, center_lat, center_lon)
            nearby.append((dist, state_name))
        nearby.sort()
        return [s for _, s in nearby[:5]]

    def _build_error_response(
        self,
        crop_name: str,
        status: str,
        error_msg: str,
        now: datetime,
        api_url: str = "",
    ) -> str:
        """Build a structured error/unavailable response."""
        assessment = MarketAssessment(
            crop=crop_name,
            quantity_t=None,
            market_options=[],
            recommended_market=None,
            expected_gross_revenue=None,
            recommendation=error_msg,
            confidence=0.1,
            urgency_context="Unable to determine urgency due to data unavailability.",
            uncertainties=[error_msg],
            data_quality=MarketDataQuality(
                provider="AgMarket-API (agmarknet.gov.in)",
                provider_status="UNAVAILABLE",
                total_records_fetched=0,
                valid_records=0,
                stale_records=0,
            ),
            evidence=MarketEvidence(
                provider="AgMarket-API (agmarknet.gov.in)",
                api_url_used=api_url,
                retrieved_at=now.isoformat(),
                raw_record_count=0,
            ),
            status=status,
            generated_at=now.isoformat(),
        )
        return assessment.model_dump_json(indent=2)

    @staticmethod
    def _safe_float(val) -> Optional[float]:
        """Safely convert a value to float."""
        if val is None:
            return None
        try:
            f = float(str(val).replace(",", "").strip())
            return f if f >= 0 else None
        except (ValueError, TypeError):
            return None


# ============================================================
# EXAMPLE USAGE
# ============================================================

if __name__ == "__main__":
    import sys

    print("=" * 60)
    print("KISAN GUARD — Market Intelligence Agent")
    print("=" * 60)

    agent = MarketAgent()

    # Example: Tomato in Haryana with high spoilage risk
    result = agent.assess_market(
        location={"latitude": 28.4744, "longitude": 77.5040},
        crop={
            "name": "tomato",
            "variety": "hybrid",
            "quantity_t": 2.0,
        },
        crop_risk={
            "crop_state": "HARVEST_READY",
            "risk": {
                "vulnerability_score": 0.78,
                "risk_level": "HIGH",
                "spoilage_risk": 0.85,
                "harvest_urgency": 0.90,
                "recommended_action_window_hours": 12,
                "recommended_urgency": "URGENT_MOVEMENT",
            },
            "confidence": 0.91,
            "evidence_consistency": "CONSISTENT",
        },
    )

    print(result)
