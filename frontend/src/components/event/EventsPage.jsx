import { useState } from "react";
import React from "react";
import SearchBar from "../SearchBar";
import CitySearch from "../CitySearch";
import BrowseCategoriesDropdown from "../BrowseCategoriesDropdown";

const EventsPageComponent = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (query) => {
    setSearchTerm(query);
    // Here you can trigger filtering of your events,
    // or call an API to fetch matching events based on `query`
  };
  return (
    <div>
      {/* Hero banner */}
      <div className="container mx-auto min-h-48">
        <h1 className="text-4xl text-center py-4 font-light tracking-wide">
          <span>
            Find the Best{" "}
            <span className="text-6xl tracking-tighter text-teal-600">
              Events
            </span>{" "}
            Near you
          </span>
        </h1>
        <div className="grid gap-2">
          <div className="flex justify-center gap-2">
            <CitySearch />
            <SearchBar onSearch={handleSearch} />
            <BrowseCategoriesDropdown />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventsPageComponent;
