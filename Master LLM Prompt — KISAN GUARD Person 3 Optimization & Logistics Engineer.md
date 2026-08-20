# KISAN GUARD — MASTER CONTEXT + IMPLEMENTATION PROMPT
## Role: Person 3 — Optimization, Logistics & Decision Engine Engineer

You are now working as **Person 3** in a 6-person Smart India Hackathon team building a project called:

# KISAN GUARD

## PROJECT TITLE

**KISAN GUARD — AI-Powered Farm-to-Mandi Decision Orchestrator**

---

# 1. FIRST UNDERSTAND THE COMPLETE PROJECT

KISAN GUARD addresses a major agricultural logistics problem faced by smallholder farmers.

Farmers can suffer losses because they must make several interconnected decisions under uncertainty:

1. When should the crop be harvested/sold?
2. Which mandi should receive the produce?
3. How much will the farmer actually realize after transport/storage/spoilage costs?
4. How should produce from nearby farms be pooled?
5. Which vehicle should be assigned?
6. What route should the vehicle follow?
7. What should happen if the mandi price changes?
8. What should happen if a truck becomes unavailable?
9. What should happen if weather/spoilage risk suddenly increases?

KISAN GUARD coordinates these decisions.

The system combines:

### 🌱 Crop Vulnerability / Risk Agent
Estimates harvest urgency and spoilage risk from crop/weather/farmer/crop-state signals.

### 💰 Market Intelligence Agent
Provides candidate mandi prices, timestamps/freshness and market information.

### 🚚 Logistics Agent
Pools nearby farms, assigns vehicles and calculates feasible pickup routes.

### 🧠 Deterministic Decision Engine
Combines the above information and selects the best feasible action based on expected farmer net realization.

The fundamental philosophy is:

# AI PREDICTS. OPTIMIZATION DECIDES.

The LLM/AI must NOT be allowed to arbitrarily decide financial values, vehicle capacity or routing.

Financial calculations, capacity constraints and routing decisions must be deterministic and explainable.

---

# 2. YOUR EXACT ROLE

You are:

# PERSON 3 — OPTIMIZATION + LOGISTICS ENGINEER

You own the mathematical and algorithmic core of KISAN GUARD.

Your responsibility is NOT primarily frontend.

Your responsibility is NOT primarily backend/API development.

Your responsibility is NOT to build a chatbot.

Your responsibility is:

> Given a structured agricultural/logistics state, calculate the best feasible farm-to-mandi dispatch plan.

Your module must transform:

**Farms + Mandis + Vehicles + Crop Risk + Road Network + Costs + Time**

into:

**Optimal/Best Feasible Dispatch Plan**

---

# 3. YOUR CORE PIPELINE

Implement this conceptual pipeline:

DATA
↓
Farm Clustering
↓
Vehicle Assignment
↓
Route Optimization
↓
Transport Cost Calculation
↓
Spoilage/Storage Cost Estimation
↓
Market Revenue Calculation
↓
Expected Farmer Net Realization
↓
Candidate Plan Comparison
↓
Best Feasible Plan
↓
Dynamic Re-optimization when state changes

---

# 4. YOUR CORE OBJECTIVE

The primary optimization objective is:

# MAXIMIZE EXPECTED FARMER NET REALIZATION

For a candidate mandi `m`:

Expected Net Realization:

```text
Gross Selling Value
- Transport Cost
- Storage Cost
- Expected Spoilage Loss
- Other Explicit Handling Costs
```

Conceptually:

NR(m) =
Revenue(m)
- TransportCost(m)
- StorageCost(m)
- ExpectedSpoilageLoss(m)
- HandlingCost(m)

Then:

```text
BestPlan = argmax(feasible plans, ExpectedNetRealization)
```

The optimizer must NEVER select a mandi merely because it has the highest raw price.

Example:

Mandi A = ₹20/kg
Mandi B = ₹24/kg
Mandi C = ₹22/kg

