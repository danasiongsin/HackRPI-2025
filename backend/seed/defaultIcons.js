import Category from "../models/category.js";
import Icon from "../models/icon.js";

// Default icons grouped by category
const iconLibrary = {
  Food: [
    { label: "Eat", file: "eat.png" },
    { label: "Drink", file: "drink.png" },
    { label: "Snack", file: "snack.png" }
  ],
  Drinks: [
    { label: "Water", file: "water.png" },
    { label: "Juice", file: "juice.png" },
    { label: "Milk", file: "milk.png" }
  ],
  Needs: [
    // { label: "Help", file: "help.png" },
    { label: "Bathroom", file: "bathroom.png" },
    // { label: "More", file: "more.png" },
    { label: "Stop", file: "stop.png" }
  ],
  Emotions: [
    {label: "Happy", file: "happy.png"}, 
    {label: "Sad", file: "sad.png"},
    {label: "Angry", file: "angry.png"}
  ],
  Actions: ["Go", "Come", "Play"],
  Places: ["Home", "School", "Outside"],
  People: ["Mom", "Dad", "Family"]
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
        await Icon.create({
          label,
          img_url: "",      // Add actual URLs later
          audio_url: "",
          category: category._id
        });

        console.log(`Created icon '${label}' in ${categoryName}`);
      }
    }
  }
};
