import Navbar from "../components/navbar";
import SecondaryNavbar from "../components/SecondaryNavbar";
import Footer from "../components/Footer";
import CarouselWithSidebar from "../components/CarouselWithSidebar.jsx";
import EventSlider from "../components/EventSlider";

export default function Page() {
  return (
    <div>
      <div className="px-10">
        <SecondaryNavbar />
        <Navbar />
        <div>
          <CarouselWithSidebar />
        </div>
      </div>
      <div className="">
        <div className="px-10">
          <EventSlider />
        </div>
      </div>

      <div>
        <Footer />
      </div>
    </div>
  );
}
