import { formatDateTime } from "../utils/date";

export function AlarmHistory({ alarms }) {
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
