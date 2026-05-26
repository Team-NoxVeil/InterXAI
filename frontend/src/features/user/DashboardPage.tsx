import React, { useMemo, useState } from "react";
import { useDashboard } from "./hooks/useDashboard";
import type {
  InterviewBasic,
  AppliedInterview,
  UserResponse,
} from "../../services/user.service";

export interface DashboardPageProps {
  user: UserResponse;
  token: string;
  onLogout: () => void;
  onAttemptInterview?: (interviewId: number) => void;
}

type Tab = "available" | "applied";

const STATUS_STYLES: Record<
  string,
  { bg: string; border: string; color: string; dot: string }
> = {
  pending: {
    bg: "rgba(254,243,199,0.7)",
    border: "rgba(251,191,36,0.5)",
    color: "#b45309",
    dot: "#f59e0b",
  },
  approved: {
    bg: "rgba(209,250,229,0.7)",
    border: "rgba(52,211,153,0.5)",
    color: "#047857",
    dot: "#10b981",
  },
  rejected: {
    bg: "rgba(254,226,226,0.7)",
    border: "rgba(248,113,113,0.5)",
    color: "#b91c1c",
    dot: "#ef4444",
  },
  completed: {
    bg: "rgba(219,234,254,0.7)",
    border: "rgba(96,165,250,0.5)",
    color: "#1d4ed8",
    dot: "#3b82f6",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function timeRemaining(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { label: "Deadline passed", urgent: true };
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return { label: `${days}d remaining`, urgent: days <= 2 };
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return { label: `${hours}h remaining`, urgent: true };
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  token,
  onLogout,
  onAttemptInterview,
}) => {
  const [tab, setTab] = useState<Tab>("available");
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const { available, applied, isLoading, error, refetch } = useDashboard(token);

  const displayName = user.username;
  const initials = displayName.slice(0, 2).toUpperCase();

  const filteredAvailable = useMemo(
    () =>
      available.filter((i) =>
        i.position.toLowerCase().includes(query.toLowerCase()),
      ),
    [available, query],
  );
  const filteredApplied = useMemo(
    () =>
      applied.filter((i) =>
        i.position.toLowerCase().includes(query.toLowerCase()),
      ),
    [applied, query],
  );

  const selectedInterview = useMemo(() => {
    if (selectedId == null) return null;
    return (
      available.find((i) => i.id === selectedId) ??
      applied.find((i) => i.id === selectedId) ??
      null
    );
  }, [selectedId, available, applied]);

  return (
    <div
      id="dashboard-page"
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

      {/* Sticky glassmorphic top nav */}
      <header
        style={{
          position: "sticky",
          top: 0,
          zIndex: 40,
          background: "rgba(255,255,255,0.65)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.7)",
          boxShadow: "0 2px 16px rgba(15,23,42,0.04)",
        }}
      >
        <div
          style={{
            maxWidth: 1300,
            margin: "0 auto",
            padding: "14px 52px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: 9,
                background: "linear-gradient(145deg,#4f9cf9,#1649c9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1.5px solid rgba(255,255,255,0.35)",
              }}
            >
              <span style={{ color: "#fff", fontWeight: 800, fontSize: 14 }}>
                X
              </span>
            </div>
            <span
              style={{
                fontWeight: 800,
                fontSize: 17,
                color: "#0f172a",
                letterSpacing: "-0.4px",
              }}
            >
              InterXAI
            </span>
          </div>

          <SearchBar
            value={query}
            onChange={setQuery}
            placeholder="Search interviews…"
          />

          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <button
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.95)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }}
              aria-label="Notifications"
            >
              <BellIcon />
              <span
                style={{
                  position: "absolute",
                  top: 7,
                  right: 9,
                  width: 7,
                  height: 7,
                  borderRadius: "50%",
                  background: "#ef4444",
                  border: "1.5px solid #fff",
                }}
              />
            </button>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "4px 12px 4px 4px",
                background: "rgba(255,255,255,0.7)",
                border: "1px solid rgba(255,255,255,0.95)",
                borderRadius: 99,
              }}
            >
              <div
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: "50%",
                  background: "linear-gradient(145deg,#4f9cf9,#1649c9)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(59,130,246,0.35)",
                }}
              >
                {initials}
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: "#0f172a",
                    lineHeight: 1.2,
                  }}
                >
                  {displayName}
                </span>
                <span
                  style={{
                    fontSize: 10.5,
                    color: "#64748b",
                    lineHeight: 1.2,
                  }}
                >
                  {user.email}
                </span>
              </div>
            </div>

            <button
              onClick={onLogout}
              id="dashboard-logout"
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
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main */}
      <main
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1300,
          margin: "0 auto",
          padding: "32px 52px 60px",
          display: "grid",
          gridTemplateColumns: selectedInterview ? "1fr 380px" : "1fr",
          gap: 24,
          alignItems: "flex-start",
        }}
      >
        <div>
          {/* Hero stats */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
              gap: 16,
              marginBottom: 28,
            }}
          >
            <div
              style={{
                background:
                  "linear-gradient(135deg, rgba(59,130,246,0.95), rgba(29,78,216,0.95))",
                borderRadius: 22,
                padding: "22px 24px",
                color: "#fff",
                boxShadow: "0 18px 40px -10px rgba(29,78,216,0.45)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: -40,
                  right: -40,
                  width: 180,
                  height: 180,
                  borderRadius: "50%",
                  background: "rgba(255,255,255,0.12)",
                }}
              />
              <Pill text="Today's focus" light />
              <div
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  letterSpacing: "-0.5px",
                  marginTop: 12,
                  marginBottom: 4,
                }}
              >
                Welcome back, {displayName} 👋
              </div>
              <div
                style={{
                  fontSize: 13.5,
                  color: "rgba(255,255,255,0.85)",
                  fontWeight: 500,
                }}
              >
                You have {available.length} new interviews and{" "}
                {applied.filter((a) => a.status === "pending").length} awaiting
                review.
              </div>
            </div>

            <MetricCard
              label="Available"
              value={available.length}
              accent="#3b82f6"
              icon={<BriefcaseIcon />}
            />
            <MetricCard
              label="Applied"
              value={applied.length}
              accent="#8b5cf6"
              icon={<ClipboardIcon />}
            />
            <MetricCard
              label="Avg. Score"
              value="82%"
              accent="#10b981"
              icon={<TrendIcon />}
            />
          </div>

          {/* Profile reminder */}
          {!user.profile?.bio && (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "14px 18px",
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(14px)",
                WebkitBackdropFilter: "blur(14px)",
                border: "1px solid rgba(147,197,253,0.6)",
                borderRadius: 16,
                marginBottom: 22,
                boxShadow: "0 6px 18px rgba(59,130,246,0.08)",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: "linear-gradient(145deg,#dbeafe,#bfdbfe)",
                  color: "#1d4ed8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                <InfoIcon />
              </div>
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  Your profile is incomplete
                </div>
                <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 2 }}>
                  Add your bio and links so organisations can find you.
                </div>
              </div>
              <button
                style={{
                  background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 99,
                  padding: "8px 16px",
                  fontSize: 12.5,
                  fontWeight: 700,
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
                }}
              >
                Complete profile →
              </button>
            </div>
          )}

          {/* Tab toggle */}
          <div
            role="tablist"
            style={{
              display: "inline-flex",
              padding: 4,
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.95)",
              borderRadius: 99,
              marginBottom: 18,
              boxShadow: "0 4px 14px rgba(15,23,42,0.04)",
            }}
          >
            {(["available", "applied"] as Tab[]).map((t) => (
              <button
                key={t}
                role="tab"
                aria-selected={tab === t}
                id={`tab-${t}`}
                onClick={() => setTab(t)}
                style={{
                  padding: "8px 18px",
                  borderRadius: 99,
                  fontSize: 13,
                  fontWeight: 700,
                  border: "none",
                  cursor: "pointer",
                  background:
                    tab === t
                      ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
                      : "transparent",
                  color: tab === t ? "#fff" : "#64748b",
                  boxShadow:
                    tab === t ? "0 6px 16px rgba(59,130,246,0.35)" : "none",
                  transition: "all 0.2s",
                  textTransform: "capitalize",
                }}
              >
                {t === "available"
                  ? `Available · ${available.length}`
                  : `Applied · ${applied.length}`}
              </button>
            ))}
          </div>

          {error && (
            <div style={{ marginBottom: 18 }}>
              <ErrorAlert message={error} />
              <button
                onClick={refetch}
                style={{
                  marginTop: 8,
                  fontSize: 13,
                  color: "#2563eb",
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 600,
                }}
              >
                Try again →
              </button>
            </div>
          )}

          {isLoading && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
                gap: 16,
              }}
            >
              {[1, 2, 3, 4].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {!isLoading && !error && (
            <>
              {tab === "available" &&
                (filteredAvailable.length === 0 ? (
                  <EmptyState
                    icon={<BriefcaseIcon size={28} />}
                    title={
                      query
                        ? "No matches found"
                        : "No interviews available right now"
                    }
                    description={
                      query
                        ? `Try a different search term.`
                        : "Check back soon — new positions are added regularly."
                    }
                  />
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(320px, 1fr))",
                      gap: 16,
                    }}
                  >
                    {filteredAvailable.map((iv) => (
                      <AvailableCard
                        key={iv.id}
                        interview={iv}
                        selected={selectedId === iv.id}
                        onSelect={() =>
                          setSelectedId((p) => (p === iv.id ? null : iv.id))
                        }
                        onAttempt={() => onAttemptInterview?.(iv.id)}
                      />
                    ))}
                  </div>
                ))}

              {tab === "applied" &&
                (filteredApplied.length === 0 ? (
                  <EmptyState
                    icon={<ClipboardIcon size={28} />}
                    title={
                      query
                        ? "No matches found"
                        : "You haven't applied to anything yet"
                    }
                    description={
                      query
                        ? "Try a different search term."
                        : "Browse available interviews and submit your first application."
                    }
                  />
                ) : (
                  <div
                    style={{
                      display: "grid",
                      gridTemplateColumns:
                        "repeat(auto-fill, minmax(320px, 1fr))",
                      gap: 16,
                    }}
                  >
                    {filteredApplied.map((iv) => (
                      <AppliedCard
                        key={iv.id}
                        interview={iv}
                        selected={selectedId === iv.id}
                        onSelect={() =>
                          setSelectedId((p) => (p === iv.id ? null : iv.id))
                        }
                        onAttempt={() => onAttemptInterview?.(iv.id)}
                      />
                    ))}
                  </div>
                ))}
            </>
          )}
        </div>

        {/* Detail panel */}
        {selectedInterview && (
          <aside
            style={{
              position: "sticky",
              top: 88,
              background: "rgba(255,255,255,0.78)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              border: "1px solid rgba(255,255,255,0.95)",
              borderRadius: 24,
              padding: 24,
              boxShadow:
                "0 25px 50px -12px rgba(15,23,42,0.12), inset 0 1px 2px rgba(255,255,255,0.7)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 12,
                marginBottom: 14,
              }}
            >
              <Pill text={`Interview · #${selectedInterview.id}`} />
              <button
                onClick={() => setSelectedId(null)}
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "rgba(241,245,249,0.8)",
                  border: "none",
                  color: "#64748b",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                aria-label="Close details"
              >
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path
                    d="M2 2l8 8M10 2l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
            <h3
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.5px",
                marginBottom: 6,
              }}
            >
              {selectedInterview.position}
            </h3>
            <p
              style={{
                fontSize: 12.5,
                color: "#64748b",
                fontWeight: 500,
                marginBottom: 18,
              }}
            >
              {selectedInterview.experience} experience
            </p>
            <div
              style={{
                fontSize: 13,
                color: "#475569",
                lineHeight: 1.65,
                background: "rgba(248,250,252,0.6)",
                padding: 14,
                borderRadius: 12,
                border: "1px solid rgba(226,232,240,0.7)",
                marginBottom: 18,
              }}
            >
              {selectedInterview.description}
            </div>

            <DetailRow
              icon={<CalendarIcon />}
              label="Interview window"
              value={`${formatDate(selectedInterview.start_time)} → ${formatDate(selectedInterview.end_time)}`}
            />
            <DetailRow
              icon={<ClockIcon />}
              label="Submission deadline"
              value={formatDate(selectedInterview.submission_deadline)}
            />
            {"status" in selectedInterview && (
              <DetailRow
                icon={<TrendIcon />}
                label="Status"
                value={
                  <StatusBadge
                    status={(selectedInterview as AppliedInterview).status}
                  />
                }
              />
            )}

            <button
              onClick={() => onAttemptInterview?.(selectedInterview.id)}
              style={{
                marginTop: 18,
                width: "100%",
                background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
                color: "#fff",
                border: "none",
                borderRadius: 99,
                padding: "12px 22px",
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                boxShadow: "0 8px 22px rgba(59,130,246,0.4)",
              }}
            >
              {"status" in selectedInterview
                ? "Attempt Interview"
                : "Apply Now"}
              <ArrowIcon />
            </button>
          </aside>
        )}
      </main>
    </div>
  );
};

