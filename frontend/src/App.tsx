import "./App.css";
import { ToastProvider } from "./shared/contexts/ToastContext";
import { TaskList } from "./features/tasks/components/TaskList";

function App() {
  return (
    <ToastProvider>
      <div className="min-h-screen">
        <div className="container mx-auto px-4 py-8 max-w-3xl">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Task Manager
          </h1>
          <TaskList />
        </div>
      </div>
    </ToastProvider>
  );
}

export default App;
