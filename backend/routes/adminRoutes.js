import express from "express";
import { getUsers, deleteUser, getProjects , deleteProject} from "../controllers/adminController.js";
import { protect, isAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/users", protect, isAdmin, getUsers);
router.delete("/users/:id", protect, isAdmin, deleteUser);
router.get("/projects", protect, isAdmin, getProjects);
router.delete("/projects/:id", protect, isAdmin, deleteProject);


export default router;