// ── Cards ─────────────────────────────────────────────────────────────────────

const AvailableCard: React.FC<{
  interview: InterviewBasic;
  selected: boolean;
  onSelect: () => void;
  onAttempt: () => void;
}> = ({ interview, selected, onSelect, onAttempt }) => {
  const t = timeRemaining(interview.submission_deadline);
  return (
    <div
      onClick={onSelect}
      style={{
        textAlign: "left",
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: selected
          ? "1.5px solid rgba(59,130,246,0.7)"
          : "1px solid rgba(255,255,255,0.95)",
        borderRadius: 22,
        padding: 22,
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: selected
          ? "0 18px 40px -10px rgba(59,130,246,0.25)"
          : "0 8px 22px rgba(15,23,42,0.05)",
        transform: selected ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          gap: 12,
          marginBottom: 12,
        }}
      >
        <div style={{ flex: 1 }}>
          <h3
            style={{
              fontSize: 15.5,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.3px",
              marginBottom: 4,
              lineHeight: 1.3,
            }}
          >
            {interview.position}
          </h3>
          <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
            {interview.experience} experience
          </div>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: t.urgent ? "#b45309" : "#1d4ed8",
            background: t.urgent
              ? "rgba(254,243,199,0.7)"
              : "rgba(219,234,254,0.7)",
            border: `1px solid ${
              t.urgent ? "rgba(251,191,36,0.5)" : "rgba(96,165,250,0.4)"
            }`,
            borderRadius: 99,
            padding: "4px 10px",
            flexShrink: 0,
          }}
        >
          {t.label}
        </span>
      </div>
      <p
        style={{
          fontSize: 13,
          color: "#475569",
          lineHeight: 1.55,
          marginBottom: 16,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
        }}
      >
        {interview.description}
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 14,
          borderTop: "1px solid rgba(226,232,240,0.6)",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11.5,
            color: "#64748b",
            fontWeight: 500,
          }}
        >
          <CalendarIcon />
          {formatDate(interview.start_time)}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAttempt();
          }}
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
            border: "none",
            borderRadius: 99,
            padding: "6px 14px",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 5,
            boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
          }}
        >
          Attempt →
        </button>
      </div>
    </div>
  );
};

