import { useState } from "react";
import API from "../services/api";
import FormCard from "../components/FormCard";

export default function Register() {
  const [form, setForm] = useState({});
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/auth/register", form);
      window.location.href = "/";
    } catch {
      setError("Registration failed");
    }
  };

  return (
    <FormCard title="Register">
      <form onSubmit={handleSubmit}>
        <input placeholder="Name"
          onChange={e => setForm({...form, name: e.target.value})}/>
        <input placeholder="Email"
          onChange={e => setForm({...form, email: e.target.value})}/>
        <input type="password" placeholder="Password"
          onChange={e => setForm({...form, password: e.target.value})}/>
        {error && <p className="error">{error}</p>}
        <button>Register</button>
      </form>
    </FormCard>
  );
}