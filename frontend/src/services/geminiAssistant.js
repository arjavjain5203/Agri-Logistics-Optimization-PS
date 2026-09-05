/**
 * KrishiFlow AI Assistant — Groq API client (OpenAI-compatible)
 *
 * Uses Groq's ultra-fast inference (llama3-70b) called directly from the browser.
 * Conversation memory is maintained as a client-side state dictionary.
 * Live agricultural data is fetched from the backend and injected into context.
 */

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_URL     = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL   = 'qwen/qwen3.8-27b'; // Best available model on this account

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// ---------------------------------------------------------------------------
// In-memory conversation state dictionary
// chatHistory: Array of { role: 'user'|'assistant', content: string }
// ---------------------------------------------------------------------------

let sessionId   = null;
let chatHistory = [];   // persistent across open/close of the chat panel

function newSessionId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = (Math.random() * 16) | 0;
    return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
  });
}

// ---------------------------------------------------------------------------
// System prompt — Agricultural Demand Intelligence
// ---------------------------------------------------------------------------

const SYSTEM_PROMPT = `You are KrishiFlow AI Assistant — an expert agricultural intelligence agent for India's premier agri-logistics platform that connects farmers directly to institutional buyers, eliminating middlemen.

## YOUR EXPERTISE
- Indian mandi price data, APMC market trends, and commodity pricing (24+ years of data)
- Agricultural DEMAND FORECASTING using LightGBM ML models trained on historical mandi data
- Supply chain optimisation for perishable commodities
- Weather impact on Indian crop production (Rabi/Kharif seasons, monsoon patterns)
- Festival and seasonal demand cycles: Diwali, Navratri, Eid, harvest festivals
- India-specific crops: Tomato, Potato, Onion, Carrot, Cauliflower, Wheat, Rice, Pulses
- Cold chain logistics, FPO (Farmer Producer Organisations), rural last-mile supply chains
- Market dynamics in Delhi-NCR, Mumbai, Pune, Bengaluru, Hyderabad mandis

## DEMAND PREDICTION CAPABILITY
When asked about demand forecasts, supply gaps, or price predictions:
1. Give SPECIFIC quantitative predictions — e.g. "Tomato demand in Delhi-NCR is forecast to RISE 18-24% over the next 21 days."
2. Identify key drivers: weather, festival calendar, seasonal supply patterns, logistics bottlenecks.
3. Recommend procurement actions: volumes to secure, timing windows, price ranges in ₹/kg.
4. Highlight supply risks and mitigation strategies.
5. Always mention confidence level and major uncertainty factors.
6. Reference historical patterns (e.g., "Last Navratri saw a 35% spike in vegetable demand").

## PLATFORM CONTEXT (KrishiFlow)
- 1,240+ smallholder farmers connected directly to institutional buyers
- Farmer income improvement: +46.6% vs traditional mandi route
- Buyer cost reduction: -10% vs traditional supply chain
- Food waste reduction: 78% (from 28% to 6.2%)
- Cold chain coverage: 100%
- Active crops: Tomato, Potato, Onion, Carrot, Cauliflower
- Coverage: Delhi-NCR, UP, Haryana, Rajasthan farm clusters

## RESPONSE RULES
- Be concise, direct, and data-driven. No unnecessary filler text.
- Use ₹ (Indian Rupees) for pricing, kg/MT for quantities.
- For demand predictions always state: trend direction ↑↓, % change, primary driver, and recommended action.
- Support English AND Hindi — if the user writes in Hindi, reply entirely in Hindi.
- Never fabricate data — if uncertain, say so and suggest checking the live dashboard.
- Format key numbers in CAPS or with emphasis for easy scanning.`;

// ---------------------------------------------------------------------------
// Fetch live context from the backend
// ---------------------------------------------------------------------------

async function fetchLiveContext(context = {}) {
  const lines = [];
  try {
    const crop   = (context.crop   || 'tomato').toLowerCase();
    const region = context.region  || 'delhi-ncr';

    // Demand forecast from backend
    const fc = await fetch(
      `${API_BASE}/intelligence/forecast?crop=${crop}&region=${region}&horizon_days=21`
    ).then(r => r.ok ? r.json() : null).catch(() => null);

    if (fc?.success) {
      lines.push(`\n[LIVE AGRI DATA — ${crop.toUpperCase()} / ${region.toUpperCase()}]`);
      lines.push(`• Predicted demand (21-day horizon): ${fc.predicted_demand_kg} kg`);
      lines.push(`• Current supply estimate:           ${fc.current_supply_kg} kg`);
      lines.push(`• Supply gap:                        ${fc.supply_gap_kg} kg`);
      lines.push(`• Demand trend:                      +${fc.trend_percent}%`);
      lines.push(`• Model confidence:                  ${fc.confidence_score}%`);
      if (fc.recommendation?.en) lines.push(`• Platform recommendation: ${fc.recommendation.en}`);
    }

    // Price transparency from backend
    const pr = await fetch(
      `${API_BASE}/intelligence/price-transparency?crop=${crop}&quantity_kg=500`
    ).then(r => r.ok ? r.json() : null).catch(() => null);

    if (pr?.success) {
      lines.push(`\n[LIVE PRICES — ${crop.toUpperCase()} (500 kg benchmark)]`);
      lines.push(`• KrishiFlow buyer pays:   ₹${pr.krishiflow_model?.buyer_pays_per_kg}/kg`);
      lines.push(`• Farmer receives:         ₹${pr.krishiflow_model?.farmer_receives_per_kg}/kg`);
      lines.push(`• Traditional mandi rate:  ₹${pr.traditional_model?.buyer_pays_per_kg}/kg`);
      lines.push(`• Farmer income gain:      +${pr.impact_metrics?.farmer_income_gain_pct}%`);
    }
  } catch (_) {
    // Backend may be offline — silently continue without live data
  }
  return lines.join('\n');
}

