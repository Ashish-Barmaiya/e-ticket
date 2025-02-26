import env from "dotenv";
import { transporter } from "./nodemailer.js";

env.config();

// SEND PDF VIA EMAIL //
const sendTicketViaEmail = async (email, pdfBuffer) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Your Ticket",
    text: "Please find attached ticket pdf.",
    attachments: [
      {
        filename: "ticket.pdf",
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: ", info.response);
    return true;
  } catch (error) {
    console.error("Error sending email: ", error);
    return false;
  }
};

export { sendTicketViaEmail };
