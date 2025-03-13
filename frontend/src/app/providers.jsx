// app/providers.jsx
"use client";

import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import store, { persistor } from "@/redux/store.js";

export default function Providers({ children }) {
  return (
    <Provider store={store}>
      <PersistGate
        loading={
          <div className="flex flex-col items-center justify-center h-screen">
            {/* SVG Spinner */}
            <svg
              className="animate-spin h-10 w-10 backdrop-blur-sm border bg-emerald-300/10 border-emerald-500/20  mb-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              ></path>
            </svg>
            <h1 className="text-xl tracking-wide">Loading...</h1>
          </div>
        }
        persistor={persistor}
      >
        {children}
      </PersistGate>
    </Provider>
  );
}
