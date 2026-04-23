import { useEffect, useState } from "react";
import API from "../services/api";

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Academic",
    status: "Pending",
    date: ""
  });

  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );

  // 🌙 Dark mode
  useEffect(() => {
    if (dark) {
      document.body.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.body.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  // 📥 Fetch grievances (sorted latest first)
  const fetchData = async () => {
    const res = await API.get("/grievances");
    const sorted = res.data.sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
    setData(sorted);
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ➕ Add / Update
  const handleSubmit = async () => {
    const payload = {
      ...form,
      date: form.date || new Date() // fallback to current date
    };

    if (editId) {
      await API.put(`/grievances/${editId}`, payload);
      setEditId(null);
    } else {
      await API.post("/grievances", payload);
    }

    setForm({
      title: "",
      description: "",
      category: "Academic",
      status: "Pending",
      date: ""
    });

    setShowForm(false);
    fetchData();
  };

  // ❌ Delete
  const remove = async (id) => {
    await API.delete(`/grievances/${id}`);
    fetchData();
  };

  // ✏️ Edit
  const handleEdit = (item) => {
    setForm({
      ...item,
      date: item.date ? item.date.substring(0, 10) : ""
    });
    setEditId(item._id);
    setShowForm(true);
  };

  // 🔍 Filter
  const filtered = data.filter(item =>
    item.title.toLowerCase().includes(search.toLowerCase())
  );

  // 📅 Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleString();
  };

  return (
    <div className="layout">

      {/* SIDEBAR */}
      <div className="sidebar">
        <h3>Grievance Portal</h3>

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

        <button onClick={() => {
          localStorage.removeItem("token");
          window.location.href = "/";
        }}>
          Logout
        </button>
      </div>

      {/* MAIN */}
      <div className="main">

        {/* STATS */}
        <div className="stats">
          <div className="stat-card">
            <h4>Total</h4>
            <p>{data.length}</p>
          </div>
          <div className="stat-card">
            <h4>Resolved</h4>
            <p>{data.filter(d => d.status === "Resolved").length}</p>
          </div>
        </div>

        {/* NEW BUTTON */}
        {!showForm && (
          <div className="new-box" onClick={() => setShowForm(true)}>
            + New Grievance
          </div>
        )}

        {/* FORM */}
        {showForm && (
          <div className="card">
            <h2>{editId ? "Edit Grievance" : "Add Grievance"}</h2>

            <input
              placeholder="Title"
              value={form.title}
              onChange={e => setForm({ ...form, title: e.target.value })}
            />

            <textarea
              placeholder="Describe your issue..."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
            />

            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
            >
              <option>Academic</option>
              <option>Hostel</option>
              <option>Transport</option>
              <option>Other</option>
            </select>

            <select
              value={form.status}
              onChange={e => setForm({ ...form, status: e.target.value })}
            >
              <option>Pending</option>
              <option>Resolved</option>
            </select>

            {/* 📅 DATE INPUT */}
            <input
              type="date"
              value={form.date}
              onChange={e => setForm({ ...form, date: e.target.value })}
            />

            <button onClick={handleSubmit}>
              {editId ? "Update" : "Add"}
            </button>

            <button
              style={{ marginTop: "10px", background: "#9ca3af" }}
              onClick={() => {
                setShowForm(false);
                setEditId(null);
              }}
            >
              Cancel
            </button>
          </div>
        )}

        {/* SEARCH */}
        <input
          className="search"
          placeholder="Search..."
          onChange={e => setSearch(e.target.value)}
        />

        {/* LIST */}
        {filtered.map(item => (
          <div key={item._id} className="item">
            <b>{item.title}</b>
            <p>{item.description}</p>
            <p>{item.category} | {item.status}</p>

            {/* 📅 SHOW DATE */}
            <small style={{ color: "gray" }}>
              {formatDate(item.date)}
            </small>

            <div className="actions">
              <button className="update" onClick={() => handleEdit(item)}>Edit</button>
              <button className="delete" onClick={() => remove(item._id)}>Delete</button>
            </div>
          </div>
        ))}

      </div>
    </div>
  );
}