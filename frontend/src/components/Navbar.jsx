import { Link } from "react-router-dom";

export default function Navbar() {
  const logout = () => {
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  return (
    <nav>
      <Link to="/dashboard">Dashboard</Link>
      <button onClick={logout}>Logout</button>
    </nav>
  );
}