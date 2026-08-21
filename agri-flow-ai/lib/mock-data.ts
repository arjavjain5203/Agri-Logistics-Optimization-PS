// Static mock data for the AgriFlow AI frontend prototype.
// No backend, no external APIs — everything here is illustrative demo data.

export type RiskLevel = "low" | "moderate" | "high"

export const farmer = {
  name: "Alok Mishra",
  village: "Rampur",
  district: "Gautam Budh Nagar",
  state: "Uttar Pradesh",
  farmSize: "1.8 hectares",
  primaryCrop: "Tomato",
  quantity: "500 kg",
  harvestDate: "24 Aug 2026",
  language: "Hindi",
  avatarInitials: "AM",
}

export type Crop = {
  id: string
  name: string
  nameHi: string
  quantityKg: number
  harvestDate: string
  risk: RiskLevel
  sellingWindowHours?: number
  expectedRevenue?: number
  progress: number
  status: "active" | "harvesting-soon" | "monitoring"
}

export const crops: Crop[] = [
  {
    id: "tomato",
    name: "Tomato",
    nameHi: "टमाटर",
    quantityKg: 500,
    harvestDate: "24 Aug 2026",
    risk: "high",
    sellingWindowHours: 48,
    expectedRevenue: 10000,
    progress: 82,
    status: "harvesting-soon",
  },
  {
    id: "potato",
    name: "Potato",
    nameHi: "आलू",
    quantityKg: 800,
    harvestDate: "02 Sep 2026",
    risk: "low",
    progress: 46,
    status: "active",
  },
  {
    id: "wheat",
    name: "Wheat",
    nameHi: "गेहूं",
    quantityKg: 1200,
    harvestDate: "15 Sep 2026",
    risk: "low",
    progress: 28,
    status: "active",
  },
]

export const cropRiskTimeline = [
  { label: "Today", risk: "low" as RiskLevel },
  { label: "Tomorrow", risk: "moderate" as RiskLevel },
  { label: "Day 3", risk: "high" as RiskLevel },
  { label: "Day 4", risk: "high" as RiskLevel },
]

export const weather = {
  tempC: 29,
  condition: "Partly Cloudy",
  humidity: 72,
  rainProbability: 80,
  windKph: 14,
}

export const forecast = [
  { day: "Today", tempC: 29, rainProbability: 20, risk: "low" as RiskLevel },
  { day: "Tomorrow", tempC: 28, rainProbability: 65, risk: "moderate" as RiskLevel },
  { day: "Day 3", tempC: 27, rainProbability: 90, risk: "high" as RiskLevel },
  { day: "Day 4", tempC: 26, rainProbability: 85, risk: "high" as RiskLevel },
  { day: "Day 5", tempC: 28, rainProbability: 40, risk: "moderate" as RiskLevel },
]

export type Market = {
  id: string
  name: string
  distanceKm: number
  priceKg: number
  transportKg: number
  netKg: number
  recommended?: boolean
  trend: number
}

export const markets: Market[] = [
  {
    id: "varanasi",
    name: "Varanasi APMC",
    distanceKm: 92,
    priceKg: 23,
    transportKg: 3,
    netKg: 20,
    recommended: true,
    trend: 2,
  },
  {
    id: "lucknow",
    name: "Lucknow APMC",
    distanceKm: 125,
    priceKg: 27,
    transportKg: 7,
    netKg: 20,
    trend: 1,
  },
  {
    id: "jaunpur",
    name: "Jaunpur APMC",
    distanceKm: 45,
    priceKg: 18,
    transportKg: 2,
    netKg: 16,
    trend: -1,
  },
  {
    id: "delhi",
    name: "Delhi Azadpur",
    distanceKm: 145,
    priceKg: 25,
    transportKg: 8,
    netKg: 17,
    trend: 0,
  },
]

export const bestMarketReasons = [
  "Highest practical net return",
  "Affordable transport",
  "Suitable selling window",
  "Shared truck available",
  "Strong current demand",
]

export type NearbyFarmer = {
  id: string
  name: string
  quantityKg: number
  crop: string
  distanceKm: number
  status: "joining" | "pending"
}

export const nearbyFarmers: NearbyFarmer[] = [
  { id: "rajesh", name: "Rajesh", quantityKg: 150, crop: "Tomato", distanceKm: 2.4, status: "joining" },
  { id: "sunita", name: "Sunita", quantityKg: 250, crop: "Tomato", distanceKm: 4.1, status: "joining" },
  { id: "amit", name: "Amit", quantityKg: 200, crop: "Tomato", distanceKm: 5.7, status: "pending" },
]

