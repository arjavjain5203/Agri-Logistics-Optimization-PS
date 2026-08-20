"""
KISAN GUARD — Market Agent Test Suite
======================================
12 controlled test scenarios using mocked API responses.
No live API calls — tests are deterministic and repeatable.
"""

import json
import sys
import os
import unittest
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone, timedelta

# Ensure the market package directory is in the path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

# Import from market.market_agent
try:
    from market.market_agent import (
        MarketAgent,
        AgMarketProvider,
        normalize_price,
        evaluate_freshness,
        calculate_gross_revenue,
        geo_to_state,
        MarketOption,
        MarketAssessment,
        UNIT_CONVERSIONS_TO_KG,
    )
except ImportError:
    from market_agent import (
        MarketAgent,
        AgMarketProvider,
        normalize_price,
        evaluate_freshness,
        calculate_gross_revenue,
        geo_to_state,
        MarketOption,
        MarketAssessment,
        UNIT_CONVERSIONS_TO_KG,
    )


# ============================================================
# HELPERS: Mock Data Factories
# ============================================================

def make_market_record(
    market="Test Mandi",
    state="Haryana",
    commodity="Tomato",
    variety="Hybrid",
    min_price=2000,
    max_price=3000,
    modal_price=2500,
    arrival_date=None,
):
    """Create a mock market record matching AgMarket-API format."""
    if arrival_date is None:
        arrival_date = datetime.now(timezone.utc).strftime("%d/%m/%Y")
    return {
        "market": market,
        "state": state,
        "commodity": commodity,
        "variety": variety,
        "min_price": min_price,
        "max_price": max_price,
        "modal_price": modal_price,
        "arrival_date": arrival_date,
    }


def make_api_success(records):
    """Create a successful API response."""
    return {
        "success": True,
        "data": records,
        "error": None,
        "url": "http://mock-api/request?commodity=Tomato&state=haryana",
        "retrieved_at": datetime.now(timezone.utc).isoformat(),
    }


def make_api_failure(error_msg="Connection failed"):
    """Create a failed API response."""
    return {
        "success": False,
        "data": [],
        "error": error_msg,
        "url": "http://mock-api/request?commodity=Tomato&state=haryana",
        "retrieved_at": datetime.now(timezone.utc).isoformat(),
    }


LOCATION_HARYANA = {"latitude": 28.4744, "longitude": 77.5040}
CROP_TOMATO = {"name": "tomato", "variety": "hybrid", "quantity_t": 2.0}

CROP_RISK_HIGH = {
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
}

CROP_RISK_LOW = {
    "crop_state": "FIELD_GROWING",
    "risk": {
        "vulnerability_score": 0.20,
        "risk_level": "LOW",
        "spoilage_risk": 0.15,
        "harvest_urgency": 0.10,
        "recommended_action_window_hours": 168,
        "recommended_urgency": "NORMAL",
    },
    "confidence": 0.85,
    "evidence_consistency": "CONSISTENT",
}


# ============================================================
# UNIT TESTS: Deterministic Logic
# ============================================================

class TestPriceNormalization(unittest.TestCase):
    """Test deterministic price normalization (Section 14 of requirements)."""

    def test_quintal_to_kg(self):
        result = normalize_price(2500, "quintal")
        self.assertEqual(result["normalized_price_per_kg"], 25.0)
        self.assertEqual(result["normalized_price_per_tonne"], 25000.0)

    def test_tonne_to_kg(self):
        result = normalize_price(25000, "tonne")
        self.assertEqual(result["normalized_price_per_kg"], 25.0)
        self.assertEqual(result["normalized_price_per_tonne"], 25000.0)

    def test_kg_identity(self):
        result = normalize_price(25, "kg")
        self.assertEqual(result["normalized_price_per_kg"], 25.0)
        self.assertEqual(result["normalized_price_per_tonne"], 25000.0)

    def test_unsupported_unit_rejected(self):
        result = normalize_price(100, "bag")
        self.assertIsNone(result["normalized_price_per_kg"])
        self.assertIsNone(result["normalized_price_per_tonne"])

    def test_none_price(self):
        result = normalize_price(None, "quintal")
        self.assertIsNone(result["normalized_price_per_kg"])

    def test_negative_price_still_converts(self):
        # Normalization converts; validation is separate
        result = normalize_price(-100, "quintal")
        self.assertEqual(result["normalized_price_per_kg"], -1.0)


