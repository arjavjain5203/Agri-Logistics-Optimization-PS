# 🚀 Complete Testing Guide - AgriFlow AI Platform

## ✅ Integration Status

**ML Model:** ✅ Integrated with backend  
**Services:** Backend, ML Service, Frontend  
**Database:** PostgreSQL with seed data  

---

## 📋 Prerequisites Check

Before starting, ensure you have:

- [ ] Python 3.9+ installed
- [ ] Node.js 16+ and npm installed
- [ ] PostgreSQL 14+ installed and running
- [ ] Git installed
- [ ] Windows PowerShell

---

## 🎯 Complete Setup & Testing Procedure

### Phase 1: Database Setup (5 minutes)

#### Step 1.1: Verify PostgreSQL is Running

```powershell
# Check if PostgreSQL service is running
Get-Service -Name postgresql*

# If not running, start it
Start-Service postgresql-x64-14  # Adjust version number
```

#### Step 1.2: Create Database

```powershell
# Open PostgreSQL command line
psql -U postgres

# In psql prompt, run:
CREATE DATABASE krishiflow_db;
CREATE USER krishiflow_user WITH PASSWORD 'krishiflow_pass';
GRANT ALL PRIVILEGES ON DATABASE krishiflow_db TO krishiflow_user;
\q
```

#### Step 1.3: Verify Database

```powershell
psql -U krishiflow_user -d krishiflow_db -h localhost

# In psql prompt:
\dt  # Should show empty (no tables yet)
\q
```

---

### Phase 2: Backend Setup (10 minutes)

#### Step 2.1: Navigate to Backend

```powershell
cd backend
```

#### Step 2.2: Create Virtual Environment

```powershell
# Create venv
python -m venv venv

# Activate it
.\venv\Scripts\activate

# Verify activation (you should see (venv) in prompt)
```

#### Step 2.3: Install Dependencies

```powershell
# Upgrade pip first
python -m pip install --upgrade pip

# Install all requirements
pip install -r requirements.txt

# Verify key packages
pip list | Select-String -Pattern "fastapi|sqlalchemy|httpx|psycopg2"
```

**Expected output:**
```
fastapi        0.104.1
httpx          0.25.2
psycopg2-binary 2.9.9
sqlalchemy     2.0.23
```

#### Step 2.4: Verify Environment File

Check if `.env` exists in backend directory:

```powershell
Get-Content .env
```

**Should contain:**
```
DATABASE_URL=postgresql://krishiflow_user:krishiflow_pass@localhost/krishiflow_db
SECRET_KEY=your-secret-key-here
DEBUG=True
```

If file doesn't exist, create it with above content.

#### Step 2.5: Initialize Database

```powershell
# Create tables
python -c "from app.db.database import init_db; init_db()"

# Seed data
python app/db/seed_data.py
```

**Expected output:**
```
✅ Database tables created
✅ 8 farmers added
✅ 15 products added
✅ 4 buyers added
✅ 3 demands added
✅ 3 orders added
Database seeding completed successfully!
```

#### Step 2.6: Test Backend Startup

```powershell
# Start backend (test mode)
python main.py
```

**Expected output:**
```
INFO:     Started server process
INFO:     Waiting for application startup.
INFO:     Application startup complete.
INFO:     Uvicorn running on http://0.0.0.0:8000
```

Press `Ctrl+C` to stop for now.

---

### Phase 3: ML Service Setup (10 minutes)

#### Step 3.1: Open New Terminal

Keep backend terminal open, open a NEW PowerShell terminal.

#### Step 3.2: Navigate to ML Directory

```powershell
cd "SIH 26033 AI ML part"
```

#### Step 3.3: Create ML Virtual Environment

```powershell
# Create separate venv for ML
python -m venv venv_ml

# Activate it
.\venv_ml\Scripts\activate

# Verify activation
```

#### Step 3.4: Install ML Dependencies

```powershell
# Upgrade pip
python -m pip install --upgrade pip

# Install requirements
pip install -r requirements.txt

# Verify critical packages
pip list | Select-String -Pattern "lightgbm|fastapi|pandas"
```

**Expected output:**
```
fastapi        0.110.0
lightgbm       4.3.0
pandas         2.2.1
```

#### Step 3.5: Verify ML Model Files

```powershell
# Check if model exists
Test-Path models/lightgbm_model.pkl

# Check if data exists
Test-Path data/processed/clean_mandi_data.parquet

# Check file sizes
Get-ChildItem models/lightgbm_model.pkl | Select-Object Name, Length
Get-ChildItem data/processed/clean_mandi_data.parquet | Select-Object Name, Length
```

