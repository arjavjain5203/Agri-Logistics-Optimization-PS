# 🚀 KrishiFlow AI - Complete Setup Guide

This guide will help you set up and run the complete KrishiFlow AI platform (Backend + Frontend).

---

## 📋 Prerequisites

### Required Software
- **Python 3.10+** - [Download](https://www.python.org/downloads/)
- **Node.js 18+** - [Download](https://nodejs.org/)
- **PostgreSQL 14+** - [Download](https://www.postgresql.org/download/)
- **Git** (optional but recommended)

### Verify Installation
```powershell
python --version
node --version
npm --version
psql --version
```

---

## 🗄️ Part 1: Database Setup

### Step 1.1: Install PostgreSQL

**Option A: Using Chocolatey (Recommended)**
```powershell
choco install postgresql
```

**Option B: Manual Installation**
Download and install from: https://www.postgresql.org/download/windows/

### Step 1.2: Create Database

```powershell
# Start PostgreSQL service (if not already running)
# Open PowerShell as Administrator

# Connect to PostgreSQL
psql -U postgres

# In the PostgreSQL console, run:
```

```sql
CREATE DATABASE krishiflow_db;
CREATE USER krishiflow WITH PASSWORD 'krishiflow123';
GRANT ALL PRIVILEGES ON DATABASE krishiflow_db TO krishiflow;
ALTER DATABASE krishiflow_db OWNER TO krishiflow;
\q
```

### Step 1.3: Verify Database Connection

```powershell
psql -U krishiflow -d krishiflow_db
# Password: krishiflow123

# If connected successfully, type \q to exit
```

---

## ⚙️ Part 2: Backend Setup

### Step 2.1: Navigate to Backend Directory

```powershell
cd backend
```

### Step 2.2: Create Python Virtual Environment

```powershell
# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Your prompt should now show (venv) prefix
```

### Step 2.3: Install Dependencies

```powershell
pip install -r requirements.txt
```

**Expected installation time:** 2-3 minutes

### Step 2.4: Configure Environment Variables

The `.env` file is already created. Verify it contains:

```env
DATABASE_URL=postgresql://krishiflow:krishiflow123@localhost:5432/krishiflow_db
API_HOST=0.0.0.0
API_PORT=8000
DEBUG=True
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

### Step 2.5: Seed Database with Test Data

```powershell
# Make sure you're in the backend directory with venv activated
python app/db/seed_data.py
```

**Expected output:**
```
🗑️  Clearing existing database...
✅ Database cleared and recreated
👨‍🌾 Seeding farmers...
✅ Added 8 farmers
🌾 Seeding products...
✅ Added 15 products
🏢 Seeding buyers...
✅ Added 4 buyers
📋 Seeding demands...
✅ Added 3 demands
📦 Seeding orders...
✅ Added 3 orders

✨ Database seeding completed successfully!
```

### Step 2.6: Start Backend Server

```powershell
python main.py
```

**Expected output:**
```
🚀 Starting KrishiFlow AI Backend...
📊 Database: localhost:5432/krishiflow_db
✅ Database tables created
INFO:     Uvicorn running on http://0.0.0.0:8000 (Press CTRL+C to quit)
INFO:     Started reloader process
```

### Step 2.7: Test Backend API

Open your browser and visit:
- **API Health:** http://localhost:8000
- **Interactive Docs:** http://localhost:8000/docs
- **Test Endpoint:** http://localhost:8000/api/products

You should see JSON data returned!

**✅ Backend Setup Complete!**

---

## 🎨 Part 3: Frontend Setup

### Step 3.1: Open New Terminal

**Important:** Keep the backend server running. Open a **NEW** PowerShell terminal window.

### Step 3.2: Navigate to Frontend Directory

```powershell
cd frontend
```

### Step 3.3: Install Node Dependencies

```powershell
npm install
```

**Expected installation time:** 1-2 minutes

### Step 3.4: Verify Environment Configuration

Check that `frontend/.env` exists with:
```env
VITE_API_URL=http://localhost:8000/api
```

### Step 3.5: Start Frontend Development Server

```powershell
npm run dev
```

**Expected output:**
```
VITE v5.4.2  ready in 523 ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

### Step 3.6: Open Application

Open your browser and visit: **http://localhost:5173**

You should see the KrishiFlow AI landing page!

**✅ Frontend Setup Complete!**

---

## 🧪 Part 4: Testing the Integration

### Test 1: View Products
1. Go to http://localhost:5173
2. Click "Start Procuring" or "Explore Marketplace"
3. You should see real product data from the database

### Test 2: Create Demand (Buyer Flow)
1. Select "Enterprise Buyer" role
2. Navigate to "Create Demand"
3. Fill in:
   - Product: Tomato
   - Quantity: 500 kg
   - Grade: Grade A
   - Location: Noida
   - Max Budget: ₹30/kg
4. Submit
5. Check "Smart Matching" to see matched farmers

### Test 3: AI Demand Forecast
1. Navigate to "AI Intelligence"
2. Select "Tomato"
3. View forecast chart with predicted demand
4. Check supply gap alert

### Test 4: Route Optimization
1. Go to "Smart Logistics"
2. View optimized multi-stop pickup route
3. Check distance saved metrics

### Test 5: Impact Dashboard
1. Navigate to "Supply Impact"
2. View economic and environmental metrics
3. Check price transparency comparison

---

## 🎯 Quick Start Commands

### Start Everything (2 Terminals Required)

**Terminal 1 - Backend:**
```powershell
cd backend
.\venv\Scripts\activate
python main.py
```

**Terminal 2 - Frontend:**
```powershell
cd frontend
npm run dev
```

### Stop Everything
- Press `Ctrl+C` in both terminal windows

---

## 🔧 Troubleshooting

### Issue: Backend won't start

**Error:** `sqlalchemy.exc.OperationalError`

**Solution:**
1. Verify PostgreSQL is running:
   ```powershell
   Get-Service -Name postgresql*
   ```
2. Check database credentials in `backend/.env`
3. Try recreating the database

### Issue: Frontend shows "Network Error"

**Solution:**
1. Verify backend is running on http://localhost:8000
2. Check `frontend/.env` has correct API URL
3. Check browser console for CORS errors
4. Restart both servers

### Issue: Port already in use

**Error:** `Address already in use`

**Solution:**
```powershell
# Find process using port 8000
netstat -ano | findstr :8000

# Kill process (replace PID with actual process ID)
taskkill /PID <PID> /F

# Or change port in backend/.env:
API_PORT=8001
```

### Issue: Database seed fails

**Solution:**
```powershell
# Drop and recreate database
psql -U postgres

DROP DATABASE IF EXISTS krishiflow_db;
CREATE DATABASE krishiflow_db;
GRANT ALL PRIVILEGES ON DATABASE krishiflow_db TO krishiflow;
\q

# Re-run seed script
python app/db/seed_data.py
```

---

## 📊 API Endpoints Reference

### Core Data Endpoints
- `GET /api/products` - All products
- `GET /api/farmers` - All farmers
- `GET /api/buyers` - All buyers
- `GET /api/demands` - Procurement requests
- `GET /api/orders` - Orders
- `POST /api/demands` - Create demand

### Intelligence Endpoints
- `POST /api/intelligence/match` - Smart matching
- `POST /api/intelligence/optimize-route` - Route optimization
- `GET /api/intelligence/forecast` - AI forecasting
- `GET /api/intelligence/price-transparency` - Price breakdown
- `GET /api/intelligence/impact` - Impact metrics

**Full API Documentation:** http://localhost:8000/docs

---

## 🎓 Demo Workflow for Hackathon

### End-to-End Demo Script (5 minutes)

1. **Landing Page** (30 sec)
   - Show platform overview
   - Highlight key features

2. **Buyer Creates Demand** (60 sec)
   - Login as buyer (FreshBite Restaurants)
   - Create 500kg tomato procurement request
   - Show AI forecast predicting shortage

3. **Smart Matching** (60 sec)
   - System finds 3 farmers
   - Show match scores and aggregation
   - Demonstrate virtual aggregation concept

4. **Route Optimization** (60 sec)
   - Display optimized multi-pickup route
   - Highlight 31% distance saved
   - Show cold-chain details

5. **Economics & Impact** (90 sec)
   - Price transparency: ₹22 to farmer vs ₹15 traditional
   - Buyer pays ₹27 vs ₹30 traditional
   - Impact dashboard: 46.6% farmer gain, 10% buyer savings
   - Call to action

---

## 📚 Additional Resources

- **Backend README:** `backend/README.md`
- **API Documentation:** http://localhost:8000/docs
- **Project Structure:** See directory tree below

```
KrishiFlow AI/
├── backend/
│   ├── app/
│   │   ├── api/          # API endpoints
│   │   ├── models/       # Database models
│   │   ├── services/     # Business logic
│   │   └── db/           # Database & seeding
│   ├── main.py           # Entry point
│   └── requirements.txt  # Dependencies
│
├── frontend/
│   ├── src/
│   │   ├── pages/        # Page components
│   │   ├── components/   # Reusable UI
│   │   ├── services/     # API calls
│   │   └── data/         # Constants
│   └── package.json      # Dependencies
│
└── SETUP_GUIDE.md        # This file
```

---

## ✅ Success Checklist

- [ ] PostgreSQL installed and running
- [ ] Database `krishiflow_db` created
- [ ] Backend dependencies installed
- [ ] Database seeded with test data
- [ ] Backend server running on port 8000
- [ ] Frontend dependencies installed
- [ ] Frontend running on port 5173
- [ ] Can view products in browser
- [ ] Can create demand and see matching
- [ ] AI forecast working
- [ ] Route optimization displaying

---

## 🆘 Need Help?

If you encounter any issues:

1. Check the troubleshooting section above
2. Verify all prerequisites are installed
3. Ensure both backend and frontend are running
4. Check browser console for errors (F12)
5. Check backend terminal for error logs

**Status Check Commands:**
```powershell
# Check if backend is responding
curl http://localhost:8000

# Check if frontend is built
cd frontend
npm run build
```

---

## 🎉 You're Ready!

Your KrishiFlow AI platform is now fully functional with:
- ✅ Real-time database
- ✅ AI-powered matching
- ✅ Route optimization
- ✅ Demand forecasting
- ✅ Price transparency
- ✅ Impact metrics

**Happy Hacking! 🚀**
