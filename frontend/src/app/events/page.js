"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Head from "next/head";
import { Button } from "@/components/ui/button";

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
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
      }
    };

    fetchEvents();
  }, [router]);

  console.log(events);

  // If events[] is empty
  if (events.length === 0) {
    return (
      <div className="mt-24 pt-4 px-10">
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
    <div className="mt-24 pt-4 px-10">
      <div className="">
        <Head>
          <title>Events</title>
        </Head>
        <div className="pb-4 px-10 font-semibold text-5xl text-black/85 mb-4">
          <h1>Events</h1>
        </div>

        <ul className="px-10 flex gap-20">
          {events.map((events) => (
            <li key={events.id}>
              <Link href={`/events/${events.id}/details`}>
                <button onClick={() => setSelectedEvent(events)}>
                  <div className="bg-red-300 rounded-md hover:shadow-xl hover:shadow-black/25">
                    <div className="p-4">
                      <h1>Image</h1>
                    </div>
                    <div className="grid p-4 tracking-wider">
                      <h1 className="text-xl">{events.title}</h1>
                      <p>{events.description}</p>
                      <p className="text-md">{events.artist}</p>
                      <p>{new Date(events.date).toLocaleDateString()}</p>
                      <p>{events.venueInformation.address}</p>
                      <p>{events.venueInformation.city}</p>
                      <p>Price: ₹{events.price}</p>
                    </div>
                  </div>
                </button>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default EventsPage;
