import React, { useState } from "react";
import MarkdownView from "./MarkdownView";
import {
  dsaRun,
  dsaTest,
  dsaSubmit,
  InterviewServiceError,
} from "../../../services/interview.service";
import type {
  DsaCaseResult,
  DsaRunResponse,
  DsaTestResponse,
  InterviewStateResponse,
  QuestionPayload,
} from "../../../services/interview.service";

interface Props {
  sessionId: number;
  token: string;
  question: Extract<QuestionPayload, { type: "dsa" }>;
  onAdvance: (next: InterviewStateResponse) => void;
}

type LangOpt =
  | "python"
  | "javascript"
  | "typescript"
  | "java"
  | "c"
  | "c++"
  | "go"
  | "csharp"
  | "bash";

const LANGUAGES: { value: LangOpt; label: string; starter: string }[] = [
  {
    value: "python",
    label: "Python",
    starter: "import sys\n\ndef solve():\n    pass\n\nsolve()\n",
  },
  {
    value: "javascript",
    label: "JavaScript",
    starter:
      "process.stdin.resume();\nlet input = '';\nprocess.stdin.on('data', d => input += d);\nprocess.stdin.on('end', () => {\n  // ...\n});\n",
  },
  {
    value: "typescript",
    label: "TypeScript",
    starter: "// write your solution here\n",
  },
  {
    value: "java",
    label: "Java",
    starter:
      "import java.util.*;\n\npublic class Main {\n    public static void main(String[] args) {\n        Scanner sc = new Scanner(System.in);\n    }\n}\n",
  },
  {
    value: "c",
    label: "C",
    starter: "#include <stdio.h>\n\nint main() {\n    return 0;\n}\n",
  },
  {
    value: "c++",
    label: "C++",
    starter:
      "#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n    return 0;\n}\n",
  },
  { value: "go", label: "Go", starter: "package main\n\nfunc main() {\n}\n" },
  {
    value: "csharp",
    label: "C#",
    starter:
      "using System;\n\nclass Program {\n    static void Main() {\n    }\n}\n",
  },
  { value: "bash", label: "Bash", starter: "#!/bin/bash\n" },
];

type ConsoleState =
  | { kind: "idle" }
  | { kind: "running"; label: string }
  | { kind: "run-result"; result: DsaRunResponse }
  | { kind: "test-result"; result: DsaTestResponse }
  | {
      kind: "submit-result";
      results: DsaCaseResult[];
      score: number;
      hasNext: boolean;
    }
  | { kind: "error"; message: string };

