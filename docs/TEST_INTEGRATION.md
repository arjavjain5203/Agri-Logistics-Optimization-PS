# 🧪 Integration Testing Guide

This guide helps you test the complete backend-frontend integration.

---

## ⚡ Quick Start (Do This First!)

### Terminal 1: Start Backend
```powershell
cd backend
.\venv\Scripts\activate
python main.py
```

Wait for: `✅ Database tables created` and `Uvicorn running on http://0.0.0.0:8000`

### Terminal 2: Start Frontend
```powershell
cd frontend
npm run dev
```

Wait for: `Local: http://localhost:5173/`

---

## 🔍 Manual Testing Checklist

### Test 1: Backend Health Check ✅

**URL:** http://localhost:8000

**Expected Response:**
```json
{
  "app": "KrishiFlow AI",
  "version": "1.0.0",
  "status": "operational",
  "message": "KrishiFlow AI Backend is running!"
}
```

**Status:** [ ] Pass [ ] Fail

---

### Test 2: API Documentation ✅

**URL:** http://localhost:8000/docs

**Expected:** Interactive Swagger UI with all endpoints listed

**Status:** [ ] Pass [ ] Fail

---

### Test 3: Get Products ✅

**URL:** http://localhost:8000/api/products

**Expected:** Array of products with farmers

**Verify:**
- At least 15 products returned
- Each has: crop_name, quantity_kg, price_per_kg, farmer_id
- Sample product: Tomato from Ramesh Kumar

**Status:** [ ] Pass [ ] Fail

---

### Test 4: Get Farmers ✅

**URL:** http://localhost:8000/api/farmers

**Expected:** Array of 8 farmers with their products

**Verify:**
- Ramesh Kumar (id: f1) exists
- Green Valley FPO (is_fpo: true) exists
- Each farmer has location coordinates

**Status:** [ ] Pass [ ] Fail

---

### Test 5: Frontend Landing Page ✅

**URL:** http://localhost:5173

**Expected:** 
- KrishiFlow AI branding
- Hero carousel
- "Start Procuring" button
- Language switcher (EN/हिं)

**Status:** [ ] Pass [ ] Fail

---

### Test 6: Buyer Dashboard (Real Data) ✅

**Steps:**
1. Go to http://localhost:5173
2. Click "Start Procuring"
3. Select "Enterprise Buyer"
4. View Dashboard

**Expected:**
- Metrics showing real data from database
- Orders list (should show 3 orders)
- Demand signal banner
- All data loads without "Loading..." stuck state

**Verify:**
- Order KF-ORD-8821 appears
- Status shows "In Transit" or "Delivered"
- Quantities match database

**Status:** [ ] Pass [ ] Fail

---

### Test 7: AI Demand Forecast ✅

**Steps:**
1. Navigate to "AI Intelligence" in sidebar
2. Select crop: Tomato
3. Wait for chart to load

**Expected:**
- Line chart with forecast series
- Predicted demand: ~2500 kg
- Supply gap alert shown
- Confidence score: 94.8%

**Status:** [ ] Pass [ ] Fail

---

### Test 8: Smart Matching ✅

**Steps:**
1. Go to "Create Demand" (Buyer → Procurement)
2. Fill form:
   - Crop: Tomato
   - Quantity: 500 kg
   - Grade: Grade A
   - Budget: ₹30/kg
3. Submit
4. Navigate to "Smart Matching"

**Expected:**
- Shows 3+ matched farmers
- Each has match score (0-100)
- Ramesh Kumar appears with high score (90+)
- Aggregation shows total 500 kg fulfilled

**Status:** [ ] Pass [ ] Fail

---

### Test 9: Route Optimization ✅

**Steps:**
1. After matching (Test 8)
2. Confirm suppliers
3. Navigate to "Smart Logistics"

**Expected:**
- Route map with 4 stops (3 pickups + 1 delivery)
- Optimized distance: ~42 km
- Distance saved: ~19 km
- Cost estimate: ~₹850

**Status:** [ ] Pass [ ] Fail

---

### Test 10: Price Transparency ✅

**Steps:**
1. Navigate to "Price Breakdown"
2. Select Tomato

**Expected:**
- Side-by-side comparison
- Traditional: Farmer ₹15, Buyer ₹30
- KrishiFlow: Farmer ₹22, Buyer ₹27
- Shows 46.6% farmer gain
- Shows 10% buyer savings

**Status:** [ ] Pass [ ] Fail

---

### Test 11: Impact Dashboard ✅

**Steps:**
1. Navigate to "Supply Impact"

**Expected:**
- 4 core metrics displayed
- Economic impact section
- Environmental impact (CO2 saved)
- Social impact (farmers empowered)

**Status:** [ ] Pass [ ] Fail

---

### Test 12: Language Switching ✅

**Steps:**
1. Click language toggle (EN → हिं)
2. Navigate through pages

**Expected:**
- All labels switch to Hindi
- Navigation menu in Hindi
- Farmer names show Hindi versions
- Data remains correct

**Status:** [ ] Pass [ ] Fail

---

