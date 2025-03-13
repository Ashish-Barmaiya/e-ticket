"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetClose,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setUser, setSignInOpen } from "../redux/userSlice";
import { toast } from "react-toastify";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronDown } from "lucide-react";

export default function UserProfileSheet() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const decryptedPhoneNumber =
    user.decryptedPhoneNumber.substr(0, 2) +
    "******" +
    user.decryptedPhoneNumber.slice(-2);

  const router = useRouter();
  const [isError, setIsError] = useState(false);

  const handleSignOut = async () => {
    const response = await fetch("/api/user/user-sign-out", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      setIsError(true);
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
      router.refresh(); // Refresh the page to reflect the logged-out state
      toast.success("User Signed Out", {
        position: "bottom-right",
        autoClose: 2500,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "#121212",
          color: "#fff",
          fontSize: "16px",
        },
      });
    } else {
      setIsError(true);
      toast.error(`Error: ${err.message}`, {
        // Show error toast
        position: "bottom-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        style: {
          background: "#121212",
          color: "#fff",
          fontSize: "16px",
        },
      });
    }
  };

  return (
    <Sheet>
      {/* The trigger button appears in the navbar */}
      <SheetTrigger asChild>
        <button className="flex items-center space-x-2">
          <Avatar className="w-6 h-6">
            <AvatarImage src={user.user.profilePicture} />
            <AvatarFallback className="bg-teal-200">
              {user.user.fullName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <ChevronDown className="w-6 h-6 text-white/90" />
        </button>
      </SheetTrigger>

      <SheetContent className="bg-gray-50 border-teal-600 border-4 rounded-lg">
        <SheetHeader>
          {user ? (
            <>
              <SheetTitle className="px-1 tracking-tight text-xl">
                {user.user.fullName}
              </SheetTitle>
              {/* Override the default element by using asChild */}
              <SheetDescription asChild>
                <div>
                  <span className="px-1">Email: {user.user.email}</span> <br />
                  <span className="px-1">Phone: {decryptedPhoneNumber}</span>
                  <br />
                  <div>
                    {user.user.phoneVerification === true ? (
                      <span className="text-green-500 px-1 tracking-wider">
                        Verified
                      </span>
                    ) : (
                      <span>
                        <SheetClose asChild>
                          <Link
                            href="/user/profile/"
                            className="text-blue-800 tracking-wider hover:underline"
                          >
                            <p className="px-1">Verify Phone Number</p>
                          </Link>
                        </SheetClose>
                      </span>
                    )}
                  </div>
                  <nav className="mt-4">
                    <ul className="space-y-3">
                      <li>
                        <div className="flex items-center">
                          <SheetClose asChild>
                            <Link
                              href="/user/profile/edit-profile"
                              className="flex pt-1 px-1 text-gray-700 font-medium text-base hover:text-teal-600 hover:underline"
                            >
                              <img
                                src="/icons/edit_profile_icon.png"
                                alt="edit_profile"
                                className="w-6 h-6 mr-2 object-contain"
                              />
                              <p className="px-1">Edit Profile</p>
                            </Link>
                          </SheetClose>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <SheetClose asChild>
                            <Link
                              href="/user/profile/ekyc"
                              className="flex pt-1 px-1 text-gray-700 font-medium text-base hover:text-teal-600 hover:underline"
                            >
                              <img
                                src="/icons/kyc_icon.png"
                                alt="kyc"
                                className="w-6 h- mr-2 object-contain"
                              />
                              <p className="px-1">E-Kyc</p>
                            </Link>
                          </SheetClose>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <SheetClose asChild>
                            <Link
                              href="/user/profile/my-tickets"
                              className="flex pt-1 px-1 text-gray-700 font-medium text-base hover:text-teal-600 hover:underline"
                            >
                              <img
                                src="/icons/my_tickets_icon.png"
                                alt="my_tickets"
                                className="w-6 h- mr-2 object-contain"
                              />
                              <p className="px-1">My Tickets</p>
                            </Link>
                          </SheetClose>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <SheetClose asChild>
                            <Link
                              href="/user/profile/account"
                              className="flex pt-1 px-1 text-gray-700 font-medium text-base hover:text-teal-600 hover:underline"
                            >
                              <img
                                src="/icons/password_icon.png"
                                alt="my_tickets"
                                className="w-6 h- mr-2 object-contain"
                              />
                              <p className="px-1">Account</p>
                            </Link>
                          </SheetClose>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <SheetClose asChild>
                            <Link
                              href="/user/profile/payment-methods"
                              className="flex pt-1 px-1 text-gray-700 font-medium text-base hover:text-teal-600 hover:underline"
                            >
                              <img
                                src="/icons/payment_icon.png"
                                alt="payment"
                                className="w-6 h-6 mr-2 object-contain"
                              />
                              <p className="px-1">Payments</p>
                            </Link>
                          </SheetClose>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <SheetClose asChild>
                            <Link
                              href="/user/profile/notifications"
                              className="flex pt-1 px-1 text-gray-700 font-medium text-base hover:text-teal-600 hover:underline"
                            >
                              <img
                                src="/icons/notification_icon.png"
                                alt="notification"
                                className="w-6 h-6 mr-2 object-contain"
                              />
                              <p className="px-1">Notifications</p>
                            </Link>
                          </SheetClose>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <Link
                            href="/"
                            className="flex pt-1 px-1 text-red-700 font-medium text-base hover:underline"
                            onClick={handleSignOut}
                          >
                            <img
                              src="/icons/signout_icon.png"
                              alt="sign_out"
                              className="w-6 h-6 mr-2 object-contain"
                            />
                            <p className="px-1">Sign Out</p>
                          </Link>
                        </div>
                      </li>
                    </ul>
                  </nav>
                </div>
              </SheetDescription>
            </>
          ) : (
            <>
              <SheetTitle>Not Signed In</SheetTitle>
              <SheetDescription asChild>
                <div>
                  <span>You are not signed in.</span>
                  <Button
                    variant="outline"
                    onClick={() => dispatch(setSignInOpen(true))}
                  >
                    Sign In
                  </Button>
                </div>
              </SheetDescription>
            </>
          )}
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
}
