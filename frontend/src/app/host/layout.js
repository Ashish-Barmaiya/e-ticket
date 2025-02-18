import HostNavbar from "../../components/host/HostNavbar";
import Footer from "@/components/Footer";

export default function HostLayout({ children }) {
  return (
    <div>
      <HostNavbar />

      {children}
      {/* <Footer /> */}
    </div>
  );
}
