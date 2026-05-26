import { useCallback, useEffect, useRef, useState } from "react";
import {
  startInterview,
  submitAnswer,
  sendHeartbeat,
  InterviewServiceError,
} from "../../../services/interview.service";
import type {
  InterviewStateResponse,
  SessionStatus,
} from "../../../services/interview.service";

export type InterviewPhase =
  | "loading"
  | "active"
  | "completed"
  | "terminal"
  | "error";

export interface UseInterviewSessionReturn {
  phase: InterviewPhase;
  state: InterviewStateResponse | null;
  terminalStatus: SessionStatus | null;
  error: string | null;
  isSubmitting: boolean;
  followUpIndex: number;
  answer: (text: string) => Promise<void>;
  applyState: (next: InterviewStateResponse) => void;
}

const HEARTBEAT_MS = 5000;

export function useInterviewSession(
  interviewId: number,
  token: string,
): UseInterviewSessionReturn {
  const [phase, setPhase] = useState<InterviewPhase>("loading");
  const [state, setState] = useState<InterviewStateResponse | null>(null);
  const [terminalStatus, setTerminalStatus] = useState<SessionStatus | null>(
    null,
  );
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [followUpIndex, setFollowUpIndex] = useState(0);

  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stoppedRef = useRef(false);

  const stopHeartbeat = useCallback(() => {
    if (heartbeatRef.current) {
      clearInterval(heartbeatRef.current);
      heartbeatRef.current = null;
    }
  }, []);

  const startHeartbeat = useCallback(
    (sessionId: number) => {
      stopHeartbeat();
      heartbeatRef.current = setInterval(async () => {
        if (stoppedRef.current) return;
        try {
          const res = await sendHeartbeat(sessionId, token);
          if (res.status !== "ongoing") {
            stoppedRef.current = true;
            stopHeartbeat();
            setTerminalStatus(res.status);
            setPhase(res.status === "completed" ? "completed" : "terminal");
          }
        } catch {
          // transient network error — ignore, next tick will try again
        }
      }, HEARTBEAT_MS);
    },
    [token, stopHeartbeat],
  );

  const applyState = useCallback(
    (next: InterviewStateResponse) => {
      setState((prev) => {
        // Follow-up tracking: same custom interaction_id ⇒ follow-up (+1).
        // Different id or different round ⇒ reset to 0.
        const prevQ = prev?.question;
        const nextQ = next.question;
        if (
          prevQ?.type === "custom" &&
          nextQ?.type === "custom" &&
          prevQ.interaction_id === nextQ.interaction_id
        ) {
          setFollowUpIndex((i) => Math.min(i + 1, 3));
        } else {
          setFollowUpIndex(0);
        }
        return next;
      });
      if (next.completed) {
        stoppedRef.current = true;
        stopHeartbeat();
        setPhase("completed");
      } else {
        setPhase("active");
      }
    },
    [stopHeartbeat],
  );

  useEffect(() => {
    stoppedRef.current = false;
    let cancelled = false;

    (async () => {
      try {
        const initial = await startInterview(interviewId, token);
        if (cancelled) return;
        setState(initial);
        if (initial.completed) {
          setPhase("completed");
        } else {
          setPhase("active");
          startHeartbeat(initial.session_id);
        }
      } catch (e) {
        if (cancelled) return;
        const msg =
          e instanceof InterviewServiceError
            ? e.message
            : "Unable to start interview. Please try again.";
        setError(msg);
        setPhase("error");
      }
    })();

    return () => {
      cancelled = true;
      stoppedRef.current = true;
      stopHeartbeat();
    };
  }, [interviewId, token, startHeartbeat, stopHeartbeat]);

  const answer = useCallback(
    async (text: string) => {
      if (!state || isSubmitting) return;
      setIsSubmitting(true);
      setError(null);
      try {
        const next = await submitAnswer(state.session_id, text, token);
        applyState(next);
      } catch (e) {
        if (e instanceof InterviewServiceError) {
          if (e.statusCode === 403) {
            stoppedRef.current = true;
            stopHeartbeat();
            setTerminalStatus("disqualified");
            setPhase("terminal");
          } else {
            setError(e.message);
          }
        } else {
          setError("Network error. Please try again.");
        }
      } finally {
        setIsSubmitting(false);
      }
    },
    [state, isSubmitting, token, applyState, stopHeartbeat],
  );

  return {
    phase,
    state,
    terminalStatus,
    error,
    isSubmitting,
    followUpIndex,
    answer,
    applyState,
  };
}
