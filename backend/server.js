import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./db/index.js";

import authRoutes from "./routes/auth.js";
import iconRoutes from "./routes/icons.js";
import userRoutes from "./routes/users.js"; // we'll add this file next if you haven't
import boardRoutes from "./routes/boards.js";

import { ensureDefaultCategories } from "./seed/defaultCategories.js";
import { ensureDefaultIcons } from "./seed/defaultIcons.js";

const app = express();

// connect to db + seed defaults
connectDB().then(async () => {
  await ensureDefaultCategories();
  await ensureDefaultIcons();
});

app.use(cors());
app.use(express.json());

// REGISTER ROUTES HERE
app.use("/api/auth", authRoutes);     // <-- FIX
app.use("/api/icons", iconRoutes);     // <-- FIX
app.use("/api/users", userRoutes);     // <-- FIX

// old board routes (optional)
app.use("/api/board", boardRoutes);

// start server
app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
