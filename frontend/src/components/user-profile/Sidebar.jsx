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

export default function Sidebar() {
  const pathname = usePathname();

  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);

  const links = [
    {
      name: "Edit Profile",
      href: "/user/profile/edit-profile",
      icon: <FileEdit className="mr-2 h-4 w-4" />,
    },
    {
      name: "E-KYC",
      href: "/user/profile/user-ekyc",
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
    <div className="w-64 border-r p-4 mt-24 bg-gray-800 text-white/90 rounded-r-lg rounded-b-none">
      <div className="space-y-4  pt-2 px-4">
        <div className="mb-6">
          <h2 className="text-xl font-semibold px-3">User Profile</h2>
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
          onClick={() => signOut()}
        >
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      </div>
    </div>
  );
}
