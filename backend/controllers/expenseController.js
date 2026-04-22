const Expense = require("../models/Expense");

// 🔹 Add Expense
exports.addExpense = async (req, res) => {
  try {
    const { title, amount, category } = req.body;

    // ✅ Basic validation
    if (!title || !amount || !category) {
      return res.status(400).json({
        message: "All fields (title, amount, category) are required"
      });
    }

    const expense = await Expense.create({
      user: req.user.id,
      title,
      amount,
      category
    });

    res.status(201).json({
      message: "Expense added successfully",
      expense
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Get Expenses (with filter)
exports.getExpenses = async (req, res) => {
  try {
    const filter = { user: req.user.id };

    // ✅ BONUS: Filter by category
    if (req.query.category) {
      filter.category = req.query.category;
    }

    const expenses = await Expense.find(filter).sort({ createdAt: -1 });

    res.json({
      count: expenses.length,
      expenses
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 BONUS: Get Total Expense
exports.getTotalExpense = async (req, res) => {
  try {
    const result = await Expense.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: null,
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json({
      total: result.length > 0 ? result[0].total : 0
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};