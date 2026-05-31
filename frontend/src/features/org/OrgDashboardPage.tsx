import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  createOrgInterview,
  getInterviewApplications,
  getLeaderboard,
  getOrgInterview,
  getOrgInterviews,
  seedTestInterview,
  toggleShortlist,
  LeaderboardServiceError,
  type ApplicationResponse,
  type CreateInterviewPayload,
  type LeaderboardEntry,
  type LeaderboardResponse,
  type OrgInterview,
  type OrgInterviewDetail,
  type SessionResult,
} from "../../services/leaderboard.service";

export interface OrgDashboardPageProps {
  token: string;
  orgName?: string;
  onLogout: () => void;
}

type View = "list" | "detail" | "create";
type DetailTab = "overview" | "applications" | "leaderboard";

const OrgDashboardPage: React.FC<OrgDashboardPageProps> = ({
  token,
  orgName,
  onLogout,
}) => {
  const [view, setView] = useState<View>("list");
  const [interviews, setInterviews] = useState<OrgInterview[]>([]);
  const [isLoadingList, setIsLoadingList] = useState(true);
  const [listError, setListError] = useState<string | null>(null);
  const [activeInterviewId, setActiveInterviewId] = useState<number | null>(
    null,
  );
  const [isSeedingTest, setIsSeedingTest] = useState(false);
  const [seedError, setSeedError] = useState<string | null>(null);

  const displayName = orgName ?? "Admin";

  // Triggered by the Retry button (event-driven, sync setStates allowed).
  const fetchInterviews = useCallback(async () => {
    setIsLoadingList(true);
    setListError(null);
    try {
      setInterviews(await getOrgInterviews(token));
    } catch (err) {
      setListError(
        err instanceof LeaderboardServiceError
          ? err.message
          : "Failed to load interviews.",
      );
    } finally {
      setIsLoadingList(false);
    }
  }, [token]);

  // Initial load: keep the effect pure (no sync setState). Initial state
  // already has `isLoadingList: true`, so we only flip it via the async tail.
  useEffect(() => {
    let cancelled = false;
    getOrgInterviews(token)
      .then((data) => {
        if (!cancelled) setInterviews(data);
      })
      .catch((err) => {
        if (cancelled) return;
        setListError(
          err instanceof LeaderboardServiceError
            ? err.message
            : "Failed to load interviews.",
        );
      })
      .finally(() => {
        if (!cancelled) setIsLoadingList(false);
      });
    return () => {
      cancelled = true;
    };
  }, [token]);

  const liveCount = interviews.filter(isLive).length;
  const upcomingCount = interviews.filter(isUpcoming).length;
  const closedCount = interviews.filter(
    (i) => !isLive(i) && !isUpcoming(i),
  ).length;

  const openDetail = (id: number) => {
    setActiveInterviewId(id);
    setView("detail");
  };

  const openCreate = () => setView("create");
  const goList = () => {
    setActiveInterviewId(null);
    setView("list");
  };

  const handleCreated = async (created: OrgInterviewDetail) => {
    await fetchInterviews();
    setActiveInterviewId(created.id);
    setView("detail");
  };

  const handleSeedTest = async () => {
    setIsSeedingTest(true);
    setSeedError(null);
    try {
      const created = await seedTestInterview(token);
      await fetchInterviews();
      setActiveInterviewId(created.id);
      setView("detail");
    } catch (err) {
      setSeedError(
        err instanceof LeaderboardServiceError
          ? err.message
          : "Failed to create test interview.",
      );
    } finally {
      setIsSeedingTest(false);
    }
  };

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

      <AdminHeader
        displayName={displayName}
        onHome={goList}
        onLogout={onLogout}
      />

      <main
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: 1300,
          margin: "0 auto",
          padding: "32px 52px 60px",
        }}
      >
        {view === "list" && (
          <ListView
            displayName={displayName}
            interviews={interviews}
            liveCount={liveCount}
            upcomingCount={upcomingCount}
            closedCount={closedCount}
            isLoading={isLoadingList}
            error={listError}
            seedError={seedError}
            isSeedingTest={isSeedingTest}
            onRetry={fetchInterviews}
            onOpen={openDetail}
            onCreate={openCreate}
            onSeedTest={handleSeedTest}
          />
        )}

        {view === "create" && (
          <CreateInterviewView
            token={token}
            onBack={goList}
            onCreated={handleCreated}
          />
        )}

        {view === "detail" && activeInterviewId != null && (
          <InterviewDetailView
            key={activeInterviewId}
            interviewId={activeInterviewId}
            token={token}
            onBack={goList}
          />
        )}
      </main>
    </div>
  );
};

// ── List view ────────────────────────────────────────────────────────────────

const ListView: React.FC<{
  displayName: string;
  interviews: OrgInterview[];
  liveCount: number;
  upcomingCount: number;
  closedCount: number;
  isLoading: boolean;
  error: string | null;
  seedError: string | null;
  isSeedingTest: boolean;
  onRetry: () => void;
  onOpen: (id: number) => void;
  onCreate: () => void;
  onSeedTest: () => void;
}> = ({
  displayName,
  interviews,
  liveCount,
  upcomingCount,
  closedCount,
  isLoading,
  error,
  seedError,
  isSeedingTest,
  onRetry,
  onOpen,
  onCreate,
  onSeedTest,
}) => (
  <>
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1.4fr 1fr 1fr 1fr",
        gap: 16,
        marginBottom: 32,
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
        <Pill text="Admin Console" light />
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
          {liveCount} interview{liveCount !== 1 ? "s" : ""} live right now ·{" "}
          {upcomingCount} upcoming · {closedCount} closed
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
          Open an interview to view candidates and the leaderboard.
        </p>
      </div>
      <div style={{ display: "flex", gap: 10, flexDirection: "column", alignItems: "flex-end" }}>
        <div style={{ display: "flex", gap: 10 }}>
          <button
            id="seed-test-interview-btn"
            onClick={onSeedTest}
            disabled={isSeedingTest}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: isSeedingTest
                ? "rgba(203,213,225,0.8)"
                : "linear-gradient(135deg,#7c3aed,#4f46e5)",
              color: "#fff",
              border: "none",
              borderRadius: 99,
              padding: "10px 20px",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: isSeedingTest ? "not-allowed" : "pointer",
              opacity: isSeedingTest ? 0.7 : 1,
              boxShadow: isSeedingTest ? "none" : "0 8px 22px rgba(124,58,237,0.35)",
              transition: "all 0.2s",
            }}
          >
            {isSeedingTest ? (
              <>
                <span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span>
                Seeding…
              </>
            ) : (
              <>🧪 Seed Test Interview</>
            )}
          </button>
          <button
            id="create-interview-btn"
            onClick={onCreate}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
              color: "#fff",
              border: "none",
              borderRadius: 99,
              padding: "10px 20px",
              fontSize: 13.5,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 22px rgba(59,130,246,0.4)",
            }}
          >
            <PlusIcon /> New Interview
          </button>
        </div>
        {seedError && (
          <div
            role="alert"
            style={{
              fontSize: 12,
              color: "#b91c1c",
              background: "rgba(254,226,226,0.8)",
              border: "1px solid rgba(248,113,113,0.4)",
              borderRadius: 8,
              padding: "6px 12px",
              maxWidth: 320,
              textAlign: "right",
            }}
          >
            {seedError}
          </div>
        )}
      </div>
    </div>

    {isLoading && (
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

    {!isLoading && error && <ErrorAlert message={error} onRetry={onRetry} />}

    {!isLoading && !error && interviews.length === 0 && (
      <EmptyState
        title="No interviews yet"
        body="Create your first interview to start evaluating candidates."
        action={
          <button
            onClick={onCreate}
            style={{
              marginTop: 14,
              background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
              color: "#fff",
              border: "none",
              borderRadius: 99,
              padding: "10px 20px",
              fontSize: 13,
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 22px rgba(59,130,246,0.4)",
            }}
          >
            Create Interview →
          </button>
        }
      />
    )}

    {!isLoading && !error && interviews.length > 0 && (
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
            onClick={() => onOpen(iv.id)}
          />
        ))}
      </div>
    )}
  </>
);

