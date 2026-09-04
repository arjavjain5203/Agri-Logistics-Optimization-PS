# 🚀 Quick Start - All Services

## One-Time Setup (First Run Only)

Run these commands only the first time:

### 1. Backend Setup
```powershell
cd backend
python -m venv venv
.\venv\Scripts\activate
pip install -r requirements.txt
python app/db/seed_data.py
cd ..
```

### 2. ML Service Setup
```powershell
cd "SIH 26033 AI ML part"
python -m venv venv_ml
.\venv_ml\Scripts\activate
pip install -r requirements.txt
cd ..
```

### 3. Frontend Setup
```powershell
cd frontend
npm install
cd ..
```

---

## Daily Startup (Every Time)

### Open 3 PowerShell Terminals

**Terminal 1 - Backend:**
```powershell
cd c:\Users\jainArja\Documents\Agri-Logistics-Optimization-PS\backend
.\venv\Scripts\activate
python main.py
```

**Terminal 2 - ML Service:**
```powershell
cd "c:\Users\jainArja\Documents\Agri-Logistics-Optimization-PS\SIH 26033 AI ML part"
.\venv_ml\Scripts\activate
uvicorn api.main:app --host 0.0.0.0 --port 8001 --reload
```

**Terminal 3 - Frontend:**
```powershell
cd c:\Users\jainArja\Documents\Agri-Logistics-Optimization-PS\frontend
npm run dev
```

---

## Verify All Services Running

Open Terminal 4 and run:

```powershell
# Test backend
curl http://localhost:8000/

# Test ML service
curl http://localhost:8001/health

# Test ML integration
curl "http://localhost:8000/api/intelligence/forecast?crop=tomato&region=noida"

# Open frontend in browser
Start-Process "http://localhost:5173"
```

---

## Access Points

- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **Backend Docs:** http://localhost:8000/docs
- **ML Service:** http://localhost:8001
- **ML Service Docs:** http://localhost:8001/docs

---

## Quick Test

1. Open browser: http://localhost:5173
2. Click "I'm a Buyer"
3. Navigate to "Demand Intelligence"
4. Select "Tomato" crop
5. Select "Noida" region
6. Click "Get Forecast"
7. **Check:** ML service status should show "Active" ✅

---

## Stop All Services

Press `Ctrl+C` in each terminal (Terminal 1, 2, and 3).

---

## Troubleshooting

**If any service fails to start:**

1. Check if port is already in use:
   ```powershell
   netstat -ano | findstr :8000  # For backend
   netstat -ano | findstr :8001  # For ML service
   netstat -ano | findstr :5173  # For frontend
   ```

2. Verify virtual environment is activated:
   - You should see `(venv)` or `(venv_ml)` in terminal prompt

3. Check for errors in terminal output

For detailed troubleshooting, see: **COMPLETE_TESTING_GUIDE.md**

---

## Ready for Demo!

Once all services are running and verified:

1. Practice the demo flow (see COMPLETE_TESTING_GUIDE.md)
2. Test all key features
3. Have backup terminal windows ready
4. Keep this guide open for quick reference

**Good luck! 🎉**
