// Production API Configuration for Aviotixx Backend
// Backend handles EaseMyTrip credentials and CORS issues

export const API_CONFIG = {
  // Production Backend Base URL (with CORS proxy fallback for CSP restrictions)
  // baseUrl: 'https://backendhostinger-production.up.railway.app/api',
  baseUrl: 'http://localhost:4000/api',
  
  // Fallback CORS Proxy (if CSP blocks direct requests)
  corsProxyUrl: 'https://corsproxy.io/?',
  
  // API Endpoints
  endpoints: {
    // Flight Search & Operations
    flightSearch: '/flights/search',
    flightRePrice: '/flights/re-price',
    flightSeatMap: '/flights/seat-map',
    flightSSR: '/flights/ssr',
    
    // Public Content (CMS)
    publicContent: '/public/content',
    
    // Health Check
    health: '/health',
    debug: '/debug',
  },
  
  // Request configuration
  requestOptions: {
    mode: 'cors' as RequestMode,
    credentials: 'omit' as RequestCredentials,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  },
};

// Trip Type Constants (matches EaseMyTrip API)
export const TRIP_TYPES = {
  ONE_WAY: 0,
  ROUND_TRIP: 1,
  MULTI_CITY: 2,
} as const;

// Cabin Class Constants (matches EaseMyTrip API)
export const CABIN_CLASSES = {
  ECONOMY: 0,
  FIRST: 1,
  BUSINESS: 2,
  PREMIUM_ECONOMY: 4,
} as const;

// Common Airport Codes for USA to India routes
export const AIRPORT_CODES = {
  // USA
  JFK: 'JFK', // New York
  EWR: 'EWR', // Newark
  SFO: 'SFO', // San Francisco
  LAX: 'LAX', // Los Angeles
  ORD: 'ORD', // Chicago
  IAD: 'IAD', // Washington DC
  IAH: 'IAH', // Houston
  ATL: 'ATL', // Atlanta
  BOS: 'BOS', // Boston
  SEA: 'SEA', // Seattle
  
  // India
  DEL: 'DEL', // New Delhi
  BOM: 'BOM', // Mumbai
  BLR: 'BLR', // Bangalore
  CCU: 'CCU', // Kolkata
  MAA: 'MAA', // Chennai
  AMD: 'AMD', // Ahmedabad
  HYD: 'HYD', // Hyderabad
  GOI: 'GOI', // Goa
  PNQ: 'PNQ', // Pune
  COK: 'COK', // Kochi
} as const;
