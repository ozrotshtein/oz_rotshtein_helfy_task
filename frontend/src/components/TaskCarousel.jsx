import { useEffect, useMemo, useRef, useState } from "react";
import TaskItem from "./TaskItem.jsx";

/**
 * Endless carousel without visible duplicates.
 * - Hooks are always called (no conditional early-return before hooks).
 * - When filtered list becomes empty, we render a safe empty state and stop animating.
 * - Rotates items via state when the first card exits the viewport.
 */
export default function TaskCarousel({ tasks, onSave, onDelete, onToggle, speed = 60 }) {
  const trackRef = useRef(null);
  const rafRef = useRef(0);

  const [paused, setPaused] = useState(false);
  const [order, setOrder] = useState([]);

  // Normalize incoming tasks -> array
  const base = useMemo(() => (Array.isArray(tasks) ? tasks : []), [tasks]);

  // Keep internal order in sync with the latest filtered list
  useEffect(() => {
    if (base.length === 0) {
      setOrder([]); // becomes empty safely
      return;
    }
    // preserve visible order when possible
    const ids = new Set(base.map((t) => t.id));
    const filtered = order.filter((t) => ids.has(t.id));
    const missing = base.filter((t) => !filtered.find((x) => x.id === t.id));
    setOrder(filtered.concat(missing));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [base.map((t) => t.id).join(",")]); // respond to structural changes only

  // rAF animation loop
  useEffect(() => {
    const track = trackRef.current;
    // If no slides or no track, ensure transform reset and do nothing
    if (!track || order.length === 0) {
      if (track) track.style.transform = "translateX(0px)";
      return;
    }

    let x = 0;
    let last = performance.now();

    const step = (now) => {
      const dt = (now - last) / 1000;
      last = now;

      if (!paused) {
        x -= speed * dt;

        const first = track.firstElementChild;
        if (first) {
          const rect = first.getBoundingClientRect?.();
          if (rect && rect.width) {
            const style = getComputedStyle(first);
            const mr = parseFloat(style.marginRight || "0");
            const firstWidth = rect.width + mr;

            // When first card fully leaves left edge, rotate
            if (-x >= firstWidth - 0.5) {
              x += firstWidth; // snap forward
              setOrder((prev) => {
                if (prev.length <= 1) return prev;
                const [head, ...rest] = prev;
                return [...rest, head];
              });
            }
          }
        }

        track.style.transform = `translateX(${x}px)`;
      }

      rafRef.current = requestAnimationFrame(step);
    };

    rafRef.current = requestAnimationFrame(step);
    return () => cancelAnimationFrame(rafRef.current);
  }, [order.length, paused, speed]);

  const onEnter = () => setPaused(true);
  const onLeave = () => setPaused(false);

  // Render
  return (
    <div
      className="carousel"
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
      onFocus={onEnter}
      onBlur={onLeave}
      aria-label="Tasks carousel endless auto-scrolling"
    >
      {order.length === 0 ? (
        <div className="carousel-track">
          <div className="carousel-card">
            <div className="card" style={{ padding: 24, textAlign: "center" }}>
              No task is found
            </div>
          </div>
        </div>
      ) : (
        <>
          <div className="carousel-track" ref={trackRef}>
            {order.map((t) => (
              <div className="carousel-card" key={t.id}>
                <TaskItem task={t} onSave={onSave} onDelete={onDelete} onToggle={onToggle} />
              </div>
            ))}
          </div>
          <div className="carousel-fade left" aria-hidden="true" />
          <div className="carousel-fade right" aria-hidden="true" />
        </>
      )}
    </div>
  );
}
