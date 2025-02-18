// Navbar.jsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import SearchBar from "./SearchBar";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setUser } from "../redux/userSlice";
import SignInSignUp from "./SignInSignUp"; // Import the SignInSignUp component
import UserProfileSheet from "./UserProfileSheet";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user); // Access user state from Redux
  const [activeDialog, setActiveDialog] = useState(null);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Check for user in localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  // Update localStorage when user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return (
    <>
      <nav className="fixed px-10 top-4 left-0 w-full bg-opactiy-0 z-40 py-1 font-sans h-16">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo and Search Bar Container */}
          <div className="flex content-start items-center space-x-2">
            {/* Logo */}
            <div className="bg-gradient-to-r from-yellow-300 to-amber-500 bg-clip-text text-transparent text-4xl tracking-wider font-light">
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
          <div
            className={`lg:flex space-x-8 ${
              isOpen ? "block" : "hidden"
            } bg-white/95 py-3 px-5 rounded-full`}
          >
            <Link href="/events">
              <button className="text-gray-800 tracking-widest hover:text-teal-600 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full text-lg px-1">
                Events
              </button>
            </Link>
            <Link href="/host">
              <button className="text-gray-800 tracking-widest hover:text-teal-600 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full text-lg px-1">
                Host an Event
              </button>
            </Link>
            <Link href="/api/resell-tickets">
              <button className="text-gray-800 tracking-widest hover:text-teal-600 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full text-lg px-1">
                Sell Tickets
              </button>
            </Link>
            <Link href="/api/ekyc">
              <button className="text-gray-800 tracking-widest hover:text-teal-600 relative after:content-[''] after:absolute after:left-0 after:bottom-[-2px] after:w-0 after:h-[2px] after:bg-red-600 after:transition-all after:duration-300 hover:after:w-full text-lg px-1">
                E-Kyc
              </button>
            </Link>
          </div>

          {/* Sign In/Profile Button */}
          <div className={`lg:flex space-x-6 ${isOpen ? "block" : "hidden"} `}>
            {user ? (
              <>
                <UserProfileSheet />
              </>
            ) : (
              <Button
                variant="outline"
                className="text-md bg-teal-600 text-white hover:text-teal-600 hover:bg-white hover:border-teal-500 transition duration-300"
                onClick={() => setActiveDialog("signIn")} // Open sign-in dialog
              >
                Sign In
              </Button>
            )}
          </div>
        </div>
      </nav>
      {/* Render the SignInSignUp component and pass the activeDialog state */}
      <SignInSignUp
        activeDialog={activeDialog}
        setActiveDialog={(newState) => setActiveDialog(newState)}
      />
    </>
  );
};

export default Navbar;
