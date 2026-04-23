const express = require("express");
const router = express.Router();
const Grievance = require("../models/Grievance");
const protect = require("../middleware/authMiddleware");

/* ================= CREATE ================= */
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, category, status } = req.body;

    if (!title || !description) {
      return res.status(400).json({ msg: "Title and Description required" });
    }

    const grievance = await Grievance.create({
      user: req.user.id,
      title,
      description,
      category,
      status
    });

    res.status(201).json(grievance);
  } catch (err) {
    res.status(500).json({ msg: "Server error" });
  }
});

/* ================= SEARCH (MUST BE ABOVE :id) ================= */
router.get("/search", protect, async (req, res) => {
  try {
    const { title } = req.query;

    const results = await Grievance.find({
      user: req.user.id,
      title: { $regex: title || "", $options: "i" }
    }).sort({ date: -1 });

    res.json(results);
  } catch {
    res.status(500).json({ msg: "Search failed" });
  }
});

/* ================= GET ALL ================= */
router.get("/", protect, async (req, res) => {
  try {
    const data = await Grievance.find({ user: req.user.id })
      .sort({ date: -1 });

    res.json(data);
  } catch {
    res.status(500).json({ msg: "Fetch failed" });
  }
});

/* ================= GET BY ID ================= */
router.get("/:id", protect, async (req, res) => {
  try {
    const item = await Grievance.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: "Not found" });

    // 🔐 ownership check
    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    res.json(item);
  } catch {
    res.status(500).json({ msg: "Error fetching data" });
  }
});

/* ================= UPDATE ================= */
router.put("/:id", protect, async (req, res) => {
  try {
    let item = await Grievance.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: "Not found" });

    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    item = await Grievance.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json(item);
  } catch {
    res.status(500).json({ msg: "Update failed" });
  }
});

/* ================= DELETE ================= */
router.delete("/:id", protect, async (req, res) => {
  try {
    const item = await Grievance.findById(req.params.id);

    if (!item) return res.status(404).json({ msg: "Not found" });

    if (item.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    await item.deleteOne();

    res.json({ msg: "Deleted successfully" });
  } catch {
    res.status(500).json({ msg: "Delete failed" });
  }
});

module.exports = router;