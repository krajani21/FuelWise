import React, { useState, useEffect } from 'react';
import { fetchDistanceOnly } from '../api/distanceOnly';
import {getNearestStation, calculateCentDifference} from '../utils/savings';
import '../styles/FuelList.css';

const FuelListDistance = ({ userLocation }) => {
  const [stations, setStations] = useState([]);


  useEffect(() => {
    if (userLocation) {
      fetchDistanceOnly(userLocation)
        .then((data) => {
          const filtered = data.filter(station => station.distance !== null);
          const sorted = [...filtered].sort((a, b) => a.distance - b.distance);
          const nearest = getNearestStation(filtered);

          const updated = sorted.map((station) => {
            const centsSaved = calculateCentDifference(nearest.price, station.price);
            return { ...station, centsSaved };
          });

          setStations(updated);
        })
        .catch((err) => {
          console.error("Failed to fetch distances:", err);
        });
    }
  }, [userLocation]);


  const handleGetDirections = (lat, lng) => {
    const origin = `${userLocation.lat},${userLocation.lng}`;
    const destination = `${lat},${lng}`;
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}&travelmode=driving`;
    window.open(url, '_blank');
  };

  return (
    <div className="page-container">
      <h1 className="heading">Fuel Stations Sorted by Distance</h1>

      <ul className="station-list">
        {stations.map((station, index) => (
          <li key={index} className="station-card">
            <strong>{station.station_name}</strong>
            <div className="station-meta">{station.address} - ${station.price.toFixed(2)}</div>
            {station.centsSaved && (
              <div className='station-meta savings-text'>{station.centsSaved}</div>
            )}
            <div className="station-meta">
              Distance: {station.distance_text} ({station.duration_text})
            </div>
            <button
              className="directions-button"
              onClick={() => handleGetDirections(station.lat, station.lng)}
            >
              Get Directions
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FuelListDistance;
