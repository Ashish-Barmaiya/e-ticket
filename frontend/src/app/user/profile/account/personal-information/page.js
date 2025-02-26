"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import withAuth from "@/hooks/withAuth";
import { ChevronRight } from "lucide-react";

function UserPersonalInfoPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchUserPersonalinfo = async () => {
      try {
        const response = await fetch(
          "/api/user/profile/account/personal-information",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized. Please login.");
          } else if (response.status === 404) {
            setError("User not found.");
          } else {
            setError(
              `Error fetching user personal information: ${response.status} - ${response.statusText}`
            );
          }
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.success) {
          setUserData(data.user);
        } else {
          setError(data.message || "Failed to fetch user personal information");
        }
      } catch (err) {
        console.error("Error during fetch:", err);
        setError(
          "Failed to fetch user personal information. Please check your connection and try again."
        );
      }
      setLoading(false);
    };

    // Call the function on component mount
    fetchUserPersonalinfo();
  }, []);

  // Show a loading state while fetching data
  if (loading) {
    return <div>Loading...</div>;
  }

  // Show an error if one occurred
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-lg">
        Error: {error}
      </div>
    );
  }

  // Safeguard if userData hasn't been set
  if (!userData || !userData.user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-lg">
        No user data found.
      </div>
    );
  }

  return (
    <div>
      <div className="mx-auto mt-12 px-10">
        <h1 className="text-3xl tracking-tighter">
          {userData.user.fullName || "Guest"}{" "}
        </h1>
        <Link
          href="/user/profile/account/personal-information/edit-profile"
          className="w-fit text-sm tracking-wider flex items-center hover:text-teal-500"
        >
          Edit Profile{" "}
          <span>
            <ChevronRight size={20} strokeWidth={1} />
          </span>
        </Link>
        <table className="table-auto text-md mt-4 border-collapse">
          <tbody>
            <tr className="border-b border-teal-300/60">
              <th className="px-4 py-2 text-left font-normal">Email:</th>
              <td className="px-4 py-2">{userData.user.email}</td>
            </tr>
            <tr className="border-b border-teal-300/60">
              <th className="px-4 py-2 text-left font-normal ">
                Phone Number:
              </th>
              <td className="px-4 py-2">
                +91{userData.maskedUserPhoneNumber}
                {userData.user.phoneVerification ? (
                  <span className="ml-6 text-green-500 text-sm">verified</span>
                ) : (
                  <span className="ml-6 text-blue-500 text-sm">
                    not verified
                  </span>
                )}
              </td>
            </tr>
            <tr className="border-b border-teal-300/60">
              <th className="px-4 py-2 text-left font-normal">E-Kyc Status:</th>
              <td className="px-4 py-2">
                {userData.user.eKyc ? (
                  <span>Completed</span>
                ) : (
                  <span>Pending</span>
                )}
              </td>
            </tr>
            <tr className="border-b border-teal-300/60">
              <th className="px-4 py-2 text-left font-normal">
                Aadhaar Number:
              </th>
              <td className="px-4 py-2">
                {userData.user.eKyc ? (
                  <span>{userData.maskedAadhaarNumber}</span>
                ) : (
                  <span>NA</span>
                )}
              </td>
            </tr>
            <tr className="border-b border-teal-300/60">
              <th className="px-4 py-2 text-left font-normal">
                Aadhaar Phone Number:
              </th>
              <td className="px-4 py-2">
                {userData.user.eKyc ? (
                  <span>
                    +91{userData.maskedAadhaarPhoneNumber}{" "}
                    <span className="ml-6 text-green-500 text-sm">
                      verified
                    </span>
                  </span>
                ) : (
                  <span>NA</span>
                )}
              </td>
            </tr>
            <tr className="border-b border-teal-300/60">
              <th className="px-4 py-2 text-left font-normal">
                Unique User Identity:
              </th>
              <td className="px-4 py-2">{userData.user.uniqueUserIdentity}</td>
            </tr>
            <tr className="border-b border-teal-300/60">
              <th className="px-4 py-2 text-left font-normal">Gender:</th>
              <td className="px-4 py-2">{userData.user.gender}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default withAuth(UserPersonalInfoPage);
