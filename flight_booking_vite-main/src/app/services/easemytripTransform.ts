// EaseMyTrip API Response Transformer
// Handles the actual API response structure from EaseMyTrip via Railway backend

// ==================== REAL API TYPES (from EaseMyTrip) ====================

export interface EaseMyTripLeg {
  AirlineName: string;
  FlightNumber: string;
  DepartureTime: string; // "HH:MM" format
  ArrivalTime: string; // "HH:MM" format
  DepartureDate: string; // "Day-DDMonYYYY" format like "Sun-15Mar2026"
  ArrivalDate: string;
  Origin: string;
  Destination: string;
  Duration: string; // "HHh MMm" format like "02h 05m"
  AircraftType: string;
  NumberOfStops: string;
  BaggageWeight: string;
  BaggageUnit: string;
  Cabin: string;
  CarrierCode: string;
  DepartureTerminal?: string;
  ArrivalTerminal?: string;
  OperatedBy?: string | null;
  AvailableSeat?: string | null;
}

export interface EaseMyTripBond {
  BoundType: string;
  IsBaggageFare: boolean;
  IsSSR: boolean;
  ItineraryKey: string;
  JourneyTime: string; // Total journey time "HHh MMm"
  Legs: EaseMyTripLeg[];
}

export interface EaseMyTripPaxFare {
  BasicFare: number;
  TotalFare: number;
  TotalTax: number;
  BaggageWeight: string;
  BaggageUnit: string;
  Refundable: boolean;
  CancelPenalty: number;
  ChangePenalty: number;
}

export interface EaseMyTripFare {
  BasicFare: number;
  TotalFareWithOutMarkUp: number;
  TotalTaxWithOutMarkUp: number;
  PaxFares: EaseMyTripPaxFare[];
}

export interface EaseMyTripSegment {
  Bonds: EaseMyTripBond[];
  Fare: EaseMyTripFare;
  ItineraryKey: string;
  SearchId: string;
  EngineID: number;
  FareRule?: string;
}

export interface EaseMyTripJourney {
  Destination: string | null;
  JourneyDetail: string | null;
  Origin: string | null;
  Segments: EaseMyTripSegment[];
}

export interface EaseMyTripResponse {
  success: boolean;
  data: {
    Errors: any[] | null;
    Journeys: EaseMyTripJourney[];
    Insurance: any | null;
    TraceId?: string;
  };
}

// ==================== OUR INTERNAL TYPES ====================

export interface TransformedFlightSegment {
  airline: string;
  flightNumber: string;
  departure: {
    airport: string;
    time: string;
    date: string;
    terminal?: string;
  };
  arrival: {
    airport: string;
    time: string;
    date: string;
    terminal?: string;
  };
  duration: string;
  stops: number;
  aircraftType?: string;
  operatedBy?: string;
}

export interface TransformedFlight {
  id: string;
  journeyId: string;
  segmentId: string;
  airline: string;
  price: number;
  currency: string;
  outbound: TransformedFlightSegment[];
  totalDuration: string;
  stops: number;
  cabinClass: string;
  seats: number;
  baggage: string;
  refundable: boolean;
  cancelPenalty: number;
  changePenalty: number;
}

// ==================== TRANSFORMATION FUNCTIONS ====================

/**
 * Convert EaseMyTrip date format "Sun-15Mar2026" to readable "Mar 15, 2026"
 */
function formatEMTDate(dateStr: string): string {
  try {
    // "Sun-15Mar2026" -> "Mar 15, 2026"
    const parts = dateStr.split('-');
    if (parts.length === 2) {
      const dayMonth = parts[1]; // "15Mar2026"
      const day = dayMonth.substring(0, 2); // "15"
      const month = dayMonth.substring(2, 5); // "Mar"
      const year = dayMonth.substring(5); // "2026"
      return `${month} ${day}, ${year}`;
    }
    return dateStr;
  } catch {
    return dateStr;
  }
}

/**
 * Parse duration string "02h 05m" to minutes
 */
function parseDuration(durationStr: string): number {
  try {
    const hours = durationStr.match(/(\d+)h/);
    const minutes = durationStr.match(/(\d+)m/);
    const h = hours ? parseInt(hours[1]) : 0;
    const m = minutes ? parseInt(minutes[1]) : 0;
    return h * 60 + m;
  } catch {
    return 0;
  }
}

/**
 * Transform EaseMyTrip response to our internal format
 */
export function transformEaseMyTripResponse(
  response: EaseMyTripResponse,
  cabinClass: string
): TransformedFlight[] {
  if (!response.success || !response.data || !response.data.Journeys) {
    return [];
  }

  const flights: TransformedFlight[] = [];

  response.data.Journeys.forEach((journey, journeyIndex) => {
    journey.Segments.forEach((segment, segmentIndex) => {
      segment.Bonds.forEach((bond, bondIndex) => {
        // Get the first leg for airline info
        const firstLeg = bond.Legs[0];
        const lastLeg = bond.Legs[bond.Legs.length - 1];
        
        if (!firstLeg) return;

        // Transform legs to our segment format
        const transformedSegments: TransformedFlightSegment[] = bond.Legs.map(leg => ({
          airline: leg.AirlineName,
          flightNumber: leg.FlightNumber.trim(),
          departure: {
            airport: leg.Origin,
            time: leg.DepartureTime,
            date: formatEMTDate(leg.DepartureDate),
            terminal: leg.DepartureTerminal,
          },
          arrival: {
            airport: leg.Destination,
            time: leg.ArrivalTime,
            date: formatEMTDate(leg.ArrivalDate),
            terminal: leg.ArrivalTerminal,
          },
          duration: leg.Duration,
          stops: parseInt(leg.NumberOfStops) || 0,
          aircraftType: leg.AircraftType,
          operatedBy: leg.OperatedBy || undefined,
        }));

        // Calculate total stops (connecting flights)
        const totalStops = bond.Legs.length - 1;

        // Get fare information
        const paxFare = segment.Fare.PaxFares[0];
        const totalFare = paxFare?.TotalFare || segment.Fare.TotalFareWithOutMarkUp || 0;

        // Convert INR to USD (approximate rate: 1 USD = 83 INR)
        const priceInUSD = Math.round(totalFare / 83);

        // Get available seats
        const availableSeats = parseInt(firstLeg.AvailableSeat || '9') || 9;

        // Baggage info
        const baggageInfo = paxFare
          ? `${paxFare.BaggageWeight} ${paxFare.BaggageUnit}`
          : `${firstLeg.BaggageWeight} ${firstLeg.BaggageUnit}`;

        flights.push({
          id: `${segment.ItineraryKey}-${bondIndex}`,
          journeyId: segment.ItineraryKey,
          segmentId: segment.SearchId,
          airline: firstLeg.AirlineName,
          price: priceInUSD,
          currency: 'USD',
          outbound: transformedSegments,
          totalDuration: bond.JourneyTime,
          stops: totalStops,
          cabinClass: firstLeg.Cabin || cabinClass,
          seats: availableSeats,
          baggage: baggageInfo,
          refundable: paxFare?.Refundable ?? true,
          cancelPenalty: paxFare?.CancelPenalty || 0,
          changePenalty: paxFare?.ChangePenalty || 0,
        });
      });
    });
  });

  return flights;
}

/**
 * Check if response is from demo/mock data
 */
export function isDemoData(response: EaseMyTripResponse): boolean {
  return response.data?.TraceId?.startsWith('DEMO_') || false;
}
