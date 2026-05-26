import React, { useEffect, useRef, useState } from "react";
import type { QuestionPayload } from "../../../services/interview.service";

interface Props {
  question: Extract<QuestionPayload, { type: "custom" | "resume" }>;
  round: "questions" | "resume";
  followUpIndex: number; // 1, 2, 3 for follow-ups; 0 for fresh question
  isSubmitting: boolean;
  error: string | null;
  onSubmit: (answer: string) => void;
}

export default function TextQAPanel({
  question,
  round,
  followUpIndex,
  isSubmitting,
  error,
  onSubmit,
}: Props) {
  // Parent remounts this component (via React key) on question change,
  // so initial state is fresh each time — no setState-in-effect needed.
  const [text, setText] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  const canSubmit = text.trim().length > 0 && !isSubmitting;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    onSubmit(text.trim());
  };

  const handleKey = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter" && canSubmit) {
      e.preventDefault();
      onSubmit(text.trim());
    }
  };

  return (
    <div
      style={{
        maxWidth: 920,
        margin: "0 auto",
        padding: "32px 32px 60px",
      }}
    >
      <div
        style={{
          background: "rgba(255,255,255,0.78)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.95)",
          borderRadius: 28,
          padding: 36,
          boxShadow:
            "0 25px 50px -12px rgba(15,23,42,0.12), inset 0 1px 2px rgba(255,255,255,0.7)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 14,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#1d4ed8",
              background: "rgba(219,234,254,0.7)",
              border: "1px solid rgba(96,165,250,0.4)",
              borderRadius: 99,
              padding: "4px 11px",
              letterSpacing: "0.05em",
              textTransform: "uppercase",
            }}
          >
            {round === "resume" ? "Resume" : "Behavioural"}
          </span>
          {followUpIndex > 0 && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#b45309",
                background: "rgba(254,243,199,0.7)",
                border: "1px solid rgba(251,191,36,0.5)",
                borderRadius: 99,
                padding: "4px 11px",
                letterSpacing: "0.05em",
                textTransform: "uppercase",
              }}
            >
              Follow-up {followUpIndex} of 3
            </span>
          )}
        </div>

        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.5px",
            lineHeight: 1.35,
            marginBottom: 22,
          }}
        >
          {question.question}
        </h2>

        <form onSubmit={handleSubmit}>
          <label
            htmlFor="qa-answer"
            style={{
              display: "block",
              fontSize: 12.5,
              fontWeight: 600,
              color: "#475569",
              marginBottom: 6,
            }}
          >
            Your answer
          </label>
          <textarea
            id="qa-answer"
            ref={textareaRef}
            rows={9}
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={handleKey}
            disabled={isSubmitting}
            placeholder="Type your answer here. Be specific — examples and structure help."
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.95)",
              border: "1px solid rgba(203,213,225,0.7)",
              borderRadius: 14,
              padding: "14px 16px",
              fontSize: 14.5,
              lineHeight: 1.6,
              color: "#0f172a",
              outline: "none",
              transition: "all 0.2s",
              boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
              fontFamily: "inherit",
              resize: "vertical",
            }}
            onFocus={(e) => {
              e.currentTarget.style.borderColor = "rgba(59,130,246,0.7)";
              e.currentTarget.style.boxShadow =
                "inset 0 1px 2px rgba(15,23,42,0.04), 0 0 0 3px rgba(59,130,246,0.15)";
            }}
            onBlur={(e) => {
              e.currentTarget.style.borderColor = "rgba(203,213,225,0.7)";
              e.currentTarget.style.boxShadow =
                "inset 0 1px 2px rgba(15,23,42,0.04)";
            }}
          />

          {error && (
            <div
              role="alert"
              style={{
                marginTop: 12,
                padding: "10px 14px",
                borderRadius: 12,
                background: "rgba(254,226,226,0.7)",
                border: "1px solid rgba(248,113,113,0.5)",
                color: "#b91c1c",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {error}
            </div>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 18,
              gap: 12,
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: "#94a3b8",
                fontWeight: 500,
              }}
            >
              Press{" "}
              <kbd
                style={{
                  background: "rgba(241,245,249,0.9)",
                  border: "1px solid rgba(203,213,225,0.8)",
                  borderRadius: 5,
                  padding: "1px 6px",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "inherit",
                }}
              >
                ⌘
              </kbd>{" "}
              +{" "}
              <kbd
                style={{
                  background: "rgba(241,245,249,0.9)",
                  border: "1px solid rgba(203,213,225,0.8)",
                  borderRadius: 5,
                  padding: "1px 6px",
                  fontSize: 11,
                  fontWeight: 600,
                  fontFamily: "inherit",
                }}
              >
                Enter
              </kbd>{" "}
              to submit
            </div>
            <button
              type="submit"
              disabled={!canSubmit}
              style={{
                background: canSubmit
                  ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
                  : "rgba(203,213,225,0.8)",
                color: "#fff",
                border: "none",
                borderRadius: 99,
                padding: "12px 26px",
                fontSize: 14,
                fontWeight: 700,
                cursor: canSubmit ? "pointer" : "not-allowed",
                display: "flex",
                alignItems: "center",
                gap: 9,
                boxShadow: canSubmit
                  ? "0 8px 22px rgba(59,130,246,0.4)"
                  : "none",
                transition: "all 0.2s",
              }}
            >
              {isSubmitting ? (
                <>
                  <Spinner /> Submitting…
                </>
              ) : (
                <>
                  Submit Answer
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path
                      d="M2 7h10M8 3l4 4-4 4"
                      stroke="white"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const Spinner = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 16 16"
    fill="none"
    style={{ animation: "spin 1s linear infinite" }}
  >
    <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    <circle
      cx="8"
      cy="8"
      r="6"
      stroke="currentColor"
      strokeWidth="2"
      strokeOpacity="0.25"
    />
    <path
      d="M14 8a6 6 0 00-6-6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);
