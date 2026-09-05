"""
AI Chat Endpoint - KrishiFlow Agricultural Intelligence Chatbot
Uses Google Gemini API with conversation memory and demand prediction capabilities
"""

import os
import uuid
import logging
import httpx
from datetime import datetime, timedelta
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from pydantic import BaseModel
from app.db.database import get_db

router = APIRouter()
logger = logging.getLogger(__name__)

# ============================================================================
# GEMINI API CONFIGURATION
# ============================================================================

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "")
GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"

# ============================================================================
# IN-MEMORY CONVERSATION STORE (session-based state dictionary)
# ============================================================================

# Maps session_id -> list of conversation turns
conversation_store: dict[str, list] = {}

# Session expiry tracker
session_timestamps: dict[str, datetime] = {}

SESSION_TTL_MINUTES = 60


def cleanup_expired_sessions():
    """Remove sessions older than TTL."""
    cutoff = datetime.utcnow() - timedelta(minutes=SESSION_TTL_MINUTES)
    expired = [sid for sid, ts in session_timestamps.items() if ts < cutoff]
    for sid in expired:
        conversation_store.pop(sid, None)
        session_timestamps.pop(sid, None)


def get_or_create_session(session_id: Optional[str]) -> str:
    cleanup_expired_sessions()
    if not session_id or session_id not in conversation_store:
        session_id = str(uuid.uuid4())
        conversation_store[session_id] = []
    session_timestamps[session_id] = datetime.utcnow()
    return session_id


# ============================================================================
# SYSTEM PROMPT - Agricultural Intelligence
# ============================================================================

SYSTEM_PROMPT = """You are KrishiFlow AI Assistant — an expert agricultural intelligence agent for India's agri-logistics platform that connects farmers directly to buyers, eliminating middlemen.

## YOUR EXPERTISE
You are trained on:
- Indian mandi price data, APMC market trends, and commodity pricing
- Agricultural demand forecasting using LightGBM ML models trained on 24+ years of data
- Supply chain optimization for perishable agricultural commodities
- Weather impact on crop production (Rabi/Kharif seasons)
- Festival and seasonal demand cycles (Diwali, Navratri, harvest festivals)
- India-specific crops: Tomato, Potato, Onion, Carrot, Cauliflower, Wheat, Rice, Pulses
- Cold chain logistics, FPO (Farmer Producer Organizations), and rural supply chains

## DEMAND PREDICTION CAPABILITY
When users ask about demand forecasts, supply gaps, or price predictions:
1. Provide specific quantitative predictions (e.g., "Expected demand for tomatoes in Delhi-NCR will rise 23% over next 3 weeks")
2. Identify key drivers: weather patterns, festival calendar, seasonal trends
3. Recommend procurement actions: volumes to secure, timing, price ranges
4. Highlight supply risks and mitigation strategies
5. Always reference confidence intervals and uncertainty factors

## PLATFORM CONTEXT
- KrishiFlow connects 1,240+ smallholder farmers directly to institutional buyers
- Average farmer income improvement: +46.6% vs traditional mandi route
- Buyer cost reduction: -10% vs traditional supply chain
- Food waste reduction: 78% (from 28% to 6.2%)
- Cold chain coverage: 100%
- Current active crops: Tomato, Potato, Onion, Carrot, Cauliflower

## RESPONSE GUIDELINES
- Be concise but data-driven
- Use ₹ (Indian Rupees) for pricing, kg for quantities
- For demand predictions, always give: trend direction, % change, key driver, and recommended action
- Support both English and Hindi queries
- When asked in Hindi, respond in Hindi
- Format key numbers prominently
- Never make up data — if uncertain, say so and recommend checking the platform dashboard

## EXAMPLE DEMAND PREDICTIONS
Q: "What will tomato demand be next month?"
A: "Based on seasonal patterns and current supply data: Tomato demand in Delhi-NCR is forecast to RISE 18-24% over the next 21 days. Key drivers: (1) Pre-festival buying surge (Navratri), (2) Current supply gap of ~340 MT, (3) Reduced arrivals from Nashik due to unseasonal rain. Recommended action: Secure 15-20% more inventory now at ₹22-24/kg to avoid a projected ₹28-32/kg peak in 2 weeks."
"""


# ============================================================================
# MODELS
# ============================================================================

class ChatMessage(BaseModel):
    role: str  # "user" or "model"
    text: str


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None
    language: str = "en"
    context: Optional[dict] = None  # {pathname, role, crop, region}


