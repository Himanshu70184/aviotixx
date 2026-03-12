// Premium Flight Results Display Component
import { Plane, Clock, MapPin, ArrowRight, Star, Zap, Phone, AlertCircle, CreditCard } from 'lucide-react';
import { FlightResult } from '../services/travelportApi';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { getAirlineLogo } from '../utils/airlineLogos';
import { getAirportCity, getAirportName } from '../data/airports';

interface FlightResultsProps {
  flights: FlightResult[];
  loading?: boolean;
  error?: string;
  onCallNow?: (flight: FlightResult) => void;
  isMockData?: boolean; // Flag to show dev mode indicator
  searchParams?: {
    adults?: number;
    children?: number;
    infants?: number;
    origin?: string;
    destination?: string;
    departDate?: string;
    returnDate?: string;
    tripType?: number;
    cabin?: number;
  };
}

export function FlightResults({ flights, loading, error, onCallNow, isMockData, searchParams }: FlightResultsProps) {
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'recommended'>('recommended');
  const [filterStops, setFilterStops] = useState<'all' | 'nonstop' | 'onestop'>('all');
  const navigate = useNavigate();

  // Handler for opening inquiry page
  const handleBookFlight = (flight: FlightResult) => {
    // Store search params and flight data in sessionStorage
    const searchData = {
      flight,
      adults: searchParams?.adults || 1,
      children: searchParams?.children || 0,
      infants: searchParams?.infants || 0,
      origin: searchParams?.origin || flight.outbound[0]?.departure.airport,
      destination: searchParams?.destination || flight.outbound[flight.outbound.length - 1]?.arrival.airport,
      departDate: searchParams?.departDate,
      returnDate: searchParams?.returnDate,
      tripType: searchParams?.tripType || 0,
      cabin: searchParams?.cabin || 0
    };
    sessionStorage.setItem('inquiryFlightData', JSON.stringify(searchData));
    
    // Navigate with passenger counts in URL for backup
    const params = new URLSearchParams({
      adults: (searchParams?.adults || 1).toString(),
      children: (searchParams?.children || 0).toString(),
      infants: (searchParams?.infants || 0).toString()
    });
    navigate(`/inquiry?${params.toString()}`);
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-md rounded-2xl shadow-2xl p-12 border border-white/40">
        <div className="flex flex-col items-center justify-center space-y-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-[#1E3A8A]/20 border-t-[#1E3A8A] rounded-full animate-spin"></div>
            <Plane className="w-8 h-8 text-[#1E3A8A] absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Searching Best Flights...</h3>
            <p className="text-gray-600">Finding exclusive deals for USA to India routes</p>
          </div>
          <div className="flex gap-2">
            <div className="w-3 h-3 bg-[#1E3A8A] rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-3 h-3 bg-[#0EA5E9] rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-3 h-3 bg-[#FF6B35] rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="bg-gradient-to-br from-red-50/80 to-orange-50/80 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-red-200/50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-2xl">⚠️</span>
          </div>
          <div>
            <h3 className="text-xl font-bold text-red-900 mb-1">Search Error</h3>
            <p className="text-red-700">{error}</p>
            <p className="text-sm text-red-600 mt-2">Please try again or call us for assistance: <span className="font-bold">(555) 123-4567</span></p>
          </div>
        </div>
      </div>
    );
  }

  // No flights found
  if (!flights || flights.length === 0) {
    return (
      <div className="bg-gradient-to-br from-white/40 to-white/20 backdrop-blur-md rounded-2xl shadow-xl p-12 border border-white/40 text-center">
        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <Plane className="w-10 h-10 text-gray-400" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">No Flights Found</h3>
        <p className="text-gray-600 mb-6">Try adjusting your search criteria or dates</p>
        <button className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white px-6 py-3 rounded-lg font-semibold hover:shadow-xl transition-all">
          Modify Search
        </button>
      </div>
    );
  }

  // Filter and sort flights
  let displayFlights = [...flights];
  
  // Apply stop filter
  if (filterStops === 'nonstop') {
    displayFlights = displayFlights.filter(f => f.stops === 0);
  } else if (filterStops === 'onestop') {
    displayFlights = displayFlights.filter(f => f.stops === 1);
  }

  // Apply sorting
  if (sortBy === 'price') {
    displayFlights.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'duration') {
    displayFlights.sort((a, b) => {
      const getDurationMinutes = (duration: string) => {
        const match = duration.match(/(\d+)h\s*(\d+)m/);
        if (match) return parseInt(match[1]) * 60 + parseInt(match[2]);
        return 0;
      };
      return getDurationMinutes(a.totalDuration) - getDurationMinutes(b.totalDuration);
    });
  }

  return (
    <div className="space-y-6">
      {/* Development Mode Indicator */}
      {isMockData && (
        <div className="bg-yellow-50/90 border-2 border-yellow-400 rounded-xl p-4 flex items-start gap-3 shadow-lg">
          <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-bold text-yellow-900 mb-1">🎨 Development Mode - Showing Sample Flights</h4>
            <p className="text-sm text-yellow-800 mb-2">
              The Travelport API cannot be called directly from your browser due to CORS security restrictions. 
              These are realistic sample flights so you can test the UI.
            </p>
            <div className="flex flex-wrap gap-2">
              <a 
                href="/CORS_SOLUTION_GUIDE.md" 
                target="_blank"
                className="text-xs bg-yellow-200 hover:bg-yellow-300 text-yellow-900 px-3 py-1 rounded-md font-semibold transition-colors inline-flex items-center gap-1"
              >
                📖 View Solution Guide
              </a>
              <span className="text-xs text-yellow-700 px-3 py-1">
                ✅ UI is production-ready • ⚙️ Need backend proxy for real data
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Results Header with Filters */}
      <div className="bg-gradient-to-r from-white/40 to-white/20 backdrop-blur-md rounded-xl shadow-lg p-3 border border-white/50">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Results Count - Compact */}
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-[#1E3A8A] to-[#0EA5E9] p-2 rounded-lg">
              <Plane className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-gray-900 leading-none">
                {displayFlights.length} Flight{displayFlights.length !== 1 ? 's' : ''} Available
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">Sort & filter to find your perfect match</p>
            </div>
          </div>

          {/* Sort & Filter Controls - Compact Pills */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sort Label */}
            <span className="text-xs font-semibold text-gray-600 mr-1">Sort:</span>
            
            {/* Sort Options - Compact Pills */}
            <div className="flex gap-1.5">
              <button
                onClick={() => setSortBy('recommended')}
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  sortBy === 'recommended'
                    ? 'bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9] text-white shadow-md'
                    : 'bg-white/60 text-gray-700 hover:bg-white/90'
                }`}
              >
                ⭐ Best
              </button>
              <button
                onClick={() => setSortBy('price')}
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  sortBy === 'price'
                    ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-md'
                    : 'bg-white/60 text-gray-700 hover:bg-white/90'
                }`}
              >
                💰 Cheapest
              </button>
              <button
                onClick={() => setSortBy('duration')}
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  sortBy === 'duration'
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md'
                    : 'bg-white/60 text-gray-700 hover:bg-white/90'
                }`}
              >
                ⚡ Fastest
              </button>
            </div>

            {/* Stop filter removed per client request */}
          </div>
        </div>
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {displayFlights.map((flight, index) => (
          <FlightCard 
            key={`${flight.id}-${index}`} 
            flight={flight} 
            isRecommended={index === 0 && sortBy === 'recommended'} 
            onCallNow={onCallNow}
            index={index}
            onBook={handleBookFlight}
          />
        ))}
      </div>

      {/* Call to Action Banner */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9] rounded-2xl shadow-2xl p-8 text-center border border-white/20">
        <div className="flex items-center justify-center gap-2 mb-4">
          <Zap className="w-8 h-8 text-yellow-300" />
          <h3 className="text-2xl font-bold text-white">Want Even Better Prices?</h3>
          <Zap className="w-8 h-8 text-yellow-300" />
        </div>
        <p className="text-white/90 text-lg mb-6">
          Call us now to unlock exclusive unpublished fares up to <span className="font-bold text-yellow-300">30% cheaper</span>!
        </p>
        <a
          href="tel:+15551234567"
          className="inline-flex items-center gap-3 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:scale-105 transition-all duration-300"
        >
          <Phone className="w-6 h-6" />
          Call (555) 123-4567
          <ArrowRight className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}

// Individual Flight Card Component
function FlightCard({ 
  flight, 
  isRecommended, 
  onCallNow, 
  index, 
  onBook 
}: { 
  flight: FlightResult; 
  isRecommended?: boolean; 
  onCallNow?: (flight: FlightResult) => void;
  index: number;
  onBook?: (flight: FlightResult) => void;
}) {
  const airlineInfo = getAirlineLogo(flight.airline);
  const [showDetails, setShowDetails] = useState(false);

  // outbound legs: full array of segments for the outbound journey
  const outboundLegs = flight.outbound;
  // inbound legs: if any (round-trip)
  const inboundLegs = flight.inbound;

  return (
    <div className="bg-white/40 backdrop-blur-md rounded-2xl shadow-xl border border-white/50 overflow-hidden hover:shadow-2xl hover:scale-[1.01] transition-all duration-300 group">
      {/* Recommended Badge */}
      {isRecommended && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-2 text-sm font-bold flex items-center gap-2 justify-center">
          <Star className="w-4 h-4 fill-current" />
          BEST VALUE - RECOMMENDED
          <Star className="w-4 h-4 fill-current" />
        </div>
      )}

      <div className="p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Section - Flight Details */}
          <div className="flex-1">
            {/* Airline Info Bar */}
            <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-200/50">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm p-1.5 border border-gray-200">
                  <img 
                    src={airlineInfo.logoUrl} 
                    alt={airlineInfo.name}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      e.currentTarget.parentElement!.innerHTML = '<svg class="w-6 h-6 text-[#1E3A8A]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 12h14M12 5l7 7-7 7"></path></svg>';
                    }}
                  />
                </div>
                <div>
                  {/* Always show full airline name via airlineInfo.name */}
                  <h3 className="text-sm font-bold text-gray-900">{airlineInfo.name}</h3>
                  <p className="text-xs text-gray-500">{flight.cabinClass}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full font-medium">
                  <Clock className="w-3 h-3" />
                  {flight.totalDuration}
                </span>
                <span className={`flex items-center gap-1 px-2 py-1 rounded-full font-medium ${
                  flight.stops === 0 
                    ? 'bg-green-50 text-green-700' 
                    : 'bg-orange-50 text-orange-700'
                }`}>
                  <MapPin className="w-3 h-3" />
                  {flight.stops === 0 ? 'Nonstop' : `${flight.stops} Stop${flight.stops > 1 ? 's' : ''}`}
                </span>
              </div>
            </div>

            {/* Flight Routes */}
            <div className="space-y-2">
              {/* Outbound Journey */}
              {outboundLegs && outboundLegs.length > 0 && (
                <FlightRouteLine
                  legs={outboundLegs}
                  direction="out"
                  totalDuration={flight.totalDuration}
                />
              )}

              {/* Inbound Journey (round-trip) */}
              {inboundLegs && inboundLegs.length > 0 && (
                <FlightRouteLine
                  legs={inboundLegs}
                  direction="in"
                  totalDuration={inboundLegs[0]?.duration ?? ''}
                />
              )}
            </div>
          </div>

          {/* Right Section - Price & CTA */}
          <div className="lg:border-l lg:border-gray-300/50 lg:pl-4 flex lg:flex-col flex-row lg:items-center items-end justify-between lg:justify-center gap-3 lg:min-w-[180px]">
            <div className="lg:text-center text-right">
              <p className="text-[10px] text-gray-500 font-semibold uppercase tracking-wide mb-1">Total Price</p>
              <div className="flex items-baseline gap-0.5 lg:justify-center justify-end">
                <span className="text-lg font-bold text-[#1E3A8A]">$</span>
                <p className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-[#1E3A8A] to-[#0EA5E9]">
                  {flight.price.toLocaleString()}
                </p>
              </div>
              <p className="text-[9px] text-gray-400 mt-0.5 font-medium">{flight.currency} • Tax included</p>
            </div>

            <div className="flex lg:flex-col flex-col-reverse gap-2 lg:w-full">
              {/* Dynamic button based on flight priority */}
              {index < 2 ? (
                // Priority flights: Call to Book
                <button
                  onClick={() => onCallNow?.(flight)}
                  className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <Phone className="w-4 h-4" />
                  Call to Book
                </button>
              ) : (
                // Non-priority flights: Book Flight (opens form)
                <button
                  onClick={() => onBook?.(flight)}
                  className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
                >
                  <CreditCard className="w-4 h-4" />
                  Book Flight
                </button>
              )}

              {/* Show Details Button */}
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="bg-white/60 hover:bg-white/90 text-[#1E3A8A] px-3 py-2 rounded-lg font-semibold text-xs border border-[#1E3A8A]/20 hover:border-[#1E3A8A]/40 transition-all duration-300 flex items-center justify-center gap-1 whitespace-nowrap"
              >
                {showDetails ? 'Hide Details' : 'Show Details'}
              </button>

              <div className="bg-green-50 text-green-700 px-2.5 py-1 rounded-md text-[10px] font-semibold text-center border border-green-200">
                🔥 Save Up to $300
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Flight Details */}
      {showDetails && (
        <div className="bg-white/20 backdrop-blur-sm border-t border-white/30 px-4 py-3">
          <h4 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
            <Plane className="w-4 h-4 text-[#1E3A8A]" />
            Flight Details
          </h4>
          
          <div className="space-y-3">
            {/* Outbound Details */}
            {outboundLegs && outboundLegs.length > 0 && (
              <FlightSegmentDetails 
                segments={outboundLegs}
                direction="Outbound"
                directionColor="text-blue-700"
              />
            )}

            {/* Inbound Details (if round-trip) */}
            {inboundLegs && inboundLegs.length > 0 && (
              <FlightSegmentDetails 
                segments={inboundLegs}
                direction="Return"
                directionColor="text-purple-700"
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ---- Flight Route Line with stop dots ----
interface RouteLeg {
  departure: { airport: string; time: string; date: string };
  arrival: { airport: string; time: string; date: string };
  duration: string;
  flightNumber: string;
}

function FlightRouteLine({
  legs,
  direction,
  totalDuration,
}: {
  legs: RouteLeg[];
  direction: 'out' | 'in';
  totalDuration: string;
}) {
  const firstLeg = legs[0];
  const lastLeg = legs[legs.length - 1];

  // Connecting airports are the arrival airports of all legs except the last
  const stops = legs.slice(0, -1).map((leg, i) => ({
    code: leg.arrival.airport,
    city: getAirportCity(leg.arrival.airport),
    airportName: getAirportName(leg.arrival.airport),
    // Layover = next leg depart time - this leg arrive time (we show leg duration label)
    arrivalTime: leg.arrival.time,
    departureTime: legs[i + 1].departure.time,
    legDuration: legs[i + 1].duration,
  }));

  const isOut = direction === 'out';
  const bgClass = isOut
    ? 'bg-gradient-to-r from-blue-50/50 to-transparent border-blue-100/50'
    : 'bg-gradient-to-r from-purple-50/50 to-transparent border-purple-100/50';
  const badgeClass = isOut
    ? 'bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9]'
    : 'bg-gradient-to-r from-purple-600 to-purple-400';
  const lineClass = isOut
    ? 'bg-gradient-to-r from-[#1E3A8A] via-[#0EA5E9] to-[#1E3A8A]'
    : 'bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600';
  const planeClass = isOut ? 'bg-[#0EA5E9]' : 'bg-purple-500';
  const planeRotate = isOut ? 'rotate-90' : '-rotate-90';

  const originCode = firstLeg.departure.airport;
  const destCode = lastLeg.arrival.airport;

  return (
    <div className={`rounded-lg p-2.5 border ${bgClass}`}>
      <div className="flex items-center gap-3">
        {/* Direction badge */}
        <div className={`flex-shrink-0 flex items-center gap-0.5 text-[9px] font-bold text-white ${badgeClass} px-2 py-0.5 rounded-full`}>
          ✈ {isOut ? 'OUT' : 'RET'}
        </div>

        <div className="flex items-center flex-1 gap-2 min-w-0">
          {/* Origin */}
          <div className="flex-shrink-0 min-w-[52px]">
            <p className="text-xl font-bold text-gray-900 leading-none">{firstLeg.departure.time}</p>
            <p className="text-[11px] font-semibold text-gray-800 mt-0.5">{originCode}</p>
            <p className="text-[9px] text-gray-500 leading-tight">{getAirportCity(originCode)}</p>
          </div>

          {/* Route line with stop dots */}
          <div className="flex-1 flex flex-col items-center px-1 min-w-0">
            <div className="w-full relative h-4 flex items-center">
              {/* Base line */}
              <div className={`h-0.5 w-full rounded-full ${lineClass}`} />

              {/* Plane icon in center (only if nonstop) */}
              {stops.length === 0 && (
                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 ${planeClass} rounded-full p-1 z-10`}>
                  <Plane className={`w-2.5 h-2.5 text-white transform ${planeRotate}`} />
                </div>
              )}

              {/* Stop dots */}
              {stops.map((stop, idx) => {
                // Position each dot evenly spaced along the line
                const position = ((idx + 1) / (stops.length + 1)) * 100;
                return (
                  <StopDot
                    key={idx}
                    stop={stop}
                    position={position}
                    dotColor={isOut ? '#0EA5E9' : '#9333ea'}
                  />
                );
              })}
            </div>
            <p className="text-[9px] text-gray-500 mt-0.5 font-medium whitespace-nowrap">
              {totalDuration} • {firstLeg.flightNumber}
            </p>
          </div>

          {/* Destination */}
          <div className="flex-shrink-0 min-w-[52px] text-right">
            <p className="text-xl font-bold text-gray-900 leading-none">{lastLeg.arrival.time}</p>
            <p className="text-[11px] font-semibold text-gray-800 mt-0.5">{destCode}</p>
            <p className="text-[9px] text-gray-500 leading-tight">{getAirportCity(destCode)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// Stop dot with tooltip on hover
function StopDot({
  stop,
  position,
  dotColor,
}: {
  stop: { code: string; city: string; airportName: string; arrivalTime: string; departureTime: string; legDuration: string };
  position: number;
  dotColor: string;
}) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 z-20"
      style={{ left: `${position}%`, transform: `translateX(-50%) translateY(-50%)` }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Dot */}
      <div
        className="w-3 h-3 rounded-full border-2 border-white shadow-md cursor-pointer transition-transform hover:scale-125"
        style={{ backgroundColor: dotColor }}
      />

      {/* Tooltip */}
      {hovered && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-30 pointer-events-none">
          <div className="bg-gray-900 text-white text-[10px] rounded-lg px-3 py-2 shadow-xl whitespace-nowrap min-w-[130px] text-center">
            <p className="font-bold text-xs">{stop.code} · {stop.city}</p>
            <p className="text-gray-300 text-[9px] leading-tight mt-0.5">{stop.airportName}</p>
            <div className="border-t border-gray-700 mt-1.5 pt-1 flex justify-center gap-2">
              <span className="text-gray-400">Arr</span>
              <span className="font-semibold">{stop.arrivalTime}</span>
              <span className="text-gray-600">·</span>
              <span className="text-gray-400">Dep</span>
              <span className="font-semibold">{stop.departureTime}</span>
            </div>
          </div>
          {/* Tooltip arrow */}
          <div className="flex justify-center">
            <div className="w-2 h-2 bg-gray-900 rotate-45 -mt-1" />
          </div>
        </div>
      )}
    </div>
  );
}