const AppliedCard: React.FC<{
  interview: AppliedInterview;
  selected: boolean;
  onSelect: () => void;
  onAttempt: () => void;
}> = ({ interview, selected, onSelect, onAttempt }) => (
  <div
    onClick={onSelect}
    style={{
      textAlign: "left",
      background: "rgba(255,255,255,0.78)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: selected
        ? "1.5px solid rgba(59,130,246,0.7)"
        : "1px solid rgba(255,255,255,0.95)",
      borderRadius: 22,
      padding: 22,
      cursor: "pointer",
      transition: "all 0.2s",
      boxShadow: selected
        ? "0 18px 40px -10px rgba(59,130,246,0.25)"
        : "0 8px 22px rgba(15,23,42,0.05)",
      transform: selected ? "translateY(-2px)" : "translateY(0)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
        gap: 12,
        marginBottom: 12,
      }}
    >
      <div style={{ flex: 1 }}>
        <h3
          style={{
            fontSize: 15.5,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.3px",
            marginBottom: 4,
            lineHeight: 1.3,
          }}
        >
          {interview.position}
        </h3>
        <div style={{ fontSize: 12, color: "#64748b", fontWeight: 500 }}>
          {interview.experience} experience
        </div>
      </div>
      <StatusBadge status={interview.status} />
    </div>
    <p
      style={{
        fontSize: 13,
        color: "#475569",
        lineHeight: 1.55,
        marginBottom: 16,
        display: "-webkit-box",
        WebkitLineClamp: 2,
        WebkitBoxOrient: "vertical",
        overflow: "hidden",
      }}
    >
      {interview.description}
    </p>
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 14,
        borderTop: "1px solid rgba(226,232,240,0.6)",
        gap: 10,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          fontSize: 11.5,
          color: "#64748b",
          fontWeight: 500,
        }}
      >
        <ClockIcon /> Deadline: {formatDate(interview.submission_deadline)}
      </div>
      {interview.status === "approved" && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onAttempt();
          }}
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#fff",
            background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
            border: "none",
            borderRadius: 99,
            padding: "6px 14px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(59,130,246,0.35)",
          }}
        >
          Attempt →
        </button>
      )}
    </div>
  </div>
);

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const s = STATUS_STYLES[status] ?? {
    bg: "rgba(241,245,249,0.7)",
    border: "rgba(203,213,225,0.6)",
    color: "#475569",
    dot: "#94a3b8",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 11,
        fontWeight: 700,
        color: s.color,
        background: s.bg,
        border: `1px solid ${s.border}`,
        borderRadius: 99,
        padding: "4px 10px",
        textTransform: "capitalize",
        flexShrink: 0,
      }}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: "50%",
          background: s.dot,
          boxShadow: `0 0 6px ${s.dot}`,
        }}
      />
      {status}
    </span>
  );
};

