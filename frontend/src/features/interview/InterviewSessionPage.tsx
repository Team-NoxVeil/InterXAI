import React from "react";
import { useInterviewSession } from "./hooks/useInterviewSession";
import TextQAPanel from "./components/TextQAPanel";
import DsaPanel from "./components/DsaPanel";
import type {
  InterviewStateResponse,
  Round,
  SessionStatus,
} from "../../services/interview.service";

export interface InterviewSessionPageProps {
  interviewId: number;
  token: string;
  onExit: () => void;
}

const InterviewSessionPage: React.FC<InterviewSessionPageProps> = ({
  interviewId,
  token,
  onExit,
}) => {
  const {
    phase,
    state,
    terminalStatus,
    error,
    isSubmitting,
    followUpIndex,
    answer,
    applyState,
  } = useInterviewSession(interviewId, token);

  return (
    <div
      id="interview-session"
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(155deg, #bdd9f2 0%, #cfe8fb 12%, #dff0ff 28%, #ecf7ff 45%, #f4faff 62%, #e8f4fd 78%, #d2e9f8 100%)",
        fontFamily:
          "'Inter', system-ui, -apple-system, BlinkMacSystemFont, sans-serif",
        position: "relative",
      }}
    >
      <BgBlobs />
      <SessionHeader
        round={state?.round}
        sessionId={state?.session_id}
        phase={phase}
        onExit={onExit}
      />

      <main style={{ position: "relative", zIndex: 5 }}>
        {phase === "loading" && <LoadingScreen />}

        {phase === "error" && (
          <ErrorScreen
            message={error ?? "Unable to start interview."}
            onExit={onExit}
          />
        )}

        {phase === "active" &&
          state &&
          state.question &&
          renderRound({
            state,
            question: state.question,
            isSubmitting,
            error,
            onAnswer: answer,
            applyState,
            token,
            followUpIndex,
          })}

        {phase === "completed" && <CompletedScreen onExit={onExit} />}

        {phase === "terminal" && (
          <TerminalScreen status={terminalStatus} onExit={onExit} />
        )}
      </main>
    </div>
  );
};

interface RenderArgs {
  state: InterviewStateResponse;
  question: NonNullable<InterviewStateResponse["question"]>;
  isSubmitting: boolean;
  error: string | null;
  onAnswer: (text: string) => Promise<void>;
  applyState: (next: InterviewStateResponse) => void;
  token: string;
  followUpIndex: number;
}

function renderRound({
  state,
  question,
  isSubmitting,
  error,
  onAnswer,
  applyState,
  token,
  followUpIndex,
}: RenderArgs) {
  if (question.type === "custom") {
    return (
      <TextQAPanel
        key={`q-${question.interaction_id}`}
        question={question}
        round="questions"
        followUpIndex={followUpIndex}
        isSubmitting={isSubmitting}
        error={error}
        onSubmit={onAnswer}
      />
    );
  }
  if (question.type === "resume") {
    return (
      <TextQAPanel
        key={`r-${question.question_id}`}
        question={question}
        round="resume"
        followUpIndex={0}
        isSubmitting={isSubmitting}
        error={error}
        onSubmit={onAnswer}
      />
    );
  }
  return (
    <DsaPanel
      key={`d-${question.interaction_id}`}
      sessionId={state.session_id}
      token={token}
      question={question}
      onAdvance={applyState}
    />
  );
}

// ── Header ──────────────────────────────────────────────────────────────────

const ROUND_META: Record<Round, { label: string; step: number }> = {
  questions: { label: "Behavioural", step: 1 },
  dsa: { label: "Coding", step: 2 },
  resume: { label: "Resume", step: 3 },
};

const SessionHeader: React.FC<{
  round: Round | undefined;
  sessionId: number | undefined;
  phase: string;
  onExit: () => void;
}> = ({ round, sessionId, phase, onExit }) => (
  <header
    style={{
      position: "sticky",
      top: 0,
      zIndex: 40,
      background: "rgba(255,255,255,0.7)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(255,255,255,0.7)",
      boxShadow: "0 2px 16px rgba(15,23,42,0.04)",
    }}
  >
    <div
      style={{
        maxWidth: 1500,
        margin: "0 auto",
        padding: "12px 32px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 16,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: "linear-gradient(145deg,#4f9cf9,#1649c9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            border: "1.5px solid rgba(255,255,255,0.35)",
          }}
        >
          <span style={{ color: "#fff", fontWeight: 800, fontSize: 13 }}>
            X
          </span>
        </div>
        <span
          style={{
            fontSize: 15.5,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.3px",
          }}
        >
          InterXAI Interview
        </span>
        {sessionId !== undefined && (
          <span
            style={{
              fontSize: 11,
              color: "#94a3b8",
              fontWeight: 500,
              fontFamily:
                "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
            }}
          >
            · session #{sessionId}
          </span>
        )}
      </div>

      <RoundStepper round={round} />

      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <LiveDot phase={phase} />
        <button
          onClick={onExit}
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: "#64748b",
            background: "transparent",
            border: "1px solid rgba(203,213,225,0.7)",
            padding: "7px 14px",
            borderRadius: 99,
            cursor: "pointer",
          }}
        >
          Exit
        </button>
      </div>
    </div>
  </header>
);

