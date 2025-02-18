"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Dialog from "./Dialog";
import { MapPin } from "lucide-react"; // Import from Lucide icons (or use an image)

const CitySearch = () => {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && window.google) {
      const input = document.getElementById("citySearch");
      new google.maps.places.Autocomplete(input, { types: ["(cities)"] });
    }
  }, [isOpen]);

  const handleSearch = () => {
    const city = document.getElementById("citySearch").value;
    if (city) router.push(`/?city=${encodeURIComponent(city)}`);
    setIsOpen(false);
  };

  return (
    <>
      {/* Button to open dialog */}
      <button
        onClick={() => setIsOpen(true)}
        className="flex items-center tracking-wider font-extralight text-white rounded-md hover:text-gray-950"
      >
        Select Your City
        <MapPin className="w-10 h-5 text-white/90 hover:text-gray-950" />{" "}
        {/* Map Icon */}
      </button>

      {/* Custom Dialog */}
      <Dialog isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <div className="flex items-center justify-center gap-2 mb-2">
          <h2 className="text-lg font-semibold">Search for a City</h2>
        </div>
        <div className="flex gap-2">
          <input
            id="citySearch"
            type="text"
            placeholder="Enter a city..."
            className="p-2 border rounded-md w-full"
          />
          <button
            onClick={handleSearch}
            className="p-2 bg-teal-600 hover:bg-teal-500 transition duration-300 text-white rounded-md"
          >
            Search
          </button>
        </div>
        {/* Google Maps API script */}
        <script
          async
          src={`https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_API_KEY}&libraries=places`}
        ></script>
      </Dialog>
    </>
  );
};

export default CitySearch;
