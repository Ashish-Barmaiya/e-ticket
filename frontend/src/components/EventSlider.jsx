"use client";

import Link from "next/link";

const EventSlider = () => {
  const events = [
    {
      title: "Music Fest 2025",
      date: "March 10, 2025",
      location: "Mumbai, India",
      image: "/Music_Fest.jpg",
      link: "/events/music-fest-2025",
    },
    {
      title: "Tech Conference",
      date: "April 5, 2025",
      location: "Bangalore, India",
      image: "Tech_Event.jpg",
      link: "/events/tech-conference",
    },
    {
      title: "Food Carnival",
      date: "May 20, 2025",
      location: "Delhi, India",
      image: "Food_Event.jpg",
      link: "/events/food-carnival",
    },
    {
      title: "Startup Expo",
      date: "June 15, 2025",
      location: "Hyderabad, India",
      image: "Startup_Event.jpg",
      link: "/events/startup-expo",
    },
    {
      title: "Art & Culture Night",
      date: "July 8, 2025",
      location: "Chennai, India",
      image: "ArtCulture_Event.jpg",
      link: "/events/art-culture-night",
    },
  ];

  return (
    <div className="w-full mt-12 pb-4 ">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 px-1 pt-1 rounded-md">
        Upcoming Events
      </h2>

      {/* Horizontal Scroll Wrapper */}
      <div className="relative w-full overflow-hidden">
        <div className="flex gap-5 overflow-x-auto scroll-smooth scrollbar-hide">
          {events.map((event, index) => (
            <Link key={index} href={event.link} passHref>
              <div
                className="min-w-[300px] h-[400px] bg-gray-900 text-white rounded-lg shadow-lg p-4 flex flex-col justify-end transform transition-all duration-300 ease-in-out hover:scale-105 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
                style={{
                  backgroundImage: `url(${event.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }}
              >
                {/* Dark overlay with text */}
                <div className="bg-black/60 p-3 rounded-lg">
                  <h3 className="text-xl font-semibold">{event.title}</h3>
                  <p className="text-sm text-gray-300">{event.date}</p>
                  <p className="text-sm text-gray-400">{event.location}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EventSlider;
