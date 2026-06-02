export function FilterBar({
  filter,
  setFilter,
  from,
  setFrom,
  to,
  setTo,
  alarmName,
  setAlarmName,
  alarmOptions,
  severity,
  setSeverity
}) {
  return (
    <section className="filter-panel" aria-label="Alarm filters">
      <div className="filter-title">Filter by time</div>

      <div className="filter-row">
        {[
          ["all", "All Time"],
          ["today", "Today"],
          ["manual", "Manual Range"]
        ].map(([value, label]) => (
          <button
            key={value}
            type="button"
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
            <input
              type="datetime-local"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
            />
          </label>

          <label>
            <span>To</span>
            <input
              type="datetime-local"
              value={to}
              onChange={(event) => setTo(event.target.value)}
            />
          </label>
        </div>
      )}

      <div className="manual-fields">
        <label>
          <span>Alarm Name</span>
          <select
            value={alarmName}
            onChange={(event) => setAlarmName(event.target.value)}
          >
            <option value="all">All Alarms</option>
            {alarmOptions.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </select>
        </label>

        <label>
          <span>Severity</span>
          <select
            value={severity}
            onChange={(event) => setSeverity(event.target.value)}
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </label>
      </div>
    </section>
  );
}