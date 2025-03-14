"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  SignInAlert,
  ErrorAlert,
  TicketBookedAlert,
} from "@/components/custom/AlertComponents";
import withAuth from "@/hooks/withAuth";

function BuyTicketPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [totalSeats, setTotalSeats] = useState("");
  const [seatNumber, setSeatNumber] = useState([]);
  const [tickedBooked, setTicketBooked] = useState(false);
  const [isTicketSentViaEmail, setIsTicketSentViaEmail] = useState(false);
  const [sendTicketToEmail, setSendTicketToEmail] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    if (!eventId) {
      setError("EventId not found in params");
      setLoading(false);
      return;
    }

    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/events/${eventId}/details`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // Handle response errors
        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized. Please login");
          } else if (response.status === 404) {
            setError("Page not found");
          } else {
            setError(
              `Error fetching event details: ${response.status} - ${response.statusText}`
            );
          }
          setLoading(false);
          return;
        }

        const data = await response.json();

        if (data.success) {
          setEvent(data.event);
        } else {
          setError(data.message || "Failed to fetch event details");
        }
      } catch (err) {
        console.error("Error during fetch:", err);
        setError(
          "Failed to fetch event details. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [eventId, router]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        Loading Event...
      </div>
    );
  if (error)
    return (
      <div className="flex justify-center items-center h-screen text-2xl">
        {error}
      </div>
    );
  if (!event) return <div>No event found.</div>;

  // POST request handler to book ticket
  const handleBookTicketSubmit = async (e) => {
    e.preventDefault();

    if (!event) return;

    try {
      const response = await fetch(
        `/api/events/${eventId}/details/buy-ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            totalSeats: totalSeats,
            seatNumber: seatNumber || null,
            sendTicketToEmail: sendTicketToEmail,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        console.log("Ticket purchased successfully");
        setTicketBooked(true);

        if (data.ticketSentViaEmail) {
          setIsTicketSentViaEmail(true);
          console.log("Ticket Sent Via Email successfully");
        } else {
          setIsTicketSentViaEmail(false);
          console.log("Failed to sent via email");
        }
      } else {
        console.log("Error purchasing ticket");
        setError("Error purchasing ticket");
      }
    } catch (error) {
      console.error("Network error", error);
    } finally {
      // Reset form values if needed
      setTotalSeats("");
      setSeatNumber([]);
      setSendTicketToEmail(false);
    }
  };

  return (
    <div className="mt-24 pt-4 px-10">
      {tickedBooked && (
        <TicketBookedAlert isTicketSentViaEmail={isTicketSentViaEmail} />
      )}

      <div className="pb-4 px-10 font-semibold text-5xl text-black/85 mb-4">
        <h1 className="tracking-wider">{event.title}</h1>
      </div>
      <div className="px-10 mb-4">
        <label className="block text-lg mb-2" htmlFor="totalSeats">
          Enter number of seats to book:
        </label>
        <input
          id="totalSeats"
          type="number"
          value={totalSeats || ""}
          onChange={(e) => setTotalSeats(e.target.value)}
          placeholder="Enter total seats"
          className="border border-gray-300 p-2 rounded w-fit"
        />
      </div>
      {/* Checkbox for sending ticket to user's email */}
      <div className="px-10 mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            checked={sendTicketToEmail}
            onChange={(e) => setSendTicketToEmail(e.target.checked)}
            className="form-checkbox"
          />
          <span className="ml-2 text-lg">Send ticket to my email</span>
        </label>
      </div>
      <form onSubmit={handleBookTicketSubmit} className="px-10">
        <Button type="submit" className="bg-teal-600 tracking-wider">
          Book Ticket
        </Button>
      </form>
    </div>
  );
}

export default withAuth(BuyTicketPage);
