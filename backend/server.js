import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./db/index.js";

import authRoutes from "./routes/auth.js";
import iconRoutes from "./routes/icons.js";
import userRoutes from "./routes/users.js";
import boardRoutes from "./routes/boards.js";

import { ensureDefaultCategories } from "./seed/defaultCategories.js";
import { ensureDefaultIcons } from "./seed/defaultIcons.js";

const app = express();

// Connect to database + seed defaults
connectDB().then(async () => {
  await ensureDefaultCategories();
  await ensureDefaultIcons();
});

app.use(cors());
app.use(express.json());

// ✅ Correct static folder for images
// Everything inside backend/public/images is now served at /images/<filename>
app.use("/images", express.static("public/images"));

// ============================
//       API ROUTES
// ============================
app.use("/api/auth", authRoutes);
app.use("/api/icons", iconRoutes);
app.use("/api/users", userRoutes);
app.use("/api/board", boardRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
