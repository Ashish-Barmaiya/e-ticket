import Sidebar from "../../../components/user-profile/Sidebar";
import "../../globals.css";

export default function ProfileLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
