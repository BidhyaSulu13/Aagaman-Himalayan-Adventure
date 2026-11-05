export function getDepartureAvailableSeats(departure) {
  const capacity = Number(departure.capacity ?? departure.totalSeats ?? 0);
  const bookedCount = Number(departure.bookedCount ?? 0);
  const availableSeats = Number(departure.availableSeats ?? capacity - bookedCount);
  return Number.isFinite(availableSeats) ? Math.max(0, availableSeats) : 0;
}

export function getDepartureStatus(departure) {
  const lifecycleStatus = departure.lifecycleStatus;
  if (["Cancelled", "Closed", "Completed", "In Progress", "Draft"].includes(lifecycleStatus)) {
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
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const bookingClosingDate = departure.bookingClosingDate
    ? new Date(departure.bookingClosingDate)
    : null;

  return (
    departure.published !== false &&
    ["Available", "Guaranteed", "Filling Fast"].includes(departure.status) &&
    !["Draft", "Closed", "Cancelled", "Completed", "In Progress", "Fully Booked"].includes(
      getDepartureStatus(departure)
    ) &&
    !Number.isNaN(startDate.getTime()) &&
    startDate >= today &&
    getDepartureAvailableSeats(departure) > 0 &&
    (!bookingClosingDate || bookingClosingDate >= new Date())
  );
}