export default function DsaPanel({
  sessionId,
  token,
  question,
  onAdvance,
}: Props) {
  const [language, setLanguage] = useState<LangOpt>("python");
  const [source, setSource] = useState<string>(
    LANGUAGES.find((l) => l.value === "python")?.starter ?? "",
  );
  const [stdin, setStdin] = useState("");
  const [showStdin, setShowStdin] = useState(false);
  const [consoleState, setConsoleState] = useState<ConsoleState>({
    kind: "idle",
  });
  const [showConfirm, setShowConfirm] = useState(false);

  // Question changes are handled by parent remounting via React key.
  // Language switch swaps the editor starter only if the user hasn't typed
  // anything significant — keep their code if they have, otherwise load the
  // new starter.
  const handleLanguageChange = (next: LangOpt) => {
    const currentStarter =
      LANGUAGES.find((l) => l.value === language)?.starter ?? "";
    const nextStarter = LANGUAGES.find((l) => l.value === next)?.starter ?? "";
    setLanguage(next);
    if (source.trim() === currentStarter.trim() || source.trim() === "") {
      setSource(nextStarter);
    }
  };

  const isBusy = consoleState.kind === "running";

  const handleRun = async () => {
    setConsoleState({ kind: "running", label: "Running…" });
    try {
      const res = await dsaRun(
        sessionId,
        { source_code: source, language, stdin },
        token,
      );
      setConsoleState({ kind: "run-result", result: res });
    } catch (e) {
      setConsoleState({
        kind: "error",
        message:
          e instanceof InterviewServiceError ? e.message : "Network error.",
      });
    }
  };

  const handleTest = async () => {
    setConsoleState({ kind: "running", label: "Running hidden test cases…" });
    try {
      const res = await dsaTest(
        sessionId,
        { source_code: source, language },
        token,
      );
      setConsoleState({ kind: "test-result", result: res });
    } catch (e) {
      setConsoleState({
        kind: "error",
        message:
          e instanceof InterviewServiceError ? e.message : "Network error.",
      });
    }
  };

  const handleSubmit = async () => {
    setShowConfirm(false);
    setConsoleState({ kind: "running", label: "Grading your submission…" });
    try {
      const res = await dsaSubmit(
        sessionId,
        { source_code: source, language },
        token,
      );
      setConsoleState({
        kind: "submit-result",
        results: res.case_results,
        score: res.score,
        hasNext: !res.next_state.completed,
      });
      // Slight delay so the candidate sees the per-case results before transition
      setTimeout(() => onAdvance(res.next_state), 1800);
    } catch (e) {
      setConsoleState({
        kind: "error",
        message:
          e instanceof InterviewServiceError ? e.message : "Network error.",
      });
    }
  };

  const applySampleStdin = (i: number) => {
    const sample = question.sample_test_cases?.[i];
    if (sample) {
      setStdin(sample.stdin);
      setShowStdin(true);
    }
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1.15fr)",
        gap: 18,
        padding: "20px 32px 60px",
        maxWidth: 1500,
        margin: "0 auto",
        minHeight: "calc(100vh - 110px)",
      }}
    >
      {/* LEFT: problem statement */}
      <section
        style={{
          background: "rgba(255,255,255,0.78)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.95)",
          borderRadius: 22,
          padding: 28,
          boxShadow: "0 18px 40px -12px rgba(15,23,42,0.1)",
          overflow: "auto",
          maxHeight: "calc(100vh - 110px)",
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
          Coding round
        </span>
        <h2
          style={{
            fontSize: 24,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.5px",
            marginTop: 12,
            marginBottom: 14,
          }}
        >
          {question.problem_name}
        </h2>
        <div
          style={{
            fontSize: 11.5,
            color: "#64748b",
            fontWeight: 600,
            marginBottom: 18,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
            }}
          >
            <ClockIcon /> {(question.time_limit_ms / 1000).toFixed(1)}s per case
          </span>
        </div>

        <MarkdownView source={question.description} />

        {question.sample_test_cases &&
          question.sample_test_cases.length > 0 && (
            <div style={{ marginTop: 22 }}>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 800,
                  color: "#0f172a",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                  marginBottom: 12,
                }}
              >
                Sample test cases
              </div>
              {question.sample_test_cases.map((c, i) => (
                <div
                  key={i}
                  style={{
                    marginBottom: 14,
                    background: "rgba(248,250,252,0.6)",
                    border: "1px solid rgba(226,232,240,0.7)",
                    borderRadius: 12,
                    padding: 12,
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: 8,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#475569",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                      }}
                    >
                      Case {i + 1}
                    </span>
                    <button
                      onClick={() => applySampleStdin(i)}
                      style={{
                        fontSize: 11,
                        fontWeight: 700,
                        color: "#2563eb",
                        background: "rgba(219,234,254,0.6)",
                        border: "1px solid rgba(147,197,253,0.5)",
                        borderRadius: 99,
                        padding: "3px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Use as input
                    </button>
                  </div>
                  <CodeBlock label="stdin" body={c.stdin} />
                  <div style={{ height: 6 }} />
                  <CodeBlock label="expected" body={c.expected_stdout} />
                </div>
              ))}
            </div>
          )}
      </section>

      {/* RIGHT: editor + console */}
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 12,
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.78)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.95)",
            borderRadius: 22,
            padding: 18,
            boxShadow: "0 18px 40px -12px rgba(15,23,42,0.1)",
            display: "flex",
            flexDirection: "column",
            gap: 12,
            flex: 1,
            minHeight: 380,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span
                style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: "0.08em",
                }}
              >
                Editor
              </span>
              <select
                value={language}
                onChange={(e) =>
                  handleLanguageChange(e.target.value as LangOpt)
                }
                disabled={isBusy}
                style={{
                  background: "rgba(255,255,255,0.95)",
                  border: "1px solid rgba(203,213,225,0.7)",
                  borderRadius: 8,
                  padding: "5px 10px",
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#0f172a",
                  fontFamily: "inherit",
                  cursor: "pointer",
                }}
              >
                {LANGUAGES.map((l) => (
                  <option key={l.value} value={l.value}>
                    {l.label}
                  </option>
                ))}
              </select>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <EditorBtn onClick={handleRun} disabled={isBusy} kind="ghost">
                <PlayIcon /> Run
              </EditorBtn>
              <EditorBtn onClick={handleTest} disabled={isBusy} kind="ghost">
                <BeakerIcon /> Test Hidden
              </EditorBtn>
              <EditorBtn
                onClick={() => setShowConfirm(true)}
                disabled={isBusy}
                kind="primary"
              >
                <CheckIcon /> Submit
              </EditorBtn>
            </div>
          </div>

          <textarea
            value={source}
            onChange={(e) => setSource(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1,
              minHeight: 320,
              background: "#0f172a",
              color: "#e2e8f0",
              border: "1px solid rgba(15,23,42,0.6)",
              borderRadius: 14,
              padding: "14px 16px",
              fontFamily:
                "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
              fontSize: 13,
              lineHeight: 1.6,
              outline: "none",
              resize: "vertical",
              tabSize: 4,
            }}
            onKeyDown={(e) => {
              if (e.key === "Tab") {
                e.preventDefault();
                const t = e.currentTarget;
                const s = t.selectionStart;
                const next = source.slice(0, s) + "    " + source.slice(s);
                setSource(next);
                requestAnimationFrame(() => {
                  t.selectionStart = t.selectionEnd = s + 4;
                });
              }
            }}
          />

          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <button
              onClick={() => setShowStdin((s) => !s)}
              style={{
                fontSize: 12,
                color: "#2563eb",
                background: "transparent",
                border: "none",
                cursor: "pointer",
                fontWeight: 600,
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}
            >
              {showStdin ? "▾" : "▸"} Custom stdin
            </button>
            <span
              style={{
                fontSize: 11,
                color: "#94a3b8",
                fontWeight: 500,
              }}
            >
              Auto-save: in-memory only · submit before refresh
            </span>
          </div>

          {showStdin && (
            <textarea
              value={stdin}
              onChange={(e) => setStdin(e.target.value)}
              placeholder="Enter custom stdin for the Run button…"
              rows={3}
              style={{
                background: "rgba(15,23,42,0.05)",
                border: "1px solid rgba(203,213,225,0.7)",
                borderRadius: 10,
                padding: "10px 12px",
                fontFamily:
                  "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
                fontSize: 12.5,
                color: "#0f172a",
                outline: "none",
                resize: "vertical",
              }}
            />
          )}
        </div>

        <Console state={consoleState} />
      </section>

      {showConfirm && (
        <ConfirmModal
          onCancel={() => setShowConfirm(false)}
          onConfirm={handleSubmit}
        />
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

const Console: React.FC<{ state: ConsoleState }> = ({ state }) => (
  <div
    style={{
      background: "rgba(15,23,42,0.92)",
      color: "#e2e8f0",
      borderRadius: 18,
      padding: 18,
      minHeight: 160,
      boxShadow: "0 18px 40px -12px rgba(15,23,42,0.25)",
      fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
      fontSize: 12.5,
      maxHeight: 280,
      overflow: "auto",
    }}
  >
    <div
      style={{
        fontSize: 11,
        color: "#94a3b8",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        fontWeight: 700,
        marginBottom: 10,
      }}
    >
      Console
    </div>
    <ConsoleBody state={state} />
  </div>
);

const ConsoleBody: React.FC<{ state: ConsoleState }> = ({ state }) => {
  if (state.kind === "idle") {
    return (
      <div style={{ color: "#64748b", fontStyle: "italic" }}>
        Output will appear here after you run, test, or submit your code.
      </div>
    );
  }
  if (state.kind === "running") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          color: "#bfdbfe",
        }}
      >
        <Spinner />
        {state.label}
      </div>
    );
  }
  if (state.kind === "error") {
    return <div style={{ color: "#fca5a5" }}>✘ {state.message}</div>;
  }
  if (state.kind === "run-result") {
    const r = state.result;
    return (
      <div>
        <Line
          label="exit"
          value={String(r.exit_code)}
          tone={r.exit_code === 0 ? "ok" : "bad"}
        />
        {r.stdout && (
          <div style={{ marginTop: 8 }}>
            <div
              style={{
                color: "#94a3b8",
                fontSize: 10.5,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              stdout
            </div>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                color: "#e2e8f0",
                background: "rgba(255,255,255,0.04)",
                padding: 8,
                borderRadius: 8,
              }}
            >
              {r.stdout}
            </pre>
          </div>
        )}
        {r.stderr && (
          <div style={{ marginTop: 8 }}>
            <div
              style={{
                color: "#fca5a5",
                fontSize: 10.5,
                textTransform: "uppercase",
                marginBottom: 4,
              }}
            >
              stderr
            </div>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                color: "#fecaca",
                background: "rgba(248,113,113,0.08)",
                padding: 8,
                borderRadius: 8,
              }}
            >
              {r.stderr}
            </pre>
          </div>
        )}
      </div>
    );
  }
  if (state.kind === "test-result") {
    const passed = state.result.case_results.filter(
      (c) => c.status === "passed",
    ).length;
    return (
      <div>
        <div style={{ marginBottom: 10, color: "#cbd5e1" }}>
          <strong style={{ color: "#fff" }}>
            {passed} / {state.result.case_results.length}
          </strong>{" "}
          cases passed
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {state.result.case_results.map((c) => (
            <CaseDot key={c.case} idx={c.case} status={c.status} />
          ))}
        </div>
      </div>
    );
  }
  if (state.kind === "submit-result") {
    const passed = state.results.filter((c) => c.status === "passed").length;
    return (
      <div>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <div style={{ color: "#cbd5e1" }}>
            <strong style={{ color: "#fff" }}>
              {passed} / {state.results.length}
            </strong>{" "}
            cases passed · score{" "}
            <strong style={{ color: "#a7f3d0" }}>
              {state.score.toFixed(1)}
            </strong>
          </div>
          <div style={{ color: "#94a3b8", fontSize: 11 }}>
            {state.hasNext ? "Advancing to next question…" : "Wrapping up…"}
          </div>
        </div>
        {state.results.map((c) => (
          <CaseRow key={c.case} result={c} />
        ))}
      </div>
    );
  }
  return null;
};

