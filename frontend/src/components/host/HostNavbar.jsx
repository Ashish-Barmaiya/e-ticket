// Navbar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SearchBar from "../SearchBar";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setHost } from "../../redux/hostSlice";
import HostSignInSignUp from "../host/HostSignInSignUp"; // Import the SignInSignUp component

const HostNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const host = useAppSelector((state) => state.host.host); // Access user state from Redux
  const [activeDialog, setActiveDialog] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check for host in localStorage on component mount
  useEffect(() => {
    const storedHost = localStorage.getItem("host");
    if (storedHost) {
      dispatch(setHost(JSON.parse(storedHost)));
    }
  }, [dispatch]);

  // Update localStorage when host changes
  useEffect(() => {
    if (host) {
      localStorage.setItem("host", JSON.stringify(host));
    } else {
      localStorage.removeItem("host");
    }
  }, [host]);

  return (
    <>
      <nav className="fixed px-10 top-4 left-0 w-full bg-opacity-0 z-40 font-sans h-16">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and Search Bar Container */}
          <div className="flex content-start items-center space-x-2">
            {/* Logo */}
            <div className=" bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent text-4xl tracking-wider font-light">
              <Link href="/">ticketo</Link>
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
          <div
            className={`lg:flex space-x-8 ${
              isOpen ? "block" : "hidden"
            } bg-black/80 py-3 px-8 rounded-full`}
          >
            <Link href="/host/dashboard/list-new-event">
              <button className="text-white tracking-widest hover:text-teal-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full text-lg px-1">
                List Your Event
              </button>
            </Link>
            <Link href="/host/dashboard/venue/add-venue">
              <button className="text-white tracking-widest hover:text-teal-300 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full text-lg px-1">
                Add Venue
              </button>
            </Link>
          </div>

          {/* Sign In/Profile Button */}
          <div
            className={`lg:flex space-x-6 ${isOpen ? "block" : "hidden"} py-3 `}
          >
            {host ? (
              <>
                <Link href="/host/dashboard">
                  <Button>Host Profile</Button>
                </Link>
              </>
            ) : (
              <Button
                className="tracking-wide hover:text-teal-600 hover:bg-white/95 hover:border-teal-500 transition duration-300"
                onClick={() => setActiveDialog("signIn")} // Open sign-in dialog
              >
                Sign In as Host
              </Button>
            )}
          </div>
          {/* <div>
            <Button onClick={() => setActiveDialog("signIn")}>
              Sign In as Host
            </Button>
          </div> */}
        </div>
      </nav>
      {/* Render the SignInSignUp component and pass the activeDialog state */}
      <HostSignInSignUp
        activeDialog={activeDialog}
        setActiveDialog={(newState) => setActiveDialog(newState)}
      />
    </>
  );
};

export default HostNavbar;
