import { carriageStats } from "../data/carriages";
import { Clock } from "../components/Clock";
import { Icon } from "../components/Icon";

export function Dashboard({ navigate }) {
  const activeCarriages = carriageStats.filter((carriage) => carriage.active > 0);
  const totalActive = activeCarriages.reduce((sum, carriage) => sum + carriage.active, 0);
  const totalAlarms = carriageStats.reduce((sum, carriage) => sum + carriage.total, 0);

  return (
    <main className="content dashboard-content">
      <header className="page-header dashboard-header">
        <div>
          <p className="eyebrow">Fleet Overview</p>
          <h1>Carriage Monitoring</h1>
          <p>Carriages with active alarms are shown below. All 13 carriages remain available in navigation.</p>
        </div>
        <div className="header-tools">
          <Clock />
          <div className="summary-strip" aria-label="Alarm summary">
            <span>
              <strong>{totalActive}</strong> active
            </span>
            <span>
              <strong>{totalAlarms}</strong> total
            </span>
          </div>
        </div>
      </header>

      <section className="card-grid" aria-label="Carriages with active alarms">
        {activeCarriages.map((carriage) => (
          <button
            key={carriage.id}
            className={`alarm-card ${carriage.active >= 6 ? "critical" : "warning"}`}
            onClick={() => navigate(`/carriage/${carriage.id}`)}
          >
            <span className="card-heading">
              <span>Carriage {carriage.id}</span>
              <Icon name="warning" />
            </span>
            <span className="metric-row">
              <span>Active alarms</span>
              <strong>{carriage.active}</strong>
            </span>
            <span className="metric-row">
              <span>Total alarms</span>
              <strong>{carriage.total}</strong>
            </span>
          </button>
        ))}
      </section>
    </main>
  );
}
