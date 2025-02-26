import PDFDocument from "pdfkit";

const createTicketPdf = (createdTickets, user, event) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const buffers = [];
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(buffers)));
    doc.on("error", (err) => reject(err));

    // Header: Brand Name with background
    doc.rect(0, 0, doc.page.width, 80).fill("#0d9488");
    doc
      .fillColor("white")
      .font("Helvetica-Bold")
      .fontSize(36)
      .text("Ticketo", 0, 20, { align: "center" });
    doc.moveDown(2);
    doc.fillColor("black");

    // User Details Section Box
    doc.rect(50, 100, doc.page.width - 100, 80).stroke();
    doc.fontSize(14).text("User Details:", 60, 110);
    doc
      .fontSize(12)
      .font("Helvetica")
      .text(`Name: ${user.fullName}`, 60, 130)
      .text(`Email: ${user.email}`, 60, 145)
      .text(`UUI: ${user.uniqueUserIdentity || "Not Applicable"}`, 60, 160);

    // Event Details Section Box
    doc.rect(50, 200, doc.page.width - 100, 80).stroke();
    doc.fontSize(14).text("Event Details:", 60, 210);
    doc
      .fontSize(12)
      .text(`Title: ${event.title}`, 60, 230)
      .text(`Date: ${event.date}`, 60, 245)
      .text(`Starts at: ${event.startTime}`, 60, 260);

    // Ticket Details Title
    let currentY = 300;
    doc.fontSize(14).text("Ticket Details:", 50, currentY);
    currentY += 20;

    // Ticket Details Section: Each ticket in its own styled box
    createdTickets.forEach((ticket, index) => {
      // Draw ticket container box
      doc.rect(50, currentY, doc.page.width - 100, 120).stroke();

      // Insert QR Code image on the left side
      if (ticket.qrCode) {
        try {
          const base64Regex = /^data:image\/\w+;base64,/;
          const cleanedData = ticket.qrCode.replace(base64Regex, "");
          doc.image(Buffer.from(cleanedData, "base64"), 60, currentY + 10, {
            fit: [100, 100],
          });
        } catch (err) {
          console.error("Error adding QR code image:", err);
        }
      }

      // Ticket details on the right of the QR Code
      const detailX = 170;
      doc
        .fontSize(12)
        .text(`Ticket ${index + 1}`, detailX, currentY + 10, {
          underline: true,
        })
        .text(
          `Seat Number: ${ticket.seatNumber || "NA"}`,
          detailX,
          currentY + 30,
        )
        .text(`Ticket Number: ${ticket.ticketNumber}`, detailX, currentY + 45)
        .text(`Price: ${ticket.price}`, detailX, currentY + 60)
        .text(`Booked At: ${ticket.createdAt}`, detailX, currentY + 75)
        .text(`Status: ${ticket.status}`, detailX, currentY + 90);

      currentY += 140; // Advance to the next ticket block
    });

    doc.end();
  });
};

export { createTicketPdf };
