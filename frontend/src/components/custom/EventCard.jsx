import Link from "next/link";

const EventCard = ({ id, image, title, artist, date, venue, city, price }) => {
  return (
    <Link href={`/events/${id}/details`} className="block">
      <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white hover:shadow-xl transition duration-300 cursor-pointer">
        <img className="w-full h-48 object-contain" src={image} alt={title} />
        <div className="px-6 py-4">
          <h2 className="font-bold text-xl mb-2">{title}</h2>
          <p className="text-gray-700 text-base">
            {artist && <span className="block">Artist: {artist}</span>}
            {date && <span className="block">{date}</span>}
            {venue && <span className="block">{venue}</span>}
            {/* {city && <span className="block">City: {city}</span>} */}
            {price && <span className="block">₹ {price}</span>}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
