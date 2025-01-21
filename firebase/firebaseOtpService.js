// Import Firebase Admin SDK
import admin from "firebase-admin";

// Import Firebase SDK (modular approach)
import { initializeApp } from "firebase/app";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth"; // Import necessary services
import serviceAccount from "./e-ticketapp-firebase-admin-private-key.json" assert { type: "json" };

// Firebase configuration object
const firebaseConfig = {
  apiKey: "AIzaSyBXUiSPh15UiQ-E1_f256QNETGrBC7JsJA",
  authDomain: "e-ticketapp-c969a.firebaseapp.com",
  projectId: "e-ticketapp-c969a",
  storageBucket: "e-ticketapp-c969a.firebasestorage.app",
  messagingSenderId: "262243169113",
  appId: "1:262243169113:web:fb1392c48e8944fc36d248",
  measurementId: "G-0HF9TZ3P6B",
};

// Initialize Firebase Admin SDK with the service account
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Firebase with the modular SDK
const firebaseApp = initializeApp(firebaseConfig);

// Get Firebase Authentication service
const auth = getAuth(firebaseApp);

// Function to send OTP via SMS
export const sendOTP = async (phoneNumber, recaptchaVerifierElement) => {
  try {
    // Initialize reCAPTCHA verifier (this is required for phone number verification)
    const recaptchaVerifier = new RecaptchaVerifier(
      recaptchaVerifierElement,
      {
        size: "invisible", // You can also set it to 'normal' for visible reCAPTCHA
        callback: (response) => {
          console.log("reCAPTCHA verified", response);
        },
      },
      auth,
    );

    // Render reCAPTCHA widget
    await recaptchaVerifier.render();

    // Send OTP to the provided phone number
    const confirmationResult = await signInWithPhoneNumber(
      auth,
      phoneNumber,
      recaptchaVerifier,
    );

    // Store the confirmation result for later verification (you can store it in a session or database)
    console.log("OTP sent successfully to:", phoneNumber);

    return confirmationResult; // This confirmationResult is needed for verification step
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

// Function to verify OTP
export const verifyOTP = async (confirmationResult, otp) => {
  try {
    // Confirm the OTP with the received confirmation result
    const result = await confirmationResult.confirm(otp);
    console.log("OTP verified successfully:", result.user);
    return result.user;
  } catch (error) {
    console.error("Error verifying OTP:", error);
    throw error;
  }
};

export { admin, firebaseConfig, auth };
