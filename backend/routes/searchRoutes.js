import express from "express"
import { searchProjects, searchUsers } from "../controllers/searchController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router()

router.get("/projects", protect, searchProjects); // Search projects
router.get("/users", protect, searchUsers); // Search users

export default router;