import express from "express";
import {
  getUserIcons,
  selectUserIcons
} from "../controllers/userController.js";

const router = express.Router();

// GET user's selected icons
router.get("/:id/icons", getUserIcons);

// POST update selected icons
router.post("/:id/select-icons", selectUserIcons);

export default router;
