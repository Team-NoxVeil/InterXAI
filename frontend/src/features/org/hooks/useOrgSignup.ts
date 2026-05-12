/**
 * useOrgSignup.ts
 * Handles org signup form state, validation, API call, and token persistence.
 */

import { useState } from 'react';
import {
  signupOrganization,
  OrgServiceError,
} from '../../../services/organization.service';
import type { OrgSignupResponse } from '../../../services/organization.service';

export interface OrgSignupFormState {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface UseOrgSignupReturn {
  form: OrgSignupFormState;
  isLoading: boolean;
  error: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useOrgSignup(onSuccess?: (data: OrgSignupResponse) => void): UseOrgSignupReturn {
  const [form, setForm] = useState<OrgSignupFormState>({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
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

    if (!form.username.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Please fill in all required fields.');
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setIsLoading(true);
    try {
      const data = await signupOrganization({
        username: form.username.trim(),
        email: form.email.trim(),
        password: form.password,
      });
      localStorage.setItem('org_token', data.access_token);
      onSuccess?.(data);
    } catch (err) {
      if (err instanceof OrgServiceError) {
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