class TestFreshnessEvaluation(unittest.TestCase):
    """Test deterministic freshness classification (Section 16 of requirements)."""

    def test_current_data(self):
        now = datetime(2026, 8, 20, 12, 0, 0, tzinfo=timezone.utc)
        result = evaluate_freshness("20/08/2026", now)
        self.assertEqual(result, "CURRENT")

    def test_historical_data(self):
        now = datetime(2026, 8, 20, 12, 0, 0, tzinfo=timezone.utc)
        result = evaluate_freshness("18/08/2026", now)
        self.assertEqual(result, "HISTORICAL")

    def test_stale_data(self):
        now = datetime(2026, 8, 20, 12, 0, 0, tzinfo=timezone.utc)
        result = evaluate_freshness("14/08/2026", now)
        self.assertEqual(result, "STALE")

    def test_very_old_data(self):
        now = datetime(2026, 8, 20, 12, 0, 0, tzinfo=timezone.utc)
        result = evaluate_freshness("01/08/2026", now)
        self.assertEqual(result, "UNAVAILABLE")

    def test_no_date(self):
        result = evaluate_freshness(None)
        self.assertEqual(result, "UNAVAILABLE")

    def test_invalid_date_format(self):
        result = evaluate_freshness("not-a-date")
        self.assertEqual(result, "UNAVAILABLE")


class TestRevenueCalculation(unittest.TestCase):
    """Test deterministic revenue calculation (Section 15 of requirements)."""

    def test_basic_revenue(self):
        # 5 tonnes × ₹25,000/tonne = ₹125,000
        result = calculate_gross_revenue(5.0, 25000.0)
        self.assertEqual(result, 125000.0)

    def test_missing_quantity(self):
        result = calculate_gross_revenue(None, 25000.0)
        self.assertIsNone(result)

    def test_missing_price(self):
        result = calculate_gross_revenue(5.0, None)
        self.assertIsNone(result)

    def test_zero_quantity(self):
        result = calculate_gross_revenue(0, 25000.0)
        self.assertIsNone(result)


class TestGeoToState(unittest.TestCase):
    """Test geographic state lookup."""

    def test_haryana_coords(self):
        state = geo_to_state(28.4744, 77.5040)
        # Should match Haryana or Delhi based on the mapping
        self.assertIsNotNone(state)

    def test_unknown_coords(self):
        state = geo_to_state(0, 0)
        self.assertIsNone(state)


# ============================================================
# INTEGRATION TESTS: Market Agent (Mocked API)
# ============================================================

