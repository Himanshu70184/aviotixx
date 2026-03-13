// Premium Flight Search Form - Compact Creative Design

import { Search, MapPin, Calendar, Users, ArrowRight, Plane, ArrowLeftRight, Info, Plus, X } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { AirportAutocomplete } from './AirportAutocomplete';

interface FlightSearchFormProps {
  onSearch?: (data: any) => void;
  compact?: boolean;
}

interface MultiCitySegment {
  from: string;
  to: string;
  departDate: string;
}

export function FlightSearchForm({ onSearch, compact = false }: FlightSearchFormProps) {
  const navigate = useNavigate();
  const [tripType, setTripType] = useState<'roundtrip' | 'oneway' | 'multicity'>('roundtrip');
  const [formData, setFormData] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    adults: 1,
    children: 0,
    infants: 0,
    class: 'economy'
  });

  // Multi-city segments
  const [multiCitySegments, setMultiCitySegments] = useState<MultiCitySegment[]>([
    { from: '', to: '', departDate: '' },
    { from: '', to: '', departDate: '' }
  ]);

  const [showPassengerDropdown, setShowPassengerDropdown] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Get today's date in YYYY-MM-DD format for min date restriction
  const today = new Date().toISOString().split('T')[0];

  // Calculate total passengers for display
  const totalPassengers = formData.adults + formData.children + formData.infants;

  // Simple passenger count display for button
  const getPassengerDisplayText = () => {
    const totalPax = formData.adults + formData.children + formData.infants;
    return `${totalPax} Traveler${totalPax > 1 ? 's' : ''}`;
  };

  // Add new multi-city segment
  const addSegment = () => {
    if (multiCitySegments.length < 6) {
      setMultiCitySegments([...multiCitySegments, { from: '', to: '', departDate: '' }]);
    }
  };

  // Remove multi-city segment
  const removeSegment = (index: number) => {
    if (multiCitySegments.length > 2) {
      setMultiCitySegments(multiCitySegments.filter((_, i) => i !== index));
    }
  };

  // Update multi-city segment
  const updateSegment = (index: number, field: keyof MultiCitySegment, value: string) => {
    const updated = [...multiCitySegments];
    updated[index] = { ...updated[index], [field]: value };
    setMultiCitySegments(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation for multi-city
    if (tripType === 'multicity') {
      // Filter out empty segments first
      const validSegments = multiCitySegments.filter(segment => 
        segment.from && segment.to && segment.departDate
      );
      
      // Require at least 2 segments for multicity
      if (validSegments.length < 2) {
        setValidationError('Multi-city trips require at least 2 flight segments. Please add more segments.');
        return;
      }
      
      // Update multiCitySegments to only include valid segments for submission
      setMultiCitySegments(validSegments);
    } else {
      // Validation for one-way and round-trip
      if (!formData.from || !formData.to || !formData.departDate) {
        setValidationError('Please fill in all required fields');
        return;
      }

      if (tripType === 'roundtrip' && !formData.returnDate) {
        setValidationError('Please select a return date for round trip');
        return;
      }
    }

    if (formData.adults === 0) {
      setValidationError('At least 1 adult is required');
      return;
    }

    if (formData.infants > formData.adults) {
      setValidationError('Number of infants cannot exceed number of adults');
      return;
    }

    setValidationError(null);

    // For multicity, get the valid segments
    const activeSegments = tripType === 'multicity' 
      ? multiCitySegments.filter(segment => segment.from && segment.to && segment.departDate)
      : multiCitySegments;

    // Debug logging for multicity
    if (tripType === 'multicity') {
      console.log('🔍 Multicity Debug Info:');
      console.log('Total segments in form:', multiCitySegments.length);
      console.log('All segments:', multiCitySegments);
      console.log('Valid/completed segments:', activeSegments.length);
      console.log('Active segments being submitted:', activeSegments);
    }

    // Build API payload based on trip type
    let flightSearchDetails;
    
    if (tripType === 'multicity') {
      // Multi-city: map all valid segments
      flightSearchDetails = activeSegments.map(segment => ({
        BeginDate: segment.departDate,
        CurrencyCode: "INR",
        Origin: segment.from,
        Destination: segment.to
      }));
    } else if (tripType === 'oneway') {
      // One-way: single segment
      flightSearchDetails = [{
        BeginDate: formData.departDate,
        CurrencyCode: "INR",
        Origin: formData.from,
        Destination: formData.to
      }];
    } else {
      // Round-trip: outbound and return
      flightSearchDetails = [
        {
          BeginDate: formData.departDate,
          CurrencyCode: "INR",
          Origin: formData.from,
          Destination: formData.to
        },
        {
          BeginDate: formData.returnDate,
          CurrencyCode: "INR",
          Origin: formData.to,
          Destination: formData.from
        }
      ];
    }

    // Build API payload in the exact format required
    const apiPayload = {
      Adults: formData.adults,
      Authentication: {
        UserName: "",
        Password: "",
        PortalID: 26
      },
      Cabin: formData.class === 'economy' ? 0 : formData.class === 'business' ? 1 : 2,
      Childs: formData.children,
      Infants: formData.infants,
      TripType: tripType === 'oneway' ? 0 : tripType === 'roundtrip' ? 1 : 2, // 2 for multi-city
      FlightSearchDetails: flightSearchDetails
    };

    // Navigate to search results page with parameters
    const searchParams = new URLSearchParams({
      from: tripType === 'multicity' ? activeSegments[0].from : formData.from,
      to: tripType === 'multicity' ? activeSegments[activeSegments.length - 1].to : formData.to,
      departDate: tripType === 'multicity' ? activeSegments[0].departDate : formData.departDate,
      returnDate: formData.returnDate || '',
      adults: formData.adults.toString(),
      children: formData.children.toString(),
      infants: formData.infants.toString(),
      tripType: tripType,
      class: formData.class,
    });

    // Add segments for multicity
    if (tripType === 'multicity') {
      searchParams.set('segments', JSON.stringify(activeSegments));
    }

    navigate(`/search-results?${searchParams.toString()}`);

    // Call parent callback if provided with API payload
    if (onSearch) {
      onSearch(apiPayload);
    }

    // Log API payload for debugging
    console.log('Flight Search API Payload:', JSON.stringify(apiPayload, null, 2));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white/30 backdrop-blur-md rounded-2xl shadow-2xl p-5 border border-white/40">
        {/* Compact Header with Trip Type & Flight Class Dropdowns */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* Trip Type Dropdown - Compact */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-800 whitespace-nowrap">Trip Type:</label>
            <div className="relative">
              <select
                value={tripType}
                onChange={(e) => setTripType(e.target.value as 'roundtrip' | 'oneway' | 'multicity')}
                className="pl-3 pr-8 py-2 text-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-gray-900 transition-all bg-white/80 backdrop-blur-sm cursor-pointer appearance-none font-medium"
              >
                <option value="roundtrip">Round Trip</option>
                <option value="oneway">One Way</option>
                <option value="multicity">Multi-City</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Travelers Dropdown - Compact */}
          <div className="flex items-center gap-2 relative">
            <label className="text-sm font-semibold text-gray-800 whitespace-nowrap">Travelers:</label>
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPassengerDropdown(!showPassengerDropdown)}
                className="pl-3 pr-8 py-2 text-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-gray-900 transition-all bg-white/80 backdrop-blur-sm cursor-pointer font-medium whitespace-nowrap"
              >
                {getPassengerDisplayText()}
              </button>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              {/* Passenger Dropdown */}
              {showPassengerDropdown && (
                <div className="absolute top-full left-0 mt-1 bg-white rounded-lg shadow-xl border border-gray-200 p-3 z-50 min-w-[280px]">
                  {/* Adults */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Adults</div>
                      <div className="text-xs text-gray-500">12+ years</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Adult -</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, adults: Math.max(1, formData.adults - 1) })}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-gray-900 font-semibold">{formData.adults}</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, adults: Math.min(9, formData.adults + 1) })}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Children */}
                  <div className="flex items-center justify-between mb-3 pb-3 border-b">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Children</div>
                      <div className="text-xs text-gray-500">2-11 years</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Child -</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, children: Math.max(0, formData.children - 1) })}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-gray-900 font-semibold">{formData.children}</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, children: Math.min(9, formData.children + 1) })}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Infants */}
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="text-sm font-semibold text-gray-900">Infants</div>
                      <div className="text-xs text-gray-500">Under 2 years</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Infant -</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, infants: Math.max(0, formData.infants - 1) })}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-gray-900 font-semibold">{formData.infants}</span>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, infants: Math.min(formData.adults, formData.infants + 1) })}
                        className="w-7 h-7 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-700 font-semibold"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Info about infant limit */}
                  {formData.infants > formData.adults && (
                    <div className="text-xs text-orange-600 mt-2 bg-orange-50 p-2 rounded">
                      ⚠️ Number of infants cannot exceed adults (1 infant per adult max)
                    </div>
                  )}

                  {/* Done button */}
                  <button
                    type="button"
                    onClick={() => setShowPassengerDropdown(false)}
                    className="w-full mt-3 bg-[#1E3A8A] text-white py-2 rounded-lg text-sm font-semibold hover:bg-[#162e6b] transition-colors"
                  >
                    Done
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Flight Class Dropdown - Compact */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold text-gray-800 whitespace-nowrap">Class:</label>
            <div className="relative">
              <select
                value={formData.class}
                onChange={(e) => setFormData({ ...formData, class: e.target.value })}
                className="pl-3 pr-8 py-2 text-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-gray-900 transition-all bg-white/80 backdrop-blur-sm cursor-pointer appearance-none font-medium"
              >
                <option value="economy">Economy</option>
                <option value="premium_economy">Premium Economy</option>
                <option value="business">Business</option>
                <option value="first">First</option>
              </select>
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* USA to India Badge */}
          <div className="text-xs text-white/80 bg-[#1E3A8A]/30 px-3 py-2 rounded-full backdrop-blur-sm whitespace-nowrap ml-auto">
            ✈️ USA → India Specialist
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Multi-City Layout */}
          {tripType === 'multicity' ? (
            <div className="space-y-3 mb-3">
              {/* Multi-City Segments */}
              {multiCitySegments.map((segment, index) => (
                <div key={index} className="grid grid-cols-1 lg:grid-cols-12 gap-3">
                  {/* Flight Number Label */}
                  <div className="lg:col-span-1 flex items-end pb-2.5">
                    <span className="text-sm font-bold text-[#1E3A8A]">Flight {index + 1}</span>
                  </div>

                  {/* From & To */}
                  <div className="lg:col-span-6 grid grid-cols-2 gap-2">
                    <AirportAutocomplete
                      value={segment.from}
                      onChange={(value) => updateSegment(index, 'from', value)}
                      placeholder="Origin"
                      icon="mappin"
                      region="ALL"
                      label="From"
                    />
                    <AirportAutocomplete
                      value={segment.to}
                      onChange={(value) => updateSegment(index, 'to', value)}
                      placeholder="Destination"
                      icon="plane"
                      region="ALL"
                      label="To"
                    />
                  </div>

                  {/* Date */}
                  <div className="lg:col-span-4 relative">
                    <label className="block text-xs font-medium text-gray-800 mb-1 ml-1">Departure Date</label>
                    <Calendar className="absolute left-2.5 top-[34px] w-4 h-4 text-gray-500 pointer-events-none z-10" />
                    <input
                      type="date"
                      value={segment.departDate}
                      onChange={(e) => updateSegment(index, 'departDate', e.target.value)}
                      min={today}
                      className="w-full pl-8 pr-2 py-2.5 text-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-gray-900 transition-all relative z-20 bg-white/80 backdrop-blur-sm cursor-pointer"
                      style={{ colorScheme: 'light' }}
                    />
                  </div>

                  {/* Remove Button */}
                  <div className="lg:col-span-1 flex items-end">
                    <button
                      type="button"
                      onClick={() => removeSegment(index)}
                      disabled={multiCitySegments.length <= 2}
                      className={`w-full py-2.5 rounded-lg transition-all flex items-center justify-center ${
                        multiCitySegments.length <= 2
                          ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                          : 'bg-red-50 text-red-600 hover:bg-red-100'
                      }`}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Segment & Search Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={addSegment}
                  disabled={multiCitySegments.length >= 6}
                  className={`flex-1 py-2.5 rounded-lg transition-all flex items-center justify-center gap-2 font-semibold ${
                    multiCitySegments.length >= 6
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : 'bg-[#1E3A8A] text-white hover:bg-[#162e6b]'
                  }`}
                >
                  <Plus className="w-4 h-4" />
                  Add Segment
                </button>

                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white py-2.5 rounded-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold group"
                >
                  <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  Search Flights
                </button>
              </div>
            </div>
          ) : (
            /* Regular Round Trip / One Way Layout */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 mb-3">
              {/* From & To - Side by Side */}
              <div className="lg:col-span-5 grid grid-cols-2 gap-2">
                {/* From - with Autocomplete */}
                <AirportAutocomplete
                  value={formData.from}
                  onChange={(value) => setFormData({ ...formData, from: value })}
                  placeholder="JFK"
                  icon="mappin"
                  region="ALL"
                  label="From"
                />

                {/* To - with Autocomplete */}
                <AirportAutocomplete
                  value={formData.to}
                  onChange={(value) => setFormData({ ...formData, to: value })}
                  placeholder="DEL"
                  icon="plane"
                  region="ALL"
                  label="To"
                />
              </div>

              {/* Dates - Compact in Single Row */}
              <div className={`${tripType === 'roundtrip' ? 'lg:col-span-4' : 'lg:col-span-3'} grid ${tripType === 'roundtrip' ? 'grid-cols-2' : 'grid-cols-1'} gap-2`}>
                {/* Depart Date */}
                <div className="relative">
                  <label className="block text-xs font-medium text-gray-800 mb-1 ml-1">Depart</label>
                  <Calendar className="absolute left-2.5 top-[34px] w-4 h-4 text-gray-500 pointer-events-none z-10" />
                  <input
                    type="date"
                    value={formData.departDate}
                    onChange={(e) => setFormData({ ...formData, departDate: e.target.value })}
                    min={today}
                    className="w-full pl-8 pr-2 py-2.5 text-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-gray-900 transition-all relative z-20 bg-white/80 backdrop-blur-sm cursor-pointer"
                    style={{
                      colorScheme: 'light'
                    }}
                  />
                </div>

                {/* Return Date - Only for Round Trip */}
                {tripType === 'roundtrip' && (
                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-800 mb-1 ml-1">Return</label>
                    <Calendar className="absolute left-2.5 top-[34px] w-4 h-4 text-gray-500 pointer-events-none z-10" />
                    <input
                      type="date"
                      value={formData.returnDate}
                      onChange={(e) => setFormData({ ...formData, returnDate: e.target.value })}
                      min={formData.departDate || today}
                      className="w-full pl-8 pr-2 py-2.5 text-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-gray-900 transition-all relative z-20 bg-white/80 backdrop-blur-sm cursor-pointer"
                      style={{
                        colorScheme: 'light'
                      }}
                    />
                  </div>
                )}
              </div>

              {/* Search Button - Inline */}
              <div className="lg:col-span-3 lg:col-span-3 flex items-end">
                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-[#FF6B35] to-[#F7931E] text-white py-2.5 rounded-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2 font-semibold group"
                >
                  <Search className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  <span className="hidden xl:inline">Search</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform xl:hidden" />
                </button>
              </div>
            </div>
          )}

          {/* Multi-City Help Notice */}
          {tripType === 'multicity' && (
            <div className="mb-3 bg-gradient-to-r from-orange-50 to-yellow-50 border border-orange-200/50 rounded-lg px-3 py-2 flex items-start gap-2">
              <Info className="w-4 h-4 text-orange-600 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-orange-900">
                <strong>Need Help?</strong> Call our multi-city specialists at <strong className="text-[#FF6B35]">(555) 123-4567</strong> for personalized assistance and exclusive deals!
              </p>
            </div>
          )}

          {/* Helpful Hint */}
          <div className="bg-blue-50/80 border border-blue-200/50 rounded-lg px-3 py-2 flex items-start gap-2">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-900">
              <strong>Tip:</strong> Use airport codes like <span className="font-mono bg-white px-1 rounded">JFK</span> (New York), <span className="font-mono bg-white px-1 rounded">ORD</span> (Chicago), <span className="font-mono bg-white px-1 rounded">DEL</span> (Delhi), <span className="font-mono bg-white px-1 rounded">BOM</span> (Mumbai) for best results.
            </p>
          </div>
        </form>
      </div>

      {/* Validation Error Message */}
      {validationError && (
        <div className="bg-red-50/80 border border-red-200/50 rounded-lg px-3 py-2 flex items-start gap-2">
          <Info className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-900">
            {validationError}
          </p>
        </div>
      )}
    </div>
  );
}