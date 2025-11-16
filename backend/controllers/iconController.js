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

// GET icons for a category, include full img_url that points at /images/<filename>
export const getIconsByCategory = async (req, res) => {
  try {
    const categoryId = req.params.categoryId || req.params.id;

    const icons = await Icon.find({ category: categoryId }).lean();

    const host = `${req.protocol}://${req.get("host")}`;

    const iconsWithUrl = icons.map((icon) => {
      // Use img_url if it exists and is not empty, otherwise construct from label
      let finalImgUrl = icon.img_url;

      if (!finalImgUrl || finalImgUrl === "") {
        // Convert label to lowercase and add .png (e.g., "Sleep" → "sleep.png")
        const filename = icon.label.toLowerCase() + ".png";
        finalImgUrl = `${host}/images/${encodeURIComponent(filename)}`;
      }

      return {
        ...icon,
        img_url: finalImgUrl
      };
    });

    console.debug(`[iconController] Returning ${iconsWithUrl.length} icons with img_urls`);
    res.json(iconsWithUrl);
  } catch (err) {
    console.error("Error fetching icons by category:", err);
    res.status(500).json({ error: "Error fetching icons" });
  }
};
