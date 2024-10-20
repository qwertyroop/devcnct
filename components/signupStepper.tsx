'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const SignupStepper: React.FC = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [username, setUsername] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleNextStep = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
          case 3:
            router.push(`/${username}`);
            break;
        }
      } else {
        setError(data.message);
        console.error('Error response:', data); // Debugging log
      }
    } catch (err) {
      console.error('Fetch error:', err); // Debugging log
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Signup - Step {step}</h1>
      <form onSubmit={handleNextStep}>
        {step === 1 && (
          <>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </>
        )}
        {step === 2 && (
          <input
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
          />
        )}
        {step === 3 && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        )}
        <button type="submit" disabled={loading}>
          {loading ? 'Processing...' : getButtonText(step)}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </div>
  );
};

function getButtonText(step: number): string {
  switch (step) {
    case 1:
      return 'Send OTP';
    case 2:
      return 'Verify OTP';
    case 3:
      return 'Create Account';
    default:
      return 'Next';
  }
}

export default SignupStepper;
