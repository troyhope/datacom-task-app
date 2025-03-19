import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { Task, CreateTaskDTO, UpdateTaskDTO } from "@shared/types/task";
import { dynamoClient, TABLE_NAME } from "../config/dynamodb";

const docClient = DynamoDBDocumentClient.from(dynamoClient);

export class TaskService {
  async getAllTasks(): Promise<Task[]> {
    const command = new ScanCommand({
      TableName: TABLE_NAME,
    });

    const response = await docClient.send(command);
    const tasks = (response.Items || []) as Task[];

    // Sort tasks by id (which is a timestamp) in ascending order
    return tasks.sort((a, b) => parseInt(a.id) - parseInt(b.id));
  }

  async getTaskById(id: string): Promise<Task | null> {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });

    const response = await docClient.send(command);
    return (response.Item as Task) || null;
  }

  async createTask(taskData: CreateTaskDTO): Promise<Task> {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: newTask,
    });

    await docClient.send(command);
    return newTask;
  }

  async updateTask(id: string, taskData: UpdateTaskDTO): Promise<Task | null> {
    const existingTask = await this.getTaskById(id);
    if (!existingTask) return null;

    const updatedTask: Task = {
      ...existingTask,
      ...taskData,
      updatedAt: new Date().toISOString(),
    };

    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: updatedTask,
    });

    await docClient.send(command);
    return updatedTask;
  }

  async deleteTask(id: string): Promise<boolean> {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: { id },
    });

    await docClient.send(command);
    return true;
  }
}
