import cron from "node-cron";
import Project from "../models/Project.js";
import User from "../models/User.js";
import Notification from "../models/Notification.js";
import { sendEmail } from "./mailer.js";

const scheduleDeadlineReminders = () => {
  cron.schedule("0 0 * * *", async () => {
    try {
      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      tomorrow.setHours(0, 0, 0, 0);

      // Find projects with a deadline tomorrow
      const projects = await Project.find({
        deadline: { $gte: tomorrow, $lt: new Date(tomorrow.getTime() + 86400000) },
      }).populate("team", "name email");

      for (const project of projects) {
        for (const member of project.team) {
          // Create a notification
          await Notification.create({
            user: member._id,
            message: `Reminder: The deadline for project "${project.name}" is tomorrow!`,
          });

          // Send an email reminder
          const subject = `Reminder: Project Deadline Approaching`;
          const message = `Hi ${member.name},\n\nThis is a reminder that the deadline for the project "${project.name}" is tomorrow.\n\nBest regards,\nProject Management Team`;

          sendEmail(member.email, subject, message);
        }
      }

      console.log("Deadline reminders sent successfully.");
    } catch (error) {
      console.error("Error sending deadline reminders:", error);
    }
  });
};

export default scheduleDeadlineReminders;
