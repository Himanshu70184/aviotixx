// Airport Autocomplete Input Component
import { useState, useRef, useEffect } from 'react';
import { MapPin, Plane, Loader2 } from 'lucide-react';
import { searchAirports, getPopularAirports, getAirportDetails } from '../data/airports';

interface AirportAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  icon?: 'mappin' | 'plane';
  region?: 'US' | 'INDIA' | 'HUBS' | 'ALL';
  label: string;
}

export function AirportAutocomplete({ 
  value, 
  onChange, 
  placeholder, 
  icon = 'mappin',
  region = 'ALL',
  label 
}: AirportAutocompleteProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Format display text to show both code and city name
  const getDisplayText = (airportCode: string): string => {
    if (!airportCode) return '';
    const airport = getAirportDetails(airportCode);
    return `${airport.code} - ${airport.city}`;
  };

  useEffect(() => {
    async function loadAirports() {
      try {
        const query = searchQuery || (value && value.length <= 3 ? value : '');
        if (query.length > 0) {
          // For immediate results, always show local search first
          const results = await searchAirports(query, region);
          setSuggestions(results);
        } else {
          // Show popular airports when empty
          const popular = getPopularAirports(region);
          setSuggestions(popular);
        }
      } catch (error) {
        console.warn('Airport search failed:', error);
        // Fallback logic is built into searchAirports now
        setSuggestions(getPopularAirports(region));
      } finally {
        setIsLoading(false);
      }
    }
    
    setIsLoading(true);
    loadAirports();
  }, [searchQuery, region, value]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (airportCode: string) => {
    onChange(airportCode);
    setSearchQuery('');
    setIsFocused(false);
  };

  const handleInputChange = (inputValue: string) => {
    setSearchQuery(inputValue);
    setIsFocused(true);
  };

  const handleFocus = () => {
    setIsFocused(true);
    // If there's a selected value, clear the search to show suggestions
    if (value) {
      setSearchQuery('');
    }
  };

  const IconComponent = icon === 'plane' ? Plane : MapPin;

  return (
    <div className="relative group">
      <label className="block text-xs font-medium text-gray-800 mb-1 ml-1">{label}</label>
      <IconComponent className="absolute left-2.5 top-[34px] w-4 h-4 text-gray-500 pointer-events-none z-10" />
      
      <input
        ref={inputRef}
        type="text"
        placeholder={placeholder}
        value={isFocused ? searchQuery : getDisplayText(value)}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={handleFocus}
        onBlur={() => {
          // Small delay to allow click on suggestions
          setTimeout(() => setIsFocused(false), 150);
        }}
        className="w-full pl-8 pr-2 py-2.5 text-sm border border-white/50 rounded-lg focus:ring-2 focus:ring-[#1E3A8A] focus:border-transparent text-gray-900 transition-all bg-white/80 backdrop-blur-sm placeholder:text-gray-500 relative z-20"
        maxLength={50}
        autoComplete="off"
      />

      {/* Autocomplete Dropdown */}
      {isFocused && (suggestions.length > 0 || isLoading) && (
        <div 
          ref={dropdownRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-2xl border border-gray-200 max-h-60 overflow-y-auto z-50 animate-fadeIn"
        >
          {isLoading ? (
            <div className="px-3 py-4 text-center">
              <Loader2 className="w-5 h-5 text-[#1E3A8A] animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Searching airports worldwide...</p>
            </div>
          ) : (
            <>
              {suggestions.map((airport) => (
                <button
                  key={airport.code}
                  type="button"
                  onClick={() => handleSelect(airport.code)}
                  className="w-full px-3 py-2.5 text-left hover:bg-blue-50 transition-colors flex items-start gap-3 border-b border-gray-100 last:border-b-0 group/item"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-[#1E3A8A] to-[#0EA5E9] rounded-lg flex items-center justify-center flex-shrink-0 group-hover/item:scale-110 transition-transform">
                    <Plane className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span className="font-bold text-[#1E3A8A] text-sm">{airport.code}</span>
                      <span className="text-xs text-gray-600 truncate">{airport.city}</span>
                    </div>
                    <p className="text-xs text-gray-500 truncate">{airport.name}</p>
                    {airport.country && (
                      <p className="text-[10px] text-gray-400 truncate">{airport.country}</p>
                    )}
                  </div>
                </button>
              ))}
              
              {value.length === 0 && !isLoading && (
                <div className="px-3 py-2 bg-gray-50 border-t border-gray-200">
                  <p className="text-[10px] text-gray-500 text-center">
                    Popular airports worldwide • Start typing for more options
                  </p>
                </div>
              )}
              
              {value.length > 0 && suggestions.length === 0 && !isLoading && (
                <div className="px-3 py-4 text-center">
                  <p className="text-sm text-gray-600">No airports found for "{value}"</p>
                  <p className="text-xs text-gray-500 mt-1">Try searching by city name or airport code</p>
                </div>
              )}
            </>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }
      `}</style>
    </div>
  );
}
