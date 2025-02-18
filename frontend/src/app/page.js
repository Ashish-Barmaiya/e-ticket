"use client";

import Footer from "../components/Footer";
import CarouselWithSidebar from "../components/CarouselWithSidebar.jsx";
import EventSlider from "../components/EventSlider";
import MainHero from "../components/home/MainHero";

export default function Page() {
  return (
    <div>
      {/* <div className="px-10"> */}
      <div>
        <MainHero />
        {/* <CarouselWithSidebar /> */}
      </div>
      <div className="bg-white">
        <div className="mx-9 mt-28">
          <div className=" mt-16 h-10 border-2 border-b-0 rounded-t-xl border-black/80 "></div>
          <div className="px-6 text-gray-800">
            <h1 className=" font-light text-5xl tracking-wide">
              Resell <span className="text-teal-700 text-6xl ">Tickets</span>{" "}
              and earn <span className="text-red-600 text-6xl">Easily</span>
            </h1>
          </div>
          <div className="   h-10 border-2 border-t-0 rounded-b-xl border-black/80 "></div>
        </div>
        <div className="mx-9 ">
          <div className=" mt-16 h-10 border-2 border-b-0 rounded-t-xl border-black/80 "></div>
          <div className="px-6 text-gray-800">
            <h1 className=" font-light text-5xl tracking-wide">
              Earn the <span className="text-teal-700 text-6xl ">True </span>
              value of your{" "}
              <span className="text-red-600 text-6xl">Ticket</span>
            </h1>
          </div>
          <div className="   h-10 border-2 border-t-0 rounded-b-xl border-black/80 "></div>
        </div>
        <div className="mx-9 mb-28">
          <div className=" mt-16 h-10 border-2 border-b-0 rounded-t-xl border-black/80 "></div>
          <div className="px-6 text-gray-800">
            <h1 className=" font-light text-5xl tracking-wide">
              Quick and <span className="text-teal-700 text-6xl ">Safe </span>
              e-kyc using <span className="text-red-600 text-6xl">Aadhaar</span>
            </h1>
          </div>
          <div className="   h-10 border-2 border-t-0 rounded-b-xl border-black/80 "></div>
        </div>
      </div>
      {/* </div> */}
      <div className="py-6 bg-lime-50/60">
        <div className="px-10">
          <EventSlider />
        </div>
      </div>

      <div>{/* <Footer /> */}</div>
    </div>
  );
}
