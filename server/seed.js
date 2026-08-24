require('dotenv').config();
const mongoose = require('mongoose');

// Import Models
const Dashboard = require('./models/Dashboard');
const Demand = require('./models/Demand');
const Trend = require('./models/Trend');
const Port = require('./models/Port');
const Vessel = require('./models/Vessel');
const Alert = require('./models/Alert');
const LiveFeed = require('./models/LiveFeed');
const MapRoute = require('./models/MapRoute');
const User = require('./models/User');

// Mock Data
const dashboardData = {
  kpis: {
    predictedAvgFreight: { value: '$34.25 / MT', trend: '+ 8.6% vs last 30 days', isPositive: false },
    totalCargoDemand: { value: '1,240,000 MT', trend: '+ 12.4% vs previous 90 days', isPositive: true },
    recommendedCharterWindow: { value: '15 May - 25 May', subtext: 'Best time to charter' },
    estimatedSavings: { value: '$2.45 M', subtext: 'Potential savings' }
  },
  routeAvailability: [
    { id: 1, route: 'Australia -> Chennai', availability: 'Medium', estFreight: '$34.20', trend: 'up' },
    { id: 2, route: 'Indonesia -> Vizag', availability: 'High', estFreight: '$28.50', trend: 'down' },
    { id: 3, route: 'South Africa -> Paradip', availability: 'Low', estFreight: '$42.10', trend: 'up' },
    { id: 4, route: 'Russia -> Ennore', availability: 'Medium', estFreight: '$33.80', trend: 'upRight' }
  ],
  optimizationRec: {
    action: 'Charter vessel between',
    dates: '15 May - 25 May 2024',
    expectedFreight: '$33 - $36 / MT',
    cargoQty: '500,000 MT',
    estTotalCost: '$16.75 M',
    potentialSavings: '$2.45 M (12.8%)'
  },
  costBreakdown: [
    { name: 'Freight Cost', value: 10.2, fill: '#3b82f6', percent: '60.9%' },
    { name: 'Cargo Cost', value: 4.25, fill: '#10b981', percent: '25.4%' },
    { name: 'Port Charges', value: 1.25, fill: '#f59e0b', percent: '7.5%' },
    { name: 'Other Charges', value: 1.05, fill: '#ef4444', percent: '6.2%' }
  ],
  recentAlerts: [
    { id: 1, type: 'warning', text: 'Freight rate increase expected on Australia → Chennai route', date: '10 May 2024, 09:30 AM' },
    { id: 2, type: 'danger', text: 'Low vessel availability for South Africa → Paradip route', date: '10 May 2024, 08:15 AM' },
    { id: 3, type: 'info', text: 'Fuel price increased by 3.2% from last week', date: '09 May 2024, 06:45 PM' },
    { id: 4, type: 'success', text: 'New cargo inquiry received for 75,000 MT coal', date: '09 May 2024, 04:20 PM' }
  ]
};

const demandData = {
  commodityData: [
    { name: 'Coal', percent: 42, value: 1.25, fill: '#06b6d4' },
    { name: 'Iron Ore', percent: 28, value: 0.84, fill: '#f97316' },
    { name: 'Fertilizers', percent: 18, value: 0.54, fill: '#8b5cf6' },
    { name: 'Grain', percent: 12, value: 0.36, fill: '#10b981' }
  ],
  totalDemand: 2.99,
  regionData: [
    { region: 'Southeast Asia', demand: 1.55 },
    { region: 'East Coast India', demand: 1.25 },
    { region: 'West Coast India', demand: 0.98 },
    { region: 'East Africa', demand: 0.65 },
    { region: 'Middle East', demand: 0.45 },
  ],
  forecastData: [
    { commodity: 'Coal', current: 1.25, forecast: 1.38, change: 10.4, trend: 'up' },
    { commodity: 'Iron Ore', current: 0.84, forecast: 0.91, change: 8.3, trend: 'up' },
    { commodity: 'Fertilizers', current: 0.54, forecast: 0.56, change: 3.7, trend: 'up' },
    { commodity: 'Grain', current: 0.36, forecast: 0.35, change: -2.8, trend: 'down' }
  ]
};

