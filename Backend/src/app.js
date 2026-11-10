
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const aiRoutes = require("./routes/aiRoutes");
const healthAssistantRoutes = require("./routes/healthAssistantRoutes");
const pregnancyAssistantRoutes = require("./routes/pregnancyAssistantRoutes");

const app = express();

app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/ai", aiRoutes);
app.use("/api/v1/health-assistant", healthAssistantRoutes);
app.use("/api/v1/pregnancy-assistant", pregnancyAssistantRoutes);
// Base endpoint
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Baikology API",
    status: "running",
  });
});

// Health endpoint
app.get("/api/v1/health", (req, res) => {
  res.json({
    status: "healthy",
    service: "baikology-api",
  });
});

// Authentication routes

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
