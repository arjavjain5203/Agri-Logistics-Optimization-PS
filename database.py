"""SQLite persistence for the synthetic KISAN GUARD prototype scenario."""

from __future__ import annotations

import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "data" / "kisan_guard.db"
CURRENT_TIME = "2026-08-20T15:00:00+05:30"

SCHEMA = """
CREATE TABLE IF NOT EXISTS farms (farm_id TEXT PRIMARY KEY, crop TEXT NOT NULL, quantity_kg REAL NOT NULL);
CREATE TABLE IF NOT EXISTS mandis (mandi_id TEXT PRIMARY KEY, name TEXT NOT NULL, crop TEXT NOT NULL, price_per_kg REAL NOT NULL, timestamp TEXT NOT NULL, freshness REAL NOT NULL);
CREATE TABLE IF NOT EXISTS vehicles (vehicle_id TEXT PRIMARY KEY, node_id TEXT NOT NULL, capacity_kg REAL NOT NULL, available INTEGER NOT NULL, refrigerated INTEGER NOT NULL);
CREATE TABLE IF NOT EXISTS road_edges (origin TEXT NOT NULL, destination TEXT NOT NULL, distance_km REAL NOT NULL, travel_time_min REAL NOT NULL, one_way INTEGER NOT NULL DEFAULT 0);
CREATE TABLE IF NOT EXISTS crop_risk (crop TEXT PRIMARY KEY, harvest_urgency REAL NOT NULL, spoilage_risk REAL NOT NULL, estimated_window_hours REAL NOT NULL, confidence REAL NOT NULL);
CREATE TABLE IF NOT EXISTS cost_parameters (key TEXT PRIMARY KEY, value REAL NOT NULL);
CREATE TABLE IF NOT EXISTS scenario_metadata (key TEXT PRIMARY KEY, value TEXT NOT NULL);
"""

FARMS = [("F1", "tomato", 900), ("F2", "tomato", 1000), ("F3", "tomato", 700), ("F4", "tomato", 1100), ("F5", "tomato", 900)]
MANDIS = [("A", "Mandi A", "tomato", 20, "2026-08-20T14:00:00+05:30", .95), ("B", "Mandi B", "tomato", 24, "2026-08-20T14:00:00+05:30", .95), ("C", "Mandi C", "tomato", 22, "2026-08-20T14:00:00+05:30", .95)]
VEHICLES = [("T07", "T07", 5000, 1, 1), ("T09", "T09", 7000, 1, 1)]
EDGES = [("T07", "F1", 2, 5, 0), ("T09", "F1", 4, 9, 0), ("F1", "F2", 3, 7, 0), ("F2", "F3", 3, 7, 0), ("F3", "F4", 4, 9, 0), ("F4", "F5", 3, 7, 0), ("F5", "A", 8, 18, 0), ("F5", "B", 14, 31, 0), ("F5", "C", 10, 22, 0)]
RISK = [("tomato", .9, .78, 36, .82)]
COSTS = {"cost_per_km": 35, "cost_per_hour": 150, "loading_cost": 500, "unloading_cost": 300, "storage_cost_per_kg_hour": .05, "max_price_age_hours": 6, "risk_loss_multiplier": .25, "max_loss_fraction": .4}


def connect(db_path: Path | str = DB_PATH) -> sqlite3.Connection:
    path = Path(db_path)
    path.parent.mkdir(parents=True, exist_ok=True)
    connection = sqlite3.connect(path)
    connection.row_factory = sqlite3.Row
    return connection


def reset_demo(db_path: Path | str = DB_PATH) -> None:
    """Replace mutable prototype records with the documented synthetic scenario."""
    with connect(db_path) as db:
        db.executescript(SCHEMA)
        for table in ("farms", "mandis", "vehicles", "road_edges", "crop_risk", "cost_parameters", "scenario_metadata"):
            db.execute(f"DELETE FROM {table}")
        db.executemany("INSERT INTO farms VALUES (?, ?, ?)", FARMS)
        db.executemany("INSERT INTO mandis VALUES (?, ?, ?, ?, ?, ?)", MANDIS)
        db.executemany("INSERT INTO vehicles VALUES (?, ?, ?, ?, ?)", VEHICLES)
        db.executemany("INSERT INTO road_edges VALUES (?, ?, ?, ?, ?)", EDGES)
        db.executemany("INSERT INTO crop_risk VALUES (?, ?, ?, ?, ?)", RISK)
        db.executemany("INSERT INTO cost_parameters VALUES (?, ?)", COSTS.items())
        db.executemany("INSERT INTO scenario_metadata VALUES (?, ?)", [("current_time", CURRENT_TIME), ("dataset_label", "Synthetic prototype data")])


def initialize(db_path: Path | str = DB_PATH) -> None:
    with connect(db_path) as db:
        db.executescript(SCHEMA)
        has_seed = db.execute("SELECT 1 FROM scenario_metadata WHERE key = 'current_time'").fetchone()
    if not has_seed:
        reset_demo(db_path)


def load_state(db_path: Path | str = DB_PATH) -> dict:
    initialize(db_path)
    with connect(db_path) as db:
        metadata = dict(db.execute("SELECT key, value FROM scenario_metadata"))
        return {
            "current_time": metadata["current_time"],
            "farms": [dict(row) for row in db.execute("SELECT farm_id, crop, quantity_kg FROM farms ORDER BY farm_id")],
            "mandis": [dict(row) for row in db.execute("SELECT mandi_id, name, crop, price_per_kg, timestamp, freshness FROM mandis ORDER BY mandi_id")],
            "vehicles": [{**dict(row), "available": bool(row["available"]), "refrigerated": bool(row["refrigerated"])} for row in db.execute("SELECT vehicle_id, node_id, capacity_kg, available, refrigerated FROM vehicles ORDER BY vehicle_id")],
            "road_network": [{"from": row["origin"], "to": row["destination"], "distance_km": row["distance_km"], "travel_time_min": row["travel_time_min"], "one_way": bool(row["one_way"])} for row in db.execute("SELECT origin, destination, distance_km, travel_time_min, one_way FROM road_edges ORDER BY rowid")],
            "crop_risk": dict(db.execute("SELECT crop, harvest_urgency, spoilage_risk, estimated_window_hours, confidence FROM crop_risk ORDER BY crop LIMIT 1").fetchone()),
            "cost_parameters": {row["key"]: row["value"] for row in db.execute("SELECT key, value FROM cost_parameters")},
        }


def update_mandi_price(mandi_id: str, price_per_kg: float, db_path: Path | str = DB_PATH) -> None:
    if price_per_kg < 0:
        raise ValueError("price_per_kg must be non-negative")
    initialize(db_path)
    with connect(db_path) as db:
        cursor = db.execute("UPDATE mandis SET price_per_kg = ? WHERE mandi_id = ?", (price_per_kg, mandi_id))
        if cursor.rowcount != 1:
            raise ValueError(f"Unknown mandi: {mandi_id}")


def fail_vehicle(vehicle_id: str, db_path: Path | str = DB_PATH) -> None:
    initialize(db_path)
    with connect(db_path) as db:
        cursor = db.execute("UPDATE vehicles SET available = 0 WHERE vehicle_id = ?", (vehicle_id,))
        if cursor.rowcount != 1:
            raise ValueError(f"Unknown vehicle: {vehicle_id}")
