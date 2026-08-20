"""Pure state mutation helpers for dynamic re-optimization."""

from __future__ import annotations

from copy import deepcopy

from .decision_engine import optimize_dispatch


def simulate_price_shock(state: dict, mandi_id: str, price_per_kg: float) -> dict:
    updated = deepcopy(state)
    for mandi in updated["mandis"]:
        if mandi["mandi_id"] == mandi_id:
            mandi["price_per_kg"] = price_per_kg
            return updated
    raise ValueError(f"Unknown mandi: {mandi_id}")


def simulate_vehicle_failure(state: dict, vehicle_id: str) -> dict:
    updated = deepcopy(state)
    for vehicle in updated["vehicles"]:
        if vehicle["vehicle_id"] == vehicle_id:
            vehicle["available"] = False
            return updated
    raise ValueError(f"Unknown vehicle: {vehicle_id}")


def reoptimize(updated_state: dict) -> dict:
    return optimize_dispatch(updated_state)
