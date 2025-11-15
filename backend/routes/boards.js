import express from "express";
import {
  getCategories,
  getButtonsByCategory,
  createButton,
  updateButton,
  deleteButton
} from "../controllers/boardController.js";

const router = express.Router();

router.get("/categories", getCategories);
router.get("/categories/:id/buttons", getButtonsByCategory);
router.post("/buttons", createButton);
router.put("/buttons/:id", updateButton);
router.delete("/buttons/:id", deleteButton);

export default router;
