"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { EventCreatedAlert } from "@/components/custom/AlertComponents";

// Define a Zod schema for the event data (poster removed)
const eventSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  artist: z.string().optional(),
  venue: z.string().min(1, "Venue is required"),
  date: z.string().min(1, "Date is required"),
  startTime: z.string().min(1, "Start time is required"),
  endTime: z.string().optional(),
  totalTickets: z.preprocess(
    (val) => Number(val),
    z.number().int().positive("Total tickets must be a positive number")
  ),
  price: z.preprocess(
    (val) => Number(val),
    z.number().nonnegative("Price must be a non-negative number")
  ),
  userEkycRequired: z.boolean().optional(),
});

export default function NewEvent() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    artist: "",
    venue: "",
    date: "",
    startTime: "",
    endTime: "",
    totalTickets: "",
    price: "",
    userEkycRequired: false,
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const router = useRouter();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Validate the form data using Zod
    const validationResult = eventSchema.safeParse(formData);
    if (!validationResult.success) {
      const errorMessages = validationResult.error.errors
        .map((err) => err.message)
        .join(", ");
      setError(errorMessages);
      return;
    }

    const validatedData = validationResult.data;

    try {
      const response = await fetch("/api/host/dashboard/list-new-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(validatedData),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Submission error: ${errorText}`);
      }

      const data = await response.json();

      if (data.success) {
        setSuccess("Event created successfully!");
        router.push("/host/dashboard"); // Redirect to events page
        toast.success("Event created successfully!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      } else {
        setError(data.message || "Failed to create event");
      }
    } catch (submissionError) {
      console.error("Error during event creation:", submissionError);
      setError("An error occurred while creating the event. Please try again.");
    }
  };

  return (
    <div className="container mt-12 mx-auto py-5 px-4">
      <h1 className="text-2xl font-bold mb-4">Create New Event</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            placeholder="Name of your event"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded tracking-wider"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea
            name="description"
            placeholder="Describe your event (Optional)"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded tracking-wider"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Artist</label>
          <input
            type="text"
            name="artist"
            placeholder="Name of Artists performing (Optional)"
            value={formData.artist}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded tracking-wider"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Venue <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="venue"
            placeholder="Name of the venue"
            value={formData.venue}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded tracking-wider"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Date <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded tracking-wider"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Start Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded tracking-wider"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            End Time <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded tracking-wider"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Total Tickets <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="totalTickets"
            placeholder="Total number of tickets"
            value={formData.totalTickets}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded tracking-wider"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">
            Price <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            name="price"
            placeholder="Price of a single ticket"
            value={formData.price}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded tracking-wider"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">User EKYC Required</label>
          <input
            type="checkbox"
            name="userEkycRequired"
            checked={formData.userEkycRequired}
            onChange={handleChange}
            className="mr-2 leading-tight"
          />
        </div>
        <Button type="submit" className="tracking-wider">
          Create Event
        </Button>
      </form>
    </div>
  );
}
