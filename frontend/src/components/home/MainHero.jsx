"use client";
import Link from "next/link";
import HomeCarousal from "./HomeCarousal";

// Example Next.js component
export default function Hero() {
  return (
    <div>
      <div
        className="bg-contain bg-center min-h-screen"
        style={{
          backgroundImage: "url('Hero_img_4.jpg')",
        }}
      >
        <div className="container mx-auto px-8 py-56">
          <HomeCarousal />

          <Link href="/blog" className="">
            <button className="mt-8 py-4 w-fit text-white/70 rounded-lg bg-opacity-0 border border-white/70 hover:bg-black/30 hover:text-teal-700">
              <h1 className="text-3xl px-6">Learn More</h1>
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
