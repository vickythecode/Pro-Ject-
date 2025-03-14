import express from "express";
import { createProject, getProjects, addTeamMember, deleteProject ,getProjectById,updateProjectDetails} from "../controllers/projectController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create", protect, createProject);
router.get("/", protect, getProjects);
router.post("/add-member", protect, addTeamMember);
router.delete("/:id", protect, deleteProject); // New route for deleting a project
router.get("/:id", protect, getProjectById);
router.put("/:id", protect,updateProjectDetails );

export default router;
