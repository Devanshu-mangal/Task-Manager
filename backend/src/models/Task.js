import mongoose from "mongoose";

export const TASK_STATUS = ["todo", "in-progress", "done"];
export const TASK_PRIORITY = ["low", "medium", "high"];

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: TASK_STATUS,
      default: "todo",
    },
    priority: {
      type: String,
      enum: TASK_PRIORITY,
      default: "medium",
    },
    dueDate: { type: Date, default: null },
    completed: { type: Boolean, default: false },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

taskSchema.index({ user: 1, title: "text" });
taskSchema.index({ user: 1, status: 1 });
taskSchema.index({ user: 1, priority: 1 });
taskSchema.index({ user: 1, createdAt: -1 });

export const Task = mongoose.model("Task", taskSchema);
