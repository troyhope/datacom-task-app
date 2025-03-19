import { Task } from "@shared/types/task";

type TaskStatusProps = {
  status: Task["status"];
};

const statusStyles = {
  TODO: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-800",
} as const;

export function TaskStatus({ status }: TaskStatusProps) {
  return (
    <span
      className={`
        inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
        ${statusStyles[status]}
      `}
    >
      {status.replace("_", " ")}
    </span>
  );
}
