// src/app/layout.js
import { Geist, Geist_Mono, Onest } from "next/font/google";
import Providers from "./providers.jsx"; // Corrected import path
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
const onest = Onest({ variable: "--font-onest", subsets: ["latin"] });

export const metadata = {
  title: "Ticketo",
  description: "Secure ticketing platform",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${onest.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
