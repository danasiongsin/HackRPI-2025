import Category from "../models/category.js";

export const ensureDefaultCategories = async () => {
  const defaultCategories = [
    "Food",
    "Drinks",
    "Emotions",
    "Needs",
    "Actions",
    "Places",
    "People"
  ];

  for (const name of defaultCategories) {
    const exists = await Category.findOne({ name });
    if (!exists) {
      await Category.create({ name });
      console.log(`Created default category: ${name}`);
    }
  }
};
