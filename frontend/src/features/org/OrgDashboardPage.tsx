import React, { useState, useEffect, useCallback } from "react";
import {
  getOrgInterviews,
  getLeaderboard,
  LeaderboardServiceError,
  type OrgInterview,
  type LeaderboardResponse,
  type LeaderboardEntry,
} from "../../services/leaderboard.service";

// ── Props ─────────────────────────────────────────────────────────────────────

export interface OrgDashboardPageProps {
  token: string;
  orgName?: string;
  onLogout: () => void;
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function isLive(interview: OrgInterview) {
  const now = Date.now();
  return (
    new Date(interview.start_time).getTime() <= now &&
    now <= new Date(interview.end_time).getTime()
  );
}

function isUpcoming(interview: OrgInterview) {
  return new Date(interview.start_time).getTime() > Date.now();
}

function getScoreColor(score: number) {
  if (score >= 80) return "#10b981";
  if (score >= 60) return "#f59e0b";
  if (score >= 40) return "#f97316";
  return "#ef4444";
}

function getScoreBg(score: number) {
  if (score >= 80) return "rgba(209,250,229,0.8)";
  if (score >= 60) return "rgba(254,243,199,0.8)";
  if (score >= 40) return "rgba(255,237,213,0.8)";
  return "rgba(254,226,226,0.8)";
}

function getRankMedal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
}

// ── Main Page ─────────────────────────────────────────────────────────────────

