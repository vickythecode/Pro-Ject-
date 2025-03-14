// models/Task.js
import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // NEW FIELD
    status: { type: String, enum: ["pending", "in progress", "completed"], default: "pending" },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.model("Task", TaskSchema);