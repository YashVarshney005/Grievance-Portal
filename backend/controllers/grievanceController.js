const Grievance = require("../models/Grievance");

// CREATE
exports.createGrievance = async (req, res) => {
  const grievance = await Grievance.create({
    user: req.user.id,
    ...req.body
  });
  res.status(201).json(grievance);
};

// GET ALL
exports.getGrievances = async (req, res) => {
  const data = await Grievance.find({ user: req.user.id });
  res.json(data);
};

// GET BY ID
exports.getGrievanceById = async (req, res) => {
  const data = await Grievance.findById(req.params.id);
  res.json(data);
};

// UPDATE
exports.updateGrievance = async (req, res) => {
  const updated = await Grievance.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );
  res.json(updated);
};

// DELETE
exports.deleteGrievance = async (req, res) => {
  await Grievance.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
};

// SEARCH
exports.searchGrievance = async (req, res) => {
  const { title } = req.query;
  const data = await Grievance.find({
    title: { $regex: title, $options: "i" }
  });
  res.json(data);
};