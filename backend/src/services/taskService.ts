import { Task, CreateTaskDTO } from "@shared/types/task";
import { DynamoService } from "./dynamoService";

export class TaskService {
  private dynamoService: DynamoService;

  constructor() {
    this.dynamoService = new DynamoService();
  }

  async getAllTasks(): Promise<Task[]> {
    try {
      return await this.dynamoService.getAllTasks();
    } catch (error) {
      console.error("Error fetching tasks:", error);
      throw new Error("Failed to fetch tasks");
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      const task = await this.dynamoService.getTaskById(id);
      if (!task) {
        throw new Error("Task not found");
      }
      return task;
    } catch (error) {
      console.error("Error fetching task:", error);
      throw new Error("Failed to fetch task");
    }
  }

  async createTask(taskData: CreateTaskDTO): Promise<Task> {
    try {
      const task = {
        ...taskData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      return await this.dynamoService.createTask(task);
    } catch (error) {
      console.error("Error creating task:", error);
      throw new Error("Failed to create task");
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      const task = await this.dynamoService.updateTask(id, updates);
      if (!task) {
        throw new Error("Task not found");
      }
      return task;
    } catch (error) {
      console.error("Error updating task:", error);
      throw new Error("Failed to update task");
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      const deleted = await this.dynamoService.deleteTask(id);
      if (!deleted) {
        throw new Error("Task not found");
      }
      return true;
    } catch (error) {
      console.error("Error deleting task:", error);
      throw new Error("Failed to delete task");
    }
  }
}
