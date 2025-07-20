import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import FuelListVolume from './pages/FuelListVolume';
import FuelListDistance from './pages/fuelListDistance';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LandingPage from './pages/LandingPage';
import './App.css';
import './styles/global.css';

function App() {
  const [userLocation, setUserLocation] = useState(null);

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
      },
      (error) => {
        console.error("Error getting location:", error);
        alert("Unable to retrieve location. Please allow access.");
      }
    );
  };

  return (
    <AuthProvider>
      <Router>
        <div className="App" style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
          <button onClick={handleGetLocation} className="nav-button">Get Location</button>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/distance" element={
              <PrivateRoute>
                <FuelListDistance userLocation={userLocation} />
              </PrivateRoute>
            } />
            <Route path="/volume" element={
              <PrivateRoute>
                <FuelListVolume userLocation={userLocation} />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
