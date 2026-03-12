// Search Results Page - Dedicated page for showing flight search results
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router';
import { Phone, ArrowLeft, Plane } from 'lucide-react';
import { FlightResults } from '../components/FlightResults';
import { FlightSearchLoader } from '../components/FlightSearchLoader';
import { FlightFilters, FilterState } from '../components/FlightFilters';
import { PromotionalSidebar } from '../components/PromotionalSidebar';
import { ApiHealthCheck } from '../components/ApiHealthCheck';
import { searchFlights, FlightResult, FlightSearchParams } from '../services/travelportApi';
// import logo from '../../imports/AVIOTIX_LOGO_1.svg?url';
import logo from '../../imports/AVIOTIX_LOGO_tranparent.svg?url';

export function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchResults, setSearchResults] = useState<FlightResult[]>([]);
  const [isSearching, setIsSearching] = useState(true);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [isMockData, setIsMockData] = useState(false);

  // Extract search parameters from URL
  const from = searchParams.get('from') || '';
  const to = searchParams.get('to') || '';
  const departDate = searchParams.get('departDate') || '';
  const returnDate = searchParams.get('returnDate') || '';
  const adults = searchParams.get('adults') || '1';
  const children = searchParams.get('children') || '0';
  const infants = searchParams.get('infants') || '0';
  const tripType = (searchParams.get('tripType') as 'roundtrip' | 'oneway') || 'roundtrip';
  const classType = searchParams.get('class') || 'economy';

  // Filter state
  const [filters, setFilters] = useState<FilterState>({
    stops: [],
    airlines: [],
    priceRange: { min: 0, max: 10000 },
    departureTime: [],
    duration: { min: 0, max: 48 },
    cabinClass: [],
  });

  useEffect(() => {
    // Perform search when component mounts
    performSearch();
  }, []);

  const performSearch = async () => {
    if (!from || !to || !departDate) {
      setSearchError('Missing required search parameters');
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    const searchParams: FlightSearchParams = {
      from,
      to,
      departDate,
      returnDate,
      adults,
      children,
      infants,
      tripType,
      class: classType,
    };

    try {
      const response = await searchFlights(searchParams);
      
      if (response.success) {
        setSearchResults(response.flights);
        setSearchError(null);
        setIsMockData(response.isMockData || false);
        
        // Initialize price range filter based on actual flights
        const prices = response.flights.map(f => f.price);
        const minPrice = Math.min(...prices, 0);
        const maxPrice = Math.max(...prices, 10000);
        setFilters(prev => ({
          ...prev,
          priceRange: { min: minPrice, max: maxPrice },
        }));
      } else {
        setSearchError(response.error || 'Failed to search flights');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('An unexpected error occurred. Please try again.');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleCallNow = (flight: FlightResult) => {
    const phoneNumber = '+15551234567';
    window.open(`tel:${phoneNumber}`);
  };

  // Create detailed passenger display for loading screen
  const getPassengerDisplayText = () => {
    const parts = [];
    const adultCount = parseInt(adults);
    const childCount = parseInt(children);
    const infantCount = parseInt(infants);
    
    if (adultCount > 0) {
      parts.push(`${adultCount} Adult${adultCount > 1 ? 's' : ''}`);
    }
    
    if (childCount > 0) {
      parts.push(`${childCount} Child${childCount > 1 ? 'ren' : ''}`);
    }
    
    if (infantCount > 0) {
      parts.push(`${infantCount} Infant${infantCount > 1 ? 's' : ''}`);
    }
    
    return parts.join(' + ');
  };

  // Apply filters whenever they change
  const filteredFlights = searchResults.filter((flight) => {
    // Filter by stops
    if (filters.stops.length > 0) {
      const stopFilter = filters.stops.some(stop => {
        if (stop === 'nonstop') return flight.stops === 0;
        if (stop === '1stop') return flight.stops === 1;
        if (stop === '2+stops') return flight.stops >= 2;
        return false;
      });
      if (!stopFilter) return false;
    }

    // Filter by airlines
    if (filters.airlines.length > 0 && !filters.airlines.includes(flight.airline)) {
      return false;
    }

    // Filter by price range
    if (flight.price < filters.priceRange.min || flight.price > filters.priceRange.max) {
      return false;
    }

    // Filter by cabin class
    if (filters.cabinClass.length > 0 && !filters.cabinClass.includes(flight.cabinClass)) {
      return false;
    }

    // Filter by departure time
    if (filters.departureTime.length > 0 && flight.outbound[0]) {
      const departTime = flight.outbound[0].departure.time;
      const hour = parseInt(departTime.split(':')[0]);
      const timeFilter = filters.departureTime.some(time => {
        if (time === 'morning') return hour >= 6 && hour < 12;
        if (time === 'afternoon') return hour >= 12 && hour < 18;
        if (time === 'evening') return hour >= 18 && hour < 24;
        if (time === 'night') return hour >= 0 && hour < 6;
        return false;
      });
      if (!timeFilter) return false;
    }

    return true;
  });



  const handleBackToSearch = () => {
    navigate('/');
  };

  const handleResetFilters = () => {
    const prices = searchResults.map(f => f.price);
    const minPrice = Math.min(...prices, 0);
    const maxPrice = Math.max(...prices, 10000);
    
    setFilters({
      stops: [],
      airlines: [],
      priceRange: { min: minPrice, max: maxPrice },
      departureTime: [],
      duration: { min: 0, max: 48 },
      cabinClass: [],
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30">
      {/* Header */}
      <header className="bg-white/95 backdrop-blur-xl shadow-sm border-b border-gray-200/80 sticky top-0 z-50">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center gap-3 logo-container" style={{ maxWidth: 180 }}>
              <img src={logo} alt="Aviotixx" className="h-10" style={{ maxWidth: 180, width: '100%', objectFit: 'contain' }} />
            </div>

            {/* Phone CTA */}
            <button
              onClick={() => window.location.href = 'tel:+15551234567'}
              className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white px-5 py-2.5 rounded-full font-semibold text-sm hover:shadow-lg transition-all duration-300 flex items-center gap-2"
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">Call:</span> (555) 123-4567
            </button>
          </div>
        </div>
      </header>

      {/* Demo Mode Banner - Only shown when using mock data */}
      {isMockData && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-500 border-b border-amber-600">
          <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <div className="flex items-center justify-center gap-3 text-white">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                <span className="font-semibold text-sm">🎭 DEMO MODE</span>
              </div>
              <span className="text-white/80 text-sm">
                • Showing sample data • Real API will work when deployed to production
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Search Summary Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            {/* Search Details */}
            <div className="flex items-center gap-4 flex-wrap">
              <button
                onClick={handleBackToSearch}
                className="text-[#1E3A8A] hover:text-[#0EA5E9] font-medium text-sm flex items-center gap-2 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Modify Search
              </button>
              
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              
              <div className="flex items-center gap-2 text-sm">
                <Plane className="w-4 h-4 text-[#1E3A8A]" />
                <span className="font-bold text-gray-900">{from}</span>
                <span className="text-gray-400">→</span>
                <span className="font-bold text-gray-900">{to}</span>
              </div>
              
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              
              <div className="text-sm text-gray-600">
                <span className="font-medium">{new Date(departDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                {tripType === 'roundtrip' && returnDate && (
                  <span> - {new Date(returnDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                )}
              </div>
              
              <div className="h-6 w-px bg-gray-300 hidden sm:block"></div>
              
              <div className="text-sm text-gray-600">
                {parseInt(adults) + parseInt(children) + parseInt(infants)} {parseInt(adults) + parseInt(children) + parseInt(infants) === 1 ? 'Traveler' : 'Travelers'}
              </div>
            </div>

            {/* Results Count */}
            <div className="flex items-center gap-2">
              {!isSearching && (
                <span className="text-sm text-gray-600">
                  <span className="font-bold text-[#1E3A8A]">{filteredFlights.length}</span> of {searchResults.length} flights
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Results Section with Filters */}
      <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isSearching ? (
          <FlightSearchLoader 
            from={from}
            to={to}
            departDate={departDate}
            passengers={getPassengerDisplayText()}
            tripType={tripType}
          />
        ) : (
          <div className="flex gap-6">
            {/* Left Sidebar - Filters */}
            <div className="w-72 flex-shrink-0 hidden lg:block">
              <FlightFilters
                flights={searchResults}
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
              />
            </div>

            {/* Middle - Flight Results */}
            <div className="flex-1 min-w-0">
              {/* Debug Error Display */}
              {searchError && (
                <div className="space-y-4 mb-6">
                  {/* Health Check Component */}
                  <ApiHealthCheck />
                  
                  {/* Error Details */}
                  <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                        <span className="text-red-600 text-xl">⚠️</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-red-900 mb-2">Search Error</h3>
                        <p className="text-sm text-red-800 mb-3 font-mono bg-red-100 p-3 rounded border border-red-200">
                          {searchError}
                        </p>
                        <p className="text-sm text-red-700 mb-3">
                          This error information will help diagnose the issue. Please check your browser console (F12) for detailed debugging logs.
                        </p>
                        <div className="flex gap-3">
                          <button
                            onClick={handleBackToSearch}
                            className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition-colors text-sm"
                          >
                            Try Different Search
                          </button>
                          <button
                            onClick={() => window.location.href = 'tel:+15551234567'}
                            className="bg-[#FF6B35] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#e55a28] transition-colors text-sm flex items-center gap-2"
                          >
                            <Phone className="w-4 h-4" />
                            Call for Help
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              <FlightResults 
                flights={filteredFlights}
                loading={false}
                error={searchError || undefined}
                onCallNow={handleCallNow}
                isMockData={isMockData}
                searchParams={{
                  adults: parseInt(adults),
                  children: parseInt(children),
                  infants: parseInt(infants),
                  origin: from,
                  destination: to,
                  departDate,
                  returnDate,
                  tripType: tripType === 'roundtrip' ? 1 : 0,
                  cabin: classType === 'business' ? 2 : classType === 'first' ? 1 : 0
                }}
              />
            </div>

            {/* Right Sidebar - Promotional */}
            <div className="w-80 flex-shrink-0 hidden xl:block">
              <PromotionalSidebar />
            </div>
          </div>
        )}
      </div>

      {/* Footer CTA */}
      <div className="border-t border-gray-200 bg-white mt-12">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <p className="text-sm text-gray-600">
                Need help booking? Our agents are available 24/7
              </p>
            </div>
            <button
              onClick={() => window.location.href = 'tel:+15551234567'}
              className="bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white px-6 py-3 rounded-lg font-bold hover:shadow-xl transition-all duration-300 flex items-center gap-2"
            >
              <Phone className="w-5 h-5" />
              Call (555) 123-4567 Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}