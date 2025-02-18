"use client";
import Link from "next/link";
import HomeCarousal from "./HomeCarousal";

// Example Next.js component
export default function Hero() {
  return (
    <div>
      <div className=" bg-gradient-to-br from-gray-800 via-teal-500 to-purple-700">
        <div className="container mx-auto px-8 py-56">
          <HomeCarousal />

          <Link href="/blog" className="">
            <button className="mt-8 py-6 w-fit text-white rounded-full bg-opacity-0 border border-white hover:bg-white/90 hover:text-teal-700">
              <h1 className="text-3xl px-6">Learn More</h1>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
