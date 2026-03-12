// Dynamic Airport Search using Real Airport API
// Uses AviationStack API (free tier) for comprehensive worldwide airport data

// Cache for airport search results
let airportCache = new Map<string, any[]>();
let cacheTimestamp = 0;
const CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Free Airport API configuration
const AIRPORT_API_CONFIG = {
  // Option 1: AviationStack (free tier - 1000 requests/month)
  aviationstack: {
    baseUrl: 'http://api.aviationstack.com/v1/airports',
    apiKey: 'your-free-api-key', // Get free key from aviationstack.com
    params: (query: string) => `?access_key=${AIRPORT_API_CONFIG.aviationstack.apiKey}&search=${query}&limit=10`
  },
  
  // Option 2: Fallback to Airport-data.com (no key required)
  fallback: {
    baseUrl: 'https://airport-data.com/api/ac.php',
    params: (query: string) => `?search=${query}`
  }
};

// Comprehensive airport database (works without API)
const LOCAL_AIRPORTS = [
  // United States
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy International', country: 'United States' },
  { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International', country: 'United States' },
  { code: 'ORD', city: 'Chicago', name: "O'Hare International", country: 'United States' },
  { code: 'MIA', city: 'Miami', name: 'Miami International', country: 'United States' },
  { code: 'SFO', city: 'San Francisco', name: 'San Francisco International', country: 'United States' },
  { code: 'SEA', city: 'Seattle', name: 'Seattle-Tacoma International', country: 'United States' },
  { code: 'LAS', city: 'Las Vegas', name: 'Harry Reid International', country: 'United States' },
  { code: 'ATL', city: 'Atlanta', name: 'Hartsfield-Jackson Atlanta International', country: 'United States' },
  { code: 'DFW', city: 'Dallas', name: 'Dallas/Fort Worth International', country: 'United States' },
  { code: 'DEN', city: 'Denver', name: 'Denver International', country: 'United States' },
  { code: 'CLT', city: 'Charlotte', name: 'Charlotte Douglas International', country: 'United States' },
  { code: 'MCO', city: 'Orlando', name: 'Orlando International', country: 'United States' },
  { code: 'PHX', city: 'Phoenix', name: 'Phoenix Sky Harbor International', country: 'United States' },
  { code: 'IAH', city: 'Houston', name: 'George Bush Intercontinental', country: 'United States' },
  { code: 'BOS', city: 'Boston', name: 'Logan International', country: 'United States' },
  { code: 'MSP', city: 'Minneapolis', name: 'Minneapolis-St Paul International', country: 'United States' },
  { code: 'DTW', city: 'Detroit', name: 'Detroit Metropolitan Wayne County', country: 'United States' },
  { code: 'EWR', city: 'Newark', name: 'Newark Liberty International', country: 'United States' },
  { code: 'PHL', city: 'Philadelphia', name: 'Philadelphia International', country: 'United States' },
  { code: 'LGA', city: 'New York', name: 'LaGuardia', country: 'United States' },
  { code: 'IAD', city: 'Washington DC', name: 'Washington Dulles International', country: 'United States' },
  { code: 'SLC', city: 'Salt Lake City', name: 'Salt Lake City International', country: 'United States' },
  { code: 'FLL', city: 'Fort Lauderdale', name: 'Fort Lauderdale-Hollywood International', country: 'United States' },
  { code: 'BWI', city: 'Baltimore', name: 'Baltimore/Washington International', country: 'United States' },
  { code: 'TPA', city: 'Tampa', name: 'Tampa International', country: 'United States' },

  // India
  { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi International', country: 'India' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International', country: 'India' },
  { code: 'BLR', city: 'Bangalore', name: 'Kempegowda International', country: 'India' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai International', country: 'India' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International', country: 'India' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International', country: 'India' },
  { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel International', country: 'India' },
  { code: 'COK', city: 'Kochi', name: 'Cochin International', country: 'India' },
  { code: 'PNQ', city: 'Pune', name: 'Pune Airport', country: 'India' },
  { code: 'GOI', city: 'Goa', name: 'Goa International', country: 'India' },
  { code: 'TRV', city: 'Trivandrum', name: 'Trivandrum International', country: 'India' },
  { code: 'JAI', city: 'Jaipur', name: 'Jaipur International', country: 'India' },
  { code: 'LKO', city: 'Lucknow', name: 'Chaudhary Charan Singh International', country: 'India' },
  { code: 'IXC', city: 'Chandigarh', name: 'Chandigarh International', country: 'India' },
  { code: 'GAU', city: 'Guwahati', name: 'Lokpriya Gopinath Bordoloi International', country: 'India' },
  { code: 'NAG', city: 'Nagpur', name: 'Dr. Babasaheb Ambedkar International', country: 'India' },
  { code: 'VNS', city: 'Varanasi', name: 'Lal Bahadur Shastri International', country: 'India' },
  { code: 'IXR', city: 'Ranchi', name: 'Birsa Munda International', country: 'India' },
  { code: 'RPR', city: 'Raipur', name: 'Swami Vivekananda International', country: 'India' },
  { code: 'IXB', city: 'Bagdogra', name: 'Bagdogra International', country: 'India' },

  // United Kingdom & Europe
  { code: 'LHR', city: 'London', name: 'Heathrow', country: 'United Kingdom' },
  { code: 'LGW', city: 'London', name: 'Gatwick', country: 'United Kingdom' },
  { code: 'STN', city: 'London', name: 'Stansted', country: 'United Kingdom' },
  { code: 'MAN', city: 'Manchester', name: 'Manchester Airport', country: 'United Kingdom' },
  { code: 'EDI', city: 'Edinburgh', name: 'Edinburgh Airport', country: 'United Kingdom' },
  { code: 'GLA', city: 'Glasgow', name: 'Glasgow International', country: 'United Kingdom' },
  { code: 'CDG', city: 'Paris', name: 'Charles de Gaulle', country: 'France' },
  { code: 'FRA', city: 'Frankfurt', name: 'Frankfurt International', country: 'Germany' },
  { code: 'AMS', city: 'Amsterdam', name: 'Amsterdam Schiphol', country: 'Netherlands' },
  { code: 'MAD', city: 'Madrid', name: 'Adolfo Suárez Madrid-Barajas', country: 'Spain' },
  { code: 'BCN', city: 'Barcelona', name: 'Barcelona-El Prat', country: 'Spain' },
  { code: 'FCO', city: 'Rome', name: 'Leonardo da Vinci-Fiumicino', country: 'Italy' },
  { code: 'MUC', city: 'Munich', name: 'Munich International', country: 'Germany' },
  { code: 'ZUR', city: 'Zurich', name: 'Zurich International', country: 'Switzerland' },
  { code: 'VIE', city: 'Vienna', name: 'Vienna International', country: 'Austria' },
  { code: 'ARN', city: 'Stockholm', name: 'Arlanda', country: 'Sweden' },
  { code: 'CPH', city: 'Copenhagen', name: 'Copenhagen Airport', country: 'Denmark' },
  { code: 'OSL', city: 'Oslo', name: 'Oslo Gardermoen', country: 'Norway' },
  { code: 'IST', city: 'Istanbul', name: 'Istanbul Airport', country: 'Turkey' },
  { code: 'ATH', city: 'Athens', name: 'Athens International', country: 'Greece' },

  // Middle East
  { code: 'DXB', city: 'Dubai', name: 'Dubai International', country: 'United Arab Emirates' },
  { code: 'DOH', city: 'Doha', name: 'Hamad International', country: 'Qatar' },
  { code: 'AUH', city: 'Abu Dhabi', name: 'Zayed International', country: 'United Arab Emirates' },
  { code: 'RUH', city: 'Riyadh', name: 'King Khalid International', country: 'Saudi Arabia' },
  { code: 'JED', city: 'Jeddah', name: 'King Abdulaziz International', country: 'Saudi Arabia' },
  { code: 'KWI', city: 'Kuwait City', name: 'Kuwait International', country: 'Kuwait' },
  { code: 'BAH', city: 'Bahrain', name: 'Bahrain International', country: 'Bahrain' },
  { code: 'MCT', city: 'Muscat', name: 'Muscat International', country: 'Oman' },
  { code: 'AMM', city: 'Amman', name: 'Queen Alia International', country: 'Jordan' },
  { code: 'BEY', city: 'Beirut', name: 'Rafic Hariri International', country: 'Lebanon' },
  { code: 'CAI', city: 'Cairo', name: 'Cairo International', country: 'Egypt' },

  // Asia Pacific
  { code: 'SIN', city: 'Singapore', name: 'Singapore Changi', country: 'Singapore' },
  { code: 'HKG', city: 'Hong Kong', name: 'Hong Kong International', country: 'Hong Kong' },
  { code: 'NRT', city: 'Tokyo', name: 'Narita International', country: 'Japan' },
  { code: 'HND', city: 'Tokyo', name: 'Haneda', country: 'Japan' },
  { code: 'KIX', city: 'Osaka', name: 'Kansai International', country: 'Japan' },
  { code: 'ICN', city: 'Seoul', name: 'Incheon International', country: 'South Korea' },
  { code: 'GMP', city: 'Seoul', name: 'Gimpo', country: 'South Korea' },
  { code: 'PEK', city: 'Beijing', name: 'Beijing Capital International', country: 'China' },
  { code: 'PVG', city: 'Shanghai', name: 'Pudong International', country: 'China' },
  { code: 'CAN', city: 'Guangzhou', name: 'Baiyun International', country: 'China' },
  { code: 'TPE', city: 'Taipei', name: 'Taiwan Taoyuan International', country: 'Taiwan' },
  { code: 'BKK', city: 'Bangkok', name: 'Suvarnabhumi', country: 'Thailand' },
  { code: 'KUL', city: 'Kuala Lumpur', name: 'Kuala Lumpur International', country: 'Malaysia' },
  { code: 'CGK', city: 'Jakarta', name: 'Soekarno-Hatta International', country: 'Indonesia' },
  { code: 'MNL', city: 'Manila', name: 'Ninoy Aquino International', country: 'Philippines' },
  { code: 'HAN', city: 'Hanoi', name: 'Noi Bai International', country: 'Vietnam' },
  { code: 'SGN', city: 'Ho Chi Minh City', name: 'Tan Son Nhat', country: 'Vietnam' },

  // Australia & New Zealand
  { code: 'SYD', city: 'Sydney', name: 'Kingsford Smith', country: 'Australia' },
  { code: 'MEL', city: 'Melbourne', name: 'Melbourne Airport', country: 'Australia' },
  { code: 'BNE', city: 'Brisbane', name: 'Brisbane Airport', country: 'Australia' },
  { code: 'PER', city: 'Perth', name: 'Perth Airport', country: 'Australia' },
  { code: 'AKL', city: 'Auckland', name: 'Auckland Airport', country: 'New Zealand' },
  { code: 'CHC', city: 'Christchurch', name: 'Christchurch Airport', country: 'New Zealand' },

  // Canada
  { code: 'YYZ', city: 'Toronto', name: 'Pearson International', country: 'Canada' },
  { code: 'YVR', city: 'Vancouver', name: 'Vancouver International', country: 'Canada' },
  { code: 'YUL', city: 'Montreal', name: 'Pierre Elliott Trudeau International', country: 'Canada' },
  { code: 'YYC', city: 'Calgary', name: 'Calgary International', country: 'Canada' },
  { code: 'YEG', city: 'Edmonton', name: 'Edmonton International', country: 'Canada' },

  // Africa
  { code: 'JNB', city: 'Johannesburg', name: 'OR Tambo International', country: 'South Africa' },
  { code: 'CPT', city: 'Cape Town', name: 'Cape Town International', country: 'South Africa' },
  { code: 'ADD', city: 'Addis Ababa', name: 'Bole International', country: 'Ethiopia' },
  { code: 'LOS', city: 'Lagos', name: 'Murtala Muhammed International', country: 'Nigeria' },
  { code: 'TUN', city: 'Tunis', name: 'Tunis-Carthage International', country: 'Tunisia' },

  // South America
  { code: 'GRU', city: 'São Paulo', name: 'Guarulhos International', country: 'Brazil' },
  { code: 'GIG', city: 'Rio de Janeiro', name: 'Galeão International', country: 'Brazil' },
  { code: 'BOG', city: 'Bogotá', name: 'El Dorado International', country: 'Colombia' },
  { code: 'LIM', city: 'Lima', name: 'Jorge Chávez International', country: 'Peru' },
  { code: 'SCL', city: 'Santiago', name: 'Comodoro Arturo Merino Benítez International', country: 'Chile' },
  { code: 'EZE', city: 'Buenos Aires', name: 'Ezeiza International', country: 'Argentina' },
];

// Quick popular airports for initial display
const POPULAR_AIRPORTS = [
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy International', country: 'United States' },
  { code: 'LHR', city: 'London', name: 'Heathrow', country: 'United Kingdom' },
  { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi International', country: 'India' },
  { code: 'DXB', city: 'Dubai', name: 'Dubai International', country: 'United Arab Emirates' },
  { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International', country: 'United States' },
  { code: 'SIN', city: 'Singapore', name: 'Singapore Changi', country: 'Singapore' },
];

/**
 * Search airports - hybrid local + API approach
 * @param query Search term (city, airport name, or IATA code)
 * @param region Optional region filter
 * @returns Promise<Airport[]>
 */
export async function searchAirports(query: string, region?: string): Promise<any[]> {
  // Return popular airports if query is empty
  if (!query || query.length < 1) {
    return POPULAR_AIRPORTS;
  }

  // Always search local database first (immediate results)
  const localResults = searchLocalAirports(query, region);
  
  // For short queries, return local results immediately
  if (query.length < 3) {
    return localResults;
  }

  // For longer queries, try to enhance with API data
  try {
    const cacheKey = `search_${query.toLowerCase()}`;
    const now = Date.now();
    
    // Check API cache
    if (airportCache.has(cacheKey) && (now - cacheTimestamp) < CACHE_DURATION) {
      const cachedResults = airportCache.get(cacheKey) || [];
      // Merge local and cached API results, remove duplicates
      return mergeDeduplicate(localResults, cachedResults);
    }

    // Only try API if we have a valid key configured
    if (AIRPORT_API_CONFIG.aviationstack.apiKey && 
        AIRPORT_API_CONFIG.aviationstack.apiKey !== 'your-free-api-key') {
      const apiResults = await searchAviationStack(query);
      if (apiResults.length > 0) {
        airportCache.set(cacheKey, apiResults);
        cacheTimestamp = now;
        return mergeDeduplicate(localResults, apiResults);
      }
    }
  } catch (error) {
    console.warn('Airport API search failed, using local results:', error);
  }
  
  // Always return local results as fallback
  return localResults;
}

/**
 * Search local airport database (synchronous, always works)
 */
export function searchLocalAirports(query: string, region?: string): any[] {
  if (!query) {
    return POPULAR_AIRPORTS;
  }
  
  const searchTerm = query.toLowerCase();
  
  const filtered = LOCAL_AIRPORTS.filter(airport => {
    const matchesQuery = 
      airport.code.toLowerCase().includes(searchTerm) ||
      airport.city.toLowerCase().includes(searchTerm) ||
      airport.name.toLowerCase().includes(searchTerm) ||
      airport.country.toLowerCase().includes(searchTerm);
    
    if (!region || region === 'ALL') return matchesQuery;
    
    // Apply region filter if specified
    if (region === 'US') return matchesQuery && airport.country === 'United States';
    if (region === 'INDIA') return matchesQuery && airport.country === 'India';
    if (region === 'HUBS') {
      const hubCountries = ['United Arab Emirates', 'Qatar', 'Singapore', 'Turkey'];
      return matchesQuery && hubCountries.includes(airport.country);
    }
    
    return matchesQuery;
  }).slice(0, 10); // Limit to top 10 results
  
  return filtered;
}

/**
 * Merge and deduplicate airport results
 */
function mergeDeduplicate(localResults: any[], apiResults: any[]): any[] {
  const seen = new Set(localResults.map(a => a.code));
  const combined = [...localResults];
  
  for (const airport of apiResults) {
    if (!seen.has(airport.code)) {
      combined.push(airport);
      seen.add(airport.code);
    }
  }
  
  return combined.slice(0, 10); // Limit total results
}

/**
 * Search using AviationStack API
 */
async function searchAviationStack(query: string): Promise<any[]> {
  const { baseUrl, params } = AIRPORT_API_CONFIG.aviationstack;
  
  // Skip if no API key configured
  if (!AIRPORT_API_CONFIG.aviationstack.apiKey || AIRPORT_API_CONFIG.aviationstack.apiKey === 'your-free-api-key') {
    return [];
  }
  
  const response = await fetch(`${baseUrl}${params(encodeURIComponent(query))}`);
  
  if (!response.ok) {
    throw new Error(`AviationStack API error: ${response.status}`);
  }
  
  const data = await response.json();
  
  return data.data?.map((airport: any) => ({
    code: airport.iata_code || airport.icao_code,
    city: airport.city_iata || airport.timezone?.name?.split('/')[1] || 'Unknown',
    name: airport.airport_name,
    country: airport.country_name
  })).filter((airport: any) => airport.code) || [];
}

/**
 * Search using fallback API (RapidAPI or similar)
 */
async function searchFallbackAPI(query: string): Promise<any[]> {
  try {
    // Using a free airport search API (example)
    const response = await fetch(`https://airport-info-api.p.rapidapi.com/search?location=${encodeURIComponent(query)}`, {
      headers: {
        'X-RapidAPI-Host': 'airport-info-api.p.rapidapi.com',
        'X-RapidAPI-Key': 'demo-key' // Use demo for now, replace with actual key
      }
    });
    
    if (!response.ok) {
      return [];
    }
    
    const data = await response.json();
    
    return data.airports?.map((airport: any) => ({
      code: airport.iata,
      city: airport.city,
      name: airport.name,
      country: airport.country
    })) || [];
  } catch {
    return [];
  }
}

/**
 * Get popular airports for initial display
 * @param region Optional region preference
 */
export function getPopularAirports(region?: string): any[] {
  if (region === 'US') {
    return LOCAL_AIRPORTS.filter(a => a.country === 'United States').slice(0, 6);
  } else if (region === 'INDIA') {
    return LOCAL_AIRPORTS.filter(a => a.country === 'India').slice(0, 6);
  }
  
  return POPULAR_AIRPORTS;
}

/**
 * Get airport details by code (async version for API calls)
 */
export async function getAirportDetailsAsync(code: string) {
  try {
    // Try to search for the specific airport code
    const airports = await searchAirports(code);
    const airport = airports.find(a => a.code?.toUpperCase() === code?.toUpperCase());
    
    if (airport) {
      return airport;
    }
  } catch (error) {
    console.warn('Failed to fetch airport details:', error);
  }
  
  // Fallback to local database
  const fallback = LOCAL_AIRPORTS.find(a => a.code === code?.toUpperCase());
  return fallback || { code, city: code, name: code, country: 'Unknown' };
}

/**
 * Get airport details by code (sync version for immediate UI display)
 */
export function getAirportDetails(code: string) {
  const fallback = LOCAL_AIRPORTS.find(a => a.code === code?.toUpperCase());
  return fallback || { code, city: code, name: code, country: 'Unknown' };
}

/**
 * Get city name for airport code (sync version for UI)
 */
export function getAirportCity(code: string): string {
  const airport = getAirportDetails(code);
  return airport.city;
}

/**
 * Get airport name for airport code (sync version for UI) 
 */
export function getAirportName(code: string): string {
  const airport = getAirportDetails(code);
  return airport.name;
}

/**
 * Get city name for airport code (async version)
 */
export async function getAirportCityAsync(code: string): Promise<string> {
  const airport = await getAirportDetailsAsync(code);
  return airport.city;
}

/**
 * Get airport name for airport code (async version)
 */
export async function getAirportNameAsync(code: string): Promise<string> {
  const airport = await getAirportDetailsAsync(code);
  return airport.name;
}