const RoundStepper: React.FC<{ round: Round | undefined }> = ({ round }) => {
  const order: Round[] = ["questions", "dsa", "resume"];
  const activeStep = round ? ROUND_META[round].step : 0;
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
      {order.map((r, i) => {
        const step = ROUND_META[r].step;
        const done = step < activeStep;
        const active = step === activeStep;
        const color = done || active ? "#2563eb" : "#cbd5e1";
        return (
          <React.Fragment key={r}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 7,
                padding: "5px 12px",
                borderRadius: 99,
                background: active
                  ? "linear-gradient(135deg,rgba(59,130,246,0.15),rgba(29,78,216,0.15))"
                  : done
                    ? "rgba(219,234,254,0.6)"
                    : "rgba(255,255,255,0.55)",
                border: active
                  ? "1px solid rgba(59,130,246,0.5)"
                  : "1px solid rgba(255,255,255,0.95)",
              }}
            >
              <div
                style={{
                  width: 18,
                  height: 18,
                  borderRadius: "50%",
                  background: active || done ? color : "transparent",
                  border: active || done ? "none" : `1.5px solid ${color}`,
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {done ? "✓" : step}
              </div>
              <span
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: active || done ? "#1e3a8a" : "#94a3b8",
                  letterSpacing: "0.02em",
                }}
              >
                {ROUND_META[r].label}
              </span>
            </div>
            {i < order.length - 1 && (
              <div
                style={{
                  width: 14,
                  height: 2,
                  background: done ? "#60a5fa" : "rgba(203,213,225,0.7)",
                  borderRadius: 1,
                }}
              />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

const LiveDot: React.FC<{ phase: string }> = ({ phase }) => {
  if (phase !== "active") return null;
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 7,
        padding: "5px 12px",
        background: "rgba(220,252,231,0.7)",
        border: "1px solid rgba(74,222,128,0.5)",
        borderRadius: 99,
      }}
    >
      <span
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: "#22c55e",
          boxShadow: "0 0 8px #22c55e",
          animation: "live-pulse 1.6s ease-in-out infinite",
        }}
      />
      <style>{`@keyframes live-pulse { 0%,100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
      <span style={{ fontSize: 11.5, color: "#065f46", fontWeight: 700 }}>
        Live
      </span>
    </div>
  );
};

// ── Screens ─────────────────────────────────────────────────────────────────

const LoadingScreen = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "80px 32px",
      gap: 14,
    }}
  >
    <div
      style={{
        width: 48,
        height: 48,
        borderRadius: "50%",
        border: "3px solid rgba(59,130,246,0.2)",
        borderTopColor: "#2563eb",
        animation: "spin 0.9s linear infinite",
      }}
    />
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <div
      style={{
        fontSize: 15,
        fontWeight: 700,
        color: "#0f172a",
        letterSpacing: "-0.3px",
      }}
    >
      Starting your interview…
    </div>
    <div style={{ fontSize: 13, color: "#64748b" }}>
      Setting up your questions and code workspace.
    </div>
  </div>
);

const ErrorScreen: React.FC<{ message: string; onExit: () => void }> = ({
  message,
  onExit,
}) => (
  <div
    style={{
      maxWidth: 520,
      margin: "60px auto",
      padding: "32px 32px",
      background: "rgba(255,255,255,0.78)",
      backdropFilter: "blur(24px)",
      WebkitBackdropFilter: "blur(24px)",
      border: "1px solid rgba(255,255,255,0.95)",
      borderRadius: 28,
      boxShadow: "0 25px 50px -12px rgba(15,23,42,0.18)",
      textAlign: "center",
    }}
  >
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 16,
        background: "linear-gradient(145deg,#fee2e2,#fecaca)",
        color: "#b91c1c",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 14px",
      }}
    >
      <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2" />
        <path
          d="M12 8v5M12 16h.01"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
    <h2
      style={{
        fontSize: 22,
        fontWeight: 800,
        color: "#0f172a",
        letterSpacing: "-0.5px",
        marginBottom: 8,
      }}
    >
      Could not start interview
    </h2>
    <p
      style={{
        fontSize: 14,
        color: "#475569",
        lineHeight: 1.55,
        marginBottom: 22,
      }}
    >
      {message}
    </p>
    <button
      onClick={onExit}
      style={{
        background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
        color: "#fff",
        border: "none",
        borderRadius: 99,
        padding: "11px 26px",
        fontSize: 13.5,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 8px 22px rgba(59,130,246,0.4)",
      }}
    >
      Back to dashboard
    </button>
  </div>
);

const CompletedScreen: React.FC<{ onExit: () => void }> = ({ onExit }) => (
  <div
    style={{
      maxWidth: 560,
      margin: "60px auto",
      padding: "44px 36px",
      background: "rgba(255,255,255,0.82)",
      backdropFilter: "blur(28px)",
      WebkitBackdropFilter: "blur(28px)",
      border: "1px solid rgba(255,255,255,0.95)",
      borderRadius: 32,
      boxShadow: "0 35px 60px -15px rgba(15,23,42,0.18)",
      textAlign: "center",
    }}
  >
    <div
      style={{
        width: 72,
        height: 72,
        borderRadius: 22,
        background: "linear-gradient(145deg,#d1fae5,#a7f3d0)",
        color: "#047857",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 auto 18px",
        boxShadow: "0 12px 28px rgba(16,185,129,0.3)",
      }}
    >
      <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
        <path
          d="M5 12l5 5L20 7"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
    <h2
      style={{
        fontSize: 28,
        fontWeight: 900,
        color: "#0f172a",
        letterSpacing: "-0.8px",
        marginBottom: 10,
      }}
    >
      Interview submitted 🎉
    </h2>
    <p
      style={{
        fontSize: 15,
        color: "#475569",
        lineHeight: 1.6,
        marginBottom: 28,
        maxWidth: 420,
        margin: "0 auto 28px",
      }}
    >
      Thanks for taking the time. Our team will review your responses and reach
      out shortly. You'll get a notification once the result is ready.
    </p>
    <button
      onClick={onExit}
      style={{
        background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
        color: "#fff",
        border: "none",
        borderRadius: 99,
        padding: "12px 28px",
        fontSize: 14,
        fontWeight: 700,
        cursor: "pointer",
        boxShadow: "0 8px 22px rgba(59,130,246,0.4)",
      }}
    >
      Back to dashboard
    </button>
  </div>
);

const TERMINAL_COPY: Partial<
  Record<SessionStatus, { title: string; body: string; tone: "warn" | "bad" }>
> = {
  disqualified: {
    title: "Interview ended",
    body: "Your session was disqualified due to extended inactivity. If you believe this was a mistake, please reach out to the hiring team.",
    tone: "bad",
  },
  cancelled: {
    title: "Interview cancelled",
    body: "This interview session was cancelled. Please contact the hiring team for next steps.",
    tone: "warn",
  },
  cheated: {
    title: "Interview ended",
    body: "Your session was flagged and ended early. Please contact the hiring team if you have any questions.",
    tone: "bad",
  },
};

const TerminalScreen: React.FC<{
  status: SessionStatus | null;
  onExit: () => void;
}> = ({ status, onExit }) => {
  const copy = (status && TERMINAL_COPY[status]) ?? {
    title: "Interview ended",
    body: "Your session has ended.",
    tone: "warn" as const,
  };
  const accent = copy.tone === "bad" ? "#b91c1c" : "#b45309";
  const bg =
    copy.tone === "bad"
      ? "linear-gradient(145deg,#fee2e2,#fecaca)"
      : "linear-gradient(145deg,#fef3c7,#fde68a)";
  return (
    <div
      style={{
        maxWidth: 560,
        margin: "60px auto",
        padding: "44px 36px",
        background: "rgba(255,255,255,0.82)",
        backdropFilter: "blur(28px)",
        WebkitBackdropFilter: "blur(28px)",
        border: "1px solid rgba(255,255,255,0.95)",
        borderRadius: 32,
        boxShadow: "0 35px 60px -15px rgba(15,23,42,0.18)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: 72,
          height: 72,
          borderRadius: 22,
          background: bg,
          color: accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          margin: "0 auto 18px",
        }}
      >
        <svg width="34" height="34" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 9v4M12 17h.01M10.3 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.7 3.86a2 2 0 00-3.4 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h2
        style={{
          fontSize: 24,
          fontWeight: 900,
          color: "#0f172a",
          letterSpacing: "-0.6px",
          marginBottom: 10,
        }}
      >
        {copy.title}
      </h2>
      <p
        style={{
          fontSize: 14,
          color: "#475569",
          lineHeight: 1.6,
          marginBottom: 26,
        }}
      >
        {copy.body}
      </p>
      <button
        onClick={onExit}
        style={{
          background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
          color: "#fff",
          border: "none",
          borderRadius: 99,
          padding: "12px 28px",
          fontSize: 14,
          fontWeight: 700,
          cursor: "pointer",
          boxShadow: "0 8px 22px rgba(59,130,246,0.4)",
        }}
      >
        Back to dashboard
      </button>
    </div>
  );
};

const BgBlobs = () => (
  <>
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 700,
        height: 700,
        background: "rgba(219,234,254,0.45)",
        borderRadius: "50%",
        filter: "blur(120px)",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: "-15%",
        width: 600,
        height: 600,
        background: "rgba(207,232,251,0.45)",
        borderRadius: "50%",
        filter: "blur(100px)",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  </>
);

export default InterviewSessionPage;
