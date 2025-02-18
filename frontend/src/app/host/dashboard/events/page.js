// HOST EVENTS

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignInAlert } from "@/components/custom/AlertComponents";
import Head from "next/head";
import { Button } from "@/components/ui/button";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        // get response
        const response = await fetch("/api/host/dashboard/events", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        // handle response errors
        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized. Please login");
          } else if (response.status === 404) {
            setError("Page not found");
          } else {
            setError(
              `Error fetching events: ${response.status} - ${response.statusText}`
            );
          }
          return;
        }

        const data = await response.json();
        console.log("Fetched data:", data);

        if (data.success) {
          setEvents(data.data.events);
          console.log("events: ", events);
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

  useEffect(() => {
    console.log("Updated events:", events);
  }, [events]);

  // Render sign in alert to user
  if (error === "Unauthorized. Please login") {
    return <SignInAlert />;
  }

  // If events[] is empty
  if (events.length === 0) {
    return (
      <div className="mt-24 pt-4 px-10">
        <Head>
          <title>No Events Found</title>
        </Head>
        <div className="pb-4 px-10 font-semibold text-5xl text-black/85 mb-4">
          <h1>Your Events</h1>
        </div>
        <p>
          You have not listed any event yet. Go to List an Event to list an
          event.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-24 pt-4 px-10">
      <div>
        <Head>
          <title>Your Events</title>
        </Head>
        <div className="pb-4 px-10 font-semibold text-5xl text-black/85 mb-4">
          <h1>Your Events</h1>
        </div>

        <ul className="px-10 flex gap-20">
          {events.map((events) => (
            <li key={events.id}>
              <div>
                <h1>{events.title}</h1>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-10 mt-10">
        <Link href="/host/dashboard/list-new-event">
          <Button>List an Event</Button>
        </Link>
      </div>
    </div>
  );
}
