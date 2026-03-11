// Common USA and India Airport Codes for Quick Search

export const US_AIRPORTS = [
  { code: 'JFK', city: 'New York', name: 'John F. Kennedy International' },
  { code: 'EWR', city: 'Newark', name: 'Newark Liberty International' },
  { code: 'LGA', city: 'New York', name: 'LaGuardia' },
  { code: 'ORD', city: 'Chicago', name: "O'Hare International" },
  { code: 'LAX', city: 'Los Angeles', name: 'Los Angeles International' },
  { code: 'SFO', city: 'San Francisco', name: 'San Francisco International' },
  { code: 'IAD', city: 'Washington DC', name: 'Washington Dulles International' },
  { code: 'DFW', city: 'Dallas', name: 'Dallas/Fort Worth International' },
  { code: 'IAH', city: 'Houston', name: 'George Bush Intercontinental' },
  { code: 'ATL', city: 'Atlanta', name: 'Hartsfield-Jackson Atlanta International' },
  { code: 'BOS', city: 'Boston', name: 'Logan International' },
  { code: 'SEA', city: 'Seattle', name: 'Seattle-Tacoma International' },
  { code: 'MIA', city: 'Miami', name: 'Miami International' },
  { code: 'MCO', city: 'Orlando', name: 'Orlando International' },
  { code: 'LAS', city: 'Las Vegas', name: 'Harry Reid International' },
  { code: 'DTW', city: 'Detroit', name: 'Detroit Metropolitan Wayne County' },
  { code: 'PHX', city: 'Phoenix', name: 'Phoenix Sky Harbor International' },
  { code: 'MSP', city: 'Minneapolis', name: 'Minneapolis-St Paul International' },
  { code: 'DEN', city: 'Denver', name: 'Denver International' },
  { code: 'CLT', city: 'Charlotte', name: 'Charlotte Douglas International' },
];

