"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  User,
  FileEdit,
  Bell,
  LogOut,
  PartyPopper,
  LayoutDashboard,
  Files,
  IndianRupee,
  ChartNoAxesColumn,
  Tickets,
} from "lucide-react";
import * as Separator from "@radix-ui/react-separator";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import { setHost, setSignInOpen } from "../../../redux/hostSlice";
import { toast } from "react-toastify";

export default function HostSidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const host = useAppSelector((state) => state.host.host);

  const handleSignOut = async () => {
    const response = await fetch("/api/host/hostlogout", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Handle error state if needed.
    }

    const data = await response.json();

    if (data.success) {
      // Clear cookies, localStorage, and Redux state
      document.cookie =
        "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      document.cookie =
        "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
      dispatch(setHost(null)); // Update Redux state
      localStorage.removeItem("host");
      router.push("/host"); // Refresh the page to reflect the logged-out state
      toast.success("Host Signed Out", {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } else {
      // Optionally handle error state
      toast.error("Error signing out", {
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const links = [
    {
      name: "Dashboard",
      href: "/host/dashboard",
      icon: <LayoutDashboard className="mr-2 h-4 w-4" />,
    },
    {
      name: "Your Events",
      href: "/host/dashboard/events",
      icon: <Tickets className="mr-2 h-4 w-4" />,
    },
    {
      name: "Your Venues",
      href: "/host/dashboard/venue",
      icon: <PartyPopper className="mr-2 h-4 w-4" />,
    },
    {
      name: "Registration",
      href: "/host/dashboard/registration-kyc",
      icon: <Files className="mr-2 h-4 w-4" />,
    },
    {
      name: "Payments",
      href: "/host/dashboard/banking",
      icon: <IndianRupee className="mr-2 h-4 w-4" />,
    },
    {
      name: "Statistics",
      href: "/host/dashboard/statistics",
      icon: <ChartNoAxesColumn className="mr-2 h-4 w-4" />,
    },
    {
      name: "Edit Profile",
      href: "/host/dashboard/edit-profile",
      icon: <FileEdit className="mr-2 h-4 w-4" />,
    },
    {
      name: "Account Settings",
      href: "/host/dashboard/account",
      icon: <User className="mr-2 h-4 w-4" />,
    },
    {
      name: "Notifications",
      href: "/user/profile/notifications",
      icon: <Bell className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    // Changed to fixed positioning. Adjust top/left as needed.
    <div className="fixed top-24 left-0 w-64 h-screen border-r p-4 bg-gray-800 text-white/90 rounded-r-lg">
      <div className="space-y-4 pt-2 px-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold px-3">Host Dashboard</h2>
        </div>
        <div>
          {links.map((link) => (
            <Button
              key={link.href}
              asChild
              variant={pathname === link.href ? "secondary" : "ghost"}
              className="w-full justify-start py-6 px-3 text-md font-normal "
            >
              <Link href={link.href}>
                {link.icon}
                {link.name}
              </Link>
            </Button>
          ))}
        </div>

        <Separator.Root className="my-4" />

        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-700"
          onClick={handleSignOut}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
