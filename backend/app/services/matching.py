"""
Smart Farmer-Buyer Matching Service
Implements intelligent supplier aggregation and matching algorithm
"""

from typing import List, Dict, Optional
from sqlalchemy.orm import Session
from app.models.farmer import Farmer
from app.models.product import Product
import math


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate distance between two points using Haversine formula
    Returns distance in kilometers
    """
    R = 6371  # Earth's radius in kilometers
    
    lat1_rad = math.radians(lat1)
    lat2_rad = math.radians(lat2)
    delta_lat = math.radians(lat2 - lat1)
    delta_lon = math.radians(lon2 - lon1)
    
    a = (math.sin(delta_lat / 2) ** 2 +
         math.cos(lat1_rad) * math.cos(lat2_rad) *
         math.sin(delta_lon / 2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    
    distance = R * c
    return round(distance, 2)


def calculate_match_score(
    product: Product,
    farmer: Farmer,
    buyer_lat: float,
    buyer_lon: float,
    target_quantity: float,
    max_budget: float,
    quality_grade: str
) -> float:
    """
    Calculate match score (0-100) based on multiple factors
    
    Scoring factors:
    - Price compatibility (30%)
    - Distance (30%)
    - Quantity match (20%)
    - Quality grade (10%)
    - Farmer rating (10%)
    """
    score = 0.0
    
    # 1. Price compatibility (30 points max)
    # Lower price = higher score
    if product.price_per_kg <= max_budget:
        price_ratio = product.price_per_kg / max_budget
        price_score = 30 * (1 - price_ratio * 0.5)  # Best case: 30 points at 50% of budget
        score += min(price_score, 30)
    else:
        # Penalty for exceeding budget
        score += max(0, 30 - (product.price_per_kg - max_budget) * 2)
    
    # 2. Distance score (30 points max)
    # Closer = higher score
    distance_km = calculate_distance(farmer.latitude, farmer.longitude, buyer_lat, buyer_lon)
    if distance_km <= 10:
        distance_score = 30
    elif distance_km <= 30:
        distance_score = 30 - ((distance_km - 10) / 20) * 15  # 30 to 15 points
    elif distance_km <= 50:
        distance_score = 15 - ((distance_km - 30) / 20) * 10  # 15 to 5 points
    else:
        distance_score = max(0, 5 - (distance_km - 50) * 0.1)
    score += distance_score
    
    # 3. Quantity match (20 points max)
    quantity_ratio = product.quantity_kg / target_quantity
    if quantity_ratio >= 0.5:  # Can fulfill at least 50%
        quantity_score = min(20, quantity_ratio * 15)
    else:
        quantity_score = quantity_ratio * 10
    score += quantity_score
    
    # 4. Quality grade (10 points max)
    grade_map = {"Grade A": 10, "Grade B": 7, "Grade C": 4}
    target_grade_score = grade_map.get(quality_grade, 5)
    product_grade_score = grade_map.get(product.grade, 5)
    
    if product_grade_score >= target_grade_score:
        score += 10
    else:
        score += 5  # Partial score for lower grade
    
    # 5. Farmer rating (10 points max)
    rating_score = (farmer.rating / 5.0) * 10
    score += rating_score
    
    # Bonus for FPO (more reliable aggregation)
    if farmer.is_fpo:
        score += 5
    
    # Bonus for verified farmers
    if farmer.verified:
        score += 3
    
    return round(min(score, 100), 1)


def smart_match_suppliers(
    db: Session,
    crop_id: str,
    target_quantity_kg: float,
    buyer_latitude: float,
    buyer_longitude: float,
    max_budget_per_kg: float,
    quality_grade: str = "Grade A",
    max_distance_km: float = 100
) -> Dict:
    """
    Smart matching algorithm to aggregate multiple farmers for bulk demand
    
    Returns:
    - List of matched suppliers with scores
    - Aggregation metrics
    - Fulfillment analysis
    """
    
    # Get all available products matching the crop
    products = db.query(Product).filter(
        Product.crop_id == crop_id,
        Product.is_available == 1
    ).all()
    
    if not products:
        return {
            "success": False,
            "message": "No suppliers found for this crop",
            "matched_suppliers": []
        }
    
    # Calculate match scores for each supplier
    scored_suppliers = []
    
    for product in products:
        farmer = db.query(Farmer).filter(Farmer.id == product.farmer_id).first()
        if not farmer:
            continue
        
        # Calculate distance
        distance_km = calculate_distance(
            farmer.latitude, farmer.longitude,
            buyer_latitude, buyer_longitude
        )
        
        # Skip if too far
        if distance_km > max_distance_km:
            continue
        
        # Calculate match score
        match_score = calculate_match_score(
            product, farmer, buyer_latitude, buyer_longitude,
            target_quantity_kg, max_budget_per_kg, quality_grade
        )
        
        # Build supplier object
        supplier = {
            "farmer_id": farmer.id,
            "farmer_name": farmer.name,
            "farmer_name_hi": farmer.name_hi,
            "location": farmer.location,
            "location_hi": farmer.location_hi,
            "latitude": farmer.latitude,
            "longitude": farmer.longitude,
            "distance_km": distance_km,
            "crop_id": product.crop_id,
            "crop_name": product.crop_name,
            "crop_name_hi": product.crop_name_hi,
            "quantity_kg": product.quantity_kg,
            "price_per_kg": product.price_per_kg,
            "grade": product.grade,
            "harvest_date": product.harvest_date.isoformat(),
            "is_fpo": farmer.is_fpo,
            "fpo_member_count": farmer.fpo_member_count,
            "verified": farmer.verified,
            "rating": farmer.rating,
            "match_score": match_score,
            "product_id": product.id
        }
        
        scored_suppliers.append(supplier)
    
    # Sort by match score (highest first)
    scored_suppliers.sort(key=lambda x: x["match_score"], reverse=True)
    
    # Select optimal combination to fulfill demand
    selected_suppliers = []
    total_quantity = 0
    total_cost = 0
    
    for supplier in scored_suppliers:
        if total_quantity >= target_quantity_kg:
            break
        
        selected_suppliers.append(supplier)
        total_quantity += supplier["quantity_kg"]
        total_cost += supplier["quantity_kg"] * supplier["price_per_kg"]
    
    # Calculate metrics
    fulfillment_rate = min(100, (total_quantity / target_quantity_kg) * 100)
    blended_price = total_cost / total_quantity if total_quantity > 0 else 0
    avg_distance = sum(s["distance_km"] for s in selected_suppliers) / len(selected_suppliers) if selected_suppliers else 0
    
    return {
        "success": True,
        "target_crop": crop_id,
        "target_quantity_kg": target_quantity_kg,
        "matched_quantity_kg": round(total_quantity, 2),
        "fulfillment_rate": round(fulfillment_rate, 1),
        "matched_suppliers": selected_suppliers,
        "aggregation_metrics": {
            "total_suppliers": len(selected_suppliers),
            "blended_price_per_kg": round(blended_price, 2),
            "avg_distance_km": round(avg_distance, 2),
            "total_estimated_cost": round(total_cost, 2),
            "budget_per_kg": max_budget_per_kg,
            "savings_per_kg": round(max_budget_per_kg - blended_price, 2) if blended_price < max_budget_per_kg else 0
        }
    }