const InterviewCard: React.FC<{
  interview: OrgInterview;
  onClick: () => void;
}> = ({ interview, onClick }) => {
  const live = isLive(interview);
  const upcoming = isUpcoming(interview);
  const label = live ? "Live" : upcoming ? "Upcoming" : "Closed";
  const accent = live ? "#10b981" : upcoming ? "#f59e0b" : "#8b5cf6";
  const bg = live
    ? "rgba(209,250,229,0.8)"
    : upcoming
      ? "rgba(254,243,199,0.8)"
      : "rgba(237,233,254,0.8)";

  return (
    <div
      onClick={onClick}
      style={{
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.95)",
        borderRadius: 22,
        padding: 22,
        cursor: "pointer",
        transition: "all 0.2s",
        boxShadow: "0 8px 22px rgba(15,23,42,0.05)",
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
            {interview.experience} experience · #{interview.id}
          </div>
        </div>
        <span
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: accent,
            background: bg,
            border: `1px solid ${accent}44`,
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
        <DateChip label="Ends" date={interview.end_time} />
      </div>

      <div
        style={{
          marginTop: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontSize: 12,
          color: "#2563eb",
          fontWeight: 700,
        }}
      >
        Open interview
        <ArrowIcon color="#2563eb" />
      </div>
    </div>
  );
};

// ── Detail view ──────────────────────────────────────────────────────────────

const InterviewDetailView: React.FC<{
  interviewId: number;
  token: string;
  onBack: () => void;
}> = ({ interviewId, token, onBack }) => {
  const [tab, setTab] = useState<DetailTab>("overview");
  const [detail, setDetail] = useState<OrgInterviewDetail | null>(null);
  const [detailError, setDetailError] = useState<string | null>(null);

  // Parent re-keys on interviewId so initial state is already fresh.
  useEffect(() => {
    let cancelled = false;
    getOrgInterview(interviewId, token)
      .then((d) => {
        if (!cancelled) setDetail(d);
      })
      .catch((err) => {
        if (cancelled) return;
        setDetailError(
          err instanceof LeaderboardServiceError
            ? err.message
            : "Failed to load interview.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [interviewId, token]);

  return (
    <>
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "transparent",
          border: "none",
          color: "#64748b",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 14,
          padding: 0,
        }}
      >
        ← All interviews
      </button>

      {detailError && (
        <ErrorAlert message={detailError} onRetry={onBack} retryLabel="Back" />
      )}

      {!detail && !detailError && <SkeletonCard tall />}

      {detail && (
        <>
          <div
            style={{
              background: "rgba(255,255,255,0.78)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.95)",
              borderRadius: 22,
              padding: 26,
              marginBottom: 18,
              boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                justifyContent: "space-between",
                gap: 14,
                marginBottom: 10,
              }}
            >
              <div>
                <Pill text={`Interview · #${detail.id}`} />
                <h2
                  style={{
                    fontSize: 26,
                    fontWeight: 800,
                    color: "#0f172a",
                    letterSpacing: "-0.6px",
                    marginTop: 10,
                  }}
                >
                  {detail.position}
                </h2>
                <p
                  style={{
                    fontSize: 13.5,
                    color: "#64748b",
                    fontWeight: 500,
                    marginTop: 2,
                  }}
                >
                  {detail.experience} experience · {detail.duration} min ·{" "}
                  {detail.questions.length} questions ·{" "}
                  {detail.dsa_topics.length} DSA topics
                </p>
              </div>
              <StatusBadge interview={detail} />
            </div>
            <p
              style={{
                fontSize: 14,
                color: "#475569",
                lineHeight: 1.6,
                marginTop: 10,
              }}
            >
              {detail.description}
            </p>
            <div
              style={{
                display: "flex",
                gap: 10,
                flexWrap: "wrap",
                marginTop: 16,
              }}
            >
              <DateChip label="Apply by" date={detail.submission_deadline} />
              <DateChip label="Starts" date={detail.start_time} />
              <DateChip label="Ends" date={detail.end_time} />
            </div>
          </div>

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
            {(["overview", "applications", "leaderboard"] as DetailTab[]).map(
              (t) => (
                <button
                  key={t}
                  role="tab"
                  aria-selected={tab === t}
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
                  {t}
                </button>
              ),
            )}
          </div>

          {tab === "overview" && <OverviewTab detail={detail} />}
          {tab === "applications" && (
            <ApplicationsTab
              key={`apps-${detail.id}`}
              interviewId={detail.id}
              token={token}
            />
          )}
          {tab === "leaderboard" && (
            <LeaderboardTab
              key={`lb-${detail.id}`}
              interviewId={detail.id}
              token={token}
            />
          )}
        </>
      )}
    </>
  );
};

// ── Overview tab ─────────────────────────────────────────────────────────────

const OverviewTab: React.FC<{ detail: OrgInterviewDetail }> = ({ detail }) => (
  <div
    style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      gap: 18,
    }}
  >
    <Card title={`Questions · ${detail.questions.length}`}>
      {detail.questions.length === 0 ? (
        <Muted>No custom questions configured.</Muted>
      ) : (
        detail.questions.map((q, i) => (
          <div
            key={q.id}
            style={{
              marginBottom: 14,
              paddingBottom: 14,
              borderBottom:
                i < detail.questions.length - 1
                  ? "1px solid rgba(226,232,240,0.6)"
                  : "none",
            }}
          >
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#94a3b8",
                textTransform: "uppercase",
                letterSpacing: "0.06em",
                marginBottom: 4,
              }}
            >
              Q{i + 1}
            </div>
            <div style={{ fontSize: 14, color: "#0f172a", fontWeight: 600 }}>
              {q.question}
            </div>
            {q.expected_answer && (
              <div
                style={{
                  fontSize: 12.5,
                  color: "#64748b",
                  marginTop: 4,
                  fontStyle: "italic",
                }}
              >
                Expected: {q.expected_answer}
              </div>
            )}
          </div>
        ))
      )}
    </Card>

    <Card title={`DSA topics · ${detail.dsa_topics.length}`}>
      {detail.dsa_topics.length === 0 ? (
        <Muted>No DSA topics configured.</Muted>
      ) : (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {detail.dsa_topics.map((t) => (
            <div
              key={t.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: "rgba(241,245,249,0.7)",
                border: "1px solid rgba(226,232,240,0.8)",
                borderRadius: 12,
                padding: "8px 14px",
              }}
            >
              <span style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
                {t.topic}
              </span>
              <DifficultyChip difficulty={t.difficulty} />
            </div>
          ))}
        </div>
      )}
    </Card>

    <Card title="Scoring">
      <KeyVal k="DSA weight" v={`${detail.dsa_score}%`} />
      <KeyVal k="Dev (behavioural) weight" v={`${detail.dev_score}%`} />
      <KeyVal
        k="Resume shortlist threshold"
        v={detail.resume_shortlist_score.toFixed(2)}
      />
      <KeyVal
        k="Resume Q&A round"
        v={detail.ask_questions_on_resume ? "Enabled" : "Disabled"}
      />
    </Card>

    <Card title="Schedule">
      <KeyVal k="Apply by" v={formatDateTime(detail.submission_deadline)} />
      <KeyVal k="Window opens" v={formatDateTime(detail.start_time)} />
      <KeyVal k="Window closes" v={formatDateTime(detail.end_time)} />
      <KeyVal k="Duration" v={`${detail.duration} minutes`} />
    </Card>
  </div>
);

// ── Applications tab ────────────────────────────────────────────────────────

const ApplicationsTab: React.FC<{ interviewId: number; token: string }> = ({
  interviewId,
  token,
}) => {
  const [data, setData] = useState<ApplicationResponse[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getInterviewApplications(interviewId, token)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof LeaderboardServiceError
            ? err.message
            : "Failed to load applications.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [interviewId, token]);

  const handleToggle = async (applicationId: number) => {
    try {
      const updated = await toggleShortlist(applicationId, token);
      setData((prev) =>
        prev
          ? prev.map((a) => (a.id === updated.id ? updated : a))
          : prev,
      );
    } catch {
      // silently ignore — the button state reverts automatically
    }
  };

  if (error) return <ErrorAlert message={error} onRetry={() => null} />;
  if (!data) return <SkeletonCard tall />;
  if (data.length === 0) {
    return (
      <EmptyState
        title="No applications yet"
        body="Candidates who apply will appear here with their resume score."
      />
    );
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.78)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.95)",
        borderRadius: 22,
        boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "70px 1fr 110px 130px 110px 160px 130px",
          gap: 10,
          padding: "12px 18px",
          fontSize: 11,
          fontWeight: 700,
          color: "#94a3b8",
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          borderBottom: "1px solid rgba(226,232,240,0.7)",
        }}
      >
        <div>App #</div>
        <div>Candidate</div>
        <div style={{ textAlign: "center" }}>Resume score</div>
        <div style={{ textAlign: "center" }}>Shortlisted</div>
        <div style={{ textAlign: "center" }}>Status</div>
        <div style={{ textAlign: "right" }}>Applied</div>
        <div style={{ textAlign: "center" }}>Action</div>
      </div>
      {data.map((a) => (
        <ApplicationRow key={a.id} application={a} onToggle={handleToggle} />
      ))}
    </div>
  );
};

