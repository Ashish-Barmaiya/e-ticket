"use client"; // ✅ Mark as a Client Component

import { Provider } from "react-redux";
import store from "@/redux/store"; // Corrected import path

export default function Providers({ children }) {
  return <Provider store={store}>{children}</Provider>;
}
