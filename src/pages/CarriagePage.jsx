import { useMemo, useState } from "react";
import { AlarmChart } from "../components/AlarmChart";
import { AlarmHistory } from "../components/AlarmHistory";
import { Clock } from "../components/Clock";
import { FilterBar } from "../components/FilterBar";
import { carriageStats } from "../data/carriages";
import { formatInputDate } from "../utils/date";

export function CarriagePage({ id, alarmsByCarriage }) {
  const carriage = carriageStats.find((item) => item.id === id) || carriageStats[0];
  const [filter, setFilter] = useState("all");
  const [alarmName, setAlarmName] = useState("all");
  const [severity, setSeverity] = useState("all");
  const [from, setFrom] = useState(
    formatInputDate(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
  );
  const [to, setTo] = useState(formatInputDate(new Date()));

  const alarmOptions = useMemo(() => {
    const alarms = alarmsByCarriage[carriage.id] || [];
    return [...new Set(alarms.map((alarm) => alarm.message))].sort();
  }, [alarmsByCarriage, carriage.id]);

  const filteredAlarms = useMemo(() => {
    const alarms = alarmsByCarriage[carriage.id] || [];
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    let result = alarms;

    if (filter === "today") {
      result = result.filter((alarm) => alarm.timestamp >= startOfToday);
    }

    if (filter === "manual") {
      const fromDate = from ? new Date(from) : new Date(0);
      const toDate = to ? new Date(to) : new Date();

      result = result.filter(
        (alarm) => alarm.timestamp >= fromDate && alarm.timestamp <= toDate
      );
    }

    if (alarmName !== "all") {
      result = result.filter((alarm) => alarm.message === alarmName);
    }

    if (severity !== "all") {
      result = result.filter((alarm) => alarm.severity === severity);
    }

    return result;
  }, [alarmsByCarriage, carriage.id, filter, from, to, alarmName, severity]);

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
        <Clock />
      </header>

      <FilterBar
        filter={filter}
        setFilter={setFilter}
        from={from}
        setFrom={setFrom}
        to={to}
        setTo={setTo}
        alarmName={alarmName}
        setAlarmName={setAlarmName}
        alarmOptions={alarmOptions}
        severity={severity}
        setSeverity={setSeverity}
      />

      <AlarmChart alarms={filteredAlarms} />
      <AlarmHistory alarms={filteredAlarms} />
    </main>
  );
}