**Expected:**
```
lightgbm_model.pkl: ~2.8 MB
clean_mandi_data.parquet: ~54 MB
```

#### Step 3.6: Test ML Service Startup

```powershell
# Start ML service
uvicorn api.main:app --host 0.0.0.0 --port 8001 --reload
```

**Expected output:**
```
INFO:     Will watch for changes in these directories: ['...']
INFO:     Uvicorn running on http://0.0.0.0:8001
INFO:     Started reloader process
INFO:     Started server process
INFO | __main__ | LightGBM predictor loaded successfully.
INFO:     Application startup complete.
```

Keep this running! Open another terminal for frontend.

---

### Phase 4: Frontend Setup (5 minutes)

#### Step 4.1: Open Third Terminal

Keep backend and ML service running.

#### Step 4.2: Navigate to Frontend

```powershell
cd frontend
```

#### Step 4.3: Install Dependencies

```powershell
# Install npm packages
npm install

# Verify installation
npm list react react-router-dom
```

#### Step 4.4: Check Environment Configuration

```powershell
Get-Content .env
```

**Should contain:**
```
VITE_API_BASE_URL=http://localhost:8000
```

If missing, create the file with above content.

#### Step 4.5: Start Frontend

```powershell
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

---

## 🧪 Phase 5: Complete System Testing

Now you have all three services running:
- **Terminal 1:** Backend on http://localhost:8000
- **Terminal 2:** ML Service on http://localhost:8001
- **Terminal 3:** Frontend on http://localhost:5173

### Test 1: Backend Health Check

Open new terminal:

```powershell
# Test backend health
curl http://localhost:8000/

# Test API docs
Start-Process "http://localhost:8000/docs"
```

**Expected:** API documentation page opens in browser.

### Test 2: ML Service Health Check

```powershell
# Test ML service health
curl http://localhost:8001/health

# Test ML API docs
Start-Process "http://localhost:8001/docs"
```

**Expected JSON response:**
```json
{
  "status": "online",
  "version": "5.0.0",
  "model_loaded": true,
  "active_orders": 0
}
```

### Test 3: Database Connection

```powershell
# Test products endpoint
curl http://localhost:8000/api/products

# Should return list of products
```

### Test 4: ML Integration Test

```powershell
# Test ML prediction through backend
curl "http://localhost:8000/api/intelligence/forecast?crop=tomato&region=noida&horizon_days=14"
```

**Expected JSON with:**
- `predicted_demand_kg`
- `current_supply_kg`
- `supply_gap_kg`
- `ml_service_status: "active"`
- `ml_model_info` object

### Test 5: Frontend Access

Open browser: http://localhost:5173

**Expected:** Landing page loads with:
- Navigation header
- Hero carousel
- Quick action buttons

---

## 🎯 Feature Testing Checklist

### 5.1 Landing Page
- [ ] Page loads without errors
- [ ] Hero carousel auto-rotates
- [ ] Language toggle works (English/Hindi)
- [ ] Quick action buttons visible
- [ ] Login button works

### 5.2 Farmer Dashboard

**Access:** Click "I'm a Farmer" → Login (skip auth for demo)

Test these features:

#### My Products
- [ ] View existing products
- [ ] Add new product (click "Add Product")
- [ ] Edit product details
- [ ] View product statistics

#### Orders
- [ ] View incoming orders
- [ ] See order details (buyer, quantity, price)
- [ ] Order status display

#### Demand Intelligence
- [ ] View crop demand forecasts
- [ ] See recommended crops
- [ ] View market prices

### 5.3 Buyer Dashboard

**Access:** Click "I'm a Buyer" → Login

Test these features:

#### Marketplace
- [ ] Browse available products
- [ ] Search/filter products
- [ ] View product details
- [ ] See farmer information

#### Create Procurement Request
- [ ] Fill procurement form
- [ ] Select crop type
- [ ] Enter quantity
- [ ] Set budget
- [ ] Submit request

#### Smart Matching
- [ ] View matched suppliers
- [ ] See matching scores
- [ ] View supplier details
- [ ] Distance calculations

#### Order Tracking
- [ ] View active orders
- [ ] Track order status
- [ ] See delivery timeline

### 5.4 ML-Powered Features

#### Demand Intelligence (Most Important!)
- [ ] Select crop from dropdown
- [ ] Select region
- [ ] Click "Get Forecast"
- [ ] View prediction chart
- [ ] Check confidence score
- [ ] Read AI recommendations
- [ ] Verify ML service status shows "Active"

**Test Different Crops:**
```
- Tomato
- Onion
- Potato
- Wheat
```

**Test Different Regions:**
```
- Noida
- Delhi
- Gautam Buddha Nagar
- Agra
```

#### Smart Matching
- [ ] Create procurement request
- [ ] Run smart matching
- [ ] View matched farmers
- [ ] See optimization scores

#### Route Optimization
- [ ] Select multiple suppliers
- [ ] Run route optimization
- [ ] View optimized route
- [ ] See distance savings

### 5.5 Price Transparency
- [ ] View price breakdown
- [ ] Compare traditional vs AgriFlow
- [ ] See farmer income improvement
- [ ] View buyer cost reduction

### 5.6 Impact Dashboard
- [ ] View economic impact metrics
- [ ] See operational efficiency
- [ ] Check environmental impact
- [ ] View social impact stats

---

## 🔍 API Testing (Advanced)

### Test All Backend Endpoints

```powershell
# Products
curl http://localhost:8000/api/products
curl http://localhost:8000/api/products/crops

