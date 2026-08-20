"""Small, dependency-free validation helpers for optimizer state."""

from __future__ import annotations

from datetime import datetime
from typing import Any


def parse_time(value: str | datetime) -> datetime:
    if isinstance(value, datetime):
        return value
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def require(state: dict[str, Any], key: str, kind: type) -> Any:
    value = state.get(key)
    if not isinstance(value, kind):
        raise ValueError(f"state.{key} must be {kind.__name__}")
    return value


def validate_state(state: dict[str, Any]) -> None:
    if not isinstance(state, dict):
        raise ValueError("state must be an object")
    parse_time(require(state, "current_time", str))
    for key in ("farms", "mandis", "vehicles", "road_network"):
        require(state, key, list)
    require(state, "crop_risk", dict)
    require(state, "cost_parameters", dict)
    for farm in state["farms"]:
        for key in ("farm_id", "crop", "quantity_kg"):
            if key not in farm:
                raise ValueError(f"farm missing {key}")
        if farm["quantity_kg"] <= 0:
            raise ValueError("farm.quantity_kg must be positive")
    for mandi in state["mandis"]:
        for key in ("mandi_id", "crop", "price_per_kg", "timestamp"):
            if key not in mandi:
                raise ValueError(f"mandi missing {key}")
        parse_time(mandi["timestamp"])
