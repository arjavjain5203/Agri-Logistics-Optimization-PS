# KrishiFlow AI Backend

FastAPI backend for the KrishiFlow AI agricultural supply network platform.

## Setup Instructions

### 1. Prerequisites

- Python 3.10+
- PostgreSQL 14+
- pip or uv package manager

### 2. Install PostgreSQL

**Windows (using Chocolatey):**
```powershell
choco install postgresql
```

**Or download installer from:** https://www.postgresql.org/download/windows/

### 3. Create Database

```powershell
# Start PostgreSQL service (if not running)
# Then create database and user

psql -U postgres

# In psql console:
CREATE DATABASE krishiflow_db;
CREATE USER krishiflow WITH PASSWORD 'krishiflow123';
GRANT ALL PRIVILEGES ON DATABASE krishiflow_db TO krishiflow;
\q
```

### 4. Install Python Dependencies

```powershell
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 5. Setup Environment Variables

Copy `.env.example` to `.env` and update if needed:
```powershell
cp .env.example .env
```

### 6. Seed Database

```powershell
# Make sure virtual environment is activated
python app/db/seed_data.py
```

This will:
- Create all database tables
- Add 8 farmers
- Add 15+ products
- Add 4 buyers
- Add 3 sample demands
- Add 3 sample orders

### 7. Run Backend Server

```powershell
# Development mode (auto-reload)
python main.py

# Or using uvicorn directly
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The API will be available at:
- **API Base:** http://localhost:8000
- **Interactive Docs:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## API Endpoints

### Core Endpoints
- `GET /` - Health check
- `GET /api/products` - Get all crops/products
- `GET /api/farmers` - Get all farmers (with filters)
- `GET /api/buyers` - Get all buyers
- `GET /api/demands` - Get procurement requests
- `GET /api/orders` - Get orders
- `POST /api/demands` - Create new demand

### Intelligence Endpoints
- `POST /api/match` - Smart farmer-buyer matching
- `POST /api/optimize-route` - Route optimization
- `GET /api/forecast` - AI demand forecasting
- `GET /api/impact` - Supply chain impact metrics
- `GET /api/price-transparency` - Price breakdown

## Project Structure

```
backend/
├── app/
│   ├── api/          # API routes
│   ├── core/         # Configuration
│   ├── db/           # Database connection & seeding
│   ├── models/       # SQLAlchemy models
│   ├── schemas/      # Pydantic schemas
│   ├── services/     # Business logic
│   └── utils/        # Utilities
├── main.py           # Application entry point
├── requirements.txt  # Dependencies
└── .env             # Environment variables
```

## Database Schema

- **farmers** - Farmer/FPO information
- **products** - Available crops/produce
- **buyers** - Institutional buyers
- **demands** - Procurement requests
- **orders** - Confirmed orders

## Development

```powershell
# Run tests (when available)
pytest

# Format code
black .

# Lint code
flake8 .
```

## Troubleshooting

### Database Connection Issues

1. Ensure PostgreSQL is running:
```powershell
Get-Service -Name postgresql*
```

2. Check database URL in `.env`:
```
DATABASE_URL=postgresql://krishiflow:krishiflow123@localhost:5432/krishiflow_db
```

3. Test connection:
```powershell
psql -U krishiflow -d krishiflow_db
```

### Port Already in Use

If port 8000 is occupied:
```powershell
# Change port in .env or run with custom port
uvicorn main:app --port 8001
```

## Next Steps

1. Run the seed script to populate database
2. Start the backend server
3. Test endpoints in browser: http://localhost:8000/docs
4. Connect frontend to backend (see frontend integration guide)
