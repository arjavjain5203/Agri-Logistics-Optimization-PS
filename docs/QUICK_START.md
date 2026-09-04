# ⚡ Quick Start Guide - KrishiFlow AI

## 🚀 Get Running in 5 Minutes

### Prerequisites Installed?
- [ ] Python 3.10+
- [ ] Node.js 18+
- [ ] PostgreSQL 14+

---

## 📋 Step-by-Step

### 1️⃣ Database (2 minutes)

```powershell
# Connect to PostgreSQL
psql -U postgres
```

```sql
CREATE DATABASE krishiflow_db;
CREATE USER krishiflow WITH PASSWORD 'krishiflow123';
GRANT ALL PRIVILEGES ON DATABASE krishiflow_db TO krishiflow;
\q
```

### 2️⃣ Backend (2 minutes)

```powershell
cd backend

# Create & activate virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Seed database (first time only)
python app/db/seed_data.py

# Start server
python main.py
```

**✅ Backend running on:** http://localhost:8000

### 3️⃣ Frontend (1 minute)

**Open NEW terminal window**

```powershell
cd frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

**✅ Frontend running on:** http://localhost:5173

---

## 🎯 Quick Test

1. Open browser: http://localhost:5173
2. Click "Start Procuring"
3. Select "Enterprise Buyer"
4. See real data from database ✨

---

## ⚙️ Daily Usage

Once everything is set up, just run these two commands:

**Terminal 1:**
```powershell
cd backend
.\venv\Scripts\activate
python main.py
```

**Terminal 2:**
```powershell
cd frontend
npm run dev
```

---

## 🆘 Troubleshooting

### Backend won't start?
```powershell
# Check database is running
Get-Service -Name postgresql*

# Reseed database
cd backend
python app/db/seed_data.py
```

### Frontend shows errors?
```powershell
# Check backend is running
curl http://localhost:8000

# Verify .env file exists
cat frontend/.env
```

### Still broken?
See full guide: **SETUP_GUIDE.md**

---

## 📚 Documentation

- **Full Setup:** SETUP_GUIDE.md
- **Testing:** TEST_INTEGRATION.md
- **Project Info:** PROJECT_SUMMARY.md
- **API Docs:** http://localhost:8000/docs

---

## ✅ Success Checklist

- [ ] Backend responds at http://localhost:8000
- [ ] Frontend loads at http://localhost:5173
- [ ] Can see products in browser
- [ ] No errors in browser console (F12)
- [ ] Dashboard shows real data

**All checked? You're ready! 🎉**
