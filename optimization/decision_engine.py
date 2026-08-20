"""Candidate enumeration and explainable plan selection."""

from __future__ import annotations

from datetime import timezone

from .clustering import cluster_farms
from .cost_model import calculate_costs
from .models import parse_time, validate_state
from .routing import build_graph, route_cluster


def _fresh(mandi: dict, now, costs: dict) -> bool:
    timestamp = parse_time(mandi["timestamp"])
    if timestamp.tzinfo is None and now.tzinfo is not None:
        timestamp = timestamp.replace(tzinfo=now.tzinfo)
    age = (now - timestamp).total_seconds() / 3600
    return age <= float(costs.get("max_price_age_hours", 6)) and float(mandi.get("freshness", 1)) >= float(costs.get("min_freshness", 0))


def optimize_dispatch(state: dict) -> dict:
    validate_state(state)
    graph, costs, risk = build_graph(state["road_network"]), state["cost_parameters"], state["crop_risk"]
    now = parse_time(state["current_time"])
    candidates: list[dict] = []; reasons: list[str] = []
    clusters = cluster_farms(state["farms"], state["vehicles"])
    if not clusters:
        return {"status": "NO_FEASIBLE_PLAN", "reason": "No available vehicles", "candidates": []}
    for cluster in clusters:
        quantity = sum(float(f["quantity_kg"]) for f in cluster); crop = cluster[0]["crop"]; farm_ids = [f["farm_id"] for f in cluster]
        feasible_vehicles = [v for v in state["vehicles"] if v.get("available") and float(v["capacity_kg"]) >= quantity and (not cluster[0].get("requires_refrigeration") or v.get("refrigerated"))]
        if not feasible_vehicles:
            reasons.append(f"No vehicle can carry cluster {farm_ids}"); continue
        mandis = [m for m in state["mandis"] if m["crop"] == crop and _fresh(m, now, costs)]
        if not mandis:
            reasons.append(f"No fresh {crop} mandi prices"); continue
        for vehicle in feasible_vehicles:
            start = vehicle.get("node_id", vehicle["vehicle_id"])
            for mandi in mandis:
                routed = route_cluster(graph, start, farm_ids, mandi["mandi_id"])
                if not routed:
                    reasons.append(f"No route from {start} to {mandi['mandi_id']}"); continue
                route, distance, minutes = routed
                breakdown = calculate_costs(quantity, float(mandi["price_per_kg"]), distance, minutes, risk, costs)
                candidates.append({"selected_mandi": mandi["mandi_id"], "vehicle_id": vehicle["vehicle_id"], "farms": farm_ids, "route": route, "total_quantity_kg": quantity, "distance_km": distance, "travel_time_min": minutes, "vehicle_utilization": quantity / float(vehicle["capacity_kg"]), "cost_breakdown": breakdown, **breakdown})
    if not candidates:
        return {"status": "NO_FEASIBLE_PLAN", "reason": "; ".join(sorted(set(reasons))) or "No feasible candidates", "candidates": []}
    candidates.sort(key=lambda c: (-c["expected_net_realization"], c["distance_km"], c["vehicle_id"], c["selected_mandi"]))
    best = candidates[0].copy()
    best.update({"status": "OPTIMAL", "explanation": {"objective": "max_expected_farmer_net_realization", "candidates_considered": len(candidates), "spoilage_mapping": "min(spoilage_risk * risk_loss_multiplier, max_loss_fraction)"}, "candidates": candidates})
    return best
