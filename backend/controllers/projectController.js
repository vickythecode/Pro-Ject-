import Project from "../models/Project.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { sendEmail } from "../utils/mailer.js";

// Create a new project
export const createProject = async (req, res) => {
  const { name, description ,deadline} = req.body;
  try {
    if (!deadline) {
      return res.status(400).json({ message: "Deadline is required" });
    }

    const project = await Project.create({ name, description, owner: req.user._id, team: [req.user._id],deadline: new Date(deadline), });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: "Error creating project", error });
  }
};

// Get projects owned by the authenticated user
export const getProjects = async (req, res) => {
  try {
    if (!req.user || !req.user._id) {
      return res.status(401).json({ message: "Not authorized" });
    }

    const projects = await Project.find({ team: req.user._id }).populate("team", "name email");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: "Error fetching projects", error });
  }
};


// Add a team member to a project

export const addTeamMember = async (req, res) => {
  const { projectName, userName } = req.body;

  try {
    const project = await Project.findOne({ name: projectName }).populate("team", "name");
    if (!project) return res.status(404).json({ message: "Project not found" });

    const user = await User.findOne({ name: userName });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (project.team.some((member) => member._id.toString() === user._id.toString())) {
      return res.status(400).json({ message: "User is already in the team" });
    }

    project.team.push(user._id);
    await project.save();

    // Notify the new team member via email
    const emailSubject = "You've been added to a project!";
    const emailMessage = `Hi ${user.name},\n\nYou have been added to the project "${project.name}".\n\nBest regards,\nProject Team`;

    sendEmail(user.email, emailSubject, emailMessage);

    // Notify the new team member
    const notification = await Notification.create({
      user: user._id,
      message: `You were added to project: ${project.name}`,
    });

    if (req.io) {
      req.io.to(user._id.toString()).emit("newNotification", notification);
    } else {
      console.warn("Socket.io instance (req.io) is undefined.");
    }

    res.json({ message: "User added to team and notified via email", project });
  } catch (error) {
    console.error("Error adding team member:", error);
    res.status(500).json({ message: "Error adding team member", error });
  }
};



// Delete a project (Only by the owner)
export const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Check if the logged-in user is the owner
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this project" });
    }

    await project.deleteOne();
    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting project", error });
  }
};

// Get project by ID
export const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
      .populate("owner", "name email")
      .populate("team", "name email");

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const updateProjectDetails = async (req, res) => {
  const { name, description, deadline } = req.body;

  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // Only the owner can update the project details
    if (project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this project" });
    }

    // Update project details
    if (name) project.name = name;
    if (description) project.description = description;
    if (deadline) project.deadline = new Date(deadline);

    await project.save();
    res.json({ message: "Project details updated successfully", project });
  } catch (error) {
    res.status(500).json({ message: "Error updating project details", error });
  }
};
