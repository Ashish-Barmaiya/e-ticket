import env from "dotenv";
import axios from "axios";
import { transporter } from "./nodemailer.js";

env.config();
const apiKey = process.env.FAST2SMS_API_KEY;

// SEND OTP //
const sendOtpViaPhoneNumber = async (phoneNumber, otp) => {
  const url = "https://www.fast2sms.com/dev/bulkV2";

  const data = {
    variables_values: otp, // The OTP to be sent
    route: "otp", // Route type for OTP
    numbers: phoneNumber, // The recipient's phone number
  };
  try {
    const response = await axios.post(url, data, {
      headers: {
        authorization: apiKey,
      },
    });

    if (response.data.return) {
      console.log("OTP sent successfully");
      return response.data;
    } else {
      console.error("Error sending OTP:", response.data.message);
    }
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

// SEND OTP FOR EMAIL VERIFICATION //
const sendOtpViaEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.NODEMAILER_EMAIL,
    to: email,
    subject: "Your OTP for Verification",
    html: `<p>Your OTP for verification is <strong>${otp}</strong>. It is valid for 10 minutes.</p>`,
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

export { sendOtpViaPhoneNumber, sendOtpViaEmail };
