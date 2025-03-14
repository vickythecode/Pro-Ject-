import express from "express";
import { registerUser, loginUser , logoutUser, getMe, getUsers ,profile} from "../controllers/authController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logoutUser);
router.get("/me", protect, getMe);
router.get("/",protect,getUsers)
router.put("/profile",protect,profile)

export default router;
