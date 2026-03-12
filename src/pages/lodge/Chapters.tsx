import React, { useState } from 'react';
import {
  Building2,
  ChevronRight,
  Plus,
  Search,
  MapPin,
  Users,
  Globe,
  MoreHorizontal,
  Clock,
  TrendingUp,
  Mail,
  ExternalLink,
  Shield,
  Activity,
  CalendarDays,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ChapterStatus = 'active' | 'growing' | 'new' | 'inactive';

interface Chapter {
  id: string;
  name: string;
  city: string;
  country: string;
  countryCode: string;
  memberCount: number;
  adminName: string;
  adminEmail: string;
  status: ChapterStatus;
  founded: string;
  lastEvent: string;
  growthRate: number;
  upcomingEvents: number;
  timezone: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockChapters: Chapter[] = [
  {
    id: '1',
    name: 'London HQ',
    city: 'London',
    country: 'United Kingdom',
    countryCode: 'GB',
    memberCount: 487,
    adminName: 'Eleanor Whitfield',
    adminEmail: 'eleanor@canzuk.com',
    status: 'active',
    founded: 'Jan 2024',
    lastEvent: '8 Mar 2026',
    growthRate: 12.4,
    upcomingEvents: 3,
    timezone: 'GMT+0',
  },
  {
    id: '2',
    name: 'Melbourne',
    city: 'Melbourne',
    country: 'Australia',
    countryCode: 'AU',
    memberCount: 312,
    adminName: 'James Thornton',
    adminEmail: 'james.t@canzuk.com',
    status: 'active',
    founded: 'Mar 2024',
    lastEvent: '5 Mar 2026',
    growthRate: 18.7,
    upcomingEvents: 2,
    timezone: 'AEST+11',
  },
  {
    id: '3',
    name: 'Toronto',
    city: 'Toronto',
    country: 'Canada',
    countryCode: 'CA',
    memberCount: 198,
    adminName: 'Priya Nair',
    adminEmail: 'priya.n@canzuk.com',
    status: 'growing',
    founded: 'Jun 2024',
    lastEvent: '1 Mar 2026',
    growthRate: 24.3,
    upcomingEvents: 1,
    timezone: 'EST-5',
  },
  {
    id: '4',
    name: 'Auckland',
    city: 'Auckland',
    country: 'New Zealand',
    countryCode: 'NZ',
    memberCount: 143,
    adminName: 'Emma Ngata',
    adminEmail: 'emma.n@canzuk.com',
    status: 'growing',
    founded: 'Sep 2024',
    lastEvent: '28 Feb 2026',
    growthRate: 31.2,
    upcomingEvents: 2,
    timezone: 'NZST+13',
  },
  {
    id: '5',
    name: 'Singapore',
    city: 'Singapore',
    country: 'Singapore',
    countryCode: 'SG',
    memberCount: 67,
    adminName: 'David Tremblay',
    adminEmail: 'david.t@canzuk.com',
    status: 'new',
    founded: 'Jan 2025',
    lastEvent: '15 Feb 2026',
    growthRate: 0,
    upcomingEvents: 1,
    timezone: 'SGT+8',
  },
];

const statusConfig: Record<ChapterStatus, { label: string; bg: string; text: string; dot: string }> = {
  active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  growing: { label: 'Growing', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  new: { label: 'New', bg: 'bg-purple-50', text: 'text-purple-700', dot: 'bg-purple-500' },
  inactive: { label: 'Inactive', bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
};

const flagEmoji: Record<string, string> = {
  GB: '\u{1F1EC}\u{1F1E7}',
  AU: '\u{1F1E6}\u{1F1FA}',
  CA: '\u{1F1E8}\u{1F1E6}',
  NZ: '\u{1F1F3}\u{1F1FF}',
  SG: '\u{1F1F8}\u{1F1EC}',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Chapters: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChapters = mockChapters.filter(
    (ch) =>
      ch.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ch.country.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalMembers = mockChapters.reduce((sum, ch) => sum + ch.memberCount, 0);
  const totalUpcoming = mockChapters.reduce((sum, ch) => sum + ch.upcomingEvents, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center text-sm text-ink-tertiary mb-1">
        <span>Lodge</span>
        <ChevronRight className="w-3.5 h-3.5 mx-1" />
        <span className="text-ink-secondary font-medium">Chapters</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lodge/10">
            <Globe className="h-5 w-5 text-lodge" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">Chapter Management</h1>
            <p className="text-sm text-ink-tertiary">
              {mockChapters.length} chapters across the CANZUK network
            </p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-lodge text-white rounded-lg hover:bg-lodge-dark font-medium shadow-sm">
          <Plus className="w-4 h-4" />
          New Chapter
        </button>
      </div>

      {/* KPI Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <Building2 className="w-3.5 h-3.5" />
            Total Chapters
          </div>
          <p className="text-2xl font-bold text-ink mt-1">{mockChapters.length}</p>
          <p className="text-xs text-ink-tertiary mt-1">Across {new Set(mockChapters.map((c) => c.country)).size} countries</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <Users className="w-3.5 h-3.5" />
            Total Members
          </div>
          <p className="text-2xl font-bold text-ink mt-1">{totalMembers.toLocaleString()}</p>
          <p className="text-xs text-ink-tertiary mt-1">All chapters combined</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <TrendingUp className="w-3.5 h-3.5" />
            Avg Growth
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {(mockChapters.filter((c) => c.growthRate > 0).reduce((sum, c) => sum + c.growthRate, 0) /
              mockChapters.filter((c) => c.growthRate > 0).length).toFixed(1)}%
          </p>
          <p className="text-xs text-ink-tertiary mt-1">Month-over-month</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <CalendarDays className="w-3.5 h-3.5" />
            Upcoming Events
          </div>
          <p className="text-2xl font-bold text-ink mt-1">{totalUpcoming}</p>
          <p className="text-xs text-ink-tertiary mt-1">Next 30 days</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
        <input
          type="text"
          placeholder="Search chapters..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lodge/30 focus:border-lodge"
        />
      </div>

      {/* Chapter Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredChapters.map((chapter) => {
          const status = statusConfig[chapter.status];
          const flag = flagEmoji[chapter.countryCode] ?? '';

          return (
            <div
              key={chapter.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-lodge/10 text-2xl">
                    {flag}
                  </div>
                  <div>
                    <h3 className="text-base font-semibold text-ink">{chapter.name}</h3>
                    <div className="flex items-center gap-1.5 text-xs text-ink-tertiary">
                      <MapPin className="w-3 h-3" />
                      {chapter.city}, {chapter.country}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                    {status.label}
                  </span>
                  <button className="text-ink-faint hover:text-ink-secondary">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Stats */}
              <div className="mt-5 grid grid-cols-3 gap-3">
                <div className="rounded-lg bg-surface-secondary p-3 text-center">
                  <p className="text-lg font-bold text-ink">{chapter.memberCount}</p>
                  <p className="text-[10px] text-ink-tertiary uppercase tracking-wide">Members</p>
                </div>
                <div className="rounded-lg bg-surface-secondary p-3 text-center">
                  <p className="text-lg font-bold text-emerald-600">
                    {chapter.growthRate > 0 ? `+${chapter.growthRate}%` : '-'}
                  </p>
                  <p className="text-[10px] text-ink-tertiary uppercase tracking-wide">Growth</p>
                </div>
                <div className="rounded-lg bg-surface-secondary p-3 text-center">
                  <p className="text-lg font-bold text-ink">{chapter.upcomingEvents}</p>
                  <p className="text-[10px] text-ink-tertiary uppercase tracking-wide">Events</p>
                </div>
              </div>

              {/* Admin & Details */}
              <div className="mt-4 pt-4 border-t border-slate-100 space-y-2.5">
                <div className="flex items-center gap-2">
                  <Shield className="w-3.5 h-3.5 text-ink-faint" />
                  <span className="text-xs text-ink-tertiary">Admin:</span>
                  <span className="text-xs font-medium text-ink">{chapter.adminName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-ink-faint" />
                  <span className="text-xs text-ink-tertiary">{chapter.adminEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-ink-faint" />
                  <span className="text-xs text-ink-tertiary">Founded {chapter.founded}</span>
                  <span className="text-xs text-ink-faint mx-1">&middot;</span>
                  <span className="text-xs text-ink-tertiary">{chapter.timezone}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5 text-ink-faint" />
                  <span className="text-xs text-ink-tertiary">Last event: {chapter.lastEvent}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="mt-4 pt-4 border-t border-slate-100 flex gap-2">
                <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-medium text-ink-secondary hover:bg-slate-50 transition-colors">
                  <Users className="w-3.5 h-3.5" />
                  View Members
                </button>
                <button className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-2 text-xs font-medium text-ink-secondary hover:bg-slate-50 transition-colors">
                  <ExternalLink className="w-3.5 h-3.5" />
                  Manage
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chapters;
