const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();

// Enable CORS for frontend
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());

// Base endpoints
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Baikology API 🌷",
    status: "running",
  });
});

app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "baikology-api",
  });
});

// Mount Authentication routes
app.use("/api/v1/auth", authRoutes);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    detail: `Endpoint not found: ${req.method} ${req.originalUrl}`,
  });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("API error:", err);
  res.status(err.status || 500).json({
    success: false,
    detail: err.message || "Internal server error",
  });
});

module.exports = app;