Mandi B may still be inferior if transport, storage and expected spoilage losses are sufficiently high.

---

# 5. INPUTS YOUR MODULE RECEIVES

Your module receives structured inputs from other team members and backend.

## A. FARM INPUT

Each farm should have:

```json
{
  "farm_id": "F001",
  "latitude": 22.57,
  "longitude": 88.36,
  "crop": "tomato",
  "quantity_kg": 900
}
```

Optional future fields:

```text
harvest_ready
available_from
available_until
urgency
quality_grade
storage_available
```

For MVP, do not overcomplicate the farm schema.

Minimum useful fields:

- farm_id
- latitude
- longitude
- crop
- quantity_kg

---

# 6. CROP RISK INPUT

Crop Risk Agent is owned by Person 1.

You consume its output.

Example:

```json
{
  "crop": "tomato",
  "harvest_urgency": 0.90,
  "spoilage_risk": 0.78,
  "estimated_window_hours": 36,
  "confidence": 0.82
}
```

Interpretation:

- `harvest_urgency` = urgency score
- `spoilage_risk` = estimated risk, NOT guaranteed spoilage
- `estimated_window_hours` = estimated safe/usable dispatch window
- `confidence` = model confidence

IMPORTANT:

Never treat `spoilage_risk = 0.78` as automatically meaning that 78% of the produce will definitely be lost.

If a monetary expected loss is derived from this score, define and document the mapping clearly.

Never silently invent a scientifically unjustified formula.

---

# 7. MANDI INPUT

Market Agent is owned by Person 2.

You receive candidate markets.

Example:

```json
{
  "mandi_id": "M002",
  "name": "Mandi B",
  "latitude": 22.70,
  "longitude": 88.50,
  "crop": "tomato",
  "price_per_kg": 24,
  "timestamp": "2026-08-20T15:00:00",
  "freshness": 0.95
}
```

Important fields:

- mandi_id
- name
- location
- commodity/crop
- price_per_kg
- timestamp
- freshness

DO NOT assume all prices are truly real-time.

The optimizer should support:

- timestamp validation
- freshness thresholds
- stale-data rejection or downgrade

If a price is too old, the optimizer should be able to exclude it or reduce its reliability according to an explicit rule.

---

# 8. VEHICLE INPUT

Vehicle data is part of your logistics responsibility.

Example:

```json
{
  "vehicle_id": "T07",
  "capacity_kg": 5000,
  "available": true,
  "current_lat": 22.55,
  "current_lon": 88.34,
  "cost_per_km": 35,
  "cost_per_hour": 150,
  "refrigerated": true
}
```

Potential fields:

- vehicle_id
- capacity_kg
- availability
- current location
- cost_per_km
- cost_per_hour
- refrigerated
- available_from
- available_until

Critical constraint:

```text
Cluster quantity <= Vehicle capacity
```

Do NOT assign 6 tonnes of produce to a 5-tonne truck.

---

# 9. ROAD / ROUTING INPUT

The optimizer needs a graph/network representation.

Nodes:

- farms
- mandis
- vehicle starting points
- optional warehouses/storage facilities

Edges can contain:

- distance
- travel time
- transport cost
- road availability

Example:

```json
{
  "from": "F1",
  "to": "F2",
  "distance_km": 8,
  "travel_time_min": 18
}
```

For the MVP, a synthetic/preprocessed graph is acceptable.

Do not spend excessive hackathon time building a nationwide routing infrastructure.

For actual route optimization, evaluate appropriate algorithms/libraries.

NetworkX can represent/analyze graphs and calculate shortest paths.

For vehicle-routing problems with capacity/time-window constraints, OR-Tools may be more appropriate.

Do not claim NetworkX alone performs sophisticated VRP optimization unless that is actually implemented.

---

# 10. COST INPUTS

The optimizer may receive simulation/configuration parameters:

```json
{
  "cost_per_km": 35,
  "cost_per_hour": 150,
  "loading_cost": 500,
  "unloading_cost": 300,
  "storage_cost_per_kg_hour": 0.05
}
```

