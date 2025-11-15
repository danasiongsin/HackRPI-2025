import express from "express";
import {
  getAllIcons,
  getIconsByCategory
} from "../controllers/iconController.js";

const router = express.Router();

router.get("/", getAllIcons);
router.get("/by-category/:categoryId", getIconsByCategory);

export default router;