export const sharedTruck = {
  destination: "Varanasi APMC",
  pickupTime: "Tomorrow · 7:00 AM",
  loadKg: 800,
  capacityKg: 1000,
  truckCost: 7000,
  yourProduceKg: 200,
  yourShare: 1750,
  withoutPooling: 3500,
}

export const routeStops = ["Your Farm", "Rajesh", "Sunita", "Amit", "Varanasi APMC"]

export const routeInfo = {
  distanceKm: 118,
  duration: "3h 15m",
  pickupTime: "7:00 AM",
}

export type AgentKey = "crop" | "market" | "logistics" | "voice"

export type Agent = {
  key: AgentKey
  name: string
  icon: "cloud-rain" | "trending-up" | "truck" | "phone"
  status: "active" | "matching" | "ready"
  activity: string
  result: string
}

export const agents: Agent[] = [
  {
    key: "crop",
    name: "Crop Vulnerability Agent",
    icon: "cloud-rain",
    status: "active",
    activity: "Monitoring weather & crop risk",
    result: "High spoilage risk detected",
  },
  {
    key: "market",
    name: "Market Arbitrage Agent",
    icon: "trending-up",
    status: "active",
    activity: "Comparing 12 APMC markets",
    result: "Varanasi provides highest net return",
  },
  {
    key: "logistics",
    name: "Logistics Bundling Agent",
    icon: "truck",
    status: "matching",
    activity: "Matching nearby farmers",
    result: "3 compatible farmers found",
  },
  {
    key: "voice",
    name: "Voice Dispatch Agent",
    icon: "phone",
    status: "ready",
    activity: "Preparing farmer notification",
    result: "Voice recommendation ready",
  },
]

export const dashboardTimeline = [
  { time: "09:30", label: "Weather risk detected" },
  { time: "10:00", label: "Market prices analyzed" },
  { time: "10:15", label: "Best market identified" },
  { time: "10:25", label: "Shared truck found" },
  { time: "10:30", label: "Pickup awaiting confirmation" },
]

export const agentTimeline = [
  { time: "10:02", label: "Weather risk detected" },
  { time: "10:04", label: "12 markets scanned" },
  { time: "10:06", label: "Best market identified" },
  { time: "10:08", label: "3 farmers matched" },
  { time: "10:10", label: "Route optimized" },
  { time: "10:12", label: "Voice notification prepared" },
]

export const impact = {
  expectedRevenue: 10000,
  spoilageAvoided: 2500,
  transportSaved: 1750,
}

export type NotificationItem = {
  id: string
  category: "weather" | "market" | "logistics"
  icon: "alert" | "trending-up" | "truck" | "wheat" | "check"
  message: string
  time: string
  read: boolean
}

export const notifications: NotificationItem[] = [
  {
    id: "n1",
    category: "weather",
    icon: "alert",
    message: "Heavy rainfall expected tomorrow.",
    time: "10 min ago",
    read: false,
  },
  {
    id: "n2",
    category: "market",
    icon: "trending-up",
    message: "Varanasi price increased by ₹2/kg.",
    time: "32 min ago",
    read: false,
  },
  {
    id: "n3",
    category: "logistics",
    icon: "truck",
    message: "Shared truck available.",
    time: "1 hr ago",
    read: false,
  },
  {
    id: "n4",
    category: "weather",
    icon: "wheat",
    message: "Tomato selling window is 48 hours.",
    time: "2 hr ago",
    read: true,
  },
  {
    id: "n5",
    category: "logistics",
    icon: "check",
    message: "Pickup confirmed.",
    time: "Yesterday",
    read: true,
  },
]

export type VoiceMessage = {
  id: string
  sender: "ai" | "farmer"
  textHi: string
  duration: string
}

export const voiceConversation: VoiceMessage[] = [
  {
    id: "v1",
    sender: "ai",
    textHi: "Namaste Alok ji \uD83D\uDC4B",
    duration: "0:03",
  },
  {
    id: "v2",
    sender: "ai",
    textHi: "Aapke tomato ke liye Varanasi mandi mein ₹23 per kg ka daam mil raha hai.",
    duration: "0:07",
  },
  {
    id: "v3",
    sender: "farmer",
    textHi: "Haan, pickup kab hai?",
    duration: "0:02",
  },
  {
    id: "v4",
    sender: "ai",
    textHi: "Kal subah 7 baje shared truck aayega.",
    duration: "0:04",
  },
]
