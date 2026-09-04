"""
Farmers API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.farmer import Farmer
from app.models.product import Product
from app.schemas.farmer import FarmerResponse, FarmerCreate

router = APIRouter()


@router.get("/", response_model=List[dict])
def get_farmers(
    crop_id: Optional[str] = Query(None, description="Filter by available crop"),
    is_fpo: Optional[bool] = Query(None, description="Filter by FPO status"),
    verified: Optional[bool] = Query(None, description="Filter by verification status"),
    db: Session = Depends(get_db)
):
    """
    Get all farmers with optional filters
    Returns farmers with their available products for matching
    """
    query = db.query(Farmer)
    
    if is_fpo is not None:
        query = query.filter(Farmer.is_fpo == is_fpo)
    
    if verified is not None:
        query = query.filter(Farmer.verified == verified)
    
    farmers = query.all()
    
    # Build response with products
    result = []
    for farmer in farmers:
        products_query = db.query(Product).filter(
            Product.farmer_id == farmer.id,
            Product.is_available == 1
        )
        
        if crop_id:
            products_query = products_query.filter(Product.crop_id == crop_id)
        
        products = products_query.all()
        
        # Skip farmers without matching products if crop_id filter is applied
        if crop_id and not products:
            continue
        
        farmer_data = {
            "id": farmer.id,
            "name": farmer.name,
            "name_hi": farmer.name_hi,
            "phone": farmer.phone,
            "location": farmer.location,
            "location_hi": farmer.location_hi,
            "latitude": farmer.latitude,
            "longitude": farmer.longitude,
            "is_fpo": farmer.is_fpo,
            "fpo_member_count": farmer.fpo_member_count,
            "verified": farmer.verified,
            "rating": farmer.rating,
            "products": [
                {
                    "id": p.id,
                    "crop_id": p.crop_id,
                    "crop_name": p.crop_name,
                    "crop_name_hi": p.crop_name_hi,
                    "quantity_kg": p.quantity_kg,
                    "price_per_kg": p.price_per_kg,
                    "grade": p.grade,
                    "harvest_date": p.harvest_date.isoformat()
                }
                for p in products
            ]
        }
        result.append(farmer_data)
    
    return result


@router.get("/{farmer_id}", response_model=dict)
def get_farmer(farmer_id: str, db: Session = Depends(get_db)):
    """Get a single farmer by ID with their products"""
    farmer = db.query(Farmer).filter(Farmer.id == farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    
    products = db.query(Product).filter(
        Product.farmer_id == farmer_id,
        Product.is_available == 1
    ).all()
    
    return {
        "id": farmer.id,
        "name": farmer.name,
        "name_hi": farmer.name_hi,
        "phone": farmer.phone,
        "location": farmer.location,
        "location_hi": farmer.location_hi,
        "latitude": farmer.latitude,
        "longitude": farmer.longitude,
        "is_fpo": farmer.is_fpo,
        "fpo_member_count": farmer.fpo_member_count,
        "verified": farmer.verified,
        "rating": farmer.rating,
        "products": [
            {
                "id": p.id,
                "crop_id": p.crop_id,
                "crop_name": p.crop_name,
                "quantity_kg": p.quantity_kg,
                "price_per_kg": p.price_per_kg,
                "grade": p.grade
            }
            for p in products
        ]
    }


@router.post("/", response_model=FarmerResponse, status_code=201)
def create_farmer(farmer: FarmerCreate, db: Session = Depends(get_db)):
    """
    Create a new farmer
    Used during farmer registration
    """
    # Check if farmer ID already exists
    existing = db.query(Farmer).filter(Farmer.id == farmer.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Farmer ID already exists")
    
    db_farmer = Farmer(**farmer.model_dump())
    db.add(db_farmer)
    db.commit()
    db.refresh(db_farmer)
    return db_farmer
