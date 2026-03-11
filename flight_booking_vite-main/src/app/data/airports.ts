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
