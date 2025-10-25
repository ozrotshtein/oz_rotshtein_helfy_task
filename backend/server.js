
import express from "express";
import cors from "cors";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// In-memory store
let tasks = []; // { id, title, description, due_date, priority, completed(0|1), createdAt }

// Helpers
const nextId = () => (tasks.at(-1)?.id ?? 0) + 1;
const validPriority = (p) => ["low", "medium", "high"].includes(p);
const toBool01 = (v) => (v === true || v === 1 || v === "1" || v === "true" ? 1 : 0);

// ============== API ==============

// GET /api/tasks
app.get("/api/tasks", (req, res) => {
  let rows = [...tasks];
  const { q, completed, priority, sortBy = "createdAt", sortDir = "desc", status } = req.query;

  if (q?.trim()) {
    const term = q.trim().toLowerCase();
    rows = rows.filter(
      (t) =>
        t.title.toLowerCase().includes(term) ||
        (t.description || "").toLowerCase().includes(term)
    );
  }

  if (status === "completed") rows = rows.filter((t) => t.completed === 1);
  else if (status === "pending") rows = rows.filter((t) => t.completed === 0);
  else if (completed === "1" || completed === "true") rows = rows.filter((t) => t.completed === 1);
  else if (completed === "0" || completed === "false") rows = rows.filter((t) => t.completed === 0);

  if (priority && validPriority(priority)) {
    rows = rows.filter((t) => t.priority === priority);
  }

  const allowedSort = ["createdAt", "due_date", "priority", "title"];
  const col = allowedSort.includes(sortBy) ? sortBy : "createdAt";
  const dir = String(sortDir).toLowerCase() === "asc" ? 1 : -1;

  rows.sort((a, b) => {
    const av = a[col] ?? "";
    const bv = b[col] ?? "";
    if (av === bv) return 0;
    return av > bv ? dir : -dir;
  });

  res.json(rows);
});

// POST /api/tasks
app.post("/api/tasks", (req, res) => {
  const { title, description = "", due_date = null, priority = "medium" } = req.body || {};
  if (!title || title.trim().length < 2)
    return res.status(400).json({ error: "Title must be at least 2 characters" });
  if (!validPriority(priority))
    return res.status(400).json({ error: "priority must be low|medium|high" });

  const now = new Date().toISOString();
  const task = {
    id: nextId(),
    title: title.trim(),
    description,
    due_date,
    priority,
    completed: 0,
    createdAt: now, // ✅ camelCase, always present
  };
  tasks.push(task);
  res.status(201).json(task);
});

// PUT /api/tasks/:id
app.put("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });

  const {
    title,
    description = "",
    due_date = null,
    priority = "medium",
    completed = 0,
    createdAt, // ignore if missing/invalid; we keep existing
  } = req.body || {};

  if (!title || title.trim().length < 2)
    return res.status(400).json({ error: "Title must be at least 2 characters" });
  if (!validPriority(priority))
    return res.status(400).json({ error: "priority must be low|medium|high" });

  const current = tasks[idx];
  tasks[idx] = {
    ...current,
    title: title.trim(),
    description,
    due_date,
    priority,
    completed: toBool01(completed),
    createdAt: createdAt || current.createdAt || new Date().toISOString(), // ensure it stays valid
  };

  res.json(tasks[idx]);
});

// DELETE /api/tasks/:id
app.delete("/api/tasks/:id", (req, res) => {
  const id = Number(req.params.id);
  const before = tasks.length;
  tasks = tasks.filter((t) => t.id !== id);
  if (tasks.length === before) return res.status(404).json({ error: "Not found" });
  res.status(204).end();
});

// PATCH /api/tasks/:id/toggle
app.patch("/api/tasks/:id/toggle", (req, res) => {
  const id = Number(req.params.id);
  const idx = tasks.findIndex((t) => t.id === id);
  if (idx === -1) return res.status(404).json({ error: "Not found" });
  tasks[idx] = { ...tasks[idx], completed: tasks[idx].completed ? 0 : 1 };
  res.json(tasks[idx]);
});

// ============ Static build (deployment) ============
const distPath = path.join(__dirname, "..", "frontend", "dist");
console.log("Serving static from:", distPath, "exists:", fs.existsSync(distPath));

app.use(express.static(distPath));
app.get("*", (req, res) => {
  res.sendFile(path.join(distPath, "index.html"));
});

app.listen(PORT, () => {
  console.log(`✅ Backend + UI on http://localhost:${PORT}`);
});
