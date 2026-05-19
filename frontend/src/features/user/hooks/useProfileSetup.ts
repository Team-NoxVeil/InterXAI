/**
 * useProfileSetup.ts
 * Hook for the post-signup/login profile setup step.
 * Calls PUT /users/:id with the profile payload.
 */

import { useState } from "react";
import {
  updateUserProfile,
  UserServiceError,
} from "../../../services/user.service";
import type { UserResponse } from "../../../services/user.service";

export interface ProfileSetupForm {
  bio: string;
  github: string;
  linkedin: string;
  leetcode: string;
}

export interface UseProfileSetupReturn {
  form: ProfileSetupForm;
  isLoading: boolean;
  error: string | null;
  handleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => Promise<void>;
  handleSkip: () => void;
}

export function useProfileSetup(
  userId: number,
  token: string,
  onComplete: (user: UserResponse) => void,
): UseProfileSetupReturn {
  const [form, setForm] = useState<ProfileSetupForm>({
    bio: "",
    github: "",
    linkedin: "",
    leetcode: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const updated = await updateUserProfile(
        userId,
        {
          profile: {
            bio: form.bio || null,
            github: form.github || null,
            linkedin: form.linkedin || null,
            leetcode: form.leetcode || null,
          },
        },
        token,
      );
      onComplete(updated);
    } catch (err) {
      if (err instanceof UserServiceError) {
        setError(err.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Skip profile setup — just call onComplete with whatever we have
  const handleSkip = () => {
    // We don't have the latest user object here — pass a signal for the caller
    // We'll call the backend with empty profile to keep things clean
    void updateUserProfile(userId, { profile: {} }, token)
      .then(onComplete)
      .catch(() => {
        /* silent skip */
      });
  };

  return { form, isLoading, error, handleChange, handleSubmit, handleSkip };
}
