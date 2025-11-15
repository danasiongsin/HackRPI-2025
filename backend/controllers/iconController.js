import Icon from "../models/icon.js";  // note: lowercase 'icon.js' matches your file

export const getAllIcons = async (req, res) => {
  try {
    const icons = await Icon.find().populate("category");
    res.json(icons);
  } catch (err) {
    console.error("Error fetching icons:", err);
    res.status(500).json({ error: "Error fetching icons" });
  }
};

export const getIconsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const icons = await Icon.find({ category: categoryId }).populate("category");
    res.json(icons);
  } catch (err) {
    console.error("Error fetching icons by category:", err);
    res.status(500).json({ error: "Error fetching icons by category" });
  }
};
