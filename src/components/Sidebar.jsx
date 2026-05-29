import { carriageStats } from "../data/carriages";
import { Icon } from "./Icon";

export function Sidebar({
  route,
  navigate,
  theme,
  setTheme,
  isLoggedIn,
  setIsLoggedIn,
  collapsed,
  setCollapsed
}) {
  const activeCarriage = route.match(/^\/carriage\/(\d+)/)?.[1];

  const handleAuth = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      navigate("/login");
      return;
    }

    navigate("/login");
  };

  return (
    <aside className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      <div className="sidebar-title">
        <div>
          <span>RODIP System</span>
          <small>Carriage alarms</small>
        </div>
        <button
          className="icon-button collapse-button"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? "Expand navigation" : "Collapse navigation"}
          title={collapsed ? "Expand navigation" : "Collapse navigation"}
        >
          <Icon name={collapsed ? "expand" : "collapse"} />
        </button>
      </div>

      <nav className="nav-main" aria-label="Main navigation">
        <button
          className={`nav-item ${route === "/dashboard" ? "active" : ""}`}
          onClick={() => navigate("/dashboard")}
          title="Dashboard"
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
              title={`Carriage ${carriage.id}`}
              data-short={`C${carriage.id}`}
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
          title={theme === "dark" ? "Light Mode" : "Dark Mode"}
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} />
          <span>{theme === "dark" ? "Light Mode" : "Dark Mode"}</span>
        </button>
        <button className="nav-item" onClick={handleAuth} title={isLoggedIn ? "Logout" : "Login"}>
          <Icon name={isLoggedIn ? "logout" : "login"} />
          <span>{isLoggedIn ? "Logout" : "Login"}</span>
        </button>
      </div>
    </aside>
  );
}
