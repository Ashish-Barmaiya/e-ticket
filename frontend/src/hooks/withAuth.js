// src/hooks/withAuth.js
"use client";

import { useEffect } from "react";
// import { useSelector } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
  const AuthWrapper = (props) => {
    const user = useAppSelector((state) => state.user.user); // Adjust the state path if needed
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push("/");
      }
    }, [user, router]);

    // If user data is still loading, show a loading state
    if (!user) return <p>Loading...</p>;

    return <WrappedComponent {...props} />;
  };

  return AuthWrapper;
};

export default withAuth;
