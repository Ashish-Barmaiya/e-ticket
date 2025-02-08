"use client";

import { useState } from "react";
import Link from "next/link";
import CitySearch from "./CitySearch";

const SecondaryNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed px-10 top-0 left-0 w-full bg-teal-700 p-1 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <CitySearch />
          </div>
          <div className="content-right">
            <div>
              <Link href="">
                <button className="text-white hover:text-gray-800 px-2">
                  About
                </button>
              </Link>
              <Link href="">
                <button className="text-white hover:text-gray-800 px-2">
                  Contact
                </button>
              </Link>
              <Link href="">
                <button className="text-white hover:text-gray-800 px-2">
                  Support
                </button>
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};

export default SecondaryNavbar;
