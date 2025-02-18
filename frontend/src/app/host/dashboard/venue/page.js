// Show all venues of host || no venue added
// Add venue button

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SignInAlert } from "@/components/custom/AlertComponents";
import Head from "next/head";
import { Button } from "@/components/ui/button";

export default function venue() {
  const [venues, setVenues] = useState([]);
  const [error, setError] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        // get response
        const response = await fetch("/api/host/dashboard/venue", {
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
              `Error fetching venues: ${response.status} - ${response.statusText}`
            );
          }
          return;
        }

        const data = await response.json();

        if (data.success) {
          setVenues(data.data.venues);
        } else {
          setError(data.message || "Failed to fetch venues");
        }
      } catch (error) {
        console.error("Error during fetch:", error); // Log the error
        setError(
          "Failed to fetch venues. Please check your connection and try again."
        );
      }
    };
    fetchVenues();
  }, [router]);

  // Render sign in alert to user
  if (error === "Unauthorized. Please login") {
    return <SignInAlert />;
  }

  // If venue[] is empty
  if (venues.length === 0) {
    return (
      <div className="mt-24 pt-4 px-10">
        <Head>
          <title>No Venues Found</title>
        </Head>
        <div className="pb-4 px-10 font-semibold text-5xl text-black/85 mb-4">
          <h1>Your Venues</h1>
        </div>
        <p>You have not added any venue yet. Go to Add Venue to add a venue</p>
      </div>
    );
  }

  return (
    <div className="mt-24 pt-4 px-10">
      <div>
        <Head>
          <title>Your Venues</title>
        </Head>
        <div className="pb-4 px-10 font-semibold text-5xl text-black/85 mb-4">
          <h1>Your Venues</h1>
        </div>

        <ul className="px-10 flex gap-20">
          {venues.map((venues) => (
            <li key={venues.id}>
              <div>
                <h1>{venues.name}</h1>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div className="px-10 mt-10">
        <Link href="/host/dashboard/venue/add-venue">
          <Button>Add New Venue</Button>
        </Link>
      </div>
    </div>
  );
}