const CaseDot: React.FC<{
  idx: number;
  status: "passed" | "failed" | "error";
}> = ({ idx, status }) => {
  const color =
    status === "passed"
      ? "#10b981"
      : status === "failed"
        ? "#f59e0b"
        : "#ef4444";
  const label = status === "passed" ? "✓" : status === "failed" ? "✗" : "⚠";
  return (
    <div
      title={`Case ${idx}: ${status}`}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        background: `${color}22`,
        color,
        border: `1px solid ${color}55`,
        borderRadius: 99,
        padding: "4px 10px",
        fontSize: 11.5,
        fontWeight: 700,
      }}
    >
      <span>{label}</span>
      Case {idx}
    </div>
  );
};

const CaseRow: React.FC<{ result: DsaCaseResult }> = ({ result }) => {
  const color =
    result.status === "passed"
      ? "#10b981"
      : result.status === "failed"
        ? "#f59e0b"
        : "#ef4444";
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.04)",
        border: `1px solid ${color}33`,
        borderRadius: 10,
        padding: 10,
        marginBottom: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 6,
        }}
      >
        <span style={{ color, fontWeight: 700, fontSize: 12 }}>
          Case {result.case} · {result.status.toUpperCase()}
        </span>
      </div>
      {result.status !== "passed" && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 8,
            fontSize: 11.5,
          }}
        >
          <div>
            <div style={{ color: "#94a3b8", marginBottom: 3 }}>expected</div>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                background: "rgba(16,185,129,0.08)",
                padding: 6,
                borderRadius: 6,
                color: "#bbf7d0",
              }}
            >
              {result.expected}
            </pre>
          </div>
          <div>
            <div style={{ color: "#94a3b8", marginBottom: 3 }}>actual</div>
            <pre
              style={{
                whiteSpace: "pre-wrap",
                background: "rgba(248,113,113,0.08)",
                padding: 6,
                borderRadius: 6,
                color: "#fecaca",
              }}
            >
              {result.actual}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
};

