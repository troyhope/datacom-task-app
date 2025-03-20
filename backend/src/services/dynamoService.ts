import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  DynamoDBDocumentClient,
  GetCommand,
  PutCommand,
  ScanCommand,
  UpdateCommand,
  DeleteCommand,
} from "@aws-sdk/lib-dynamodb";
import { Task } from "@shared/types/task";

// Log AWS configuration
console.log("AWS Region:", process.env.AWS_REGION || "ap-southeast-2");
console.log("Running in Lambda:", !!process.env.LAMBDA_TASK_ROOT);

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || "ap-southeast-2",
  // Only use profile in local development
  ...(process.env.NODE_ENV === "development" && {
    profile: process.env.AWS_PROFILE,
  }),
});

const docClient = DynamoDBDocumentClient.from(client);

export class DynamoService {
  private tableName: string;

  constructor() {
    // Log environment variables for debugging
    console.log("Environment:", {
      NODE_ENV: process.env.NODE_ENV,
      TASKS_TABLE: process.env.TASKS_TABLE,
      AWS_REGION: process.env.AWS_REGION,
      AWS_PROFILE: process.env.AWS_PROFILE,
      IS_LAMBDA: !!process.env.LAMBDA_TASK_ROOT,
    });

    this.tableName = process.env.TASKS_TABLE || "tasks";
    console.log("Using DynamoDB table:", this.tableName);
  }

  async getAllTasks(): Promise<Task[]> {
    try {
      console.log("Attempting to scan table:", this.tableName);
      console.log("AWS Configuration:", {
        region: process.env.AWS_REGION,
        isLambda: !!process.env.LAMBDA_TASK_ROOT,
        profile:
          process.env.NODE_ENV === "development"
            ? process.env.AWS_PROFILE
            : "not used in Lambda",
      });

      const command = new ScanCommand({
        TableName: this.tableName,
      });

      console.log("Sending ScanCommand to DynamoDB...");
      const response = await docClient.send(command);
      console.log("Scan response:", JSON.stringify(response, null, 2));
      return response.Items as Task[];
    } catch (error: any) {
      console.error("DynamoDB Scan error details:", {
        name: error?.name,
        message: error?.message,
        code: error?.code,
        stack: error?.stack,
        requestId: error?.$metadata?.requestId,
        cfId: error?.$metadata?.cfId,
        httpStatusCode: error?.$metadata?.httpStatusCode,
      });
      throw error;
    }
  }

  async getTaskById(id: string): Promise<Task | null> {
    try {
      const command = new GetCommand({
        TableName: this.tableName,
        Key: { id },
      });

      const response = await docClient.send(command);
      return (response.Item as Task) || null;
    } catch (error) {
      console.error("DynamoDB Get error:", error);
      throw error;
    }
  }

  async createTask(task: Omit<Task, "id">): Promise<Task> {
    try {
      const id = Date.now().toString();
      const newTask = { ...task, id };

      const command = new PutCommand({
        TableName: this.tableName,
        Item: newTask,
      });

      await docClient.send(command);
      return newTask;
    } catch (error) {
      console.error("DynamoDB Put error:", error);
      throw error;
    }
  }

  async updateTask(id: string, updates: Partial<Task>): Promise<Task | null> {
    try {
      const updateExpressions: string[] = [];
      const expressionAttributeNames: Record<string, string> = {};
      const expressionAttributeValues: Record<string, any> = {};

      Object.entries(updates).forEach(([key, value]) => {
        if (key !== "id") {
          updateExpressions.push(`#${key} = :${key}`);
          expressionAttributeNames[`#${key}`] = key;
          expressionAttributeValues[`:${key}`] = value;
        }
      });

      if (updateExpressions.length === 0) {
        return this.getTaskById(id);
      }

      const command = new UpdateCommand({
        TableName: this.tableName,
        Key: { id },
        UpdateExpression: `SET ${updateExpressions.join(", ")}`,
        ExpressionAttributeNames: expressionAttributeNames,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: "ALL_NEW",
      });

      const response = await docClient.send(command);
      return (response.Attributes as Task) || null;
    } catch (error) {
      console.error("DynamoDB Update error:", error);
      throw error;
    }
  }

  async deleteTask(id: string): Promise<boolean> {
    try {
      const command = new DeleteCommand({
        TableName: this.tableName,
        Key: { id },
        ReturnValues: "ALL_OLD",
      });

      const response = await docClient.send(command);
      return !!response.Attributes;
    } catch (error) {
      console.error("DynamoDB Delete error:", error);
      throw error;
    }
  }
}
