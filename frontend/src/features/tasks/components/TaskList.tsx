import { useState, useEffect, useCallback } from "react";
import { TaskItem } from "./TaskItem";
import { TaskForm } from "./TaskForm";
import { useTasks } from "../hooks/useTasks";
import { Button } from "../../../shared/components/Button/Button";
import { CreateTaskDTO, Task } from "@shared/types/task";
import { Dropdown } from "@/shared/components/Dropdown/Dropdown";
import { usePagination } from "../hooks/usePagination";

const ITEMS_PER_PAGE = 6;

const statusFilterOptions = [
  { value: "ALL", label: "All Status" },
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

export function TaskList() {
  const { tasks, loading, createTask, updateTask, deleteTask, fetchTasks } =
    useTasks();
  const [isCreating, setIsCreating] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [statusFilter, setStatusFilter] = useState("ALL");

  const filteredTasks = tasks
    .slice() // Create a copy to avoid mutating the original array
    .sort((a, b) => parseInt(a.id) - parseInt(b.id)) // Ensure consistent order
    .filter((task) =>
      statusFilter === "ALL" ? true : task.status === statusFilter
    );

  const {
    currentPage,
    setCurrentPage,
    totalPages,
    startIndex,
    endIndex,
    hasNextPage,
    hasPreviousPage,
  } = usePagination({
    totalItems: filteredTasks.length,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  const paginatedTasks = filteredTasks.slice(startIndex, endIndex);

  // Only fetch tasks on initial mount
  useEffect(() => {
    fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Reset to first page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, setCurrentPage]);

  // Memoize these handlers to prevent recreating them on every render
  const handleCreateTask = useCallback(
    async (data: CreateTaskDTO) => {
      setIsSubmitting(true);
      try {
        await createTask(data);
        setIsCreating(false);
      } finally {
        setIsSubmitting(false);
      }
    },
    [createTask]
  );

  const handleUpdateTask = useCallback(
    async (id: string, status: Task["status"]) => {
      try {
        await updateTask(id, { status });
        if (editingTask?.id === id) {
          setEditingTask((prev) => (prev ? { ...prev, status } : null));
        }
      } catch (error) {
        console.error("Error updating task status:", error);
      }
    },
    [updateTask, editingTask]
  );

  const handleEditTask = useCallback(
    async (data: CreateTaskDTO) => {
      if (!editingTask) return;
      setIsSubmitting(true);
      try {
        await updateTask(editingTask.id, data);
        setEditingTask(null);
      } catch (error) {
        console.error("Error updating task:", error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [updateTask, editingTask]
  );

  const handleDeleteTask = useCallback(
    async (id: string) => {
      try {
        await deleteTask(id);
        if (editingTask?.id === id) {
          setEditingTask(null);
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
    },
    [deleteTask, editingTask]
  );

  // Only show the loading spinner on initial load, not on updates
  if (loading && tasks.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4 sm:px-0">
      {!isCreating && !editingTask ? (
        <Button
          variant="primary"
          onClick={() => setIsCreating(true)}
          className="w-full"
        >
          Add New Task
        </Button>
      ) : (
        <div className="space-y-2">
          <h2 className="text-lg font-medium text-gray-900">
            {editingTask ? "Edit Task" : "Create New Task"}
          </h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <TaskForm
              onSubmit={editingTask ? handleEditTask : handleCreateTask}
              onCancel={() => {
                setIsCreating(false);
                setEditingTask(null);
              }}
              isSubmitting={isSubmitting}
              initialData={editingTask || undefined}
            />
          </div>
        </div>
      )}

      <div className="space-y-2">
        {tasks.length > 0 && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-2 text-sm font-medium text-gray-700">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                <div>Tasks ({filteredTasks.length})</div>
                <div className="w-full sm:w-40">
                  <Dropdown
                    value={statusFilter}
                    onChange={setStatusFilter}
                    options={statusFilterOptions}
                    label=""
                  />
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-4">
                <div className="w-40 text-center">Status</div>
                <div className="min-w-[144px]">Actions</div>
              </div>
            </div>

            <div className="space-y-4">
              {paginatedTasks.map((task: Task) => (
                <div
                  key={task.id}
                  className="bg-white rounded-lg shadow-sm border border-gray-200 px-4 py-3"
                >
                  <TaskItem
                    task={task}
                    onUpdate={handleUpdateTask}
                    onDelete={handleDeleteTask}
                    onEdit={setEditingTask}
                  />
                </div>
              ))}
            </div>

            {filteredTasks.length > 0 && (
              <div className="flex justify-center items-center gap-2 pt-4">
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!hasPreviousPage}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages || 1}
                </span>
                <Button
                  variant="secondary"
                  size="small"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!hasNextPage}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}

        {filteredTasks.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            {tasks.length === 0
              ? 'No tasks yet. Click "Add New Task" to create one.'
              : "No tasks match the selected filter."}
          </div>
        )}
      </div>
    </div>
  );
}
