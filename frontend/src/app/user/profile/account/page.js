// User ACCOUNT //

"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import withAuth from "@/hooks/withAuth";

function userAccountPage() {
  const [error, setError] = useState(null);

  return (
    <div>
      <div className="mx-auto mt-12 px-10">
        <h1 className="text-4xl tracking-wide">
          Your{" "}
          <span className="text-5xl text-teal-600 tracking-tighter">
            Account
          </span>{" "}
        </h1>
        <div className="grid gap-4 py-4 text-lg text-gray-800 tracking-tight">
          <Link
            href="/user/profile/account/personal-information"
            className="border border-gray-500/50 p-3 rounded-sm w-[70%] flex justify-between"
          >
            <h2 className="">Personal Information</h2>
            <ChevronRight color="#0d9488" />
          </Link>
          <Link
            href="/user/profile/account/location"
            className="border border-gray-500/50 p-3 rounded-sm w-[70%] flex justify-between"
          >
            <h2 className="">Location</h2>
            <ChevronRight color="#0d9488" />
          </Link>
          <Link
            href="/user/profile/account/history"
            className="border border-gray-500/50 p-3 rounded-sm w-[70%] flex justify-between"
          >
            <h2 className="">Account History</h2>
            <ChevronRight color="#0d9488" />
          </Link>
          <Link
            href="/user/profile/account/security"
            className="border border-gray-500/50 p-3 rounded-sm w-[70%] flex justify-between"
          >
            <h2 className="">Security</h2>
            <ChevronRight color="#0d9488" />
          </Link>
          <Link
            href="/user/profile/account/deactivate-account"
            className="border border-gray-500/50 p-3 rounded-sm w-[70%] flex justify-between"
          >
            <h2 className="">Deactivate/Delete Account</h2>
            <ChevronRight color="#0d9488" />
          </Link>
          <Link
            href="/user/profile/account/support"
            className="border border-gray-500/50 p-3 rounded-sm w-[70%] flex justify-between"
          >
            <h2 className="">Support & Feedback</h2>
            <ChevronRight color="#0d9488" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default withAuth(userAccountPage);