const ApplicationRow: React.FC<{
  application: ApplicationResponse;
  onToggle: (id: number) => Promise<void>;
}> = ({ application, onToggle }) => {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    await onToggle(application.id);
    setLoading(false);
  };

  const approved = application.shortlisting_decision;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "70px 1fr 110px 130px 110px 160px 130px",
        gap: 10,
        padding: "14px 18px",
        alignItems: "center",
        borderBottom: "1px solid rgba(241,245,249,0.7)",
        fontSize: 13,
      }}
    >
      <div style={{ color: "#64748b", fontWeight: 700 }}>#{application.id}</div>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a" }}>
          User #{application.user_id}
        </div>
        <div
          style={{
            fontSize: 11.5,
            color: "#94a3b8",
            marginTop: 2,
            fontFamily:
              "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
            maxWidth: 320,
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={application.resume ?? ""}
        >
          {application.resume ?? "no resume"}
        </div>
      </div>
      <div style={{ textAlign: "center" }}>
        <ScoreChip value={application.score} />
      </div>
      <div style={{ textAlign: "center" }}>
        {approved ? (
          <BadgePill
            color="#10b981"
            bg="rgba(209,250,229,0.7)"
            label="✓ Listed"
          />
        ) : (
          <BadgePill color="#94a3b8" bg="rgba(241,245,249,0.8)" label="Pending" />
        )}
      </div>
      <div style={{ textAlign: "center" }}>
        <StatusPill status={application.status} />
      </div>
      <div
        style={{
          textAlign: "right",
          fontSize: 11.5,
          color: "#64748b",
        }}
      >
        {formatDate(application.created_at)}
      </div>
      <div style={{ textAlign: "center" }}>
        <button
          id={`shortlist-btn-${application.id}`}
          onClick={handleClick}
          disabled={loading}
          style={{
            padding: "6px 14px",
            borderRadius: 99,
            fontSize: 12,
            fontWeight: 700,
            border: "none",
            cursor: loading ? "not-allowed" : "pointer",
            opacity: loading ? 0.6 : 1,
            transition: "all 0.18s",
            background: approved
              ? "rgba(254,226,226,0.8)"
              : "linear-gradient(135deg,#10b981,#059669)",
            color: approved ? "#b91c1c" : "#fff",
            boxShadow: approved
              ? "none"
              : "0 4px 12px rgba(16,185,129,0.35)",
            whiteSpace: "nowrap",
          }}
        >
          {loading ? "…" : approved ? "✕ Reject" : "✓ Approve"}
        </button>
      </div>
    </div>
  );
};

// ── Leaderboard tab ─────────────────────────────────────────────────────────

const LeaderboardTab: React.FC<{ interviewId: number; token: string }> = ({
  interviewId,
  token,
}) => {
  const [data, setData] = useState<LeaderboardResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Retry handler — event-driven, so sync resets are allowed here.
  const load = useCallback(() => {
    setData(null);
    setError(null);
    getLeaderboard(interviewId, token)
      .then(setData)
      .catch((err) => {
        setError(
          err instanceof LeaderboardServiceError
            ? err.message
            : "Failed to load leaderboard.",
        );
      });
  }, [interviewId, token]);

  // Initial load: parent re-keys on interviewId, so state starts fresh and
  // the effect just kicks off the async fetch.
  useEffect(() => {
    let cancelled = false;
    getLeaderboard(interviewId, token)
      .then((d) => {
        if (!cancelled) setData(d);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(
          err instanceof LeaderboardServiceError
            ? err.message
            : "Failed to load leaderboard.",
        );
      });
    return () => {
      cancelled = true;
    };
  }, [interviewId, token]);

  if (error) return <ErrorAlert message={error} onRetry={load} />;
  if (!data) return <SkeletonCard tall />;
  if (data.entries.length === 0) {
    return (
      <EmptyState
        title="No candidates yet"
        body="Candidates who complete sessions will appear ranked by interview score."
      />
    );
  }

  return (
    <>
      {data.entries.length >= 3 && (
        <Podium entries={data.entries.slice(0, 3)} />
      )}

      <div
        style={{
          background: "rgba(255,255,255,0.78)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.95)",
          borderRadius: 22,
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
          overflow: "hidden",
          marginTop: data.entries.length >= 3 ? 20 : 0,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "60px 1fr 100px 100px 120px 36px",
            gap: 10,
            padding: "12px 18px",
            fontSize: 11,
            fontWeight: 700,
            color: "#94a3b8",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            borderBottom: "1px solid rgba(226,232,240,0.7)",
          }}
        >
          <div>Rank</div>
          <div>Candidate</div>
          <div style={{ textAlign: "center" }}>Interview</div>
          <div style={{ textAlign: "center" }}>Resume</div>
          <div style={{ textAlign: "center" }}>Status</div>
          <div />
        </div>

        {data.entries.map((entry) => (
          <React.Fragment key={entry.application_id}>
            <LeaderboardRow
              entry={entry}
              expanded={expandedId === entry.application_id}
              onToggle={() =>
                setExpandedId((p) =>
                  p === entry.application_id ? null : entry.application_id,
                )
              }
            />
            {expandedId === entry.application_id && (
              <ExpandedEntry entry={entry} />
            )}
          </React.Fragment>
        ))}
      </div>
    </>
  );
};

const Podium: React.FC<{ entries: LeaderboardEntry[] }> = ({ entries }) => {
  const order = [entries[1], entries[0], entries[2]];
  const heights = [78, 108, 64];
  const colors = [
    "linear-gradient(145deg,#94a3b8,#64748b)",
    "linear-gradient(145deg,#fbbf24,#d97706)",
    "linear-gradient(145deg,#f97316,#ea580c)",
  ];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        gap: 16,
        padding: "10px 0 22px",
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
          <div style={{ position: "relative" }}>
            <div
              style={{
                width: 54,
                height: 54,
                borderRadius: "50%",
                background: colors[idx],
                color: "#fff",
                fontSize: 18,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: `0 8px 20px ${
                  idx === 1 ? "rgba(251,191,36,0.45)" : "rgba(15,23,42,0.15)"
                }`,
                border: "2.5px solid rgba(255,255,255,0.85)",
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
              {rankMedal(entry.rank)}
            </div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#0f172a",
                maxWidth: 100,
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
                color: scoreColor(entry.interview_score),
              }}
            >
              {entry.interview_score?.toFixed(1) ?? "—"}
            </div>
          </div>
          <div
            style={{
              width: 100,
              height: heights[idx],
              background: colors[idx],
              borderRadius: "10px 10px 0 0",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: 22,
              fontWeight: 900,
              boxShadow: `0 -4px 20px ${
                idx === 1 ? "rgba(251,191,36,0.3)" : "rgba(15,23,42,0.1)"
              }`,
            }}
          >
            {entry.rank}
          </div>
        </div>
      ))}
    </div>
  );
};

const LeaderboardRow: React.FC<{
  entry: LeaderboardEntry;
  expanded: boolean;
  onToggle: () => void;
}> = ({ entry, expanded, onToggle }) => (
  <div
    onClick={onToggle}
    style={{
      display: "grid",
      gridTemplateColumns: "60px 1fr 100px 100px 120px 36px",
      gap: 10,
      padding: "14px 18px",
      alignItems: "center",
      borderBottom: "1px solid rgba(241,245,249,0.7)",
      cursor: "pointer",
      background: expanded ? "rgba(239,246,255,0.6)" : "transparent",
      transition: "background 0.15s",
    }}
  >
    <RankBadge rank={entry.rank} />
    <div>
      <div style={{ fontSize: 13.5, fontWeight: 700, color: "#0f172a" }}>
        {entry.username}
      </div>
      <div style={{ fontSize: 11.5, color: "#94a3b8" }}>{entry.email}</div>
    </div>
    <div style={{ textAlign: "center" }}>
      <ScoreChip value={entry.interview_score} />
    </div>
    <div style={{ textAlign: "center" }}>
      <ScoreChip value={entry.resume_score} />
    </div>
    <div style={{ textAlign: "center" }}>
      {entry.shortlisting_decision ? (
        <BadgePill
          color="#10b981"
          bg="rgba(209,250,229,0.7)"
          label="✓ Listed"
        />
      ) : (
        <BadgePill color="#94a3b8" bg="rgba(241,245,249,0.8)" label="Pending" />
      )}
    </div>
    <div
      style={{
        color: "#94a3b8",
        fontSize: 14,
        transform: expanded ? "rotate(90deg)" : "rotate(0deg)",
        transition: "transform 0.15s",
      }}
    >
      ▸
    </div>
  </div>
);

const ExpandedEntry: React.FC<{ entry: LeaderboardEntry }> = ({ entry }) => (
  <div
    style={{
      background: "rgba(248,250,252,0.85)",
      borderBottom: "1px solid rgba(241,245,249,0.7)",
      padding: "16px 22px 22px",
    }}
  >
    {entry.application_feedback && (
      <NoteBox label="Resume feedback" body={entry.application_feedback} />
    )}
    {entry.sessions.length === 0 ? (
      <Muted>No sessions completed.</Muted>
    ) : (
      entry.sessions.map((session, i) => (
        <SessionDetail key={session.id} session={session} index={i + 1} />
      ))
    )}
  </div>
);

