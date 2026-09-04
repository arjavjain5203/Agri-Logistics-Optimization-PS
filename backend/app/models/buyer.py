"""
Buyer Model
Represents institutional buyers (restaurants, retailers, etc.)
"""

from sqlalchemy import Column, String, Float, DateTime, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.database import Base


class Buyer(Base):
    __tablename__ = "buyers"
    
    id = Column(String(50), primary_key=True, index=True)
    name = Column(String(200), nullable=False)
    name_hi = Column(String(200), nullable=True)
    
    # Location
    location = Column(String(300), nullable=False)
    location_hi = Column(String(300), nullable=True)
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    
    # Contact
    contact_person = Column(String(200), nullable=True)
    phone = Column(String(20), nullable=True)
    email = Column(String(100), nullable=True)
    
    # Business
    buyer_type = Column(String(50), default="restaurant")  # restaurant, hotel, retailer, etc.
    monthly_volume_kg = Column(Integer, default=0)
    rating = Column(Float, default=4.5)
    
    # Metadata
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Relationships
    demands = relationship("Demand", back_populates="buyer", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<Buyer(id='{self.id}', name='{self.name}')>"
