"""
KISAN GUARD — Market Intelligence Agent FastAPI Service
========================================================
Exposes REST endpoints for market discovery, price evaluation,
and intelligence integration.
"""

import json
from typing import Optional, List
from fastapi import FastAPI, APIRouter, HTTPException, Query
from pydantic import BaseModel

from market.market_agent import (
    MarketAgent,
    MarketAssessment,
    LocationInput,
    CropInput,
    CropRiskInput,
    SUPPORTED_COMMODITIES,
)

# ------------------------------------------------------------
# FASTAPI ROUTER (for embedding or standalone)
# ------------------------------------------------------------
router = APIRouter(prefix="/market", tags=["Market Intelligence"])
agent = MarketAgent()


class AssessMarketPayload(BaseModel):
    location: LocationInput
    crop: CropInput
    crop_risk: Optional[CropRiskInput] = None


@router.get("/health")
def market_health():
    """Health check endpoint for Market Intelligence Agent."""
    return {
        "status": "ok",
        "service": "KISAN GUARD Market Intelligence Agent",
        "supported_commodities_count": len(SUPPORTED_COMMODITIES),
    }


@router.get("/commodities")
def list_commodities() -> List[str]:
    """Returns the list of supported agricultural commodities."""
    return sorted(list(SUPPORTED_COMMODITIES))


@router.post("/assess", response_model=MarketAssessment)
def assess_market_endpoint(payload: AssessMarketPayload):
    """
    Evaluate market opportunities for a given crop, quantity, location,
    and optional upstream Crop Vulnerability risk context.
    """
    try:
        raw_result = agent.assess_market(
            location=payload.location.model_dump(),
            crop=payload.crop.model_dump(),
            crop_risk=payload.crop_risk.model_dump() if payload.crop_risk else None,
        )
        data = json.loads(raw_result)
        return data
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Market assessment error: {str(exc)}")


# ------------------------------------------------------------
# STANDALONE FASTAPI APP
# ------------------------------------------------------------
app = FastAPI(
    title="KISAN GUARD — Market Intelligence API",
    description="Market Intelligence Agent service for farm-to-mandi price discovery and recommendations.",
    version="1.0.0",
)

app.include_router(router)

@app.get("/")
def root():
    return {
        "message": "KISAN GUARD Market Intelligence API is running.",
        "docs": "/docs",
        "endpoints": {
            "assess": "POST /market/assess",
            "commodities": "GET /market/commodities",
            "health": "GET /market/health",
        }
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("market.api:app", host="0.0.0.0", port=8001, reload=True)
