import Project from "../models/Project.js";
import User from "../models/User.js";

// 🔍 Search Projects
export const searchProjects = async (req, res) => {
  try {
    const { query } = req.query; // Extract search query from URL

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const projects = await Project.find({
      name: { $regex: query, $options: "i" }, // Case-insensitive search
    }).populate("owner", "name email");

    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error searching projects", error });
  }
};

// 🔍 Search Users
export const searchUsers = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ message: "Search query is required" });
    }

    const users = await User.find({
      name: { $regex: query, $options: "i" }, // Case-insensitive search
    }).select("name email");

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error searching users", error });
  }
};
