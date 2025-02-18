// src/components/NavbarSwitcher.jsx
"use client";
import { usePathname } from "next/navigation";
import Navbar from "./navbar";
import SecondaryNavbar from "./SecondaryNavbar";

export default function NavbarSwitcher() {
  const pathname = usePathname();

  // If the pathname starts with "/host", don't render the default navbar
  if (pathname.startsWith("/host")) {
    return null;
  }

  return (
    <>
      <Navbar />
      {/* <SecondaryNavbar /> */}
    </>
  );
}