const Line: React.FC<{
  label: string;
  value: string;
  tone: "ok" | "bad";
}> = ({ label, value, tone }) => (
  <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
    <span
      style={{
        color: "#94a3b8",
        fontSize: 11,
        textTransform: "uppercase",
        letterSpacing: "0.06em",
      }}
    >
      {label}
    </span>
    <span
      style={{
        color: tone === "ok" ? "#a7f3d0" : "#fecaca",
        fontWeight: 700,
      }}
    >
      {value}
    </span>
  </div>
);

const CodeBlock: React.FC<{ label: string; body: string }> = ({
  label,
  body,
}) => (
  <div>
    <div
      style={{
        fontSize: 10.5,
        color: "#64748b",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        fontWeight: 700,
        marginBottom: 4,
      }}
    >
      {label}
    </div>
    <pre
      style={{
        whiteSpace: "pre-wrap",
        background: "rgba(15,23,42,0.92)",
        color: "#e2e8f0",
        padding: "8px 10px",
        borderRadius: 8,
        fontSize: 11.5,
        fontFamily: "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
        margin: 0,
      }}
    >
      {body}
    </pre>
  </div>
);

const EditorBtn: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  kind: "primary" | "ghost";
  children: React.ReactNode;
}> = ({ onClick, disabled, kind, children }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    style={{
      display: "flex",
      alignItems: "center",
      gap: 6,
      padding: "8px 14px",
      borderRadius: 10,
      fontSize: 12.5,
      fontWeight: 700,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.6 : 1,
      border: kind === "primary" ? "none" : "1px solid rgba(203,213,225,0.8)",
      background:
        kind === "primary"
          ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
          : "rgba(255,255,255,0.85)",
      color: kind === "primary" ? "#fff" : "#475569",
      boxShadow:
        kind === "primary" ? "0 6px 18px rgba(59,130,246,0.4)" : "none",
      transition: "all 0.15s",
    }}
  >
    {children}
  </button>
);

