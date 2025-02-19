"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef, useEffect, useState } from "react";

const HomeCarousal = () => {
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
    <>
      <div className="mt-8">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={20}
          slidesPerView={1}
          // pagination={{ clickable: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          className="rounded-2xl overflow-hidden h-full"
          onSwiper={(swiper) => {
            swiperRef.current = { swiper };
            setSwiperInstance(swiper);
          }}
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="bg-opacity-0 text-white/95 rounded-2xl flex flex-col justify-center">
                <h2 className="text-8xl py-2 tracking-wider bg-gradient-to-r from-teal-300 to-teal-500 bg-clip-text text-transparent">
                  {slide.title}
                </h2>
                <p className="mt-4 text-3xl text-white/85 tracking-wider px-2">
                  {slide.description}
                </p>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </>
  );
};

export default HomeCarousal;
