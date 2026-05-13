/**
 * useSignup.ts
 * Custom hook for user signup — returns TokenResponse on success.
 */

import { useState } from 'react';
import { AuthServiceError } from '../../../services/auth.service';
import type { TokenResponse } from '../../../services/auth.service';

const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000';

export interface SignupFormState {
  fullName: string;
  email: string;
  password: string;
}

export interface UseSignupReturn {
  form: SignupFormState;
  isLoading: boolean;
  error: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useSignup(onSuccess?: (data: TokenResponse) => void): UseSignupReturn {
  const [form, setForm] = useState<SignupFormState>({ fullName: '', email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.fullName.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const username = form.fullName.trim().toLowerCase().replace(/\s+/g, '_');
      const response = await fetch(`${BASE_URL}/users/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email: form.email.trim(), password: form.password }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new AuthServiceError(response.status, data?.detail ?? 'Signup failed. Please try again.');
      }
      const data: TokenResponse = await response.json();
      localStorage.setItem('token', data.token);
      onSuccess?.(data);
    } catch (err) {
      if (err instanceof AuthServiceError) {
        setError(err.message);
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { form, isLoading, error, handleChange, handleSubmit };
}
