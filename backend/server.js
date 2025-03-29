  import express from "express";
  import dotenv from "dotenv";
  import cors from "cors";
  import connectDB from "./config/db.js";
  import authRoutes from "./routes/authRoutes.js";
  import projectRoutes from "./routes/projectRoutes.js";
  import taskRoutes from "./routes/taskRoutes.js";
  import chatRoutes from "./routes/chatRoutes.js";
  import notificationRoutes from "./routes/notificationRoutes.js";
  import adminRoutes from "./routes/adminRoutes.js"
  import { Server } from "socket.io";
  import http from "http";
  import Chat from "./models/Chat.js";
  import cookieParser from "cookie-parser";
  import searchRoutes from "./routes/searchRoutes.js"
  import messageRoutes from "./routes/messageRoutes.js"
  import scheduleDeadlineReminders from "./utils/deadlineReminder.js";
  import fileRoutes from "./routes/fileRoutes.js";
  import path from "path";

  dotenv.config();

  connectDB();

  const app = express();
  const server = http.createServer(app);
  const io = new Server(server, { cors: { origin: "*" } });
  
  app.use(cookieParser())
  app.use(express.json());
  app.use("/uploads", express.static(path.join("uploads")));
  app.use(
    cors({
      origin: "https://pro-ject-1.onrender.com", // Correct frontend URL
      credentials: true, // Allow cookies and auth headers
      methods: ["GET", "POST", "PUT", "DELETE"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );
  

  // Routes
  app.use("/api/auth", authRoutes);
  app.use("/api/projects", projectRoutes);
  app.use("/api/tasks", taskRoutes);
  app.use("/api/chats", chatRoutes);
  app.use("/api/notifications", notificationRoutes);
  app.use("/api/admin",adminRoutes)
  app.use("/api/search",searchRoutes)
  app.use("/api/contact", messageRoutes);
  app.use("/api/files", fileRoutes);

  // Socket.io Setup

  io.on("connection", (socket) => {
  
    // Join the user's personal room (for notifications)
    socket.on("joinNotifications", (userId) => {
      socket.join(userId);
    });
  
    socket.on("joinChat", async (chatId) => {
      socket.join(chatId);
    });
  
    socket.on("sendMessage", async ({ chatId, message, sender }) => {
      const chat = await Chat.findOne({ projectId: chatId });
  
      if (!chat) return;
  
      const newMessage = { sender, text: message, timestamp: new Date() };
      chat.messages.push(newMessage);
      await chat.save();
  
      io.to(chatId).emit("receiveMessage", newMessage);
    });
  });
  
  scheduleDeadlineReminders()

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


  