### Test 13: Farmer Dashboard ✅

**Steps:**
1. Go to Login
2. Select "Producer / Farmer"
3. View Farmer Dashboard

**Expected:**
- Shows produce listings
- Nearby demand alerts
- Earnings breakdown
- "List Produce" button works

**Status:** [ ] Pass [ ] Fail

---

## 🐛 Common Issues & Fixes

### Issue: "Failed to fetch" or Network Error

**Cause:** Backend not running or CORS issue

**Fix:**
```powershell
# Check backend is running
curl http://localhost:8000

# Restart backend
cd backend
python main.py

# Check CORS settings in backend/.env
CORS_ORIGINS=http://localhost:5173,http://localhost:3000
```

---

### Issue: "No data" or Empty Lists

**Cause:** Database not seeded

**Fix:**
```powershell
cd backend
.\venv\Scripts\activate
python app/db/seed_data.py
```

---

### Issue: CORS Policy Error in Browser Console

**Fix:**
1. Open `backend/app/core/config.py`
2. Verify CORS_ORIGINS includes: `http://localhost:5173`
3. Restart backend server

---

### Issue: Frontend shows mock data instead of real data

**Fix:**
```powershell
# Verify frontend/.env exists
cat frontend/.env

# Should contain:
VITE_API_URL=http://localhost:8000/api

# Restart frontend
cd frontend
npm run dev
```

---

## 🔬 API Testing with cURL

### Test Products Endpoint
```powershell
curl http://localhost:8000/api/products
```

### Test Farmers with Filter
```powershell
curl "http://localhost:8000/api/farmers?crop_id=tomato"
```

### Test Smart Matching
```powershell
curl -X POST http://localhost:8000/api/intelligence/match `
  -H "Content-Type: application/json" `
  -d '{
    "crop_id": "tomato",
    "quantity_kg": 500,
    "buyer_latitude": 28.627,
    "buyer_longitude": 77.376,
    "max_budget_per_kg": 30,
    "quality_grade": "Grade A"
  }'
```

### Test Demand Forecast
```powershell
curl "http://localhost:8000/api/intelligence/forecast?crop=tomato&region=delhi-ncr"
```

---

## ✅ Integration Success Criteria

Your integration is successful when:

- [ ] Backend starts without errors
- [ ] Frontend starts without errors
- [ ] Landing page loads with data
- [ ] Can view products from database
- [ ] Can view farmers from database
- [ ] AI forecast displays chart
- [ ] Smart matching returns suppliers
- [ ] Route optimization shows map
- [ ] Price breakdown displays
- [ ] Impact dashboard shows metrics
- [ ] No CORS errors in browser console
- [ ] No "Failed to fetch" errors
- [ ] Language switching works
- [ ] All dashboards load real data

---

## 📊 Performance Benchmarks

Expected load times (on local machine):

- Backend startup: 2-3 seconds
- Frontend startup: 5-10 seconds
- API response time: 50-200ms
- Page navigation: Instant
- Smart matching: <500ms
- Route optimization: <1s
- Demand forecast: <300ms

---

## 🎯 Final Verification

Run through this complete user journey:

1. **Start:** http://localhost:5173
2. **Select Role:** Enterprise Buyer
3. **View Dashboard:** See real metrics
4. **Check Forecast:** AI predicts demand
5. **Create Demand:** 500kg tomato request
6. **View Matching:** 3 farmers matched
7. **Optimize Route:** See optimized path
8. **Check Economics:** Price comparison
9. **View Impact:** See metrics
10. **Switch Language:** All works in Hindi

**If all 10 steps work → Integration Complete! 🎉**

---

## 🆘 Still Having Issues?

### Debug Steps:

1. **Check Backend Logs:**
   - Look at terminal running `python main.py`
   - Any red errors?

2. **Check Frontend Console:**
   - Press F12 in browser
   - Look at Console tab
   - Any red errors?

3. **Check Network Tab:**
   - F12 → Network tab
   - Look for failed requests (red)
   - Click on failed request to see details

4. **Verify Database:**
   ```powershell
   psql -U krishiflow -d krishiflow_db
   SELECT COUNT(*) FROM farmers;  # Should return 8
   SELECT COUNT(*) FROM products; # Should return 15
   \q
   ```

5. **Reset Everything:**
   ```powershell
   # Stop both servers (Ctrl+C)
   
   # Reseed database
   cd backend
   python app/db/seed_data.py
   
   # Restart backend
   python main.py
   
   # In new terminal, restart frontend
   cd frontend
   npm run dev
   ```

---

## 📝 Test Results Summary

Fill this out after testing:

**Date Tested:** _______________

**Environment:**
- OS: Windows
- Python Version: _______________
- Node Version: _______________
- PostgreSQL Version: _______________

**Test Results:**
- Tests Passed: ___ / 13
- Tests Failed: ___ / 13

**Critical Issues Found:**
1. _______________________________________________
2. _______________________________________________
3. _______________________________________________

**Notes:**
_________________________________________________
_________________________________________________
_________________________________________________

---

**Testing Complete! Document your results above. ✅**
