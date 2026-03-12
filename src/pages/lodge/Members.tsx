import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  UserPlus,
  Upload,
  MoreHorizontal,
  Users,
  UserCheck,
  AlertTriangle,
  UserX,
  ChevronDown,
  Mail,
  Phone,
  CheckSquare,
  Download,
  Trash2,
  Tag,
} from 'lucide-react';
import type { UUID, ISODate } from '../../types';

// ---------------------------------------------------------------------------
// Local types
// ---------------------------------------------------------------------------

type MemberType = 'individual' | 'family' | 'corporate' | 'student';
type MemberStatus = 'active' | 'expiring' | 'expired' | 'cancelled';

interface Member {
  id: UUID;
  name: string;
  email: string;
  phone: string;
  avatar?: string;
  type: MemberType;
  status: MemberStatus;
  memberNumber: string;
  joinDate: ISODate;
  renewalDate: ISODate;
  chapter: string;
  tags: string[];
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_MEMBERS: Member[] = [
  {
    id: '1',
    name: 'Eleanor Whitfield',
    email: 'e.whitfield@brunel.co.uk',
    phone: '+44 7700 900123',
    type: 'individual',
    status: 'active',
    memberNumber: 'LDG-0012',
    joinDate: '2023-03-15',
    renewalDate: '2026-03-15',
    chapter: 'London HQ',
    tags: ['Founding', 'Board'],
  },
  {
    id: '2',
    name: 'James Harrington',
    email: 'j.harrington@canmail.ca',
    phone: '+1 416 555 0199',
    type: 'corporate',
    status: 'active',
    memberNumber: 'LDG-0034',
    joinDate: '2023-06-01',
    renewalDate: '2026-06-01',
    chapter: 'Toronto',
    tags: ['Corporate Partner'],
  },
  {
    id: '3',
    name: 'Sophie Chen-Murray',
    email: 's.chenmurray@outlook.com.au',
    phone: '+61 412 345 678',
    type: 'family',
    status: 'expiring',
    memberNumber: 'LDG-0058',
    joinDate: '2024-01-10',
    renewalDate: '2026-04-10',
    chapter: 'Melbourne',
    tags: ['Family'],
  },
  {
    id: '4',
    name: 'Ravi Kapoor',
    email: 'ravi.kapoor@sgmail.sg',
    phone: '+65 9123 4567',
    type: 'individual',
    status: 'active',
    memberNumber: 'LDG-0071',
    joinDate: '2024-05-22',
    renewalDate: '2026-05-22',
    chapter: 'Singapore',
    tags: ['Committee'],
  },
  {
    id: '5',
    name: 'Amelia Blackwood',
    email: 'a.blackwood@xtra.co.nz',
    phone: '+64 21 555 0088',
    type: 'student',
    status: 'active',
    memberNumber: 'LDG-0093',
    joinDate: '2025-09-01',
    renewalDate: '2026-09-01',
    chapter: 'Auckland',
    tags: ['Student', 'Volunteer'],
  },
  {
    id: '6',
    name: 'Oliver Trent',
    email: 'oliver.trent@btinternet.co.uk',
    phone: '+44 7911 123456',
    type: 'individual',
    status: 'expired',
    memberNumber: 'LDG-0015',
    joinDate: '2022-11-05',
    renewalDate: '2025-11-05',
    chapter: 'London HQ',
    tags: [],
  },
  {
    id: '7',
    name: 'Grace Nguyen',
    email: 'g.nguyen@bigpond.com.au',
    phone: '+61 498 765 432',
    type: 'individual',
    status: 'active',
    memberNumber: 'LDG-0102',
    joinDate: '2025-01-14',
    renewalDate: '2027-01-14',
    chapter: 'Melbourne',
    tags: ['Events'],
  },
  {
    id: '8',
    name: 'William Drummond',
    email: 'w.drummond@rogers.ca',
    phone: '+1 604 555 0177',
    type: 'corporate',
    status: 'cancelled',
    memberNumber: 'LDG-0044',
    joinDate: '2023-08-20',
    renewalDate: '2025-08-20',
    chapter: 'Toronto',
    tags: ['Corporate Partner'],
  },
  {
    id: '9',
    name: 'Isla Mackenzie',
    email: 'isla.m@proton.me',
    phone: '+44 7456 789012',
    type: 'family',
    status: 'active',
    memberNumber: 'LDG-0118',
    joinDate: '2025-06-30',
    renewalDate: '2026-06-30',
    chapter: 'London HQ',
    tags: ['Family', 'Newsletter'],
  },
  {
    id: '10',
    name: 'Marcus Tan',
    email: 'm.tan@singnet.sg',
    phone: '+65 8234 5678',
    type: 'student',
    status: 'expiring',
    memberNumber: 'LDG-0125',
    joinDate: '2025-04-01',
    renewalDate: '2026-04-01',
    chapter: 'Singapore',
    tags: ['Student'],
  },
];

const CHAPTERS = ['All Chapters', 'London HQ', 'Melbourne', 'Toronto', 'Auckland', 'Singapore'];
const TYPES: { label: string; value: MemberType | 'all' }[] = [
  { label: 'All Types', value: 'all' },
  { label: 'Individual', value: 'individual' },
  { label: 'Family', value: 'family' },
  { label: 'Corporate', value: 'corporate' },
  { label: 'Student', value: 'student' },
];
const STATUSES: { label: string; value: MemberStatus | 'all' }[] = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Active', value: 'active' },
  { label: 'Expiring', value: 'expiring' },
  { label: 'Expired', value: 'expired' },
  { label: 'Cancelled', value: 'cancelled' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusBadge = (status: MemberStatus) => {
  const map: Record<MemberStatus, { bg: string; text: string; label: string }> = {
    active: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Active' },
    expiring: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Expiring' },
    expired: { bg: 'bg-red-100', text: 'text-red-700', label: 'Expired' },
    cancelled: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Cancelled' },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${s.bg} ${s.text}`}>
      {s.label}
    </span>
  );
};

const typeBadge = (type: MemberType) => {
  const colours: Record<MemberType, string> = {
    individual: 'bg-emerald-50 text-emerald-700 ring-emerald-600/20',
    family: 'bg-sky-50 text-sky-700 ring-sky-600/20',
    corporate: 'bg-violet-50 text-violet-700 ring-violet-600/20',
    student: 'bg-orange-50 text-orange-700 ring-orange-600/20',
  };
  return (
    <span className={`inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset ${colours[type]}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

const formatDate = (d: ISODate) =>
  new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Members: React.FC = () => {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<MemberType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<MemberStatus | 'all'>('all');
  const [filterChapter, setFilterChapter] = useState('All Chapters');
  const [selected, setSelected] = useState<Set<UUID>>(new Set());

  const filtered = useMemo(() => {
    return MOCK_MEMBERS.filter((m) => {
      const q = search.toLowerCase();
      if (q && !m.name.toLowerCase().includes(q) && !m.email.toLowerCase().includes(q) && !m.memberNumber.toLowerCase().includes(q)) return false;
      if (filterType !== 'all' && m.type !== filterType) return false;
      if (filterStatus !== 'all' && m.status !== filterStatus) return false;
      if (filterChapter !== 'All Chapters' && m.chapter !== filterChapter) return false;
      return true;
    });
  }, [search, filterType, filterStatus, filterChapter]);

  const stats = useMemo(() => {
    const active = MOCK_MEMBERS.filter((m) => m.status === 'active').length;
    const newThisMonth = MOCK_MEMBERS.filter((m) => {
      const d = new Date(m.joinDate);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;
    const expiring = MOCK_MEMBERS.filter((m) => m.status === 'expiring').length;
    const lapsed = MOCK_MEMBERS.filter((m) => m.status === 'expired').length;
    return { active, newThisMonth, expiring, lapsed };
  }, []);

  const toggleSelect = (id: UUID) =>
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleAll = () => {
    if (selected.size === filtered.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(filtered.map((m) => m.id)));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your membership directory</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Upload className="h-4 w-4" />
            Import
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">
            <UserPlus className="h-4 w-4" />
            Add Member
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Total Active', value: stats.active, icon: Users, colour: 'text-emerald-600 bg-emerald-50' },
          { label: 'New This Month', value: stats.newThisMonth, icon: UserCheck, colour: 'text-sky-600 bg-sky-50' },
          { label: 'Expiring Soon', value: stats.expiring, icon: AlertTriangle, colour: 'text-amber-600 bg-amber-50' },
          { label: 'Lapsed', value: stats.lapsed, icon: UserX, colour: 'text-red-600 bg-red-50' },
        ].map((s) => (
          <div key={s.label} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${s.colour}`}>
              <s.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{s.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
          />
        </div>

        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value as MemberType | 'all')}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {TYPES.map((t) => (
            <option key={t.value} value={t.value}>{t.label}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as MemberStatus | 'all')}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>

        <select
          value={filterChapter}
          onChange={(e) => setFilterChapter(e.target.value)}
          className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
        >
          {CHAPTERS.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
          <Filter className="h-4 w-4" />
          More Filters
        </button>
      </div>

      {/* Bulk actions */}
      {selected.size > 0 && (
        <div className="flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm">
          <span className="font-medium text-emerald-800">{selected.size} selected</span>
          <div className="ml-auto flex items-center gap-2">
            <button className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <Mail className="h-3.5 w-3.5" /> Email
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <Tag className="h-3.5 w-3.5" /> Tag
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
              <Download className="h-3.5 w-3.5" /> Export
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-red-600 shadow-sm ring-1 ring-inset ring-red-200 hover:bg-red-50">
              <Trash2 className="h-3.5 w-3.5" /> Remove
            </button>
          </div>
        </div>
      )}

      {/* Table */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-10 px-4 py-3">
                <input
                  type="checkbox"
                  checked={selected.size === filtered.length && filtered.length > 0}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                />
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Member</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Chapter</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Join Date</th>
              <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Renewal</th>
              <th className="w-10 px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map((m) => (
              <tr key={m.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selected.has(m.id)}
                    onChange={() => toggleSelect(m.id)}
                    className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-700">
                      {m.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">{typeBadge(m.type)}</td>
                <td className="px-4 py-3">{statusBadge(m.status)}</td>
                <td className="px-4 py-3 text-sm text-gray-700">{m.chapter}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(m.joinDate)}</td>
                <td className="px-4 py-3 text-sm text-gray-500">{formatDate(m.renewalDate)}</td>
                <td className="px-4 py-3 text-right">
                  <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="px-4 py-12 text-center text-sm text-gray-500">
                  No members match your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer count */}
      <p className="text-xs text-gray-500">
        Showing {filtered.length} of {MOCK_MEMBERS.length} members
      </p>
    </div>
  );
};

export default Members;
