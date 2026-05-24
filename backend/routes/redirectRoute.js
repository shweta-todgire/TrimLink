const express = require("express");
const router = express.Router();
const Url = require("../models/Url");

// GET /:code → redirect to original URL
router.get("/:code", async (req, res) => {
  try {
    const { code } = req.params;

    // Skip API and static routes
    if (code.startsWith("api") || code === "favicon.ico") {
      return res.status(404).json({ error: "Not found." });
    }

    const url = await Url.findOne({ shortCode: code, isActive: true });

    if (!url) {
      return res.status(404).json({
        error: "Short URL not found or has been deleted.",
      });
    }

    // Check expiry
    if (url.expiresAt && url.expiresAt < new Date()) {
      return res.status(410).json({
        error: "This link has expired.",
      });
    }

    // Track click
    url.clicks += 1;
    url.clickHistory.push({
      timestamp: new Date(),
      referrer: req.get("Referrer") || "direct",
      userAgent: req.get("User-Agent") || "",
    });
    await url.save();

    // Redirect
    return res.redirect(301, url.originalUrl);
  } catch (err) {
    console.error("Redirect error:", err);
    res.status(500).json({ error: "Server error." });
  }
});

module.exports = router;
