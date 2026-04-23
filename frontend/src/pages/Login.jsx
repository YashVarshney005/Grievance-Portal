import { useState } from "react";
import API from "../services/api";
import FormCard from "../components/FormCard";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateEmail(form.email)) {
      return setError("Invalid email format");
    }

    try {
      const res = await API.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      window.location.href = "/dashboard";
    } catch {
      setError("Login failed");
    }
  };

  return (
    <FormCard title="Login">
      <form onSubmit={handleSubmit}>
        <input placeholder="Email"
          onChange={e => setForm({...form, email: e.target.value})} />
        <input type="password" placeholder="Password"
          onChange={e => setForm({...form, password: e.target.value})} />
        {error && <p className="error">{error}</p>}
        <button>Login</button>
      </form>
    </FormCard>
  );
}