import { useState, useCallback } from "react";
import { Task, CreateTaskDTO, UpdateTaskDTO } from "@shared/types/task";
import { taskApi } from "../api/tasks";
import { useToast } from "@/shared/hooks/useToast";

export function useTasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const { showToast } = useToast();

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedTasks = await taskApi.list();
      setTasks(fetchedTasks);
    } catch (error) {
      showToast("Failed to fetch tasks", "error");
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  const createTask = useCallback(
    async (input: CreateTaskDTO) => {
      try {
        const newTask = await taskApi.create(input);
        setTasks((currentTasks) => [...currentTasks, newTask]);
        showToast("Task created successfully", "success");
        return newTask;
      } catch (error) {
        showToast("Failed to create task", "error");
        console.error("Error creating task:", error);
        throw error;
      }
    },
    [showToast]
  );

  const updateTask = useCallback(
    async (id: string, input: UpdateTaskDTO) => {
      try {
        const updatedTask = await taskApi.update(id, input);
        setTasks((currentTasks) =>
          currentTasks.map((task) => (task.id === id ? updatedTask : task))
        );

        if ("status" in input) {
          showToast(
            input.status === "COMPLETED"
              ? "Task marked as complete"
              : "Task status updated",
            "success"
          );
        } else {
          showToast("Task updated successfully", "success");
        }

        return updatedTask;
      } catch (error) {
        showToast("Failed to update task", "error");
        console.error("Error updating task:", error);
        throw error;
      }
    },
    [showToast]
  );

  const deleteTask = useCallback(
    async (id: string) => {
      try {
        await taskApi.delete(id);
        setTasks((currentTasks) =>
          currentTasks.filter((task) => task.id !== id)
        );
        showToast("Task deleted successfully", "success");
        return true;
      } catch (error) {
        showToast("Failed to delete task", "error");
        console.error("Error deleting task:", error);
        throw error;
      }
    },
    [showToast]
  );

  return {
    tasks,
    loading,
    createTask,
    updateTask,
    deleteTask,
    fetchTasks,
  };
}
