"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeFilledIcon } from "@/components/passwordBox/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/passwordBox/EyeSlashFilledIcon";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";

const LoginPage = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);


    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json();
        const username = data.username;
        router.push(`/${username}`);
      } else {
        console.log("Error logging in", res);
      }
    } catch (error) {
      console.log("Error logging in", error);
    }
  };


  const LoadingSpinner = () => (
    <svg
      className="animate-spin h-5 w-5 text-current"
      fill="none"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        fill="currentColor"
      />
    </svg>
  );

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-bold text-center">Devcnct</h1>
      <h4 className="text-md font-bold mb-4 text-center text-default-400">
        Login to your account
      </h4>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-4">
          <Input
            type="email"
            variant="bordered"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <Input
            label="Password"
            variant="bordered"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            endContent={
              <button
                className="focus:outline-none"
                type="button"
                onClick={toggleVisibility}
                aria-label="toggle password visibility"
              >
                {isVisible ? (
                  <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                ) : (
                  <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
                )}
              </button>
            }
            type={isVisible ? "text" : "password"}
          />
        </div>
        <center className="mt-4">
            {loading ? (
              <Button
                isLoading
                color="default"
                spinner={<LoadingSpinner />}
              >
                Loading
              </Button>
            ) : (
              <Button color="default" type="submit" disabled={loading}>
                {loading ? "Please Wait" : "Login"}
              </Button>
            )}
          </center>
      </form>
    </div>
  );
};

export default LoginPage;
