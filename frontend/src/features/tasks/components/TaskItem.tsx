import { useState } from "react";
import { Task } from "@shared/types/task";
import { Button } from "@/shared/components/Button/Button";
import { Dropdown } from "@/shared/components/Dropdown/Dropdown";
import { Modal } from "@/shared/components/Modal/Modal";
import { TaskDetails } from "./TaskDetails";
import { PencilIcon, TrashIcon } from "@heroicons/react/24/outline";

type TaskItemProps = {
  task: Task;
  onUpdate: (id: string, status: Task["status"]) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
};

const statusOptions = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

export function TaskItem({ task, onUpdate, onDelete, onEdit }: TaskItemProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const handleStatusChange = async (value: string) => {
    const newStatus = value as Task["status"];
    setIsUpdating(true);
    try {
      await onUpdate(task.id, newStatus);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(task.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0 cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="min-w-0">
          <div className="text-left text-base text-gray-900">{task.title}</div>
          {task.description && (
            <div className="text-left mt-1 text-sm text-gray-600">
              {task.description}
            </div>
          )}
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <div className="w-full sm:w-40">
            <Dropdown
              value={task.status}
              onChange={handleStatusChange}
              options={statusOptions}
              disabled={isUpdating}
              label=""
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="secondary"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                onEdit(task);
              }}
              className="flex-1 sm:flex-none min-w-[60px] gap-1"
            >
              <PencilIcon className="h-4 w-4" />
              <span className="sm:hidden">Edit</span>
            </Button>
            <Button
              variant="danger"
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
              }}
              disabled={isDeleting}
              className="flex-1 sm:flex-none min-w-[80px] gap-1"
            >
              {isDeleting ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <TrashIcon className="h-4 w-4" />
              )}
              <span className="sm:hidden">Delete</span>
            </Button>
          </div>
        </div>
      </div>

      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title="Task Details"
      >
        <TaskDetails task={task} />
      </Modal>
    </>
  );
}
