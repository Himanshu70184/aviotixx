// Premium Flight Results Display Component
import { Plane, Clock, MapPin, DollarSign, ArrowRight, Star, Zap, Phone, AlertCircle } from 'lucide-react';
import { FlightResult } from '../services/travelportApi';
import { useState } from 'react';
import { getAirlineLogo } from '../utils/airlineLogos';

interface FlightResultsProps {
  flights: FlightResult[];
  loading?: boolean;
  error?: string;
  onCallNow?: (flight: FlightResult) => void;
  isMockData?: boolean; // Flag to show dev mode indicator
}

export function FlightResults({ flights, loading, error, onCallNow, isMockData }: FlightResultsProps) {
  const [sortBy, setSortBy] = useState<'price' | 'duration' | 'recommended'>('recommended');
  const [filterStops, setFilterStops] = useState<'all' | 'nonstop' | 'onestop'>('all');

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

            {/* Divider */}
            <div className="h-6 w-px bg-gray-300 mx-1"></div>

            {/* Filter Label */}
            <span className="text-xs font-semibold text-gray-600 mr-1">Stops:</span>

            {/* Filter by Stops - Compact Pills */}
            <div className="flex gap-1.5">
              <button
                onClick={() => setFilterStops('all')}
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filterStops === 'all'
                    ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-md'
                    : 'bg-white/60 text-gray-700 hover:bg-white/90'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilterStops('nonstop')}
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filterStops === 'nonstop'
                    ? 'bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md'
                    : 'bg-white/60 text-gray-700 hover:bg-white/90'
                }`}
              >
                Direct
              </button>
              <button
                onClick={() => setFilterStops('onestop')}
                className={`px-2.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  filterStops === 'onestop'
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md'
                    : 'bg-white/60 text-gray-700 hover:bg-white/90'
                }`}
              >
                1 Stop
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Flight Cards */}
      <div className="space-y-4">
        {displayFlights.map((flight, index) => (
          <FlightCard key={flight.id} flight={flight} isRecommended={index === 0 && sortBy === 'recommended'} onCallNow={onCallNow} />
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
function FlightCard({ flight, isRecommended, onCallNow }: { flight: FlightResult; isRecommended?: boolean; onCallNow?: (flight: FlightResult) => void }) {
  const outbound = flight.outbound[0]; // First segment
  const inbound = flight.inbound?.[0];
  const airlineInfo = getAirlineLogo(flight.airline);

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
            {/* Airline Info Bar - Compact Header */}
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
                  <h3 className="text-sm font-bold text-gray-900">{flight.airline}</h3>
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

            {/* Flight Routes - Compact Single Row Design */}
            <div className="space-y-2">
              {/* Outbound Flight */}
              {outbound && (
                <div className="bg-gradient-to-r from-blue-50/50 to-transparent rounded-lg p-2.5 border border-blue-100/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 text-[9px] font-bold text-white bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9] px-2 py-0.5 rounded-full">
                      ✈ OUT
                    </div>
                    <div className="flex items-center flex-1 gap-2">
                      <div className="flex-shrink-0">
                        <p className="text-xl font-bold text-gray-900">{outbound.departure.time}</p>
                        <p className="text-[10px] text-gray-600 font-medium">{outbound.departure.airport}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center px-2">
                        <div className="w-full relative">
                          <div className="h-0.5 w-full bg-gradient-to-r from-[#1E3A8A] via-[#0EA5E9] to-[#1E3A8A] rounded-full"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-[#0EA5E9] rounded-full p-1">
                            <Plane className="w-2.5 h-2.5 text-white transform rotate-90" />
                          </div>
                        </div>
                        <p className="text-[9px] text-gray-500 mt-0.5 font-medium">{outbound.duration} • {outbound.flightNumber}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <p className="text-xl font-bold text-gray-900">{outbound.arrival.time}</p>
                        <p className="text-[10px] text-gray-600 font-medium">{outbound.arrival.airport}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Inbound Flight */}
              {inbound && (
                <div className="bg-gradient-to-r from-purple-50/50 to-transparent rounded-lg p-2.5 border border-purple-100/50">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-0.5 text-[9px] font-bold text-white bg-gradient-to-r from-purple-600 to-purple-400 px-2 py-0.5 rounded-full">
                      ✈ RET
                    </div>
                    <div className="flex items-center flex-1 gap-2">
                      <div className="flex-shrink-0">
                        <p className="text-xl font-bold text-gray-900">{inbound.departure.time}</p>
                        <p className="text-[10px] text-gray-600 font-medium">{inbound.departure.airport}</p>
                      </div>
                      <div className="flex-1 flex flex-col items-center px-2">
                        <div className="w-full relative">
                          <div className="h-0.5 w-full bg-gradient-to-r from-purple-600 via-purple-400 to-purple-600 rounded-full"></div>
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-purple-500 rounded-full p-1">
                            <Plane className="w-2.5 h-2.5 text-white transform -rotate-90" />
                          </div>
                        </div>
                        <p className="text-[9px] text-gray-500 mt-0.5 font-medium">{inbound.duration} • {inbound.flightNumber}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <p className="text-xl font-bold text-gray-900">{inbound.arrival.time}</p>
                        <p className="text-[10px] text-gray-600 font-medium">{inbound.arrival.airport}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Section - Price & CTA - Compact Vertical Design */}
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
              <button
                onClick={() => onCallNow?.(flight)}
                className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:shadow-xl hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 whitespace-nowrap"
              >
                <Phone className="w-4 h-4" />
                Call to Book
              </button>

              <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-2.5 py-1 rounded-md text-[10px] font-bold text-center shadow-sm">
                🔥 Save Up to $300
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}