// ── Sub-components ────────────────────────────────────────────────────────────

const MetricCard: React.FC<{
  label: string;
  value: number | string;
  accent: string;
  icon: React.ReactNode;
}> = ({ label, value, accent, icon }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.78)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.95)",
      borderRadius: 22,
      padding: "20px 22px",
      boxShadow: "0 8px 22px rgba(15,23,42,0.05)",
      display: "flex",
      alignItems: "center",
      gap: 14,
    }}
  >
    <div
      style={{
        width: 42,
        height: 42,
        borderRadius: 12,
        background: `${accent}22`,
        color: accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div>
      <div
        style={{
          fontSize: 24,
          fontWeight: 800,
          color: "#0f172a",
          letterSpacing: "-0.6px",
          lineHeight: 1,
        }}
      >
        {value}
      </div>
      <div
        style={{
          fontSize: 11.5,
          color: "#64748b",
          fontWeight: 600,
          marginTop: 4,
        }}
      >
        {label}
      </div>
    </div>
  </div>
);

const DetailRow: React.FC<{
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}> = ({ icon, label, value }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "10px 0",
      borderBottom: "1px solid rgba(226,232,240,0.5)",
    }}
  >
    <div
      style={{
        width: 28,
        height: 28,
        borderRadius: 8,
        background: "rgba(219,234,254,0.6)",
        color: "#2563eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {icon}
    </div>
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontSize: 10.5,
          color: "#94a3b8",
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: "0.04em",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: 13,
          color: "#0f172a",
          fontWeight: 600,
          marginTop: 2,
        }}
      >
        {value}
      </div>
    </div>
  </div>
);

