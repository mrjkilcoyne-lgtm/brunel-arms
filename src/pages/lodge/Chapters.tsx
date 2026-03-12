import React, { useState } from 'react';
import {
  Plus,
  MapPin,
  Users,
  UserCircle,
  ArrowRightLeft,
  Building2,
  ChevronRight,
  Globe,
  MoreHorizontal,
  Search,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ChapterStatus = 'active' | 'forming' | 'inactive';

interface Chapter {
  id: string;
  name: string;
  region: string;
  country: string;
  location: string;
  memberCount: number;
  admin: string;
  adminEmail: string;
  status: ChapterStatus;
  meetingSchedule: string;
  founded: string;
  parentId?: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_CHAPTERS: Chapter[] = [
  {
    id: '1',
    name: 'London HQ',
    region: 'United Kingdom',
    country: 'GB',
    location: 'London, England',
    memberCount: 186,
    admin: 'Eleanor Whitfield',
    adminEmail: 'e.whitfield@brunel.co.uk',
    status: 'active',
    meetingSchedule: 'Last Tuesday of each month',
    founded: '2022-03-01',
  },
  {
    id: '2',
    name: 'Melbourne',
    region: 'Australia',
    country: 'AU',
    location: 'Melbourne, Victoria',
    memberCount: 94,
    admin: 'Grace Nguyen',
    adminEmail: 'g.nguyen@bigpond.com.au',
    status: 'active',
    meetingSchedule: 'First Wednesday of each month',
    founded: '2023-01-15',
  },
  {
    id: '3',
    name: 'Toronto',
    region: 'Canada',
    country: 'CA',
    location: 'Toronto, Ontario',
    memberCount: 112,
    admin: 'James Harrington',
    adminEmail: 'j.harrington@canmail.ca',
    status: 'active',
    meetingSchedule: 'Second Thursday of each month',
    founded: '2023-04-01',
  },
  {
    id: '4',
    name: 'Auckland',
    region: 'New Zealand',
    country: 'NZ',
    location: 'Auckland, North Island',
    memberCount: 47,
    admin: 'Amelia Blackwood',
    adminEmail: 'a.blackwood@xtra.co.nz',
    status: 'active',
    meetingSchedule: 'Third Friday of each month',
    founded: '2023-09-01',
  },
  {
    id: '5',
    name: 'Singapore',
    region: 'Singapore',
    country: 'SG',
    location: 'Singapore',
    memberCount: 38,
    admin: 'Ravi Kapoor',
    adminEmail: 'ravi.kapoor@sgmail.sg',
    status: 'active',
    meetingSchedule: 'First Monday of each month',
    founded: '2024-02-01',
  },
  {
    id: '6',
    name: 'Vancouver',
    region: 'Canada',
    country: 'CA',
    location: 'Vancouver, British Columbia',
    memberCount: 12,
    admin: 'TBD',
    adminEmail: '',
    status: 'forming',
    meetingSchedule: 'TBD',
    founded: '2026-01-15',
    parentId: '3',
  },
  {
    id: '7',
    name: 'Sydney',
    region: 'Australia',
    country: 'AU',
    location: 'Sydney, New South Wales',
    memberCount: 0,
    admin: 'TBD',
    adminEmail: '',
    status: 'inactive',
    meetingSchedule: 'TBD',
    founded: '2025-06-01',
    parentId: '2',
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusConfig: Record<ChapterStatus, { icon: React.ElementType; bg: string; text: string; label: string }> = {
  active: { icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Active' },
  forming: { icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700', label: 'Forming' },
  inactive: { icon: AlertCircle, bg: 'bg-gray-100', text: 'text-gray-500', label: 'Inactive' },
};

const countryFlags: Record<string, string> = {
  GB: '🇬🇧',
  AU: '🇦🇺',
  CA: '🇨🇦',
  NZ: '🇳🇿',
  SG: '🇸🇬',
};

const totalMembers = MOCK_CHAPTERS.reduce((s, c) => s + c.memberCount, 0);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Chapters: React.FC = () => {
  const [search, setSearch] = useState('');
  const [transferOpen, setTransferOpen] = useState(false);

  const filtered = search
    ? MOCK_CHAPTERS.filter(
        (c) =>
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.region.toLowerCase().includes(search.toLowerCase()) ||
          c.location.toLowerCase().includes(search.toLowerCase()),
      )
    : MOCK_CHAPTERS;

  const primary = filtered.filter((c) => !c.parentId);
  const sub = filtered.filter((c) => !!c.parentId);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Chapters</h1>
          <p className="mt-1 text-sm text-gray-500">Manage regional branches and chapter administration</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTransferOpen(true)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <ArrowRightLeft className="h-4 w-4" />
            Transfer Member
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">
            <Plus className="h-4 w-4" />
            New Chapter
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
            <Building2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Chapters</p>
            <p className="text-2xl font-semibold text-gray-900">{MOCK_CHAPTERS.length}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Members</p>
            <p className="text-2xl font-semibold text-gray-900">{totalMembers}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-amber-50 text-amber-600">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Countries</p>
            <p className="text-2xl font-semibold text-gray-900">{new Set(MOCK_CHAPTERS.map((c) => c.country)).size}</p>
          </div>
        </div>
      </div>

      {/* Map placeholder */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Chapter Locations</h2>
        </div>
        <div className="flex h-56 items-center justify-center bg-gray-50">
          <div className="text-center">
            <Globe className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-2 text-sm text-gray-400">Interactive map view</p>
            <p className="text-xs text-gray-400">Map integration will render here</p>
          </div>
        </div>
        {/* Inline location chips */}
        <div className="flex flex-wrap gap-2 px-6 py-3 border-t border-gray-100">
          {MOCK_CHAPTERS.filter((c) => c.status === 'active').map((c) => (
            <span key={c.id} className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
              <span>{countryFlags[c.country] || ''}</span>
              {c.name}
              <span className="text-emerald-500">&middot; {c.memberCount}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search chapters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        />
      </div>

      {/* Chapter hierarchy */}
      <div className="space-y-3">
        <h2 className="text-base font-semibold text-gray-900">Chapter Hierarchy</h2>

        {/* Primary chapters */}
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {primary.map((c) => {
            const st = statusConfig[c.status];
            const children = sub.filter((s) => s.parentId === c.id);
            return (
              <div key={c.id} className="rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md">
                <div className="p-5">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-lg">
                        {countryFlags[c.country] || <Building2 className="h-5 w-5 text-emerald-700" />}
                      </div>
                      <div>
                        <h3 className="text-base font-semibold text-gray-900">{c.name}</h3>
                        <p className="text-xs text-gray-500">{c.location}</p>
                      </div>
                    </div>
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${st.bg} ${st.text}`}>
                      <st.icon className="h-3 w-3" /> {st.label}
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs text-gray-400">Members</p>
                      <p className="text-lg font-semibold text-gray-900">{c.memberCount}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-400">Admin</p>
                      <p className="text-sm font-medium text-gray-900 truncate">{c.admin}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-xs text-gray-400">Meeting Schedule</p>
                    <p className="text-sm text-gray-700">{c.meetingSchedule}</p>
                  </div>

                  {/* Sub-chapters */}
                  {children.length > 0 && (
                    <div className="mt-4 border-t border-gray-100 pt-3">
                      <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-2">Sub-Chapters</p>
                      {children.map((sc) => {
                        const sst = statusConfig[sc.status];
                        return (
                          <div key={sc.id} className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2 mb-1.5 last:mb-0">
                            <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
                            <span className="text-sm font-medium text-gray-800">{sc.name}</span>
                            <span className={`ml-auto inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${sst.bg} ${sst.text}`}>
                              {sst.label}
                            </span>
                            <span className="text-xs text-gray-500">{sc.memberCount} members</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-gray-100 px-5 py-3">
                  <p className="text-xs text-gray-400">
                    Founded {new Date(c.founded).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
                  </p>
                  <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Transfer modal */}
      {transferOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900">Inter-Chapter Transfer</h2>
            <p className="mt-1 text-sm text-gray-500">Move a member from one chapter to another.</p>

            <div className="mt-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Member</label>
                <input
                  type="text"
                  placeholder="Search member name or number..."
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">From Chapter</label>
                  <select className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option value="">Select...</option>
                    {MOCK_CHAPTERS.filter((c) => c.status === 'active').map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">To Chapter</label>
                  <select className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500">
                    <option value="">Select...</option>
                    {MOCK_CHAPTERS.filter((c) => c.status === 'active').map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reason (optional)</label>
                <textarea
                  rows={2}
                  placeholder="e.g. Member relocating to Toronto..."
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setTransferOpen(false)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setTransferOpen(false)}
                className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                <ArrowRightLeft className="h-4 w-4" />
                Transfer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chapters;
