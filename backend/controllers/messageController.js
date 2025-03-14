import Message from "../models/Message.js";

export const sendMessage = async (req, res) => {
  try {
    const { subject, message } = req.body;

    if (!subject || !message) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newMessage = new Message({
      user: req.user._id,
      subject,
      message,
    });

    await newMessage.save();
    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error sending message", error });
  }
};

export const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().populate("user", "name email");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: "Error fetching messages", error });
  }
};

export const deleteMessage = async (req, res) => {
    try {
      const message = await Message.findById(req.params.id);
      if (!message) {
        return res.status(404).json({ message: "Message not found" });
      }
  
      await message.deleteOne();
      res.json({ message: "Message deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting message", error });
    }
  };
  