# Farmers
curl http://localhost:8000/api/farmers
curl "http://localhost:8000/api/farmers/1"

# Buyers
curl http://localhost:8000/api/buyers

# Demands
curl -X POST http://localhost:8000/api/demands `
  -H "Content-Type: application/json" `
  -d '{
    "buyer_id": 1,
    "crop_id": "tomato",
    "quantity_kg": 500,
    "budget_per_kg": 30,
    "delivery_location": "Noida",
    "urgency": "medium"
  }'

# Smart Matching
curl -X POST http://localhost:8000/api/intelligence/match `
  -H "Content-Type: application/json" `
  -d '{
    "crop_id": "tomato",
    "quantity_kg": 500,
    "buyer_latitude": 28.5355,
    "buyer_longitude": 77.3910,
    "max_budget_per_kg": 30,
    "quality_grade": "Grade A",
    "max_distance_km": 100
  }'

# ML Forecast (The Star Feature!)
curl "http://localhost:8000/api/intelligence/forecast?crop=tomato&region=noida&horizon_days=14"

# Price Transparency
curl "http://localhost:8000/api/intelligence/price-transparency?crop=tomato&quantity_kg=500"

# Impact Metrics
curl http://localhost:8000/api/intelligence/impact
```

### Test ML Service Directly

```powershell
# Health check
curl http://localhost:8001/health

# Demand prediction
curl -X POST http://localhost:8001/api/v1/predict-demand `
  -H "Content-Type: application/json" `
  -d '{
    "commodity": "tomato",
    "location_query": "Gautam Buddha Nagar",
    "forecast_days": 14,
    "language": "en"
  }'

# Log order
curl -X POST http://localhost:8001/api/v1/log-order `
  -H "Content-Type: application/json" `
  -d '{
    "commodity": "onion",
    "location": "Noida",
    "quantity_kg": 2500,
    "buyer_type": "retailer"
  }'

# Get orders
curl http://localhost:8001/orders
```

---

## 🐛 Troubleshooting

### Issue: Backend won't start

**Error:** `ModuleNotFoundError: No module named 'fastapi'`

**Fix:**
```powershell
cd backend
.\venv\Scripts\activate
pip install -r requirements.txt
```

---

### Issue: Database connection failed

**Error:** `could not connect to server`

**Fix:**
```powershell
# Check PostgreSQL is running
Get-Service postgresql*

# Start if stopped
Start-Service postgresql-x64-14

# Verify connection
psql -U krishiflow_user -d krishiflow_db -h localhost
```

---

### Issue: ML service model not found

**Error:** `Missing artifacts`

**Fix:**
```powershell
cd "SIH 26033 AI ML part"

# Verify files exist
Test-Path models/lightgbm_model.pkl
Test-Path data/processed/clean_mandi_data.parquet

# If missing, files might not have been pulled
git status
git pull origin main
```

---

### Issue: ML service status shows "unavailable"

**Symptoms:** API returns `"ml_service_status": "unavailable"`

**Fix:**
```powershell
# Check ML service is running
curl http://localhost:8001/health

# If not running, start it
cd "SIH 26033 AI ML part"
.\venv_ml\Scripts\activate
uvicorn api.main:app --port 8001 --reload

# Test again
curl "http://localhost:8000/api/intelligence/forecast?crop=tomato&region=noida"
```

---

### Issue: Frontend not connecting to backend

**Error:** `Network Error` or `Failed to fetch`

**Fix:**
```powershell
# Check backend is running
curl http://localhost:8000/

# Check frontend .env
cd frontend
Get-Content .env

# Should have:
# VITE_API_BASE_URL=http://localhost:8000

# Restart frontend
npm run dev
```

---

### Issue: CORS errors in browser

