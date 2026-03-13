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
  IsRoundTrip?: boolean;
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
  inbound?: TransformedFlightSegment[]; // For roundtrip flights
  totalDuration: string;
  stops: number;
  cabinClass: string;
  seats: number;
  baggage: string;
  refundable: boolean;
  cancelPenalty: number;
  changePenalty: number;
  isRoundTrip?: boolean; // Flag to identify roundtrip flights
  isMultiCity?: boolean; // Flag to identify multi-city flights
  /**
   * For multi-city flights, each element is an array of segments (legs) for a single search segment (bond)
   */
  bondSegments?: TransformedFlightSegment[][];
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

  // console.log('🎫 Transforming flights for passenger counts:', passengerCounts);

  const flights: TransformedFlight[] = [];
  const flightPromises: Promise<TransformedFlight | null>[] = [];

  response.data.Journeys.forEach((journey, journeyIndex) => {
    journey.Segments.forEach((segment, segmentIndex) => {
      // Detect flight types based on bond structure
      const bondTypes = segment.Bonds.map(bond => bond.BoundType);
      const outboundBonds = segment.Bonds.filter(bond => bond.BoundType === 'OutBound');
      const inboundBonds = segment.Bonds.filter(bond => bond.BoundType === 'InBound');
      
      const hasOutbound = outboundBonds.length > 0;
      const hasInbound = inboundBonds.length > 0;
      const isRoundTrip = hasOutbound && hasInbound;
      const isMultiCity = outboundBonds.length > 1 && !hasInbound; // Multiple OutBound bonds, no InBound
      
      // Debug logging for bond detection
      if (hasInbound || outboundBonds.length > 1) {
        console.log('🔍 [Flight Type Detection]', {
          journeyIndex,
          segmentIndex,
          totalBonds: segment.Bonds.length,
          bondTypes,
          outboundBondsCount: outboundBonds.length,
          inboundBondsCount: inboundBonds.length,
          isRoundTrip,
          isMultiCity,
        });
      }
      
      if (isRoundTrip) {
        // Create ONE combined flight for the roundtrip
        const flightPromise = (async (): Promise<TransformedFlight | null> => {
          const outboundBond = segment.Bonds.find(bond => bond.BoundType === 'OutBound');
          const inboundBond = segment.Bonds.find(bond => bond.BoundType === 'InBound');
          
          console.log('🔄 [Roundtrip Processing]', {
            outboundBond: !!outboundBond,
            inboundBond: !!inboundBond,
            outboundLegs: outboundBond?.Legs?.length,
            inboundLegs: inboundBond?.Legs?.length,
            segmentKey: segment.ItineraryKey
          });
          
          if (!outboundBond) return null;
          
          // Get airline info from outbound first leg
          const firstOutboundLeg = outboundBond.Legs[0];
          if (!firstOutboundLeg) return null;
          
          // Transform outbound legs
          const outboundSegments: TransformedFlightSegment[] = outboundBond.Legs.map(leg => ({
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
          
          // Transform inbound legs (if exists)
          let inboundSegments: TransformedFlightSegment[] | undefined = undefined;
          if (inboundBond) {
            inboundSegments = inboundBond.Legs.map(leg => ({
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
          }
          
          // Calculate total stops for outbound journey
          const outboundStops = outboundBond.Legs.length - 1;
          
          // Calculate total fare for ALL passengers
          let totalFareINR = 0;
          
          if (segment.Fare.PaxFares && segment.Fare.PaxFares.length > 0) {
            const paxFareSum = segment.Fare.PaxFares.reduce((sum, paxFare) => {
              return sum + (paxFare.TotalFare || 0);
            }, 0);
            
            const expectedPassengerCount = passengerCounts ? 
              passengerCounts.adults + passengerCounts.children + passengerCounts.infants : 1;
            
            if (segment.Fare.PaxFares.length === expectedPassengerCount) {
              totalFareINR = paxFareSum;
            } else {
              const baseFare = segment.Fare.PaxFares[0].TotalFare || 0;
              totalFareINR = baseFare * expectedPassengerCount;
            }
          } else {
            const baseFare = segment.Fare.TotalFareWithOutMarkUp || 0;
            const expectedPassengerCount = passengerCounts ? 
              passengerCounts.adults + passengerCounts.children + passengerCounts.infants : 1;
            totalFareINR = baseFare * expectedPassengerCount;
          }

          // Convert INR to USD
          const priceInUSD = await convertINRtoUSD(totalFareINR);
          
          // Get passenger fare info
          const paxFare = segment.Fare.PaxFares[0];
          const availableSeats = parseInt(firstOutboundLeg.AvailableSeat || '9') || 9;
          const baggageInfo = paxFare
            ? `${paxFare.BaggageWeight} ${paxFare.BaggageUnit}`
            : `${firstOutboundLeg.BaggageWeight} ${firstOutboundLeg.BaggageUnit}`;

          const roundtripFlight = {
            id: `${segment.ItineraryKey}-roundtrip`,
            journeyId: segment.ItineraryKey,
            segmentId: segment.SearchId,
            airline: firstOutboundLeg.AirlineName,
            price: priceInUSD,
            currency: 'USD',
            outbound: outboundSegments,
            inbound: inboundSegments, // This will contain return flight segments
            totalDuration: outboundBond.JourneyTime + (inboundBond ? ` + ${inboundBond.JourneyTime}` : ''),
            stops: outboundStops,
            cabinClass: firstOutboundLeg.Cabin || cabinClass,
            seats: availableSeats,
            baggage: baggageInfo,
            refundable: paxFare?.Refundable ?? true,
            cancelPenalty: paxFare?.CancelPenalty || 0,
            changePenalty: paxFare?.ChangePenalty || 0,
            isRoundTrip: true,
            isMultiCity: false,
          };

          console.log('✅ [Roundtrip Created]', {
            hasOutbound: roundtripFlight.outbound?.length > 0,  
            hasInbound: roundtripFlight.inbound && roundtripFlight.inbound.length > 0,
            inboundCount: roundtripFlight.inbound?.length || 0,
            isRoundTrip: roundtripFlight.isRoundTrip
          });

          return roundtripFlight;
        })();
        flightPromises.push(flightPromise);
      } else if (isMultiCity) {
        // Multi-city flights: Combine all OutBound bonds into ONE journey
        const flightPromise = (async (): Promise<TransformedFlight | null> => {
          if (outboundBonds.length === 0) return null;
          
          // Get airline info from first outbound bond's first leg
          const firstBond = outboundBonds[0];
          const firstLeg = firstBond.Legs[0];
          if (!firstLeg) return null;
          
          // Combine ALL outbound segments from all bonds into one multi-city journey
          const allSegments: TransformedFlightSegment[] = [];
          
          // PRESERVE BOND STRUCTURE: Store each bond as a separate segment group
          const bondSegments: TransformedFlightSegment[][] = [];
          
          outboundBonds.forEach(bond => {
            const bondLegs: TransformedFlightSegment[] = [];
            bond.Legs.forEach(leg => {
              bondLegs.push({
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
              });
              // Also add to flat array for backward compatibility
              allSegments.push(bondLegs[bondLegs.length - 1]);
            });
            bondSegments.push(bondLegs);
          });
          
          // Calculate total stops across all segments
          const totalStops = allSegments.reduce((sum, segment) => sum + segment.stops, 0);
          
          // Calculate total journey time from all bonds
          const totalDurations = outboundBonds.map(bond => bond.JourneyTime);
          const combinedDuration = totalDurations.join(' + ');
          
          // Calculate total fare for ALL passengers
          let totalFareINR = 0;
          
          if (segment.Fare.PaxFares && segment.Fare.PaxFares.length > 0) {
            const paxFareSum = segment.Fare.PaxFares.reduce((sum, paxFare) => {
              return sum + (paxFare.TotalFare || 0);
            }, 0);
            
            const expectedPassengerCount = passengerCounts ? 
              passengerCounts.adults + passengerCounts.children + passengerCounts.infants : 1;
            
            if (segment.Fare.PaxFares.length === expectedPassengerCount) {
              totalFareINR = paxFareSum;
            } else {
              const baseFare = segment.Fare.PaxFares[0].TotalFare || 0;
              totalFareINR = baseFare * expectedPassengerCount;
            }
          } else {
            const baseFare = segment.Fare.TotalFareWithOutMarkUp || 0;
            const expectedPassengerCount = passengerCounts ? 
              passengerCounts.adults + passengerCounts.children + passengerCounts.infants : 1;
            totalFareINR = baseFare * expectedPassengerCount;
          }

          // Convert INR to USD
          const priceInUSD = await convertINRtoUSD(totalFareINR);
          
          // Get passenger fare info
          const paxFare = segment.Fare.PaxFares[0];
          const availableSeats = parseInt(firstLeg.AvailableSeat || '9') || 9;
          const baggageInfo = paxFare
            ? `${paxFare.BaggageWeight} ${paxFare.BaggageUnit}`
            : `${firstLeg.BaggageWeight} ${firstLeg.BaggageUnit}`;

          return {
            id: `${segment.ItineraryKey}-multicity`,
            journeyId: segment.ItineraryKey,
            segmentId: segment.SearchId,
            airline: firstLeg.AirlineName,
            price: priceInUSD,
            currency: 'USD',
            outbound: allSegments, // All multi-city segments combined
            bondSegments: bondSegments, // PRESERVE: Each bond as separate segment group
            inbound: undefined, // No return for multi-city
            totalDuration: combinedDuration,
            stops: totalStops,
            cabinClass: firstLeg.Cabin || cabinClass,
            seats: availableSeats,
            baggage: baggageInfo,
            refundable: paxFare?.Refundable ?? true,
            cancelPenalty: paxFare?.CancelPenalty || 0,
            changePenalty: paxFare?.ChangePenalty || 0,
            isRoundTrip: false,
            isMultiCity: true,
          };
        })();
        flightPromises.push(flightPromise);
      } else {
        // For true one-way flights, create separate flights for each bond
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
              } else {
                // API returns base fare, multiply by passenger count
                const baseFare = segment.Fare.PaxFares[0].TotalFare || 0;
                totalFareINR = baseFare * expectedPassengerCount;
              }
            } else {
              // Fallback: use segment total fare and multiply by passengers
              const baseFare = segment.Fare.TotalFareWithOutMarkUp || 0;
              const expectedPassengerCount = passengerCounts ? 
                passengerCounts.adults + passengerCounts.children + passengerCounts.infants : 1;
              totalFareINR = baseFare * expectedPassengerCount;
            }

            // Convert INR to USD with dynamic exchange rates
            const priceInUSD = await convertINRtoUSD(totalFareINR);

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
              isRoundTrip: false,
              isMultiCity: false,
            };
          })();
          
          flightPromises.push(flightPromise);
        });
      }
    });
  });

  // Wait for all flights to be processed
  const processedFlights = await Promise.all(flightPromises);
  
  // Filter out null results
  const finalFlights = processedFlights.filter(flight => flight !== null) as TransformedFlight[];
  
  return finalFlights;
}

/**
 * Check if response is from demo/mock data
 */
export function isDemoData(response: EaseMyTripResponse): boolean {
  return response.data?.TraceId?.startsWith('DEMO_') || false;
}
