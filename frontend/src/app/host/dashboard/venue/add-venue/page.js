// src/app/host/dashboard/venue/add-venue/page.js
"use client";

import React from "react";
import AddVenueForm from "../../../../../components/host/dashboard/venue/AddVenue";

export default function AddVenuePage() {
  return (
    <div className="mt-16 ">
      <div className="container mx-auto py-5 px-4 ">
        <h1 className="text-2xl font-bold mb-4">Add Venue</h1>
        <AddVenueForm onClose={() => {}} />
      </div>
    </div>
  );
}
