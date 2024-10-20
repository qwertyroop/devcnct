'use client';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';
const LoginPage = () => {

    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        
        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
    }

  return (
    <div>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
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
            <button type="submit">Login</button>
        </form>
    </div>
  )
}

export default LoginPage