const trendsData = {
  bunkerData: [
    { month: 'Jan', actual: 590, forecast: null },
    { month: 'Feb', actual: 610, forecast: null },
    { month: 'Mar', actual: 650, forecast: null },
    { month: 'Apr', actual: 640, forecast: null },
    { month: 'May', actual: 660, forecast: null },
    { month: 'Jun', actual: 682, forecast: 682 },
    { month: 'Jul', actual: null, forecast: 710 },
    { month: 'Aug', actual: null, forecast: 740 },
    { month: 'Sep', actual: null, forecast: 730 },
  ],
  bdiData: [
    { month: 'Jan', actual: 1100, forecast: null },
    { month: 'Feb', actual: 1150, forecast: null },
    { month: 'Mar', actual: 1250, forecast: null },
    { month: 'Apr', actual: 1210, forecast: null },
    { month: 'May', actual: 1280, forecast: null },
    { month: 'Jun', actual: 1320, forecast: 1320 },
    { month: 'Jul', actual: null, forecast: 1380 },
    { month: 'Aug', actual: null, forecast: 1450 },
    { month: 'Sep', actual: null, forecast: 1510 },
  ],
  freightData: [
    { month: 'Jan', actual: 28.5, forecast: null },
    { month: 'Feb', actual: 29.1, forecast: null },
    { month: 'Mar', actual: 30.5, forecast: null },
    { month: 'Apr', actual: 30.1, forecast: null },
    { month: 'May', actual: 31.8, forecast: null },
    { month: 'Jun', actual: 32.4, forecast: 32.4 },
    { month: 'Jul', actual: null, forecast: 34.6 },
    { month: 'Aug', actual: null, forecast: 36.8 },
    { month: 'Sep', actual: null, forecast: 38.2 },
  ]
};

const portsData = [
  { port: 'Chennai', congestion: 'High', color: '🔴', fill: '#ef4444', wait: '3–4d', cost: '$4.50', status: 'Operational', risk: 'High', coords: [13.0827, 80.2707], curWidth: 70, foreWidth: 90, trend: 'HIGH' },
  { port: 'Visakhapatnam', congestion: 'Medium', color: '🟡', fill: '#f59e0b', wait: '1–2d', cost: '$3.80', status: 'Operational', risk: 'Medium', coords: [17.6868, 83.2185], curWidth: 40, foreWidth: 50, trend: 'MEDIUM' },
  { port: 'Paradip', congestion: 'Low', color: '🟢', fill: '#10b981', wait: '<1d', cost: '$3.50', status: 'Operational', risk: 'Low', coords: [20.2666, 86.6738], curWidth: 15, foreWidth: 15, trend: 'LOW' },
  { port: 'Ennore', congestion: 'Medium', color: '🟡', fill: '#f59e0b', wait: '2d', cost: '$4.00', status: 'Maintenance', risk: 'High', coords: [13.2500, 80.3333], curWidth: 35, foreWidth: 65, trend: 'RISING' }
];

