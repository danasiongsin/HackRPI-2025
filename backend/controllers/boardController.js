const Category = require("../models/Category");
const Button = require("../models/Button");

exports.getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

exports.getButtonsByCategory = async (req, res) => {
  const { id } = req.params;
  const buttons = await Button.find({ category_id: id });
  res.json(buttons);
};

exports.createButton = async (req, res) => {
  const button = await Button.create(req.body);
  res.json(button);
};

exports.updateButton = async (req, res) => {
  const updated = await Button.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(updated);
};

exports.deleteButton = async (req, res) => {
  await Button.findByIdAndDelete(req.params.id);
  res.json({ success: true });
};
