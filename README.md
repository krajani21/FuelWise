## FuelWise Web App

🚀 **Live Demo**  
Try it out now and start saving on fuel:  
https://fuelwiseapp.com/

📝 **Design Document**  
**Author:** Krish Rajani

---

## Overview

FuelWise is a full-stack web app that helps users find the most cost-effective fuel stations based on their location, travel distance, and fuel prices. It leverages Google Maps APIs and a custom backend for real-time comparisons. The frontend is built with React, and the backend uses Node.js, Express, and MongoDB.

---

## Core Features

### 1. **Location-Aware Fuel Station Listing**

- Automatically fetches the user's current location using the Geolocation API.
- Retrieves nearby fuel stations from the backend based on coordinates.
- Supports sorting by total fuel cost (volume-based) or by shortest distance.

### 2. **Google Maps Navigation**

- Clicking a fuel station opens Google Maps in a new tab with directions from the user's current location.
- Navigation mode defaults to **driving**.

### 3. **Dynamic Fuel Station Data**

- Uses the Google Maps Places API to fetch real-time fuel prices and distances.
- Stations are displayed in visually styled cards with clean in-line styles or CSS modules.

### 4. **User Authentication**

- Secure signup and login via JWT-based authentication.
- Tokens stored in localStorage.
- Protected routes (`/volume`, `/distance`) secured via context-based or HOC-style `PrivateRoute` components.

### 5. **UI Cleanup and UX Enhancements**

- Refine styling for:
  - Station cards (hover effects, gradients, padding).
  - Buttons (e.g., “Sort”, “Get Directions”).
  - Headers and mobile spacing.
- Apply consistent theming across components.

---

## Technical Stack

- **Frontend:** React.js  
- **Backend:** Node.js, Express.js  
- **Database:** MongoDB  
- **APIs:** Google Maps (Distance Matrix, Places), Geolocation API

---

## Deployment

- **Frontend:** Vercel  
- **Backend:** Render  
- Environment variables used for API keys and MongoDB URI.

---

**End of Document**
