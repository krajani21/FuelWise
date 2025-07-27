import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import FuelListVolume from './pages/FuelListVolume';
import FuelListDistance from './pages/fuelListDistance';
import Login from './pages/Login';
import Signup from './pages/Signup';
import LogoutButton from './components/LogoutButton';
import LandingPage from './pages/LandingPage';
import PrivateRoute from './routes/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import './styles/global.css';

const AppContent = ({ userLocation, setUserLocation }) => {
  const location = useLocation();

  const handleGetLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setUserLocation(coords);
        console.log("user location: ", coords);
      },
      (error) => {
        console.error("Error getting location: ", error);
        alert("Unable to retrieve your location. Please allow location access in your browser settings.");
      }
    );
  };

  // Define routes where LogoutButton should NOT appear
  const publicRoutes = ['/', '/login', '/signup'];
  const hideLogout = publicRoutes.includes(location.pathname);

  return (
    <div>
      {!hideLogout && <LogoutButton />}

      <div className="App" style={{ padding: "20px", maxWidth: "900px", margin: "0 auto" }}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route
            path="/distance"
            element={
              <PrivateRoute>
                <>
                  <button
                    onClick={handleGetLocation}
                    className="nav-button"
                    style={{ marginBottom: "20px" }}
                  >
                    Get location
                  </button>
                  <nav className="nav-links">
                    <Link to="/distance" className="nav-button">Sort by Distance</Link>
                    <Link to="/volume" className="nav-button">Sort by Max Volume</Link>
                  </nav>
                  <FuelListDistance userLocation={userLocation} />
                </>
              </PrivateRoute>
            }
          />

          <Route
            path="/volume"
            element={
              <PrivateRoute>
                <>
                  <button
                    onClick={handleGetLocation}
                    className="nav-button"
                    style={{ marginBottom: "20px" }}
                  >
                    Get location
                  </button>
                  <nav className="nav-links">
                    <Link to="/distance" className="nav-button">Sort by Distance</Link>
                    <Link to="/volume" className="nav-button">Sort by Max Volume</Link>
                  </nav>
                  <FuelListVolume userLocation={userLocation} />
                </>
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
};

function App() {
  const [userLocation, setUserLocation] = useState(null);

  return (
    <AuthProvider>
      <Router>
        <AppContent userLocation={userLocation} setUserLocation={setUserLocation} />
      </Router>
    </AuthProvider>
  );
}

export default App;
