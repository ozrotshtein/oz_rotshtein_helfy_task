export const BASE = "http://localhost:4000";

export async function getTasks(params = {}) {
  const qs = new URLSearchParams(params).toString();
  const res = await fetch(`${BASE}/api/tasks${qs ? `?${qs}` : ""}`);
  if (!res.ok) throw new Error("Failed to load tasks");
  return res.json();
}

export const createTask = async (data) => {
  const res = await fetch(`${BASE}/api/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
};

export const updateTask = async (id, data) => {
  const res = await fetch(`${BASE}/api/tasks/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
};

export const deleteTask = async (id) => {
  const res = await fetch(`${BASE}/api/tasks/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Failed to delete task");
};

export const toggleTask = async (id) => {
  const res = await fetch(`${BASE}/api/tasks/${id}/toggle`, { method: "PATCH" });
  if (!res.ok) throw new Error("Failed to toggle task");
  return res.json();
};