**Error:** `Access to fetch blocked by CORS policy`

**Fix:** Already configured! Backend has CORS middleware. If still seeing errors:

```powershell
# Restart backend
cd backend
.\venv\Scripts\activate
python main.py
```

---

### Issue: Port already in use

**Error:** `Address already in use`

**Fix:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill the process (replace PID)
taskkill /PID <PID> /F

# Or use different port
uvicorn main:app --port 8080
```

---

## 📊 Expected Test Results

### Backend Endpoints
- ✅ 15+ endpoints responding
- ✅ All CRUD operations working
- ✅ Database queries executing
- ✅ Response time < 200ms

### ML Service
- ✅ Model loaded successfully
- ✅ Predictions returning in < 2 seconds
- ✅ Confidence scores > 90%
- ✅ Location resolution working

### Integration
- ✅ Backend calling ML service
- ✅ ML predictions flowing to frontend
- ✅ Fallback working when ML unavailable
- ✅ Data transformations correct

### Frontend
- ✅ All pages loading
- ✅ Navigation working
- ✅ API calls successful
- ✅ Charts rendering
- ✅ Forms submitting

---

## 🎓 Demo Preparation

### Quick Demo Flow (5 minutes)

**1. Problem Statement (30 sec)**
- "Farmers get only 30-40% of final price"
- "Buyers face supply uncertainty"
- "High logistics costs and food waste"

**2. Solution Overview (30 sec)**
- "AI-powered direct farmer-buyer platform"
- "Smart matching algorithm"
- "ML-based demand forecasting"

**3. Live Demo (3 minutes)**

**a. Farmer Dashboard** (45 sec)
- Show product listings
- Display incoming orders
- Highlight better prices

**b. Demand Intelligence** (60 sec) ⭐ STAR FEATURE
- Select "Tomato" crop
- Choose "Noida" region
- Click "Get Forecast"
- **Highlight:**
  - ML prediction accuracy
  - Weather impact
  - Festival signals
  - Supply gap detection
  - Confidence score > 95%

**c. Buyer Dashboard** (45 sec)
- Create procurement request
- Show smart matching results
- Display optimized route

**d. Impact Metrics** (30 sec)
- Show farmer income gain: +46%
- Show buyer cost reduction: -10%
- Show logistics efficiency: +31%

**4. Technical Highlights** (30 sec)
- "LightGBM model trained on 24 years data"
- "Microservices architecture"
- "Production-ready FastAPI + React"
- "PostgreSQL database"

---

## 🎯 Success Criteria

### Must Have ✅
- [ ] All three services start without errors
- [ ] ML model loads successfully
- [ ] Frontend displays data correctly
- [ ] Demand forecast with ML works
- [ ] Database has seed data

### Should Have ✅
- [ ] Smart matching algorithm works
- [ ] Route optimization functional
- [ ] Price transparency displays
- [ ] Impact dashboard shows metrics
- [ ] All navigation works

### Nice to Have ✅
- [ ] Language toggle functional
- [ ] All charts rendering
- [ ] Mobile responsive
- [ ] Error handling graceful

---

## 📱 Quick Command Reference

### Start Everything
```powershell
# Terminal 1 - Backend
cd backend ; .\venv\Scripts\activate ; python main.py

# Terminal 2 - ML Service
cd "SIH 26033 AI ML part" ; .\venv_ml\Scripts\activate ; uvicorn api.main:app --port 8001 --reload

# Terminal 3 - Frontend
cd frontend ; npm run dev
```

### Stop Everything
Press `Ctrl+C` in each terminal.

### Reset Database
```powershell
cd backend
.\venv\Scripts\activate
python app/db/seed_data.py
```

### View Logs
```powershell
# Backend logs - shown in Terminal 1
# ML service logs - shown in Terminal 2
# Frontend logs - shown in Terminal 3
```

---

## 🎉 You're Ready!

After completing all phases, you should have:

✅ Fully functional full-stack platform  
✅ Real ML model making predictions  
✅ Complete database with seed data  
✅ All features tested and working  
✅ Demo flow practiced  
✅ Troubleshooting guide ready  

**Access URLs:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- Backend Docs: http://localhost:8000/docs
- ML Service: http://localhost:8001
- ML Docs: http://localhost:8001/docs

---

## 📞 Need Help?

1. Check the terminal logs for errors
2. Review the Troubleshooting section above
3. Verify all services are running
4. Check the documentation files:
   - `SETUP_GUIDE.md`
   - `ML_INTEGRATION_GUIDE.md`
   - `PROJECT_SUMMARY.md`

---

**Good luck with your hackathon demo! 🏆**
