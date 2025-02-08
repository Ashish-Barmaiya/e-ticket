"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { useAppSelector, useAppDispatch } from "../redux/hooks";
import { setUser, setSignInOpen } from "../redux/userSlice";

export default function UserProfileSheet() {
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user.user);
  const decryptedPhoneNumber =
    user.decryptedPhoneNumber.substr(0, 2) +
    "******" +
    user.decryptedPhoneNumber.slice(-2);

  const router = useRouter();

  const handleSignOut = () => {
    // Clear cookies, localStorage, and Redux state
    document.cookie =
      "accessToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie =
      "refreshToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    dispatch(setUser(null)); // Update Redux state
    localStorage.removeItem("user");
    router.refresh(); // Refresh the page to reflect the logged-out state
  };

  return (
    <Sheet>
      {/* The trigger button appears in the navbar */}
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          className="text-lg underline  border-gray-600 text-gray-800  hover:bg-white hover:border-teal-500 hover:border transition duration-300"
        >
          Profile
        </Button>
      </SheetTrigger>

      <SheetContent className="bg-gray-50 border-teal-600 border-4 rounded-lg">
        <SheetHeader>
          {user ? (
            <>
              <SheetTitle className="px-1">{user.user.fullName}</SheetTitle>
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
                        <Link
                          href="/api/user/profile/"
                          className="text-blue-800 tracking-wider hover:underline"
                        >
                          <p className="px-1">Verify Phone Number</p>
                        </Link>
                      </span>
                    )}
                  </div>
                  <nav className="mt-4">
                    <ul className="space-y-3">
                      <li>
                        <div className="flex items-center">
                          <Link
                            href="/api/user/profile/edit-profile"
                            className="flex pt-1 px-1 text-gray-700 font-medium text-base hover:text-teal-600 hover:underline"
                          >
                            <img
                              src="./icons/edit_profile_icon.png"
                              alt="edit_profile"
                              className="w-6 h-6 mr-2 object-contain"
                            />
                            <p className="px-1">Edit Profile</p>
                          </Link>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <Link
                            href="/api/user/profile/user-ekyc"
                            className="flex pt-1 px-1 text-gray-700 font-medium text-base hover:text-teal-600 hover:underline"
                          >
                            <img
                              src="./icons/kyc_icon.png"
                              alt="kyc"
                              className="w-6 h- mr-2 object-contain"
                            />
                            <p className="px-1">E-Kyc</p>
                          </Link>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <Link
                            href="/api/user/profile/my-tickets"
                            className="flex pt-1 px-1 text-gray-700 font-medium text-base hover:text-teal-600 hover:underline"
                          >
                            <img
                              src="./icons/my_tickets_icon.png"
                              alt="my_tickets"
                              className="w-6 h- mr-2 object-contain"
                            />
                            <p className="px-1">My Tickets</p>
                          </Link>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <Link
                            href="/api/user/profile/user-change-password"
                            className="flex pt-1 px-1 text-gray-700 font-medium text-base hover:text-teal-600 hover:underline"
                          >
                            <img
                              src="./icons/password_icon.png"
                              alt="my_tickets"
                              className="w-6 h- mr-2 object-contain"
                            />
                            <p className="px-1">Change Password</p>
                          </Link>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <Link
                            href="/api/user/profile/payment-methods"
                            className="flex pt-1 px-1 text-gray-700 font-medium text-base hover:text-teal-600 hover:underline"
                          >
                            <img
                              src="./icons/payment_icon.png"
                              alt="payment"
                              className="w-6 h-6 mr-2 object-contain"
                            />
                            <p className="px-1">Payments</p>
                          </Link>
                        </div>
                      </li>
                      <li>
                        <div className="flex items-center">
                          <Link
                            href="/api/user/profile/notifications"
                            className="flex pt-1 px-1 text-gray-700 font-medium text-base hover:text-teal-600 hover:underline"
                          >
                            <img
                              src="./icons/notification_icon.png"
                              alt="notification"
                              className="w-6 h-6 mr-2 object-contain"
                            />
                            <p className="px-1">Notifications</p>
                          </Link>
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
                              src="./icons/signout_icon.png"
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
