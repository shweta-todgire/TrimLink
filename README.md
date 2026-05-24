# TrimLink — URL Shortener + QR Generator

A modern MERN stack URL shortener with QR code generation, analytics, and a clean dark UI.

🌐 Live Demo: https://trimlink-crkt.onrender.com

---

## 🚀 Features

- Shorten long URLs instantly
- Custom aliases support
- QR code generation & download
- Click analytics
- Link history
- Expiry options
- Secure backend with Helmet & rate limiting

---

## 🛠️ Tech Stack

- React + Vite
- Node.js + Express
- MongoDB + Mongoose
- Axios
- QRCode
- NanoID

---

## 📁 Project Structure

```bash
frontend/   # React frontend
backend/    # Express API + MongoDB
```

---

## ⚙️ Environment Variables

Create `.env` inside `backend/`

```env
PORT=5000
MONGO_URI=your_mongodb_uri
BASE_URL=http://localhost:5000
FRONTEND_URL=http://localhost:5173
```

---

## ▶️ Run Locally

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open:

```bash
http://localhost:5173
```

---

## 🔌 API Routes

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/urls/shorten` | Create short URL |
| GET | `/api/urls` | Get all URLs |
| GET | `/api/urls/:code/analytics` | URL analytics |
| DELETE | `/api/urls/:id` | Delete URL |
| GET | `/:code` | Redirect |

---

## 🔒 Security

- Helmet.js
- CORS protection
- Rate limiting
- URL validation

---

## 📦 Production Build

```bash
cd frontend
npm run build
```

---