const OrgDashboardPage: React.FC<OrgDashboardPageProps> = ({
  token,
  orgName,
  onLogout,
}) => {
  const [interviews, setInterviews] = useState<OrgInterview[]>([]);
  const [isLoadingInterviews, setIsLoadingInterviews] = useState(true);
  const [interviewsError, setInterviewsError] = useState<string | null>(null);

  const [selectedInterview, setSelectedInterview] =
    useState<OrgInterview | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardResponse | null>(
    null,
  );
  const [isLoadingLeaderboard, setIsLoadingLeaderboard] = useState(false);
  const [leaderboardError, setLeaderboardError] = useState<string | null>(null);

  // Fetch org's interview list
  const fetchInterviews = useCallback(async () => {
    setIsLoadingInterviews(true);
    setInterviewsError(null);
    try {
      const data = await getOrgInterviews(token);
      setInterviews(data);
    } catch (err) {
      setInterviewsError(
        err instanceof LeaderboardServiceError
          ? err.message
          : "Failed to load interviews.",
      );
    } finally {
      setIsLoadingInterviews(false);
    }
  }, [token]);

  useEffect(() => {
    fetchInterviews();
  }, [fetchInterviews]);

  // Fetch leaderboard for selected interview
  const openLeaderboard = async (interview: OrgInterview) => {
    setSelectedInterview(interview);
    setLeaderboard(null);
    setLeaderboardError(null);
    setIsLoadingLeaderboard(true);
    try {
      const data = await getLeaderboard(interview.id, token);
      setLeaderboard(data);
    } catch (err) {
      setLeaderboardError(
        err instanceof LeaderboardServiceError
          ? err.message
          : "Failed to load leaderboard.",
      );
    } finally {
      setIsLoadingLeaderboard(false);
    }
  };

  const closeLeaderboard = () => {
    setSelectedInterview(null);
    setLeaderboard(null);
    setLeaderboardError(null);
  };

  const displayName = orgName ?? "Organisation";
  const initials = displayName.slice(0, 2).toUpperCase();

  const liveCount = interviews.filter(isLive).length;
  const upcomingCount = interviews.filter(isUpcoming).length;
  const closedCount = interviews.filter(
    (i) => !isLive(i) && !isUpcoming(i),
  ).length;

  return (
    <div
      id="org-dashboard-page"
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

      {/* ── Sticky Top Nav ── */}
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
          {/* Logo */}
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

          {/* Nav links */}
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <NavPill label="Interviews" active />
            <NavPill label="Analytics" />
            <NavPill label="Settings" />
          </div>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
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
                  background: "linear-gradient(145deg,#7c3aed,#4338ca)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 4px 10px rgba(124,58,237,0.35)",
                }}
              >
                {initials}
              </div>
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                {displayName}
              </span>
            </div>
            <button
              id="org-dashboard-logout"
              onClick={onLogout}
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

      {/* ── Main ── */}
      <main
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1300,
          margin: "0 auto",
          padding: "32px 52px 60px",
        }}
      >
        {/* Hero stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
            gap: 16,
            marginBottom: 32,
          }}
        >
          {/* Welcome card */}
          <div
            style={{
              background:
                "linear-gradient(135deg, rgba(124,58,237,0.92), rgba(79,70,229,0.92))",
              borderRadius: 22,
              padding: "22px 24px",
              color: "#fff",
              boxShadow: "0 18px 40px -10px rgba(79,70,229,0.45)",
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
                background: "rgba(255,255,255,0.1)",
              }}
            />
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: "rgba(255,255,255,0.18)",
                borderRadius: 99,
                padding: "4px 12px",
                fontSize: 11.5,
                fontWeight: 700,
                marginBottom: 12,
                letterSpacing: "0.04em",
              }}
            >
              ✦ Org Dashboard
            </div>
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                letterSpacing: "-0.5px",
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
              {liveCount} interview{liveCount !== 1 ? "s" : ""} live right now
            </div>
          </div>

          <MetricCard
            label="Live"
            value={liveCount}
            accent="#10b981"
            icon={<LiveIcon />}
          />
          <MetricCard
            label="Upcoming"
            value={upcomingCount}
            accent="#f59e0b"
            icon={<CalendarIcon />}
          />
          <MetricCard
            label="Closed"
            value={closedCount}
            accent="#8b5cf6"
            icon={<ArchiveIcon />}
          />
        </div>

        {/* Section header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 16,
          }}
        >
          <div>
            <h2
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: "#0f172a",
                letterSpacing: "-0.4px",
                marginBottom: 2,
              }}
            >
              Interviews
            </h2>
            <p style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
              Click on an interview to view the candidate leaderboard
            </p>
          </div>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: "rgba(255,255,255,0.7)",
              border: "1px solid rgba(255,255,255,0.95)",
              borderRadius: 99,
              padding: "7px 16px",
              fontSize: 13,
              fontWeight: 600,
              color: "#64748b",
              boxShadow: "0 2px 8px rgba(15,23,42,0.04)",
            }}
          >
            <TrophyIcon />
            Leaderboard ready
          </div>
        </div>

        {/* Interview cards */}
        {isLoadingInterviews && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))",
              gap: 16,
            }}
          >
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        )}

        {!isLoadingInterviews && interviewsError && (
          <ErrorAlert message={interviewsError} onRetry={fetchInterviews} />
        )}

        {!isLoadingInterviews && !interviewsError && interviews.length === 0 && (
          <EmptyState />
        )}

        {!isLoadingInterviews && !interviewsError && interviews.length > 0 && (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(340px,1fr))",
              gap: 16,
            }}
          >
            {interviews.map((iv) => (
              <InterviewCard
                key={iv.id}
                interview={iv}
                active={selectedInterview?.id === iv.id}
                onClick={() => openLeaderboard(iv)}
              />
            ))}
          </div>
        )}
      </main>

      {/* ── Leaderboard Modal ── */}
      {selectedInterview && (
        <LeaderboardModal
          interview={selectedInterview}
          leaderboard={leaderboard}
          isLoading={isLoadingLeaderboard}
          error={leaderboardError}
          onClose={closeLeaderboard}
          onRetry={() => openLeaderboard(selectedInterview)}
        />
      )}
    </div>
  );
};

// ── Interview Card ─────────────────────────────────────────────────────────────

