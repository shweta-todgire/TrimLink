import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import History from "./pages/History";
import Toast from "./components/Toast";
import { ToastProvider } from "./components/Toast";

export default function App() {
  return (
    <ToastProvider>
      <BrowserRouter>
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/analytics/:code" element={<Analytics />} />
              <Route path="/history" element={<History />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </ToastProvider>
  );
}
