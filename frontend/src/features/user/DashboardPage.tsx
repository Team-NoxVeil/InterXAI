/**
 * DashboardPage.tsx
 * User home: lists available interviews + their applied interviews.
 */

import React, { useState } from 'react';
import Logo from '../../components/ui/Logo';
import AlertBanner from '../../components/ui/AlertBanner';
import Button from '../../components/ui/Button';
import { useDashboard } from './hooks/useDashboard';
import type { InterviewBasic, AppliedInterview, UserResponse } from '../../services/user.service';

export interface DashboardPageProps {
  user: UserResponse;
  token: string;
  onLogout: () => void;
}

type Tab = 'available' | 'applied';

const statusColors: Record<string, string> = {
  pending: 'bg-amber-50 text-amber-700 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function timeRemaining(deadline: string) {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return 'Deadline passed';
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  if (days > 0) return `${days}d remaining`;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  return `${hours}h remaining`;
}

// ── Interview Cards ───────────────────────────────────────────────────────────

const AvailableCard: React.FC<{ interview: InterviewBasic }> = ({ interview }) => (
  <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg hover:shadow-blue-100/50
    hover:-translate-y-0.5 transition-all duration-200 group">
    <div className="flex items-start justify-between gap-4 mb-3">
      <div>
        <h3 className="font-semibold text-slate-900 text-base group-hover:text-blue-700 transition-colors">
          {interview.position}
        </h3>
        <p className="text-slate-500 text-xs mt-0.5">{interview.experience} experience</p>
      </div>
      <span className="shrink-0 text-xs font-medium text-orange-600 bg-orange-50 border border-orange-200
        rounded-full px-2.5 py-1">
        {timeRemaining(interview.submission_deadline)}
      </span>
    </div>
    <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
      {interview.description}
    </p>
    <div className="flex items-center justify-between">
      <div className="flex flex-col gap-0.5">
        <span className="text-slate-400 text-[10px] uppercase tracking-wider font-medium">Interview window</span>
        <span className="text-slate-600 text-xs">
          {formatDate(interview.start_time)} → {formatDate(interview.end_time)}
        </span>
      </div>
      <Button
        variant="primary"
        id={`apply-${interview.id}`}
        className="text-xs px-4 py-2 rounded-lg"
      >
        Apply →
      </Button>
    </div>
  </div>
);

const AppliedCard: React.FC<{ interview: AppliedInterview }> = ({ interview }) => {
  const statusClass = statusColors[interview.status] ?? 'bg-slate-50 text-slate-600 border-slate-200';
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-5 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-200">
      <div className="flex items-start justify-between gap-4 mb-3">
        <div>
          <h3 className="font-semibold text-slate-900 text-base">{interview.position}</h3>
          <p className="text-slate-500 text-xs mt-0.5">{interview.experience} experience</p>
        </div>
        <span className={`shrink-0 text-xs font-semibold border rounded-full px-3 py-1 capitalize ${statusClass}`}>
          {interview.status}
        </span>
      </div>
      <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
        {interview.description}
      </p>
      <div className="flex items-center gap-2 text-slate-400 text-xs">
        <CalendarIcon />
        Deadline: {formatDate(interview.submission_deadline)}
      </div>
    </div>
  );
};

// ── Main Dashboard ────────────────────────────────────────────────────────────

