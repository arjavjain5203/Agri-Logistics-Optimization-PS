"""
Database Seed Script
Populates database with realistic test data for KrishiFlow AI
"""

from datetime import date, datetime, timedelta
from sqlalchemy.orm import Session
from app.db.database import SessionLocal, engine, Base
from app.models import Farmer, Product, Buyer, Demand, Order


def clear_database():
    """Drop all tables and recreate them"""
    print("🗑️  Clearing existing database...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    print("✅ Database cleared and recreated")


def seed_farmers(db: Session):
    """Seed farmer data"""
    print("👨‍🌾 Seeding farmers...")
    
    farmers_data = [
        {
            "id": "f1",
            "name": "Ramesh Kumar",
            "name_hi": "रमेश कुमार",
            "phone": "+91 98112 45892",
            "location": "Dadri, Greater Noida",
            "location_hi": "दादरी, ग्रेटर नोएडा",
            "latitude": 28.552,
            "longitude": 77.554,
            "is_fpo": False,
            "verified": True,
            "rating": 4.9
        },
        {
            "id": "f2",
            "name": "Sita Devi",
            "name_hi": "सीता देवी",
            "phone": "+91 97184 33219",
            "location": "Dadri Rural Hub",
            "location_hi": "दादरी ग्रामीण हब",
            "latitude": 28.538,
            "longitude": 77.589,
            "is_fpo": False,
            "verified": True,
            "rating": 4.8
        },
        {
            "id": "f3",
            "name": "Green Valley FPO",
            "name_hi": "ग्रीन वैली FPO",
            "phone": "+91 99201 88402",
            "location": "Bulandshahr Aggregation Center",
            "location_hi": "बुलंदशहर समूहन केंद्र",
            "latitude": 28.406,
            "longitude": 77.849,
            "is_fpo": True,
            "fpo_member_count": 140,
            "verified": True,
            "rating": 4.7
        },
        {
            "id": "f4",
            "name": "Rajesh Yadav",
            "name_hi": "राजेश यादव",
            "phone": "+91 98711 55601",
            "location": "Jewar Agri Belt",
            "location_hi": "जेवर कृषि क्षेत्र",
            "latitude": 28.128,
            "longitude": 77.558,
            "is_fpo": False,
            "verified": True,
            "rating": 4.6
        },
        {
            "id": "f5",
            "name": "Anita Sharma",
            "name_hi": "अनिता शर्मा",
            "phone": "+91 96542 90123",
            "location": "Sikandrabad",
            "location_hi": "सिकंदराबाद",
            "latitude": 28.452,
            "longitude": 77.695,
            "is_fpo": False,
            "verified": True,
            "rating": 4.9
        },
        {
            "id": "f6",
            "name": "Mahesh Singh",
            "name_hi": "महेश सिंह",
            "phone": "+91 98765 43210",
            "location": "Noida Extension",
            "location_hi": "नोएडा एक्सटेंशन",
            "latitude": 28.625,
            "longitude": 77.430,
            "is_fpo": False,
            "verified": True,
            "rating": 4.7
        },
        {
            "id": "f7",
            "name": "Sunrise Farmers FPO",
            "name_hi": "सनराइज किसान FPO",
            "phone": "+91 99999 12345",
            "location": "Ghaziabad Rural",
            "location_hi": "गाज़ियाबाद ग्रामीण",
            "latitude": 28.669,
            "longitude": 77.453,
            "is_fpo": True,
            "fpo_member_count": 85,
            "verified": True,
            "rating": 4.8
        },
        {
            "id": "f8",
            "name": "Priya Verma",
            "name_hi": "प्रिया वर्मा",
            "phone": "+91 98888 77766",
            "location": "Khurja",
            "location_hi": "खुर्जा",
            "latitude": 28.252,
            "longitude": 77.858,
            "is_fpo": False,
            "verified": True,
            "rating": 4.6
        }
    ]
    
    for farmer_data in farmers_data:
        farmer = Farmer(**farmer_data)
        db.add(farmer)
    
    db.commit()
    print(f"✅ Added {len(farmers_data)} farmers")


def seed_products(db: Session):
    """Seed product/crop data"""
    print("🌾 Seeding products...")
    
    today = date.today()
    
    products_data = [
        # Ramesh Kumar's produce
        {"farmer_id": "f1", "crop_id": "tomato", "crop_name": "Tomato", "crop_name_hi": "टमाटर", 
         "quantity_kg": 250, "price_per_kg": 22, "grade": "Grade A", "harvest_date": today - timedelta(days=1), "is_available": 1},
        
        # Sita Devi's produce
        {"farmer_id": "f2", "crop_id": "tomato", "crop_name": "Tomato", "crop_name_hi": "टमाटर", 
         "quantity_kg": 150, "price_per_kg": 21, "grade": "Grade A", "harvest_date": today, "is_available": 1},
        
        # Green Valley FPO
        {"farmer_id": "f3", "crop_id": "tomato", "crop_name": "Tomato", "crop_name_hi": "टमाटर", 
         "quantity_kg": 100, "price_per_kg": 23, "grade": "Grade B", "harvest_date": today - timedelta(days=1), "is_available": 1},
        
        # Rajesh Yadav
        {"farmer_id": "f4", "crop_id": "potato", "crop_name": "Potato", "crop_name_hi": "आलू", 
         "quantity_kg": 400, "price_per_kg": 18, "grade": "Grade A", "harvest_date": today - timedelta(days=2), "is_available": 1},
        
        # Anita Sharma
        {"farmer_id": "f5", "crop_id": "onion", "crop_name": "Onion", "crop_name_hi": "प्याज़", 
         "quantity_kg": 300, "price_per_kg": 25, "grade": "Grade A", "harvest_date": today - timedelta(days=1), "is_available": 1},
        
        # Mahesh Singh
        {"farmer_id": "f6", "crop_id": "tomato", "crop_name": "Tomato", "crop_name_hi": "टमाटर", 
         "quantity_kg": 200, "price_per_kg": 22, "grade": "Grade A", "harvest_date": today, "is_available": 1},
        {"farmer_id": "f6", "crop_id": "carrot", "crop_name": "Carrot", "crop_name_hi": "गाजर", 
         "quantity_kg": 180, "price_per_kg": 28, "grade": "Grade A", "harvest_date": today, "is_available": 1},
        
        # Sunrise FPO
        {"farmer_id": "f7", "crop_id": "cauliflower", "crop_name": "Cauliflower", "crop_name_hi": "फूलगोभी", 
         "quantity_kg": 350, "price_per_kg": 24, "grade": "Grade A", "harvest_date": today - timedelta(days=1), "is_available": 1},
        {"farmer_id": "f7", "crop_id": "potato", "crop_name": "Potato", "crop_name_hi": "आलू", 
         "quantity_kg": 500, "price_per_kg": 17, "grade": "Grade A", "harvest_date": today - timedelta(days=2), "is_available": 1},
        
        # Priya Verma
        {"farmer_id": "f8", "crop_id": "onion", "crop_name": "Onion", "crop_name_hi": "प्याज़", 
         "quantity_kg": 250, "price_per_kg": 26, "grade": "Grade A", "harvest_date": today, "is_available": 1},
        {"farmer_id": "f8", "crop_id": "tomato", "crop_name": "Tomato", "crop_name_hi": "टमाटर", 
         "quantity_kg": 120, "price_per_kg": 23, "grade": "Grade B", "harvest_date": today, "is_available": 1},
        
        # Additional variety
        {"farmer_id": "f1", "crop_id": "potato", "crop_name": "Potato", "crop_name_hi": "आलू", 
         "quantity_kg": 300, "price_per_kg": 18, "grade": "Grade A", "harvest_date": today + timedelta(days=2), "is_available": 1},
        {"farmer_id": "f2", "crop_id": "carrot", "crop_name": "Carrot", "crop_name_hi": "गाजर", 
         "quantity_kg": 100, "price_per_kg": 29, "grade": "Grade A", "harvest_date": today + timedelta(days=1), "is_available": 1},
        {"farmer_id": "f4", "crop_id": "onion", "crop_name": "Onion", "crop_name_hi": "प्याज़", 
         "quantity_kg": 200, "price_per_kg": 24, "grade": "Grade B", "harvest_date": today, "is_available": 1},
        {"farmer_id": "f5", "crop_id": "cauliflower", "crop_name": "Cauliflower", "crop_name_hi": "फूलगोभी", 
         "quantity_kg": 220, "price_per_kg": 25, "grade": "Grade A", "harvest_date": today + timedelta(days=1), "is_available": 1},
    ]
    
    for product_data in products_data:
        product = Product(**product_data)
        db.add(product)
    
    db.commit()
    print(f"✅ Added {len(products_data)} products")


def seed_buyers(db: Session):
    """Seed buyer data"""
    print("🏢 Seeding buyers...")
    
    buyers_data = [
        {
            "id": "b1",
            "name": "FreshBite Restaurants",
            "name_hi": "फ्रेशबाइट रेस्टोरेंट्स",
            "location": "Sector 62, Noida",
            "location_hi": "सेक्टर 62, नोएडा",
            "latitude": 28.627,
            "longitude": 77.376,
            "contact_person": "Priya Sharma (Procurement Head)",
            "phone": "+91 99999 88888",
            "email": "priya@freshbite.in",
            "buyer_type": "restaurant",
            "monthly_volume_kg": 12500,
            "rating": 4.9
        },
        {
            "id": "b2",
            "name": "Delhi Hospitality Group",
            "name_hi": "दिल्ली हॉस्पिटैलिटी ग्रुप",
            "location": "Connaught Place, New Delhi",
            "location_hi": "कनॉट प्लेस, नई दिल्ली",
            "latitude": 28.632,
            "longitude": 77.219,
            "contact_person": "Arun Malhotra",
            "phone": "+91 98765 12345",
            "email": "arun@delhihospitality.com",
            "buyer_type": "hotel",
            "monthly_volume_kg": 28000,
            "rating": 4.8
        },
        {
            "id": "b3",
            "name": "UrbanMart Retail",
            "name_hi": "अर्बनमार्ट रिटेल",
            "location": "CyberCity, Gurugram",
            "location_hi": "साइबर सिटी, गुरुग्राम",
            "latitude": 28.495,
            "longitude": 77.089,
            "contact_person": "Kavita Chawla",
            "phone": "+91 99888 77766",
            "email": "kavita@urbanmart.in",
            "buyer_type": "retailer",
            "monthly_volume_kg": 45000,
            "rating": 4.7
        },
        {
            "id": "b4",
            "name": "Noida Foods Pvt Ltd",
            "name_hi": "नोएडा फूड्स प्राइवेट लिमिटेड",
            "location": "Ecotech III, Greater Noida",
            "location_hi": "इकोटेक III, ग्रेटर नोएडा",
            "latitude": 28.474,
            "longitude": 77.495,
            "contact_person": "Vikram Mehta",
            "phone": "+91 98111 22334",
            "email": "vikram@noidafoods.com",
            "buyer_type": "processor",
            "monthly_volume_kg": 35000,
            "rating": 4.9
        }
    ]
    
    for buyer_data in buyers_data:
        buyer = Buyer(**buyer_data)
        db.add(buyer)
    
    db.commit()
    print(f"✅ Added {len(buyers_data)} buyers")


def seed_demands(db: Session):
    """Seed demand/procurement requests"""
    print("📋 Seeding demands...")
    
    today = date.today()
    
    demands_data = [
        {
            "id": "DEM-9001",
            "buyer_id": "b1",
            "crop_id": "tomato",
            "crop_name": "Tomato",
            "quantity_kg": 500,
            "quality_grade": "Grade A",
            "delivery_location": "Sector 62, Noida",
            "delivery_latitude": 28.627,
            "delivery_longitude": 77.376,
            "required_by_date": today + timedelta(days=1),
            "max_budget_per_kg": 30,
            "status": "matched",
            "matched_farmer_ids": "f1,f2,f3"
        },
        {
            "id": "DEM-9002",
            "buyer_id": "b2",
            "crop_id": "potato",
            "crop_name": "Potato",
            "quantity_kg": 1200,
            "quality_grade": "Grade A",
            "delivery_location": "Connaught Place, New Delhi",
            "delivery_latitude": 28.632,
            "delivery_longitude": 77.219,
            "required_by_date": today + timedelta(days=3),
            "max_budget_per_kg": 25,
            "status": "confirmed",
            "matched_farmer_ids": "f4,f7"
        },
        {
            "id": "DEM-9003",
            "buyer_id": "b3",
            "crop_id": "onion",
            "crop_name": "Onion",
            "quantity_kg": 800,
            "quality_grade": "Grade B",
            "delivery_location": "CyberCity, Gurugram",
            "delivery_latitude": 28.495,
            "delivery_longitude": 77.089,
            "required_by_date": today + timedelta(days=2),
            "max_budget_per_kg": 28,
            "status": "completed",
            "matched_farmer_ids": "f5,f8"
        }
    ]
    
    for demand_data in demands_data:
        demand = Demand(**demand_data)
        db.add(demand)
    
    db.commit()
    print(f"✅ Added {len(demands_data)} demands")


def seed_orders(db: Session):
    """Seed orders"""
    print("📦 Seeding orders...")
    
    today = date.today()
    
    orders_data = [
        {
            "id": "KF-ORD-8821",
            "demand_id": "DEM-9001",
            "crop_name": "Tomato",
            "crop_name_hi": "टमाटर",
            "total_quantity_kg": 500,
            "grade": "Grade A",
            "total_amount": 13500,
            "blended_price_per_kg": 21.9,
            "supplier_count": 3,
            "supplier_ids": "f1,f2,f3",
            "status": "inTransit",
            "optimized_distance_km": 42,
            "estimated_cost_inr": 850,
            "order_date": today,
            "delivery_date": today
        },
        {
            "id": "KF-ORD-8804",
            "demand_id": "DEM-9002",
            "crop_name": "Potato",
            "crop_name_hi": "आलू",
            "total_quantity_kg": 1200,
            "grade": "Grade A",
            "total_amount": 21600,
            "blended_price_per_kg": 18,
            "supplier_count": 4,
            "supplier_ids": "f4,f7",
            "status": "delivered",
            "optimized_distance_km": 68,
            "estimated_cost_inr": 1360,
            "order_date": today - timedelta(days=2),
            "delivery_date": today - timedelta(days=1)
        },
        {
            "id": "KF-ORD-8790",
            "demand_id": "DEM-9003",
            "crop_name": "Onion",
            "crop_name_hi": "प्याज़",
            "total_quantity_kg": 800,
            "grade": "Grade B",
            "total_amount": 20000,
            "blended_price_per_kg": 25,
            "supplier_count": 2,
            "supplier_ids": "f5,f8",
            "status": "delivered",
            "optimized_distance_km": 55,
            "estimated_cost_inr": 1100,
            "order_date": today - timedelta(days=5),
            "delivery_date": today - timedelta(days=4)
        }
    ]
    
    for order_data in orders_data:
        order = Order(**order_data)
        db.add(order)
    
    db.commit()
    print(f"✅ Added {len(orders_data)} orders")


def seed_all():
    """Run all seed functions"""
    print("\n🌱 Starting database seeding...\n")
    
    # Clear existing data
    clear_database()
    
    # Create database session
    db = SessionLocal()
    
    try:
        # Seed in order (respecting foreign keys)
        seed_farmers(db)
        seed_products(db)
        seed_buyers(db)
        seed_demands(db)
        seed_orders(db)
        
        print("\n✨ Database seeding completed successfully!\n")
        
    except Exception as e:
        print(f"\n❌ Error during seeding: {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_all()
