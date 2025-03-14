import express from "express";
import { sendMessage, getMessages , deleteMessage} from "../controllers/messageController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, sendMessage);
router.get("/", protect, isAdmin, getMessages);
router.delete("/:id", protect, isAdmin, deleteMessage);

export default router;
