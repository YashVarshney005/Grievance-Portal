const express = require("express");
const {
  addExpense,
  getExpenses,
  getTotalExpense
} = require("../controllers/expenseController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

// 🔹 Add Expense
router.post("/", protect, addExpense);

// 🔹 Get All Expenses (with optional filter)
router.get("/", protect, getExpenses);

// 🔹 BONUS: Get Total Expense
router.get("/total", protect, getTotalExpense);

module.exports = router;