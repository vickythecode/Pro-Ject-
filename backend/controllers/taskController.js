import Task from "../models/Task.js";
import Notification from "../models/Notification.js";
import User from "../models/User.js";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create Task with notification
export const createTask = async (req, res) => {
  const { title, description, project, assignedTo, dueDate } = req.body;

  try {
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser) return res.status(404).json({ message: "Assigned user not found" });

    const task = await Task.create({
      title,
      description,
      project,
      assignedTo,
      assignedBy: req.user.id,
      createdBy: req.user.id,
      dueDate,
    });

    const notification = await Notification.create({
      user: assignedUser._id,
      message: `You have been assigned a new task: "${title}" by ${req.user.name}`,
    });

    if (req.io) {
      req.io.to(assignedUser._id.toString()).emit("newNotification", notification);
    }

    res.status(201).json(task);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({ message: "Error creating task", error });
  }
};

// Get tasks for a project
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId })
      .populate("assignedTo", "name email")
      .populate("assignedBy", "name email");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Error fetching tasks", error });
  }
};

// Update Task Status with notification
export const updateTaskStatus = async (req, res) => {
  const { taskId, status } = req.body;
  const userId = req.user.id;

  try {
    const task = await Task.findById(taskId);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (task.assignedTo.toString() !== userId) {
      return res.status(403).json({ message: "Not authorized to update this task" });
    }

    task.status = status;
    await task.save();

    // Notify the task creator about the status update
    const taskCreator = await User.findById(task.createdBy);
    if (taskCreator) {
      const notification = await Notification.create({
        user: taskCreator._id,
        message: `Task "${task.title}" status updated to "${status}" by ${req.user.name}`,
      });

      if (req.io) {
        req.io.to(taskCreator._id.toString()).emit("newNotification", notification);
      }
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task", error });
  }
};

// Delete Task with notification
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate("project", "owner");

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    if (task.project.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this task" });
    }

    const taskAssignee = await User.findById(task.assignedTo);
    if (taskAssignee) {
      const notification = await Notification.create({
        user: taskAssignee._id,
        message: `Task "${task.title}" has been deleted by ${req.user.name}`,
      });

      if (req.io) {
        req.io.to(taskAssignee._id.toString()).emit("newNotification", notification);
      }
    }

    await task.deleteOne();
    res.json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting task", error });
  }
};


export const suggestTasks = async (req, res) => {
  const { projectTitle, projectDescription } = req.body;

  if (!projectTitle || !projectDescription) {
    return res.status(400).json({ message: "Project title and description are required." });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `For a project titled "${projectTitle}", which is about: "${projectDescription}", suggest a list of tasks with **titles and descriptions**. Format as JSON like this:
    \`\`\`json
    [
      {"title": "Task Title 1", "description": "Task Description 1"},
      {"title": "Task Title 2", "description": "Task Description 2"}
    ]
    \`\`\``;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    
    const rawText = response.text();
    const jsonMatch = rawText.match(/```json([\s\S]*?)```/); // Extract JSON inside ```json ... ```
    const jsonString = jsonMatch ? jsonMatch[1].trim() : rawText; // Use extracted JSON or raw text

    const tasks = JSON.parse(jsonString); // Parse AI response to JSON
    console.log(tasks);

    res.json({ tasks });
  } catch (error) {
    console.error("Error generating AI tasks:", error);
    res.status(500).json({ message: "Error generating AI tasks", error });
  }
};


export const listAvailableModels = async (req, res) => {
  try {
    const availableModels = [
      "gemini-1.0-pro",
      "gemini-1.5-pro",
      "gemini-1.5-flash",
      "gemini-2.0-flash",
    ]; // Update these based on the API documentation

    res.json({ models: availableModels });
  } catch (error) {
    console.error("Error listing models:", error);
    res.status(500).json({ message: "Error listing models", error });
  }
};