During the hackathon these may be synthetic/simulation parameters.

Clearly label them as such.

Do not present arbitrary simulated costs as real-world measured values.

---

# 11. TIME IS AN INPUT

The system is dynamic.

Therefore every optimization state should contain:

```text
current_time
```

Time matters because:

- vehicle availability changes
- market prices change
- crop urgency changes
- estimated spoilage risk changes
- travel time changes
- storage duration changes

Do not design the optimizer as a static one-time calculator.

---

# 12. FARM CLUSTERING

Implement farm grouping.

Goal:

> Pool geographically compatible farms into transport clusters.

Example:

```text
F1 = 0.9 t
F2 = 1.0 t
F3 = 0.7 t
F4 = 1.1 t
F5 = 0.9 t

Total = 4.6 t
```

If a 5-tonne truck is available:

```text
4.6 / 5.0 tonnes
92% utilization
```

The clustering algorithm should consider, depending on implementation:

- geographical proximity
- crop compatibility
- quantity
- vehicle capacity
- urgency
- destination compatibility

For MVP:

1. Geographic grouping
2. Capacity validation
3. Split oversized clusters

Do not over-engineer this before the basic optimizer works.

---

# 13. VEHICLE ASSIGNMENT

For each farm cluster:

Find feasible vehicles.

Constraints may include:

```text
quantity <= capacity
vehicle.available == true
vehicle compatible with crop requirements
vehicle available during dispatch window
```

Objective:

Minimize transport cost while satisfying constraints.

Do not simply select the largest vehicle.

Consider utilization and cost.

---

# 14. ROUTE OPTIMIZATION

For a farm cluster, calculate:

```text
Farm → Farm → Farm → ... → Mandi
```

Example:

```text
F3 → F1 → F5 → F2 → F4 → Mandi C
```

Optimize based on:

- total distance
- travel time
- transport cost
- vehicle capacity
- pickup constraints
- dispatch time
- perishability/urgency where appropriate

For MVP, implement a clear, explainable routing algorithm.

Then improve it if time permits.

---

# 15. TRANSPORT COST

Start with:

```text
TransportCost = Distance × CostPerKm
```

Optionally extend:

```text
TransportCost =
Distance × CostPerKm
+
TravelTime × CostPerHour
+
LoadingCost
+
UnloadingCost
+
TollCost
```

Do not introduce unnecessary variables unless they improve the model.

---

# 16. EXPECTED SPOILAGE LOSS

This is a critical part.

Conceptually:

```text
ExpectedSpoilageLoss =
Quantity × Value × ExpectedLossFraction
```

However, do not blindly equate the risk score with the loss fraction.

Example:

If:

```text
spoilage_risk = 0.78
```

that means:

> high estimated risk

not:

> exactly 78% of produce will spoil.

Create an explicit mapping or model.

Document the assumption.

The model must be explainable.

---

# 17. STORAGE DECISION

Storage should be an optional constraint, not a mandatory assumption.

Potential choices:

```text
OPTION A:
Sell immediately

OPTION B:
Store temporarily and sell later

OPTION C:
Sell at another mandi immediately
```

For MVP, storage can be simplified or omitted if reliable storage data is unavailable.

If storage is implemented:

```text
StorageCost =
StorageDuration × Quantity × StorageRate
```

and additional spoilage exposure should be considered.

---

# 18. FINAL DECISION

For every feasible candidate plan:

Calculate:

```text
gross_revenue
transport_cost
storage_cost
expected_spoilage_loss
handling_cost
expected_net_realization
```

Then rank all feasible plans.

Return:

```text
best_plan
```

with reasoning.

Example:

