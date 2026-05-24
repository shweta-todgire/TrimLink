# TrimLink — URL Shortener + QR Generator

A full-stack MERN URL shortener with QR code generation, click analytics, and a sleek dark UI.

Live on: https://trimlink-crkt.onrender.com
---

## 🚀 Features

- **URL Shortening** — Instant short codes (auto-generated or custom alias)
- **QR Code Generation** — Auto-generated QR for every link, downloadable as PNG
- **Click Analytics** — Total clicks + last-7-day bar chart per link
- **Link History** — Browse, search, copy, and delete all your links
- **Expiry Options** — Set links to expire after 24h, 7 days, or 30 days
- **Security** — Helmet.js headers, CORS, rate limiting (100 req/15 min)
- **No Login Required** — Fully public, open tool

---

## 🧱 Tech Stack

| Layer     | Tech                             |
|-----------|----------------------------------|
| Frontend  | React 18, React Router v6, Axios |
| Backend   | Node.js, Express 4               |
| Database  | MongoDB + Mongoose               |
| Security  | Helmet.js, express-rate-limit    |
| QR        | `qrcode` npm package             |
| Short IDs | `nanoid`                         |
| Fonts     | Syne + DM Sans (Google Fonts)    |

---

## 📁 Project Structure

```
url-shortener/
├── backend/
│   ├── controllers/
│   │   └── urlController.js    # Business logic
│   ├── models/
│   │   └── Url.js              # Mongoose schema
│   ├── routes/
│   │   ├── urlRoutes.js        # /api/urls/*
│   │   └── redirectRoute.js    # /:code redirect
│   ├── .env.example
│   ├── package.json
│   └── server.js               # Express entry + Helmet + CORS
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   ├── UrlInput.jsx     # URL form with advanced options
    │   │   ├── ResultCard.jsx   # Result + QR display
    │   │   └── Toast.jsx        # Notification system
    │   ├── pages/
    │   │   ├── Home.jsx         # Main tool page
    │   │   ├── Analytics.jsx    # Per-link stats + chart
    │   │   └── History.jsx      # All links list
    │   ├── services/
    │   │   └── api.js           # Axios instance + all API calls
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css            # Design system + global styles
    ├── index.html
    ├── package.json
    └── vite.config.js           # Proxy /api → :5000
```

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`) OR a MongoDB Atlas URI

### 1. Clone / download the project

```bash
cd url-shortener
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Configure environment

```bash
cp .env.example .env
```

Edit `.env`:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/urlshortener
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

### 4. Install frontend dependencies

```bash
cd ../frontend
npm install
```

### 5. Run both servers

**Terminal 1 — Backend:**
```bash
cd backend
npm run dev        # uses nodemon for hot-reload
```

**Terminal 2 — Frontend:**
```bash
cd frontend
npm run dev        # Vite dev server on :5173
```

Open **http://localhost:5173**

---

## 🔌 API Reference

| Method | Endpoint                        | Description              |
|--------|---------------------------------|--------------------------|
| POST   | `/api/urls/shorten`             | Create a short URL       |
| GET    | `/api/urls`                     | Get all URLs             |
| GET    | `/api/urls/:code/analytics`     | Analytics for one URL    |
| DELETE | `/api/urls/:id`                 | Soft-delete a URL        |
| GET    | `/api/urls/:code/qr`            | Regenerate QR (high-res) |
| GET    | `/:code`                        | Redirect to original URL |
| GET    | `/api/health`                   | Health check             |

### POST `/api/urls/shorten` — Request body

```json
{
  "originalUrl": "https://example.com/very/long/url",
  "customAlias": "my-link",    // optional
  "expiresIn": "7d"            // optional: "24h" | "7d" | "30d"
}
```

---

## 🎨 UI Pages

| Route                | Description                   |
|----------------------|-------------------------------|
| `/`                  | Home — shorten URL + QR       |
| `/history`           | All links with search/delete  |
| `/analytics/:code`   | Per-link stats + chart        |

---

## 🔒 Security

- **Helmet.js** — Sets 11 security HTTP headers automatically
- **CORS** — Restricted to your frontend origin
- **Rate Limiting** — 100 requests per 15 minutes per IP
- **URL Validation** — `valid-url` checks before saving
- **Input Sanitization** — Custom alias stripped of special chars

---

## 📦 Build for Production

```bash
# Frontend
cd frontend
npm run build      # outputs to dist/

# Backend — serve frontend build statically (optional)
# Add in server.js:
# app.use(express.static(path.join(__dirname, '../frontend/dist')))
```

---

## 🗺️ Possible Enhancements

- [ ] Bulk URL shortening (CSV upload)
- [ ] Password-protected links
- [ ] Click geolocation map
- [ ] Link preview (OG tags)
- [ ] Export analytics as CSV
- [ ] Dark/light mode toggle
