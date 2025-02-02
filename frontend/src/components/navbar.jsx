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
      <nav className="fixed top-0 left-0 w-full bg-white backdrop-blur-md z-50 p-4 shadow-md font-sans">
        <div className="container mx-auto flex justify-between items-center px-3">
          {/* Logo and Search Bar Container */}
          <div className="flex content-start items-center space-x-2">
            {" "}
            {/* Flex container for logo and search bar */}
            {/* Logo */}
            <div className="text-teal-600 text-3xl font-semibold px-2">
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
          <div className={`lg:flex space-x-6 ${isOpen ? "block" : "hidden"}`}>
            <Link href="/api/events">
              <button className="text-gray-700 hover:text-teal-400 transition duration-300 text-lg px-4">
                Events
              </button>
            </Link>
            <Link href="/api/host">
              <button className="text-gray-700 hover:text-teal-400 transition duration-300 text-lg px-4">
                Host an Event
              </button>
            </Link>
            <Link href="/api/resell-tickets">
              <button className="text-gray-700 hover:text-teal-400 transition duration-300 text-lg px-4">
                Sell Tickets
              </button>
            </Link>
          </div>

          {/* Sign In and Sign Up Buttons */}
          <div
            className={`lg:flex space-x-6 ${isOpen ? "block" : "hidden"} px-3`}
          >
            <Button
              variant="outline"
              className="bg-teal-600 text-white hover:text-teal-500 hover:white transition duration-300"
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
