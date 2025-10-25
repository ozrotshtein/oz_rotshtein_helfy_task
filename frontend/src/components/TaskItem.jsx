import { useState } from "react";

export default function TaskItem({ task, onSave, onDelete, onToggle }) {
  const [editing, setEditing] = useState(false);
  const [confirmDel, setConfirmDel] = useState(false);

  const [title, setTitle] = useState(task.title);
  const [desc, setDesc] = useState(task.description || "");
  const [prio, setPrio] = useState(task.priority || "medium");
  const [err, setErr] = useState("");

  // Safe date label without any dashes in UI
  const createdISO = task.createdAt || task.created_at || null;
  let createdLabel = "";
  if (createdISO) {
    const d = new Date(createdISO);
    if (!isNaN(d)) {
      createdLabel = d.toLocaleString(); // valid date only; otherwise empty
    }
  }

  const save = () => {
    if (title.trim().length < 2) {
      setErr("Title must be at least 2 characters.");
      return;
    }
    onSave(task.id, {
      title: title.trim(),
      description: desc.trim(),
      priority: prio,
      completed: task.completed,
    });
    setEditing(false);
    setErr("");
  };

  if (editing) {
    return (
      <div className="item editing">
        <div className="col-check">
          <input
            type="checkbox"
            checked={!!task.completed}
            onChange={() => onToggle(task.id)}
            aria-label={task.completed ? "Mark as pending" : "Mark as completed"}
          />
        </div>
        <div className="grow">
          <div className="edit-grid">
            <input
              className="input"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
            />
            <select className="input" value={prio} onChange={(e) => setPrio(e.target.value)}>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
            <input
              className="input"
              placeholder="Description (optional)"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>
          {err && <div className="field-hint error">{err}</div>}
        </div>
        <div className="actions">
          <button className="primary" onClick={save}>Save</button>
          <button className="ghost" onClick={() => setEditing(false)}>Cancel</button>
        </div>
      </div>
    );
  }

  return (
    <div className="item">
      <div className="col-check">
        <input
          type="checkbox"
          checked={!!task.completed}
          onChange={() => onToggle(task.id)}
          aria-label={task.completed ? "Mark as pending" : "Mark as completed"}
        />
      </div>

      <div className="grow">
        <div className={`title ${task.completed ? "done" : ""}`}>{task.title}</div>
        <div className="meta">
          <span className={`badge ${task.priority}`}>{task.priority}</span>
          {createdLabel && <span>Created: {createdLabel}</span>}
          {/* No dashes in UI: description shown plainly if present */}
          {task.description && <span>{task.description}</span>}
        </div>
      </div>

      <div className="actions">
        {confirmDel ? (
          <>
            <span className="muted" style={{marginRight:6}}>Confirm?</span>
            <button className="danger" onClick={() => onDelete(task.id)}>Yes</button>
            <button className="ghost" onClick={() => setConfirmDel(false)}>No</button>
          </>
        ) : (
          <>
            <button onClick={() => setEditing(true)}>Edit</button>
            <button className="danger" onClick={() => setConfirmDel(true)}>Delete</button>
          </>
        )}
      </div>
    </div>
  );
}
