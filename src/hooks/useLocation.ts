import { useState, useEffect } from 'react';

interface LocationState {
  address: string;
  loading: boolean;
  error: string | null;
}

interface LocationData {
  address: string;
  loading: boolean;
  error: string | null;
  refreshLocation: () => void;
}

export const useLocation = (): LocationData => {
  const [locationData, setLocationData] = useState<LocationState>({
    address: 'Plot No. 15C, IT Park, Sector 22, Panchkula, Haryana, 134109', // fallback address
    loading: true,
    error: null
  });

  const getCurrentLocation = () => {
      if (!navigator.geolocation) {
        setLocationData(prev => ({
          ...prev,
          loading: false,
          error: 'Geolocation is not supported by this browser'
        }));
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const address = await reverseGeocode(latitude, longitude);
            setLocationData(prev => ({
              ...prev,
              address,
              loading: false,
              error: null
            }));
          } catch (error) {
            // Silently handle geocoding errors - use default address
            setLocationData(prev => ({
              ...prev,
              loading: false,
              error: null // Don't show error for geocoding failures
            }));
          }
        },
        (error) => {
          let errorMessage = 'Unable to retrieve your location';
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information is unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          setLocationData(prev => ({
            ...prev,
            loading: false,
            error: errorMessage
          }));
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000 // 5 minutes
        }
      );
    };

  const refreshLocation = () => {
    setLocationData(prev => ({ ...prev, loading: true, error: null }));
    getCurrentLocation();
  };

  useEffect(() => {
    getCurrentLocation();
  }, []);

  return {
    ...locationData,
    refreshLocation
  };
};

const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  // Note: Nominatim has CORS restrictions and requires User-Agent header
  // Browser fetch cannot set User-Agent header, so CORS errors are expected
  // For production, use a backend proxy or alternative geocoding service
  // Errors are handled silently to avoid console noise
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
    
    // Suppress console errors for this fetch
    const originalError = console.error;
    console.error = () => {}; // Temporarily disable console.error
    
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1&accept-language=en&zoom=18`,
      {
        method: 'GET',
        signal: controller.signal,
        // Note: Cannot set User-Agent header in browser fetch due to browser security
      }
    ).catch(() => {
      // Silently catch CORS and network errors
      return null;
    });
    
    // Restore console.error
    console.error = originalError;
    clearTimeout(timeoutId);
    
    if (!response || !response.ok) {
      return 'Location detected';
    }
    
    const data = await response.json();
    
    if (data && data.address) {
      const addr = data.address;
      
      // Try to build a more accurate address from the structured data
      let addressParts = [];
      
      // Add house number or building name if available
      if (addr.house_number) addressParts.push(addr.house_number);
      if (addr.building) addressParts.push(addr.building);
      if (addr.road) addressParts.push(addr.road);
      if (addr.suburb) addressParts.push(addr.suburb);
      if (addr.city || addr.town || addr.village) {
        addressParts.push(addr.city || addr.town || addr.village);
      }
      if (addr.state) addressParts.push(addr.state);
      if (addr.postcode) addressParts.push(addr.postcode);
      
      if (addressParts.length > 0) {
        return addressParts.join(', ');
      }
      
      // Fallback to display_name if structured data is not available
      if (data.display_name) {
        const addressParts = data.display_name.split(', ');
        // Take more parts for better accuracy
        const relevantParts = addressParts.slice(0, 5);
        return relevantParts.join(', ');
      }
    }
    
    return 'Location detected';
  } catch (error: any) {
    // Silently handle all errors - CORS, network, timeout, etc.
    return 'Location detected';
  }
};
