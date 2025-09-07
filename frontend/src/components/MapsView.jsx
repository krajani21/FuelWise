import React, { useEffect, useRef, useState } from 'react';
import { Wrapper, Status } from '@googlemaps/react-wrapper';
import { MapPin, Navigation, Fuel } from 'lucide-react';
import { isPreferredStation } from '../utils/preferredStations';

// Google Maps API key - you'll need to set this in your .env file
const GOOGLE_MAPS_API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'YOUR_GOOGLE_MAPS_API_KEY';

const MapComponent = ({ 
  userLocation, 
  stations, 
  submittedAmount, 
  submittedEfficiency, 
  preferredBrands,
  onStationClick 
}) => {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [markers, setMarkers] = useState([]);


  useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    const mapInstance = new window.google.maps.Map(mapRef.current, {
      center: { lat: userLocation.lat, lng: userLocation.lng },
      zoom: 12,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ]
    });

    setMap(mapInstance);

    // Add user location marker
    if (userLocation) {
      new window.google.maps.Marker({
        position: { lat: userLocation.lat, lng: userLocation.lng },
        map: mapInstance,
        title: 'Your Location',
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
            <svg width="30" height="30" viewBox="0 0 30 30" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="12" fill="#4285F4" stroke="#FFFFFF" stroke-width="3"/>
              <circle cx="15" cy="15" r="6" fill="#FFFFFF"/>
            </svg>
          `),
          scaledSize: new window.google.maps.Size(30, 30),
          anchor: new window.google.maps.Point(15, 15)
        },
        zIndex: 1000 // Ensure user location appears on top
      });
    }
  }, [userLocation]);

  useEffect(() => {
    if (!map || !stations || stations.length === 0) return;

    // Clear existing markers
    markers.forEach(marker => marker.setMap(null));

    const newMarkers = stations.map((station, index) => {
      // Use the data already calculated by the list view
      const trueSavings = station.trueSavings || 0;
      
      // Determine marker color and shape based on true savings and preferred status
      const isPreferred = isPreferredStation(station, preferredBrands);
      const isWorthIt = trueSavings > 0; // Same logic as list view
      const markerColor = isWorthIt ? '#10B981' : '#FF4444'; // Green for worth it, Red for not worth it
      
      // Use the station's actual price for display
      const effectiveCost = station.price;
      
      // Create custom marker using AdvancedMarkerElement (newer API) with fallback
      let marker;
      
      // Create a custom marker with fuel cost label
      const markerElement = document.createElement('div');
      markerElement.style.position = 'relative';
      markerElement.style.width = '40px';
      markerElement.style.height = '40px';
      
      // Create the marker pin
      const pinElement = document.createElement('div');
      pinElement.style.width = '30px';
      pinElement.style.height = '30px';
      pinElement.style.borderRadius = '50% 50% 50% 0';
      pinElement.style.transform = 'rotate(-45deg)';
      pinElement.style.backgroundColor = markerColor;
      pinElement.style.border = '2px solid #FFFFFF';
      pinElement.style.boxShadow = '0 2px 6px rgba(0,0,0,0.3)';
      pinElement.style.position = 'absolute';
      pinElement.style.top = '0';
      pinElement.style.left = '5px';
      
      // Create the price label
      const priceLabel = document.createElement('div');
      priceLabel.style.position = 'absolute';
      priceLabel.style.top = '-8px';
      priceLabel.style.left = '50%';
      priceLabel.style.transform = 'translateX(-50%)';
      priceLabel.style.backgroundColor = '#FFFFFF';
      priceLabel.style.color = '#333';
      priceLabel.style.padding = '2px 6px';
      priceLabel.style.borderRadius = '10px';
      priceLabel.style.fontSize = '10px';
      priceLabel.style.fontWeight = 'bold';
      priceLabel.style.border = '1px solid #ccc';
      priceLabel.style.boxShadow = '0 1px 3px rgba(0,0,0,0.2)';
      priceLabel.style.whiteSpace = 'nowrap';
      priceLabel.textContent = `$${effectiveCost.toFixed(2)}`;
      
      markerElement.appendChild(pinElement);
      markerElement.appendChild(priceLabel);
      
      // Create fuel pump icon marker
      const fuelPumpIcon = `
        <svg width="32" height="32" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="14" fill="${markerColor}" stroke="#FFFFFF" stroke-width="2"/>
          <g transform="translate(8, 8) scale(0.8)" fill="white" stroke="white" stroke-width="1">
            <!-- Fuel pump body -->
            <rect x="2" y="4" width="6" height="8" rx="1" fill="white"/>
            <!-- Fuel pump hose -->
            <path d="M8 6 Q10 4 12 6 L14 8" stroke="white" stroke-width="1.5" fill="none"/>
            <!-- Fuel pump nozzle -->
            <rect x="13" y="7" width="2" height="2" rx="0.5" fill="white"/>
            <!-- Fuel pump base -->
            <rect x="1" y="12" width="8" height="2" rx="1" fill="white"/>
            <!-- Fuel pump handle -->
            <rect x="3" y="2" width="2" height="2" rx="0.5" fill="white"/>
          </g>
        </svg>`;

      // Create the marker with fuel pump icon
      marker = new window.google.maps.Marker({
        position: { lat: station.lat, lng: station.lng },
        map: map,
        title: `${station.station_name} - $${effectiveCost.toFixed(2)}/L`,
        icon: {
          url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(fuelPumpIcon),
          scaledSize: new window.google.maps.Size(32, 32),
          anchor: new window.google.maps.Point(16, 16)
        }
      });

      // Create Google Maps-style label with comprehensive information
      const labelDiv = document.createElement('div');
      labelDiv.style.cssText = `
        background: white;
        border: 1px solid #ccc;
        border-radius: 6px;
        padding: 8px 12px;
        font-family: Arial, sans-serif;
        font-size: 12px;
        color: #333;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        white-space: nowrap;
        max-width: 200px;
        text-align: left;
      `;
      
      // Add preferred brand indicator
      const preferredIndicator = isPreferred ? ' ⭐' : '';
      const netSavingsText = trueSavings > 0 ? `+$${trueSavings.toFixed(2)}` : `$${trueSavings.toFixed(2)}`;
      const netSavingsColor = trueSavings > 0 ? '#10B981' : '#FF4444';
      
      labelDiv.innerHTML = `
        <div style="font-weight: bold; color: #333; margin-bottom: 4px; font-size: 13px;">
          ${station.station_name}${preferredIndicator}
        </div>
        <div style="font-size: 11px; color: #000; font-weight: bold; margin-bottom: 2px;">
          Price: $${effectiveCost.toFixed(2)}/L
        </div>
        <div style="font-size: 11px; color: ${netSavingsColor}; margin-bottom: 6px; font-weight: 500;">
          Net: ${netSavingsText}
        </div>
        <button id="directions-btn-${index}" style="
          background: #2563EB;
          color: white;
          border: none;
          border-radius: 4px;
          padding: 4px 8px;
          font-size: 10px;
          font-weight: 500;
          cursor: pointer;
          width: 100%;
          transition: background-color 0.2s ease;
        " onmouseover="this.style.background='#1D4ED8'" onmouseout="this.style.background='#2563EB'">Get Directions</button>
      `;

      // Create InfoBox for the label (Google Maps style)
      const infoBox = new window.google.maps.InfoWindow({
        content: labelDiv,
        disableAutoPan: true,
        pixelOffset: new window.google.maps.Size(0, -10)
      });

      // Create info window content
      const infoWindow = new window.google.maps.InfoWindow({
        content: createInfoWindowContent(station, effectiveCost, isPreferred, trueSavings)
      });

      // Add click listener to show Google Maps-style label
      marker.addListener('click', () => {
        // Close any other open labels
        if (window.currentInfoBox) {
          window.currentInfoBox.close();
        }
        
        // Open the new label
        infoBox.open(map, marker);
        window.currentInfoBox = infoBox;
        
        // Add click handler for the directions button
        setTimeout(() => {
          const directionsBtn = document.getElementById(`directions-btn-${index}`);
          if (directionsBtn) {
            directionsBtn.addEventListener('click', (e) => {
              e.stopPropagation();
              // Open Google Maps directions
              const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${station.lat},${station.lng}`;
              window.open(directionsUrl, '_blank');
            });
          }
        }, 100);
        
        if (onStationClick) {
          onStationClick(station);
        }
      });

      return marker;
    });

    setMarkers(newMarkers);

    // Fit map to show all markers
    if (newMarkers.length > 0) {
      const bounds = new window.google.maps.LatLngBounds();
      newMarkers.forEach(marker => bounds.extend(marker.getPosition()));
      map.fitBounds(bounds);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [map, stations, submittedAmount, submittedEfficiency, preferredBrands, onStationClick]);


  const createInfoWindowContent = (station, effectiveCost, isPreferred, trueSavings = 0) => {
    const distanceKm = (station.distance / 1000).toFixed(1);
    const isPositive = trueSavings > 0;
    
    return `
      <div style="padding: 10px; min-width: 200px;">
        <div style="display: flex; align-items: center; margin-bottom: 8px;">
          <h3 style="margin: 0; font-size: 16px; font-weight: bold;">${station.station_name}</h3>
          ${isPreferred ? '<span style="background: #FFD700; color: #000; padding: 2px 6px; border-radius: 10px; font-size: 10px; margin-left: 8px;">Preferred</span>' : ''}
        </div>
        <p style="margin: 4px 0; color: #666; font-size: 12px;">${station.address}</p>
        <div style="display: flex; justify-content: space-between; margin: 8px 0;">
          <span style="font-size: 14px;">Price:</span>
          <span style="font-weight: bold; color: #4CAF50;">$${station.price.toFixed(2)}/L</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 8px 0;">
          <span style="font-size: 14px;">Net Benefit:</span>
          <span style="font-weight: bold; color: ${isPositive ? '#4285F4' : '#FF4444'};">${isPositive ? '+' : ''}$${trueSavings.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 8px 0;">
          <span style="font-size: 14px;">Distance:</span>
          <span style="font-size: 14px;">${distanceKm} km</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin: 8px 0;">
          <span style="font-size: 14px;">Travel Time:</span>
          <span style="font-size: 14px;">${station.duration_text || 'N/A'}</span>
        </div>
      </div>
    `;
  };

  return (
    <div className="w-full h-full">
      <div ref={mapRef} style={{ width: '100%', height: '500px' }} />
    </div>
  );
};

