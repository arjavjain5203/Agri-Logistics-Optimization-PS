from api import PriceShockRequest, VehicleFailureRequest, health, optimize, price_shock, reset_demo_data, vehicle_failure
from database import fail_vehicle, load_state, reset_demo, update_mandi_price
from demo import demo_state
from optimization import optimize_dispatch, reoptimize, simulate_price_shock, simulate_vehicle_failure


def test_normal_optimization_is_deterministic_and_capacity_safe():
    state = demo_state()
    result = optimize_dispatch(state)
    assert result["status"] == "OPTIMAL"
    assert result == optimize_dispatch(state)
    assert result["total_quantity_kg"] <= next(v["capacity_kg"] for v in state["vehicles"] if v["vehicle_id"] == result["vehicle_id"])


def test_price_shock_changes_recommendation_from_b_to_c():
    state = demo_state()
    assert optimize_dispatch(state)["selected_mandi"] == "B"
    assert reoptimize(simulate_price_shock(state, "B", 18))["selected_mandi"] == "C"


def test_vehicle_failure_uses_t09():
    result = reoptimize(simulate_vehicle_failure(demo_state(), "T07"))
    assert result["status"] == "OPTIMAL"
    assert result["vehicle_id"] == "T09"


def test_capacity_constraint_reports_no_feasible_plan():
    state = demo_state()
    for vehicle in state["vehicles"]:
        vehicle["capacity_kg"] = 500
    result = optimize_dispatch(state)
    assert result["status"] == "NO_FEASIBLE_PLAN"


def test_unavailable_vehicles_report_no_feasible_plan():
    state = demo_state()
    for vehicle in state["vehicles"]:
        vehicle["available"] = False
    assert optimize_dispatch(state)["status"] == "NO_FEASIBLE_PLAN"


def test_stale_price_is_rejected():
    state = demo_state()
    for mandi in state["mandis"]:
        mandi["timestamp"] = "2026-08-19T01:00:00+05:30"
    assert optimize_dispatch(state)["status"] == "NO_FEASIBLE_PLAN"


def test_high_spoilage_risk_uses_capped_linear_mapping():
    state = demo_state()
    state["crop_risk"]["spoilage_risk"] = 10
    result = optimize_dispatch(state)
    assert result["expected_loss_fraction"] == 0.4


def test_multiple_vehicles_prefers_lower_cost_route_when_net_equal():
    state = demo_state()
    state["mandis"] = [state["mandis"][0]]
    result = optimize_dispatch(state)
    assert result["vehicle_id"] == "T07"


def test_database_seed_loads_and_can_be_reset():
    db_path = "tests/database_test.db"
    reset_demo(db_path)
    assert optimize_dispatch(load_state(db_path))["selected_mandi"] == "B"
    update_mandi_price("B", 18, db_path)
    assert optimize_dispatch(load_state(db_path))["selected_mandi"] == "C"
    fail_vehicle("T07", db_path)
    assert optimize_dispatch(load_state(db_path))["vehicle_id"] == "T09"
    reset_demo(db_path)
    assert load_state(db_path)["mandis"][1]["price_per_kg"] == 24


def test_api_handlers_use_persisted_database_state():
    reset_demo_data()
    assert health() == {"status": "ok", "data_source": "sqlite"}
    result = optimize()
    assert result["status"] == "OPTIMAL"
    assert price_shock(PriceShockRequest(mandi_id="B", price_per_kg=18))["selected_mandi"] == "C"
    assert vehicle_failure(VehicleFailureRequest(vehicle_id="T07"))["vehicle_id"] == "T09"
    assert reset_demo_data()["status"] == "RESET"