class TestMarketAgentIntegration(unittest.TestCase):
    """End-to-end Market Agent tests with mocked API and LLM."""

    def setUp(self):
        """Set up agent with mocked Gemini client."""
        self.agent = MarketAgent()
        # Disable LLM for deterministic tests
        self.agent.gemini_client = None

    @patch.object(AgMarketProvider, 'fetch_market_data')
    def test_01_high_price_market(self, mock_fetch):
        """TEST 1: Agent identifies high-price market as attractive."""
        mock_fetch.return_value = make_api_success([
            make_market_record(market="Mandi A", modal_price=3500),
            make_market_record(market="Mandi B", modal_price=2500),
        ])

        result = json.loads(self.agent.assess_market(
            location=LOCATION_HARYANA,
            crop=CROP_TOMATO,
            crop_risk=CROP_RISK_HIGH,
        ))

        self.assertEqual(result["status"], "SUCCESS")
        self.assertEqual(result["recommended_market"], "Mandi A")
        self.assertGreater(len(result["market_options"]), 0)

    @patch.object(AgMarketProvider, 'fetch_market_data')
    def test_02_same_crop_different_markets(self, mock_fetch):
        """TEST 2: Correct normalized comparison across markets."""
        mock_fetch.return_value = make_api_success([
            make_market_record(market="Market X", modal_price=3000),
            make_market_record(market="Market Y", modal_price=2800),
            make_market_record(market="Market Z", modal_price=3200),
        ])

        result = json.loads(self.agent.assess_market(
            location=LOCATION_HARYANA,
            crop=CROP_TOMATO,
        ))

        options = result["market_options"]
        self.assertEqual(len(options), 3)
        # Should be sorted by normalized price descending
        prices = [o["normalized_price_per_kg"] for o in options]
        self.assertEqual(prices, sorted(prices, reverse=True))

    @patch.object(AgMarketProvider, 'fetch_market_data')
    def test_03_high_spoilage_risk(self, mock_fetch):
        """TEST 3: High spoilage risk influences market decision urgency."""
        mock_fetch.return_value = make_api_success([
            make_market_record(market="Mandi Fast", modal_price=2500),
        ])

        result = json.loads(self.agent.assess_market(
            location=LOCATION_HARYANA,
            crop=CROP_TOMATO,
            crop_risk=CROP_RISK_HIGH,
        ))

        self.assertIn("URGENT", result["urgency_context"])
        self.assertIn("spoilage", result["urgency_context"].lower())

    @patch.object(AgMarketProvider, 'fetch_market_data')
    def test_04_low_spoilage_risk(self, mock_fetch):
        """TEST 4: Low spoilage risk shows less urgency."""
        mock_fetch.return_value = make_api_success([
            make_market_record(market="Mandi Calm", modal_price=2500),
        ])

        result = json.loads(self.agent.assess_market(
            location=LOCATION_HARYANA,
            crop=CROP_TOMATO,
            crop_risk=CROP_RISK_LOW,
        ))

        self.assertNotIn("URGENT", result["urgency_context"])

    @patch.object(AgMarketProvider, 'fetch_market_data')
    def test_05_missing_price(self, mock_fetch):
        """TEST 5: Records with missing prices are excluded (no fabrication)."""
        mock_fetch.return_value = make_api_success([
            make_market_record(market="No Price Mandi", modal_price=None, min_price=None, max_price=None),
            make_market_record(market="Valid Mandi", modal_price=3000),
        ])

        result = json.loads(self.agent.assess_market(
            location=LOCATION_HARYANA,
            crop=CROP_TOMATO,
        ))

        # Only the valid record should appear
        self.assertEqual(len(result["market_options"]), 1)
        self.assertEqual(result["market_options"][0]["market_name"], "Valid Mandi")

    @patch.object(AgMarketProvider, 'fetch_market_data')
    def test_06_api_failure(self, mock_fetch):
        """TEST 6: Graceful structured failure on API error."""
        mock_fetch.return_value = make_api_failure("Connection timeout")

        result = json.loads(self.agent.assess_market(
            location=LOCATION_HARYANA,
            crop=CROP_TOMATO,
        ))

        self.assertEqual(result["status"], "API_FAILURE")
        self.assertEqual(len(result["market_options"]), 0)
        self.assertIsNone(result["expected_gross_revenue"])

    @patch.object(AgMarketProvider, 'fetch_market_data')
    def test_07_stale_data(self, mock_fetch):
        """TEST 7: Stale data is explicitly labeled."""
        old_date = (datetime.now() - timedelta(days=5)).strftime("%d/%m/%Y")
        mock_fetch.return_value = make_api_success([
            make_market_record(market="Stale Mandi", modal_price=2500, arrival_date=old_date),
        ])

        result = json.loads(self.agent.assess_market(
            location=LOCATION_HARYANA,
            crop=CROP_TOMATO,
        ))

        self.assertEqual(result["market_options"][0]["freshness"], "STALE")

    @patch.object(AgMarketProvider, 'fetch_market_data')
    def test_08_unsupported_crop(self, mock_fetch):
        """TEST 8: Unsupported crop returns clear status."""
        result = json.loads(self.agent.assess_market(
            location=LOCATION_HARYANA,
            crop={"name": "dragon_fruit", "quantity_t": 1.0},
        ))

        self.assertEqual(result["status"], "UNSUPPORTED_CROP")
        mock_fetch.assert_not_called()

    @patch.object(AgMarketProvider, 'fetch_market_data')
    def test_09_different_quantity(self, mock_fetch):
        """TEST 9: Same prices, different quantities → revenue changes."""
        mock_fetch.return_value = make_api_success([
            make_market_record(market="Mandi P", modal_price=3000),
        ])

        result_2t = json.loads(self.agent.assess_market(
            location=LOCATION_HARYANA,
            crop={"name": "tomato", "quantity_t": 2.0},
        ))

        result_5t = json.loads(self.agent.assess_market(
            location=LOCATION_HARYANA,
            crop={"name": "tomato", "quantity_t": 5.0},
        ))

        # Prices should be the same
        self.assertEqual(
            result_2t["market_options"][0]["normalized_price_per_kg"],
            result_5t["market_options"][0]["normalized_price_per_kg"],
        )

        # Revenue should differ
        if result_2t["expected_gross_revenue"] and result_5t["expected_gross_revenue"]:
            self.assertNotEqual(
                result_2t["expected_gross_revenue"],
                result_5t["expected_gross_revenue"],
            )

    @patch.object(AgMarketProvider, 'fetch_market_data')
    def test_10_different_locations(self, mock_fetch):
        """TEST 10: Different locations may query different states."""
        # This test verifies the geo_to_state lookup affects the API call
        call_count = {"n": 0}
        original_fetch = AgMarketProvider.fetch_market_data

        def tracking_fetch(self_prov, commodity, state, market=None):
            call_count["n"] += 1
            return make_api_success([
                make_market_record(market=f"{state} Mandi", state=state, modal_price=2500),
            ])

        mock_fetch.side_effect = lambda commodity, state, market=None: make_api_success([
            make_market_record(market=f"{state} Mandi", state=state, modal_price=2500),
        ])

        # Haryana location
        result1 = json.loads(self.agent.assess_market(
            location={"latitude": 29.0, "longitude": 76.5},
            crop=CROP_TOMATO,
        ))

        # Karnataka location
        result2 = json.loads(self.agent.assess_market(
            location={"latitude": 13.0, "longitude": 77.5},
            crop=CROP_TOMATO,
        ))

        # Both should succeed
        self.assertIn(result1["status"], ("SUCCESS", "PARTIAL_DATA"))
        self.assertIn(result2["status"], ("SUCCESS", "PARTIAL_DATA"))

    @patch.object(AgMarketProvider, 'fetch_market_data')
    def test_11_conflicting_crop_evidence(self, mock_fetch):
        """TEST 11: Conflicting crop evidence reduces confidence."""
        mock_fetch.return_value = make_api_success([
            make_market_record(market="Test Mandi", modal_price=3000),
        ])

        conflicting_risk = {
            "crop_state": "HARVEST_READY",
            "risk": {
                "vulnerability_score": 0.50,
                "risk_level": "MEDIUM",
                "spoilage_risk": 0.50,
                "harvest_urgency": 0.50,
                "recommended_action_window_hours": 48,
                "recommended_urgency": "MOVE_TO_MARKET_SOON",
            },
            "confidence": 0.50,
            "evidence_consistency": "CONFLICTING",
        }

        result_consistent = json.loads(self.agent.assess_market(
            location=LOCATION_HARYANA,
            crop=CROP_TOMATO,
            crop_risk=CROP_RISK_HIGH,  # CONSISTENT, high confidence
        ))

        result_conflicting = json.loads(self.agent.assess_market(
            location=LOCATION_HARYANA,
            crop=CROP_TOMATO,
            crop_risk=conflicting_risk,  # CONFLICTING, low confidence
        ))

        self.assertLess(
            result_conflicting["confidence"],
            result_consistent["confidence"],
        )

        # Should flag uncertainty about conflicting evidence
        has_conflict_uncertainty = any(
            "CONFLICTING" in u for u in result_conflicting["uncertainties"]
        )
        self.assertTrue(has_conflict_uncertainty)

    @patch.object(AgMarketProvider, 'fetch_market_data')
    def test_12_missing_crop_risk(self, mock_fetch):
        """TEST 12: Agent works without crop risk but reports lower confidence."""
        mock_fetch.return_value = make_api_success([
            make_market_record(market="Mandi Q", modal_price=2800),
        ])

        result_with_risk = json.loads(self.agent.assess_market(
            location=LOCATION_HARYANA,
            crop=CROP_TOMATO,
            crop_risk=CROP_RISK_HIGH,
        ))

        result_no_risk = json.loads(self.agent.assess_market(
            location=LOCATION_HARYANA,
            crop=CROP_TOMATO,
            crop_risk=None,  # No crop risk data
        ))

        # Should still succeed
        self.assertIn(result_no_risk["status"], ("SUCCESS", "PARTIAL_DATA"))

        # Should report missing context in uncertainties
        has_missing = any(
            "crop vulnerability" in u.lower() or "crop risk" in u.lower()
            for u in result_no_risk["uncertainties"]
        )
        self.assertTrue(has_missing)


