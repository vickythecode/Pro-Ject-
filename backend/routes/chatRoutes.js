import express from "express";
import {  sendMessage, getOrCreateChat , getMessages } from "../controllers/chatController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();


router.post("/create", protect, getOrCreateChat);
router.post("/send", protect, sendMessage);
router.get("/:projectId", protect, getMessages);

export default router;
