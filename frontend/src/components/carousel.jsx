"use client";

import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel";

const CarouselComponent = () => {
  const [api, setApi] = React.useState(null);
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const totalSlides = 5; // Total number of slides

  // Auto-play functionality
  React.useEffect(() => {
    if (!api) return;

    const interval = setInterval(() => {
      api.scrollNext();
    }, 3000); // Change slide every 3 seconds

    return () => clearInterval(interval);
  }, [api]);

  // Handle previous button click
  const handlePrevious = () => {
    if (api) {
      if (currentSlide === 0) {
        api.scrollTo(totalSlides - 1); // Go to the last slide if on the first slide
      } else {
        api.scrollPrev();
      }
    }
  };

  // Handle next button click
  const handleNext = () => {
    if (api) {
      api.scrollNext();
    }
  };

  // Update current slide when the carousel moves
  React.useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrentSlide(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="  w-full max-w-full h-[500] flex justify-center items-center mt-24">
      {/* Inner carousel container with 80% width */}
      <Carousel className="w-4/5 h-full" setApi={setApi}>
        <CarouselContent>
          {Array.from({ length: totalSlides }).map((_, index) => (
            <CarouselItem key={index} className="flex justify-center">
              <div className="p-2 w-full flex justify-center">
                {/* Card takes full width of the parent */}
                <Card className="w-full max-w-full h-80 mx-auto">
                  <CardContent className="flex items-center justify-center h-full p-6 bg-white rounded-lg shadow-lg font-sans text-xl">
                    <h1>Don't Just Buy Tickets</h1>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>

        {/* Navigation buttons inside the carousel container */}
        <div className="absolute top-1/2 left-0 transform -translate-y-1/2">
          <CarouselPrevious
            className="text-teal-400 bg-text rounded-full p-2 shadow-lg"
            onClick={handlePrevious}
          />
        </div>
        <div className="absolute top-1/2 right-0 transform -translate-y-1/2">
          <CarouselNext
            className="text-teal-400 bg-text rounded-full p-2 shadow-lg"
            onClick={handleNext}
          />
        </div>
      </Carousel>
    </div>
  );
};

export default CarouselComponent;
