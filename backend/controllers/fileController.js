// controllers/fileController.js
import Project from "../models/Project.js";
import File from "../models/File.js";
import Notification from "../models/Notification.js";
import path from "path";
import fs from "fs";

// ✅ Upload file to project
export const uploadFile = async (req, res) => {
  const { projectId } = req.params;
  const { originalname, filename } = req.file;
  const uploadedBy = req.user._id;

  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ Create file entry
    const file = await File.create({
      filename: originalname,
      filepath: filename,
      projectId,
      uploadedBy,
    });

    // ✅ Send notification to team members
    const recipients = [project.owner, ...project.team].filter(
      (member) => member.toString() !== uploadedBy.toString()
    );

    await Promise.all(
      recipients.map(async (user) => {
        const notification = await Notification.create({
          user,
          message: `New file "${originalname}" uploaded in project "${project.name}".`,
        });

        if (req.io) {
          req.io.to(user.toString()).emit("newNotification", notification);
        }
      })
    );

    res.status(201).json({ message: "File uploaded successfully!", file });
  } catch (error) {
    console.error("Error uploading file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Get all files for a project
export const getFiles = async (req, res) => {
  const { projectId } = req.params;

  try {
    const files = await File.find({ projectId }).populate("uploadedBy", "name");
    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// ✅ Download a file
export const downloadFile = async (req, res) => {
  const { filename } = req.params;
  const filePath = path.join("uploads", filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ message: "File not found" });
  }
};

// ✅ Delete a file
export const deleteFile = async (req, res) => {
  const { fileId } = req.params;

  try {
    const file = await File.findById(fileId);
    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    // Remove file from filesystem
    const filePath = path.join("uploads", file.filepath);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Delete file entry from DB
    await File.findByIdAndDelete(fileId);

    res.json({ message: "File deleted successfully!" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
