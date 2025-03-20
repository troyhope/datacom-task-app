import { Router } from "express";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
} from "../controllers/taskController";
import { validateTask } from "../middleware/validateTask";

const router = Router();

router.get("/", getAllTasks);
router.get("/:id", getTaskById);
router.post("/", validateTask, createTask);
router.put("/:id", validateTask, updateTask);
router.delete("/:id", deleteTask);

export default router;
