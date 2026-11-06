export function getDepartureAvailableSeats(departure) {
  const capacity = Number(departure.capacity ?? departure.totalSeats ?? 0);
  const bookedCount = Number(departure.bookedCount ?? 0);
  const availableSeats = Number(departure.availableSeats ?? capacity - bookedCount);
  return Number.isFinite(availableSeats) ? Math.max(0, availableSeats) : 0;
}

export function calculateDepartureEndDate(startDate, durationDays) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(String(startDate || ""))) return "";
  const duration = Number(durationDays);
  if (!Number.isInteger(duration) || duration < 1) return "";

  const endDate = new Date(`${startDate}T00:00:00.000Z`);
  if (
    Number.isNaN(endDate.getTime()) ||
    endDate.toISOString().slice(0, 10) !== startDate
  ) {
    return "";
  }
  endDate.setUTCDate(endDate.getUTCDate() + duration);
  return endDate.toISOString().slice(0, 10);
}

function getNepalTodayKey() {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function getDepartureStatus(departure) {
  const lifecycleStatus = departure.lifecycleStatus;
  if (["Cancelled", "Completed", "Closed"].includes(departure.status)) {
    return departure.status;
  }
  if (["Cancelled", "Completed", "Closed", "Draft"].includes(lifecycleStatus)) {
    return lifecycleStatus;
  }
  const startDate = new Date(departure.startDate);
  if (
    !Number.isNaN(startDate.getTime()) &&
    startDate.toISOString().slice(0, 10) <= getNepalTodayKey()
  ) {
    return "In Progress";
  }
  if (lifecycleStatus === "In Progress") {
    return lifecycleStatus;
  }
  const availableSeats = getDepartureAvailableSeats(departure);
  if (availableSeats === 0) return "Fully Booked";
  if (lifecycleStatus) return lifecycleStatus;
  if (departure.status === "Guaranteed") return "Guaranteed";
  if (
    departure.status === "Filling Fast" ||
    availableSeats <= Math.max(1, Math.ceil(Number(departure.capacity || 0) * 0.25))
  ) {
    return "Limited Seats";
  }
  return departure.status || "Available";
}

export function isDepartureBookable(departure) {
  const startDate = new Date(departure.startDate);
  const todayKey = getNepalTodayKey();
  const today = new Date(`${todayKey}T00:00:00.000Z`);
  const closingDate = departure.bookingClosingDate
    ? new Date(departure.bookingClosingDate)
    : null;
  const bookingClosingDate = closingDate && !Number.isNaN(closingDate.getTime())
    ? closingDate.toISOString().slice(0, 10)
    : null;

  if (departure.bookingClosingDate && !bookingClosingDate) return false;

  return (
    departure.published !== false &&
    ["Available", "Guaranteed", "Filling Fast"].includes(departure.status) &&
    !["Draft", "Closed", "Cancelled", "Completed", "In Progress", "Fully Booked"].includes(
      getDepartureStatus(departure)
    ) &&
    !Number.isNaN(startDate.getTime()) &&
    startDate >= today &&
    getDepartureAvailableSeats(departure) > 0 &&
    (!bookingClosingDate || bookingClosingDate >= todayKey)
  );
}
