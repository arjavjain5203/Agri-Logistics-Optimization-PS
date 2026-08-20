# KISAN GUARD Optimization MVP

Deterministic farm-to-mandi dispatch optimization for the KISAN GUARD hackathon project. Prototype data is stored in a local, resettable SQLite database.

## Run

```powershell
python -m pip install -r requirements.txt
python demo.py
python -m pytest tests -q -p no:cacheprovider
uvicorn api:app --reload
```

The API provides `POST /optimize`, `POST /simulate/price-shock`,
`POST /simulate/vehicle-failure`, and `POST /reset-demo`.

Read [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md) before merging this module into another backend. See `OPTIMIZATION_CONTEXT.md` for the schemas, assumptions, and constraints.
