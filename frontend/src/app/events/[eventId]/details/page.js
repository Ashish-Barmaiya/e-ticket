"use client";

import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SignInAlert } from "@/components/custom/AlertComponents";

export default function EventDetailsPage() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
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
            "Content-Type": "application/json", // Use "headers" not "header"
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
  if (error) return <div>{error}</div>;
  if (!event) return <div>No event found.</div>;

  return (
    <div className="mt-24 pt-4 px-20">
      {/* event banner image */}
      <h1 className="text-5xl tracking-wider pt-4 pb-10">{event.title}</h1>
      <p>Description: {event.description}</p>
      <p>Artist: {event.artist}</p>
      <p>{new Date(event.date).toLocaleDateString()}</p>
      <p>Venue: {event.venueInformation.name}</p>
      <p>
        Address: {event.venueInformation.address}, {event.venueInformation.city}
      </p>
      <p>Starts At: {new Date(event.startTime).toLocaleTimeString()}</p>
      <p>Ends At: {new Date(event.endTime).toLocaleTimeString()}</p>
      <p>Tickets Available: {event.ticketsAvailable}</p>
      <p>Price: ₹ {event.price}</p>
      <div className="py-2">
        <Link href={`/events/${eventId}/details/buy-ticket`}>
          <Button className="bg-teal-600 tracking-wider">BOOK</Button>
        </Link>
      </div>
    </div>
  );
}
