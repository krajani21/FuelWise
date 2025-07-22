**Design Document**

**Project Name:** FuelWise Web App

**Author:** Krish Rajani

---

## Overview

This project is a full-stack web application that helps users find the most cost-effective fuel stations based on their current location, travel distance, and fuel prices. The application leverages Google Maps APIs and a custom backend to provide real-time comparisons. The frontend is built with React, and the backend is built using Node.js, Express, and MongoDB.

---

## Core Features (Implemented)

### 1. **Location-Aware Fuel Station Listing** **Location-Aware Fuel Station Listing**

- The app fetches the user's current location using the Geolocation API.
- Based on the coordinates, it calls backend APIs to retrieve nearby stations.
- Fuel stations are sorted either by volume-based cost or distance-only.

### 2. **Google Maps Redirection**

- When a user clicks on a fuel station card, a new tab opens Google Maps with directions from the user's location to the station.
- Mode of transport is automatically set to "driving."

### 3. **Dynamic Fuel Station Data**

- Fuel price and distance data is fetched dynamically using the new Google Maps Places API.
- Data is rendered in a visually styled component list (with improved in-line styling or CSS modules).

### 4. **User Authentication**

- Users can sign up and log in securely.
- JWT-based authentication is implemented, with tokens stored in localStorage.
- Protected routes like `/volume` and `/distance` are secured using context-based or HOC-based `PrivateRoute` logic. using the new Google Maps Places API.
- Data is rendered in a visually styled component list (with improved in-line styling or CSS modules).

---

## Features to Be Implemented

### 1. **UI Cleanup and UX Enhancements**

- Improve styling for:
  - Fuel station cards (padding, hover effects, gradients).
  - Buttons (Sort, Get Directions, etc.).
  - Headers and spacing for mobile responsiveness.
- Consistent theming (background, text, shadows).

### 2. **Search Radius Filter**

- Add an input field or slider to let users specify a search radius (e.g., 5 km, 10 km).
- Pass this radius to the backend to filter stations using Google Maps Places API.

### 3. **Display of Fuel Types**

- Show fuel type options like Regular, Premium, Diesel if available.
- API should be updated to include price data for each type if available.
- Add tabs or dropdown on the frontend for user to toggle between fuel types.

---

## Technical Stack

- **Frontend:** React.js
- **Backend:** Node.js, Express.js
- **Database:** MongoDB
- **APIs:** Google Maps Distance Matrix, Places, Geolocation API

---

## Deployment

- **Frontend:** Vercel
- **Backend:** Render 
- Environment variables used for API keys and Mongo URI.

---

## Next Steps

1. Finalize user auth flows (with error handling and loading states).
2. Refactor UI components and global CSS.
3. Add radius-based filtering logic on both frontend and backend.
4. Update fuel data model to include fuel types.
5. Conduct mobile usability testing and optimize performance.

---

## Notes

- Keep user experience minimal and snappy.
- Ensure secure handling of tokens.
- Consider caching frequent station data.
- Add loading spinners where API calls are slow.

---

**End of Document**

