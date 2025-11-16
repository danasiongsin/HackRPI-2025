import express from "express";
import { sendButtonClickEmail } from "../controllers/emailController.js";

const router = express.Router();

router.post("/send", sendButtonClickEmail);

export default router;