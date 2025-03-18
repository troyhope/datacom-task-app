import { Request, Response, RequestHandler } from "express";
import { Task, CreateTaskDTO, UpdateTaskDTO } from "@shared/types/task";
import { TaskService } from "../services/taskService";

const taskService = new TaskService();

// TODO:Temporary in-memory storage, replace with DynamoDB later
let tasks: Task[] = [];

export const taskController = {
  // Get all tasks
  getAllTasks: (async (req: Request, res: Response) => {
    try {
      const tasks = await taskService.getAllTasks();
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  }) as RequestHandler,

  // Get a single task by ID
  getTaskById: (async (req: Request, res: Response) => {
    try {
      const task = await taskService.getTaskById(req.params.id);
      if (!task) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.json(task);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch task" });
    }
  }) as RequestHandler,

  // Create a new task
  createTask: (async (req: Request, res: Response) => {
    try {
      const taskData: CreateTaskDTO = req.body;
      const newTask = await taskService.createTask(taskData);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: "Failed to create task" });
    }
  }) as RequestHandler,

  // Update a task
  updateTask: (async (req: Request, res: Response) => {
    try {
      const taskData: UpdateTaskDTO = req.body;
      const updatedTask = await taskService.updateTask(req.params.id, taskData);

      if (!updatedTask) {
        return res.status(404).json({ error: "Task not found" });
      }

      res.json(updatedTask);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  }) as RequestHandler,

  // Delete a task
  deleteTask: (async (req: Request, res: Response) => {
    try {
      const deleted = await taskService.deleteTask(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Task not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  }) as RequestHandler,
};
