import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./pages/Auth"; // 🔥 new combined page
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 🔐 Auth page (Login + Register tabs) */}
        <Route path="/" element={<Auth />} />

        {/* 🔒 Protected Dashboard */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}