const SessionDetail: React.FC<{ session: SessionResult; index: number }> = ({
  session,
  index,
}) => (
  <div
    style={{
      background: "rgba(255,255,255,0.85)",
      border: "1px solid rgba(226,232,240,0.8)",
      borderRadius: 16,
      padding: 18,
      marginTop: 10,
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: 10,
        marginBottom: 10,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span
          style={{
            fontSize: 12,
            fontWeight: 800,
            color: "#0f172a",
            textTransform: "uppercase",
            letterSpacing: "0.06em",
          }}
        >
          Session {index} · #{session.id}
        </span>
        <StatusPill status={session.status} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <ScoreChip value={session.score} />
        <span
          style={{
            fontSize: 11,
            color: "#94a3b8",
            fontFamily:
              "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
          }}
        >
          {formatDate(session.start_time)}
          {session.end_time ? ` → ${formatDate(session.end_time)}` : ""}
        </span>
      </div>
    </div>

    {session.recommendation && (
      <NoteBox label="Recommendation" body={session.recommendation} />
    )}
    {session.strengths && (
      <NoteBox label="Strengths" body={session.strengths} />
    )}
    {session.feedback && (
      <NoteBox label="Overall feedback" body={session.feedback} />
    )}

    <RoundBlock title="Behavioural questions">
      {session.questions_round.length === 0 ? (
        <Muted>No behavioural answers.</Muted>
      ) : (
        session.questions_round.map((q) => (
          <div
            key={q.id}
            style={{
              marginBottom: 12,
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(226,232,240,0.7)",
              background: "rgba(255,255,255,0.95)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: 10,
                marginBottom: 6,
              }}
            >
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#0f172a",
                }}
              >
                {q.question ?? "(question deleted)"}
              </div>
              <ScoreChip value={q.score} small />
            </div>
            {q.feedback && (
              <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  marginBottom: 8,
                  fontStyle: "italic",
                }}
              >
                {q.feedback}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {q.follow_ups.map((t) => (
                <div key={t.id}>
                  <div
                    style={{
                      fontSize: 11.5,
                      color: "#94a3b8",
                      fontWeight: 700,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      marginBottom: 2,
                    }}
                  >
                    AI asked
                  </div>
                  <div style={{ fontSize: 12.5, color: "#475569" }}>
                    {t.question}
                  </div>
                  {t.answer && (
                    <>
                      <div
                        style={{
                          fontSize: 11.5,
                          color: "#94a3b8",
                          fontWeight: 700,
                          textTransform: "uppercase",
                          letterSpacing: "0.05em",
                          marginTop: 6,
                          marginBottom: 2,
                        }}
                      >
                        Candidate
                      </div>
                      <div
                        style={{
                          fontSize: 12.5,
                          color: "#0f172a",
                          whiteSpace: "pre-wrap",
                        }}
                      >
                        {t.answer}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </RoundBlock>

    <RoundBlock title="Coding">
      {session.dsa_round.length === 0 ? (
        <Muted>No coding submissions.</Muted>
      ) : (
        session.dsa_round.map((dsa) => (
          <div
            key={dsa.id}
            style={{
              marginBottom: 12,
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(226,232,240,0.7)",
              background: "rgba(255,255,255,0.95)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 10,
                marginBottom: 8,
              }}
            >
              <div>
                <div
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  {dsa.problem_name ?? "(problem)"}
                </div>
                <div
                  style={{
                    fontSize: 11.5,
                    color: "#94a3b8",
                    marginTop: 2,
                  }}
                >
                  {dsa.topic ?? "?"} ·{" "}
                  {dsa.difficulty ? (
                    <DifficultyChip difficulty={dsa.difficulty} inline />
                  ) : (
                    "?"
                  )}{" "}
                  · {dsa.language ?? "—"}
                </div>
              </div>
              <ScoreChip value={dsa.score} small />
            </div>
            {dsa.code && (
              <pre
                style={{
                  background: "#0f172a",
                  color: "#e2e8f0",
                  fontSize: 11.5,
                  padding: 10,
                  borderRadius: 8,
                  overflow: "auto",
                  maxHeight: 220,
                  fontFamily:
                    "ui-monospace, SFMono-Regular, 'SF Mono', Menlo, monospace",
                  margin: 0,
                }}
              >
                {dsa.code}
              </pre>
            )}
          </div>
        ))
      )}
    </RoundBlock>

    <RoundBlock title="Resume Q&A">
      {session.resume_round.length === 0 ? (
        <Muted>No resume conversations.</Muted>
      ) : (
        session.resume_round.map((conv) => (
          <div
            key={conv.id}
            style={{
              marginBottom: 12,
              padding: 12,
              borderRadius: 12,
              border: "1px solid rgba(226,232,240,0.7)",
              background: "rgba(255,255,255,0.95)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 700, color: "#0f172a" }}>
                Conversation #{conv.id}
              </span>
              <ScoreChip value={conv.score} small />
            </div>
            {conv.feedback && (
              <div
                style={{
                  fontSize: 12,
                  color: "#64748b",
                  marginBottom: 8,
                  fontStyle: "italic",
                }}
              >
                {conv.feedback}
              </div>
            )}
            {conv.questions.map((qq) => (
              <div key={qq.id} style={{ marginBottom: 8 }}>
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 700,
                    color: "#0f172a",
                  }}
                >
                  Q: {qq.question}
                </div>
                <div
                  style={{
                    fontSize: 12.5,
                    color: "#475569",
                    whiteSpace: "pre-wrap",
                    marginTop: 2,
                  }}
                >
                  A: {qq.answer ?? "(no answer)"}
                </div>
              </div>
            ))}
          </div>
        ))
      )}
    </RoundBlock>
  </div>
);

// ── Create interview wizard (3 steps) ───────────────────────────────────────

interface CreateFormState {
  position: string;
  description: string;
  experience: string;
  submission_deadline: string;
  start_time: string;
  end_time: string;
  duration: number;
  dsa_score: number;
  dev_score: number;
  resume_shortlist_score: number;
  ask_questions_on_resume: boolean;
  questions: { question: string; expected_answer: string }[];
  dsa_topics: { topic: string; difficulty: string }[];
}

type WizardStep = 1 | 2 | 3;

const STEP_META: Record<
  WizardStep,
  { title: string; subtitle: string; pill: string }
> = {
  1: {
    title: "Basic details",
    subtitle: "Position, schedule, duration, and scoring weights.",
    pill: "Step 1 of 3",
  },
  2: {
    title: "Behavioural questions",
    subtitle:
      "The questions the AI interviewer will ask each candidate in the first round.",
    pill: "Step 2 of 3",
  },
  3: {
    title: "Coding round",
    subtitle:
      "Pick the topics and difficulty — the AI generates a fresh problem per candidate during the interview.",
    pill: "Step 3 of 3",
  },
};

const CreateInterviewView: React.FC<{
  token: string;
  onBack: () => void;
  onCreated: (created: OrgInterviewDetail) => void;
}> = ({ token, onBack, onCreated }) => {
  const [step, setStep] = useState<WizardStep>(1);
  const [form, setForm] = useState<CreateFormState>({
    position: "",
    description: "",
    experience: "Mid",
    submission_deadline: toLocalInput(addDays(new Date(), 7)),
    start_time: toLocalInput(addDays(new Date(), 8)),
    end_time: toLocalInput(addDays(new Date(), 14)),
    duration: 60,
    dsa_score: 50,
    dev_score: 50,
    resume_shortlist_score: 0,
    ask_questions_on_resume: false,
    questions: [{ question: "", expected_answer: "" }],
    dsa_topics: [{ topic: "", difficulty: "easy" }],
  });
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const set = <K extends keyof CreateFormState>(k: K, v: CreateFormState[K]) =>
    setForm((f) => ({ ...f, [k]: v }));

  const setQ = (i: number, patch: Partial<CreateFormState["questions"][0]>) =>
    setForm((f) => ({
      ...f,
      questions: f.questions.map((q, idx) =>
        idx === i ? { ...q, ...patch } : q,
      ),
    }));
  const addQ = () =>
    setForm((f) => ({
      ...f,
      questions: [...f.questions, { question: "", expected_answer: "" }],
    }));
  const rmQ = (i: number) =>
    setForm((f) => ({
      ...f,
      questions: f.questions.filter((_, idx) => idx !== i),
    }));

  const setT = (i: number, patch: Partial<CreateFormState["dsa_topics"][0]>) =>
    setForm((f) => ({
      ...f,
      dsa_topics: f.dsa_topics.map((t, idx) =>
        idx === i ? { ...t, ...patch } : t,
      ),
    }));
  const addT = () =>
    setForm((f) => ({
      ...f,
      dsa_topics: [...f.dsa_topics, { topic: "", difficulty: "easy" }],
    }));
  const rmT = (i: number) =>
    setForm((f) => ({
      ...f,
      dsa_topics: f.dsa_topics.filter((_, idx) => idx !== i),
    }));

  const totalScore = form.dsa_score + form.dev_score;
  const valid = useMemo(() => {
    if (!form.position.trim() || !form.description.trim()) return false;
    if (totalScore !== 100) return false;
    if (
      form.questions.length === 0 ||
      form.questions.some((q) => !q.question.trim())
    )
      return false;
    if (
      form.dsa_topics.length === 0 ||
      form.dsa_topics.some((t) => !t.topic.trim())
    )
      return false;
    return true;
  }, [form, totalScore]);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!valid) return;
    setSubmitting(true);
    setError(null);
    try {
      const payload: CreateInterviewPayload = {
        position: form.position.trim(),
        description: form.description.trim(),
        experience: form.experience.trim(),
        submission_deadline: toIso(form.submission_deadline),
        start_time: toIso(form.start_time),
        end_time: toIso(form.end_time),
        duration: form.duration,
        dsa_score: form.dsa_score,
        dev_score: form.dev_score,
        resume_shortlist_score: form.resume_shortlist_score,
        ask_questions_on_resume: form.ask_questions_on_resume,
        questions: form.questions.map((q) => ({
          question: q.question.trim(),
          expected_answer: q.expected_answer.trim(),
        })),
        dsa_topics: form.dsa_topics.map((t) => ({
          topic: t.topic.trim(),
          difficulty: t.difficulty,
        })),
      };
      const created = await createOrgInterview(payload, token);
      onCreated(created);
    } catch (err) {
      setError(
        err instanceof LeaderboardServiceError
          ? err.message
          : "Failed to create interview.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  // Per-step validation. Step 1 = basics; Step 2 = behavioural questions;
  // Step 3 = DSA topics. Only valid steps allow you to advance.
  const step1Valid =
    form.position.trim().length > 0 &&
    form.description.trim().length > 0 &&
    totalScore === 100 &&
    form.duration > 0;
  const step2Valid =
    form.questions.length > 0 &&
    form.questions.every((q) => q.question.trim().length > 0);
  const step3Valid =
    form.dsa_topics.length > 0 &&
    form.dsa_topics.every((t) => t.topic.trim().length > 0);

  const canAdvance =
    (step === 1 && step1Valid) ||
    (step === 2 && step2Valid) ||
    (step === 3 && step3Valid && valid);

  const goNext = () => setStep((s) => (s < 3 ? ((s + 1) as WizardStep) : s));
  const goPrev = () => setStep((s) => (s > 1 ? ((s - 1) as WizardStep) : s));

  return (
    <>
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "transparent",
          border: "none",
          color: "#64748b",
          fontSize: 13,
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 14,
          padding: 0,
        }}
      >
        ← Cancel
      </button>

      <div
        style={{
          background: "rgba(255,255,255,0.78)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          border: "1px solid rgba(255,255,255,0.95)",
          borderRadius: 22,
          padding: 26,
          boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
        }}
      >
        <WizardStepper
          step={step}
          step1Valid={step1Valid}
          step2Valid={step2Valid}
        />

        <div style={{ marginTop: 22 }}>
          <Pill text={STEP_META[step].pill} />
          <h3
            style={{
              fontSize: 22,
              fontWeight: 800,
              color: "#0f172a",
              letterSpacing: "-0.5px",
              marginTop: 10,
              marginBottom: 4,
            }}
          >
            {STEP_META[step].title}
          </h3>
          <p style={{ fontSize: 13.5, color: "#64748b", fontWeight: 500 }}>
            {STEP_META[step].subtitle}
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (step !== 3) goNext();
            else void submit(e);
          }}
          style={{ marginTop: 22 }}
        >
          {error && (
            <div
              role="alert"
              style={{
                padding: "10px 14px",
                borderRadius: 12,
                background: "rgba(254,226,226,0.7)",
                border: "1px solid rgba(248,113,113,0.5)",
                color: "#b91c1c",
                fontSize: 13,
                fontWeight: 500,
                marginBottom: 14,
              }}
            >
              {error}
            </div>
          )}

          {step === 1 && (
            <Step1Basics
              form={form}
              set={set}
              totalScore={totalScore}
              onScoreChange={(dsa) => {
                set("dsa_score", dsa);
                set("dev_score", 100 - dsa);
              }}
            />
          )}
          {step === 2 && (
            <Step2Questions
              questions={form.questions}
              setQ={setQ}
              addQ={addQ}
              rmQ={rmQ}
            />
          )}
          {step === 3 && (
            <Step3Topics
              topics={form.dsa_topics}
              setT={setT}
              addT={addT}
              rmT={rmT}
            />
          )}

          <div
            style={{
              marginTop: 24,
              paddingTop: 18,
              borderTop: "1px solid rgba(226,232,240,0.7)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 10,
            }}
          >
            <button
              type="button"
              onClick={step === 1 ? onBack : goPrev}
              style={{
                background: "rgba(241,245,249,0.9)",
                border: "1px solid rgba(203,213,225,0.7)",
                borderRadius: 99,
                padding: "10px 22px",
                fontSize: 13,
                fontWeight: 600,
                color: "#475569",
                cursor: "pointer",
              }}
            >
              {step === 1 ? "Cancel" : "← Back"}
            </button>

            <button
              type="submit"
              disabled={!canAdvance || submitting}
              style={{
                background: canAdvance
                  ? "linear-gradient(135deg,#3b82f6,#1d4ed8)"
                  : "rgba(203,213,225,0.8)",
                color: "#fff",
                border: "none",
                borderRadius: 99,
                padding: "11px 26px",
                fontSize: 13,
                fontWeight: 700,
                cursor: canAdvance && !submitting ? "pointer" : "not-allowed",
                opacity: submitting ? 0.7 : 1,
                boxShadow: canAdvance
                  ? "0 8px 22px rgba(59,130,246,0.4)"
                  : "none",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              {step === 3
                ? submitting
                  ? "Creating…"
                  : "Create interview"
                : "Next →"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

// ── Wizard pieces ───────────────────────────────────────────────────────────

const WizardStepper: React.FC<{
  step: WizardStep;
  step1Valid: boolean;
  step2Valid: boolean;
}> = ({ step, step1Valid, step2Valid }) => {
  const labels = ["Basics", "Questions", "Coding"];
  const states: ("done" | "active" | "todo")[] = [
    step === 1 ? "active" : step1Valid ? "done" : "todo",
    step === 2 ? "active" : step > 2 && step2Valid ? "done" : "todo",
    step === 3 ? "active" : "todo",
  ];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        flexWrap: "wrap",
      }}
    >
      {labels.map((label, i) => {
        const state = states[i];
        const colour =
          state === "active" || state === "done" ? "#2563eb" : "#cbd5e1";
        return (
          <React.Fragment key={label}>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                padding: "6px 14px",
                borderRadius: 99,
                background:
                  state === "active"
                    ? "linear-gradient(135deg,rgba(59,130,246,0.15),rgba(29,78,216,0.15))"
                    : state === "done"
                      ? "rgba(219,234,254,0.55)"
                      : "rgba(248,250,252,0.7)",
                border:
                  state === "active"
                    ? "1px solid rgba(59,130,246,0.5)"
                    : "1px solid rgba(226,232,240,0.7)",
              }}
            >
              <div
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background:
                    state === "active" || state === "done"
                      ? colour
                      : "transparent",
                  border:
                    state === "active" || state === "done"
                      ? "none"
                      : `1.5px solid ${colour}`,
                  color: "#fff",
                  fontSize: 11,
                  fontWeight: 800,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {state === "done" ? "✓" : i + 1}
              </div>
              <span
                style={{
                  fontSize: 12.5,
                  fontWeight: 700,
                  color:
                    state === "active" || state === "done"
                      ? "#1e3a8a"
                      : "#94a3b8",
                  letterSpacing: "0.02em",
                }}
              >
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div
                style={{
                  width: 18,
                  height: 2,
                  background:
                    state === "done" ? "#60a5fa" : "rgba(203,213,225,0.7)",
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

const Step1Basics: React.FC<{
  form: CreateFormState;
  set: <K extends keyof CreateFormState>(k: K, v: CreateFormState[K]) => void;
  totalScore: number;
  onScoreChange: (dsa: number) => void;
}> = ({ form, set, totalScore, onScoreChange }) => (
  <>
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
      <Field
        label="Position"
        value={form.position}
        onChange={(v) => set("position", v)}
        placeholder="Senior Backend Engineer"
      />
      <Field
        label="Experience level"
        value={form.experience}
        onChange={(v) => set("experience", v)}
        placeholder="Mid / Senior / Staff"
      />
    </div>
    <FieldArea
      label="Description"
      value={form.description}
      onChange={(v) => set("description", v)}
      placeholder="What the role is, what you're looking for, anything candidates need to know."
    />

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr 1fr",
        gap: 14,
      }}
    >
      <Field
        label="Apply by"
        type="datetime-local"
        value={form.submission_deadline}
        onChange={(v) => set("submission_deadline", v)}
      />
      <Field
        label="Start time"
        type="datetime-local"
        value={form.start_time}
        onChange={(v) => set("start_time", v)}
      />
      <Field
        label="End time"
        type="datetime-local"
        value={form.end_time}
        onChange={(v) => set("end_time", v)}
      />
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14,
        marginTop: 6,
      }}
    >
      <Field
        label="Duration (min)"
        type="number"
        value={String(form.duration)}
        onChange={(v) => set("duration", parseInt(v) || 0)}
      />
      <Field
        label="Resume shortlist threshold"
        type="number"
        step="0.1"
        value={String(form.resume_shortlist_score)}
        onChange={(v) => set("resume_shortlist_score", parseFloat(v) || 0)}
      />
    </div>

    <WeightSlider
      dsa={form.dsa_score}
      dev={form.dev_score}
      onChange={onScoreChange}
    />
    {totalScore !== 100 && (
      <div
        style={{
          fontSize: 12,
          color: "#b45309",
          marginTop: 4,
          fontWeight: 600,
        }}
      >
        DSA + Dev weights must total 100 (currently {totalScore}).
      </div>
    )}

    <label
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        marginTop: 18,
        cursor: "pointer",
        fontSize: 13,
        fontWeight: 600,
        color: "#475569",
      }}
    >
      <input
        type="checkbox"
        checked={form.ask_questions_on_resume}
        onChange={(e) => set("ask_questions_on_resume", e.target.checked)}
        style={{ width: 16, height: 16, accentColor: "#2563eb" }}
      />
      Include a resume Q&A round
    </label>
  </>
);

const Step2Questions: React.FC<{
  questions: CreateFormState["questions"];
  setQ: (i: number, patch: Partial<CreateFormState["questions"][0]>) => void;
  addQ: () => void;
  rmQ: (i: number) => void;
}> = ({ questions, setQ, addQ, rmQ }) => (
  <>
    <InfoBox
      title="How this round works"
      body="Each candidate is asked these questions in order during the interview. The AI may ask up to 3 follow-ups per question if an answer is unclear, then grades the response against the expected answer you provide here."
    />
    {questions.map((q, i) => (
      <div
        key={i}
        style={{
          background: "rgba(248,250,252,0.7)",
          border: "1px solid rgba(226,232,240,0.7)",
          borderRadius: 14,
          padding: 14,
          marginBottom: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: "0.06em",
            }}
          >
            Q{i + 1}
          </span>
          {questions.length > 1 && <RemoveBtn onClick={() => rmQ(i)} />}
        </div>
        <FieldArea
          label="Question"
          value={q.question}
          onChange={(v) => setQ(i, { question: v })}
          rows={2}
        />
        <FieldArea
          label="Expected answer (for AI grading)"
          value={q.expected_answer}
          onChange={(v) => setQ(i, { expected_answer: v })}
          rows={2}
        />
      </div>
    ))}
    <AddBtn onClick={addQ}>+ Add question</AddBtn>
  </>
);

const Step3Topics: React.FC<{
  topics: CreateFormState["dsa_topics"];
  setT: (i: number, patch: Partial<CreateFormState["dsa_topics"][0]>) => void;
  addT: () => void;
  rmT: (i: number) => void;
}> = ({ topics, setT, addT, rmT }) => (
  <>
    <AiGeneratesPanel topicCount={topics.length} />
    {topics.map((t, i) => (
      <div
        key={i}
        style={{
          background: "rgba(248,250,252,0.7)",
          border: "1px solid rgba(226,232,240,0.7)",
          borderRadius: 14,
          padding: 14,
          marginBottom: 10,
          display: "grid",
          gridTemplateColumns: "1fr 200px 40px",
          gap: 10,
          alignItems: "end",
        }}
      >
        <Field
          label={`Topic ${i + 1}`}
          value={t.topic}
          onChange={(v) => setT(i, { topic: v })}
          placeholder="Two Pointers, Trees, DP…"
        />
        <DifficultyPicker
          value={t.difficulty}
          onChange={(v) => setT(i, { difficulty: v })}
        />
        {topics.length > 1 ? <RemoveBtn onClick={() => rmT(i)} /> : <div />}
      </div>
    ))}
    <AddBtn onClick={addT}>+ Add another topic</AddBtn>
  </>
);

// ── Step 1 helpers ──────────────────────────────────────────────────────────

const WeightSlider: React.FC<{
  dsa: number;
  dev: number;
  onChange: (dsa: number) => void;
}> = ({ dsa, dev, onChange }) => {
  const pct = Math.max(0, Math.min(100, dsa));
  return (
    <div style={{ marginTop: 18 }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 8,
        }}
      >
        <span
          style={{
            fontSize: 12,
            fontWeight: 700,
            color: "#475569",
            letterSpacing: "0.04em",
            textTransform: "uppercase",
          }}
        >
          Round weighting
        </span>
        <span style={{ fontSize: 11.5, color: "#94a3b8", fontWeight: 500 }}>
          Must total 100
        </span>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "stretch",
          gap: 10,
          marginBottom: 10,
        }}
      >
        <WeightChip label="Coding (DSA)" value={pct} accent="#2563eb" />
        <WeightChip label="Behavioural (Dev)" value={dev} accent="#7c3aed" />
      </div>

      <div style={{ position: "relative", padding: "10px 4px 4px" }}>
        <div
          style={{
            position: "absolute",
            top: 18,
            left: 4,
            right: 4,
            height: 8,
            borderRadius: 99,
            background: `linear-gradient(to right, #2563eb 0%, #2563eb ${pct}%, #7c3aed ${pct}%, #7c3aed 100%)`,
            boxShadow: "inset 0 1px 2px rgba(15,23,42,0.15)",
          }}
        />
        <input
          type="range"
          min={0}
          max={100}
          step={5}
          value={pct}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          aria-label="DSA versus Dev weight"
          style={{
            position: "relative",
            width: "100%",
            height: 28,
            appearance: "none",
            WebkitAppearance: "none",
            background: "transparent",
            cursor: "pointer",
            zIndex: 1,
          }}
        />
        <style>{`
          input[type=range][aria-label="DSA versus Dev weight"]::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #fff;
            border: 3px solid #1d4ed8;
            box-shadow: 0 4px 12px rgba(29,78,216,0.45);
            cursor: grab;
            margin-top: -7px;
          }
          input[type=range][aria-label="DSA versus Dev weight"]::-moz-range-thumb {
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: #fff;
            border: 3px solid #1d4ed8;
            box-shadow: 0 4px 12px rgba(29,78,216,0.45);
            cursor: grab;
          }
          input[type=range][aria-label="DSA versus Dev weight"]::-webkit-slider-runnable-track,
          input[type=range][aria-label="DSA versus Dev weight"]::-moz-range-track {
            height: 8px;
            background: transparent;
            border-radius: 99px;
          }
        `}</style>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontSize: 10.5,
          color: "#94a3b8",
          padding: "0 4px",
          marginTop: -4,
          letterSpacing: "0.04em",
          fontWeight: 600,
        }}
      >
        <span>0</span>
        <span>25</span>
        <span>50</span>
        <span>75</span>
        <span>100</span>
      </div>
    </div>
  );
};

const WeightChip: React.FC<{
  label: string;
  value: number;
  accent: string;
}> = ({ label, value, accent }) => (
  <div
    style={{
      flex: 1,
      padding: "10px 14px",
      borderRadius: 14,
      background: `${accent}10`,
      border: `1px solid ${accent}33`,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
    }}
  >
    <span
      style={{
        fontSize: 12,
        fontWeight: 700,
        color: accent,
        letterSpacing: "0.02em",
      }}
    >
      {label}
    </span>
    <span
      style={{
        fontSize: 18,
        fontWeight: 800,
        color: "#0f172a",
        letterSpacing: "-0.4px",
      }}
    >
      {value}%
    </span>
  </div>
);

// ── Step 3 helpers ──────────────────────────────────────────────────────────

const AiGeneratesPanel: React.FC<{ topicCount: number }> = ({ topicCount }) => (
  <div
    style={{
      marginBottom: 16,
      padding: "18px 20px",
      borderRadius: 16,
      background:
        "linear-gradient(135deg, rgba(59,130,246,0.08), rgba(124,58,237,0.08))",
      border: "1px solid rgba(59,130,246,0.25)",
    }}
  >
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
      }}
    >
      <div
        style={{
          width: 36,
          height: 36,
          borderRadius: 11,
          background: "linear-gradient(135deg,#3b82f6,#7c3aed)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: "0 6px 16px rgba(59,130,246,0.4)",
        }}
      >
        <SparkleIcon />
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 14,
            fontWeight: 800,
            color: "#0f172a",
            letterSpacing: "-0.2px",
            marginBottom: 4,
          }}
        >
          Questions are AI-generated per candidate
        </div>
        <div
          style={{
            fontSize: 12.5,
            color: "#475569",
            lineHeight: 1.55,
          }}
        >
          Just pick the <strong>topics</strong> and <strong>difficulty</strong>.
          When a candidate starts the coding round, the AI generates a unique
          problem from your pool — so no two candidates see the same question.
        </div>
      </div>
      <div
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: "#1d4ed8",
          background: "rgba(219,234,254,0.7)",
          border: "1px solid rgba(96,165,250,0.5)",
          borderRadius: 99,
          padding: "5px 12px",
          whiteSpace: "nowrap",
          alignSelf: "center",
        }}
      >
        {topicCount} topic{topicCount === 1 ? "" : "s"}
      </div>
    </div>
  </div>
);

