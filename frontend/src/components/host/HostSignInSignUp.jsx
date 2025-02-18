"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useAppDispatch } from "../../redux/hooks";
import { setHost } from "../../redux/hostSlice";
import { toast } from "react-toastify";

// ---------------------
// SIGN IN FORM
// ---------------------

const SignInFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

const SignInForm = ({ onClose }) => {
  const [isError, setIsError] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignInFormSchema),
  });

  const onSubmit = async (values) => {
    setIsError(false);
    try {
      const response = await fetch("/api/host/hostlogin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!response.ok) {
        setIsError(true);
        return;
      }

      const data = await response.json();
      console.log("Login Response:", data);
      if (data.success) {
        // Dispatch the setHost action with the returned host data
        dispatch(
          setHost({
            host: data.host,
          })
        );
        router.push("/host/dashboard");
        toast.success("Sign In Succesful!", {
          position: "bottom-right",
          autoClose: 3000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
        onClose();
      } else {
        setIsError(true);
        toast.error(`Error: ${data.message || "Unknown error"}`, {
          // Show error toast
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsError(true);
      toast.error(`Error: ${error.message}`, {
        // Show error toast
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      {isError && (
        <div className="p-2 rounded-md bg-red-200 text-red-500">{errors}</div>
      )}
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          placeholder="m@example.com"
          type="email"
          {...register("email")}
        />
        {errors?.email && (
          <p className="text-sm text-red-500">{errors.email?.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          placeholder="Password"
          type="password"
          {...register("password")}
        />
        {errors?.password && (
          <p className="text-sm text-red-500">{errors.password?.message}</p>
        )}
      </div>
      <Button className="w-full" type="submit">
        Sign In
      </Button>
    </form>
  );
};

// ---------------------
// SIGN UP FORM
// ---------------------

const SignUpFormSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    email: z.string().email(),
    phoneNumber: z.string().min(10, { message: "Invalid phone number" }),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const SignUpForm = ({ setActiveDialog }) => {
  const [error, setError] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignUpFormSchema),
  });

  const onSubmit = async (values) => {
    try {
      const response = await fetch("/api/host/hostregister", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to send OTP");
      }

      setActiveDialog("otp"); // Change the active dialog to OTP
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      {error && <div className="p-2 bg-red-200 text-red-500">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input id="name" {...register("name")} />
        {errors?.name && (
          <p className="text-red-500 text-sm">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors?.email && (
          <p className="text-red-500 text-sm">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Phone Number</Label>
        <Input id="phoneNumber" {...register("phoneNumber")} />
        {errors?.phoneNumber && (
          <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors?.password && (
          <p className="text-red-500 text-sm">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          {...register("confirmPassword")}
        />
        {errors?.confirmPassword && (
          <p className="text-red-500 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      <Button className="w-full" type="submit">
        Send OTP
      </Button>
    </form>
  );
};

// -----------------------
// OTP VERIFICATION FORM
// -----------------------

const OtpVerificationForm = ({ setActiveDialog }) => {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/user/verify-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ otp }),
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Verification failed");
      }

      // Handle successful registration
      toast.success("Account created successfully!", {
        position: "top-right", // Adjust position as needed
        autoClose: 3000, // Auto-close after 3 seconds (adjust as needed)
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      setActiveDialog(null);
    } catch (err) {
      setError(err.message);
      toast.error(`Error: ${err.message}`, {
        // Show error toast
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {error && <div className="p-2 bg-red-200 text-red-500">{error}</div>}

      <div className="space-y-2">
        <Label htmlFor="otp">Enter OTP</Label>
        <Input
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="6-digit code"
        />
      </div>

      <Button className="w-full" type="submit">
        Verify OTP
      </Button>
    </form>
  );
};

// -----------------------
// RETURN COMBINED OUTPUT
// -----------------------

const HostSignInSignUp = ({ activeDialog, setActiveDialog }) => {
  return (
    <>
      <Dialog
        open={activeDialog === "signIn"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setActiveDialog(null); // Close all if the dialog is intended to be closed
        }}
      >
        {/* Sign In Dialog */}
        <DialogContent className="sm:max-w-[425px] border-4 border-teal-600 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center ">Sign In As Host</DialogTitle>
            <DialogDescription className="text-center">
              Sign in to your host account to continue.
            </DialogDescription>
          </DialogHeader>
          <SignInForm onClose={() => setActiveDialog(null)} />
          <div className="flex justify-center pt-2">
            <Link
              href="#"
              className="hover:text-teal-600"
              onClick={(e) => {
                e.preventDefault();
                setActiveDialog("signUp");
              }}
            >
              Create an account
            </Link>
          </div>
        </DialogContent>
      </Dialog>

      {/* Sign Up Dialog */}
      <Dialog
        open={activeDialog === "signUp"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setActiveDialog(null);
        }}
      >
        <DialogContent className="sm:max-w-[425px] border-4 border-teal-600 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">Create Account</DialogTitle>
            <DialogDescription className="text-center">
              Enter your details to create an account
            </DialogDescription>
          </DialogHeader>
          {/* Pass setActiveDialog as a prop */}
          <SignUpForm setActiveDialog={setActiveDialog} />
        </DialogContent>
      </Dialog>

      {/* Verify-OTP Dialog */}
      <Dialog
        open={activeDialog === "otp"}
        onOpenChange={(isOpen) => {
          if (!isOpen) setActiveDialog(null);
        }}
      >
        <DialogContent className="sm:max-w-[425px] border-4 border-teal-600 rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-center">Verify OTP</DialogTitle>
            <DialogDescription className="text-center">
              Enter the OTP sent to your email
            </DialogDescription>
          </DialogHeader>
          <OtpVerificationForm setActiveDialog={setActiveDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default HostSignInSignUp;