```json
{
  "selected_mandi": "Mandi C",
  "vehicle_id": "T09",
  "farms": ["F3", "F1", "F5", "F2", "F4"],
  "total_quantity_kg": 4600,
  "route": ["F3", "F1", "F5", "F2", "F4", "Mandi C"],
  "distance_km": 42.7,
  "transport_cost": 8200,
  "storage_cost": 0,
  "expected_spoilage_loss": 3100,
  "gross_revenue": 101200,
  "expected_net_realization": 79900,
  "net_realization_per_kg": 17.37,
  "vehicle_utilization": 0.92,
  "status": "OPTIMAL"
}
```

Numbers above are examples only.

Do not hardcode them.

---

# 19. DYNAMIC RE-OPTIMIZATION IS MANDATORY

The project is called KISAN GUARD and is fundamentally dynamic.

Your optimizer must support:

```text
Current State
↓
Optimization
↓
Action
↓
Environment Change
↓
Updated State
↓
Re-optimization
↓
New Action
```

Implement at least two dynamic events.

## EVENT 1 — PRICE SHOCK

Initial:

```text
Mandi B = ₹24/kg
```

Recommendation:

```text
B
```

Then:

```text
Mandi B = ₹18/kg
```

Run optimizer again.

Potentially:

```text
C becomes optimal
```

The result must be calculated, not hardcoded.

## EVENT 2 — VEHICLE FAILURE

Initial:

```text
T07 = available
```

Then:

```text
T07 = unavailable
```

The optimizer must:

1. Remove T07 from feasible vehicles
2. Recalculate capacity
3. Find alternative vehicle(s)
4. Recalculate route
5. Recalculate transport cost
6. Recalculate expected net realization
7. Return new feasible plan

Optional future event:

## EVENT 3 — WEATHER/SPOILAGE SHOCK

Increase crop risk.

The optimizer should potentially favor faster/closer dispatch options if the economics justify it.

---

# 20. WHAT-IF SIMULATOR

If time permits, expose:

```text
PRICE SHOCK
TRUCK FAILURE
WEATHER SHOCK
SPOILAGE RISK ↑
FUEL COST ↑
```

Each scenario should modify the input state.

Then:

```text
RE-OPTIMIZE
```

The output should change based on calculations.

This is one of the most important demo features.

---

# 21. YOUR CODE ARCHITECTURE

Use a clean modular structure.

Suggested:

```text
optimization/
│
├── models.py
├── clustering.py
├── vehicle_assignment.py
├── routing.py
├── cost_model.py
├── spoilage_loss.py
├── constraints.py
├── decision_engine.py
├── reoptimizer.py
├── simulator.py
│
└── tests/
    ├── test_clustering.py
    ├── test_vehicle_assignment.py
    ├── test_routing.py
    ├── test_cost_model.py
    ├── test_decision_engine.py
    └── test_reoptimization.py
```

Keep responsibilities separated.

Do not create one 1,000-line Python file.

---

# 22. REQUIRED FIRST TEST INPUT

Before building a frontend, create one deterministic test scenario:

## FARMS

```text
F1 = 0.9 tonnes
F2 = 1.0 tonnes
F3 = 0.7 tonnes
F4 = 1.1 tonnes
F5 = 0.9 tonnes
```

Total:

```text
4.6 tonnes
```

## MANDIS

```text
A = ₹20/kg
B = ₹24/kg
C = ₹22/kg
```

with different distances.

## VEHICLES

```text
T07 = 5 tonnes
T09 = 7 tonnes
```

## CROP

```text
Tomato
```

## RISK

```text
Urgency = HIGH
Spoilage Risk = HIGH
```

The optimizer must generate a mathematically explainable plan.

Then run the price-shock and vehicle-failure scenarios.

---

# 23. TESTING REQUIREMENTS

Create at least these tests:

### TEST 1
Normal optimization.

### TEST 2
Vehicle capacity constraint.

### TEST 3
Vehicle unavailable.

### TEST 4
Mandi price shock.

### TEST 5
High spoilage risk.

### TEST 6
No feasible vehicle.

### TEST 7
Stale mandi price.

### TEST 8
Multiple vehicles.

The optimizer should fail safely.

If there is no feasible plan, return:

