"""
Demands/Procurement Requests API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.db.database import get_db
from app.models.demand import Demand
from app.models.buyer import Buyer
from app.schemas.demand import DemandResponse, DemandCreate

router = APIRouter()


@router.get("/", response_model=List[DemandResponse])
def get_demands(
    buyer_id: Optional[str] = Query(None, description="Filter by buyer ID"),
    status: Optional[str] = Query(None, description="Filter by status"),
    crop_id: Optional[str] = Query(None, description="Filter by crop"),
    db: Session = Depends(get_db)
):
    """
    Get all demands with optional filters
    Used by buyer dashboard and farmer demand view
    """
    query = db.query(Demand)
    
    if buyer_id:
        query = query.filter(Demand.buyer_id == buyer_id)
    
    if status:
        query = query.filter(Demand.status == status)
    
    if crop_id:
        query = query.filter(Demand.crop_id == crop_id)
    
    demands = query.order_by(Demand.created_at.desc()).all()
    return demands


@router.get("/{demand_id}", response_model=DemandResponse)
def get_demand(demand_id: str, db: Session = Depends(get_db)):
    """Get a single demand by ID"""
    demand = db.query(Demand).filter(Demand.id == demand_id).first()
    if not demand:
        raise HTTPException(status_code=404, detail="Demand not found")
    return demand


@router.post("/", response_model=dict, status_code=201)
def create_demand(demand: DemandCreate, db: Session = Depends(get_db)):
    """
    Create a new procurement demand
    This is called when buyer creates a procurement request
    """
    # Verify buyer exists
    buyer = db.query(Buyer).filter(Buyer.id == demand.buyer_id).first()
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    
    # Generate demand ID
    from datetime import datetime
    demand_id = f"DEM-{datetime.now().strftime('%y%m%d%H%M%S')}"
    
    # Create demand
    db_demand = Demand(
        id=demand_id,
        **demand.model_dump(),
        status="pending"
    )
    
    db.add(db_demand)
    db.commit()
    db.refresh(db_demand)
    
    return {
        "success": True,
        "demand_id": demand_id,
        "data": {
            "id": db_demand.id,
            "buyer_id": db_demand.buyer_id,
            "crop_name": db_demand.crop_name,
            "quantity_kg": db_demand.quantity_kg,
            "status": db_demand.status,
            "created_at": db_demand.created_at.isoformat()
        }
    }


@router.patch("/{demand_id}/status")
def update_demand_status(
    demand_id: str,
    status: str = Query(..., description="New status"),
    matched_farmer_ids: Optional[str] = Query(None, description="Comma-separated farmer IDs"),
    db: Session = Depends(get_db)
):
    """
    Update demand status
    Called after matching or order confirmation
    """
    demand = db.query(Demand).filter(Demand.id == demand_id).first()
    if not demand:
        raise HTTPException(status_code=404, detail="Demand not found")
    
    demand.status = status
    if matched_farmer_ids:
        demand.matched_farmer_ids = matched_farmer_ids
    
    db.commit()
    db.refresh(demand)
    
    return {
        "success": True,
        "demand_id": demand_id,
        "status": demand.status
    }
