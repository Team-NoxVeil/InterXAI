/**
 * useOrgLogin.ts
 * Handles org login form state, validation, API call, and token persistence.
 */

import { useState } from 'react';
import { loginOrganization, OrgServiceError } from '../../../services/organization.service';

export interface OrgLoginFormState {
  username: string;
  password: string;
}

export interface UseOrgLoginReturn {
  form: OrgLoginFormState;
  isLoading: boolean;
  error: string | null;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
}

export function useOrgLogin(onSuccess?: (token: string) => void): UseOrgLoginReturn {
  const [form, setForm] = useState<OrgLoginFormState>({ username: '', password: '' });
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

    if (!form.username.trim() || !form.password.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const { token } = await loginOrganization({
        username: form.username.trim(),
        password: form.password,
      });
      localStorage.setItem('org_token', token);
      onSuccess?.(token);
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