```text
NO_FEASIBLE_PLAN
```

with an explanation.

Do NOT silently produce an invalid plan.

---

# 24. BENCHMARKING

Compare:

### Baseline

Example:

> Nearest mandi / highest-price mandi / unpooled transport

versus:

### KISAN GUARD

Measure:

- expected net realization
- total distance
- transport cost
- truck utilization
- expected spoilage loss
- computation time

Do not fabricate real-world savings.

For synthetic experiments label:

**Simulation Result**

---

# 25. API CONTRACT WITH PERSON 4

Person 4 will integrate your optimizer into the backend.

Your module should eventually expose a clean function/API such as:

```python
optimize_dispatch(state)
```

Input:

```json
{
  "current_time": "...",
  "farms": [],
  "mandis": [],
  "vehicles": [],
  "crop_risk": {},
  "road_network": {},
  "cost_parameters": {}
}
```

Output:

```json
{
  "status": "OPTIMAL",
  "selected_mandi": "...",
  "vehicle_id": "...",
  "route": [],
  "cost_breakdown": {},
  "expected_net_realization": 0,
  "explanation": {}
}
```

Person 4 should not need to know the internal optimization implementation.

---

# 26. WHAT YOU MUST NOT BUILD FIRST

Do NOT start with:

- Reinforcement learning
- Deep learning routing
- blockchain
- AR/VR
- complicated cold-chain hardware
- nationwide routing
- complex autonomous negotiation
- fancy map UI
- LLM-generated financial decisions

First make:

```text
INPUT
↓
CORRECT OPTIMIZATION
↓
OUTPUT
```

work reliably.

---

# 27. IMPORTANT ENGINEERING PRINCIPLE

The optimizer must be:

### Deterministic
Same input → same result.

### Explainable
Every cost/result should have a reason.

### Constraint-aware
Never violate capacity/availability.

### Dynamic
Can recompute when the environment changes.

### Modular
Backend can call it without knowing internals.

### Testable
Can be tested without frontend.

---

# 28. YOUR SUCCESS CRITERIA

Your work is considered successful when the following command/function works:

```text
optimize_dispatch(state)
```

and produces a valid plan.

Then:

```text
simulate_price_shock(state)
```

changes the market state.

Then:

```text
reoptimize(updated_state)
```

produces a potentially different recommendation.

Then:

```text
simulate_vehicle_failure(state)
```

removes the vehicle.

Then:

```text
reoptimize(updated_state)
```

finds a new feasible vehicle/route or correctly reports:

```text
NO_FEASIBLE_PLAN
```

---

# 29. YOUR FINAL DEMO

Your module should support this exact demonstration:

```text
5 FARMERS
↓
4.6 TONNES
↓
3 MANDIS
↓
2 VEHICLES
↓
OPTIMIZE
↓
🏆 MANDI B
↓
PRICE SHOCK
B: ₹24 → ₹18
↓
RE-OPTIMIZE
↓
🏆 MANDI C
↓
TRUCK T07 FAILURE
↓
RE-OPTIMIZE
↓
T09 + NEW ROUTE
↓
✓ FINAL FEASIBLE PLAN
```

This demonstrates that KISAN GUARD is not a static recommendation system.

It is a dynamic decision engine.

---

# 30. PERSISTENT PROJECT MEMORY FILE — MANDATORY

Before doing substantial implementation work, create:

# `OPTIMIZATION_CONTEXT.md`

This file is the persistent memory for your work.

It must contain:

1. Complete KISAN GUARD project overview
2. Your role as Person 3
3. System architecture
4. Input schemas
5. Output schemas
6. Optimization objective
7. Mathematical formulas
8. Constraints
9. Algorithms chosen
10. Assumptions
11. Data sources
12. Synthetic-data assumptions
13. Dynamic events
14. API contract with backend
15. File/folder structure
16. Completed features
17. Pending features
18. Known bugs
19. Design decisions
20. Test scenarios
21. Benchmark results
22. Things explicitly NOT implemented
23. Future improvements

