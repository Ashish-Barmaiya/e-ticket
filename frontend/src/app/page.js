"use client";

import { useState } from "react"; // Import useState for state management
import Navbar from "../components/navbar";
import SecondaryNavbar from "../components/SecondaryNavbar";
import SignInSignUp from "../components/SignInSignUp";
import Footer from "../components/Footer";
import CarouselWithSidebar from "../components/CarouselWithSidebar.jsx";
import EventSlider from "../components/EventSlider";

export default function Page() {
  // Define state for openSignIn
  const [openSignIn, setOpenSignIn] = useState(false);

  // Function to toggle the dialog visibility
  const toggleSignInDialog = () => {
    setOpenSignIn(!openSignIn);
  };

  return (
    <div>
      <div className="px-10">
        <SecondaryNavbar />
        <Navbar />
        <button onClick={toggleSignInDialog} className="btn">
          Sign In
        </button>
        <SignInSignUp openSignIn={openSignIn} />{" "}
        {/* Pass the state as a prop */}
        <div>
          <CarouselWithSidebar />
        </div>
      </div>
      <div className="">
        <div className="px-10">
          <EventSlider />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
