export function FilterBar({ filter, setFilter, from, setFrom, to, setTo }) {
  return (
    <section className="filter-panel" aria-label="Alarm filters">
      <div className="filter-title">Filter by</div>
      <div className="filter-row">
        {[
          ["all", "All Time"],
          ["today", "Today"],
          ["manual", "Manual Range"]
        ].map(([value, label]) => (
          <button
            key={value}
            className={`filter-button ${filter === value ? "active" : ""}`}
            onClick={() => setFilter(value)}
          >
            {label}
          </button>
        ))}
      </div>
      {filter === "manual" && (
        <div className="manual-fields">
          <label>
            <span>From</span>
            <input type="datetime-local" value={from} onChange={(event) => setFrom(event.target.value)} />
          </label>
          <label>
            <span>To</span>
            <input type="datetime-local" value={to} onChange={(event) => setTo(event.target.value)} />
          </label>
        </div>
      )}
    </section>
  );
}
