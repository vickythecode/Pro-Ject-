import mongoose from "mongoose";

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  team: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  deadline:{type:Date,required:true}
}, { timestamps: true });

export default mongoose.model("Project", ProjectSchema);
