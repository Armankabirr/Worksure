// MapLocationSelector.jsx
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { X, MapPin, Search } from 'lucide-react';

// Fix Leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

export default function MapLocationSelector({ onSelect, onClose, apiKey, initialLat = 23.8103, initialLon = 90.4125 }) {
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markerRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState({
    lat: initialLat,
    lon: initialLon,
    display_name: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Check API key on mount
  useEffect(() => {
    if (!apiKey) {
      console.warn('MapLocationSelector: API Key is not provided');
      setError('API Key is not configured. Location search will not work.');
    } else {
      console.log('MapLocationSelector: API Key is configured');
      setError(null);
    }
  }, [apiKey]);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    const map = L.map(mapRef.current).setView([initialLat, initialLon], 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);

    // Add initial marker
    markerRef.current = L.marker([initialLat, initialLon], {
      draggable: true,
    }).addTo(map);

    // Update position when marker is dragged
    markerRef.current.on('dragend', async () => {
      const latLng = markerRef.current.getLatLng();
      setSelectedLocation({
        lat: latLng.lat,
        lon: latLng.lng,
        display_name: `${latLng.lat.toFixed(5)}, ${latLng.lng.toFixed(5)}`,
      });
      await reverseGeocode(latLng.lat, latLng.lng);
    });

    // Update position when map is clicked
    map.on('click', async (e) => {
      const { lat, lng } = e.latlng;
      if (markerRef.current) {
        markerRef.current.setLatLng([lat, lng]);
      }
      setSelectedLocation({
        lat,
        lon: lng,
        display_name: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      });
      await reverseGeocode(lat, lng);
    });

    mapInstanceRef.current = map;

    return () => {
      map.off('click');
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Reverse geocode to get address from coordinates
  const reverseGeocode = async (lat, lon) => {
    try {
      if (!apiKey) {
        console.warn('API Key is missing');
        return;
      }
      
      const url = `https://us1.locationiq.com/v1/reverse.php?key=${encodeURIComponent(apiKey)}&lat=${lat}&lon=${lon}&format=json`;
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (!res.ok) {
        console.error(`API Error: HTTP ${res.status}`);
        throw new Error(`HTTP ${res.status}`);
      }
      
      const data = await res.json();
      setSelectedLocation({
        lat,
        lon,
        display_name: data.address?.display_name || `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
        raw: data,
      });
    } catch (err) {
      console.error('Reverse geocode error:', err);
      // Still update location even if reverse geocoding fails
      setSelectedLocation({
        lat,
        lon,
        display_name: `${lat.toFixed(5)}, ${lon.toFixed(5)}`,
      });
    }
  };

  // Forward geocode to search for address
  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);

    try {
      if (!apiKey) {
        setError('API Key is not configured');
        setLoading(false);
        return;
      }

      // Build the URL for LocationIQ API
      const url = `https://us1.locationiq.com/v1/autocomplete.php?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(searchQuery)}&format=json&limit=5&countrycodes=bd`;
      
      console.log('Searching location with query:', searchQuery);
      console.log('API Key present:', !!apiKey);
      
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Worksure-App',
        },
        mode: 'cors',
      });

      console.log('Response status:', res.status, res.statusText);

      if (!res.ok) {
        const errorText = await res.text();
        console.error(`API Error: HTTP ${res.status}`, errorText);
        throw new Error(`HTTP ${res.status} - ${res.statusText}`);
      }

      const data = await res.json();
      console.log('Search result:', data);

      if (Array.isArray(data) && data.length > 0) {
        const location = data[0];
        const lat = parseFloat(location.lat);
        const lon = parseFloat(location.lon);

        // Update map and marker
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView([lat, lon], 15);
        }
        if (markerRef.current) {
          markerRef.current.setLatLng([lat, lon]);
        }

        setSelectedLocation({
          lat,
          lon,
          display_name: location.display_name,
          raw: location,
        });
        setSearchQuery(''); // Clear search after selection
      } else {
        setError('Location not found. Try a different search term.');
      }
    } catch (err) {
      console.error('Search error:', err);
      setError(`Failed to fetch location: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = () => {
    if (onSelect) {
      onSelect({
        display_name: selectedLocation.display_name,
        lat: selectedLocation.lat,
        lon: selectedLocation.lon,
        raw: selectedLocation.raw,
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-bold text-foreground">Select Location on Map</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-200 space-y-3">
          <div className="flex gap-2">
            <Input
              placeholder="Search for an address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              className="border-slate-300"
            />
            <Button
              onClick={handleSearch}
              disabled={loading || !searchQuery.trim()}
              className="bg-primary hover:bg-primary/90 text-white gap-2"
            >
              <Search className="h-4 w-4" />
              Search
            </Button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </div>

        {/* Map Container */}
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={mapRef}
            style={{ width: '100%', height: '100%', minHeight: '400px' }}
            className="rounded-lg"
          />
          <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-lg max-w-xs">
            <p className="text-xs font-bold text-muted-foreground mb-1">Selected Location:</p>
            <p className="text-sm font-semibold text-foreground line-clamp-3">
              {selectedLocation.display_name}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Lat: {selectedLocation.lat.toFixed(5)}, Lon: {selectedLocation.lon.toFixed(5)}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex gap-3 justify-end p-4 border-t border-slate-200">
          <Button
            onClick={onClose}
            variant="outline"
            className="border-slate-300"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="bg-primary hover:bg-primary/90 text-white"
          >
            Confirm Location
          </Button>
        </div>
      </div>
    </div>
  );
}
