export default function TaskFilter({ status, onChange }) {
  return (
    <div className="card grid6">
      <select className="input" value={status} onChange={e=>onChange(e.target.value)}>
        <option value="">All</option>
        <option value="pending">Open</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}