const InterviewCard: React.FC<{
  interview: OrgInterview;
  active: boolean;
  onClick: () => void;
}> = ({ interview, active, onClick }) => {
  const live = isLive(interview);
  const upcoming = isUpcoming(interview);
  const label = live ? "Live" : upcoming ? "Upcoming" : "Closed";
  const labelColor = live ? "#10b981" : upcoming ? "#f59e0b" : "#8b5cf6";
  const labelBg = live
    ? "rgba(209,250,229,0.8)"
    : upcoming
      ? "rgba(254,243,199,0.8)"
      : "rgba(237,233,254,0.8)";

  return (
    <div
      id={`interview-card-${interview.id}`}
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: active
          ? "1.5px solid rgba(124,58,237,0.6)"
          : "1px solid rgba(255,255,255,0.95)",
        borderRadius: 22,
        padding: 22,
        cursor: "pointer",
        transition: "all 0.22s",
        boxShadow: active
          ? "0 18px 40px -10px rgba(124,58,237,0.22)"
          : "0 8px 22px rgba(15,23,42,0.05)",
        transform: active ? "translateY(-2px)" : "translateY(0)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
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
              marginBottom: 3,
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
            color: labelColor,
            background: labelBg,
            border: `1px solid ${labelColor}44`,
            borderRadius: 99,
            padding: "3px 10px",
            flexShrink: 0,
          }}
        >
          {label}
        </span>
      </div>

      <p
        style={{
          fontSize: 12.5,
          color: "#475569",
          lineHeight: 1.55,
          marginBottom: 14,
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
          gap: 10,
          flexWrap: "wrap",
          borderTop: "1px solid rgba(226,232,240,0.6)",
          paddingTop: 12,
        }}
      >
        <DateChip label="Deadline" date={interview.submission_deadline} />
        <DateChip label="Starts" date={interview.start_time} />
      </div>

      <button
        style={{
          marginTop: 14,
          width: "100%",
          background: active
            ? "linear-gradient(135deg,#7c3aed,#4f46e5)"
            : "rgba(124,58,237,0.08)",
          color: active ? "#fff" : "#7c3aed",
          border: "none",
          borderRadius: 99,
          padding: "10px 18px",
          fontSize: 12.5,
          fontWeight: 700,
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 7,
          transition: "all 0.2s",
          boxShadow: active ? "0 6px 16px rgba(124,58,237,0.3)" : "none",
        }}
      >
        <TrophyIcon size={14} />
        View Leaderboard
      </button>
    </div>
  );
};

// ── Leaderboard Modal ──────────────────────────────────────────────────────────

