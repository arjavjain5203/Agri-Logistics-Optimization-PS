/**
 * Real API Service
 * Connects frontend to FastAPI backend
 */

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

/**
 * Generic fetch wrapper with error handling
 */
async function apiFetch(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };
  
  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ detail: 'Request failed' }));
      throw new Error(error.detail || `HTTP ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
}

// ============================================================================
// PRODUCTS / CROPS
// ============================================================================

export async function getProducts(filters = {}) {
  const params = new URLSearchParams();
  if (filters.crop_id) params.append('crop_id', filters.crop_id);
  if (filters.is_available !== undefined) params.append('is_available', filters.is_available);
  
  const query = params.toString() ? `?${params}` : '';
  return apiFetch(`/products${query}`);
}

export async function getAvailableCrops() {
  return apiFetch('/products/crops/available');
}

// ============================================================================
// FARMERS / SUPPLIERS
// ============================================================================

export async function getFarmers(filters = {}) {
  const params = new URLSearchParams();
  if (filters.crop_id) params.append('crop_id', filters.crop_id);
  if (filters.is_fpo !== undefined) params.append('is_fpo', filters.is_fpo);
  
  const query = params.toString() ? `?${params}` : '';
  return apiFetch(`/farmers${query}`);
}

export async function getFarmer(farmerId) {
  return apiFetch(`/farmers/${farmerId}`);
}

// ============================================================================
// BUYERS
// ============================================================================

export async function getBuyers() {
  return apiFetch('/buyers');
}

export async function getBuyer(buyerId) {
  return apiFetch(`/buyers/${buyerId}`);
}

// ============================================================================
// DEMANDS / PROCUREMENT REQUESTS
// ============================================================================

export async function getDemands(filters = {}) {
  const params = new URLSearchParams();
  if (filters.buyer_id) params.append('buyer_id', filters.buyer_id);
  if (filters.status) params.append('status', filters.status);
  if (filters.crop_id) params.append('crop_id', filters.crop_id);
  
  const query = params.toString() ? `?${params}` : '';
  return apiFetch(`/demands${query}`);
}

export async function createDemand(demandData) {
  return apiFetch('/demands', {
    method: 'POST',
    body: JSON.stringify(demandData),
  });
}

// ============================================================================
// ORDERS
// ============================================================================

export async function getOrders(filters = {}) {
  const params = new URLSearchParams();
  if (filters.status) params.append('status', filters.status);
  if (filters.crop_id) params.append('crop_id', filters.crop_id);
  
  const query = params.toString() ? `?${params}` : '';
  return apiFetch(`/orders${query}`);
}

export async function getOrder(orderId) {
  return apiFetch(`/orders/${orderId}`);
}

export async function createOrder(orderData) {
  return apiFetch('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
}

// ============================================================================
// SMART MATCHING
// ============================================================================

export async function matchSuppliers(matchRequest) {
  /**
   * matchRequest: {
   *   crop_id: string,
   *   quantity_kg: number,
   *   buyer_latitude: number,
   *   buyer_longitude: number,
   *   max_budget_per_kg: number,
   *   quality_grade: string,
   *   max_distance_km: number
   * }
   */
  return apiFetch('/intelligence/match', {
    method: 'POST',
    body: JSON.stringify(matchRequest),
  });
}

// ============================================================================
// ROUTE OPTIMIZATION
// ============================================================================

export async function optimizeRoute(routeRequest) {
  /**
   * routeRequest: {
   *   suppliers: array of matched suppliers,
   *   buyer_location: {latitude, longitude, location_name},
   *   algorithm: 'nearest_neighbor' | 'brute_force'
   * }
   */
  return apiFetch('/intelligence/optimize-route', {
    method: 'POST',
    body: JSON.stringify(routeRequest),
  });
}

// ============================================================================
// AI DEMAND FORECASTING
// ============================================================================

export async function getForecast(crop, region = 'delhi-ncr', horizonDays = 21) {
  const params = new URLSearchParams({
    crop,
    region,
    horizon_days: horizonDays,
  });
  
  return apiFetch(`/intelligence/forecast?${params}`);
}

// ============================================================================
// PRICE TRANSPARENCY
// ============================================================================

export async function getPriceBreakdown(crop = 'tomato', quantityKg = 500) {
  const params = new URLSearchParams({
    crop,
    quantity_kg: quantityKg,
  });
  
  return apiFetch(`/intelligence/price-transparency?${params}`);
}

// ============================================================================
// IMPACT METRICS
// ============================================================================

export async function getImpactMetrics() {
  return apiFetch('/intelligence/impact');
}

// ============================================================================
// EXPORT ALL AS DEFAULT
// ============================================================================

export default {
  // Products
  getProducts,
  getAvailableCrops,
  
  // Farmers
  getFarmers,
  getFarmer,
  
  // Buyers
  getBuyers,
  getBuyer,
  
  // Demands
  getDemands,
  createDemand,
  
  // Orders
  getOrders,
  getOrder,
  createOrder,
  
  // Intelligence
  matchSuppliers,
  optimizeRoute,
  getForecast,
  getPriceBreakdown,
  getImpactMetrics,
};
