const express = require("express");
const router = express.Router();
const {
  shortenUrl,
  getAllUrls,
  getUrlAnalytics,
  deleteUrl,
  regenerateQr,
} = require("../controllers/urlController");

// POST   /api/urls/shorten      → shorten a URL
// GET    /api/urls               → get all URLs
// GET    /api/urls/:code         → get analytics for a URL
// DELETE /api/urls/:id           → delete a URL
// GET    /api/urls/:code/qr      → regenerate QR code

router.post("/shorten", shortenUrl);
router.get("/", getAllUrls);
router.get("/:code/analytics", getUrlAnalytics);
router.delete("/:id", deleteUrl);
router.get("/:code/qr", regenerateQr);

module.exports = router;
