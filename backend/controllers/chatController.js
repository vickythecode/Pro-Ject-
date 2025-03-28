import Chat from "../models/Chat.js";
import Notification from "../models/Notification.js";
import Project from "../models/Project.js";

// Get or create a chat for the project
export const getOrCreateChat = async (req, res) => {
  const { projectId } = req.body;

  try {
    let chat = await Chat.findOne({ projectId });

    if (!chat) {
      chat = await Chat.create({ projectId, messages: [] });
    }

    res.json(chat);
  } catch (error) {
    console.error("Error in getOrCreateChat:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  const { projectId, text, sender } = req.body;

  try {
    let chat = await Chat.findOne({ projectId });

    // Create chat if it does not exist
    if (!chat) {
      chat = await Chat.create({ projectId, messages: [] });
    }

    // Add new message
    const newMessage = { sender, text, timestamp: new Date() };
    chat.messages.push(newMessage);
    await chat.save();

    // Fetch the project to get team members and the owner
    const project = await Project.findById(projectId).populate("team owner");
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    // ✅ Collect all recipients (team + owner), excluding the sender
    const recipients = [project.owner, ...project.team].filter(
      (member) => member._id.toString() !== sender.toString()
    );

    // ✅ Send notifications to all recipients except the sender
    await Promise.all(
      recipients.map(async (user) => {
        // Check if the same notification already exists to prevent duplicates
        const existingNotification = await Notification.findOne({
          user: user._id,
          message: `New message in project "${project.name}" by ${req.user.name}: "${text}"`,
          read: false,
        });

        if (!existingNotification) {
          const notification = await Notification.create({
            user: user._id,
            message: `New message in project "${project.name}" by ${req.user.name}: "${text}"`,
          });

          // ✅ Emit real-time notification using WebSocket
          if (req.io) {
            req.io.to(user._id.toString()).emit("newNotification", notification);
          }
        }
      })
    );

    res.json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get messages for a project
export const getMessages = async (req, res) => {
  const { projectId } = req.params;

  try {
    const chat = await Chat.findOne({ projectId });

    if (!chat) {
      return res.json({ messages: [] });
    }

    res.json(chat.messages);
  } catch (error) {
    console.error("Error in getMessages:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
