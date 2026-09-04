"""
Route Optimization Service
Implements multi-stop pickup route optimization using distance-based algorithms
"""

from typing import List, Dict, Tuple
import math
from itertools import permutations


def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculate distance between two points using Haversine formula (km)"""
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
    return distance


def nearest_neighbor_route(
    pickup_points: List[Dict],
    delivery_point: Dict
) -> Tuple[List[Dict], float]:
    """
    Nearest Neighbor algorithm for route optimization
    
    Args:
        pickup_points: List of farmer locations with {id, name, lat, lng, quantity}
        delivery_point: Buyer location with {lat, lng}
    
    Returns:
        Tuple of (optimized_route, total_distance_km)
    """
    if not pickup_points:
        return [], 0
    
    # Start with the pickup point closest to origin (0,0) or buyer
    remaining = pickup_points.copy()
    route = []
    current_lat = delivery_point["latitude"]
    current_lon = delivery_point["longitude"]
    total_distance = 0
    
    # Find nearest unvisited point at each step
    while remaining:
        nearest = None
        nearest_dist = float('inf')
        
        for point in remaining:
            dist = calculate_distance(
                current_lat, current_lon,
                point["latitude"], point["longitude"]
            )
            if dist < nearest_dist:
                nearest_dist = dist
                nearest = point
        
        if nearest:
            route.append(nearest)
            total_distance += nearest_dist
            current_lat = nearest["latitude"]
            current_lon = nearest["longitude"]
            remaining.remove(nearest)
    
    # Add distance from last pickup to delivery
    if route:
        final_distance = calculate_distance(
            route[-1]["latitude"], route[-1]["longitude"],
            delivery_point["latitude"], delivery_point["longitude"]
        )
        total_distance += final_distance
    
    return route, total_distance


def brute_force_optimal_route(
    pickup_points: List[Dict],
    delivery_point: Dict
) -> Tuple[List[Dict], float]:
    """
    Brute force optimal route (for small number of pickups <= 8)
    Tests all permutations to find the shortest route
    """
    if len(pickup_points) > 8:
        # Fall back to nearest neighbor for larger routes
        return nearest_neighbor_route(pickup_points, delivery_point)
    
    if not pickup_points:
        return [], 0
    
    best_route = None
    best_distance = float('inf')
    
    # Try all permutations
    for perm in permutations(pickup_points):
        total_dist = 0
        
        # Distance from delivery point to first pickup
        total_dist += calculate_distance(
            delivery_point["latitude"], delivery_point["longitude"],
            perm[0]["latitude"], perm[0]["longitude"]
        )
        
        # Distance between consecutive pickups
        for i in range(len(perm) - 1):
            total_dist += calculate_distance(
                perm[i]["latitude"], perm[i]["longitude"],
                perm[i + 1]["latitude"], perm[i + 1]["longitude"]
            )
        
        # Distance from last pickup back to delivery
        total_dist += calculate_distance(
            perm[-1]["latitude"], perm[-1]["longitude"],
            delivery_point["latitude"], delivery_point["longitude"]
        )
        
        if total_dist < best_distance:
            best_distance = total_dist
            best_route = list(perm)
    
    return best_route, best_distance


def optimize_route(
    suppliers: List[Dict],
    buyer_location: Dict,
    algorithm: str = "nearest_neighbor"
) -> Dict:
    """
    Optimize pickup route for multiple farmers
    
    Args:
        suppliers: List of matched suppliers with location data
        buyer_location: Delivery location {latitude, longitude, location_name}
        algorithm: 'nearest_neighbor' or 'brute_force'
    
    Returns:
        Optimized route with stops, distances, costs, and savings
    """
    
    # Prepare pickup points
    pickup_points = [
        {
            "farmer_id": s["farmer_id"],
            "farmer_name": s["farmer_name"],
            "farmer_name_hi": s.get("farmer_name_hi", s["farmer_name"]),
            "location": s["location"],
            "location_hi": s.get("location_hi", s["location"]),
            "latitude": s["latitude"],
            "longitude": s["longitude"],
            "quantity_kg": s["quantity_kg"],
            "crop": s["crop_name"]
        }
        for s in suppliers
    ]
    
    # Choose algorithm
    if algorithm == "brute_force" and len(pickup_points) <= 8:
        optimized_route, optimized_distance = brute_force_optimal_route(pickup_points, buyer_location)
    else:
        optimized_route, optimized_distance = nearest_neighbor_route(pickup_points, buyer_location)
    
    # Calculate unoptimized distance (direct route from buyer to each farmer and back)
    unoptimized_distance = 0
    for point in pickup_points:
        # Round trip for each farmer individually
        dist = calculate_distance(
            buyer_location["latitude"], buyer_location["longitude"],
            point["latitude"], point["longitude"]
        )
        unoptimized_distance += dist * 2  # Round trip
    
    # Build route stops with cumulative metrics
    stops = []
    cumulative_distance = 0
    cumulative_quantity = 0
    
    # First stop: Start at buyer location (for reference)
    # In practice, vehicle starts from depot/buyer location
    
    for idx, point in enumerate(optimized_route):
        if idx == 0:
            # Distance from buyer to first pickup
            segment_distance = calculate_distance(
                buyer_location["latitude"], buyer_location["longitude"],
                point["latitude"], point["longitude"]
            )
        else:
            # Distance from previous pickup to this pickup
            segment_distance = calculate_distance(
                optimized_route[idx - 1]["latitude"], optimized_route[idx - 1]["longitude"],
                point["latitude"], point["longitude"]
            )
        
        cumulative_distance += segment_distance
        cumulative_quantity += point["quantity_kg"]
        
        stops.append({
            "stop_number": idx + 1,
            "type": "pickup",
            "farmer_id": point["farmer_id"],
            "farmer_name": point["farmer_name"],
            "farmer_name_hi": point["farmer_name_hi"],
            "location": point["location"],
            "location_hi": point["location_hi"],
            "latitude": point["latitude"],
            "longitude": point["longitude"],
            "quantity_kg": point["quantity_kg"],
            "crop": point["crop"],
            "segment_distance_km": round(segment_distance, 2),
            "cumulative_distance_km": round(cumulative_distance, 2),
            "cumulative_quantity_kg": round(cumulative_quantity, 2)
        })
    
    # Final stop: Delivery to buyer
    if optimized_route:
        final_segment = calculate_distance(
            optimized_route[-1]["latitude"], optimized_route[-1]["longitude"],
            buyer_location["latitude"], buyer_location["longitude"]
        )
        cumulative_distance += final_segment
    
    stops.append({
        "stop_number": len(stops) + 1,
        "type": "delivery",
        "location": buyer_location.get("location_name", "Buyer Location"),
        "location_hi": buyer_location.get("location_name_hi", buyer_location.get("location_name", "Buyer Location")),
        "latitude": buyer_location["latitude"],
        "longitude": buyer_location["longitude"],
        "quantity_kg": cumulative_quantity,
        "segment_distance_km": round(final_segment, 2) if optimized_route else 0,
        "cumulative_distance_km": round(cumulative_distance, 2),
        "cumulative_quantity_kg": round(cumulative_quantity, 2)
    })
    
    # Calculate costs and savings
    # Assume ₹20/km for logistics cost
    cost_per_km = 20
    optimized_cost = optimized_distance * cost_per_km
    unoptimized_cost = unoptimized_distance * cost_per_km
    
    distance_saved = unoptimized_distance - optimized_distance
    cost_saved = unoptimized_cost - optimized_cost
    savings_pct = (distance_saved / unoptimized_distance * 100) if unoptimized_distance > 0 else 0
    
    # Estimate time (assume 40 km/h average + 15 min per stop)
    travel_time_hours = optimized_distance / 40
    stop_time_hours = len(pickup_points) * 0.25  # 15 min per stop
    total_time_hours = travel_time_hours + stop_time_hours
    
    hours = int(total_time_hours)
    minutes = int((total_time_hours - hours) * 60)
    
    return {
        "success": True,
        "total_stops": len(stops),
        "pickup_stops": len(pickup_points),
        "optimized_distance_km": round(optimized_distance, 2),
        "unoptimized_distance_km": round(unoptimized_distance, 2),
        "distance_saved_km": round(distance_saved, 2),
        "savings_percentage": round(savings_pct, 1),
        "estimated_time": f"{hours}h {minutes}m",
        "estimated_cost_inr": round(optimized_cost, 2),
        "cost_saved_inr": round(cost_saved, 2),
        "stops": stops,
        "algorithm_used": algorithm
    }
