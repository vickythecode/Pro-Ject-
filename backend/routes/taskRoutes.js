import express from "express";
import { createTask, getTasks, updateTaskStatus,deleteTask , suggestTasks ,listAvailableModels} from "../controllers/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createTask);
router.get("/models", listAvailableModels);
router.get("/:projectId", protect, getTasks);
router.patch("/update-status", protect, updateTaskStatus);
router.delete("/:id", protect, deleteTask);
router.post("/suggest-tasks",suggestTasks)


export default router;
