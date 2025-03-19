import { useState } from "react";
import { Task, CreateTaskDTO } from "@shared/types/task";
import { Input } from "@/shared/components/Input/Input";
import { Button } from "@/shared/components/Button/Button";
import { Dropdown } from "@/shared/components/Dropdown/Dropdown";

type TaskFormProps = {
  onSubmit: (data: CreateTaskDTO) => Promise<void>;
  initialData?: Partial<Task>;
  onCancel?: () => void;
  isSubmitting?: boolean;
};

const statusOptions = [
  { value: "TODO", label: "To Do" },
  { value: "IN_PROGRESS", label: "In Progress" },
  { value: "COMPLETED", label: "Completed" },
];

export function TaskForm({
  onSubmit,
  initialData,
  onCancel,
  isSubmitting = false,
}: TaskFormProps) {
  const [title, setTitle] = useState(initialData?.title ?? "");
  const [description, setDescription] = useState(
    initialData?.description ?? ""
  );
  const [status, setStatus] = useState<Task["status"]>(
    initialData?.status ?? "TODO"
  );
  const [error, setError] = useState<string | undefined>(undefined);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(undefined);

    try {
      await onSubmit({
        title,
        description,
        status,
      });
      // Reset form
      setTitle("");
      setDescription("");
      setStatus("TODO");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        error={error}
        disabled={isSubmitting}
      />
      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        disabled={isSubmitting}
      />
      <Dropdown
        label="Status"
        value={status}
        onChange={(value) => setStatus(value as Task["status"])}
        options={statusOptions}
        disabled={isSubmitting}
      />
      <div className="flex justify-end gap-2">
        {onCancel && (
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Saving...</span>
            </div>
          ) : (
            "Save Task"
          )}
        </Button>
      </div>
    </form>
  );
}
