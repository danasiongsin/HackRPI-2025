import User from "../models/user.js";
import Icon from "../models/icon.js";

// GET /api/users/:id/icons
export const getUserIcons = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).populate("selectedIcons");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.selectedIcons);
  } catch (err) {
    console.error("Error fetching user icons:", err);
    res.status(500).json({ error: "Server error fetching user icons" });
  }
};

// POST /api/users/:id/select-icons
export const selectUserIcons = async (req, res) => {
  try {
    const { id } = req.params;
    const { iconIds } = req.body;

    if (!Array.isArray(iconIds)) {
      return res.status(400).json({ error: "iconIds must be an array" });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { selectedIcons: iconIds },
      { new: true }
    ).populate("selectedIcons");

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user.selectedIcons);
  } catch (err) {
    console.error("Error updating user icons:", err);
    res.status(500).json({ error: "Server error updating user icons" });
  }
};
