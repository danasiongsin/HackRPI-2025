import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";

import connectDB from "./db/index.js";
import boardRoutes from "./routes/boards.js";
import { ensureDefaultCategories } from "./seed/defaultCategories.js";

const app = express();

connectDB().then(() => {
  ensureDefaultCategories();
});

app.use(cors());
app.use(express.json());

app.use("/api/board", boardRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
