const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

// Connect DB
connectDB();

const app = express();

// Middleware
app.use(express.json());

// 🔥 CORS (for frontend connection)
app.use(cors({
  origin: "*" // later replace with frontend URL
}));

// ✅ API Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/grievances", require("./routes/grievanceRoutes")); // 🔥 FIXED

// Root route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});