const vesselsData = [
  { id: 1, name: 'Oceanic Horizon', type: 'Panamax', route: 'Australia → Chennai', capacity: '75,000', availStr: 'High', availColor: '🟢', curFreight: 34.20, predFreight: 31.80, score: 94, eta: '4 Days', origin: [-32.9283, 151.7817], dest: [13.0827, 80.2707], isBestMatch: true },
  { id: 2, name: 'Nordic Spirit', type: 'Handysize', route: 'Australia → Ennore', capacity: '35,000', availStr: 'High', availColor: '🟢', curFreight: 42.50, predFreight: 39.20, score: 88, eta: '5 Days', origin: [-32.9283, 151.7817], dest: [13.2500, 80.3333], isBestMatch: false },
  { id: 3, name: 'Baltic Trader', type: 'Supramax', route: 'Indonesia → Vizag', capacity: '50,000', availStr: 'Medium', availColor: '🟡', curFreight: 28.10, predFreight: 29.50, score: 78, eta: '7 Days', origin: [-0.5022, 117.1536], dest: [17.6868, 83.2185], isBestMatch: false },
  { id: 4, name: 'Pacific Carrier', type: 'Capesize', route: 'South Africa → Paradip', capacity: '150,000', availStr: 'Low', availColor: '🔴', curFreight: 18.90, predFreight: 20.10, score: 62, eta: '12 Days', origin: [-28.7807, 32.0383], dest: [20.2666, 86.6738], isBestMatch: false }
];

const alertsData = [
  { id: 1, time: '09:30', type: 'ai', title: 'Freight increase predicted', subtitle: 'Australia → Chennai', desc: 'Freight rate on Australia → Chennai is predicted to increase 8.4% within 7 days.', confidence: 91, actionText: 'View Forecast', bg: '#0ea5e9' },
  { id: 2, time: '08:15', type: 'critical', title: 'Low vessel availability', subtitle: 'South Africa → Paradip', desc: 'AI Anomaly Detected. Sharp drop in Panamax availability in the region.', actionText: 'Find Alternative Vessel', bg: '#ef4444' }
];

const feedData = [
  { id: 1, time: '15:51', port: 'Chennai', commodity: 'Coal', origin: 'Australia', cargo: '60K MT', freight: '$26.71', prediction: '$24.10', decision: 'WAIT', freshness: 'Fresh', savings: '$2.61', color: '#f59e0b' },
  { id: 2, time: '15:51', port: 'Vizag', commodity: 'Fertilizer', origin: 'Russia', cargo: '45K MT', freight: '$22.07', prediction: '$25.40', decision: 'CHARTER', freshness: 'Fresh', savings: '-$3.33', color: '#10b981' },
  { id: 3, time: '15:50', port: 'Ennore', commodity: 'Coal', origin: 'S. Africa', cargo: '74K MT', freight: '$24.61', prediction: '$23.80', decision: 'WAIT', freshness: 'Aging', savings: '$0.81', color: '#f59e0b' },
  { id: 4, time: '15:48', port: 'Paradip', commodity: 'Iron Ore', origin: 'Brazil', cargo: '120K MT', freight: '$18.90', prediction: '$18.95', decision: 'CHARTER', freshness: 'Stale', savings: '-$0.05', color: '#10b981' }
];

// ============================================================
// REALISTIC MARITIME ROUTES WITH ACCURATE SEA CORRIDOR WAYPOINTS
// All routes follow navigable ocean corridors, major canals, and
// real shipping lanes. No straight lines across land.
// ============================================================

