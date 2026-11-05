const NEPAL_TIME_ZONE = "Asia/Kathmandu";
const NEPAL_UTC_OFFSET_MINUTES = 5 * 60 + 45;
const nepalDateFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: NEPAL_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

export function getNepalDateKey(value = new Date()) {
  const parts = nepalDateFormatter.formatToParts(new Date(value));
  const dateParts = Object.fromEntries(
    parts.filter((part) => part.type !== "literal").map(({ type, value: partValue }) => [type, partValue])
  );
  return `${dateParts.year}-${dateParts.month}-${dateParts.day}`;
}

export function getUtcDateKey(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

export function getNepalDayStart(value = new Date(), daysFromToday = 0) {
  const [year, month, day] = getNepalDateKey(value).split("-").map(Number);
  const utcMidnight = Date.UTC(year, month - 1, day + daysFromToday);
  return new Date(utcMidnight - NEPAL_UTC_OFFSET_MINUTES * 60_000);
}
