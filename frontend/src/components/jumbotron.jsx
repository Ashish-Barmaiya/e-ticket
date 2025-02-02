"use client";

import Image from "next/image";

const Jumbotron = () => {
  return (
    <section className="relative h-screen">
      {/* Single Image */}
      <Image
        src="/Ticketo_logo.jpg"
        alt="Hero Image"
        layout="fill"
        objectFit="cover"
        className="z-0"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent z-10"></div>

      {/* Optional: Add text or buttons on top of the image */}
      <div className="absolute inset-0 flex items-center justify-center z-20">
        {/* <h1 className="text-4xl font-bold text-white text-center">
          Welcome to Our Website
        </h1> */}
      </div>
    </section>
  );
};

export default Jumbotron;