const MapsView = ({ 
  userLocation, 
  stations, 
  submittedAmount, 
  submittedEfficiency, 
  preferredBrands,
  onStationClick 
}) => {
  const render = (status) => {
    switch (status) {
      case Status.LOADING:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#4CAF50]"></div>
            <span className="ml-3 text-gray-600">Loading map...</span>
          </div>
        );
      case Status.FAILURE:
        return (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">Map Unavailable</h3>
              <p className="text-gray-500">Unable to load Google Maps. Please check your API key.</p>
            </div>
          </div>
        );
      case Status.SUCCESS:
        return (
          <MapComponent
            userLocation={userLocation}
            stations={stations}
            submittedAmount={submittedAmount}
            submittedEfficiency={submittedEfficiency}
            preferredBrands={preferredBrands}
            onStationClick={onStationClick}
          />
        );
      default:
        return null;
    }
  };

  if (!userLocation) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Navigation className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Location Required</h3>
          <p className="text-gray-500">Please enable location access to view the map.</p>
        </div>
      </div>
    );
  }

  if (!stations || stations.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Fuel className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">No Stations Found</h3>
          <p className="text-gray-500">No fuel stations found in your search area.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-2 border border-white flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                  <rect x="2" y="3" width="3" height="4" rx="0.5"/>
                  <path d="M5 4 Q6 3 7 4 L8 5" stroke="white" stroke-width="0.5" fill="none"/>
                  <rect x="7.5" y="4.5" width="1" height="1" rx="0.2" fill="white"/>
                </svg>
              </div>
              <span className="text-sm text-gray-700">Worth the Trip</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-2 border border-white flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="white">
                  <rect x="2" y="3" width="3" height="4" rx="0.5"/>
                  <path d="M5 4 Q6 3 7 4 L8 5" stroke="white" stroke-width="0.5" fill="none"/>
                  <rect x="7.5" y="4.5" width="1" height="1" rx="0.2" fill="white"/>
                </svg>
              </div>
              <span className="text-sm text-gray-700">Not Worth It</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-2 border-2 border-white relative">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-white rounded-full"></div>
              </div>
              <span className="text-sm text-gray-700">Your Location</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-2">
          Fuel pump markers show station info. Click markers for detailed information including name, price, net savings, and directions.
        </p>
      </div>
      
      <Wrapper apiKey={GOOGLE_MAPS_API_KEY} render={render} />
    </div>
  );
};

export default MapsView;

