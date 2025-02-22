// USER E-KYC PAGE //

"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignInAlert } from "@/components/custom/AlertComponents";
import UploadXML from "@/components/user-profile/ekyc/UploadXml";
import Link from "next/link";
import Head from "next/head";

export default function userEkyc() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEkycCompleted, setIsEkycCompleted] = useState(false);
  const [userData, setUserData] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchEkycStatus = async () => {
      try {
        const response = await fetch("/api/user/profile/ekyc", {
          method: "GET",
          headers: {
            "Content-type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized. Please login.");
            setLoading(false);
            // giving alert informing to sign in again
          } else {
            setError(
              `Error fetching ekyc status: ${response.status} - ${response.statusText}`
            );
            setLoading(false);
          }
          return;
        }

        const data = await response.json();

        if (data.success) {
          if (data.message === "User e-kyc already completed") {
            setIsEkycCompleted(true);
            setUserData(data);
            setLoading(false);
          } else {
            setIsEkycCompleted(false);
            setLoading(false);
          }
        }
      } catch (error) {
        console.error("Error during fetch:", err);
        setError("Something went wrong. Please refresh the page");
      }
    };
    fetchEkycStatus();
  }, [router, isEkycCompleted]);

  if (error === "Unauthorized. Please login.") {
    return <SignInAlert />;
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Head>
          <title>Loading...</title>
        </Head>
        {/* SVG Spinner */}
        <svg
          className="animate-spin h-10 w-10 text-teal-600 mb-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          ></path>
        </svg>

        <h1 className="text-xl tracking-wide">Loading...</h1>
      </div>
    );
  }

  if (isEkycCompleted) {
    return (
      <div className="flex justify center justify-center h-screen">
        <div className="mt-24">
          <h2 className="flex items-baseline text-4xl py-2">
            Your&nbsp;
            <span className="text-teal-600 text-5xl">E-Kyc</span>
            &nbsp;is completed successfully!
            <img
              src="/icons/green_tick.png"
              alt="green_tick"
              className="w-6 h-6 ml-2 object-contain"
            />
          </h2>
          <table className="table-auto text-md border-collapse">
            <tbody>
              <tr className="border-b border-teal-300/60">
                <th className="px-4 py-2 text-left font-normal tracking-wider">
                  Name
                </th>
                <td className="px-4 py-2">
                  {userData?.userData?.user?.fullName}
                </td>
              </tr>
              <tr className="border-b border-teal-300/60">
                <th className="px-4 py-2 text-left font-normal tracking-wider">
                  Unique User Identity
                </th>
                <td className="px-4 py-2">
                  {userData?.userData?.user?.uniqueUserIdentity}
                </td>
              </tr>
              <tr className="border-b border-teal-300/60">
                <th className="px-4 py-2 text-left font-normal tracking-wider">
                  Aadhaar Number
                </th>
                <td className="px-4 py-2">
                  {userData?.userData?.maskedAadhaarNumber}
                </td>
              </tr>
              <tr className="border-b border-teal-300/60">
                <th className="px-4 py-2 text-left font-normal tracking-wider">
                  Mobile Number
                </th>
                <td className="px-4 py-2">
                  +91{userData?.userData?.maskedAadhaarPhoneNumber}
                </td>
              </tr>
              <tr>
                <th className="px-4 py-2 text-left font-normal tracking-wider">
                  E-Kyc Status
                </th>
                <td className="px-4 py-2">Completed</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  } else {
    return (
      <div className="container mx-auto mt-8 p-6">
        <header className="mb-8">
          <h1 className="text-4xl font-semibold mb-4">
            Aadhaar based <span className="text-teal-600 text-5xl">E-Kyc</span>
          </h1>
          <p className="text-lg mb-1">
            Aadhaar based E-Kyc is the first step towards taking benefit of our
            unique feature.
          </p>
          <p className="text-md mb-2">
            To learn in detail how we process and use your Aadhaar based data,{" "}
            <Link href="/ekyc" className="text-teal-600">
              click here.
            </Link>
          </p>
          <p className="text-lg mb-2"></p>
        </header>
        <section>
          <h2 className="text-2xl font-semibold mb-0">Upload Your XML File</h2>
          <p className="">
            (We suggest you read about our E-Kyc policy and process before
            uploading your Aadhaar XML file and share phrase.&nbsp;
            <Link href="/ekyc" className="text-teal-600">
              Click here
            </Link>
            &nbsp;to learn more.)
          </p>
          <UploadXML />
        </section>
      </div>
    );
  }
}