const SearchBar: React.FC<{
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}> = ({ value, onChange, placeholder }) => (
  <div
    style={{
      flex: 1,
      maxWidth: 420,
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "9px 16px",
      background: "rgba(255,255,255,0.8)",
      border: "1px solid rgba(203,213,225,0.7)",
      borderRadius: 99,
      boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
    }}
  >
    <SearchIcon />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        flex: 1,
        background: "transparent",
        border: "none",
        outline: "none",
        fontSize: 13.5,
        color: "#0f172a",
        fontFamily: "inherit",
      }}
    />
    {value && (
      <button
        onClick={() => onChange("")}
        style={{
          background: "transparent",
          border: "none",
          color: "#94a3b8",
          cursor: "pointer",
          padding: 0,
          display: "flex",
        }}
        aria-label="Clear search"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path
            d="M3 3l8 8M11 3l-8 8"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
        </svg>
      </button>
    )}
  </div>
);

const Pill: React.FC<{ text: string; light?: boolean }> = ({ text, light }) => (
  <div
    style={{
      display: "inline-flex",
      alignItems: "center",
      gap: 7,
      background: light ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.72)",
      backdropFilter: "blur(10px)",
      border: `1px solid ${light ? "rgba(255,255,255,0.35)" : "rgba(147,197,253,0.55)"}`,
      borderRadius: 99,
      padding: "5px 12px",
      boxShadow: light ? "none" : "0 2px 10px rgba(59,130,246,0.08)",
    }}
  >
    <svg
      width="11"
      height="11"
      viewBox="0 0 12 12"
      fill={light ? "#fff" : "#3b82f6"}
    >
      <path d="M6 0l1.3 3.7 3.7.3-2.7 2.6.8 3.6L6 8.3l-3.1 1.9.8-3.6L1 4.1l3.7-.4z" />
    </svg>
    <span
      style={{
        fontSize: 11,
        fontWeight: 700,
        color: light ? "#fff" : "#1d4ed8",
        letterSpacing: "0.04em",
        textTransform: "uppercase",
      }}
    >
      {text}
    </span>
  </div>
);

