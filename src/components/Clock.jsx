import { useClock } from "../hooks/useClock";

export function Clock() {
  const now = useClock();

  return (
    <div className="clock" aria-label="Current time">
      <span>Current time</span>
      <strong>{now.toLocaleTimeString("en-GB")}</strong>
      <small>{now.toISOString().slice(0, 10)}</small>
    </div>
  );
}
