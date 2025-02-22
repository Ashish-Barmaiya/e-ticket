"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  User,
  FileEdit,
  Ticket,
  Lock,
  CreditCard,
  Bell,
  LogOut,
} from "lucide-react";
import * as Separator from "@radix-ui/react-separator";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { setUser, setSignInOpen } from "../../redux/userSlice";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function UserSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const router = useRouter();

  // Define a signOut function (update with your actual signOut logic)
  const signOut = async () => {
    // Your signOut implementation here.
    const response = await fetch("/api/user/user-sign-out", {
      method: "GET",
      headers: {
        "Content-type": "application/json",
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
      dispatch(setUser(null)); // Update Redux state
      localStorage.removeItem("user");
      router.push("/"); // Refresh the page to reflect the logged-out state
      toast.success("User Signed Out", {
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
      name: "Edit Profile",
      href: "/user/profile/edit-profile",
      icon: <FileEdit className="mr-2 h-4 w-4" />,
    },
    {
      name: "E-KYC",
      href: "/user/profile/ekyc",
      icon: <User className="mr-2 h-4 w-4" />,
    },
    {
      name: "My Tickets",
      href: "/user/profile/my-tickets",
      icon: <Ticket className="mr-2 h-4 w-4" />,
    },
    {
      name: "Change Password",
      href: "/user/profile/user-change-password",
      icon: <Lock className="mr-2 h-4 w-4" />,
    },
    {
      name: "Payments",
      href: "/user/profile/payments-method",
      icon: <CreditCard className="mr-2 h-4 w-4" />,
    },
    {
      name: "Notifications",
      href: "/user/profile/notifications",
      icon: <Bell className="mr-2 h-4 w-4" />,
    },
  ];

  return (
    // Use fixed positioning with full viewport height.
    <div className="fixed top-16 left-0 w-64 h-screen border-r-2 border-teal-600 p-4 bg-black/85 text-white/90 ">
      <div className="space-y-4 pt-2 px-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold px-3">User Profile</h2>
        </div>
        <div>
          {links.map((link) => (
            <Button
              key={link.href}
              asChild
              variant={pathname === link.href ? "secondary" : "ghost"}
              className="w-full justify-start py-6 px-3 text-md font-normal"
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
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
