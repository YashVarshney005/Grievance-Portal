import { useEffect, useState } from "react";
import API from "../services/api";
import ExpenseForm from "../components/ExpenseForm.jsx";

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [total, setTotal] = useState(0);
  const [category, setCategory] = useState("");

  const fetchExpenses = async () => {
    const res = await API.get(`/expenses?category=${category}`);
    setExpenses(res.data.expenses);
  };

  const fetchTotal = async () => {
    const res = await API.get("/expenses/total");
    setTotal(res.data.total);
  };

  useEffect(()=>{
    fetchExpenses();
    fetchTotal();
  },[category]);

  return (
    <div className="container">
      <div className="dashboard">

        <h2>Dashboard</h2>

        <div className="total-box">
          Total ₹{total}
        </div>

        <select onChange={(e)=>setCategory(e.target.value)}>
          <option value="">All</option>
          <option>Food</option>
          <option>Travel</option>
          <option>Bills</option>
        </select>

        <ExpenseForm refresh={fetchExpenses}/>

        {expenses.map(e=>(
          <div key={e._id} className="expense-item">
            <span>{e.title}</span>
            <span>₹{e.amount}</span>
          </div>
        ))}

      </div>
    </div>
  );
}