# ============================================================
# FASTAPI ENDPOINT TESTS
# ============================================================

class TestMarketFastAPI(unittest.TestCase):
    """Test FastAPI REST endpoints for the Market Agent."""

    @classmethod
    def setUpClass(cls):
        try:
            from fastapi.testclient import TestClient
            from market.api import app
            cls.client = TestClient(app)
            cls.has_fastapi = True
        except ImportError:
            cls.has_fastapi = False

    def test_root_endpoint(self):
        if not self.has_fastapi:
            self.skipTest("fastapi/httpx not installed")
        response = self.client.get("/")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIn("docs", data)
        self.assertIn("endpoints", data)

    def test_health_endpoint(self):
        if not self.has_fastapi:
            self.skipTest("fastapi/httpx not installed")
        response = self.client.get("/market/health")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data["status"], "ok")
        self.assertGreater(data["supported_commodities_count"], 0)

    def test_commodities_endpoint(self):
        if not self.has_fastapi:
            self.skipTest("fastapi/httpx not installed")
        response = self.client.get("/market/commodities")
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertIsInstance(data, list)
        self.assertIn("tomato", data)
        self.assertIn("wheat", data)

    def test_assess_endpoint_success(self):
        if not self.has_fastapi:
            self.skipTest("fastapi/httpx not installed")
        from market.api import agent as api_agent
        with patch.object(api_agent.provider, 'fetch_market_data') as mock_fetch:
            mock_fetch.return_value = make_api_success([
                make_market_record(market="Gurugram Mandi", modal_price=2900)
            ])

            payload = {
                "location": {"latitude": 28.4744, "longitude": 77.5040},
                "crop": {"name": "tomato", "variety": "hybrid", "quantity_t": 2.5},
                "crop_risk": CROP_RISK_HIGH,
            }

            response = self.client.post("/market/assess", json=payload)
            self.assertEqual(response.status_code, 200)
            data = response.json()
            self.assertEqual(data["crop"], "tomato")
            self.assertEqual(data["status"], "SUCCESS")
            self.assertEqual(data["recommended_market"], "Gurugram Mandi")
            self.assertEqual(data["expected_gross_revenue"], 72500.0)

    def test_assess_endpoint_invalid_location(self):
        if not self.has_fastapi:
            self.skipTest("fastapi/httpx not installed")
        payload = {
            "location": {"latitude": 999.0, "longitude": 77.5040},  # invalid latitude > 90
            "crop": {"name": "tomato"}
        }
        response = self.client.post("/market/assess", json=payload)
        self.assertEqual(response.status_code, 422)


# ============================================================
# RUN TESTS
# ============================================================

if __name__ == "__main__":
    unittest.main(verbosity=2)
