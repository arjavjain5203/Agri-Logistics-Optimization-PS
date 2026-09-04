// Mock API Service simulating backend endpoints
import {
  MOCK_CROPS,
  MOCK_FARMERS,
  MOCK_BUYERS,
  MOCK_ORDERS,
  MOCK_DEMAND_FORECAST_SERIES,
  MOCK_PRICE_COMPARISON,
  MOCK_LOGISTICS_ROUTE,
} from '../data/mockData';

const delay = (ms = 250) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  // Products / Crops
  async getProducts() {
    await delay(150);
    return [...MOCK_CROPS];
  },

  // Farmers / Producers
  async getFarmers(filter = {}) {
    await delay(200);
    let list = [...MOCK_FARMERS];
    if (filter.cropId) {
      list = list.filter((f) => f.cropId === filter.cropId);
    }
    return list;
  },

  // Orders
  async getOrders() {
    await delay(200);
    return [...MOCK_ORDERS];
  },

  // Create Demand
  async createDemand(demandPayload) {
    await delay(350);
    const id = `DEM-${Date.now().toString().slice(-4)}`;
    return {
      success: true,
      demandId: id,
      data: {
        id,
        ...demandPayload,
        status: 'matched',
        createdAt: new Date().toISOString(),
      },
    };
  },

  // Smart Matching for demand
  async getMatches(crop = 'tomato', targetQuantityKg = 500) {
    await delay(300);
    // Find matching suppliers
    const matchingSuppliers = MOCK_FARMERS.filter(
      (f) => f.cropId === crop || f.crop.toLowerCase().includes(crop.toLowerCase())
    );

    return {
      targetCrop: crop,
      targetQuantityKg,
      totalMatchedSupplyKg: 500,
      matchedSuppliers: matchingSuppliers.length > 0 ? matchingSuppliers : MOCK_FARMERS.slice(0, 3),
      aggregations: {
        totalFarms: 3,
        averageRadiusKm: 11.6,
        blendedPricePerKg: 21.9,
        projectedSavings: '₹4,050',
      },
    };
  },

  // AI Forecast Data
  async getForecast(crop = 'tomato') {
    await delay(250);
    return {
      crop,
      predictedDemandKg: 2500,
      currentSupplyKg: 2180,
      supplyGapKg: 320,
      confidenceScore: 94.8,
      trendPercent: 19,
      series: MOCK_DEMAND_FORECAST_SERIES,
      recommendation: {
        en: 'Secure approximately 320 kg additional tomato supply to avoid a projected shortage next Wednesday in Delhi NCR.',
        hi: 'दिल्ली NCR में संभावित कमी से बचने के लिए अगले बुधवार से पहले लगभग 320 किलोग्राम अतिरिक्त टमाटर की आपूर्ति सुरक्षित करें।',
      },
    };
  },

  // Logistics Route Optimization
  async optimizeRoute(demandId = 'KF-2026-0903') {
    await delay(300);
    return {
      ...MOCK_LOGISTICS_ROUTE,
      demandId,
    };
  },

  // Supply Chain Impact Metrics
  async getImpact() {
    await delay(200);
    return {
      farmerPriceImprovementPct: 46.6,
      buyerCostReductionPct: 10.0,
      logisticsDistanceReductionPct: 31.2,
      supplyFulfillmentRatePct: 94.4,
      economicComparison: MOCK_PRICE_COMPARISON,
    };
  },
};

export default mockApi;
