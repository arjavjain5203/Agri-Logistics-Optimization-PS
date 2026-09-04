"""
Simple script to create database tables.
Run this after ensuring PostgreSQL is installed and running.
"""

from app.db.database import engine, Base
from app.models.farmer import Farmer
from app.models.product import Product
from app.models.buyer import Buyer
from app.models.demand import Demand
from app.models.order import Order

def create_tables():
    """Create all database tables"""
    try:
        print("Creating database tables...")
        Base.metadata.create_all(bind=engine)
        print("✅ All tables created successfully!")
        return True
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        print("\nMake sure:")
        print("1. PostgreSQL is installed and running")
        print("2. Database 'krishiflow_db' exists")
        print("3. User 'krishiflow' with password 'krishiflow123' exists")
        print("\nTo create database and user, run these SQL commands:")
        print("  CREATE DATABASE krishiflow_db;")
        print("  CREATE USER krishiflow WITH PASSWORD 'krishiflow123';")
        print("  GRANT ALL PRIVILEGES ON DATABASE krishiflow_db TO krishiflow;")
        return False

if __name__ == "__main__":
    create_tables()
