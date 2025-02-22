import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";

// 1. AccordionSection for each filter block
function AccordionSection({ title, defaultOpen = false, children, onClear }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const handleToggle = () => setIsOpen((prev) => !prev);

  return (
    <div className="border-b py-2">
      {/* Header: Title + Clear + Chevron */}
      <div
        className="flex justify-between items-center cursor-pointer"
        onClick={handleToggle}
      >
        <h2 className="text-md tracking-wider font-light">{title}</h2>
        <div className="flex items-center space-x-2">
          {onClear && (
            <button
              onClick={(e) => {
                e.stopPropagation(); // Prevent toggling on clear click
                onClear();
              }}
              className="text-gray-500 font-light tracking-tight text-xs hover:underline"
            >
              Clear
            </button>
          )}
          {isOpen ? <ChevronUp /> : <ChevronDown />}
        </div>
      </div>

      {/* Body: only visible when isOpen is true */}
      {isOpen && <div className="mt-3">{children}</div>}
    </div>
  );
}

// 2. Main Responsive Filters component
export default function ResponsiveFilters() {
  const [isOpen, setIsOpen] = useState(false);

  // Example "clear" callbacks
  const clearDateFilters = () => console.log("Clearing Date Filters...");
  const clearLanguageFilters = () =>
    console.log("Clearing Language Filters...");
  const clearCategories = () => console.log("Clearing Categories...");
  const clearMoreFilters = () => console.log("Clearing More Filters...");
  const clearPriceFilters = () => console.log("Clearing Price Filters...");

  return (
    <div className="py-4 ">
      {/* MOBILE: "Filter" button (hidden on md and up) */}
      <button
        onClick={() => setIsOpen(true)}
        className="md:hidden px-4 py-2 bg-teal-500 text-white rounded-md"
      >
        Filters
      </button>

      {/* DESKTOP: Static sidebar (block on md+, hidden behind a drawer on mobile) */}
      <div
        className={`
          fixed top-0 right-0 h-full w-64 bg-white shadow-md p-4
          transform transition-transform duration-300 z-50
          ${isOpen ? "translate-x-0" : "translate-x-full"}
          md:static md:translate-x-0 md:w-auto md:h-auto md:block
        `}
      >
        {/* Header (visible on mobile) */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <h1 className="text-2xl font-bold">Filters</h1>
          <button onClick={() => setIsOpen(false)}>
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Actual filters */}
        <div className="space-y-4">
          <AccordionSection title="Date" onClear={clearDateFilters}>
            <div className="flex flex-wrap gap-2 mb-2 ">
              <button className="text-sm border border-teal-500 text-teal-500 px-2 py-0.5 rounded-md">
                Today
              </button>
              <button className="text-sm border border-teal-500 text-teal-500 px-2 py-0.5 rounded-md">
                Tomorrow
              </button>
              <button className="text-sm border border-teal-500 text-teal-500 px-2 py-0.5 rounded-md">
                This Weekend
              </button>
            </div>
            <div>
              <label className="inline-flex items-center space-x-2">
                <input type="checkbox" className="form-checkbox text-red-500" />
                <span className="text-sm text-gray-700">Date Range</span>
              </label>
            </div>
          </AccordionSection>

          <AccordionSection title="Languages" onClear={clearLanguageFilters}>
            <div className="flex flex-wrap gap-2">
              <button className="text-sm border border-teal-500 text-teal-500 px-2 py-0.5 rounded-md">
                English
              </button>
              <button className="text-sm border border-teal-500 text-teal-500 px-2 py-0.5 rounded-md">
                Hindi
              </button>
              <button className="text-sm border border-teal-500 text-teal-500 px-2 py-0.5 rounded-md">
                Punjabi
              </button>
            </div>
          </AccordionSection>

          <AccordionSection title="Categories" onClear={clearCategories}>
            <p className="text-gray-700">Place your category options here.</p>
          </AccordionSection>

          <AccordionSection title="More Filters" onClear={clearMoreFilters}>
            <p className="text-gray-700">
              Place your additional filter options here.
            </p>
          </AccordionSection>

          <AccordionSection title="Price" onClear={clearPriceFilters}>
            <p className="text-gray-700">Price filter options go here.</p>
          </AccordionSection>
        </div>
      </div>
    </div>
  );
}
