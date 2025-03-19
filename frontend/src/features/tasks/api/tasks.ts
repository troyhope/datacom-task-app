import api from "@/api/axios";
import { Task, CreateTaskDTO, UpdateTaskDTO } from "@shared/types/task";

const TASKS_API = {
  list: "/tasks",
  create: "/tasks",
  update: (id: string) => `/tasks/${id}`,
  delete: (id: string) => `/tasks/${id}`,
  getById: (id: string) => `/tasks/${id}`,
} as const;

export const taskApi = {
  list: async (): Promise<Task[]> => {
    const response = await api.get<Task[]>(TASKS_API.list);
    return response.data;
  },

  getTaskById: async (id: string): Promise<Task> => {
    const response = await api.get<Task>(TASKS_API.getById(id));
    return response.data;
  },

  create: async (input: CreateTaskDTO): Promise<Task> => {
    const response = await api.post<Task>(TASKS_API.create, input);
    return response.data;
  },

  update: async (id: string, input: UpdateTaskDTO): Promise<Task> => {
    const response = await api.put<Task>(TASKS_API.update(id), input);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(TASKS_API.delete(id));
  },
};
