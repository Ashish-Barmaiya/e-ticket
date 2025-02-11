// "use client";

// import { useEffect, useState } from "react";

// export default function MyTickets() {
//   const [tickets, setTickets] = useState([]);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     const fetchTickets = async () => {
//       try {
//         const response = await fetch("/user/profile/my-tickets", {
//           credentials: "include",
//         });

//         if (!response.ok) throw new Error("Failed to fetch");

//         const data = await response.json();
//         setTickets(data.tickets);
//       } catch (error) {
//         console.error("Fetch error:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchTickets();
//   }, []);

//   if (loading) return <div>Loading tickets...</div>;

//   return (
//     <div>
//       <div className="p-6">
//         <h1 className="text-2xl font-bold mb-4">My Tickets</h1>
//         <div className="space-y-4">
//           {tickets.length > 0 ? (
//             tickets.map((ticket) => (
//               <div key={ticket.id} className="border p-4 rounded-lg">
//                 <h3 className="font-medium">
//                   {ticket.event?.title || "No Title"}
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   {ticket.event?.date
//                     ? new Date(ticket.event.date).toLocaleDateString()
//                     : "No Date"}{" "}
//                   • {ticket.event?.venueInformation?.name || "No Venue"}
//                 </p>
//               </div>
//             ))
//           ) : (
//             <p className="text-gray-500">No tickets found</p>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }
