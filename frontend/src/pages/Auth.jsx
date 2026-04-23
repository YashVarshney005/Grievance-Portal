import { useState, useEffect } from "react";
import API from "../services/api";

export default function Auth() {
  const [active, setActive] = useState("login");
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  // 🌙 DARK MODE STATE
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // 🌙 APPLY THEME
  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(form.email)) {
      return setError("Invalid email format");
    }

    try {
      if (active === "login") {
        const res = await API.post("/auth/login", form);
        localStorage.setItem("token", res.data.token);
        window.location.href = "/dashboard";
      } else {
        await API.post("/auth/register", form);
        setActive("login");
      }
    } catch {
      setError("Something went wrong");
    }
  };

  return (
    <div className="auth-wrapper">

      {/* 🔥 HEADER */}
      <div className="auth-header">
        <h2>Grievance Portal</h2>

        {/* 🌙 DARK MODE TOGGLE */}
        <div className="toggle">
          <span>☀️</span>
          <label className="switch">
            <input
              type="checkbox"
              checked={dark}
              onChange={() => setDark(!dark)}
            />
            <span className="slider-toggle"></span>
          </label>
          <span>🌙</span>
        </div>
      </div>

      {/* 🔥 AUTH CARD */}
      <div className="card auth-card">

        {/* TABS */}
        <div className="tabs">
          <div
            className={`tab ${active === "login" ? "active" : ""}`}
            onClick={() => {
              setActive("login");
              setError("");
            }}
          >
            Login
          </div>

          <div
            className={`tab ${active === "register" ? "active" : ""}`}
            onClick={() => {
              setActive("register");
              setError("");
            }}
          >
            Register
          </div>

          <div className={`slider ${active}`} />
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit}>

          {active === "register" && (
            <input
              placeholder="Name"
              value={form.name || ""}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
            />
          )}

          <input
            placeholder="Email"
            value={form.email || ""}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
          />

          <input
            type="password"
            placeholder="Password"
            value={form.password || ""}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
          />

          {error && <p className="error">{error}</p>}

          <button type="submit">
            {active === "login" ? "Login" : "Register"}
          </button>

        </form>
      </div>
    </div>
  );
}