const LeaderboardModal: React.FC<{
  interview: OrgInterview;
  leaderboard: LeaderboardResponse | null;
  isLoading: boolean;
  error: string | null;
  onClose: () => void;
  onRetry: () => void;
}> = ({ interview, leaderboard, isLoading, error, onClose, onRetry }) => {
  return (
    <>
      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(15,23,42,0.35)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          zIndex: 100,
          animation: "fadeIn 0.2s ease",
        }}
      />

      {/* Panel */}
      <div
        id="leaderboard-modal"
        style={{
          position: "fixed",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 101,
          width: "min(760px, 95vw)",
          maxHeight: "85vh",
          background: "rgba(255,255,255,0.96)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          border: "1px solid rgba(255,255,255,0.95)",
          borderRadius: 28,
          boxShadow:
            "0 35px 80px -15px rgba(15,23,42,0.22), inset 0 1px 2px rgba(255,255,255,0.7)",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          animation: "slideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 28px 20px",
            background:
              "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(79,70,229,0.04))",
            borderBottom: "1px solid rgba(226,232,240,0.6)",
            flexShrink: 0,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              gap: 12,
            }}
          >
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  background: "rgba(124,58,237,0.1)",
                  border: "1px solid rgba(124,58,237,0.2)",
                  borderRadius: 99,
                  padding: "4px 12px",
                  fontSize: 11.5,
                  fontWeight: 700,
                  color: "#7c3aed",
                  marginBottom: 8,
                }}
              >
                <TrophyIcon size={11} color="#7c3aed" />
                Candidate Leaderboard
              </div>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 800,
                  color: "#0f172a",
                  letterSpacing: "-0.5px",
                  marginBottom: 3,
                }}
              >
                {interview.position}
              </h2>
              <p style={{ fontSize: 13, color: "#64748b", fontWeight: 500 }}>
                {interview.experience} · Closed{" "}
                {formatDate(interview.end_time)}
                {leaderboard && (
                  <> · {leaderboard.total_candidates} candidates</>
                )}
              </p>
            </div>
            <button
              id="leaderboard-close"
              onClick={onClose}
              aria-label="Close leaderboard"
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(241,245,249,0.8)",
                border: "1px solid rgba(226,232,240,0.7)",
                color: "#64748b",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
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
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflowY: "auto", padding: "20px 28px 28px" }}>
          {isLoading && <LeaderboardSkeleton />}
          {!isLoading && error && (
            <div
              style={{
                textAlign: "center",
                padding: "48px 0",
                color: "#64748b",
              }}
            >
              <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
              <div
                style={{ fontWeight: 700, color: "#0f172a", marginBottom: 6 }}
              >
                Failed to load leaderboard
              </div>
              <div style={{ fontSize: 13, marginBottom: 18 }}>{error}</div>
              <button
                onClick={onRetry}
                style={{
                  background: "linear-gradient(135deg,#7c3aed,#4f46e5)",
                  color: "#fff",
                  border: "none",
                  borderRadius: 99,
                  padding: "9px 20px",
                  fontSize: 13,
                  fontWeight: 700,
                  cursor: "pointer",
                }}
              >
                Try again
              </button>
            </div>
          )}
          {!isLoading && !error && leaderboard?.entries.length === 0 && (
            <div
              style={{
                textAlign: "center",
                padding: "56px 0",
                color: "#64748b",
              }}
            >
              <div style={{ fontSize: 48, marginBottom: 12 }}>🎯</div>
              <div
                style={{
                  fontSize: 17,
                  fontWeight: 800,
                  color: "#0f172a",
                  marginBottom: 6,
                }}
              >
                No candidates yet
              </div>
              <div style={{ fontSize: 13 }}>
                Candidates who complete the interview will appear here, ranked
                by score.
              </div>
            </div>
          )}
          {!isLoading && !error && leaderboard && leaderboard.entries.length > 0 && (
            <>
              {/* Top 3 podium */}
              {leaderboard.entries.length >= 3 && (
                <Podium entries={leaderboard.entries.slice(0, 3)} />
              )}

              {/* Full ranking table */}
              <div
                style={{
                  marginTop: leaderboard.entries.length >= 3 ? 24 : 0,
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "48px 1fr 80px 80px 120px",
                    gap: 10,
                    padding: "8px 14px",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    letterSpacing: "0.06em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid rgba(226,232,240,0.7)",
                    marginBottom: 4,
                  }}
                >
                  <div>#</div>
                  <div>Candidate</div>
                  <div style={{ textAlign: "center" }}>Score</div>
                  <div style={{ textAlign: "center" }}>Status</div>
                  <div style={{ textAlign: "right" }}>Recommendation</div>
                </div>

                {leaderboard.entries.map((entry) => (
                  <LeaderboardRow key={entry.application_id} entry={entry} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
        @keyframes slideUp {
          from { opacity:0; transform:translate(-50%,-48%) scale(0.96) }
          to   { opacity:1; transform:translate(-50%,-50%) scale(1) }
        }
      `}</style>
    </>
  );
};

// ── Podium ─────────────────────────────────────────────────────────────────────

const Podium: React.FC<{ entries: LeaderboardEntry[] }> = ({ entries }) => {
  const order = [entries[1], entries[0], entries[2]]; // silver, gold, bronze
  const heights = [80, 108, 64];
  const bgColors = [
    "linear-gradient(145deg,#94a3b8,#64748b)",
    "linear-gradient(145deg,#fbbf24,#d97706)",
    "linear-gradient(145deg,#f97316,#ea580c)",
  ];

  return (
    <div
      id="leaderboard-podium"
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 12,
        padding: "24px 0 0",
      }}
    >
      {order.map((entry, idx) => (
        <div
          key={entry.application_id}
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
          }}
        >
          {/* Avatar */}
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: "50%",
                background: bgColors[idx],
                color: "#fff",
                fontSize: 18,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 20px ${idx === 1 ? "rgba(251,191,36,0.45)" : "rgba(15,23,42,0.15)"}`,
                border: "2.5px solid rgba(255,255,255,0.8)",
              }}
            >
              {entry.username.slice(0, 2).toUpperCase()}
            </div>
            <div
              style={{
                position: "absolute",
                bottom: -4,
                right: -4,
                fontSize: 16,
                lineHeight: 1,
              }}
            >
              {getRankMedal(entry.rank)}
            </div>
          </div>

          {/* Name + score */}
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#0f172a",
                maxWidth: 90,
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {entry.username}
            </div>
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: getScoreColor(entry.score),
              }}
            >
              {entry.score.toFixed(1)}
            </div>
          </div>

          {/* Podium block */}
          <div
            style={{
              width: 100,
              height: heights[idx],
              background: bgColors[idx],
              borderRadius: "10px 10px 0 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 22,
              fontWeight: 900,
              boxShadow: `0 -4px 20px ${idx === 1 ? "rgba(251,191,36,0.3)" : "rgba(15,23,42,0.1)"}`,
            }}
          >
            {entry.rank}
          </div>
        </div>
      ))}
    </div>
  );
};

// ── Leaderboard Row ────────────────────────────────────────────────────────────

