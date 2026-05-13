/**
 * useDashboard.ts
 * Fetches available + applied interview lists for the logged-in user.
 */

import { useState, useEffect } from 'react';
import {
  fetchInterviews,
  fetchAppliedInterviews,
  UserServiceError,
} from '../../../services/user.service';
import type { InterviewBasic, AppliedInterview } from '../../../services/user.service';

export interface UseDashboardReturn {
  available: InterviewBasic[];
  applied: AppliedInterview[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useDashboard(token: string): UseDashboardReturn {
  const [available, setAvailable] = useState<InterviewBasic[]>([]);
  const [applied, setApplied] = useState<AppliedInterview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tick, setTick] = useState(0);

  useEffect(() => {
    if (!token) return;
    setIsLoading(true);
    setError(null);

    Promise.all([fetchInterviews(token), fetchAppliedInterviews(token)])
      .then(([av, ap]) => {
        setAvailable(av);
        setApplied(ap);
      })
      .catch((err) => {
        if (err instanceof UserServiceError) {
          setError(err.message);
        } else {
          setError('Failed to load interviews. Please refresh.');
        }
      })
      .finally(() => setIsLoading(false));
  }, [token, tick]);

  return { available, applied, isLoading, error, refetch: () => setTick((t) => t + 1) };
}
