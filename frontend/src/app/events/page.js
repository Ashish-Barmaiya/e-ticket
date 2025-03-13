// EVENTS PAGE //
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import EventsPageComponent from "@/components/event/EventsPage";
import EventsPageBodyComponent from "@/components/event/EventsPageBodyComponent";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("/api/events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 404) {
            setError("No events found");
          } else {
            setError(
              `Error fetching events: ${response.status} - ${response.statusText}`
            );
          }
          return;
        }

        const data = await response.json();

        if (data.success) {
          setEvents(data.events);
        } else {
          setError(data.message || "Failed to fetch events");
        }
      } catch (error) {
        console.error("Error during fetch:", error); // Log the error
        setError(
          "Failed to fetch events. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, [router]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <Head>
          <title>Loading Events...</title>
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

        <h1 className="text-xl tracking-wide">
          Loading <span className="text-teal-600">Events...</span>
        </h1>
      </div>
    );
  }

  // If events[] is empty
  if (events.length === 0) {
    return (
      <div className="mt-12 pt-4 px-10">
        <Head>
          <title>No Events Found</title>
        </Head>
        <div className="pb-4 px-10 font-semibold text-5xl text-black/85 mb-4">
          <h1>No Events Found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20  px-10">
      <div className="">
        <Head>
          <title>Events</title>
        </Head>
        <EventsPageComponent />
        <EventsPageBodyComponent events={events} />
      </div>
    </div>
  );
};

export default EventsPage;
