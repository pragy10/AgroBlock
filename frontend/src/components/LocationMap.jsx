import React from 'react';
import { MapPin, Navigation } from 'lucide-react';

const LocationMap = ({ latitude, longitude, location, locationHistory }) => {
  // Simple static map using Google Static Maps API (no API key needed for basic usage)
  const getStaticMapUrl = (lat, lng) => {
    if (!lat || !lng) return null;
    return `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=13&size=600x300&markers=color:green%7C${lat},${lng}&key=YOUR_API_KEY`;
  };

  const mapUrl = getStaticMapUrl(latitude, longitude);

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <MapPin className="h-5 w-5 text-primary-600" />
          <h3 className="font-bold text-gray-800">Location Tracking</h3>
        </div>
      </div>

      {/* Current Location */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-start space-x-3">
          <Navigation className="h-5 w-5 text-blockchain-blue mt-1" />
          <div>
            <p className="text-sm font-medium text-gray-700">Current Location</p>
            <p className="text-gray-900 font-semibold">{location || 'Unknown'}</p>
            {latitude && longitude && (
              <p className="text-xs text-gray-500 mt-1">
                Coordinates: {latitude.toFixed(4)}, {longitude.toFixed(4)}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Map Placeholder (since we don't have a real map API) */}
      <div className="bg-gradient-to-br from-green-100 to-blue-100 h-48 flex items-center justify-center">
        <div className="text-center">
          <MapPin className="h-12 w-12 text-primary-600 mx-auto mb-2" />
          <p className="text-gray-700 font-medium">{location}</p>
          {latitude && longitude && (
            <p className="text-sm text-gray-600">
              {latitude.toFixed(4)}°, {longitude.toFixed(4)}°
            </p>
          )}
        </div>
      </div>

      {/* Location History */}
      {locationHistory && locationHistory.length > 0 && (
        <div className="p-4">
          <p className="text-sm font-medium text-gray-700 mb-3">Location History</p>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {locationHistory.map((loc, index) => (
              <div key={index} className="flex items-start space-x-2 text-sm">
                <div className="flex-shrink-0 w-2 h-2 mt-2 rounded-full bg-primary-500"></div>
                <div className="flex-1">
                  <p className="text-gray-800">{loc.location}</p>
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <span>{new Date(loc.timestamp).toLocaleString()}</span>
                    <span>•</span>
                    <span className="capitalize">{loc.status}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationMap;
