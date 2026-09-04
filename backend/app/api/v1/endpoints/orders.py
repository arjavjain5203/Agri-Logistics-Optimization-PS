"""
Orders API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date
from app.db.database import get_db
from app.models.order import Order
from app.models.demand import Demand
from app.schemas.order import OrderResponse, OrderCreate

router = APIRouter()


@router.get("/", response_model=List[dict])
def get_orders(
    status: Optional[str] = Query(None, description="Filter by status"),
    crop_id: Optional[str] = Query(None, description="Filter by crop"),
    db: Session = Depends(get_db)
):
    """
    Get all orders with optional filters
    Returns orders with buyer and supplier details
    """
    query = db.query(Order)
    
    if status:
        query = query.filter(Order.status == status)
    
    orders = query.order_by(Order.created_at.desc()).all()
    
    # Build enriched response
    result = []
    for order in orders:
        # Get demand and buyer info
        demand = db.query(Demand).filter(Demand.id == order.demand_id).first()
        
        order_data = {
            "id": order.id,
            "demand_id": order.demand_id,
            "crop": order.crop_name,
            "crop_hi": order.crop_name_hi,
            "quantity": f"{order.total_quantity_kg} kg",
            "grade": order.grade,
            "total_amount": f"₹{order.total_amount:,.0f}",
            "blended_price_per_kg": order.blended_price_per_kg,
            "status": order.status,
            "supplier_count": order.supplier_count,
            "order_date": order.order_date.isoformat() if order.order_date else None,
            "delivery_date": order.delivery_date.isoformat() if order.delivery_date else None,
            "optimized_distance_km": order.optimized_distance_km,
            "estimated_cost_inr": order.estimated_cost_inr,
            "buyer": {
                "id": demand.buyer_id if demand else None,
                "name": demand.buyer.name if demand and demand.buyer else "Unknown"
            } if demand else None
        }
        result.append(order_data)
    
    return result


@router.get("/{order_id}", response_model=dict)
def get_order(order_id: str, db: Session = Depends(get_db)):
    """Get a single order by ID with full details"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Get related demand and buyer
    demand = db.query(Demand).filter(Demand.id == order.demand_id).first()
    
    return {
        "id": order.id,
        "demand_id": order.demand_id,
        "crop_name": order.crop_name,
        "crop_name_hi": order.crop_name_hi,
        "total_quantity_kg": order.total_quantity_kg,
        "grade": order.grade,
        "total_amount": order.total_amount,
        "blended_price_per_kg": order.blended_price_per_kg,
        "supplier_count": order.supplier_count,
        "supplier_ids": order.supplier_ids,
        "status": order.status,
        "optimized_distance_km": order.optimized_distance_km,
        "estimated_cost_inr": order.estimated_cost_inr,
        "order_date": order.order_date.isoformat() if order.order_date else None,
        "delivery_date": order.delivery_date.isoformat() if order.delivery_date else None,
        "buyer": {
            "id": demand.buyer_id if demand else None,
            "name": demand.buyer.name if demand and demand.buyer else None,
            "location": demand.delivery_location if demand else None
        } if demand else None
    }


@router.post("/", response_model=OrderResponse, status_code=201)
def create_order(order: OrderCreate, db: Session = Depends(get_db)):
    """
    Create a new order
    Called after smart matching confirms suppliers
    """
    # Verify demand exists
    demand = db.query(Demand).filter(Demand.id == order.demand_id).first()
    if not demand:
        raise HTTPException(status_code=404, detail="Demand not found")
    
    db_order = Order(**order.model_dump())
    db.add(db_order)
    
    # Update demand status
    demand.status = "confirmed"
    
    db.commit()
    db.refresh(db_order)
    return db_order


@router.patch("/{order_id}/status")
def update_order_status(
    order_id: str,
    status: str = Query(..., description="New status (pending, inTransit, delivered, cancelled)"),
    db: Session = Depends(get_db)
):
    """Update order status during fulfillment"""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    order.status = status
    db.commit()
    
    return {
        "success": True,
        "order_id": order_id,
        "status": order.status
    }
