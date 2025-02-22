"use client";

import React, { useState } from "react";
import { toast } from "react-toastify";
import { ErrorAlert, SignInAlert } from "@/components/custom/AlertComponents";

const MobileNumberInput = () => {
  const [mobile, setMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [isVerified, setIsVerified] = useState(false);

  const handleMobileChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setMobile(value);
      setError("");
    }
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setOtp(value);
      setError("");
    }
  };

  const handleMobileSubmit = async (e) => {
    e.preventDefault();

    // Validate mobile number length
    if (mobile.length !== 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    try {
      const response = await fetch(
        "/api/user/profile/ekyc/verify-phone-number",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ aadhaarPhoneNumber: mobile }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401 || data.status === 401) {
          setError("Unauthorized. Please login.");
        } else if (response.status === 400 || data.status === 400) {
          setError(`Error: ${data.message || "Bad Request"}`);
        } else {
          setError(
            `Something went wrong: ${response.status} - ${response.statusText}`
          );
        }
        return;
      }

      // OTP sent successfully
      await response.json();
      setMessage("OTP sent successfully!");
      toast.success("OTP sent successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
      setIsOtpSent(true);
    } catch (err) {
      console.error("Error during mobile submission:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    // Assuming OTP is 6 digits
    if (otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    try {
      const response = await fetch(
        "/api/user/profile/ekyc/verify-phone-number/verify-otp",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ otp: otp }),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 401 || data.status === 401) {
          setError("Unauthorized. Please login.");
        } else if (response.status === 400 || data.status === 400) {
          setError(`Error: ${data.message || "Bad Request"}`);
        } else {
          setError(
            `Something went wrong: ${response.status} - ${response.statusText}`
          );
        }
        return;
      }

      // OTP verified successfully
      await response.json();
      setMessage("User Aadhaar E-kyc completed successfully");
      setIsVerified(true);
      toast.success("Your Aadhaar E-kyc completed successfully!", {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: false,
      });
    } catch (err) {
      console.error("Error during OTP verification:", err);
      setError("Something went wrong. Please try again later.");
    }
  };

  if (error) {
    if (error === "Unauthorized. Please login.") {
      return <SignInAlert />;
    } else {
      return <ErrorAlert error={{ message: error }} />;
    }
  }

  return (
    <div className="max-w-sm mx-0 mt-14 px-4">
      {!isOtpSent && (
        <form onSubmit={handleMobileSubmit}>
          <label
            htmlFor="mobileNumber"
            className="block text-lg font-medium mb-2"
          >
            Mobile Number:
          </label>
          <input
            id="mobileNumber"
            type="tel"
            value={mobile}
            onChange={handleMobileChange}
            placeholder="Enter your mobile number"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="mt-4 w-full px-4 py-1 tracking-wider bg-teal-600 text-white rounded-md"
          >
            Submit
          </button>
        </form>
      )}

      {isOtpSent && !isVerified && (
        <form onSubmit={handleOtpSubmit} className="mt-4">
          <label htmlFor="otp" className="block text-lg font-medium mb-2">
            Enter OTP:
          </label>
          <input
            id="otp"
            type="text"
            value={otp}
            onChange={handleOtpChange}
            placeholder="Enter OTP"
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          <button
            type="submit"
            className="mt-4 w-full px-4 py-1 tracking-wider bg-teal-600 text-white rounded-md"
          >
            Verify OTP
          </button>
        </form>
      )}

      {message && <p className="text-green-500 mt-2">{message}</p>}
    </div>
  );
};

export default MobileNumberInput;
