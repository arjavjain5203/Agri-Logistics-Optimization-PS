# KISAN GUARD Optimization Context

## Overview and role

KISAN GUARD is a farm-to-mandi decision orchestrator. This module is the Person 3
optimization and logistics component: it converts farms, mandis, vehicles, crop
risk, a road graph, and configurable costs into the highest expected-net,
operationally feasible dispatch plan.

## Architecture and public contract

`optimization.optimize_dispatch(state)` is the backend-neutral interface.
`database.py` builds this state from the local SQLite prototype database.
`api.py` exposes database-first FastAPI endpoints for optimization, price shocks,
vehicle failures, and resetting synthetic data. See `INTEGRATION_GUIDE.md` for
the handoff contract.

The package is deliberately deterministic: equal inputs yield equal output.
It uses an in-memory directed/undirected road graph, Dijkstra shortest paths, and
a stable nearest-neighbour pickup order. No external map or routing service is
used in this MVP.

## Objective and formulas

For each feasible cluster, vehicle, and mandi candidate, the engine maximizes:

`net = gross_revenue - transport_cost - storage_cost - handling_cost - expected_spoilage_loss`

`gross_revenue = quantity_kg * price_per_kg`

`transport_cost = distance_km * cost_per_km + travel_hours * cost_per_hour`

`expected_spoilage_loss = gross_revenue * min(spoilage_risk * risk_loss_multiplier, max_loss_fraction)`

Loading and unloading costs are explicit handling costs. Storage is optional and
defaults to zero (immediate sale). Risk is not treated as a literal loss percent;
the capped-linear mapping is an explicit synthetic configuration assumption.

## Constraints and algorithms

- Farms are grouped only by crop and split greedily so each group fits at least
  one available vehicle. Groups are deterministic and preserve farm-id order.
- A vehicle must be available, have capacity at least equal to cluster quantity,
  and meet `requires_refrigeration` when present.
- Mandi crop must match the cluster crop; prices older than `max_price_age_hours`
  are rejected. Optional `min_freshness` also rejects low-confidence prices.
- Route legs must exist in the road graph; unreachable candidates are infeasible.
- The engine enumerates candidates and ranks by net realization, then total
  distance, vehicle id, and mandi id for stable ties.

## Data and simulation assumptions

All cost parameters and the SQLite seed scenario are synthetic and must not be
presented as measured real-world values. The mutable local database is stored at
`data/kisan_guard.db` and is resettable. Times use ISO 8601 timestamps. The MVP
does not implement real market ingestion, time windows, warehouses, tolls,
multi-vehicle splitting of one already-formed cluster, or advanced VRP solving.

## Dynamic events

The pure functions `simulate_price_shock` and `simulate_vehicle_failure` remain
available for in-memory callers. Prototype API events instead persist updates in
SQLite and immediately return a re-optimized result. `POST /reset-demo` restores
the seed dataset.

## Completed / pending

Completed: deterministic optimization, graph routing, capacity checks, stale
price rejection, cost accounting, SQLite prototype storage, FastAPI surface,
synthetic demo, integration guide, and tests.

Pending: live road/market/risk adapters, warehouse decisions, time windows,
OR-Tools VRP, persistent scenario history, authentication, and production
observability.

## Test scenarios

Tests cover normal optimization, capacity, unavailable/no vehicles, stale prices,
multiple vehicles, high-risk loss calculation, price shock, and vehicle failure.
Benchmarking is intentionally deferred until real or approved synthetic datasets
are available.
