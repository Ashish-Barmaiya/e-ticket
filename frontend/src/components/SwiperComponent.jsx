"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Carousel = () => {
  const slides = [
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

  return (
    <div className=" relative w-full max-w-4xl h-[500px] flex justify-center items-center mt-24 py-4">
      {/* Swiper Carousel with a Gap Between Border and Content */}
      <div className="relative w-full h-full border-6 border-transparent bg-gradient-to-r from-red-400 to-red-600/85 bg-clip-padding rounded-2xl p-2">
        <div className="w-full h-full bg-white rounded-xl p-2 shadow-lg">
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            spaceBetween={20}
            slidesPerView={1}
            navigation={{
              prevEl: ".swiper-button-prev",
              nextEl: ".swiper-button-next",
            }}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            className="rounded-2xl overflow-hidden h-full relative"
          >
            {slides.map((slide, index) => (
              <SwiperSlide key={index}>
                <div className="bg-teal-600/70 text-white p-10 rounded-2xl shadow-lg text-center flex flex-col justify-center h-full">
                  <h2 className="text-3xl font-bold">{slide.title}</h2>
                  <p className="mt-4 text-lg">{slide.description}</p>
                </div>
              </SwiperSlide>
            ))}
            {/* Navigation Buttons Inside the Swiper */}
            <button className="swiper-button-prev absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/70 text-teal-500 p-3 rounded-full hover:bg-teal-500 hover:text-white transition shadow-md">
              <ChevronLeft size={28} />
            </button>
            <button className="swiper-button-next absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/70 text-teal-500 p-3 rounded-full hover:bg-teal-500 hover:text-white transition shadow-md">
              <ChevronRight size={28} />
            </button>
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default Carousel;