// ---------------------------------------------------------------------------
// Core: call Groq Chat Completions API
// ---------------------------------------------------------------------------

async function callGroq(userMessage) {
  // Build messages: system + history + current user message
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...chatHistory,
    { role: 'user',   content: userMessage },
  ];

  const res = await fetch(GROQ_URL, {
    method:  'POST',
    headers: {
      'Content-Type':  'application/json',
      'Authorization': `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model:       GROQ_MODEL,
      messages,
      temperature: 0.7,
      max_tokens:  1024,
      top_p:       0.95,
      stream:      false,
    }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const msg = err?.error?.message || `Groq API error ${res.status}`;
    throw new Error(msg);
  }

  const data  = await res.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();
  if (!reply) throw new Error('Empty response from Groq API.');
  return reply;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Send a message to the KrishiFlow AI Assistant.
 * Maintains full conversation memory (state dictionary) client-side.
 *
 * @param {string} userMessage - The user's query
 * @param {{ pathname?, role?, crop?, region? }} context - Page context
 * @param {'en'|'hi'} language
 * @returns {Promise<{ text: string, card: null }>}
 */
export async function getAssistantResponse(userMessage, context = {}, language = 'en') {
  if (!sessionId) sessionId = newSessionId();

  // Fetch live data and inject into user message as context
  const liveData = await fetchLiveContext(context);
  const enriched = liveData
    ? `${userMessage}\n\n${liveData}`
    : userMessage;

  const reply = await callGroq(enriched);

  // Persist to conversation state dictionary (last 20 turns = 10 exchanges)
  chatHistory.push({ role: 'user',      content: userMessage }); // store clean version
  chatHistory.push({ role: 'assistant', content: reply });
  if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);

  return { text: reply, card: null };
}

/**
 * Reset conversation memory — called when user clicks the ↺ button.
 */
export async function clearAssistantSession() {
  sessionId   = null;
  chatHistory = [];
}

/** Returns the active session ID. */
export function getCurrentSessionId() { return sessionId; }

// ---------------------------------------------------------------------------
// Contextual quick-action chips shown below the chat input
// ---------------------------------------------------------------------------

export function getSuggestedQuestions(pathname = '', role = 'buyer', language = 'en') {
  const hi = language === 'hi';

  if (pathname.includes('/ai') || pathname.includes('/forecast')) {
    return hi
      ? ['टमाटर की माँग अगले 3 हफ्तों में?', 'आपूर्ति की कमी कहाँ है?', 'कौन सी फसल खरीदें?']
      : ['Tomato demand forecast for next 3 weeks?', 'Where is the current supply gap?', 'Which crop to procure for best margins?'];
  }
  if (pathname.includes('/logistics')) {
    return hi
      ? ['यह रूट क्यों बेहतर है?', 'लॉजिस्टिक्स लागत कम कैसे करें?', 'कोल्ड चेन के लिए सबसे अच्छा रूट?']
      : ['Why is this route optimal?', 'How can I reduce logistics costs?', 'Best cold-chain route for tomatoes?'];
  }
  if (pathname.includes('/matching')) {
    return hi
      ? ['इस किसान की सिफारिश क्यों?', 'शीर्ष 3 आपूर्तिकर्ता कौन?', '500 किग्रा कैसे पूरे हों?']
      : ['Why was this farmer recommended?', 'Who are the top 3 quality suppliers?', 'How to fulfil a 500 kg order?'];
  }
  if (pathname.includes('/pricing')) {
    return hi
      ? ['KrishiFlow बनाम मंडी में बचत?', 'किसान ₹22/किग्रा कैसे कमाता है?', 'आज उचित मूल्य क्या है?']
      : ['How much do I save vs traditional mandi?', 'How does farmer earn ₹22/kg here?', "What is today's fair price for tomatoes?"];
  }

  // Default / dashboard / home
  return hi
    ? ['मांग पूर्वानुमान कैसे काम करता है?', 'किसान से सीधे खरीदने के फायदे?', 'आज किस फसल की कमी है?']
    : ['How does the AI demand forecasting work?', 'Benefits of buying directly from farmers?', 'Which crops have a supply shortage today?'];
}

/** Quick-action buttons in the chat panel. */
export function getQuickActions(role = 'buyer', language = 'en') {
  const hi = language === 'hi';
  if (role === 'farmer') {
    return hi
      ? [{ label: 'आज का भाव',  query: 'आज टमाटर का उचित बाज़ार भाव क्या है?' },
         { label: 'फसल बेचें',   query: 'मैं 200 किग्रा टमाटर बेचना चाहता हूँ, क्या करूँ?' }]
      : [{ label: "Today's Price", query: 'What is the fair market price for tomatoes today?' },
         { label: 'Sell My Crop',  query: 'I want to sell 200 kg tomatoes. What should I do?' }];
  }
  return hi
    ? [{ label: 'मांग पूर्वानुमान', query: 'दिल्ली में टमाटर की माँग अगले 3 हफ्तों में क्या होगी?' },
       { label: 'आपूर्ति अंतर',     query: 'अभी किन फसलों में आपूर्ति की कमी है?' }]
    : [{ label: 'Demand Forecast', query: 'What is the tomato demand forecast for Delhi-NCR in the next 3 weeks?' },
       { label: 'Supply Gap',      query: 'Which crops currently have a supply shortage?' }];
}
