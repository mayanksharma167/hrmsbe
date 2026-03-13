require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const employeeRoutes = require("./routes/employees");
const attendanceRoutes = require("./routes/attendance");
const dashboardRoutes = require("./routes/dashboard");
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3001;

// ─── Middleware ───────────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "DELETE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ─────────────────────────────────────────────────────────────
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/dashboard", dashboardRoutes);

// 404 handler
app.use((req, res) => {
  res
    .status(404)
    .json({
      error: "Not Found",
      message: `Route ${req.method} ${req.path} not found.`,
    });
});

// Global error handler (must be last)
app.use(errorHandler);

// ─── MongoDB Atlas Connection ─────────────────────────────────────────────────
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("✅ Connected to MongoDB Atlas");
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};

// ─── Start Server ─────────────────────────────────────────────────────────────
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 HRMS Lite backend running on http://localhost:${PORT}`);
    console.log(`   Health check: http://localhost:${PORT}/health`);
  });
});

// Graceful shutdown
process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("MongoDB connection closed.");
  process.exit(0);
});
