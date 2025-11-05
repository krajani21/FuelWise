const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const volumeBasedRoutes = require("./routes/volumeBasedRoutes")
const distanceOnlyRoutes = require("./routes/distanceOnlyRoutes");
const authRoutes = require("./routes/authRoutes")
const recentSearchRoutes = require("./routes/recentSearchRoutes");
const profileRoutes = require("./routes/profileRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const cors = require("cors");
const verifyToken = require("./middleware/authMiddleware");
const { globalRateLimiter } = require("./middleware/rateLimiter");


dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy - important for rate limiting behind reverse proxies (Render, Heroku, etc.)
app.set('trust proxy', 1);

// Middleware
app.use(express.json());

// CORS configuration to allow requests from frontend
const corsOptions = {
  origin: [
    'https://fuel-wise.vercel.app', // Production frontend URL
    'https://fuelwiseapp.com', // New production frontend URL
    'https://fuel-wise-s4qc.vercel.app', // staging URL
    'http://localhost:3000', // Local development
    'http://localhost:3001' // Alternative local port
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

// Apply global rate limiter to all routes
app.use(globalRateLimiter);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));


app.use("/api/auth", authRoutes);//handle authentication logic
app.use("/api/volume-based", volumeBasedRoutes);//handle volume based logic
app.use("/api/distances-only", distanceOnlyRoutes)
app.use("/api/recent-searches", recentSearchRoutes);//handle recent searches
app.use("/api/profile", profileRoutes);//handle user profile management
app.use("/api/vehicles", vehicleRoutes);//handle vehicle data and validation

app.get("/api/protected", verifyToken, (req, res) =>{
  res.json( {message: "you are now authorised", userId: req.user.id})
});

// Metrics endpoint (for monitoring normalization effectiveness)
const { getMetrics, resetMetrics } = require("./utils/metrics");
const cache = require("./utils/cache");
app.get("/api/metrics", (req, res) => {
  res.json({
    ...getMetrics(),
    cache: cache.getStats()
  });
});
app.post("/api/metrics/reset", (req, res) => {
  resetMetrics();
  res.json({ message: "Metrics reset successfully" });
});

// Optional root route
app.get("/", (req, res) => {
  res.send("Fuel Cost Optimization API is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log("\n✅ Query Normalization: ACTIVE");
  console.log("🛡️  Rate Limiting: ACTIVE");
  console.log("   - Guests: 10 searches per 15 min");
  console.log("   - Authenticated: 100 searches per 15 min");
  console.log("   - Auth endpoints: 5 attempts per 15 min");
  console.log("📊 View metrics at: /api/metrics");
  console.log("🔄 Reset metrics: POST /api/metrics/reset\n");
});