const ConfirmModal: React.FC<{
  onCancel: () => void;
  onConfirm: () => void;
}> = ({ onCancel, onConfirm }) => (
  <div
    role="dialog"
    aria-modal="true"
    style={{
      position: "fixed",
      inset: 0,
      background: "rgba(15,23,42,0.55)",
      backdropFilter: "blur(6px)",
      WebkitBackdropFilter: "blur(6px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 100,
    }}
  >
    <div
      style={{
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
        border: "1px solid rgba(255,255,255,0.95)",
        borderRadius: 22,
        padding: 28,
        maxWidth: 420,
        width: "92%",
        boxShadow: "0 35px 60px -15px rgba(15,23,42,0.3)",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 12,
          background: "linear-gradient(145deg,#fef3c7,#fde68a)",
          color: "#b45309",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 12,
        }}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 9v4M12 17h.01M10.3 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.7 3.86a2 2 0 00-3.4 0z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <h3
        style={{
          fontSize: 19,
          fontWeight: 800,
          color: "#0f172a",
          letterSpacing: "-0.4px",
          marginBottom: 6,
        }}
      >
        Submit final answer?
      </h3>
      <p
        style={{
          fontSize: 13.5,
          color: "#64748b",
          lineHeight: 1.55,
          marginBottom: 22,
        }}
      >
        This is your final submission for this question. You won't be able to
        resubmit. The session will advance once grading completes.
      </p>
      <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
        <button
          onClick={onCancel}
          style={{
            background: "rgba(241,245,249,0.9)",
            border: "1px solid rgba(203,213,225,0.7)",
            borderRadius: 99,
            padding: "10px 20px",
            fontSize: 13,
            fontWeight: 600,
            color: "#475569",
            cursor: "pointer",
          }}
        >
          Keep editing
        </button>
        <button
          onClick={onConfirm}
          style={{
            background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
            color: "#fff",
            border: "none",
            borderRadius: 99,
            padding: "10px 22px",
            fontSize: 13,
            fontWeight: 700,
            cursor: "pointer",
            boxShadow: "0 6px 18px rgba(59,130,246,0.4)",
          }}
        >
          Submit final
        </button>
      </div>
    </div>
  </div>
);

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

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.4" />
    <path
      d="M6 3v3l2 1"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
);

const PlayIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
    <path d="M3 2l7 4-7 4z" />
  </svg>
);

const BeakerIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M9 3h6M10 3v6L5 19c-1 2 0 3 2 3h10c2 0 3-1 2-3L14 9V3"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M5 12l5 5L20 7"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
