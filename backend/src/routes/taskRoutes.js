import { Router } from "express";
import { body, param, query } from "express-validator";
import {
  listTasks,
  createTask,
  getTask,
  updateTask,
  deleteTask,
  markCompleted,
  analytics,
  seedDemoTasks,
} from "../controllers/taskController.js";
import { requireAuth } from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { TASK_PRIORITY, TASK_STATUS } from "../models/Task.js";

const router = Router();

router.use(requireAuth);

router.get(
  "/",
  [
    query("page").optional().isInt({ min: 1 }),
    query("limit").optional().isInt({ min: 1, max: 500 }),
    query("status").optional().isIn([...TASK_STATUS, "pending"]),
    query("priority").optional().isIn(TASK_PRIORITY),
    query("search").optional().trim(),
    query("sortBy").optional().isIn(["createdAt", "dueDate", "title", "priority", "status"]),
    query("order").optional().isIn(["asc", "desc"]),
  ],
  validate,
  listTasks
);

router.get("/analytics", analytics);

router.post("/seed-demo", seedDemoTasks);

router.post(
  "/",
  [
    body("title").trim().notEmpty(),
    body("description").optional().trim(),
    body("status").optional().isIn(TASK_STATUS),
    body("priority").optional().isIn(TASK_PRIORITY),
    body("dueDate").optional({ values: "null" }).isISO8601(),
    body("completed").optional().isBoolean(),
  ],
  validate,
  createTask
);

router.get("/:id", [param("id").isMongoId()], validate, getTask);

router.patch("/:id/complete", [param("id").isMongoId()], validate, markCompleted);

router.patch(
  "/:id",
  [
    param("id").isMongoId(),
    body("title").optional().trim().notEmpty(),
    body("description").optional().trim(),
    body("status").optional().isIn(TASK_STATUS),
    body("priority").optional().isIn(TASK_PRIORITY),
    body("dueDate").optional({ values: "null" }).isISO8601(),
    body("completed").optional().isBoolean(),
  ],
  validate,
  updateTask
);

router.delete("/:id", [param("id").isMongoId()], validate, deleteTask);

export default router;
