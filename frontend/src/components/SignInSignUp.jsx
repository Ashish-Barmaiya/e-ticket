// frontend/components/SignInSignUp.jsx

"use client";

import { useState } from "react";
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
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { setUser, setSignInOpen, setSignUpOpen } from "../redux/userSlice";
import { useEffect } from "react";

const FormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
});

function SignInForm() {
  const [isError, setIsError] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(FormSchema),
  });

  async function onSubmit(values) {
    setIsError(false);
    try {
      const response = await fetch("/api/user/user-sign-in", {
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
        dispatch(setUser(data.user)); // Dispatch the setUser action
        router.refresh();
        dispatch(setSignInOpen(false)); // Close the sign-in dialog
      } else {
        setIsError(true);
      }
    } catch (error) {
      console.error("Login error:", error);
      setIsError(true);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">
      {isError && (
        <div className="p-2 rounded-md bg-red-200 text-red-500">
          Incorrect Credentials
        </div>
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
}

const SignInSignUp = ({ openSignIn }) => {
  //Only accept openSignIn
  const dispatch = useAppDispatch();

  useEffect(() => {
    //Log to confirm prop and render
    console.log("SignInSignUp - openSignIn prop:", openSignIn);
  }, [openSignIn]);

  return (
    <>
      <Dialog
        open={openSignIn}
        onOpenChange={(isOpen) => dispatch(setSignInOpen(isOpen))}
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-center">Sign In</DialogTitle>
            <DialogDescription className="text-center">
              Sign in to your account to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <SignInForm />
          </div>
          <div className="flex justify-center pt-2">
            <Link
              href="#"
              onClick={() => {
                dispatch(setSignInOpen(false));
                dispatch(setSignUpOpen(true));
              }}
            >
              Create an account
            </Link>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default SignInSignUp;
