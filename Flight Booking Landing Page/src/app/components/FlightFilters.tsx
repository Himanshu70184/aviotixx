// Flight Filters Sidebar Component
import { useState } from 'react';
import { Plane, Clock, DollarSign, Filter, X, ChevronDown, ChevronUp } from 'lucide-react';
import { FlightResult } from '../services/travelportApi';

export interface FilterState {
  stops: string[];
  airlines: string[];
  priceRange: { min: number; max: number };
  departureTime: string[];
  duration: { min: number; max: number };
  cabinClass: string[];
}

interface FlightFiltersProps {
  flights: FlightResult[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onReset: () => void;
}

export function FlightFilters({ flights, filters, onFilterChange, onReset }: FlightFiltersProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    stops: true,
    price: true,
    airlines: true,
    departure: true,
    duration: true,
    cabin: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  // Calculate price range from flights
  const prices = flights.map(f => f.price);
  const minPrice = Math.min(...prices, 0);
  const maxPrice = Math.max(...prices, 10000);

  // Get unique airlines from flights
  const uniqueAirlines = Array.from(new Set(flights.map(f => f.airline))).sort();

  // Get unique cabin classes
  const uniqueCabins = Array.from(new Set(flights.map(f => f.cabinClass))).sort();

  // Calculate flight counts for each filter
  const stopCounts = {
    nonstop: flights.filter(f => f.stops === 0).length,
    oneStop: flights.filter(f => f.stops === 1).length,
    multiStop: flights.filter(f => f.stops >= 2).length,
  };

  const airlineCounts = uniqueAirlines.reduce((acc, airline) => {
    acc[airline] = flights.filter(f => f.airline === airline).length;
    return acc;
  }, {} as Record<string, number>);

  const handleStopChange = (value: string) => {
    const newStops = filters.stops.includes(value)
      ? filters.stops.filter(s => s !== value)
      : [...filters.stops, value];
    onFilterChange({ ...filters, stops: newStops });
  };

  const handleAirlineChange = (airline: string) => {
    const newAirlines = filters.airlines.includes(airline)
      ? filters.airlines.filter(a => a !== airline)
      : [...filters.airlines, airline];
    onFilterChange({ ...filters, airlines: newAirlines });
  };

  const handleDepartureTimeChange = (time: string) => {
    const newTimes = filters.departureTime.includes(time)
      ? filters.departureTime.filter(t => t !== time)
      : [...filters.departureTime, time];
    onFilterChange({ ...filters, departureTime: newTimes });
  };

  const handleCabinClassChange = (cabin: string) => {
    const newCabins = filters.cabinClass.includes(cabin)
      ? filters.cabinClass.filter(c => c !== cabin)
      : [...filters.cabinClass, cabin];
    onFilterChange({ ...filters, cabinClass: newCabins });
  };

  const handlePriceChange = (value: number, type: 'min' | 'max') => {
    onFilterChange({
      ...filters,
      priceRange: {
        ...filters.priceRange,
        [type]: value,
      },
    });
  };

  const activeFilterCount = 
    filters.stops.length + 
    filters.airlines.length + 
    filters.departureTime.length +
    filters.cabinClass.length +
    (filters.priceRange.min !== minPrice || filters.priceRange.max !== maxPrice ? 1 : 0);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden sticky top-24">
      {/* Filter Header */}
      <div className="bg-gradient-to-r from-[#1E3A8A] to-[#0EA5E9] px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-white" />
            <h3 className="text-lg font-bold text-white">Filters</h3>
            {activeFilterCount > 0 && (
              <span className="bg-white text-[#1E3A8A] px-2 py-0.5 rounded-full text-xs font-bold">
                {activeFilterCount}
              </span>
            )}
          </div>
          {activeFilterCount > 0 && (
            <button
              onClick={onReset}
              className="text-white text-sm font-medium hover:text-gray-200 transition-colors flex items-center gap-1"
            >
              <X className="w-4 h-4" />
              Reset
            </button>
          )}
        </div>
      </div>

      <div className="max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Stops Filter */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('stops')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900">Stops</span>
            {expandedSections.stops ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.stops && (
            <div className="px-4 pb-4 space-y-2">
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.stops.includes('nonstop')}
                    onChange={() => handleStopChange('nonstop')}
                    className="w-5 h-5 text-white bg-transparent border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-1 cursor-pointer transition-all hover:border-[#0EA5E9] checked:bg-[#0EA5E9] checked:border-[#0EA5E9]"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">Non-stop</span>
                </div>
                <span className="text-xs text-gray-500">{stopCounts.nonstop}</span>
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.stops.includes('1stop')}
                    onChange={() => handleStopChange('1stop')}
                    className="w-5 h-5 text-white bg-transparent border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-1 cursor-pointer transition-all hover:border-[#0EA5E9] checked:bg-[#0EA5E9] checked:border-[#0EA5E9]"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">1 Stop</span>
                </div>
                <span className="text-xs text-gray-500">{stopCounts.oneStop}</span>
              </label>
              <label className="flex items-center justify-between cursor-pointer group">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filters.stops.includes('2+stops')}
                    onChange={() => handleStopChange('2+stops')}
                    className="w-5 h-5 text-white bg-transparent border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-1 cursor-pointer transition-all hover:border-[#0EA5E9] checked:bg-[#0EA5E9] checked:border-[#0EA5E9]"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">2+ Stops</span>
                </div>
                <span className="text-xs text-gray-500">{stopCounts.multiStop}</span>
              </label>
            </div>
          )}
        </div>

        {/* Price Range Filter */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('price')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900">Price Range</span>
            {expandedSections.price ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.price && (
            <div className="px-4 pb-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <label className="text-xs text-gray-600 mb-1 block">Min Price</label>
                  <input
                    type="number"
                    value={filters.priceRange.min}
                    onChange={(e) => handlePriceChange(Number(e.target.value), 'min')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                    min={minPrice}
                    max={filters.priceRange.max}
                  />
                </div>
                <div className="flex-1">
                  <label className="text-xs text-gray-600 mb-1 block">Max Price</label>
                  <input
                    type="number"
                    value={filters.priceRange.max}
                    onChange={(e) => handlePriceChange(Number(e.target.value), 'max')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#0EA5E9] focus:border-transparent"
                    min={filters.priceRange.min}
                    max={maxPrice}
                  />
                </div>
              </div>
              <div className="text-center">
                <span className="text-sm font-semibold text-[#1E3A8A]">
                  ${filters.priceRange.min} - ${filters.priceRange.max}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Airlines Filter */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('airlines')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900">Airlines</span>
            {expandedSections.airlines ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.airlines && (
            <div className="px-4 pb-4 space-y-2 max-h-64 overflow-y-auto">
              {uniqueAirlines.map((airline) => (
                <label key={airline} className="flex items-center justify-between cursor-pointer group">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={filters.airlines.includes(airline)}
                      onChange={() => handleAirlineChange(airline)}
                      className="w-5 h-5 text-white bg-transparent border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-1 cursor-pointer transition-all hover:border-[#0EA5E9] checked:bg-[#0EA5E9] checked:border-[#0EA5E9]"
                    />
                    <span className="text-sm text-gray-700 group-hover:text-gray-900">{airline}</span>
                  </div>
                  <span className="text-xs text-gray-500">{airlineCounts[airline]}</span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* Departure Time Filter */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('departure')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900">Departure Time</span>
            {expandedSections.departure ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.departure && (
            <div className="px-4 pb-4 space-y-2">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.departureTime.includes('morning')}
                  onChange={() => handleDepartureTimeChange('morning')}
                  className="w-5 h-5 text-white bg-transparent border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-1 cursor-pointer transition-all hover:border-[#0EA5E9] checked:bg-[#0EA5E9] checked:border-[#0EA5E9]"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">🌅 Morning (6AM - 12PM)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.departureTime.includes('afternoon')}
                  onChange={() => handleDepartureTimeChange('afternoon')}
                  className="w-5 h-5 text-white bg-transparent border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-1 cursor-pointer transition-all hover:border-[#0EA5E9] checked:bg-[#0EA5E9] checked:border-[#0EA5E9]"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">☀️ Afternoon (12PM - 6PM)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.departureTime.includes('evening')}
                  onChange={() => handleDepartureTimeChange('evening')}
                  className="w-5 h-5 text-white bg-transparent border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-1 cursor-pointer transition-all hover:border-[#0EA5E9] checked:bg-[#0EA5E9] checked:border-[#0EA5E9]"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">🌆 Evening (6PM - 12AM)</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={filters.departureTime.includes('night')}
                  onChange={() => handleDepartureTimeChange('night')}
                  className="w-5 h-5 text-white bg-transparent border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-1 cursor-pointer transition-all hover:border-[#0EA5E9] checked:bg-[#0EA5E9] checked:border-[#0EA5E9]"
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">🌙 Night (12AM - 6AM)</span>
              </label>
            </div>
          )}
        </div>

        {/* Cabin Class Filter */}
        <div className="border-b border-gray-200">
          <button
            onClick={() => toggleSection('cabin')}
            className="w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors"
          >
            <span className="font-semibold text-gray-900">Cabin Class</span>
            {expandedSections.cabin ? (
              <ChevronUp className="w-4 h-4 text-gray-500" />
            ) : (
              <ChevronDown className="w-4 h-4 text-gray-500" />
            )}
          </button>
          {expandedSections.cabin && (
            <div className="px-4 pb-4 space-y-2">
              {uniqueCabins.map((cabin) => (
                <label key={cabin} className="flex items-center gap-2 cursor-pointer group">
                  <input
                    type="checkbox"
                    checked={filters.cabinClass.includes(cabin)}
                    onChange={() => handleCabinClassChange(cabin)}
                    className="w-5 h-5 text-white bg-transparent border-2 border-gray-300 rounded-md focus:ring-2 focus:ring-[#0EA5E9] focus:ring-offset-1 cursor-pointer transition-all hover:border-[#0EA5E9] checked:bg-[#0EA5E9] checked:border-[#0EA5E9]"
                  />
                  <span className="text-sm text-gray-700 group-hover:text-gray-900">{cabin}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}