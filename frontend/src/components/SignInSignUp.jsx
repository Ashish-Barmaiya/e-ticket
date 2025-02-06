import React, { useState } from "react";
import Dialog from "./Dialog";

const SignInSignUp = ({
  openSignIn,
  setSignInOpen,
  openSignUp,
  setSignUpOpen,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignInSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/user/user-sign-in", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Sign-in failed.");
      }

      // Handle successful login (e.g., redirect or update UI)
      alert("Login successful!");
      setSignInOpen(false); // Close dialog after successful login
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* Sign-In Dialog */}
      <Dialog isOpen={openSignIn} onClose={() => setSignInOpen(false)}>
        <h3 className="text-gray-700 text-xl text-center font-semibold mb-4 ">
          Sign In
        </h3>
        <form onSubmit={handleSignInSubmit}>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full py-2 bg-teal-600 hover:bg-teal-500 transition duration-300 text-white rounded"
            disabled={isLoading}
          >
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>
        {error && <p className="text-red-500 mt-2">{error}</p>}
        <p className="mt-4 text-center">
          Don't have an account?{" "}
          <button
            onClick={() => {
              setSignInOpen(false);
              setSignUpOpen(true);
            }}
            className="text-teal-600 font-semibold hover:text-teal-400 transition duration-300"
          >
            Sign Up
          </button>
        </p>
      </Dialog>

      {/* Sign-Up Dialog */}
      <Dialog isOpen={openSignUp} onClose={() => setSignUpOpen(false)}>
        <h3 className="text-gray-700 text-center text-xl font-semibold mb-4">
          Sign Up
        </h3>
        <form>
          {/* Add sign-up form fields here */}
          <input
            type="text"
            placeholder="Full Name"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="email"
            placeholder="Email"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="phone"
            placeholder="Mobile Number"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full p-2 mb-4 border border-gray-300 rounded"
          />
          <button
            type="submit"
            className="w-full py-2 bg-teal-600 hover:bg-teal-500 text-white rounded"
          >
            Sign Up
          </button>
        </form>
      </Dialog>
    </>
  );
};

export default SignInSignUp;
