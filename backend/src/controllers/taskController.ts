import { Request, Response, RequestHandler } from "express";
import { Task, CreateTaskDTO, UpdateTaskDTO } from "@shared/types/task";

// TODO:Temporary in-memory storage, replace with DynamoDB later
let tasks: Task[] = [];

export const taskController = {
  // Get all tasks
  getAllTasks: (async (req: Request, res: Response) => {
    try {
      res.json(tasks);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch tasks" });
    }
  }) as RequestHandler,

  // Get a single task by ID
  getTaskById: (async (req: Request, res: Response) => {
    try {
      const task = tasks.find((t) => t.id === req.params.id);
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
      const newTask: Task = {
        ...taskData,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      tasks.push(newTask);
      res.status(201).json(newTask);
    } catch (error) {
      res.status(500).json({ error: "Failed to create task" });
    }
  }) as RequestHandler,

  // Update a task
  updateTask: (async (req: Request, res: Response) => {
    try {
      const taskData: UpdateTaskDTO = req.body;
      const taskIndex = tasks.findIndex((t) => t.id === req.params.id);

      if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
      }

      tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...taskData,
        updatedAt: new Date().toISOString(),
      };

      res.json(tasks[taskIndex]);
    } catch (error) {
      res.status(500).json({ error: "Failed to update task" });
    }
  }) as RequestHandler,

  // Delete a task
  deleteTask: (async (req: Request, res: Response) => {
    try {
      const taskIndex = tasks.findIndex((t) => t.id === req.params.id);

      if (taskIndex === -1) {
        return res.status(404).json({ error: "Task not found" });
      }

      tasks = tasks.filter((t) => t.id !== req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete task" });
    }
  }) as RequestHandler,
};
