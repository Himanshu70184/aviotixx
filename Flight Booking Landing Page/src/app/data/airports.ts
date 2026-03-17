// Airport Search - Backend API Integration
import { API_CONFIG } from '../config/api';

// Fetch airports from backend API
export async function searchAirports(query: string, region?: string, excludeCode?: string): Promise<any[]> {
  if (!query || query.length < 1) return [];
  
  try {
    const url = `${API_CONFIG.baseUrl}/airports?search=${encodeURIComponent(query)}`;
    const res = await fetch(url, API_CONFIG.requestOptions);
    
    if (!res.ok) {
      throw new Error(`API Error: ${res.status}`);
    }
    
    const data = await res.json();
    
    // Map backend data to expected format
    let results = data.map((a: any) => ({
      code: a.iata_code || '',
      city: a.municipality || '',
      name: a.name || '',
      country: a.iso_country || '',
    }));
    
    // Filter out excluded airport
    if (excludeCode) {
      results = results.filter((airport: any) => airport.code !== excludeCode.toUpperCase());
    }
    
    return results;
  } catch (e) {
    console.warn('Airport API search failed:', e);
    return [];
  }
}

// Dummy for compatibility (not used)
export function getAirportDetails(code: string): any {
  return { code: code || 'Unknown', city: code || 'Unknown', name: code || 'Unknown', country: 'Unknown' };
}

// Dummy for compatibility (not used)
export function getPopularAirports(): any[] {
  return [];
}

// Get city name for airport code (sync version for UI)
export function getAirportCity(code: string): string {
  return code || 'Unknown';
}

// Get airport name for airport code (sync version for UI) 
export function getAirportName(code: string): string {
  return code || 'Unknown Airport';
}
