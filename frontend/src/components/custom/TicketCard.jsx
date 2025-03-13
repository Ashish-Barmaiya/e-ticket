import React from "react";

const TicketCard = ({ title, subtitle, date, location, children }) => {
  return (
    <div className="relative w-auto min-w-60 bg-white border border-teal-300 rounded-lg overflow-hidden shadow-lg p-6 hover:shadow-lg hover:shadow-black/50 transition duration-300 ease-in-out">
      {/* Left notch */}
      <div className="absolute left-0 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 bg-white border border-teal-400 rounded-full" />
      </div>
      {/* Right notch */}
      <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2">
        <div className="w-8 h-8 bg-white border border-teal-400 rounded-full" />
      </div>
      {/* Ticket Content */}
      <div className="flex flex-col space-y-2">
        {title && <h2 className="text-xl font-bold">{title}</h2>}
        {subtitle && <p className="text-gray-600">{subtitle}</p>}
        {date && <p className="text-sm text-gray-500">{date}</p>}
        {location && <p className="text-sm text-gray-500">{location}</p>}
        {children}
        <p className="text-sm text-light text-red-400">Click to Open</p>
      </div>
    </div>
  );
};

export default TicketCard;
