"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import withAuth from "@/hooks/withAuth";

function ListTicketForResale() {
  console.log("🔥 Component is mounting...");

  const router = useRouter();
  const { ticketId } = useParams();
  console.log("ticketId:", ticketId);

  const [ticket, setTicket] = useState(null);
  const [resalePrice, setresalePrice] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (ticketId) {
      fetch(`/api/user/profile/my-tickets/list-ticket-for-resell/${ticketId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) {
            setTicket(data.ticket);
          } else {
            setError(data.message);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
          setError("Something went wrong");
          setLoading(false);
        });
    }
  }, [ticketId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    setSuccessMessage(null);

    if (!resalePrice) {
      setSubmitError("Please enter a resalePrice.");
      return;
    }

    try {
      const res = await fetch(
        `/api/user/profile/my-tickets/list-ticket-for-resell/${ticketId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ resalePrice }),
        }
      );

      const data = await res.json();

      if (data.success) {
        setSuccessMessage("Ticket listed for resale successfully!");
      } else {
        setSubmitError(data.message || "Failed to list ticket for resale.");
      }
    } catch (err) {
      console.error(err);
      setSubmitError("Something went wrong. Please try again.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div>
      <div className="mt-12">
        <h1 className="text-3xl font-bold">Resell Ticket</h1>
        <p className="text-gray-500">List your ticket for resale</p>
        <div className="py-4">
          <div className="grid">
            <p>Ticket ID: {ticket.id}</p>
          </div>
        </div>

        {/* Resale Form */}
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block">
            <span className="text-gray-700">Set Resale Price (₹)</span>
            <input
              type="number"
              value={resalePrice}
              onChange={(e) => setresalePrice(e.target.value)}
              className="w-[30%] ml-2 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter resale price"
              required
            />
          </label>
          <button
            type="submit"
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
          >
            List Ticket for Resale
          </button>
        </form>

        {/* Success or Error Message */}
        {successMessage && (
          <p className="text-green-600 mt-2">{successMessage}</p>
        )}
        {submitError && <p className="text-red-500 mt-2">{submitError}</p>}
      </div>
    </div>
  );
}

export default withAuth(ListTicketForResale);
