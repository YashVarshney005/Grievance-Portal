import { useState } from "react";
import API from "../services/api";
import { toast } from "react-toastify";

export default function ExpenseForm({ refresh }) {
  const [form, setForm] = useState({ title:"", amount:"", category:"Food" });

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/expenses", form);
      toast.success("Expense Added");
      refresh();
    } catch {
      toast.error("Error");
    }
  };

  return (
    <form onSubmit={submit}>
      <h3>Add Expense</h3>
      <input placeholder="Title" onChange={(e)=>setForm({...form,title:e.target.value})}/>
      <input type="number" onChange={(e)=>setForm({...form,amount:e.target.value})}/>
      <select onChange={(e)=>setForm({...form,category:e.target.value})}>
        <option>Food</option>
        <option>Travel</option>
        <option>Bills</option>
      </select>
      <button>Add</button>
    </form>
  );
}