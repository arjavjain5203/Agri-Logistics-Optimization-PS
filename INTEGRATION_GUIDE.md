# KISAN GUARD Optimizer Integration Guide

## What another developer needs to know

The optimizer is deterministic and backend-neutral. It turns a complete state
mapping into an `OPTIMAL` plan or `NO_FEASIBLE_PLAN`; it does not query a database
itself. `database.py` is only the local synthetic-data adapter for this prototype.

## Local setup

```powershell
python -m pip install -r requirements.txt
python -m pytest tests -q -p no:cacheprovider
uvicorn api:app --reload
```

The first database operation creates and seeds `data/kisan_guard.db`. The file is
ignored by Git because it is mutable local prototype data. Reset it at any time:

```powershell
python -c "from database import reset_demo; reset_demo()"
```

All seeded farms, prices, costs, routes, and risk values are synthetic.

## Integration options

### Call Python directly

```python
from database import load_state
from optimization import optimize_dispatch

result = optimize_dispatch(load_state())
```

For a real backend, replace `load_state()` with an adapter that supplies this
same state shape. Do not put SQL or HTTP calls inside `optimization/`.

Required top-level state fields are `current_time`, `farms`, `mandis`,
`vehicles`, `crop_risk`, `road_network`, and `cost_parameters`. See
`database.load_state()` for the complete field names and `OPTIMIZATION_CONTEXT.md`
for constraints and formulas.

### Use the prototype HTTP API

| Method and route | Purpose | Request body |
| --- | --- | --- |
| `GET /health` | Service and source check | none |
| `POST /optimize` | Load SQLite state and calculate a plan | none |
| `POST /simulate/price-shock` | Persist a mandi price then re-optimize | `{"mandi_id":"B","price_per_kg":18}` |
| `POST /simulate/vehicle-failure` | Persist unavailability then re-optimize | `{"vehicle_id":"T07"}` |
| `POST /reset-demo` | Restore all synthetic data | none |

Successful optimization returns `status: "OPTIMAL"`, `selected_mandi`,
`vehicle_id`, route, quantities, full cost breakdown, and an explanation.
Infeasible input returns `status: "NO_FEASIBLE_PLAN"` with `reason`; malformed
simulation requests return HTTP 422.

## Safe merge boundaries

- Keep `optimization.optimize_dispatch(state)` as the stable domain API.
- Replace or extend `database.py` only at the repository boundary when adding a
  shared database or live data sources.
- Keep the state adapter responsible for timestamps, freshness data, road edges,
  and numeric cost configuration.
- Call `reset-demo` before a presentation to restore Mandi B at ₹24/kg and
  vehicle T07 as available.
