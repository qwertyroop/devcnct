"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { EyeFilledIcon } from "@/components/passwordBox/EyeFilledIcon";
import { EyeSlashFilledIcon } from "@/components/passwordBox/EyeSlashFilledIcon";
import { Input } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import { Chip } from "@nextui-org/react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { useDispatch } from "react-redux";

const SignupStepper: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const router = useRouter();

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleAccountCreation = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ step, email, password, otp, username }),
      });

      const data = await res.json();

      if (res.ok) {
        router.push(`/${username}`);
      } else {
        setError(data.message);
        console.error("Error response:", data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ step, email, password, otp, username }),
      });

      const data = await res.json();

      if (res.ok) {
        switch (step) {
          case 1:
            setStep(2);
            break;
          case 2:
            setStep(3);
            break;
        }
      } else {
        setError(data.message);
        console.error("Error response:", data);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
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
      <h1 className="text-2xl font-bold text-center">Join Devcnct</h1>
      <h4 className="text-md font-bold mb-4 text-center text-default-400">
        Sign up for free!
      </h4>
      <form onSubmit={handleNextStep}>
        {step === 1 && (
          <>
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
              <p className="text-xs text-default-400 mx-4 text-center">
                By clicking Create account, you agree to Devcnct's privacy
                notice, T&Cs and to receive offers, news and updates.
              </p>
            </div>
          </>
        )}
        {step === 2 && (
          <Input
            type="text"
            variant="bordered"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}
        {step === 3 && (
          <>
            <Input
              variant="bordered"
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <div className="flex items-center justify-center mt-4">
              <Button color="primary" onPress={onOpen}>
                Create Account
              </Button>
            </div>
          </>
        )}

        {step !== 3 && (
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
                {loading ? "Processing..." : getButtonText(step)}
              </Button>
            )}
          </center>
        )}

        {step === 1 && (
          <p className="text-xs text-default-700 mt-5 text-center">
            Already Having an account?{" "}
            <Link href="/login" className="text-primary">
              Log in
            </Link>
          </p>
        )}
      </form>

      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={true}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirm Username
              </ModalHeader>
              <ModalBody>
                <p>Your username will be set to: <strong>{username}</strong></p>
                <p className="text-warning">Please note: You cannot change your username after account creation.</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={onClose}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  isLoading={loading}
                  spinner={<LoadingSpinner />}
                  onPress={() => {
                    handleAccountCreation();
                    onClose();
                  }}
                >
                  Confirm & Create Account
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <center>
        {error && (
          <Chip color="warning" className="mt-10">
            {error}
          </Chip>
        )}
      </center>
    </div>
  );
};

function getButtonText(step: number): string {
  switch (step) {
    case 1:
      return "Continue";
    case 2:
      return "Verify OTP";
    case 3:
      return "Create Account";
    default:
      return "Next";
  }
}

export default SignupStepper;