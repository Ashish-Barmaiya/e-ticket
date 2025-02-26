import { createTicketPdf } from "./createPdf.js";
import { sendTicketViaEmail } from "./sendPdf.js";

const sendTicketPdf = async (createdTickets, user, event) => {
  try {
    // Generate pdf
    const pdfBuffer = await createTicketPdf(createdTickets, user, event);

    // Send email with attached pdf
    const email = user.email;
    await sendTicketViaEmail(email, pdfBuffer);

    console.log("Ticket PDF generated and email sent successfully.");
    return true;
  } catch (error) {
    console.error("Error processing ticket:", error);
    return false;
  }
};

export { sendTicketPdf };