const routesData = [
  // R1: Australia (Newcastle) → Chennai
  // Path: South of Australia → South Indian Ocean → Bay of Bengal → Gulf of Mannar → Chennai
  {
    id: 'R1', name: 'Australia → Chennai', color: '#10b981',
    origin: 'Newcastle, Australia', destination: 'Chennai, India',
    corridor: 'South Indian Ocean', vesselType: 'Capesize Bulk Carrier',
    distanceNm: 5500, etaDays: 17,
    waypoints: [
      [-32.9283, 151.7817], // Newcastle, Australia
      [-38.0, 145.0],       // South of Bass Strait
      [-38.5, 125.0],       // South Indian Ocean (south of Perth)
      [-35.0, 105.0],       // South Indian Ocean (west)
      [-28.0, 90.0],        // Indian Ocean
      [-20.0, 83.0],        // Central Indian Ocean
      [-10.0, 80.0],        // Approaching Sri Lanka from south
      [-3.0, 79.0],         // South of Sri Lanka tip
      [7.0, 79.5],          // Gulf of Mannar
      [13.0827, 80.2707],   // Chennai
    ]
  },

  // R2: Indonesia (Samarinda, East Borneo) → Vizag
  // Path: Makassar Strait → Java Sea → Malacca Strait → Bay of Bengal → Vizag
  {
    id: 'R2', name: 'Indonesia → Vizag', color: '#3b82f6',
    origin: 'Samarinda, Indonesia', destination: 'Visakhapatnam, India',
    corridor: 'Strait of Malacca', vesselType: 'Supramax Bulk Carrier',
    distanceNm: 2800, etaDays: 9,
    waypoints: [
      [-0.5022, 117.1536],  // Samarinda, East Borneo
      [-3.0, 115.0],        // Makassar Strait
      [-5.5, 108.0],        // Java Sea (west Borneo)
      [-3.0, 104.5],        // Banka Strait area
      [1.35, 103.8],        // Singapore Strait
      [5.0, 100.5],         // Malacca Strait (north)
      [8.0, 96.0],          // Andaman Sea
      [10.0, 90.0],         // Bay of Bengal (south)
      [14.0, 84.0],         // Bay of Bengal (northwest)
      [17.6868, 83.2185],   // Visakhapatnam (Vizag)
    ]
  },

  // R3: South Africa (Richards Bay) → Paradip
  // Path: East African coast → Mozambique Channel → Indian Ocean → Bay of Bengal → Paradip
  {
    id: 'R3', name: 'South Africa → Paradip', color: '#f59e0b',
    origin: 'Richards Bay, South Africa', destination: 'Paradip, India',
    corridor: 'Mozambique Channel', vesselType: 'Capesize Bulk Carrier',
    distanceNm: 4800, etaDays: 15,
    waypoints: [
      [-28.7807, 32.0383],  // Richards Bay, South Africa
      [-24.0, 36.0],        // Mozambique coast
      [-18.0, 40.0],        // Mozambique Channel (north)
      [-12.0, 45.0],        // North Mozambique / Comoros area
      [-5.0, 52.0],         // NE of Madagascar / Indian Ocean
      [5.0, 60.0],          // Indian Ocean (west)
      [10.0, 68.0],         // Indian Ocean (central)
      [14.0, 75.0],         // Indian west coast approach
      [18.0, 81.0],         // Approaching Paradip from south
      [20.2666, 86.6738],   // Paradip, India
    ]
  },

  // R4: Brazil (Vitoria) → Vizag
  // Path: South Atlantic → Cape of Good Hope → Indian Ocean → Bay of Bengal
  {
    id: 'R4', name: 'Brazil → Vizag', color: '#ec4899',
    origin: 'Vitoria, Brazil', destination: 'Visakhapatnam, India',
    corridor: 'Cape of Good Hope', vesselType: 'Capesize Bulk Carrier',
    distanceNm: 9200, etaDays: 28,
    waypoints: [
      [-20.3194, -40.3378], // Vitoria, Brazil
      [-25.0, -42.0],       // Offshore south Brazil
      [-35.0, -35.0],       // South Atlantic (west)
      [-38.5, -15.0],       // South Atlantic (mid)
      [-38.0, 5.0],         // South Atlantic (east)
      [-34.8, 20.0],        // South Africa / Cape Agulhas area
      [-35.0, 28.0],        // South Indian Ocean (near Cape)
      [-28.0, 42.0],        // Indian Ocean (SW)
      [-15.0, 58.0],        // Indian Ocean (central)
      [-5.0, 70.0],         // Indian Ocean (east)
      [5.0, 77.0],          // Laccadive Sea
      [12.0, 80.5],         // Bay of Bengal (south)
      [17.6868, 83.2185],   // Visakhapatnam
    ]
  },

  // R5: Saudi Arabia (Ras Tanura) → Mumbai
  // Path: Persian Gulf → Strait of Hormuz → Gulf of Oman → Arabian Sea → Mumbai
  {
    id: 'R5', name: 'Saudi Arabia → Mumbai', color: '#ef4444',
    origin: 'Ras Tanura, Saudi Arabia', destination: 'Mumbai, India',
    corridor: 'Strait of Hormuz', vesselType: 'VLCC Oil Tanker',
    distanceNm: 1150, etaDays: 4,
    waypoints: [
      [26.6430, 50.1587],   // Ras Tanura, Saudi Arabia (Persian Gulf)
      [26.0, 52.0],         // Persian Gulf (east)
      [24.0, 56.5],         // Strait of Hormuz / Muscat area
      [22.0, 59.0],         // Gulf of Oman
      [20.5, 62.0],         // Arabian Sea (north)
      [19.5, 67.0],         // Arabian Sea
      [18.9438, 72.8359],   // Mumbai, India
    ]
  },

  // R6: USA (New Orleans) → Kandla
  // Path: Gulf of Mexico → Caribbean → Atlantic → Suez Canal → Red Sea → Arabian Sea → Kandla
  {
    id: 'R6', name: 'USA → Kandla', color: '#8b5cf6',
    origin: 'New Orleans, USA', destination: 'Kandla, India',
    corridor: 'Suez Canal · Atlantic', vesselType: 'Panamax Bulk Carrier',
    distanceNm: 10800, etaDays: 33,
    waypoints: [
      [29.9511, -90.0715],  // New Orleans (Gulf of Mexico)
      [25.5, -84.0],        // Florida Strait
      [22.0, -76.0],        // Cuba area
      [15.0, -62.0],        // Eastern Caribbean
      [10.0, -48.0],        // Atlantic (SW)
      [5.0, -28.0],         // Central Atlantic
      [10.0, -18.0],        // Off West Africa
      [20.0, -18.5],        // Canary Islands area
      [30.0, -12.0],        // Off Morocco
      [35.9, -5.4],         // Gibraltar Strait
      [36.5, 2.0],          // Western Mediterranean
      [36.0, 12.0],         // Central Mediterranean (Tunisia)
      [33.5, 24.0],         // Eastern Mediterranean
      [31.25, 32.35],       // Port Said (Suez Canal north entrance)
      [30.0832, 32.5498],   // Suez / Ismailia
      [27.0, 34.0],         // Red Sea (north)
      [20.0, 38.5],         // Red Sea (central)
      [12.5, 43.5],         // Bab-el-Mandeb / Gulf of Aden entry
      [10.5, 50.0],         // Gulf of Aden
      [13.0, 58.0],         // Arabian Sea (west)
      [20.0, 63.0],         // Arabian Sea (central)
      [23.0333, 70.2167],   // Kandla, India
    ]
  },

  // R7: Shanghai → Singapore
  // Path: East China Sea → Taiwan Strait → South China Sea → Singapore Strait
  {
    id: 'R7', name: 'Shanghai → Singapore', color: '#06b6d4',
    origin: 'Shanghai, China', destination: 'Singapore',
    corridor: 'South China Sea', vesselType: 'Container Ship',
    distanceNm: 1650, etaDays: 5,
    waypoints: [
      [31.2304, 121.4737],  // Shanghai
      [27.0, 121.5],        // East China Sea (south)
      [23.5, 120.5],        // Taiwan Strait
      [20.0, 118.5],        // South China Sea (north)
      [16.0, 115.0],        // South China Sea (central)
      [10.0, 110.0],        // South China Sea (south)
      [5.0, 107.0],         // South China Sea (far south)
      [2.0, 105.5],         // Singapore approach
      [1.3521, 103.8198],   // Singapore
    ]
  },

  // R8: Chennai → Rotterdam  *** FEATURED SUEZ CANAL ROUTE ***
  // Path: Bay of Bengal → Gulf of Mannar → Arabian Sea → Gulf of Aden
  //       → Red Sea → Suez Canal → Mediterranean → Gibraltar → North Sea → Rotterdam
  {
    id: 'R8', name: 'Chennai → Rotterdam', color: '#ffffff',
    origin: 'Chennai, India', destination: 'Rotterdam, Netherlands',
    corridor: 'Suez Canal · Red Sea · Mediterranean',
    vesselType: 'Panamax Container Ship',
    distanceNm: 8200, etaDays: 25,
    waypoints: [
      [13.0827, 80.2707],   // Chennai, India
      [9.0, 79.5],          // Gulf of Mannar
      [5.0, 77.0],          // South of Sri Lanka
      [3.5, 72.0],          // Laccadive Sea
      [4.5, 63.5],          // Indian Ocean (central)
      [9.5, 53.0],          // Arabian Sea (west)
      [12.0, 47.0],         // Gulf of Aden (entry)
      [12.5, 43.5],         // Gulf of Aden
      [15.0, 42.0],         // Bab-el-Mandeb (southern Red Sea)
      [18.0, 39.5],         // Red Sea (south-central)
      [22.5, 37.5],         // Red Sea (central)
      [26.5, 34.5],         // Red Sea (north)
      [29.9668, 32.5498],   // Suez (south - port entry)
      [30.5, 32.3],         // Suez Canal transit
      [31.25, 32.35],       // Port Said (north exit)
      [32.5, 32.5],         // Eastern Mediterranean (coast)
      [34.0, 27.5],         // Eastern Mediterranean
      [35.5, 18.0],         // Central Mediterranean
      [36.5, 10.0],         // Central Mediterranean (Tunisia area)
      [37.0, 3.5],          // Western Mediterranean (Algeria)
      [36.0, -2.0],         // Near Gibraltar
      [35.9, -5.4],         // Gibraltar Strait
      [38.5, -9.5],         // Atlantic (off Portugal)
      [44.0, -8.5],         // Bay of Biscay
      [48.5, -5.0],         // English Channel approach
      [50.5, 1.5],          // English Channel (Dover)
      [51.9225, 4.4791],    // Rotterdam, Netherlands
    ]
  },

  // R9: Singapore → Rotterdam (via Suez Canal)
  // Path: Malacca Strait → Indian Ocean → Gulf of Aden → Red Sea → Suez → Mediterranean → Rotterdam
  {
    id: 'R9', name: 'Singapore → Rotterdam', color: '#a78bfa',
    origin: 'Singapore', destination: 'Rotterdam, Netherlands',
    corridor: 'Suez Canal · Indian Ocean', vesselType: 'Container Ship',
    distanceNm: 8300, etaDays: 25,
    waypoints: [
      [1.3521, 103.8198],   // Singapore
      [4.5, 100.5],         // Malacca Strait (north)
      [8.0, 97.0],          // Andaman Sea
      [9.0, 88.0],          // Bay of Bengal
      [7.0, 79.5],          // South of India (south tip)
      [4.0, 69.0],          // Indian Ocean (central)
      [7.0, 58.0],          // Indian Ocean (west)
      [11.0, 49.0],         // Gulf of Aden (west)
      [15.0, 42.0],         // Bab-el-Mandeb
      [20.0, 38.5],         // Red Sea (central)
      [26.5, 34.5],         // Red Sea (north)
      [30.0832, 32.5498],   // Suez Canal (south)
      [31.25, 32.35],       // Port Said (north)
      [34.0, 26.0],         // Eastern Mediterranean
      [35.5, 14.0],         // Central Mediterranean
      [36.5, 4.0],          // Western Mediterranean
      [35.9, -5.4],         // Gibraltar Strait
      [38.5, -9.5],         // Atlantic (Portugal)
      [44.5, -8.0],         // Bay of Biscay
      [51.9225, 4.4791],    // Rotterdam
    ]
  },

  // R10: Rotterdam → New York (North Atlantic westbound)
  // Path: North Sea → North of Scotland → North Atlantic Great Circle → New York
  {
    id: 'R10', name: 'Rotterdam → New York', color: '#6ee7b7',
    origin: 'Rotterdam, Netherlands', destination: 'New York, USA',
    corridor: 'North Atlantic', vesselType: 'Container Ship',
    distanceNm: 3600, etaDays: 11,
    waypoints: [
      [51.9225, 4.4791],    // Rotterdam
      [53.5, 1.0],          // North Sea (off UK east coast)
      [56.0, -3.0],         // North Sea (Scotland area)
      [57.0, -10.0],        // North Atlantic (near Scotland)
      [55.0, -18.0],        // North Atlantic (east)
      [50.0, -28.0],        // North Atlantic (central)
      [46.0, -38.0],        // North Atlantic
      [43.0, -50.0],        // Grand Banks area
      [41.5, -62.0],        // Western North Atlantic
      [40.7128, -74.0060],  // New York
    ]
  },

  // R11: Panama Canal → Los Angeles (Pacific)
  // Path: Pacific exit of Panama Canal → Pacific Ocean → Los Angeles
  {
    id: 'R11', name: 'Panama Canal → Los Angeles', color: '#fbbf24',
    origin: 'Panama Canal (Pacific exit)', destination: 'Los Angeles, USA',
    corridor: 'Eastern Pacific', vesselType: 'Container Ship',
    distanceNm: 2850, etaDays: 9,
    waypoints: [
      [9.1438, -79.7248],   // Panama Canal (Pacific side exit)
      [8.5, -80.5],         // Gulf of Panama
      [8.0, -83.0],         // Pacific (Costa Rica coast)
      [10.0, -90.0],        // Pacific (Central America coast)
      [15.0, -99.0],        // Pacific (Mexico coast - offshore)
      [20.0, -106.0],       // Pacific (Jalisco area)
      [25.0, -111.0],       // Pacific (Baja California)
      [30.0, -115.5],       // Pacific (Baja California north)
      [33.7288, -118.2620], // Los Angeles
    ]
  },

  // R12: New York → Rotterdam (North Atlantic eastbound)
  // Path: New York → North Atlantic → Bay of Biscay → English Channel → Rotterdam
  {
    id: 'R12', name: 'New York → Rotterdam', color: '#60a5fa',
    origin: 'New York, USA', destination: 'Rotterdam, Netherlands',
    corridor: 'North Atlantic', vesselType: 'Container Ship',
    distanceNm: 3600, etaDays: 11,
    waypoints: [
      [40.7128, -74.0060],  // New York
      [41.5, -65.0],        // Western North Atlantic (SE of Nova Scotia)
      [43.0, -52.0],        // Grand Banks area
      [46.0, -40.0],        // North Atlantic (mid)
      [49.5, -28.0],        // North Atlantic (east)
      [51.5, -16.0],        // Near UK (south)
      [50.5, -5.0],         // English Channel (west)
      [51.0, 2.5],          // English Channel (east)
      [51.9225, 4.4791],    // Rotterdam
    ]
  },

  // R13: Brazil (Santos) → Rotterdam (via South + North Atlantic)
  {
    id: 'R13', name: 'Brazil → Rotterdam', color: '#f87171',
    origin: 'Santos, Brazil', destination: 'Rotterdam, Netherlands',
    corridor: 'South & North Atlantic', vesselType: 'Bulk Carrier',
    distanceNm: 5400, etaDays: 16,
    waypoints: [
      [-23.9618, -46.3322], // Santos, Brazil
      [-20.0, -42.0],       // Offshore Brazil
      [-10.0, -37.5],       // NE Brazil coast
      [-5.0, -35.0],        // Equatorial Atlantic (Brazil coast)
      [0.0, -28.0],         // Equatorial Atlantic (central)
      [8.0, -23.0],         // North Atlantic (south)
      [15.0, -21.0],        // Tropical North Atlantic
      [22.0, -20.5],        // Canary Islands area
      [30.0, -15.0],        // Near Morocco
      [37.5, -10.5],        // Off Portugal
      [44.5, -8.0],         // Bay of Biscay
      [48.5, -5.0],         // English Channel approach
      [51.9225, 4.4791],    // Rotterdam
    ]
  },

  // R14: Australia (Port Hedland) → Shanghai
  // Path: Timor Sea → Banda Sea → Molucca Sea → Philippines → South China Sea → Shanghai
  {
    id: 'R14', name: 'Australia → Shanghai', color: '#34d399',
    origin: 'Port Hedland, Australia', destination: 'Shanghai, China',
    corridor: 'Timor Sea · South China Sea', vesselType: 'Capesize Bulk Carrier',
    distanceNm: 3900, etaDays: 12,
    waypoints: [
      [-20.3100, 118.5760], // Port Hedland, Australia
      [-14.0, 122.0],       // Timor Sea (west)
      [-9.0, 126.0],        // Timor Sea (east)
      [-5.0, 129.0],        // Banda Sea
      [0.0, 127.5],         // Molucca Sea
      [5.0, 125.0],         // Mindanao / Philippines south
      [10.0, 122.0],        // South China Sea (Philippines west)
      [16.0, 120.0],        // South China Sea (Luzon area)
      [22.0, 121.0],        // Taiwan Strait (south)
      [26.0, 121.5],        // East China Sea (south)
      [31.2304, 121.4737],  // Shanghai
    ]
  },

  // R15: Dubai (Jebel Ali) → Singapore
  // Path: Persian Gulf → Strait of Hormuz → Arabian Sea → Indian Ocean → Strait of Malacca → Singapore
  {
    id: 'R15', name: 'Dubai → Singapore', color: '#fb923c',
    origin: 'Jebel Ali (Dubai), UAE', destination: 'Singapore',
    corridor: 'Arabian Sea · Strait of Malacca', vesselType: 'Container Ship',
    distanceNm: 3300, etaDays: 10,
    waypoints: [
      [24.9857, 55.0273],   // Jebel Ali, Dubai
      [24.5, 57.0],         // Gulf of Oman (west)
      [22.5, 59.5],         // Gulf of Oman (east)
      [20.0, 62.0],         // Arabian Sea (north)
      [16.0, 65.0],         // Arabian Sea (central)
      [10.0, 68.0],         // Arabian Sea (south)
      [5.0, 72.5],          // Indian Ocean (west)
      [1.5, 80.5],          // Indian Ocean (east)
      [0.0, 91.0],          // Bay of Bengal south
      [2.5, 98.0],          // Malacca Strait (south approach)
      [3.5, 101.0],         // Malacca Strait
      [1.3521, 103.8198],   // Singapore
    ]
  },
];

async function seedDB() {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/oceancast');
    console.log('✅ Connected to MongoDB.');

    // Clear old data
    console.log('Clearing old data...');
    await Dashboard.deleteMany({});
    await Demand.deleteMany({});
    await Trend.deleteMany({});
    await Port.deleteMany({});
    await Vessel.deleteMany({});
    await Alert.deleteMany({});
    await LiveFeed.deleteMany({});
    await MapRoute.deleteMany({});

    // Insert new data
    console.log('Inserting new data...');
    await Dashboard.create(dashboardData);
    await Demand.create(demandData);
    await Trend.create(trendsData);
    await Port.insertMany(portsData);
    await Vessel.insertMany(vesselsData);
    await Alert.insertMany(alertsData);
    await LiveFeed.insertMany(feedData);
    // Populate `path` from `waypoints` for backward compat
    const routesWithPath = routesData.map(r => ({ ...r, path: r.waypoints }));
    await MapRoute.insertMany(routesWithPath);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
}

seedDB();
