import Notification from "../models/Notification.js";

export const createNotification = async (req, res) => {
  const { userId, message } = req.body;
  try {
    const notification = await Notification.create({ user: userId, message });

    // Emit notification via Socket.io
    req.io.to(userId.toString()).emit("newNotification", notification);

    res.status(201).json(notification);
  } catch (error) {
    res.status(500).json({ message: "Error creating notification", error });
  }
};


export const getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(50); // ✅ Limit results to prevent overload

    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: "Error fetching notifications", error });
  }
};


export const markAsRead = async (req, res) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    if (!notification) return res.status(404).json({ message: "Notification not found" });

    // ✅ Avoid double deletion by checking if notification still exists
    setTimeout(async () => {
      const existingNotification = await Notification.findById(req.params.id);
      if (existingNotification) {
        await Notification.findByIdAndDelete(req.params.id);
      }
    }, 30000);

    res.json({ message: "Notification marked as read and will be deleted soon" });
  } catch (error) {
    res.status(500).json({ message: "Error updating notification", error });
  }
};
