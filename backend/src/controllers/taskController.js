import mongoose from "mongoose";
import { demoDevTaskTemplates } from "../data/demoDevTasks.js";
import { Task } from "../models/Task.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const allowedSort = new Set(["createdAt", "dueDate", "title", "priority", "status"]);

/** ObjectId for aggregation $match (Mongoose aggregate does not cast query filters). */
function userIdForMatch(userId) {
  if (mongoose.Types.ObjectId.isValid(userId)) {
    return new mongoose.Types.ObjectId(String(userId));
  }
  return userId;
}

function buildFilter(userId, query) {
  const filter = { user: userId };
  if (query.status === "pending") {
    filter.status = { $in: ["todo", "in-progress"] };
  } else if (query.status) {
    filter.status = query.status;
  }
  if (query.priority) {
    filter.priority = query.priority;
  }
  if (query.search && String(query.search).trim()) {
    filter.title = { $regex: String(query.search).trim(), $options: "i" };
  }
  return filter;
}

export const listTasks = asyncHandler(async (req, res) => {
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(500, Math.max(1, parseInt(req.query.limit, 10) || 10));
  const skip = (page - 1) * limit;
  const sortField = allowedSort.has(req.query.sortBy) ? req.query.sortBy : "createdAt";
  const order = req.query.order === "asc" ? 1 : -1;
  const sort = { [sortField]: order };

  const filter = buildFilter(req.userId, req.query);
  const [items, total] = await Promise.all([
    Task.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Task.countDocuments(filter),
  ]);

  res.json({
    data: items,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
    },
  });
});

export const analytics = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const uid = userIdForMatch(userId);
  const [total, completedAgg, statusAgg, priorityAgg] = await Promise.all([
    Task.countDocuments({ user: userId }),
    Task.aggregate([
      { $match: { user: uid } },
      {
        $group: {
          _id: null,
          completed: {
            $sum: {
              $cond: [
                {
                  $or: [{ $eq: ["$status", "done"] }, { $eq: ["$completed", true] }],
                },
                1,
                0,
              ],
            },
          },
        },
      },
    ]),
    Task.aggregate([
      { $match: { user: uid } },
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]),
    Task.aggregate([
      { $match: { user: uid } },
      { $group: { _id: "$priority", count: { $sum: 1 } } },
    ]),
  ]);

  const completed = completedAgg[0]?.completed ?? 0;
  const pendingTasks = Math.max(0, total - completed);
  const completionPercentage = total === 0 ? 0 : Math.round((completed / total) * 100);

  const statusCounts = { todo: 0, "in-progress": 0, done: 0 };
  for (const row of statusAgg) {
    const key = row._id;
    if (key && Object.prototype.hasOwnProperty.call(statusCounts, key)) {
      statusCounts[key] = row.count;
    } else if (key) {
      statusCounts.todo += row.count;
    }
  }

  const priorityCounts = { low: 0, medium: 0, high: 0 };
  for (const row of priorityAgg) {
    const key = row._id;
    if (key && Object.prototype.hasOwnProperty.call(priorityCounts, key)) {
      priorityCounts[key] = row.count;
    } else if (key) {
      priorityCounts.medium += row.count;
    }
  }

  res.json({
    totalTasks: total,
    completedTasks: completed,
    pendingTasks,
    completionPercentage,
    statusCounts,
    priorityCounts,
  });
});

export const createTask = asyncHandler(async (req, res) => {
  const body = { ...req.body, user: req.userId };
  if (body.status === "done") {
    body.completed = true;
  }
  const task = await Task.create(body);
  res.status(201).json(task);
});

export const getTask = asyncHandler(async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, user: req.userId });
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(task);
});

export const updateTask = asyncHandler(async (req, res) => {
  const updates = { ...req.body };
  delete updates.user;
  if (updates.status === "done" || updates.completed === true) {
    updates.completed = true;
    updates.status = "done";
  }
  if (updates.status && updates.status !== "done" && updates.completed !== true) {
    updates.completed = false;
  }
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { $set: updates },
    { new: true, runValidators: true }
  );
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(task);
});

export const deleteTask = asyncHandler(async (req, res) => {
  const result = await Task.findOneAndDelete({ _id: req.params.id, user: req.userId });
  if (!result) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.status(204).send();
});

export const markCompleted = asyncHandler(async (req, res) => {
  const task = await Task.findOneAndUpdate(
    { _id: req.params.id, user: req.userId },
    { $set: { completed: true, status: "done" } },
    { new: true, runValidators: true }
  );
  if (!task) {
    return res.status(404).json({ message: "Task not found" });
  }
  res.json(task);
});

/** Insert 10 software-themed demo tasks for the authenticated user (testing / demos). */
export const seedDemoTasks = asyncHandler(async (req, res) => {
  const userId = req.userId;
  const now = new Date();
  const addDays = (base, n) => {
    const d = new Date(base);
    d.setDate(d.getDate() + n);
    return d;
  };
  const docs = demoDevTaskTemplates.map((t) => ({
    title: t.title,
    description: t.description,
    status: t.status,
    priority: t.priority,
    dueDate: addDays(now, t.daysDue),
    completed: t.status === "done",
    user: userId,
  }));
  const created = await Task.insertMany(docs);
  res.status(201).json({
    message: "Demo tasks created",
    count: created.length,
    data: created,
  });
});