const LeaderboardRow: React.FC<{ entry: LeaderboardEntry }> = ({ entry }) => {
  const medal = getRankMedal(entry.rank);
  const isShortlisted = entry.shortlisting_decision;

  return (
    <div
      id={`leaderboard-row-${entry.rank}`}
      style={{
        display: "grid",
        gridTemplateColumns: "48px 1fr 80px 80px 120px",
        gap: 10,
        alignItems: "center",
        padding: "12px 14px",
        borderRadius: 14,
        margin: "4px 0",
        background:
          entry.rank <= 3
            ? `linear-gradient(135deg, ${getScoreBg(entry.score)}, rgba(255,255,255,0.6))`
            : "rgba(248,250,252,0.6)",
        border:
          entry.rank === 1
            ? "1px solid rgba(251,191,36,0.35)"
            : "1px solid transparent",
        transition: "background 0.2s",
      }}
    >
      {/* Rank */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: 32,
          height: 32,
          borderRadius: "50%",
          background:
            entry.rank <= 3
              ? entry.rank === 1
                ? "linear-gradient(145deg,#fbbf24,#d97706)"
                : entry.rank === 2
                  ? "linear-gradient(145deg,#94a3b8,#64748b)"
                  : "linear-gradient(145deg,#f97316,#ea580c)"
              : "rgba(226,232,240,0.7)",
          color: entry.rank <= 3 ? "#fff" : "#64748b",
          fontSize: medal ? 18 : 12,
          fontWeight: 800,
          boxShadow:
            entry.rank <= 3
              ? "0 3px 10px rgba(15,23,42,0.15)"
              : "none",
        }}
      >
        {medal ?? entry.rank}
      </div>

      {/* User */}
      <div>
        <div
          style={{
            fontSize: 13.5,
            fontWeight: 700,
            color: "#0f172a",
            marginBottom: 1,
          }}
        >
          {entry.username}
        </div>
        <div style={{ fontSize: 11.5, color: "#94a3b8" }}>{entry.email}</div>
      </div>

      {/* Score */}
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "inline-block",
            background: getScoreBg(entry.score),
            border: `1px solid ${getScoreColor(entry.score)}33`,
            borderRadius: 99,
            padding: "3px 10px",
            fontSize: 12.5,
            fontWeight: 800,
            color: getScoreColor(entry.score),
          }}
        >
          {entry.score.toFixed(1)}
        </div>
      </div>

      {/* Shortlisted */}
      <div style={{ textAlign: "center" }}>
        {isShortlisted ? (
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#059669",
              background: "rgba(209,250,229,0.8)",
              border: "1px solid rgba(52,211,153,0.4)",
              borderRadius: 99,
              padding: "3px 9px",
            }}
          >
            ✓ Listed
          </span>
        ) : (
          <span
            style={{
              fontSize: 11,
              fontWeight: 600,
              color: "#94a3b8",
              background: "rgba(241,245,249,0.8)",
              border: "1px solid rgba(226,232,240,0.8)",
              borderRadius: 99,
              padding: "3px 9px",
            }}
          >
            Pending
          </span>
        )}
      </div>

      {/* Recommendation */}
      <div
        style={{
          textAlign: "right",
          fontSize: 12,
          fontWeight: 600,
          color: "#64748b",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
      >
        {entry.recommendation ?? "—"}
      </div>
    </div>
  );
};

// ── Sub-components ─────────────────────────────────────────────────────────────

const NavPill: React.FC<{ label: string; active?: boolean }> = ({
  label,
  active,
}) => (
  <button
    style={{
      padding: "7px 16px",
      borderRadius: 99,
      fontSize: 13,
      fontWeight: 600,
      border: "none",
      cursor: "pointer",
      background: active
        ? "linear-gradient(135deg,#7c3aed,#4f46e5)"
        : "transparent",
      color: active ? "#fff" : "#64748b",
      boxShadow: active ? "0 4px 12px rgba(124,58,237,0.3)" : "none",
      transition: "all 0.2s",
    }}
  >
    {label}
  </button>
);

const MetricCard: React.FC<{
  label: string;
  value: number;
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
    }}
  >
    <div
      style={{
        width: 36,
        height: 36,
        borderRadius: 11,
        background: `${accent}18`,
        color: accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        border: `1px solid ${accent}28`,
      }}
    >
      {icon}
    </div>
    <div
      style={{
        fontSize: 28,
        fontWeight: 900,
        color: "#0f172a",
        letterSpacing: "-0.8px",
        lineHeight: 1,
        marginBottom: 4,
      }}
    >
      {value}
    </div>
    <div style={{ fontSize: 12.5, color: "#64748b", fontWeight: 600 }}>
      {label}
    </div>
  </div>
);

const DateChip: React.FC<{ label: string; date: string }> = ({
  label,
  date,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 5,
      fontSize: 11.5,
      color: "#64748b",
      background: "rgba(241,245,249,0.8)",
      border: "1px solid rgba(226,232,240,0.7)",
      borderRadius: 99,
      padding: "3px 9px",
      fontWeight: 600,
    }}
  >
    <span style={{ color: "#94a3b8", fontSize: 10 }}>{label}</span>
    {formatDate(date)}
  </div>
);

