const express = require("express");
const mongoose = require("mongoose");
const helmet = require("helmet");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
require("dotenv").config();

const urlRoutes = require("./routes/urlRoutes");
const redirectRoute = require("./routes/redirectRoute");

const app = express();
const PORT = process.env.PORT || 5000;

// Trust Render/Heroku reverse proxy so rate limiter sees real client IPs
app.set("trust proxy", 1);

// ─── Security Middleware ────────────────────────────────────────────
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" },
    contentSecurityPolicy: false,
  })
);

// ─── CORS ───────────────────────────────────────────────────────────
app.use(
  cors({
    origin: [
      process.env.FRONTEND_URL || "http://localhost:5173",
      "http://localhost:3000",
    ],
    methods: ["GET", "POST", "DELETE"],
    allowedHeaders: ["Content-Type"],
  })
);

// ─── Rate Limiting ──────────────────────────────────────────────────
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { error: "Too many requests. Please try again later." },
});
app.use("/api/", limiter);

// ─── Body Parser ────────────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Routes ─────────────────────────────────────────────────────────
app.use("/api/urls", urlRoutes);
app.use("/", redirectRoute); // Must be last — handles /:code

// ─── Health Check ───────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// ─── MongoDB Connection ─────────────────────────────────────────────
mongoose
  .connect(process.env.MONGO_URI || "mongodb://localhost:27017/urlshortener")
  .then(() => {
    console.log("✅ MongoDB connected");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  });

module.exports = app;
