import { useState, useRef, useEffect } from 'react';
import { Search, MapPin, X, Navigation } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export interface Location {
  name: string;
  address: string;
  placeId: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  types: string[];
}

interface LocationPickerProps {
  value?: Location | null;
  onChange: (location: Location | null) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  allowCurrentLocation?: boolean;
  'data-testid'?: string;
}

export function LocationPicker({
  value,
  onChange,
  placeholder = "Search for a location...",
  className = "",
  disabled = false,
  allowCurrentLocation = true,
  'data-testid': dataTestId = "location-picker"
}: LocationPickerProps) {
  const [query, setQuery] = useState(value?.name || '');
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (value) {
      setQuery(value.name || value.address);
    }
  }, [value]);

  const searchLocations = async (searchQuery: string) => {
    if (!searchQuery.trim() || searchQuery.length < 3) {
      setSuggestions([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/routes/search-locations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: searchQuery,
          region: 'US' // TODO: Make this configurable
        })
      });

      if (!response.ok) {
        throw new Error('Failed to search locations');
      }

      const locations = await response.json();
      setSuggestions(locations);
    } catch (err) {
      console.error('Location search error:', err);
      setError('Failed to search locations. Please try again.');
      setSuggestions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    setQuery(newQuery);
    setIsOpen(true);

    // Clear existing debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Debounce search
    debounceRef.current = setTimeout(() => {
      searchLocations(newQuery);
    }, 300);
  };

  const handleLocationSelect = (location: Location) => {
    setQuery(location.name || location.address);
    setIsOpen(false);
    setSuggestions([]);
    onChange(location);
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
    onChange(null);
    inputRef.current?.focus();
  };

  const handleCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by this browser');
      return;
    }

    setIsLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          const location: Location = {
            name: 'Current Location',
            address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
            placeId: '',
            coordinates: { lat: latitude, lng: longitude },
            types: ['current_location']
          };
          
          handleLocationSelect(location);
        } catch (err) {
          setError('Failed to get current location');
        } finally {
          setIsLoading(false);
        }
      },
      (err) => {
        setError('Failed to access location');
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const formatLocationTypes = (types: string[]) => {
    const relevantTypes = types.filter(type => 
      !type.includes('plus_code') && 
      !type.includes('compound_code') &&
      type !== 'establishment'
    );
    
    return relevantTypes.slice(0, 2).map(type => 
      type.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())
    );
  };

  return (
    <div className={`relative ${className}`} data-testid={dataTestId}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          ref={inputRef}
          value={query}
          onChange={handleInputChange}
          onFocus={() => setIsOpen(true)}
          onBlur={(e) => {
            // Delay closing to allow for clicks on suggestions
            setTimeout(() => {
              if (!e.currentTarget.contains(document.activeElement)) {
                setIsOpen(false);
              }
            }, 150);
          }}
          placeholder={placeholder}
          className="pl-10 pr-20"
          disabled={disabled}
          data-testid={`${dataTestId}-input`}
        />
        
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
          {allowCurrentLocation && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleCurrentLocation}
              disabled={disabled || isLoading}
              className="h-6 w-6 p-0"
              data-testid={`${dataTestId}-current-location`}
            >
              <Navigation className="w-3 h-3" />
            </Button>
          )}
          
          {query && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleClear}
              disabled={disabled}
              className="h-6 w-6 p-0"
              data-testid={`${dataTestId}-clear`}
            >
              <X className="w-3 h-3" />
            </Button>
          )}
        </div>
      </div>

      {/* Selected Location Display */}
      {value && !isOpen && (
        <div className="mt-2 p-2 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md">
          <div className="flex items-center space-x-2">
            <MapPin className="w-4 h-4 text-green-600" />
            <div>
              <div className="font-medium text-sm text-green-900 dark:text-green-100">
                {value.name}
              </div>
              <div className="text-xs text-green-700 dark:text-green-300">
                {value.address}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Dropdown with suggestions */}
      {isOpen && (
        <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-80 overflow-y-auto">
          <CardContent className="p-0">
            {error && (
              <div className="p-3 text-sm text-red-600 dark:text-red-400">
                {error}
              </div>
            )}

            {isLoading && (
              <div className="p-3 text-sm text-gray-500 dark:text-gray-400 flex items-center">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-blue-600 rounded-full animate-spin mr-2"></div>
                Searching locations...
              </div>
            )}

            {!isLoading && !error && suggestions.length === 0 && query.trim().length >= 3 && (
              <div className="p-3 text-sm text-gray-500 dark:text-gray-400">
                No locations found for "{query}"
              </div>
            )}

            {suggestions.map((location, index) => (
              <button
                key={`${location.placeId}-${index}`}
                className="w-full text-left p-3 hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                onClick={() => handleLocationSelect(location)}
                data-testid={`${dataTestId}-suggestion-${index}`}
              >
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 mt-0.5 text-gray-400" />
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900 dark:text-white">
                      {location.name}
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      {location.address}
                    </div>
                    {location.types.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {formatLocationTypes(location.types).map(type => (
                          <Badge key={type} variant="secondary" className="text-xs">
                            {type}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default LocationPicker;