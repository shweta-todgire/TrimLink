const { nanoid } = require("nanoid");
const validUrl = require("valid-url");
const QRCode = require("qrcode");
const Url = require("../models/Url");

// ─── Shorten URL ────────────────────────────────────────────────────
const shortenUrl = async (req, res) => {
  try {
    const { originalUrl, customAlias, expiresIn, sessionId } = req.body;

    // Validate URL
    if (!originalUrl) {
      return res.status(400).json({ error: "URL is required." });
    }
    if (!validUrl.isWebUri(originalUrl)) {
      return res
        .status(400)
        .json({ error: "Invalid URL. Please include http:// or https://" });
    }

    // Require sessionId
    if (!sessionId || typeof sessionId !== "string" || sessionId.trim().length < 8) {
      return res.status(400).json({ error: "Invalid session. Please refresh the page." });
    }

    // Check custom alias availability
    let shortCode = customAlias
      ? customAlias.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 20)
      : nanoid(8);

    if (customAlias) {
      const existing = await Url.findOne({ shortCode });
      if (existing) {
        return res
          .status(409)
          .json({ error: "Custom alias already taken. Try another." });
      }
    }

    // Handle expiry
    let expiresAt = null;
    if (expiresIn === "24h") expiresAt = new Date(Date.now() + 86400000);
    else if (expiresIn === "7d") expiresAt = new Date(Date.now() + 604800000);
    else if (expiresIn === "30d")
      expiresAt = new Date(Date.now() + 2592000000);

    // Generate QR Code
    const shortUrl = `${process.env.BASE_URL || "http://localhost:5000"}/${shortCode}`;
    const qrCode = await QRCode.toDataURL(shortUrl, {
      errorCorrectionLevel: "M",
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
      width: 256,
    });

    // Save to DB
    const newUrl = new Url({
      originalUrl,
      shortCode,
      customAlias: customAlias || null,
      qrCode,
      expiresAt,
      sessionId: sessionId.trim(),
    });

    await newUrl.save();

    return res.status(201).json({
      success: true,
      data: {
        _id: newUrl._id,
        originalUrl: newUrl.originalUrl,
        shortCode: newUrl.shortCode,
        shortUrl,
        qrCode: newUrl.qrCode,
        clicks: newUrl.clicks,
        expiresAt: newUrl.expiresAt,
        createdAt: newUrl.createdAt,
      },
    });
  } catch (err) {
    console.error("shortenUrl error:", err);
    res.status(500).json({ error: "Server error. Please try again." });
  }
};

// ─── Get All URLs (scoped to session) ───────────────────────────────
const getAllUrls = async (req, res) => {
  try {
    const { sessionId } = req.query;

    if (!sessionId || typeof sessionId !== "string" || sessionId.trim().length < 8) {
      return res.status(400).json({ error: "Invalid session ID." });
    }

    const urls = await Url.find({ isActive: true, sessionId: sessionId.trim() })
      .sort({ createdAt: -1 })
      .limit(50)
      .select("-clickHistory");

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";
    const data = urls.map((u) => ({
      _id: u._id,
      originalUrl: u.originalUrl,
      shortCode: u.shortCode,
      shortUrl: `${baseUrl}/${u.shortCode}`,
      qrCode: u.qrCode,
      clicks: u.clicks,
      expiresAt: u.expiresAt,
      createdAt: u.createdAt,
    }));

    res.json({ success: true, data });
  } catch (err) {
    console.error("getAllUrls error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

// ─── Get Single URL Analytics ────────────────────────────────────────
const getUrlAnalytics = async (req, res) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code, isActive: true });

    if (!url) {
      return res.status(404).json({ error: "URL not found." });
    }

    const baseUrl = process.env.BASE_URL || "http://localhost:5000";

    // Clicks per day (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const recentClicks = url.clickHistory.filter(
      (c) => c.timestamp >= sevenDaysAgo
    );

    const clicksByDay = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split("T")[0];
      clicksByDay[key] = 0;
    }
    recentClicks.forEach((c) => {
      const key = c.timestamp.toISOString().split("T")[0];
      if (clicksByDay[key] !== undefined) clicksByDay[key]++;
    });

    res.json({
      success: true,
      data: {
        _id: url._id,
        originalUrl: url.originalUrl,
        shortCode: url.shortCode,
        shortUrl: `${baseUrl}/${url.shortCode}`,
        qrCode: url.qrCode,
        clicks: url.clicks,
        expiresAt: url.expiresAt,
        createdAt: url.createdAt,
        clicksByDay,
      },
    });
  } catch (err) {
    console.error("getUrlAnalytics error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

// ─── Delete URL (must belong to session) ────────────────────────────
const deleteUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const { sessionId } = req.body;

    if (!sessionId) {
      return res.status(400).json({ error: "Session ID required." });
    }

    // Only delete if this session owns the URL
    const url = await Url.findOneAndUpdate(
      { _id: id, sessionId: sessionId.trim() },
      { isActive: false },
      { new: true }
    );

    if (!url) {
      return res.status(404).json({ error: "URL not found or not yours." });
    }

    res.json({ success: true, message: "URL deleted successfully." });
  } catch (err) {
    console.error("deleteUrl error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

// ─── Regenerate QR ──────────────────────────────────────────────────
const regenerateQr = async (req, res) => {
  try {
    const { code } = req.params;
    const url = await Url.findOne({ shortCode: code, isActive: true });

    if (!url) {
      return res.status(404).json({ error: "URL not found." });
    }

    const shortUrl = `${process.env.BASE_URL || "http://localhost:5000"}/${code}`;
    const qrCode = await QRCode.toDataURL(shortUrl, {
      errorCorrectionLevel: "H",
      margin: 2,
      color: { dark: "#0f172a", light: "#ffffff" },
      width: 512,
    });

    url.qrCode = qrCode;
    await url.save();

    res.json({ success: true, qrCode });
  } catch (err) {
    console.error("regenerateQr error:", err);
    res.status(500).json({ error: "Server error." });
  }
};

module.exports = {
  shortenUrl,
  getAllUrls,
  getUrlAnalytics,
  deleteUrl,
  regenerateQr,
};