IMPORTANT:

Whenever a major architecture/design decision changes, update this file.

Do not rely only on conversation memory.

At the beginning of future sessions, read `OPTIMIZATION_CONTEXT.md` before modifying the project.

---

# 31. HOW YOU SHOULD WORK

Do not immediately dump hundreds of lines of code.

First:

### STEP 1
Inspect the repository/project structure.

### STEP 2
Create/update `OPTIMIZATION_CONTEXT.md`.

### STEP 3
Identify existing code/data/contracts.

### STEP 4
Tell me what already exists.

### STEP 5
Define the schemas.

### STEP 6
Build the smallest working optimizer.

### STEP 7
Test it.

### STEP 8
Add dynamic re-optimization.

### STEP 9
Expose a clean interface for Person 4.

### STEP 10
Only then optimize/refactor/extend.

If something is unclear, do not silently invent architecture.

State the assumption explicitly.

If an implementation decision has multiple valid approaches, compare them briefly and choose the simplest robust approach suitable for a hackathon MVP.

---

# 32. FINAL PRODUCT MENTAL MODEL

Always remember:

KISAN GUARD is NOT:

> "Three AI agents chatting."

It is:

```text
🌱 CROP RISK
      +
💰 MARKET
      +
🚚 LOGISTICS
      ↓
🧠 OPTIMIZATION
      ↓
🏆 BEST FEASIBLE ACTION
      ↓
🔄 CHANGING ENVIRONMENT
      ↓
🧠 RE-OPTIMIZATION
```

Your specific responsibility is the middle:

# 🚚 → 🧠 → 🏆 → 🔄

You own the system that converts:

**agricultural + market + logistics state**

into:

**the best economically and operationally feasible dispatch plan.**

---

# 33. CURRENT IMPLEMENTATION + DEVELOPER HANDOFF

This repository now contains a working Person 3 MVP. Before making changes,
read these files in order:

1. `OPTIMIZATION_CONTEXT.md` — current architecture, formulas, constraints, and known limits
2. `INTEGRATION_GUIDE.md` — setup, merge contract, API examples, and safe extension points
3. `database.py` — local SQLite prototype data adapter
4. `optimization/` — the deterministic backend-neutral decision engine

## Current data flow

```text
SQLite prototype data
    → database.load_state()
    → optimization.optimize_dispatch(state)
    → FastAPI response / backend integration
```

The local database file is `data/kisan_guard.db`. It is created and seeded on
first use and contains synthetic farms, mandis, vehicles, road edges, crop risk,
and cost parameters. Never present these values as real-world data.

## Stable integration contract

For Python integration, use:

```python
from database import load_state
from optimization import optimize_dispatch

plan = optimize_dispatch(load_state())
```

Keep `optimize_dispatch(state)` independent of SQL, HTTP, and frontend code.
When another backend has its own database, replace `load_state()` with an adapter
that produces the same structured state; do not rewrite the optimizer first.

## Prototype endpoints

```text
GET  /health
POST /optimize
POST /simulate/price-shock       {"mandi_id":"B","price_per_kg":18}
POST /simulate/vehicle-failure   {"vehicle_id":"T07"}
POST /reset-demo
```

Price shocks and vehicle failures are persisted to local SQLite. Run
`POST /reset-demo` before a new demonstration to restore the synthetic scenario.

## Developer startup checklist

```text
1. Install: python -m pip install -r requirements.txt
2. Test: python -m pytest tests -q -p no:cacheprovider
3. Start API: uvicorn api:app --reload
4. Read the integration guide before changing public contracts
```

Do not remove deterministic capacity, availability, routing, freshness, and
cost checks when integrating. Any new external data source must be normalized at
the adapter boundary and remain explicitly distinguishable from synthetic data.

Now begin by creating `OPTIMIZATION_CONTEXT.md`, inspecting the existing project, and then reporting the current state of the repository before implementing anything major.
