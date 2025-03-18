export type Task = {
  id: string;
  title: string;
  description?: string;
  status: "TODO" | "IN_PROGRESS" | "COMPLETED";
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskDTO = Omit<Task, "id" | "createdAt" | "updatedAt">;
export type UpdateTaskDTO = Partial<CreateTaskDTO>;
