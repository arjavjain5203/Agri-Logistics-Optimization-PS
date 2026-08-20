"""Run the seeded SQLite prototype and its dynamic re-optimization demo."""

import json

from database import fail_vehicle, load_state, reset_demo, update_mandi_price
from optimization import optimize_dispatch


def demo_state() -> dict:
    """Compatibility helper returning a newly loaded state from local SQLite."""
    reset_demo()
    return load_state()


if __name__ == "__main__":
    reset_demo()
    print("Initial:", json.dumps(optimize_dispatch(load_state()), indent=2))
    update_mandi_price("B", 18)
    print("Price shock:", json.dumps(optimize_dispatch(load_state()), indent=2))
    fail_vehicle("T07")
    print("Vehicle failure:", json.dumps(optimize_dispatch(load_state()), indent=2))
