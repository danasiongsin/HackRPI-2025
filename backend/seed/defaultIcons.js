import Category from "../models/category.js";
import Icon from "../models/icon.js";

// Default icons grouped by category
const iconLibrary = {
  Food: ["Eat", "Snack"],
  Drinks: ["Drink", "Water", "Juice", "Milk"],
  Emotions: ["Happy", "Sad", "Angry", "Hot", "Cold", "Ok", "Hurt"],
  Needs: ["Bathroom", "Sleep", "More", "Stop", "Chair", "Drive", "iPad"],
  Actions: ["Go", "Come", "Play", "Drive", "Go", "Music", "Play", "Question", "Stop", "TV"],
  Places: ["Home", "School", "Park", "Outside"],
  People: ["Mother", "Father", "Dog", "Family"]
};

export const ensureDefaultIcons = async () => {
  for (const [categoryName, labels] of Object.entries(iconLibrary)) {
    const category = await Category.findOne({ name: categoryName });

    if (!category) {
      console.warn(`Category '${categoryName}' not found — skipping icons`);
      continue;
    }

    for (const label of labels) {
      const existing = await Icon.findOne({
        label,
        category: category._id
      });

      if (!existing) {

        // Convert label to filename:
        // "Happy" → "happy.png"
        // "More" → "more.png"
        const filename = `${label.toLowerCase()}.png`;

        await Icon.create({
          label,
          img_url: "",      // Add actual URLs later
          audio_url: "",
          category: category._id
        });

        console.log(`Created icon '${label}' in ${categoryName} with file '${filename}'`);
      }
    }
  }
};
