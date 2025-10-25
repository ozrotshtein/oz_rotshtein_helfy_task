import { useState } from "react";

export default function TaskForm({ onCreate }) {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [prio, setPrio] = useState("medium");
  const [err, setErr] = useState("");

  function submit(e) {
    e.preventDefault();
    if (title.trim().length < 2) {
      setErr("Title must be at least 2 characters.");
      return;
    }
    onCreate({ title: title.trim(), description: desc.trim(), priority: prio });
    setTitle(""); setDesc(""); setPrio("medium"); setErr("");
  }

  return (
    <form className="card grid5" onSubmit={submit}>
      <input className="input" placeholder="Task title" value={title} onChange={e=>setTitle(e.target.value)} />
      <select className="input" value={prio} onChange={e=>setPrio(e.target.value)}>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>
      <input className="input" placeholder="Description (optional)" value={desc} onChange={e=>setDesc(e.target.value)} />
      <button type="submit" className="primary">Add</button>
      {err && <div className="field-hint error" style={{gridColumn:"1 / -1"}}>{err}</div>}
    </form>
  );
}
