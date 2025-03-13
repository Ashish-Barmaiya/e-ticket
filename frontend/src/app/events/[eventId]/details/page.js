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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${weekday}, ${day} ${month} ${year}`;
  };

  return (
    <div className="mt-24 pt-4 px-20">
      {/* event banner image */}
      <h1 className="text-5xl text-gray-800 tracking-tight font-medium pt-4 pb-10">
        {event.title}
      </h1>
      <div className="flex items-start space-x-6">
        <div className="w-1/2 p-1 bg-gradient-to-r from-teal-400 to-amber-500 rounded-md">
          <div className="flex flex-col space-y-2 bg-white rounded-md">
            <img
              className="object-contain w-full h-full"
              src={event.bannerImage}
              alt={event.title}
            />
          </div>
        </div>
        <div className="w-1/2 flex flex-col space-y-1">
          <p className="tracking-wide text-md italic">
            "{event.description || "No Description"}"
          </p>
          <hr className="border-amber-300" />
          <p className="text-lg capitalize tracking-wide">
            Artist: {event.artist || "Unknown"}
          </p>
          <p className="text-lg tracking-wide">{formatDate(event.date)}</p>
          <p className="text-lg capitalize tracking-wide">
            Venue: {event.venueInformation.name}
          </p>
          <p className="text-lg capitalize tracking-wide">
            Address: {event.venueInformation.address},{" "}
            {event.venueInformation.city}
          </p>
          <p className="text-lg tracking-wide">
            Starts At: {new Date(event.startTime).toLocaleTimeString()}
          </p>
          <p className="text-lg tracking-wide">
            Ends At: {new Date(event.endTime).toLocaleTimeString()}
          </p>
          <p className="text-lg tracking-wide">
            Tickets Available: {event.ticketsAvailable}
          </p>
          <p className="text-lg tracking-wide">
            Price: <span className="font-medium">₹ {event.price} /-</span>
          </p>
          <div className="py-1">
            <Link href={`/events/${eventId}/details/buy-ticket`}>
              <Button
                variant="outline"
                className="bg-teal-500 tracking-wide py-6 px-10 text-lg text-white/90 hover:bg-white/90 hover:text-teal-600 hover:border hover:border-teal-400"
              >
                BOOK
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
