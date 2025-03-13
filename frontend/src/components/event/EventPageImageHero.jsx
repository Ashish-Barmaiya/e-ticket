"use client";
import { motion } from "framer-motion";
import React from "react";
import { useState } from "react";
import { ImagesSlider } from "@/components/ui/images-slider";
import SearchBar from "../SearchBar";
import CitySearch from "../CitySearch";
import BrowseCategoriesDropdown from "../BrowseCategoriesDropdown";

export default function EventPageImageHero() {
  const images = [
    "/event/movie_theatre_1.jpg",
    "/event/concert.jpg",
    "/event/cricket_2.jpg",
    "/event/art_workshop.jpg",
  ];

  const [searchTerm, setSearchTerm] = useState("");

  const handleSearch = (query) => {
    setSearchTerm(query);
    // Here you can trigger filtering of your events,
    // or call an API to fetch matching events based on `query`
  };
  return (
    <ImagesSlider className="h-[30rem]" images={images}>
      <motion.div
        initial={{
          opacity: 0,
          y: -80,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.6,
        }}
        className="z-50 flex flex-col justify-center items-center"
      >
        <motion.p className="font-bold text-xl md:text-6xl text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-400 py-4">
          Find the best Events <br /> near you
        </motion.p>

        <div className="flex justify-center gap-2 w-full max-w-3xl mx-auto">
          <CitySearch />
          <SearchBar onSearch={handleSearch} />
          {/* <BrowseCategoriesDropdown /> */}
        </div>
      </motion.div>

      {/* Scroll Down Indicator
      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-50"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-8 h-8 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </motion.div> */}
    </ImagesSlider>
  );
}
