"""
API v1 Router
Combines all endpoint routers
"""

from fastapi import APIRouter
from app.api.v1.endpoints import products, farmers, buyers, demands, orders, intelligence, chat

api_router = APIRouter()

# Include all endpoint routers
api_router.include_router(products.router, prefix="/products", tags=["Products"])
api_router.include_router(farmers.router, prefix="/farmers", tags=["Farmers"])
api_router.include_router(buyers.router, prefix="/buyers", tags=["Buyers"])
api_router.include_router(demands.router, prefix="/demands", tags=["Demands"])
api_router.include_router(orders.router, prefix="/orders", tags=["Orders"])
api_router.include_router(intelligence.router, prefix="/intelligence", tags=["AI Intelligence"])
api_router.include_router(chat.router, prefix="/intelligence", tags=["AI Chat"])
