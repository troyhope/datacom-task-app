import { Task } from "@shared/types/task";

type TaskDetailsProps = {
  task: Task;
};

export function TaskDetails({ task }: TaskDetailsProps) {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium text-gray-500">Title</h4>
        <p className="mt-1 text-gray-900">{task.title}</p>
      </div>
      {task.description && (
        <div>
          <h4 className="text-sm font-medium text-gray-500">Description</h4>
          <p className="mt-1 text-gray-900">{task.description}</p>
        </div>
      )}
      <div>
        <h4 className="text-sm font-medium text-gray-500">Status</h4>
        <p className="mt-1 text-gray-900">{task.status}</p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-500">Created</h4>
        <p className="mt-1 text-gray-900">
          {new Date(task.createdAt).toLocaleString()}
        </p>
      </div>
      <div>
        <h4 className="text-sm font-medium text-gray-500">Last Updated</h4>
        <p className="mt-1 text-gray-900">
          {new Date(task.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}
