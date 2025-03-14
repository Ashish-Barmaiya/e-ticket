import UserSidebar from "../../../components/user-profile/Sidebar";
import "../../globals.css";

export default function ProfileLayout({ children }) {
  return (
    <div className="flex min-h-screen w-full">
      <UserSidebar />
      <div className="flex-1 ml-64 p-8">{children}</div>
    </div>
  );
}
