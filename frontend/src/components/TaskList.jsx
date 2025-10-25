// src/components/TaskList.jsx
import TaskItem from "./TaskItem.jsx";

export default function TaskList({ tasks, onSave, onDelete, onToggle }) {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return <div className="card">No tasks found</div>;
  }
  return (
    <div className="list">
      {tasks.map((t) => (
        <TaskItem
          key={t.id}
          task={t}
          onSave={onSave}
          onDelete={onDelete}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
}
