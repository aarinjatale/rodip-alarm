import { useMemo } from "react";
import { formatAxisDate } from "../utils/date";

export function AlarmChart({ alarms }) {
  const buckets = useMemo(() => {
    const map = new Map();
    alarms.forEach((alarm) => {
      const key = alarm.timestamp.toISOString().slice(0, 10);
      map.set(key, (map.get(key) || 0) + 1);
    });

    return Array.from(map.entries())
      .map(([key, count]) => ({ date: new Date(`${key}T00:00:00`), count }))
      .sort((a, b) => a.date - b.date);
  }, [alarms]);

  const width = 980;
  const height = 300;
  const padding = { top: 28, right: 28, bottom: 56, left: 54 };
  const maxCount = Math.max(1, ...buckets.map((bucket) => bucket.count));
  const plotWidth = width - padding.left - padding.right;
  const plotHeight = height - padding.top - padding.bottom;

  const points = buckets.map((bucket, index) => {
    const x =
      buckets.length === 1
        ? padding.left + plotWidth / 2
        : padding.left + (index / (buckets.length - 1)) * plotWidth;
    const y = padding.top + plotHeight - (bucket.count / maxCount) * plotHeight;
    return { ...bucket, x, y };
  });

  const line = points.map((point) => `${point.x},${point.y}`).join(" ");
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((step) => Math.round(step * maxCount));
  const labelEvery = Math.max(1, Math.ceil(points.length / 6));

  return (
    <section className="panel chart-panel">
      <h2>Alarm Frequency</h2>
      {points.length === 0 ? (
        <div className="empty-state">No alarms found for the selected time period.</div>
      ) : (
        <div className="chart-scroll">
          <svg className="chart" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Alarm frequency chart">
            {yTicks.map((tick) => {
              const y = padding.top + plotHeight - (tick / maxCount) * plotHeight;
              return (
                <g key={`y-${tick}`}>
                  <line x1={padding.left} x2={width - padding.right} y1={y} y2={y} className="grid-line" />
                  <text x={padding.left - 14} y={y + 5} textAnchor="end" className="axis-label">
                    {tick}
                  </text>
                </g>
              );
            })}
            <line x1={padding.left} y1={padding.top} x2={padding.left} y2={height - padding.bottom} className="axis-line" />
            <line
              x1={padding.left}
              y1={height - padding.bottom}
              x2={width - padding.right}
              y2={height - padding.bottom}
              className="axis-line"
            />
            {line && <polyline points={line} className="chart-line" />}
            {points.map((point, index) => (
              <g key={point.date.toISOString()}>
                <circle cx={point.x} cy={point.y} r="5" className="chart-dot" />
                {index % labelEvery === 0 && (
                  <text x={point.x} y={height - 22} textAnchor="middle" className="axis-label">
                    {formatAxisDate(point.date)}
                  </text>
                )}
              </g>
            ))}
          </svg>
        </div>
      )}
    </section>
  );
}
