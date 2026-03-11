// Flight Search API Integration Service - Production Backend
// Uses Aviotixx backend which proxies to EaseMyTrip API

import {
  searchFlights as backendSearchFlights,
  getTripTypeCode,
  getCabinClassCode,
  formatDateForAPI,
  formatDuration,
  formatTime,
  formatDate,
  type FlightSearchRequest,
  type JourneyResponse,
  type FlightSegmentResponse,
} from './backendApi';

import {
  transformEaseMyTripResponse,
  isDemoData as checkIfDemoData,
  type EaseMyTripResponse,
} from './easemytripTransform';

// ==================== LEGACY INTERFACE (For backward compatibility) ====================

export interface FlightSearchParams {
  from: string;
  to: string;
  departDate: string;
  returnDate?: string;
  adults: string;
  children: string;
  infants: string;
  tripType: 'roundtrip' | 'oneway' | 'multicity';
  class: string;
  segments?: MultiCitySegment[]; // For multi-city trips
}

export interface MultiCitySegment {
  from: string;
  to: string;
  departDate: string;
}

export interface FlightSegment {
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    date: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
  };
  duration: string;
  stops: number;
}

export interface FlightResult {
  id: string;
  journeyId: string;
  segmentId: string;
  airline: string;
  price: number;
  currency: string;
  outbound: FlightSegment[];
  inbound?: FlightSegment[];
  totalDuration: string;
  stops: number;
  cabinClass: string;
  seats: number;
  aircraftType?: string;
}

export interface FlightSearchResponse {
  success: boolean;
  flights: FlightResult[];
  totalResults: number;
  searchId?: string;
  traceId?: string;
  error?: string;
  isMockData?: boolean;
}

// ==================== MAIN SEARCH FUNCTION ====================

/**
 * Search for flights using the production backend API
 * Supports one-way, round-trip, and multi-city searches
 */
export async function searchFlights(params: FlightSearchParams): Promise<FlightSearchResponse> {
  // Add delay to show loading animation (5-8 seconds)
  const minDelay = 5000; // 5 seconds
  const maxDelay = 8000; // 8 seconds
  const randomDelay = Math.floor(Math.random() * (maxDelay - minDelay + 1)) + minDelay;
  const startTime = Date.now();

  try {
    // Build search request for backend API
    const searchRequest: FlightSearchRequest = {
      tripType: getTripTypeCode(params.tripType),
      adults: parseInt(params.adults) || 1,
      children: parseInt(params.children) || 0,
      infants: parseInt(params.infants) || 0,
      cabin: getCabinClassCode(params.class),
      searchDetails: buildSearchDetails(params),
    };

    console.log('🔍 Searching flights...', {
      tripType: params.tripType,
      from: params.from,
      to: params.to,
      passengers: `${params.adults}A ${params.children}C ${params.infants}I`,
      segments: searchRequest.searchDetails.length,
    });

    // Call backend API
    const apiResponse = await backendSearchFlights(searchRequest);

    // Handle API errors
    if (!apiResponse.success || !apiResponse.data) {
      throw new Error(apiResponse.error || 'No flights found for the selected criteria');
    }

    // Check for API errors in response
    if (apiResponse.data.Errors && apiResponse.data.Errors.length > 0) {
      const errorMessages = apiResponse.data.Errors.map((e: any) => e.Message || e.message || String(e)).join(', ');
      throw new Error(errorMessages || 'Flight search returned errors');
    }

    // Transform API response using the proper EaseMyTrip transformer
    const emtResponse = apiResponse as unknown as EaseMyTripResponse;
    const flights = transformEaseMyTripResponse(emtResponse, params.class);

    // Ensure minimum delay for loading animation
    const elapsed = Date.now() - startTime;
    if (elapsed < randomDelay) {
      await new Promise(resolve => setTimeout(resolve, randomDelay - elapsed));
    }

    // Check if this is mock/demo data
    const isDemoData = checkIfDemoData(emtResponse);
    
    const response: FlightSearchResponse = {
      success: true,
      flights,
      totalResults: flights.length,
      searchId: apiResponse.data.TraceId,
      traceId: apiResponse.data.TraceId,
      isMockData: isDemoData,
    };

    if (isDemoData) {
      console.log(`✅ Found ${flights.length} DEMO flights (showing realistic sample data)`);
      console.log(`📊 Displaying results on Search Results page...`);
    } else {
      console.log(`✅ Found ${flights.length} REAL flights from EaseMyTrip API`);
    }
    
    return response;

  } catch (error) {
    console.error('❌ Flight search error:', error);

    // Ensure minimum delay for loading animation even on error
    const elapsed = Date.now() - startTime;
    if (elapsed < randomDelay) {
      await new Promise(resolve => setTimeout(resolve, randomDelay - elapsed));
    }

    return {
      success: false,
      flights: [],
      totalResults: 0,
      error: error instanceof Error ? error.message : 'Unable to search flights. Please try again or call us for assistance.',
    };
  }
}

