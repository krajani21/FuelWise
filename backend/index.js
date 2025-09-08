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



dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// CORS configuration to allow requests from frontend
const corsOptions = {
  origin: [
    'https://fuel-wise.vercel.app', // Production frontend URL
    'http://localhost:3000', // Local development
    'http://localhost:3001' // Alternative local port
  ],
  credentials: true,
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));

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

// Optional root route
app.get("/", (req, res) => {
  res.send("Fuel Cost Optimization API is running.");
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
