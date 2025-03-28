import express from "express";
import { uploadFile, getFiles, downloadFile, deleteFile } from "../controllers/fileController.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Upload file to project
router.post("/:projectId/upload", protect, upload.single("file"), uploadFile);

// Get all files for a project
router.get("/:projectId/files", protect, getFiles);

// Download a file
router.get("/download/:filename", protect, downloadFile);

// Delete a file
router.delete("/:fileId", protect, deleteFile);

export default router;