// ==================== HELPER FUNCTIONS ====================

/**
 * Build search details array based on trip type
 */
function buildSearchDetails(params: FlightSearchParams) {
  // Multi-city: use segments array
  if (params.tripType === 'multicity' && params.segments && params.segments.length > 0) {
    return params.segments.map(segment => ({
      origin: segment.from.toUpperCase(),
      destination: segment.to.toUpperCase(),
      departDate: formatDateForAPI(segment.departDate),
    }));
  }

  // One-way: single segment
  if (params.tripType === 'oneway') {
    return [
      {
        origin: params.from.toUpperCase(),
        destination: params.to.toUpperCase(),
        departDate: formatDateForAPI(params.departDate),
      },
    ];
  }

  // Round-trip: two segments
  return [
    {
      origin: params.from.toUpperCase(),
      destination: params.to.toUpperCase(),
      departDate: formatDateForAPI(params.departDate),
    },
    {
      origin: params.to.toUpperCase(),
      destination: params.from.toUpperCase(),
      departDate: formatDateForAPI(params.returnDate || params.departDate),
    },
  ];
}

/**
 * Transform backend API journeys to our flight result format
 */
function transformJourneysToFlights(journeys: JourneyResponse[], cabinClass: string): FlightResult[] {
  if (!Array.isArray(journeys) || journeys.length === 0) {
    return [];
  }

  return journeys.map(journey => {
    const segments = journey.Segments || [];
    const firstSegment = segments[0];
    const lastSegment = segments[segments.length - 1];

    // Transform segments to our format
    const flightSegments: FlightSegment[] = segments.map(seg => ({
      airline: seg.AirlineName || seg.Airline,
      flightNumber: seg.FlightNumber,
      departure: {
        airport: seg.Origin,
        time: formatTime(seg.DepartureTime),
        date: formatDate(seg.DepartureTime),
      },
      arrival: {
        airport: seg.Destination,
        time: formatTime(seg.ArrivalTime),
        date: formatDate(seg.ArrivalTime),
      },
      duration: formatDuration(seg.Duration),
      stops: seg.StopsCount,
    }));

    // Calculate total price (sum of all segment prices)
    const totalPrice = segments.reduce((sum, seg) => sum + (seg.Price || 0), 0);

    // Calculate total duration
    const totalDuration = segments.reduce((sum, seg) => sum + (seg.Duration || 0), 0);

    // Count total stops
    const totalStops = Math.max(0, segments.length - 1);

    // Get available seats (minimum across all segments)
    const availableSeats = Math.min(...segments.map(seg => seg.Seats || 0));

    return {
      id: `${journey.JourneyId}-${journey.SegmentId}`,
      journeyId: journey.JourneyId,
      segmentId: journey.SegmentId,
      airline: firstSegment?.AirlineName || firstSegment?.Airline || 'Unknown Airline',
      price: totalPrice,
      currency: 'USD', // Backend returns prices in USD for USA-India routes
      outbound: flightSegments,
      inbound: undefined, // Multi-segment handling - backend returns separate journeys
      totalDuration: formatDuration(totalDuration),
      stops: totalStops,
      cabinClass: getCabinClassName(cabinClass),
      seats: availableSeats,
      aircraftType: firstSegment?.AircraftType,
    };
  });
}

