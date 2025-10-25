import { useEffect, useState } from "react";
import { getTasks, createTask, updateTask, deleteTask, toggleTask } from "./services/api";
import TaskForm from "./components/TaskForm.jsx";
import TaskFilter from "./components/TaskFilter.jsx";
import TaskCarousel from "./components/TaskCarousel.jsx";

// Normalize server -> UI schema; guarantee valid createdAt
function normalizeTasks(rows) {
  return (rows || []).map((t) => {
    const created =
      t.createdAt || t.created_at || new Date().toISOString(); // fallback to now

    return {
      id: t.id,
      title: t.title,
      description: t.description || "",
      completed: !!t.completed,
      createdAt: created, // always defined
      priority: t.priority || "medium",
    };
  });
}

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState(""); // "", "pending", "completed"
  const [q, setQ] = useState("");
  const [priority, setPriority] = useState("");
  const [sortBy, setSortBy] = useState("createdAt"); // prefer camelCase
  const [sortDir, setSortDir] = useState("desc");
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  async function load() {
    try {
      setErr("");
      setLoading(true);
      const data = await getTasks({ status, q, priority, sortBy, sortDir });
      setTasks(normalizeTasks(data));
    } catch (e) {
      setErr("Failed to load tasks. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [status, q, priority, sortBy, sortDir]);

  async function onCreate(data) {
    try {
      await createTask(data);
      load();
    } catch {
      setErr("Failed to create task.");
    }
  }
  async function onSave(id, data) {
    try {
      await updateTask(id, data);
      load();
    } catch {
      setErr("Failed to save task.");
    }
  }
  async function onDelete(id) {
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setErr("Failed to delete task.");
    }
  }
  async function onToggle(id) {
    // optimistic
    setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    try {
      await toggleTask(id);
    } catch {
      // rollback
      setTasks((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
      setErr("Failed to update status.");
    }
  }

  return (
    <div className="container">
      <h1>✅ Task Manager</h1>

      <TaskForm onCreate={onCreate} />

      <div className="card grid6">
        <input className="input" placeholder="Search..." value={q} onChange={e=>setQ(e.target.value)} />
        <TaskFilter status={status} onChange={setStatus} />
        <select className="input" value={priority} onChange={e=>setPriority(e.target.value)}>
          <option value="">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <select className="input" value={sortBy} onChange={e=>setSortBy(e.target.value)}>
          <option value="createdAt">Created date</option>
          <option value="priority">Priority</option>
          <option value="title">Title</option>
        </select>
        <select className="input" value={sortDir} onChange={e=>setSortDir(e.target.value)}>
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
        <button onClick={load}>Refresh</button>
      </div>

      {err && <div className="card field-hint error" style={{marginTop:8}}>{err}</div>}

      {loading ? (
        <div className="card">Loading…</div>
      ) : (
        <TaskCarousel tasks={tasks} onSave={onSave} onDelete={onDelete} onToggle={onToggle} />
      )}
    </div>
  );
}
