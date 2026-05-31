/**
 * useLogin.ts
 * Custom hook that encapsulates all login form state and submission logic.
 * Keeps the LoginPage component clean and UI-only.
 */

import { useState } from "react";
import { loginUser, AuthServiceError } from "../../../services/auth.service";
import type {
  TokenResponse,
  LoginRequest,
} from "../../../services/auth.service";

export interface LoginFormState {
  username: string;
  password: string;
}

export interface UseLoginReturn {
  form: LoginFormState;
  isLoading: boolean;
  error: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * @param onSuccess - callback fired with token + user on successful login
 */
export function useLogin(
  onSuccess?: (data: TokenResponse) => void,
): UseLoginReturn {
  const [form, setForm] = useState<LoginFormState>({
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null); // clear error when user retypes
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!form.username.trim() || !form.password.trim()) {
      setError("Please fill in all fields.");
      return;
    }

    setIsLoading(true);
    try {
      const credentials: LoginRequest = {
        username: form.username.trim(),
        password: form.password,
      };
      const data = await loginUser(credentials);
      // Persist token for downstream use
      localStorage.setItem("token", data.token);
      onSuccess?.(data);
    } catch (err) {
      if (err instanceof AuthServiceError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return { form, isLoading, error, handleChange, handleSubmit };
}
