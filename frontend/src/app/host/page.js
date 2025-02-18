"use client";
import Link from "next/link";
import Footer from "@/components/Footer";

// Example Next.js component
export default function Page() {
  return (
    <div>
      <div className=" bg-gradient-to-br from-gray-900 via-teal-600 to-purple-900">
        <div className="container mx-auto px-8 py-56">
          <div className="mt-18">
            <h1 className="text-7xl tracking-wider text-white/80 mb-2">
              Host Your Event{" "}
              <span className="font-light text-8xl bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
                Faster{" "}
              </span>
              <span className="">With </span>
            </h1>
            <span className="text-9xl font-extralight bg-gradient-to-r from-rose-400 to-red-500 bg-clip-text text-transparent">
              Ticketo
            </span>
          </div>

          <Link href="/blog" className="">
            <button className="mt-2 py-6 w-fit text-white rounded-full bg-opacity-0 border border-white hover:bg-white/90 hover:text-teal-700">
              <h1 className="text-3xl px-6">Learn More</h1>
            </button>
          </Link>
        </div>
      </div>
      <div className="bg-white">
        <div className="mx-9">
          <div className=" mt-16 h-10 border-2 border-b-0 rounded-t-xl border-black "></div>
          <div className="px-6 text-gray-900">
            <h1 className=" font-light text-5xl tracking-wide">
              Earn the <span className="text-teal-700 text-6xl ">True</span>{" "}
              value of your{" "}
              <span className="text-red-600 text-6xl">Ticket</span>
            </h1>
          </div>
          <div className="   h-10 border-2 border-t-0 rounded-b-xl border-black "></div>
        </div>
        <div className="mx-9">
          <div className=" mt-16 h-10 border-2 border-b-0 rounded-t-xl border-black "></div>
          <div className="px-6 text-gray-900">
            <h1 className=" font-light text-5xl tracking-wide">
              Let the <span className="text-teal-700 text-6xl ">Buyers</span> be
              your <span className="text-red-600 text-6xl">Sellers</span>
            </h1>
          </div>
          <div className="   h-10 border-2 border-t-0 rounded-b-xl border-black "></div>
        </div>
      </div>
      {/* <Footer /> */}
    </div>
  );
}
