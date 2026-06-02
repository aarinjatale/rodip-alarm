export const carriageStats = [
  { id: 1, active: 10, total: 24 },
  { id: 2, active: 0, total: 12 },
  { id: 3, active: 4, total: 19 },
  { id: 4, active: 0, total: 20 },
  { id: 5, active: 3, total: 24 },
  { id: 6, active: 8, total: 23 },
  { id: 7, active: 0, total: 19 },
  { id: 8, active: 5, total: 18 },
  { id: 9, active: 0, total: 30 },
  { id: 10, active: 5, total: 30 },
  { id: 11, active: 7, total: 21 },
  { id: 12, active: 0, total: 27 },
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

function seeded(seed) {
  let value = seed % 2147483647;
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function generateAlarms() {
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