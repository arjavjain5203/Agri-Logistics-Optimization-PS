"""
Buyers API Endpoints
"""

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.db.database import get_db
from app.models.buyer import Buyer
from app.schemas.buyer import BuyerResponse, BuyerCreate

router = APIRouter()


@router.get("/", response_model=List[BuyerResponse])
def get_buyers(db: Session = Depends(get_db)):
    """Get all buyers"""
    buyers = db.query(Buyer).all()
    return buyers


@router.get("/{buyer_id}", response_model=BuyerResponse)
def get_buyer(buyer_id: str, db: Session = Depends(get_db)):
    """Get a single buyer by ID"""
    buyer = db.query(Buyer).filter(Buyer.id == buyer_id).first()
    if not buyer:
        raise HTTPException(status_code=404, detail="Buyer not found")
    return buyer


@router.post("/", response_model=BuyerResponse, status_code=201)
def create_buyer(buyer: BuyerCreate, db: Session = Depends(get_db)):
    """
    Create a new buyer
    Used during buyer registration
    """
    # Check if buyer ID already exists
    existing = db.query(Buyer).filter(Buyer.id == buyer.id).first()
    if existing:
        raise HTTPException(status_code=400, detail="Buyer ID already exists")
    
    db_buyer = Buyer(**buyer.model_dump())
    db.add(db_buyer)
    db.commit()
    db.refresh(db_buyer)
    return db_buyer
