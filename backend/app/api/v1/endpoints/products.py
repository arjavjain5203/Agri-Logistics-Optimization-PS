"""
Products/Crops API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.database import get_db
from app.models.product import Product
from app.models.farmer import Farmer
from app.schemas.product import ProductResponse, ProductCreate

router = APIRouter()


@router.get("/", response_model=List[ProductResponse])
def get_products(
    crop_id: Optional[str] = Query(None, description="Filter by crop ID"),
    is_available: Optional[int] = Query(None, description="Filter by availability (1 or 0)"),
    min_quantity: Optional[float] = Query(None, description="Minimum quantity in kg"),
    db: Session = Depends(get_db)
):
    """
    Get all products with optional filters
    Used by frontend marketplace and farmer produce listings
    """
    query = db.query(Product)
    
    if crop_id:
        query = query.filter(Product.crop_id == crop_id)
    
    if is_available is not None:
        query = query.filter(Product.is_available == is_available)
    
    if min_quantity:
        query = query.filter(Product.quantity_kg >= min_quantity)
    
    products = query.all()
    return products


@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    """Get a single product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


@router.post("/", response_model=ProductResponse, status_code=201)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    """
    Create a new product listing
    Used when farmers add their produce
    """
    # Verify farmer exists
    farmer = db.query(Farmer).filter(Farmer.id == product.farmer_id).first()
    if not farmer:
        raise HTTPException(status_code=404, detail="Farmer not found")
    
    db_product = Product(**product.model_dump())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product


@router.delete("/{product_id}")
def delete_product(product_id: int, db: Session = Depends(get_db)):
    """Delete a product listing"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}


@router.get("/crops/available", response_model=List[dict])
def get_available_crops(db: Session = Depends(get_db)):
    """
    Get list of unique available crops with aggregate data
    Used for frontend crop selection dropdowns
    """
    from sqlalchemy import func
    
    crops = db.query(
        Product.crop_id,
        Product.crop_name,
        Product.crop_name_hi,
        func.sum(Product.quantity_kg).label("total_quantity_kg"),
        func.avg(Product.price_per_kg).label("avg_price_per_kg"),
        func.count(Product.id).label("supplier_count")
    ).filter(
        Product.is_available == 1
    ).group_by(
        Product.crop_id,
        Product.crop_name,
        Product.crop_name_hi
    ).all()
    
    return [
        {
            "crop_id": crop.crop_id,
            "crop_name": crop.crop_name,
            "crop_name_hi": crop.crop_name_hi,
            "total_quantity_kg": float(crop.total_quantity_kg or 0),
            "avg_price_per_kg": float(crop.avg_price_per_kg or 0),
            "supplier_count": crop.supplier_count
        }
        for crop in crops
    ]
