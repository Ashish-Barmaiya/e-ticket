"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";

// Dropdown options
const seatingLayoutOptions = [
  "theater",
  "stadium",
  "auditorium",
  "classroom",
  "banquet",
  "u-shape",
  "other",
];
const venueTypeOptions = [
  "indoor",
  "outdoor",
  "multi-purpose",
  "cinema",
  "sports",
];

// Zod schema for form validation
const AddVenueFormSchema = z.object({
  name: z
    .string()
    .trim()
    .toLowerCase()
    .nonempty({ message: "Name is required" }),
  address: z
    .string()
    .trim()
    .toLowerCase()
    .nonempty({ message: "Address is required" }),
  city: z
    .string()
    .trim()
    .toLowerCase()
    .nonempty({ message: "City is required" }),
  seatingCapacity: z
    .number({ invalid_type_error: "Seating capacity must be a number" })
    .int({ message: "Value must be an integer" })
    .positive({ message: "Value must be a positive integer" }),
  seatingLayout: z.enum(seatingLayoutOptions, {
    errorMap: () => ({ message: "Select a valid seating layout" }),
  }),
  venueType: z.enum(venueTypeOptions, {
    errorMap: () => ({ message: "Select a valid venue type" }),
  }),
});

const AddVenueForm = ({ onClose }) => {
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(AddVenueFormSchema),
  });

  const onSubmit = async (values) => {
    setIsError(false);
    try {
      const response = await fetch("/api/host/dashboard/venue/add-venue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (!response.ok) {
        setIsError(true);
        toast.error("Failed to add venue. Please try again.", {
          position: "top-right",
          autoClose: 5000,
        });
        return;
      }

      const data = await response.json();

      if (data.success) {
        toast.success("Venue added successfully!", {
          position: "bottom-right",
          autoClose: 3000,
        });
        router.refresh("/host/dashboard/venue");
      } else {
        setIsError(true);
        toast.error(`Error: ${data.message}`, {
          position: "top-right",
          autoClose: 5000,
        });
      }
    } catch (error) {
      setIsError(true);
      toast.error(`Error: ${error.message}`, {
        position: "top-right",
        autoClose: 5000,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {isError && (
        <div className="p-2 rounded bg-red-200 text-red-500">
          An error occurred. Please try again.
        </div>
      )}

      {/* Venue Name */}
      <div>
        <Label htmlFor="name">Venue Name</Label>
        <Input id="name" {...register("name")} placeholder="Enter venue name" />
        {errors.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      {/* Address */}
      <div>
        <Label htmlFor="address">Address</Label>
        <Input
          id="address"
          {...register("address")}
          placeholder="Enter address"
        />
        {errors.address && (
          <p className="text-red-500 text-sm">{errors.address.message}</p>
        )}
      </div>

      {/* City */}
      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" {...register("city")} placeholder="Enter city" />
        {errors.city && (
          <p className="text-red-500 text-sm">{errors.city.message}</p>
        )}
      </div>

      {/* Seating Capacity */}
      <div>
        <Label htmlFor="seatingCapacity">Seating Capacity</Label>
        <Input
          id="seatingCapacity"
          type="number"
          {...register("seatingCapacity", { valueAsNumber: true })}
          placeholder="Enter seating capacity"
        />
        {errors.seatingCapacity && (
          <p className="text-red-500 text-sm">
            {errors.seatingCapacity.message}
          </p>
        )}
      </div>

      {/* Seating Layout Dropdown */}
      <div>
        <Label htmlFor="seatingLayout">Seating Layout</Label>
        <select id="seatingLayout" {...register("seatingLayout")}>
          <option value="">Select seating layout</option>
          {seatingLayoutOptions.map((layout) => (
            <option key={layout} value={layout}>
              {layout.charAt(0).toUpperCase() + layout.slice(1)}
            </option>
          ))}
        </select>
        {errors.seatingLayout && (
          <p className="text-red-500 text-sm">{errors.seatingLayout.message}</p>
        )}
      </div>

      {/* Venue Type Dropdown */}
      <div>
        <Label htmlFor="venueType">Venue Type</Label>
        <select id="venueType" {...register("venueType")}>
          <option value="">Select venue type</option>
          {venueTypeOptions.map((type) => (
            <option key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </option>
          ))}
        </select>
        {errors.venueType && (
          <p className="text-red-500 text-sm">{errors.venueType.message}</p>
        )}
      </div>

      {/* Submit and Cancel Buttons */}
      <div className="flex space-x-4">
        <Button type="submit">Add Venue</Button>
        {onClose && (
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
      </div>
    </form>
  );
};

export default AddVenueForm;
