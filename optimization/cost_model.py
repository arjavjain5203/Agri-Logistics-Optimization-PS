"""Explainable, configurable cost and spoilage calculations."""

from __future__ import annotations


def calculate_costs(quantity: float, price: float, distance: float, minutes: float, risk: dict, costs: dict) -> dict:
    gross = quantity * price
    transport = distance * float(costs.get("cost_per_km", 0)) + (minutes / 60) * float(costs.get("cost_per_hour", 0))
    handling = float(costs.get("loading_cost", 0)) + float(costs.get("unloading_cost", 0))
    storage_hours = float(costs.get("storage_duration_hours", 0))
    storage = quantity * storage_hours * float(costs.get("storage_cost_per_kg_hour", 0))
    loss_fraction = min(float(risk.get("spoilage_risk", 0)) * float(costs.get("risk_loss_multiplier", 0.25)), float(costs.get("max_loss_fraction", 0.4)))
    spoilage = gross * loss_fraction
    return {"gross_revenue": gross, "transport_cost": transport, "handling_cost": handling, "storage_cost": storage, "expected_spoilage_loss": spoilage, "expected_loss_fraction": loss_fraction, "expected_net_realization": gross - transport - handling - storage - spoilage}
