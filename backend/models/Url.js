const mongoose = require("mongoose");

const clickSchema = new mongoose.Schema({
  timestamp: { type: Date, default: Date.now },
  referrer: { type: String, default: "direct" },
  userAgent: { type: String, default: "" },
});

const urlSchema = new mongoose.Schema(
  {
    originalUrl: {
      type: String,
      required: true,
      trim: true,
    },
    shortCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    customAlias: {
      type: String,
      default: null,
      trim: true,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    clickHistory: [clickSchema],
    qrCode: {
      type: String, // base64 data URI
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    sessionId: {
      type: String,
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for fast lookups
urlSchema.index({ shortCode: 1 });
urlSchema.index({ createdAt: -1 });
urlSchema.index({ sessionId: 1 }); // fast per-session history queries

// Virtual: full short URL
urlSchema.virtual("shortUrl").get(function () {
  return `${process.env.BASE_URL || "http://localhost:5000"}/${this.shortCode}`;
});

urlSchema.set("toJSON", { virtuals: true });
urlSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Url", urlSchema);
