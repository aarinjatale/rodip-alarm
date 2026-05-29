import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { Sidebar } from "./components/Sidebar";
import { generateAlarms } from "./data/carriages";
import { useHashRoute } from "./hooks/useHashRoute";
import { CarriagePage } from "./pages/CarriagePage";
import { Dashboard } from "./pages/Dashboard";
import { LoginPage } from "./pages/LoginPage";
import "./styles.css";

function App() {
  const [route, navigate] = useHashRoute();
  const [theme, setTheme] = useState(() => localStorage.getItem("rodip-theme") || "light");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [collapsed, setCollapsed] = useState(() => localStorage.getItem("rodip-sidebar") === "collapsed");
  const alarmsByCarriage = useMemo(generateAlarms, []);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("rodip-theme", theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem("rodip-sidebar", collapsed ? "collapsed" : "expanded");
  }, [collapsed]);

  useEffect(() => {
    if (!isLoggedIn && route !== "/login") {
      navigate("/login");
    }
  }, [isLoggedIn, route, navigate]);

  const carriageMatch = route.match(/^\/carriage\/(\d+)/);
  const routeId = carriageMatch ? Number(carriageMatch[1]) : null;
  const appRoute = isLoggedIn ? route : "/login";

  return (
    <div className={`app-shell ${collapsed ? "nav-collapsed" : ""} ${!isLoggedIn ? "logged-out" : ""}`}>
      {isLoggedIn && (
        <Sidebar
          route={appRoute}
          navigate={navigate}
          theme={theme}
          setTheme={setTheme}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          collapsed={collapsed}
          setCollapsed={setCollapsed}
        />
      )}

      {appRoute === "/login" ? (
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