class ChatResponse(BaseModel):
    reply: str
    session_id: str
    history_length: int


# ============================================================================
# GEMINI API CALL
# ============================================================================

async def call_gemini(
    user_message: str,
    history: list,
    language: str = "en",
    context: Optional[dict] = None
) -> str:
    """
    Call Gemini API with conversation history for memory.
    Returns AI response text.
    """

    # Build contents array with history
    contents = []

    # Add conversation history
    for turn in history:
        contents.append({
            "role": turn["role"],
            "parts": [{"text": turn["text"]}]
        })

    # Enrich user message with context if provided
    enriched_message = user_message
    if context:
        crop = context.get("crop", "")
        region = context.get("region", "delhi-ncr")
        role = context.get("role", "buyer")
        pathname = context.get("pathname", "")
        
        if crop or region or role:
            ctx_note = f"\n[Context: User is a {role}, "
            if crop:
                ctx_note += f"viewing {crop} data, "
            ctx_note += f"in region: {region}, on page: {pathname}]"
            enriched_message = user_message + ctx_note

    # Add current user message
    contents.append({
        "role": "user",
        "parts": [{"text": enriched_message}]
    })

    payload = {
        "system_instruction": {
            "parts": [{"text": SYSTEM_PROMPT}]
        },
        "contents": contents,
        "generationConfig": {
            "temperature": 0.7,
            "topK": 40,
            "topP": 0.95,
            "maxOutputTokens": 1024,
        },
        "safetySettings": [
            {"category": "HARM_CATEGORY_HARASSMENT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_HATE_SPEECH", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_SEXUALLY_EXPLICIT", "threshold": "BLOCK_NONE"},
            {"category": "HARM_CATEGORY_DANGEROUS_CONTENT", "threshold": "BLOCK_NONE"},
        ]
    }

    url = f"{GEMINI_API_URL}?key={GEMINI_API_KEY}"

    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.post(url, json=payload)
            
            if response.status_code != 200:
                logger.error(f"Gemini API error {response.status_code}: {response.text[:200]}")
                raise HTTPException(status_code=502, detail=f"AI service error: {response.status_code}")
            
            data = response.json()
            
            # Extract text from response
            candidates = data.get("candidates", [])
            if not candidates:
                raise HTTPException(status_code=502, detail="No response from AI service")
            
            content = candidates[0].get("content", {})
            parts = content.get("parts", [])
            if not parts:
                raise HTTPException(status_code=502, detail="Empty AI response")
            
            return parts[0].get("text", "").strip()
            
    except httpx.TimeoutException:
        raise HTTPException(status_code=504, detail="AI service timed out. Please try again.")
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Gemini call error: {e}")
        raise HTTPException(status_code=500, detail=f"AI service error: {str(e)}")


# ============================================================================
# ENDPOINTS
# ============================================================================

@router.post("/chat", response_model=ChatResponse)
async def chat_with_assistant(
    request: ChatRequest,
    db: Session = Depends(get_db)
):
    """
    AI Chat Endpoint with Persistent Conversation Memory
    
    Features:
    - Google Gemini 1.5 Flash powered responses
    - Session-based conversation history (state dictionary)
    - Agricultural demand prediction specialization
    - Bilingual support (English + Hindi)
    - Context-aware responses based on current page/role
    """
    
    # Get or create session
    session_id = get_or_create_session(request.session_id)
    history = conversation_store[session_id]

    # Get AI response
    reply = await call_gemini(
        user_message=request.message,
        history=history,
        language=request.language,
        context=request.context
    )

    # Store this exchange in session memory
    history.append({"role": "user", "text": request.message})
    history.append({"role": "model", "text": reply})
    
    # Keep history manageable (last 20 turns = 10 exchanges)
    if len(history) > 20:
        conversation_store[session_id] = history[-20:]

    return ChatResponse(
        reply=reply,
        session_id=session_id,
        history_length=len(conversation_store[session_id])
    )


@router.delete("/chat/{session_id}")
async def clear_chat_session(session_id: str):
    """Clear conversation history for a session."""
    if session_id in conversation_store:
        conversation_store.pop(session_id, None)
        session_timestamps.pop(session_id, None)
        return {"success": True, "message": "Session cleared"}
    return {"success": False, "message": "Session not found"}


@router.get("/chat/sessions/count")
async def get_active_sessions():
    """Get number of active chat sessions."""
    cleanup_expired_sessions()
    return {"active_sessions": len(conversation_store)}
