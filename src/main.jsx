import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";

const carriageStats = [
  { id: 1, active: 10, total: 24 },
  { id: 2, active: 2, total: 12 },
  { id: 3, active: 4, total: 19 },
  { id: 4, active: 6, total: 20 },
  { id: 5, active: 3, total: 24 },
  { id: 6, active: 8, total: 23 },
  { id: 7, active: 4, total: 19 },
  { id: 8, active: 5, total: 18 },
  { id: 9, active: 5, total: 30 },
  { id: 10, active: 5, total: 30 },
  { id: 11, active: 7, total: 21 },
  { id: 12, active: 9, total: 27 },
  { id: 13, active: 10, total: 39 }
];

const alarmMessages = [
  "Communication error",
  "Smoke detector triggered",
  "Air conditioning failure",
  "Ventilation system fault",
  "Door sensor malfunction",
  "Temperature exceeded threshold",
  "Brake sensor warning",
  "Power module fluctuation"
];

const severities = ["critical", "warning", "info"];

function seeded(seed) {
  let value = seed % 2147483647;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

function generateAlarms() {
  const now = new Date();
  return carriageStats.reduce((acc, carriage) => {
    const random = seeded(carriage.id * 4099);
    const rows = [];

    for (let index = 0; index < carriage.total; index += 1) {
      const minutesBack = Math.floor(random() * 60 * 24 * 31);
      const timestamp = new Date(now.getTime() - minutesBack * 60 * 1000);
      const isActive = index < carriage.active;
      const severity =
        random() > 0.72 ? "critical" : random() > 0.38 ? "warning" : "info";

      rows.push({
        id: `${carriage.id}-${index}`,
        timestamp,
        severity,
        message: alarmMessages[Math.floor(random() * alarmMessages.length)],
        status: isActive ? "Active" : "Resolved"
      });
    }

    acc[carriage.id] = rows.sort((a, b) => b.timestamp - a.timestamp);
    return acc;
  }, {});
}

function useHashRoute() {
  const readRoute = () => window.location.hash.replace("#", "") || "/dashboard";
  const [route, setRoute] = useState(readRoute);

  useEffect(() => {
    const onHashChange = () => setRoute(readRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = (nextRoute) => {
    window.location.hash = nextRoute;
  };

  return [route, navigate];
}

function useClock() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  return now;
}

function formatDateTime(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function formatInputDate(date) {
  const pad = (value) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(
    date.getHours()
  )}:${pad(date.getMinutes())}`;
}

function formatAxisDate(date) {
  return date.toLocaleDateString("en-US", { month: "2-digit", day: "2-digit" });
}

function Icon({ name }) {
  const common = {
    width: 22,
    height: 22,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 2,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true"
  };

  const paths = {
    activity: (
      <>
        <path d="M22 12h-4l-3 8-6-16-3 8H2" />
      </>
    ),
    warning: (
      <>
        <path d="M10.3 3.9 1.8 18.1A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.9L13.7 3.9a2 2 0 0 0-3.4 0Z" />
        <path d="M12 9v4" />
        <path d="M12 17h.01" />
      </>
    ),
    moon: (
      <path d="M20.8 14.7A8 8 0 0 1 9.3 3.2 7 7 0 1 0 20.8 14.7Z" />
    ),
    sun: (
      <>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
      </>
    ),
    login: (
      <>
        <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
        <path d="M10 17l5-5-5-5" />
        <path d="M15 12H3" />
      </>
    ),
    logout: (
      <>
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
        <path d="M16 17l5-5-5-5" />
        <path d="M21 12H9" />
      </>
    ),
    mail: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </>
    ),
    lock: (
      <>
        <rect x="4" y="10" width="16" height="11" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </>
    )
  };

  return <svg {...common}>{paths[name]}</svg>;
}

function Sidebar({ route, navigate, theme, setTheme, isLoggedIn, setIsLoggedIn }) {
  const activeCarriage = route.match(/^\/carriage\/(\d+)/)?.[1];

  const handleAuth = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      navigate("/dashboard");
      return;
    }
    navigate("/login");
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-title">
        <span>RODIP System</span>
        <small>Carriage alarms</small>
      </div>

      <nav className="nav-main" aria-label="Main navigation">
        <button
          className={`nav-item ${route === "/dashboard" ? "active" : ""}`}
          onClick={() => navigate("/dashboard")}
        >
          <Icon name="activity" />
          <span>Dashboard</span>
        </button>

        <div className="nav-section">Carriages</div>
        <div className="carriage-list">
          {carriageStats.map((carriage) => (
            <button
              key={carriage.id}
              className={`nav-item carriage-nav ${
                Number(activeCarriage) === carriage.id ? "active" : ""
              }`}
              onClick={() => navigate(`/carriage/${carriage.id}`)}
            >
              <span>Carriage {carriage.id}</span>
              <strong>{carriage.active}</strong>
            </button>
          ))}
        </div>
      </nav>

      <div className="sidebar-actions">
        <button
          className="nav-item"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle dark mode"
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} />
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <button className="nav-item" onClick={handleAuth}>
          <Icon name={isLoggedIn ? "logout" : "login"} />
          <span>{isLoggedIn ? "Logout" : "Login"}</span>
        </button>
      </div>
    </aside>
  );
}

function Dashboard({ navigate }) {
  const totalActive = carriageStats.reduce((sum, carriage) => sum + carriage.active, 0);
  const totalAlarms = carriageStats.reduce((sum, carriage) => sum + carriage.total, 0);

  return (
    <main className="content dashboard-content">
      <header className="page-header">
        <div>
          <p className="eyebrow">Fleet Overview</p>
          <h1>Carriage Monitoring</h1>
          <p>Real-time alarm status across all 13 carriages.</p>
        </div>
        <div className="summary-strip" aria-label="Alarm summary">
          <span>
            <strong>{totalActive}</strong> active
          </span>
          <span>
            <strong>{totalAlarms}</strong> total
          </span>
        </div>
      </header>

      <section className="card-grid" aria-label="Carriage alarm cards">
        {carriageStats.map((carriage) => (
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

function FilterBar({ filter, setFilter, from, setFrom, to, setTo }) {
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

function AlarmChart({ alarms }) {
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
          <line
            x1={padding.left}
            y1={padding.top}
            x2={padding.left}
            y2={height - padding.bottom}
            className="axis-line"
          />
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
      )}
    </section>
  );
}

function AlarmHistory({ alarms }) {
  return (
    <section className="panel history-panel">
      <h2>Alarm History</h2>
      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Severity</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {alarms.map((alarm) => (
              <tr key={alarm.id}>
                <td className="mono">{formatDateTime(alarm.timestamp)}</td>
                <td>
                  <span className={`badge ${alarm.severity}`}>{alarm.severity}</span>
                </td>
                <td>{alarm.message}</td>
                <td className={alarm.status === "Active" ? "status-active" : "status-muted"}>
                  {alarm.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function CarriagePage({ id, alarmsByCarriage }) {
  const carriage = carriageStats.find((item) => item.id === id) || carriageStats[0];
  const now = useClock();
  const [filter, setFilter] = useState("all");
  const [from, setFrom] = useState(formatInputDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)));
  const [to, setTo] = useState(formatInputDate(new Date()));

  const filteredAlarms = useMemo(() => {
    const alarms = alarmsByCarriage[carriage.id] || [];
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    if (filter === "today") {
      return alarms.filter((alarm) => alarm.timestamp >= startOfToday);
    }

    if (filter === "manual") {
      const fromDate = from ? new Date(from) : new Date(0);
      const toDate = to ? new Date(to) : new Date();
      return alarms.filter((alarm) => alarm.timestamp >= fromDate && alarm.timestamp <= toDate);
    }

    return alarms;
  }, [alarmsByCarriage, carriage.id, filter, from, to]);

  return (
    <main className="content detail-content">
      <header className="page-header detail-header">
        <div>
          <p className="eyebrow">Carriage Detail</p>
          <h1>Carriage {carriage.id}</h1>
          <p>
            {carriage.active} active alarms • {carriage.total} total alarms
          </p>
        </div>
        <div className="clock" aria-label="Current time">
          <span>Current time</span>
          <strong>{now.toLocaleTimeString("en-GB")}</strong>
          <small>{now.toISOString().slice(0, 10)}</small>
        </div>
      </header>

      <FilterBar filter={filter} setFilter={setFilter} from={from} setFrom={setFrom} to={to} setTo={setTo} />
      <AlarmChart alarms={filteredAlarms} />
      <AlarmHistory alarms={filteredAlarms} />
    </main>
  );
}

function LoginPage({ setIsLoggedIn, navigate }) {
  const [email, setEmail] = useState("admin@rodip.com");
  const [password, setPassword] = useState("admin123");

  const submit = (event) => {
    event.preventDefault();
    setIsLoggedIn(true);
    navigate("/dashboard");
  };

  return (
    <main className="content login-content">
      <form className="login-card" onSubmit={submit}>
        <div className="login-heading">
          <h1>Sign In</h1>
          <p>Access the carriage monitoring system.</p>
        </div>
        <label className="field">
          <span>Email</span>
          <div className="input-shell">
            <Icon name="mail" />
            <input value={email} onChange={(event) => setEmail(event.target.value)} type="email" />
          </div>
        </label>
        <label className="field">
          <span>Password</span>
          <div className="input-shell">
            <Icon name="lock" />
            <input value={password} onChange={(event) => setPassword(event.target.value)} type="password" />
          </div>
        </label>
        <button className="primary-button" type="submit">
          Sign In
        </button>
        <div className="credential-note">Default credentials: admin@rodip.com / admin123</div>
      </form>
    </main>
  );
}

function App() {
  const [route, navigate] = useHashRoute();
  const [theme, setTheme] = useState(() => localStorage.getItem("rodip-theme") || "light");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const alarmsByCarriage = useMemo(generateAlarms, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("rodip-theme", theme);
  }, [theme]);

  const carriageMatch = route.match(/^\/carriage\/(\d+)/);
  const routeId = carriageMatch ? Number(carriageMatch[1]) : null;

  return (
    <div className="app-shell">
      <Sidebar
        route={route}
        navigate={navigate}
        theme={theme}
        setTheme={setTheme}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      {route === "/login" ? (
        <LoginPage setIsLoggedIn={setIsLoggedIn} navigate={navigate} />
      ) : routeId ? (
        <CarriagePage id={routeId} alarmsByCarriage={alarmsByCarriage} />
      ) : (
        <Dashboard navigate={navigate} />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