const DifficultyPicker: React.FC<{
  value: string;
  onChange: (v: string) => void;
}> = ({ value, onChange }) => {
  const opts: { value: string; label: string; color: string }[] = [
    { value: "easy", label: "Easy", color: "#10b981" },
    { value: "medium", label: "Medium", color: "#f59e0b" },
    { value: "hard", label: "Hard", color: "#ef4444" },
  ];
  return (
    <div>
      <div
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: "#475569",
          marginBottom: 5,
        }}
      >
        Difficulty
      </div>
      <div
        style={{
          display: "flex",
          gap: 4,
          padding: 3,
          background: "rgba(241,245,249,0.7)",
          border: "1px solid rgba(203,213,225,0.7)",
          borderRadius: 10,
        }}
      >
        {opts.map((o) => {
          const active = o.value === value;
          return (
            <button
              key={o.value}
              type="button"
              onClick={() => onChange(o.value)}
              style={{
                flex: 1,
                padding: "6px 10px",
                borderRadius: 7,
                fontSize: 12,
                fontWeight: 700,
                cursor: "pointer",
                border: "none",
                background: active ? o.color : "transparent",
                color: active ? "#fff" : "#64748b",
                boxShadow: active ? `0 4px 10px ${o.color}55` : "none",
                transition: "all 0.15s",
              }}
            >
              {o.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ── Shared step UI ──────────────────────────────────────────────────────────

const InfoBox: React.FC<{ title: string; body: string }> = ({
  title,
  body,
}) => (
  <div
    style={{
      marginBottom: 16,
      padding: "14px 18px",
      borderRadius: 14,
      background: "rgba(219,234,254,0.35)",
      border: "1px solid rgba(96,165,250,0.4)",
    }}
  >
    <div
      style={{
        fontSize: 12.5,
        fontWeight: 700,
        color: "#1d4ed8",
        marginBottom: 4,
      }}
    >
      {title}
    </div>
    <div style={{ fontSize: 12.5, color: "#1e3a8a", lineHeight: 1.55 }}>
      {body}
    </div>
  </div>
);

const SparkleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 0l2.4 7.6L22 10l-7.6 2.4L12 20l-2.4-7.6L2 10l7.6-2.4z" />
    <circle cx="19" cy="4" r="1.5" />
    <circle cx="4" cy="18" r="1" />
  </svg>
);

// ── Header ───────────────────────────────────────────────────────────────────

const AdminHeader: React.FC<{
  displayName: string;
  onHome: () => void;
  onLogout: () => void;
}> = ({ displayName, onHome, onLogout }) => (
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
      <button
        onClick={onHome}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 9,
          background: "transparent",
          border: "none",
          cursor: "pointer",
          padding: 0,
        }}
      >
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
          InterXAI Admin
        </span>
      </button>

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
            {displayName.slice(0, 2).toUpperCase()}
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
);

// ── Shared utilities ────────────────────────────────────────────────────────

function isLive(i: OrgInterview) {
  const now = Date.now();
  return (
    new Date(i.start_time).getTime() <= now &&
    now <= new Date(i.end_time).getTime()
  );
}
function isUpcoming(i: OrgInterview) {
  return new Date(i.start_time).getTime() > Date.now();
}
function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function scoreColor(s: number | null | undefined) {
  if (s == null) return "#94a3b8";
  if (s >= 80) return "#10b981";
  if (s >= 60) return "#f59e0b";
  if (s >= 40) return "#f97316";
  return "#ef4444";
}
function scoreBg(s: number | null | undefined) {
  if (s == null) return "rgba(241,245,249,0.8)";
  if (s >= 80) return "rgba(209,250,229,0.8)";
  if (s >= 60) return "rgba(254,243,199,0.8)";
  if (s >= 40) return "rgba(255,237,213,0.8)";
  return "rgba(254,226,226,0.8)";
}
function rankMedal(rank: number) {
  if (rank === 1) return "🥇";
  if (rank === 2) return "🥈";
  if (rank === 3) return "🥉";
  return null;
}
function addDays(d: Date, n: number) {
  const out = new Date(d);
  out.setDate(out.getDate() + n);
  return out;
}
function toLocalInput(d: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(
    d.getHours(),
  )}:${pad(d.getMinutes())}`;
}
function toIso(local: string) {
  return new Date(local).toISOString();
}

// ── Small UI pieces ─────────────────────────────────────────────────────────

const Card: React.FC<{ title: string; children: React.ReactNode }> = ({
  title,
  children,
}) => (
  <div
    style={{
      background: "rgba(255,255,255,0.78)",
      backdropFilter: "blur(20px)",
      WebkitBackdropFilter: "blur(20px)",
      border: "1px solid rgba(255,255,255,0.95)",
      borderRadius: 22,
      padding: 22,
      boxShadow: "0 10px 30px rgba(15,23,42,0.06)",
    }}
  >
    <div
      style={{
        fontSize: 13,
        fontWeight: 800,
        color: "#0f172a",
        marginBottom: 14,
        letterSpacing: "-0.2px",
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

const KeyVal: React.FC<{ k: string; v: React.ReactNode }> = ({ k, v }) => (
  <div
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
      padding: "8px 0",
      borderBottom: "1px solid rgba(226,232,240,0.5)",
      fontSize: 13,
    }}
  >
    <span style={{ color: "#64748b" }}>{k}</span>
    <span style={{ color: "#0f172a", fontWeight: 700 }}>{v}</span>
  </div>
);

const AddBtn: React.FC<{ onClick: () => void; children: React.ReactNode }> = ({
  onClick,
  children,
}) => (
  <button
    type="button"
    onClick={onClick}
    style={{
      background: "rgba(219,234,254,0.5)",
      border: "1px dashed rgba(96,165,250,0.6)",
      color: "#1d4ed8",
      borderRadius: 12,
      padding: "8px 16px",
      fontSize: 12.5,
      fontWeight: 700,
      cursor: "pointer",
    }}
  >
    {children}
  </button>
);

const RemoveBtn: React.FC<{ onClick: () => void }> = ({ onClick }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Remove"
    style={{
      width: 30,
      height: 30,
      borderRadius: "50%",
      background: "rgba(254,226,226,0.7)",
      border: "1px solid rgba(248,113,113,0.4)",
      color: "#b91c1c",
      cursor: "pointer",
      fontSize: 14,
      fontWeight: 700,
      lineHeight: 1,
    }}
  >
    ×
  </button>
);

const Field: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  step?: string;
}> = ({ label, value, onChange, placeholder, type = "text", step }) => (
  <label style={{ display: "block", marginTop: 6 }}>
    <span
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 600,
        color: "#475569",
        marginBottom: 5,
      }}
    >
      {label}
    </span>
    <input
      type={type}
      step={step}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.95)",
        border: "1px solid rgba(203,213,225,0.7)",
        borderRadius: 10,
        padding: "9px 12px",
        fontSize: 13.5,
        color: "#0f172a",
        outline: "none",
        boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
        fontFamily: "inherit",
      }}
    />
  </label>
);

const FieldArea: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  rows?: number;
}> = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <label style={{ display: "block", marginTop: 10 }}>
    <span
      style={{
        display: "block",
        fontSize: 12,
        fontWeight: 600,
        color: "#475569",
        marginBottom: 5,
      }}
    >
      {label}
    </span>
    <textarea
      rows={rows}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      style={{
        width: "100%",
        background: "rgba(255,255,255,0.95)",
        border: "1px solid rgba(203,213,225,0.7)",
        borderRadius: 10,
        padding: "10px 12px",
        fontSize: 13.5,
        color: "#0f172a",
        outline: "none",
        boxShadow: "inset 0 1px 2px rgba(15,23,42,0.04)",
        fontFamily: "inherit",
        resize: "vertical",
        lineHeight: 1.5,
      }}
    />
  </label>
);

const ScoreChip: React.FC<{
  value: number | null | undefined;
  small?: boolean;
}> = ({ value, small }) => (
  <span
    style={{
      display: "inline-block",
      background: scoreBg(value),
      border: `1px solid ${scoreColor(value)}33`,
      borderRadius: 99,
      padding: small ? "2px 8px" : "3px 10px",
      fontSize: small ? 11.5 : 12.5,
      fontWeight: 800,
      color: scoreColor(value),
    }}
  >
    {value == null ? "—" : value.toFixed(1)}
  </span>
);

const BadgePill: React.FC<{
  color: string;
  bg: string;
  label: string;
}> = ({ color, bg, label }) => (
  <span
    style={{
      display: "inline-block",
      fontSize: 11,
      fontWeight: 700,
      color,
      background: bg,
      border: `1px solid ${color}44`,
      borderRadius: 99,
      padding: "3px 10px",
    }}
  >
    {label}
  </span>
);

const StatusPill: React.FC<{ status: string }> = ({ status }) => {
  const map: Record<string, { c: string; bg: string }> = {
    ongoing: { c: "#1d4ed8", bg: "rgba(219,234,254,0.7)" },
    completed: { c: "#047857", bg: "rgba(209,250,229,0.7)" },
    scheduled: { c: "#7c3aed", bg: "rgba(237,233,254,0.7)" },
    cancelled: { c: "#64748b", bg: "rgba(241,245,249,0.8)" },
    cheated: { c: "#b91c1c", bg: "rgba(254,226,226,0.7)" },
    disqualified: { c: "#b91c1c", bg: "rgba(254,226,226,0.7)" },
    applied: { c: "#1d4ed8", bg: "rgba(219,234,254,0.7)" },
    approved: { c: "#047857", bg: "rgba(209,250,229,0.7)" },
    rejected: { c: "#b91c1c", bg: "rgba(254,226,226,0.7)" },
  };
  const t = map[status] ?? { c: "#64748b", bg: "rgba(241,245,249,0.8)" };
  return <BadgePill color={t.c} bg={t.bg} label={status} />;
};

const DifficultyChip: React.FC<{ difficulty: string; inline?: boolean }> = ({
  difficulty,
  inline,
}) => {
  const norm = difficulty.toLowerCase();
  const c =
    norm === "easy" ? "#10b981" : norm === "medium" ? "#f59e0b" : "#ef4444";
  return (
    <span
      style={{
        display: inline ? "inline-block" : undefined,
        fontSize: 10.5,
        fontWeight: 700,
        color: c,
        background: `${c}1a`,
        border: `1px solid ${c}55`,
        borderRadius: 6,
        padding: "1px 6px",
        textTransform: "uppercase",
        letterSpacing: "0.05em",
      }}
    >
      {difficulty}
    </span>
  );
};

const RankBadge: React.FC<{ rank: number }> = ({ rank }) => {
  const medal = rankMedal(rank);
  return (
    <div
      style={{
        width: 32,
        height: 32,
        borderRadius: "50%",
        background:
          rank <= 3
            ? rank === 1
              ? "linear-gradient(145deg,#fbbf24,#d97706)"
              : rank === 2
                ? "linear-gradient(145deg,#94a3b8,#64748b)"
                : "linear-gradient(145deg,#f97316,#ea580c)"
            : "rgba(226,232,240,0.7)",
        color: rank <= 3 ? "#fff" : "#64748b",
        fontSize: medal ? 18 : 12,
        fontWeight: 800,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: rank <= 3 ? "0 3px 10px rgba(15,23,42,0.15)" : "none",
      }}
    >
      {medal ?? rank}
    </div>
  );
};

const RoundBlock: React.FC<{
  title: string;
  children: React.ReactNode;
}> = ({ title, children }) => (
  <div style={{ marginTop: 14 }}>
    <div
      style={{
        fontSize: 11,
        fontWeight: 800,
        color: "#0f172a",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
        marginBottom: 8,
      }}
    >
      {title}
    </div>
    {children}
  </div>
);

const NoteBox: React.FC<{ label: string; body: string }> = ({
  label,
  body,
}) => (
  <div
    style={{
      background: "rgba(219,234,254,0.45)",
      border: "1px solid rgba(96,165,250,0.4)",
      borderRadius: 12,
      padding: "10px 14px",
      marginBottom: 10,
    }}
  >
    <div
      style={{
        fontSize: 10.5,
        fontWeight: 800,
        color: "#1d4ed8",
        textTransform: "uppercase",
        letterSpacing: "0.06em",
        marginBottom: 4,
      }}
    >
      {label}
    </div>
    <div style={{ fontSize: 13, color: "#1e3a8a", whiteSpace: "pre-wrap" }}>
      {body}
    </div>
  </div>
);

const Muted: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ fontSize: 13, color: "#94a3b8", fontStyle: "italic" }}>
    {children}
  </div>
);

const StatusBadge: React.FC<{ interview: OrgInterviewDetail }> = ({
  interview,
}) => {
  const live = isLive(interview);
  const upcoming = isUpcoming(interview);
  const label = live ? "Live" : upcoming ? "Upcoming" : "Closed";
  const accent = live ? "#10b981" : upcoming ? "#f59e0b" : "#8b5cf6";
  const bg = live
    ? "rgba(209,250,229,0.8)"
    : upcoming
      ? "rgba(254,243,199,0.8)"
      : "rgba(237,233,254,0.8)";
  return <BadgePill color={accent} bg={bg} label={label} />;
};

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
        background: `${accent}1f`,
        color: accent,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 10,
        border: `1px solid ${accent}33`,
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
      padding: "3px 10px",
      fontWeight: 600,
    }}
  >
    <span style={{ color: "#94a3b8", fontSize: 10 }}>{label}</span>
    {formatDate(date)}
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
      border: `1px solid ${
        light ? "rgba(255,255,255,0.35)" : "rgba(147,197,253,0.55)"
      }`,
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

const ErrorAlert: React.FC<{
  message: string;
  onRetry: () => void;
  retryLabel?: string;
}> = ({ message, onRetry, retryLabel = "Retry" }) => (
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
    <div style={{ fontSize: 22 }}>⚠️</div>
    <div style={{ flex: 1 }}>
      <div
        style={{
          fontSize: 13.5,
          fontWeight: 700,
          color: "#b91c1c",
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
      {retryLabel}
    </button>
  </div>
);

const EmptyState: React.FC<{
  title: string;
  body: string;
  action?: React.ReactNode;
}> = ({ title, body, action }) => (
  <div
    style={{
      textAlign: "center",
      padding: "60px 0",
      color: "#64748b",
      background: "rgba(255,255,255,0.5)",
      backdropFilter: "blur(14px)",
      border: "1px dashed rgba(147,197,253,0.6)",
      borderRadius: 22,
    }}
  >
    <div style={{ fontSize: 48, marginBottom: 14 }}>📋</div>
    <div
      style={{
        fontSize: 17,
        fontWeight: 800,
        color: "#0f172a",
        marginBottom: 6,
        letterSpacing: "-0.3px",
      }}
    >
      {title}
    </div>
    <div style={{ fontSize: 13, maxWidth: 380, margin: "0 auto" }}>{body}</div>
    {action}
  </div>
);

const SkeletonCard: React.FC<{ tall?: boolean }> = ({ tall }) => (
  <div
    style={{
      background: "rgba(255,255,255,0.6)",
      border: "1px solid rgba(226,232,240,0.5)",
      borderRadius: 22,
      padding: 22,
      animation: "skel-pulse 1.4s ease-in-out infinite",
      minHeight: tall ? 240 : undefined,
    }}
  >
    <style>{`@keyframes skel-pulse { 0%,100%{opacity:1} 50%{opacity:0.55} }`}</style>
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
      }}
    />
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

// ── Icons ────────────────────────────────────────────────────────────────────

const LiveIcon: React.FC = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <circle cx="12" cy="12" r="4" fill="#10b981" />
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
const PlusIcon: React.FC = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
    <path
      d="M12 5v14M5 12h14"
      stroke="white"
      strokeWidth="2.4"
      strokeLinecap="round"
    />
  </svg>
);
const ArrowIcon: React.FC<{ color?: string }> = ({ color = "white" }) => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path
      d="M2 7h10M8 3l4 4-4 4"
      stroke={color}
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default OrgDashboardPage;
