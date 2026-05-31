/**
 * useDashboard.ts
 * Fetches available + applied interview lists for the logged-in user.
 */

import { useReducer, useEffect, useCallback } from "react";
import {
  fetchInterviews,
  fetchAppliedInterviews,
  UserServiceError,
} from "../../../services/user.service";
import type {
  InterviewBasic,
  AppliedInterview,
} from "../../../services/user.service";

export interface UseDashboardReturn {
  available: InterviewBasic[];
  applied: AppliedInterview[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

interface DashboardState {
  available: InterviewBasic[];
  applied: AppliedInterview[];
  isLoading: boolean;
  error: string | null;
  tick: number;
}

type DashboardAction =
  | { type: "FETCH_START" }
  | {
      type: "FETCH_SUCCESS";
      available: InterviewBasic[];
      applied: AppliedInterview[];
    }
  | { type: "FETCH_ERROR"; error: string }
  | { type: "REFETCH" };

function reducer(
  state: DashboardState,
  action: DashboardAction,
): DashboardState {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, isLoading: true, error: null };
    case "FETCH_SUCCESS":
      return {
        ...state,
        isLoading: false,
        available: action.available,
        applied: action.applied,
      };
    case "FETCH_ERROR":
      return { ...state, isLoading: false, error: action.error };
    case "REFETCH":
      return { ...state, isLoading: true, error: null, tick: state.tick + 1 };
    default:
      return state;
  }
}

const initialState: DashboardState = {
  available: [],
  applied: [],
  isLoading: true,
  error: null,
  tick: 0,
};

export function useDashboard(token: string): UseDashboardReturn {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    if (!token) return;
    dispatch({ type: "FETCH_START" });

    Promise.all([fetchInterviews(token), fetchAppliedInterviews(token)])
      .then(([av, ap]) => {
        dispatch({ type: "FETCH_SUCCESS", available: av, applied: ap });
      })
      .catch((err) => {
        const message =
          err instanceof UserServiceError
            ? err.message
            : "Failed to load interviews. Please refresh.";
        dispatch({ type: "FETCH_ERROR", error: message });
      });
  }, [token, state.tick]);

  const refetch = useCallback(() => dispatch({ type: "REFETCH" }), []);

  return {
    available: state.available,
    applied: state.applied,
    isLoading: state.isLoading,
    error: state.error,
    refetch,
  };
}