/**
 * Get cabin class name from code
 */
function getCabinClassName(classCode: string): string {
  const classMap: Record<string, string> = {
    'economy': 'Economy',
    'first': 'First Class',
    'business': 'Business',
    'premium_economy': 'Premium Economy',
    'premiumeconomy': 'Premium Economy',
  };
  return classMap[classCode.toLowerCase()] || 'Economy';
}

// ==================== MOCK DATA (Fallback - Not used in production) ====================

/**
 * Get mock/demo flights for testing (NOT USED - kept for reference only)
 * In production, always use real API data or show error
 */
export function getMockFlights(params: FlightSearchParams): FlightSearchResponse {
  console.warn('⚠️ Using mock data - this should not happen in production!');
  
  // Generate realistic prices based on route
  const basePrice = 850;
  const priceVariation = Math.floor(Math.random() * 300);
  
  const airlines = [
    { name: 'Air India', code: 'AI', priceMultiplier: 1.0 },
    { name: 'United Airlines', code: 'UA', priceMultiplier: 1.15 },
    { name: 'Emirates', code: 'EK', priceMultiplier: 1.25 },
    { name: 'Qatar Airways', code: 'QR', priceMultiplier: 1.20 },
    { name: 'Lufthansa', code: 'LH', priceMultiplier: 1.18 },
    { name: 'British Airways', code: 'BA', priceMultiplier: 1.22 },
  ];

  const mockFlights: FlightResult[] = airlines.slice(0, 6).map((airline, index) => {
    const price = Math.round((basePrice + priceVariation + index * 50) * airline.priceMultiplier);
    const departTime = ['10:30', '14:20', '22:00', '08:15', '16:45', '19:30'][index];
    const arrivalTime = ['14:45', '20:35', '05:15', '13:20', '23:10', '02:45'][index];
    const stops = index < 2 ? 0 : index < 4 ? 1 : 2;
    const duration = stops === 0 ? '14h 15m' : stops === 1 ? '16h 30m' : '19h 45m';

    return {
      id: `mock-${index + 1}`,
      journeyId: `J${index + 1}`,
      segmentId: `S${index + 1}`,
      airline: airline.name,
      price: price,
      currency: 'USD',
      outbound: [{
        airline: airline.name,
        flightNumber: `${airline.code} ${100 + index * 10}`,
        departure: { airport: params.from, time: departTime, date: params.departDate },
        arrival: { airport: params.to, time: arrivalTime, date: params.departDate },
        duration: duration,
        stops: stops,
      }],
      inbound: params.tripType === 'roundtrip' ? [{
        airline: airline.name,
        flightNumber: `${airline.code} ${200 + index * 10}`,
        departure: { airport: params.to, time: departTime, date: params.returnDate || '' },
        arrival: { airport: params.from, time: arrivalTime, date: params.returnDate || '' },
        duration: duration,
        stops: stops,
      }] : undefined,
      totalDuration: duration,
      stops: stops,
      cabinClass: params.class === 'business' ? 'Business' : params.class === 'first' ? 'First' : 'Economy',
      seats: Math.floor(Math.random() * 50) + 10,
    };
  });

  // Sort by price
  mockFlights.sort((a, b) => a.price - b.price);

  return {
    success: true,
    flights: mockFlights,
    totalResults: mockFlights.length,
    searchId: 'mock-search-' + Date.now(),
    isMockData: true,
  };
}