const EmptyState: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
}> = ({ icon, title, description }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "60px 20px",
      textAlign: "center",
      gap: 12,
      background: "rgba(255,255,255,0.6)",
      backdropFilter: "blur(14px)",
      WebkitBackdropFilter: "blur(14px)",
      border: "1px dashed rgba(147,197,253,0.6)",
      borderRadius: 22,
    }}
  >
    <div
      style={{
        width: 56,
        height: 56,
        borderRadius: 18,
        background: "linear-gradient(145deg,#dbeafe,#bfdbfe)",
        color: "#1d4ed8",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {icon}
    </div>
    <h3
      style={{
        fontSize: 16,
        fontWeight: 800,
        color: "#0f172a",
        letterSpacing: "-0.3px",
      }}
    >
      {title}
    </h3>
    <p style={{ fontSize: 13, color: "#64748b", maxWidth: 340 }}>
      {description}
    </p>
  </div>
);

const SkeletonCard = () => (
  <div
    style={{
      background: "rgba(255,255,255,0.6)",
      border: "1px solid rgba(255,255,255,0.95)",
      borderRadius: 22,
      padding: 22,
      animation: "skeleton-pulse 1.5s ease-in-out infinite",
    }}
  >
    <style>{`
      @keyframes skeleton-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.55; }
      }
    `}</style>
    <div
      style={{
        height: 14,
        background: "rgba(226,232,240,0.7)",
        borderRadius: 6,
        width: "70%",
        marginBottom: 10,
      }}
    />
    <div
      style={{
        height: 10,
        background: "rgba(226,232,240,0.7)",
        borderRadius: 6,
        width: "45%",
        marginBottom: 18,
      }}
    />
    <div
      style={{
        height: 10,
        background: "rgba(226,232,240,0.6)",
        borderRadius: 6,
        width: "100%",
        marginBottom: 6,
      }}
    />
    <div
      style={{
        height: 10,
        background: "rgba(226,232,240,0.6)",
        borderRadius: 6,
        width: "82%",
      }}
    />
  </div>
);

const ErrorAlert: React.FC<{ message: string }> = ({ message }) => (
  <div
    role="alert"
    style={{
      display: "flex",
      alignItems: "flex-start",
      gap: 10,
      padding: "12px 16px",
      borderRadius: 14,
      background: "rgba(254,226,226,0.7)",
      border: "1px solid rgba(248,113,113,0.5)",
      color: "#b91c1c",
      fontSize: 13,
      fontWeight: 500,
    }}
  >
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.4" />
      <path
        d="M8 5v3.5M8 11h.01"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
    <span>{message}</span>
  </div>
);

const BgBlobs = () => (
  <>
    <div
      style={{
        position: "absolute",
        top: 0,
        right: 0,
        width: 800,
        height: 800,
        background: "rgba(219,234,254,0.5)",
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
        left: "-20%",
        width: 600,
        height: 600,
        background: "rgba(207,232,251,0.5)",
        borderRadius: "50%",
        filter: "blur(100px)",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  </>
);

// ── Icons ─────────────────────────────────────────────────────────────────────

const SearchIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <circle cx="6.5" cy="6.5" r="4.5" stroke="#94a3b8" strokeWidth="1.5" />
    <path
      d="M10.5 10.5L14 14"
      stroke="#94a3b8"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <rect
      x="1"
      y="2"
      width="10"
      height="9"
      rx="1.5"
      stroke="currentColor"
      strokeWidth="1.2"
    />
    <path
      d="M1 5h10M4 1v2M8 1v2"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const ClockIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
    <circle cx="6" cy="6" r="5" stroke="currentColor" strokeWidth="1.2" />
    <path
      d="M6 3v3l2 1"
      stroke="currentColor"
      strokeWidth="1.2"
      strokeLinecap="round"
    />
  </svg>
);

const BellIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path
      d="M3 6a5 5 0 0110 0v4l1.5 2H1.5L3 10V6zM6 14a2 2 0 004 0"
      stroke="#475569"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const InfoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
    <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 8.5v5M10 6.5h.01"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

const BriefcaseIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="2"
      y="7"
      width="20"
      height="14"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M8 7V5a3 3 0 016 0v2M2 13h20"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const ClipboardIcon: React.FC<{ size?: number }> = ({ size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect
      x="4"
      y="4"
      width="16"
      height="18"
      rx="2.5"
      stroke="currentColor"
      strokeWidth="1.7"
    />
    <path
      d="M9 4a3 3 0 016 0M8 11h8M8 15h5"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

const TrendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
    <path
      d="M3 17l6-6 4 4 8-8M14 7h7v7"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const ArrowIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M2 7h10M8 3l4 4-4 4"
      stroke="white"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DashboardPage;
