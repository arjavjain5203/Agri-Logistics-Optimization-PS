"""Conservative, deterministic capacity-safe farm grouping."""

from __future__ import annotations


def cluster_farms(farms: list[dict], vehicles: list[dict]) -> list[list[dict]]:
    available_capacities = [float(v["capacity_kg"]) for v in vehicles if v.get("available", False)]
    if not available_capacities:
        return []
    largest_capacity = max(available_capacities)
    clusters: list[list[dict]] = []
    for crop in sorted({farm["crop"] for farm in farms}):
        current: list[dict] = []; quantity = 0.0
        for farm in sorted((f for f in farms if f["crop"] == crop), key=lambda f: f["farm_id"]):
            farm_quantity = float(farm["quantity_kg"])
            if farm_quantity > largest_capacity:
                clusters.append([farm])  # engine will report this as infeasible
                continue
            if current and quantity + farm_quantity > largest_capacity:
                clusters.append(current); current = []; quantity = 0.0
            current.append(farm); quantity += farm_quantity
        if current:
            clusters.append(current)
    return clusters
