import React from "react";
import Link from "next/link";
import FilterDropdown from "./FilterDropdown";
import EventCard from "../custom/EventCard";

const EventsPageBodyComponent = ({ events }) => {
  // Helper function to format the date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const weekday = date.toLocaleDateString("en-US", { weekday: "short" });
    const day = date.getDate();
    const month = date.toLocaleDateString("en-US", { month: "long" });
    const year = date.getFullYear();
    return `${weekday}, ${day} ${month} ${year}`;
  };
  return (
    <div className="flex items-start space-x-6 mt-14 ">
      <div className="w-[25%] grid gap-0">
        <h2 className="text-2xl font-semibold tracking-wide">Filters</h2>
        <FilterDropdown />
      </div>
      <div className="w-[75%]">
        {/* use event card here */}
        <h2 className="text-3xl font-semibold  py-0">Upcoming Events</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4 ">
          {events.toReversed().map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              image={event.posterImage}
              title={event.title}
              artist={event.artist}
              date={formatDate(event.date)}
              venue={event.venueInformation.name}
              city={event.venueInformation.city}
              price={event.price}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventsPageBodyComponent;
