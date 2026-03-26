/**
 * Seeds the database with one demo user and 10 demo tasks.
 * Usage: npm run seed (from backend/)
 */
import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "../src/config/db.js";
import { User } from "../src/models/User.js";
import { Task } from "../src/models/Task.js";

const DEMO_EMAIL = "demo@taskmanager.local";
const DEMO_PASSWORD = "Demo123!";
const DEMO_NAME = "Demo User";

const demoTasks = [
  { title: "Review project requirements", description: "Read scope and acceptance criteria.", status: "todo", priority: "high", daysDue: 1 },
  { title: "Draft API contract", description: "OpenAPI-style outline for team review.", status: "in-progress", priority: "high", daysDue: 2 },
  { title: "Set up CI pipeline", description: "Lint, test, build on push.", status: "todo", priority: "medium", daysDue: 3 },
  { title: "Write unit tests for auth", description: "Cover login and JWT middleware.", status: "in-progress", priority: "medium", daysDue: 5 },
  { title: "Design dashboard wireframes", description: "List and board views.", status: "done", priority: "low", daysDue: -2 },
  { title: "Document environment variables", description: "Backend and frontend .env examples.", status: "done", priority: "low", daysDue: -1 },
  { title: "Performance review bundle size", description: "Charts and kanban lazy chunks.", status: "todo", priority: "medium", daysDue: 7 },
  { title: "Stakeholder demo prep", description: "Seed data and happy path.", status: "in-progress", priority: "high", daysDue: 4 },
  { title: "Accessibility pass", description: "Keyboard and ARIA on forms.", status: "todo", priority: "low", daysDue: 10 },
  { title: "Deploy checklist", description: "CORS, health check, env vars.", status: "todo", priority: "medium", daysDue: 6 },
];

function addDays(base, n) {
  const d = new Date(base);
  d.setDate(d.getDate() + n);
  return d;
}

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error("MONGODB_URI is required. Copy .env.example to .env and set it.");
    process.exit(1);
  }
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is required for consistency with the app.");
    process.exit(1);
  }

  await connectDB();

  let user = await User.findOne({ email: DEMO_EMAIL });
  if (user) {
    await Task.deleteMany({ user: user._id });
    console.log("Cleared existing demo tasks for", DEMO_EMAIL);
  } else {
    const passwordHash = await bcrypt.hash(DEMO_PASSWORD, 12);
    user = await User.create({
      email: DEMO_EMAIL,
      name: DEMO_NAME,
      passwordHash,
    });
    console.log("Created demo user:", DEMO_EMAIL, "| password:", DEMO_PASSWORD);
  }

  const now = new Date();
  const tasks = demoTasks.map((t) => {
    const dueDate = addDays(now, t.daysDue);
    const completed = t.status === "done";
    return {
      title: t.title,
      description: t.description,
      status: t.status,
      priority: t.priority,
      dueDate,
      completed,
      user: user._id,
    };
  });

  await Task.insertMany(tasks);
  console.log(`Inserted ${tasks.length} demo tasks.`);
  console.log("Done.");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