export const INDIA_AIRPORTS = [
  { code: 'DEL', city: 'New Delhi', name: 'Indira Gandhi International' },
  { code: 'BOM', city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj International' },
  { code: 'BLR', city: 'Bangalore', name: 'Kempegowda International' },
  { code: 'MAA', city: 'Chennai', name: 'Chennai International' },
  { code: 'HYD', city: 'Hyderabad', name: 'Rajiv Gandhi International' },
  { code: 'CCU', city: 'Kolkata', name: 'Netaji Subhas Chandra Bose International' },
  { code: 'AMD', city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel International' },
  { code: 'COK', city: 'Kochi', name: 'Cochin International' },
  { code: 'PNQ', city: 'Pune', name: 'Pune Airport' },
  { code: 'GOI', city: 'Goa', name: 'Goa International' },
  { code: 'TRV', city: 'Trivandrum', name: 'Trivandrum International' },
  { code: 'JAI', city: 'Jaipur', name: 'Jaipur International' },
  { code: 'LKO', city: 'Lucknow', name: 'Chaudhary Charan Singh International' },
  { code: 'IXC', city: 'Chandigarh', name: 'Chandigarh International' },
  { code: 'GAU', city: 'Guwahati', name: 'Lokpriya Gopinath Bordoloi International' },
];

export function searchAirports(query: string, region: 'US' | 'INDIA' | 'ALL' = 'ALL') {
  const airports = region === 'US' ? US_AIRPORTS : region === 'INDIA' ? INDIA_AIRPORTS : [...US_AIRPORTS, ...INDIA_AIRPORTS];
  
  if (!query) return airports.slice(0, 5); // Return first 5 if no query
  
  const searchTerm = query.toLowerCase();
  
  return airports.filter(airport => 
    airport.code.toLowerCase().includes(searchTerm) ||
    airport.city.toLowerCase().includes(searchTerm) ||
    airport.name.toLowerCase().includes(searchTerm)
  ).slice(0, 8); // Return top 8 matches
}

// Common worldwide airports including major connecting hubs
const WORLDWIDE_AIRPORTS: Record<string, { city: string; name: string }> = {
  // USA
  JFK: { city: 'New York', name: 'John F. Kennedy Intl' },
  EWR: { city: 'Newark', name: 'Newark Liberty Intl' },
  LGA: { city: 'New York', name: 'LaGuardia' },
  ORD: { city: 'Chicago', name: "O'Hare Intl" },
  LAX: { city: 'Los Angeles', name: 'Los Angeles Intl' },
  SFO: { city: 'San Francisco', name: 'San Francisco Intl' },
  IAD: { city: 'Washington DC', name: 'Washington Dulles Intl' },
  DFW: { city: 'Dallas', name: 'Dallas/Fort Worth Intl' },
  IAH: { city: 'Houston', name: 'George Bush Intercontinental' },
  ATL: { city: 'Atlanta', name: 'Hartsfield-Jackson Atlanta Intl' },
  BOS: { city: 'Boston', name: 'Logan Intl' },
  SEA: { city: 'Seattle', name: 'Seattle-Tacoma Intl' },
  MIA: { city: 'Miami', name: 'Miami Intl' },
  MCO: { city: 'Orlando', name: 'Orlando Intl' },
  LAS: { city: 'Las Vegas', name: 'Harry Reid Intl' },
  DTW: { city: 'Detroit', name: 'Detroit Metropolitan' },
  PHX: { city: 'Phoenix', name: 'Phoenix Sky Harbor Intl' },
  MSP: { city: 'Minneapolis', name: 'Minneapolis-St Paul Intl' },
  DEN: { city: 'Denver', name: 'Denver Intl' },
  CLT: { city: 'Charlotte', name: 'Charlotte Douglas Intl' },
  PHL: { city: 'Philadelphia', name: 'Philadelphia Intl' },
  MDW: { city: 'Chicago', name: 'Chicago Midway Intl' },
  // India
  DEL: { city: 'New Delhi', name: 'Indira Gandhi Intl' },
  BOM: { city: 'Mumbai', name: 'Chhatrapati Shivaji Maharaj Intl' },
  BLR: { city: 'Bangalore', name: 'Kempegowda Intl' },
  MAA: { city: 'Chennai', name: 'Chennai Intl' },
  HYD: { city: 'Hyderabad', name: 'Rajiv Gandhi Intl' },
  CCU: { city: 'Kolkata', name: 'Netaji Subhas Chandra Bose Intl' },
  AMD: { city: 'Ahmedabad', name: 'Sardar Vallabhbhai Patel Intl' },
  COK: { city: 'Kochi', name: 'Cochin Intl' },
  PNQ: { city: 'Pune', name: 'Pune Airport' },
  GOI: { city: 'Goa', name: 'Goa Intl' },
  TRV: { city: 'Trivandrum', name: 'Trivandrum Intl' },
  JAI: { city: 'Jaipur', name: 'Jaipur Intl' },
  LKO: { city: 'Lucknow', name: 'Chaudhary Charan Singh Intl' },
  IXC: { city: 'Chandigarh', name: 'Chandigarh Intl' },
  GAU: { city: 'Guwahati', name: 'Lokpriya Gopinath Bordoloi Intl' },
  // Middle East hubs
  DXB: { city: 'Dubai', name: 'Dubai Intl' },
  AUH: { city: 'Abu Dhabi', name: 'Zayed Intl' },
  DOH: { city: 'Doha', name: 'Hamad Intl' },
  KWI: { city: 'Kuwait City', name: 'Kuwait Intl' },
  BAH: { city: 'Bahrain', name: 'Bahrain Intl' },
  RUH: { city: 'Riyadh', name: 'King Khalid Intl' },
  JED: { city: 'Jeddah', name: 'King Abdulaziz Intl' },
  MCT: { city: 'Muscat', name: 'Muscat Intl' },
  AMM: { city: 'Amman', name: 'Queen Alia Intl' },
  BEY: { city: 'Beirut', name: 'Rafic Hariri Intl' },
  CAI: { city: 'Cairo', name: 'Cairo Intl' },
  // Europe
  LHR: { city: 'London', name: 'Heathrow' },
  LGW: { city: 'London', name: 'Gatwick' },
  CDG: { city: 'Paris', name: 'Charles de Gaulle' },
  FRA: { city: 'Frankfurt', name: 'Frankfurt Intl' },
  AMS: { city: 'Amsterdam', name: 'Amsterdam Schiphol' },
  MUC: { city: 'Munich', name: 'Munich Intl' },
  ZRH: { city: 'Zurich', name: 'Zurich Intl' },
  VIE: { city: 'Vienna', name: 'Vienna Intl' },
  MAD: { city: 'Madrid', name: 'Adolfo Suárez Madrid-Barajas' },
  BCN: { city: 'Barcelona', name: 'El Prat' },
  IST: { city: 'Istanbul', name: 'Istanbul Intl' },
  FCO: { city: 'Rome', name: 'Leonardo da Vinci–Fiumicino' },
  MXP: { city: 'Milan', name: 'Malpensa' },
  BRU: { city: 'Brussels', name: 'Brussels Intl' },
  // Asia Pacific
  SIN: { city: 'Singapore', name: 'Changi' },
  HKG: { city: 'Hong Kong', name: 'Hong Kong Intl' },
  NRT: { city: 'Tokyo', name: 'Narita Intl' },
  HND: { city: 'Tokyo', name: 'Haneda' },
  ICN: { city: 'Seoul', name: 'Incheon Intl' },
  PVG: { city: 'Shanghai', name: 'Pudong Intl' },
  PEK: { city: 'Beijing', name: 'Capital Intl' },
  BKK: { city: 'Bangkok', name: 'Suvarnabhumi' },
  KUL: { city: 'Kuala Lumpur', name: 'Kuala Lumpur Intl' },
  CGK: { city: 'Jakarta', name: 'Soekarno-Hatta Intl' },
  SYD: { city: 'Sydney', name: 'Kingsford Smith' },
  MEL: { city: 'Melbourne', name: 'Melbourne Airport' },
  // Canada
  YYZ: { city: 'Toronto', name: 'Pearson Intl' },
  YVR: { city: 'Vancouver', name: 'Vancouver Intl' },
  YUL: { city: 'Montreal', name: 'Pierre Elliott Trudeau Intl' },
};

/**
 * Get full city name for an airport IATA code
 * Returns "{City} ({CODE})" format, or just the code if not found
 */
export function getAirportCity(code: string): string {
  const airport = WORLDWIDE_AIRPORTS[code?.toUpperCase()];
  if (airport) return airport.city;
  return code;
}

/**
 * Get full airport name for an airport IATA code
 */
export function getAirportName(code: string): string {
  const airport = WORLDWIDE_AIRPORTS[code?.toUpperCase()];
  if (airport) return airport.name;
  return code;
}
