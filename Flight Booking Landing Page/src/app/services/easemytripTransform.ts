// EaseMyTrip API Response Transformer
// Handles the actual API response structure from EaseMyTrip via Railway backend

import { convertINRtoUSD } from '../utils/currencyConverter';

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
export async function transformEaseMyTripResponse(
  response: EaseMyTripResponse,
  cabinClass: string,
  passengerCounts?: { adults: number; children: number; infants: number }
): Promise<TransformedFlight[]> {
  if (!response.success || !response.data || !response.data.Journeys) {
    return [];
  }

  console.log('🎫 Transforming flights for passenger counts:', passengerCounts);

  const flights: TransformedFlight[] = [];
  const flightPromises: Promise<TransformedFlight | null>[] = [];

  response.data.Journeys.forEach((journey, journeyIndex) => {
    journey.Segments.forEach((segment, segmentIndex) => {
      segment.Bonds.forEach((bond, bondIndex) => {
        const flightPromise = (async (): Promise<TransformedFlight | null> => {
          // Get the first leg for airline info
          const firstLeg = bond.Legs[0];
          const lastLeg = bond.Legs[bond.Legs.length - 1];
          
          if (!firstLeg) return null;

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

          // Calculate total fare for ALL passengers
          let totalFareINR = 0;
          
          // Debug: Log what the API actually returns
          console.log(`🔍 Flight ${firstLeg.FlightNumber} Fare Debug:`, {
            totalPassengers: passengerCounts ? passengerCounts.adults + passengerCounts.children + passengerCounts.infants : 'unknown',
            paxFaresCount: segment.Fare.PaxFares?.length || 0,
            segmentTotalFare: segment.Fare.TotalFareWithOutMarkUp,
            paxFares: segment.Fare.PaxFares?.map(pf => ({ 
              TotalFare: pf.TotalFare, 
              BasicFare: pf.BasicFare 
            })) || 'none'
          });
          
          if (segment.Fare.PaxFares && segment.Fare.PaxFares.length > 0) {
            // Check if API returns individual passenger fares or just base fare
            const paxFareSum = segment.Fare.PaxFares.reduce((sum, paxFare) => {
              return sum + (paxFare.TotalFare || 0);
            }, 0);
            
            // If PaxFares array length equals total passengers, use sum directly
            const expectedPassengerCount = passengerCounts ? 
              passengerCounts.adults + passengerCounts.children + passengerCounts.infants : 1;
            
            if (segment.Fare.PaxFares.length === expectedPassengerCount) {
              // API returns individual fares for each passenger
              totalFareINR = paxFareSum;
              console.log(`✅ Using individual PaxFares (${segment.Fare.PaxFares.length} fares for ${expectedPassengerCount} passengers): INR ${totalFareINR}`);
            } else {
              // API returns base fare, multiply by passenger count
              const baseFare = segment.Fare.PaxFares[0].TotalFare || 0;
              totalFareINR = baseFare * expectedPassengerCount;
              console.log(`🔄 Multiplying base fare: INR ${baseFare} × ${expectedPassengerCount} passengers = INR ${totalFareINR}`);
            }
          } else {
            // Fallback: use segment total fare and multiply by passengers
            const baseFare = segment.Fare.TotalFareWithOutMarkUp || 0;
            const expectedPassengerCount = passengerCounts ? 
              passengerCounts.adults + passengerCounts.children + passengerCounts.infants : 1;
            totalFareINR = baseFare * expectedPassengerCount;
            console.log(`🔄 Fallback: INR ${baseFare} × ${expectedPassengerCount} passengers = INR ${totalFareINR}`);
          }

          // Convert INR to USD with dynamic exchange rates
          const priceInUSD = await convertINRtoUSD(totalFareINR);
          console.log(`💰 Flight ${firstLeg.FlightNumber}: INR ${totalFareINR.toLocaleString()} → USD ${priceInUSD} (${passengerCounts ? `${passengerCounts.adults + passengerCounts.children + passengerCounts.infants} pax` : 'unknown pax'})`);

          // Get passenger-specific fare info (for baggage, policies, etc.)
          const paxFare = segment.Fare.PaxFares[0];

          // Get available seats
          const availableSeats = parseInt(firstLeg.AvailableSeat || '9') || 9;

          // Baggage info
          const baggageInfo = paxFare
            ? `${paxFare.BaggageWeight} ${paxFare.BaggageUnit}`
            : `${firstLeg.BaggageWeight} ${firstLeg.BaggageUnit}`;

          return {
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
          };
        })();
        
        flightPromises.push(flightPromise);
      });
    });
  });

  // Wait for all flights to be processed
  const processedFlights = await Promise.all(flightPromises);
  
  // Filter out null results
  return processedFlights.filter(flight => flight !== null) as TransformedFlight[];
}

/**
 * Check if response is from demo/mock data
 */
export function isDemoData(response: EaseMyTripResponse): boolean {
  return response.data?.TraceId?.startsWith('DEMO_') || false;
}
