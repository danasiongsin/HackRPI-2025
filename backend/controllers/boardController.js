import Category from "../models/category.js";
import Button from "../models/button.js";

// GET all categories
export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching categories" });
  }
};

// GET buttons for a category
export const getButtonsByCategory = async (req, res) => {
  try {
    const buttons = await Button.find({ category_id: req.params.id });
    res.json(buttons);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error fetching buttons" });
  }
};

// CREATE a new button
export const createButton = async (req, res) => {
  try {
    const created = await Button.create(req.body);
    res.json(created);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error creating button" });
  }
};

// UPDATE a button
export const updateButton = async (req, res) => {
  try {
    const updated = await Button.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error updating button" });
  }
};

// DELETE a button
export const deleteButton = async (req, res) => {
  try {
    await Button.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error deleting button" });
  }
};
