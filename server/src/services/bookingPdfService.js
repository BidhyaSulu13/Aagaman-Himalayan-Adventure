function pdfText(value) {
  return String(value ?? "")
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\x20-\x7E]/g, "?")
    .replace(/[\\()]/g, "\\$&");
}

function text(x, y, value, size = 11, color = "0.16 0.22 0.25") {
  return `${color} rg BT /F1 ${size} Tf 1 0 0 1 ${x} ${y} Tm (${pdfText(value)}) Tj ET\n`;
}

function rectangle(x, y, width, height, color) {
  return `${color} rg ${x} ${y} ${width} ${height} re f\n`;
}

function formatDate(value) {
  if (!value) return "To be confirmed";
  return new Date(value).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

function formatAmount(amount, currency = "USD") {
  return `${currency} ${Number(amount || 0).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function createBookingPdf(booking) {
  const trek = booking.trek || {};
  const departure = booking.departure || {};
  let content = rectangle(0, 674, 612, 118, "0.03 0.24 0.20");
  content += text(48, 748, "AGAAMAN  /  A HIMALAYAN ADVENTURE", 10, "0.79 0.87 0.78");
  content += text(48, 712, "Your trek booking", 24, "1 1 1");
  content += text(48, 688, trek.title || "Himalayan trek", 13, "1 1 1");

  content += text(48, 635, "BOOKING REFERENCE", 8, "0.35 0.43 0.43");
  content += text(48, 614, booking.bookingReference || "Not available", 14, "0.03 0.24 0.20");
  content += text(326, 635, "BOOKING STATUS", 8, "0.35 0.43 0.43");
  content += text(326, 614, booking.bookingStatus || "Pending", 14, "0.03 0.24 0.20");
  content += rectangle(48, 596, 516, 1, "0.87 0.90 0.89");

  content += text(48, 569, "DEPARTURE", 8, "0.35 0.43 0.43");
  content += text(48, 548, formatDate(departure.startDate), 11);
  content += text(326, 569, "RETURN", 8, "0.35 0.43 0.43");
  content += text(326, 548, formatDate(departure.endDate), 11);
  content += text(48, 510, "TRAVELERS", 8, "0.35 0.43 0.43");
  content += text(48, 489, String(booking.numberOfTravelers || booking.travelerDetails?.length || 1), 11);
  content += text(326, 510, "PAYMENT STATUS", 8, "0.35 0.43 0.43");
  content += text(326, 489, booking.paymentStatus || "Pending", 11);

  content += rectangle(48, 461, 516, 1, "0.87 0.90 0.89");
  content += text(48, 437, "TRAVELER NAMES", 8, "0.35 0.43 0.43");
  const travelers = booking.travelerDetails || [];
  travelers.slice(0, 20).forEach((traveler, index) => {
    const x = index < 10 ? 48 : 306;
    const row = index % 10;
    content += text(x, 414 - row * 22, `${index + 1}. ${traveler.fullName}`, 10);
  });

  content += rectangle(48, 108, 516, 1, "0.87 0.90 0.89");
  content += text(48, 83, "BOOKING TOTAL", 8, "0.35 0.43 0.43");
  content += text(48, 59, formatAmount(booking.totalAmount, booking.currency), 16, "0.03 0.24 0.20");
  content += text(326, 82, "Agaaman Himalayan Adventure  |  Kathmandu, Nepal", 8, "0.35 0.43 0.43");

  const stream = Buffer.from(content, "ascii");
  const objects = [
    "<< /Type /Catalog /Pages 2 0 R >>",
    "<< /Type /Pages /Kids [3 0 R] /Count 1 >>",
    "<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >>",
    "<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>",
    `<< /Length ${stream.length} >>\nstream\n${stream.toString("ascii")}\nendstream`,
  ];

  let document = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(document, "ascii"));
    document += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });
  const xrefOffset = Buffer.byteLength(document, "ascii");
  document += `xref\n0 ${offsets.length}\n0000000000 65535 f \n`;
  for (const offset of offsets.slice(1)) {
    document += `${String(offset).padStart(10, "0")} 00000 n \n`;
  }
  document += `trailer\n<< /Size ${offsets.length} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return Buffer.from(document, "ascii");
}
