// src/hooks/withAuth.js
"use client";

import { useEffect } from "react";
// import { useSelector } from "react-redux";
import { useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

const withAuth = (WrappedComponent) => {
  const AuthWrapper = (props) => {
    const user = useAppSelector((state) => state.user.user);
    const router = useRouter();

    useEffect(() => {
      if (!user) {
        router.push("/");
      }
    }, [user, router]);

    if (!user) return <p>Loading...</p>;

    return <WrappedComponent {...props} />;
  };

  return AuthWrapper;
};

export default withAuth;