// Flight Segment Details Component - Enhanced UI
interface SegmentDetailsProps {
  segments: RouteLeg[];
  direction: string;
  directionColor: string;
}

function FlightSegmentDetails({ segments, direction, directionColor }: SegmentDetailsProps) {
  const isOutbound = direction === 'Outbound';
  
  return (
    <div className="bg-gradient-to-br from-white/80 to-gray-50/80 backdrop-blur-sm border border-gray-100 rounded-xl p-5 shadow-lg">
      {/* Direction Header */}
      <div className="flex items-center justify-between mb-4">
        <h5 className={`text-base font-bold ${directionColor} flex items-center gap-2`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold ${isOutbound ? 'bg-gradient-to-r from-blue-500 to-blue-600' : 'bg-gradient-to-r from-purple-500 to-purple-600'}`}>
            {segments.length}
          </div>
          {direction} Journey
          <span className="text-sm font-normal text-gray-600">
            {segments.length > 1 ? `(${segments.length - 1} stop${segments.length > 2 ? 's' : ''})` : '(Non-stop)'}
          </span>
        </h5>
        
        {/* Total Journey Time */}
        <div className="text-right">
          <div className="text-sm text-gray-500">Total Time</div>
          <div className="text-sm font-bold text-gray-900">
            {/* Calculate total duration from all segments */}
            {segments.reduce((total, seg) => {
              const duration = seg.duration.match(/(\d+)h\s*(\d+)m/);
              if (duration) {
                return total + parseInt(duration[1]) * 60 + parseInt(duration[2]);
              }
              return total;
            }, 0)} min
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        {segments.map((segment, index) => (
          <div key={index} className="relative">
            {/* Main Segment Card */}
            <div className="bg-white/90 backdrop-blur-sm rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="p-4">
                <div className="flex items-center justify-between">
                  {/* Left: Flight Info */}
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${isOutbound ? 'bg-blue-500' : 'bg-purple-500'} text-white rounded-full flex items-center justify-center text-sm font-bold`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-bold text-gray-900 text-sm">{segment.flightNumber}</p>
                      <p className="text-xs text-gray-600">{segment.duration}</p>
                    </div>
                  </div>

                  {/* Center: Route with enhanced styling */}
                  <div className="flex-1 mx-6">
                    <div className="flex items-center justify-between">
                      {/* Departure */}
                      <div className="text-center flex-shrink-0">
                        <div className="text-lg font-bold text-gray-900">{segment.departure.time}</div>
                        <div className="text-sm font-bold text-[#1E3A8A]">{segment.departure.airport}</div>
                        <div className="text-xs text-gray-600 max-w-[80px] truncate">
                          {getAirportCity(segment.departure.airport)}
                        </div>
                      </div>
                      
                      {/* Flight Path */}
                      <div className="flex-1 flex flex-col items-center px-4">
                        <div className="w-full relative flex items-center">
                          <div className={`h-0.5 w-full ${isOutbound ? 'bg-gradient-to-r from-blue-400 to-blue-600' : 'bg-gradient-to-r from-purple-400 to-purple-600'} rounded-full`}></div>
                          <div className={`absolute left-1/2 -translate-x-1/2 w-6 h-6 ${isOutbound ? 'bg-blue-500' : 'bg-purple-500'} rounded-full flex items-center justify-center shadow-lg`}>
                            <Plane className="w-3 h-3 text-white transform rotate-90" />
                          </div>
                        </div>
                        <div className="text-xs text-gray-500 mt-1 font-medium">
                          {segment.duration}
                        </div>
                      </div>
                      
                      {/* Arrival */}
                      <div className="text-center flex-shrink-0">
                        <div className="text-lg font-bold text-gray-900">{segment.arrival.time}</div>
                        <div className="text-sm font-bold text-[#1E3A8A]">{segment.arrival.airport}</div>
                        <div className="text-xs text-gray-600 max-w-[80px] truncate">
                          {getAirportCity(segment.arrival.airport)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Additional Info */}
                  <div className="text-right text-xs text-gray-500 flex-shrink-0">
                    <div className="space-y-1">
                      <div className="bg-gray-100 px-2 py-1 rounded text-gray-700 font-medium">
                        Economy
                      </div>
                      <div>Aircraft: A320</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Layover Indicator - Enhanced */}
            {index < segments.length - 1 && (
              <div className="flex items-center justify-center my-3 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dashed border-gray-300"></div>
                </div>
                <div className="relative bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 rounded-xl px-4 py-2 shadow-sm">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-orange-600" />
                    <div className="text-center">
                      <div className="text-xs font-bold text-orange-800">
                        Layover in {getAirportCity(segments[index].arrival.airport)}
                      </div>
                      <div className="text-xs text-orange-600">
                        {/* Calculate layover time - simplified for now */}
                        Connection time varies
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
      {/* Journey Summary */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-xs text-gray-600">
          <div>
            <span className="font-medium">Operated by:</span> {segments[0]?.flightNumber?.substring(0, 2) || 'Airline'}
          </div>
          <div>
            <span className="font-medium">Total Distance:</span> ~8,500 miles
          </div>
        </div>
      </div>
    </div>
  );
}