const SkeletonCard: React.FC = () => (
  <div
    style={{
      background: "rgba(255,255,255,0.6)",
      border: "1px solid rgba(226,232,240,0.5)",
      borderRadius: 22,
      padding: 22,
      animation: "pulse 1.4s ease-in-out infinite",
    }}
  >
    <div
      style={{
        height: 18,
        background: "rgba(226,232,240,0.7)",
        borderRadius: 8,
        marginBottom: 10,
        width: "70%",
      }}
    />
    <div
      style={{
        height: 12,
        background: "rgba(226,232,240,0.5)",
        borderRadius: 6,
        marginBottom: 8,
        width: "45%",
      }}
    />
    <div
      style={{
        height: 36,
        background: "rgba(226,232,240,0.4)",
        borderRadius: 8,
        marginBottom: 14,
      }}
    />
    <div
      style={{
        height: 38,
        background: "rgba(226,232,240,0.4)",
        borderRadius: 99,
      }}
    />
    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.55} }`}</style>
  </div>
);

const LeaderboardSkeleton: React.FC = () => (
  <div style={{ padding: "8px 0" }}>
    {[1, 2, 3, 4, 5].map((i) => (
      <div
        key={i}
        style={{
          height: 56,
          background: "rgba(241,245,249,0.8)",
          borderRadius: 14,
          margin: "6px 0",
          animation: "pulse 1.4s ease-in-out infinite",
          animationDelay: `${i * 0.1}s`,
        }}
      />
    ))}
    <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.55} }`}</style>
  </div>
);

const EmptyState: React.FC = () => (
  <div
    style={{
      textAlign: "center",
      padding: "72px 0",
      color: "#64748b",
    }}
  >
    <div
      style={{
        fontSize: 56,
        marginBottom: 14,
        filter: "grayscale(0.2)",
      }}
    >
      📋
    </div>
    <div
      style={{
        fontSize: 18,
        fontWeight: 800,
        color: "#0f172a",
        marginBottom: 6,
        letterSpacing: "-0.3px",
      }}
    >
      No interviews yet
    </div>
    <div style={{ fontSize: 13.5, maxWidth: 360, margin: "0 auto" }}>
      Create your first interview to start evaluating candidates with AI.
    </div>
  </div>
);

const ErrorAlert: React.FC<{ message: string; onRetry: () => void }> = ({
  message,
  onRetry,
}) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 14,
      padding: "16px 20px",
      background: "rgba(254,226,226,0.7)",
      border: "1px solid rgba(248,113,113,0.4)",
      borderRadius: 16,
      marginBottom: 20,
    }}
  >
    <div style={{ fontSize: 24 }}>⚠️</div>
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontSize: 13.5,
          fontWeight: 700,
          color: "#b91c1c",
          marginBottom: 2,
        }}
      >
        {message}
      </div>
    </div>
    <button
      onClick={onRetry}
      style={{
        background: "#ef4444",
        color: "#fff",
        border: "none",
        borderRadius: 99,
        padding: "7px 16px",
        fontSize: 12,
        fontWeight: 700,
        cursor: "pointer",
      }}
    >
      Retry
    </button>
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
        background: "rgba(237,233,254,0.5)",
        borderRadius: "50%",
        filter: "blur(100px)",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  </>
);

// ── Icons ──────────────────────────────────────────────────────────────────────

const TrophyIcon: React.FC<{ size?: number; color?: string }> = ({
  size = 16,
  color = "currentColor",
}) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <path
      d="M8 21h8M12 17v4M5 3H3v5a9 9 0 007 8.72V17M19 3h2v5a9 9 0 01-7 8.72V17M5 3h14v5a7 7 0 01-14 0V3z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LiveIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle
      cx="12"
      cy="12"
      r="4"
      fill="#10b981"
    />
    <circle cx="12" cy="12" r="9" stroke="#10b981" strokeWidth="2" />
  </svg>
);

const CalendarIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="4"
      width="18"
      height="18"
      rx="3"
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16 2v4M8 2v4M3 10h18"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const ArchiveIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path
      d="M21 8H3M5 8v11a2 2 0 002 2h10a2 2 0 002-2V8M3 5a2 2 0 012-2h14a2 2 0 012 2v3H3V5zM10 13h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default OrgDashboardPage;
