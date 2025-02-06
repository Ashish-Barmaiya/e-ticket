"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SignInSignUp from "@/components/SignInSignUp";
import SearchBar from "./SearchBar";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSignIn, setSignInOpen] = useState(false); // State for sign-in dialog
  const [openSignUp, setSignUpOpen] = useState(false); // State for sign-up dialog
  const [query, setQuery] = useState("");

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <nav className="fixed px-10 top-8 left-0 w-full bg-white backdrop-blur-md z-40 p-4 shadow-sm font-sans h-16">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and Search Bar Container */}
          <div className="flex content-start items-center space-x-2">
            {" "}
            {/* Flex container for logo and search bar */}
            {/* Logo */}
            <div className="text-teal-600 text-3xl font-semibold">
              <Link href="/">
                <h1>ticketo</h1>
              </Link>
            </div>
            {/* Search Bar */}
            <div className="px-2">
              <SearchBar onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="block lg:hidden">
            <button onClick={toggleMenu} className="text-white">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="h-6 w-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                ></path>
              </svg>
            </button>
          </div>

          {/* Navbar Links */}
          <div className={`lg:flex space-x-8 ${isOpen ? "block" : "hidden"}`}>
            <Link href="/api/events">
              <button className="text-gray-800 hover:text-teal-600 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full text-lg px-1">
                Events
              </button>
            </Link>
            <Link href="/api/host">
              <button className="text-gray-800 hover:text-teal-600 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full text-lg px-1">
                Host an Event
              </button>
            </Link>
            <Link href="/api/resell-tickets">
              <button className="text-gray-800 hover:text-teal-600 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full text-lg px-1">
                Sell Tickets
              </button>
            </Link>
          </div>

          {/* Sign In Button */}
          <div className={`lg:flex space-x-6 ${isOpen ? "block" : "hidden"} `}>
            <Button
              variant="outline"
              className="text-md bg-teal-600 text-white hover:text-teal-600 hover:bg-white hover:border-teal-500 transition duration-300"
              onClick={() => setSignInOpen(true)} // Open sign-in dialog
            >
              Sign In
            </Button>
          </div>
        </div>
      </nav>

      {/* Render SignInSignUp Component */}
      <SignInSignUp
        openSignIn={openSignIn}
        setSignInOpen={setSignInOpen}
        openSignUp={openSignUp}
        setSignUpOpen={setSignUpOpen}
      />
    </>
  );
};

export default Navbar;
