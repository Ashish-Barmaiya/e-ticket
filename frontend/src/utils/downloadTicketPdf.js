import jsPDF from "jspdf";

const downloadTicketPDF = (selectedTicket) => {
  const doc = new jsPDF();

  // Brand Name
  doc.setFontSize(26);
  doc.text("Ticketo", 80, 15);

  // Ticket Header
  doc.setFontSize(18);
  doc.text(selectedTicket.event.title, 10, 30);

  // QR code image (positioned below the header)
  doc.addImage(selectedTicket.qrCode, "PNG", 10, 30, 50, 50);

  // Ticket Details
  doc.setFontSize(16);
  doc.text("Ticket Details:", 10, 90);
  doc.setFontSize(12);
  doc.text(`Ticket Holder: ${selectedTicket.user.fullName}`, 10, 100);
  doc.text(`Ticket Id: ${selectedTicket.id}`, 10, 110);
  doc.text(`Seat Number: ${selectedTicket.seatNumber}`, 10, 120);
  doc.text(`Price: ₹${selectedTicket.price}`, 10, 130);
  doc.text(
    `Booked at: ${new Date(selectedTicket.createdAt).toLocaleString()}`,
    10,
    140
  );
  doc.text(`Status: ${selectedTicket.status}`, 10, 150);
  doc.text(
    `Unique User Identity: ${
      selectedTicket.uniqueUserIdentity || "Not Applicable"
    }`,
    10,
    160
  );

  // Event Details
  doc.setFontSize(16);
  doc.text("Event Details:", 10, 180);
  doc.setFontSize(12);
  doc.text(`Event Title: ${selectedTicket.event.title}`, 10, 190);
  doc.text(`Artist: ${selectedTicket.event.artist || "Unknown"}`, 10, 200);
  doc.text(
    `Venue: ${selectedTicket.event.venueInformation.name}, ${selectedTicket.event.venueInformation.address}`,
    10,
    210
  );
  doc.text(
    `Date: ${new Date(selectedTicket.event.date).toLocaleDateString()}`,
    10,
    220
  );
  doc.text(
    `Starts at: ${new Date(
      selectedTicket.event.startTime
    ).toLocaleTimeString()}`,
    10,
    230
  );

  // Trigger download of the PDF
  doc.save(`ticket-${selectedTicket.id}.pdf`);
};

export default downloadTicketPDF;
