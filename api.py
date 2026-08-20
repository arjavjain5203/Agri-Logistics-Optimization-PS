"""Database-first FastAPI integration surface for Person 4."""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel

from database import fail_vehicle, load_state, reset_demo, update_mandi_price
from optimization import optimize_dispatch

app = FastAPI(title="KISAN GUARD Optimizer", version="0.2.0")


class PriceShockRequest(BaseModel):
    mandi_id: str
    price_per_kg: float


class VehicleFailureRequest(BaseModel):
    vehicle_id: str


def run(action):
    try:
        return action()
    except (KeyError, TypeError, ValueError) as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc


@app.get("/health")
def health():
    return {"status": "ok", "data_source": "sqlite"}


@app.post("/optimize")
def optimize():
    return run(lambda: optimize_dispatch(load_state()))


@app.post("/simulate/price-shock")
def price_shock(payload: PriceShockRequest):
    def action():
        update_mandi_price(payload.mandi_id, payload.price_per_kg)
        return optimize_dispatch(load_state())
    return run(action)


@app.post("/simulate/vehicle-failure")
def vehicle_failure(payload: VehicleFailureRequest):
    def action():
        fail_vehicle(payload.vehicle_id)
        return optimize_dispatch(load_state())
    return run(action)


@app.post("/reset-demo")
def reset_demo_data():
    reset_demo()
    return {"status": "RESET", "message": "Synthetic prototype data restored"}
