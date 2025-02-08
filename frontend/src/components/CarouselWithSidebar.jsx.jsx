"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef, useEffect, useState } from "react";

const CarouselWithSidebar = () => {
  const slides = [
    {
      title: "Don't Just Buy Tickets.",
      description: "Resell authorized tickets on Ticketo.",
    },
    {
      title: "Secure Ticketing",
      description:
        "Tickets linked to Aadhaar-based UUI to prevent black market sales.",
    },
    {
      title: "Resale on Our Platform",
      description:
        "Resell tickets exclusively on Ticketo with benefits for organizers.",
    },
    {
      title: "Seamless Booking",
      description:
        "Book, manage, and resell tickets with ease on our platform.",
    },
  ];

  const infoCards = [
    {
      title: "Fast Booking",
      content: "Instant ticket booking with secure payment options.",
    },
    {
      title: "Verified Resale",
      content: "Resale tickets verified and linked to user identity.",
    },
    {
      title: "Quick E-Kyc",
      content: "Verify your account in few steps using your Aadhaar",
    },
    {
      title: "Exclusive Deals",
      content: "Get exclusive discounts and early access to events.",
    },
    {
      title: "Customer Support",
      content: "24/7 support for any issues related to your bookings.",
    },
  ];

  const swiperRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    if (swiperRef.current && swiperRef.current.swiper) {
      setSwiperInstance(swiperRef.current.swiper);
    }
  }, []); // Empty dependency array means this runs only once after mount

  const goPrev = () => {
    if (swiperInstance) {
      swiperInstance.slidePrev();
    }
  };

  const goNext = () => {
    if (swiperInstance) {
      swiperInstance.slideNext();
    }
  };

  return (
    <div className="flex pl-0 w-full h-[500px] gap-6 mt-24 pt-4">
      {/* Left - Carousel (70%) */}
      <div className="relative w-[70%] h-full border-6 border-transparent bg-gradient-to-r from-teal-400 to-red-600/85 bg-clip-padding rounded-2xl p-2">
        <div className="w-full h-full bg-white rounded-xl p-2 shadow-lg">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="rounded-2xl overflow-hidden h-full"
            onSwiper={(swiper) => {
              swiperRef.current = { swiper };
              setSwiperInstance(swiper);
            }}
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="bg-lime-50/50 text-gray-800 font-sans p-10 rounded-2xl shadow-lg  flex flex-col justify-center h-full">
                  <h2 className="text-8xl font-semibold">{slide.title}</h2>
                  <p className="mt-4 text-2xl px-2">{slide.description}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
          {/* Navigation Buttons at the Bottom */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center gap-20 z-10">
            <button
              className="bg-white/70 text-teal-500 p-2 rounded-full hover:bg-teal-500 hover:text-white transition shadow-md"
              onClick={() => swiperRef.current?.swiper?.slidePrev()}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              className="bg-white/70 text-teal-500 p-2 rounded-full hover:bg-teal-500 hover:text-white transition shadow-md"
              onClick={() => swiperRef.current?.swiper?.slideNext()}
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Right - Scrollable Info Cards (30%) */}

      <div className="w-[30%] h-full overflow-y-auto px-0 bg-white text-white rounded-lg space-y- scrollbar-hide">
        <div className="bg-lime-50/60 rounded-md pr-0">
          {infoCards.map((card, index) => (
            <div
              key={index}
              className="p-4 m-2 h-[170px] bg-gray-800 rounded-lg shadow-md"
            >
              <h3 className="text-lg font-semibold text-teal-400">
                {card.title}
              </h3>
              <p className="text-gray-300 mt-2">{card.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CarouselWithSidebar;
