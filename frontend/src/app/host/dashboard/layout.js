import HostSidebar from "../../../components/host/dashboard/HostSidebar";
import "../../globals.css";

export default function ProfileLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full">
      <HostSidebar />
      <div className="flex-1 ml-64 p-8">{children}</div>
    </div>
  );
}
