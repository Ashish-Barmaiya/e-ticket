"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/navigation";
import TicketCard from "@/components/custom/TicketCard";
import {
  SignInAlert,
  TicketCancelledAlert,
} from "@/components/custom/AlertComponents";
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";

export default function MyTickets() {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [ticketCancelled, setTicketCancelled] = useState(false);
  const [cancelledTicketId, setCancelledTicketId] = useState(null);

  const router = useRouter();

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await fetch("/api/user/profile/my-tickets", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            setError("Unauthorized. Please login.");
            // giving alert informing to sign in again
          } else if (response.status === 404) {
            setError("No tickets found.");
          } else {
            setError(
              `Error fetching tickets: ${response.status} - ${response.statusText}`
            );
          }
          return;
        }

        const data = await response.json();

        if (data.success) {
          setTickets(data.tickets);
        } else {
          setError(data.message || "Failed to fetch tickets");
        }
      } catch (err) {
        console.error("Error during fetch:", err);
        setError(
          "Failed to fetch tickets. Please check your connection and try again."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, [router]);

  if (loading) {
    return (
      <div>
        <Head>
          <title>Loading My Tickets...</title>
        </Head>
        <h1>Loading Your Tickets...</h1>
      </div>
    );
  }

  // if (error) {
  //   return (
  //     <div>
  //       <Head>
  //         <title>Error</title>
  //       </Head>
  //       <h1>Error</h1>
  //       <p>{error}</p>
  //     </div>
  //   );
  // }

  if (error === "Unauthorized. Please login.") {
    return <SignInAlert />;
  }

  if (!tickets || tickets.length === 0) {
    return (
      <div className="mt-24 pt-4 px-10">
        <Head>
          <title>No Tickets Found</title>
        </Head>
        <div className="pb-4 px-10 font-semibold text-5xl text-black/85 mb-4">
          <h1>Your Tickets</h1>
        </div>
        <p>No active tickets found.</p>
      </div>
    );
  }

  // Function to handle cancellation form submission
  const handleCancelSubmit = async (e) => {
    e.preventDefault();

    if (!selectedTicket) return;

    try {
      const response = await fetch(
        `/api/user/profile/my-tickets/cancel-ticket/${selectedTicket.id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ticketId: selectedTicket.id,
            reason: cancelReason,
          }),
        }
      );

      if (response.ok) {
        console.log("Ticket cancelled successfully");
        // Store cancelled ticket id
        setCancelledTicketId(selectedTicket.id);
        // Close the drawer by clearing the selected ticket,
        // and show the cancellation alert.
        setSelectedTicket(null);
        setTicketCancelled(true);
      } else {
        const errorData = await response.json();
        console.error("Cancellation failed:", errorData.message);
      }
    } catch (error) {
      console.error("Network error:", error);
    } finally {
      // Close the cancellation dialog and reset the reason input.
      setIsCancelDialogOpen(false);
      setCancelReason("");
    }
  };

  return (
    <div className="mt-24 pt-4 px-10">
      <div>
        <Head>
          <title>My Tickets</title>
        </Head>

        {/* Show TicketCancelledAlert if ticket cancellation was successful */}
        {ticketCancelled && cancelledTicketId && (
          <TicketCancelledAlert ticketId={cancelledTicketId} />
        )}

        <div className="pb-4 px-10 font-semibold text-5xl text-black/85 mb-4">
          <h1>Your Tickets</h1>
        </div>

        <ul className="px-10 flex gap-20">
          {tickets.map((ticket) => (
            <li key={ticket.id}>
              <div>
                <Drawer>
                  <DrawerTrigger asChild>
                    <button onClick={() => setSelectedTicket(ticket)}>
                      <TicketCard
                        title={ticket.event.title}
                        date={new Date(ticket.event.date).toLocaleDateString()}
                        location={ticket.event.venueInformation.name}
                      >
                        <p className="text-sm text-gray-700">
                          Seat: {ticket.seatNumber}
                        </p>
                      </TicketCard>
                      {/* </Link> */}
                    </button>
                  </DrawerTrigger>
                  <DrawerContent className="bg-gray-950/85 text-white/80 border-4 border-teal-500">
                    {selectedTicket && ( // Conditionally render when a ticket is selected
                      <div className="mx-auto w-full px-20">
                        <DrawerHeader>
                          <DrawerTitle className="text-6xl px-0 tracking-normal">
                            {selectedTicket.event.title}
                          </DrawerTitle>
                        </DrawerHeader>
                        <div className="flex justify-between px-4">
                          <div className="grid gap-1.5 text-md text-white/70 tracking-widest">
                            <img
                              src="/Music_Fest.jpg"
                              alt={selectedTicket.event.title}
                              className="w-60 h-60 rounded-md object-cover"
                            />
                            <h2 className="text-2xl">
                              Artist: {selectedTicket.event.artist || "Unknown"}
                            </h2>
                            <p>
                              Venue:{" "}
                              {selectedTicket.event.venueInformation.name},{" "}
                              {selectedTicket.event.venueInformation.address}
                            </p>
                            <p>
                              Date:{" "}
                              {new Date(
                                selectedTicket.event.date
                              ).toLocaleDateString()}
                            </p>
                            <p>
                              Starts At:{" "}
                              {new Date(
                                selectedTicket.event.startTime
                              ).toLocaleTimeString()}
                            </p>
                          </div>

                          <div className="tracking-widest">
                            <h2 className="font-semibold text-3xl pb-1.5 tracking-widest">
                              Ticket Details
                            </h2>
                            <div className=" tracking-widest text-md grid gap-1.5">
                              <p>
                                Ticket Holder: {selectedTicket.user.fullName}
                              </p>
                              <p>Ticket ID: {selectedTicket.id}</p>
                              <p>Seat Number: {selectedTicket.seatNumber}</p>
                              <p>Price: ₹{selectedTicket.price}</p>
                              <p>
                                Booked At:{" "}
                                {new Date(
                                  selectedTicket.createdAt
                                ).toLocaleString()}
                              </p>
                              <p>Status: {selectedTicket.status}</p>
                            </div>
                            <div className="flex gap-10 py-4">
                              <Dialog
                                open={isCancelDialogOpen}
                                onOpenChange={setIsCancelDialogOpen}
                              >
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className="text-black hover:bg-teal-700 hover:text-white"
                                    onClick={() => {
                                      // Optionally set the selected ticket here if needed
                                      setIsCancelDialogOpen(true);
                                    }}
                                  >
                                    Cancel Ticket
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="bg-white p-6 rounded-md">
                                  <DialogTitle className="text-3xl text-center tracking-wider font-bold text-black/80">
                                    Cancel Ticket
                                  </DialogTitle>
                                  <DialogDescription className="text-center tracking-wide">
                                    Please provide a reason for cancellation:
                                  </DialogDescription>
                                  <form onSubmit={handleCancelSubmit}>
                                    <input
                                      type="text"
                                      value={cancelReason}
                                      onChange={(e) =>
                                        setCancelReason(e.target.value)
                                      }
                                      placeholder="Cancellation reason"
                                      required
                                      className="border p-2 w-full rounded-md"
                                    />
                                    <div className="flex gap-2 justify-end mt-4">
                                      <Button type="submit">Submit</Button>
                                      <DialogClose asChild>
                                        <Button variant="ghost">Cancel</Button>
                                      </DialogClose>
                                    </div>
                                  </form>
                                </DialogContent>
                              </Dialog>

                              <Button
                                variant="outline"
                                className="text-black hover:bg-teal-700 hover:text-white"
                              >
                                Resell Ticket
                              </Button>
                              {/* </Link> */}
                            </div>
                          </div>
                        </div>
                        <DrawerFooter>
                          <div className="flex justify-end">
                            <DrawerClose asChild>
                              <button
                                onClick={() => setSelectedTicket(null)}
                                className="w-fit text-white/50 hover:underline hover:text-teal-500 focus:outline-none"
                              >
                                Close
                              </button>
                            </DrawerClose>
                          </div>
                        </DrawerFooter>
                      </div>
                    )}
                  </DrawerContent>
                </Drawer>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