const DashboardPage: React.FC<DashboardPageProps> = ({ user, token, onLogout }) => {
  const [tab, setTab] = useState<Tab>('available');
  const { available, applied, isLoading, error, refetch } = useDashboard(token);

  const displayName = user.username;
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div id="dashboard-page" className="min-h-screen bg-slate-50">
      {/* Top Nav */}
      <header className="sticky top-0 z-40 bg-white border-b border-slate-200/70 shadow-sm px-6 md:px-12 py-3">
        <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
          <Logo />

          {/* Search bar placeholder */}
          <div className="hidden md:flex items-center gap-2 flex-1 max-w-sm mx-8
            bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-400">
            <SearchIcon />
            Search interviews…
          </div>

          {/* User avatar + logout */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center
              text-white text-sm font-bold select-none">
              {initials}
            </div>
            <div className="hidden md:flex flex-col leading-none">
              <span className="text-sm font-semibold text-slate-800">{displayName}</span>
              <span className="text-xs text-slate-400">{user.email}</span>
            </div>
            <button
              onClick={onLogout}
              id="dashboard-logout"
              className="ml-2 text-xs text-slate-400 hover:text-slate-700 px-3 py-1.5
                rounded-lg border border-slate-200 hover:bg-slate-50 transition-all"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-6 md:px-12 py-10">
        {/* Welcome banner */}
        <div className="mb-8 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">
              Welcome back, {displayName} 👋
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Ready to ace your next interview?
            </p>
          </div>
          {/* Quick stats */}
          <div className="flex gap-4">
            <Stat label="Available" value={available.length} color="blue" />
            <Stat label="Applied" value={applied.length} color="violet" />
          </div>
        </div>

        {/* Profile reminder */}
        {!user.profile?.bio && (
          <div className="mb-6 flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4">
            <div className="text-blue-500 shrink-0"><InfoIcon /></div>
            <p className="text-sm text-blue-800">
              Your profile is incomplete. Adding your bio and social links helps organisations find you.
            </p>
          </div>
        )}

        {/* Tab bar */}
        <div
          className="flex rounded-xl bg-white border border-slate-200 p-1 mb-6 w-fit shadow-sm"
          role="tablist"
        >
          {(['available', 'applied'] as Tab[]).map((t) => (
            <button
              key={t}
              role="tab"
              aria-selected={tab === t}
              id={`tab-${t}`}
              onClick={() => setTab(t)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 capitalize
                ${tab === t
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-slate-500 hover:text-slate-800'}`}
            >
              {t === 'available' ? `Available (${available.length})` : `Applied (${applied.length})`}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6">
            <AlertBanner message={error} variant="error" />
            <button onClick={refetch} className="mt-2 text-sm text-blue-600 hover:underline">
              Try again
            </button>
          </div>
        )}

        {/* Loading skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 p-5 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-3/4 mb-3" />
                <div className="h-3 bg-slate-100 rounded w-1/2 mb-4" />
                <div className="h-3 bg-slate-100 rounded w-full mb-2" />
                <div className="h-3 bg-slate-100 rounded w-4/5" />
              </div>
            ))}
          </div>
        )}

        {/* Interview grid */}
        {!isLoading && !error && (
          <>
            {tab === 'available' && (
              available.length === 0 ? (
                <EmptyState
                  icon={<BriefcaseIcon />}
                  title="No interviews available right now"
                  description="Check back later — new positions are added regularly."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {available.map((iv) => (
                    <AvailableCard key={iv.id} interview={iv} />
                  ))}
                </div>
              )
            )}

            {tab === 'applied' && (
              applied.length === 0 ? (
                <EmptyState
                  icon={<ClipboardIcon />}
                  title="You haven't applied yet"
                  description="Browse available interviews and submit your first application."
                />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {applied.map((iv) => (
                    <AppliedCard key={iv.id} interview={iv} />
                  ))}
                </div>
              )
            )}
          </>
        )}
      </main>
    </div>
  );
};

// ── Stat pill ─────────────────────────────────────────────────────────────────
const Stat = ({ label, value, color }: { label: string; value: number; color: string }) => (
  <div className={`flex flex-col items-center px-5 py-3 rounded-xl bg-${color}-50 border border-${color}-100`}>
    <span className={`text-2xl font-bold text-${color}-700`}>{value}</span>
    <span className={`text-xs text-${color}-500 font-medium`}>{label}</span>
  </div>
);

// ── Empty state ───────────────────────────────────────────────────────────────
const EmptyState = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
    <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-2xl">
      {icon}
    </div>
    <h3 className="text-slate-700 font-semibold text-base">{title}</h3>
    <p className="text-slate-400 text-sm max-w-xs">{description}</p>
  </div>
);

// ── Icons ─────────────────────────────────────────────────────────────────────
function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <circle cx="6.5" cy="6.5" r="4.5" stroke="#94a3b8" strokeWidth="1.4" />
      <path d="M10.5 10.5L14 14" stroke="#94a3b8" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

function CalendarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <rect x="1" y="2" width="10" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M1 5h10M4 1v2M8 1v2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="8.5" stroke="currentColor" strokeWidth="1.4" />
      <path d="M10 8.5v5M10 6.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BriefcaseIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="3" y="9" width="22" height="16" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 9V7a5 5 0 0110 0v2M3 16h22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="5" y="5" width="18" height="20" rx="2.5" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 5a4 4 0 018 0M9 13h10M9 17h6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default DashboardPage;
