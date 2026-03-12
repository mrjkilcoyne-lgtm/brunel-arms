import React, { useState } from 'react';
import {
  Store,
  Flame,
  MapPin,
  Users,
  Star,
  Copy,
  Plus,
  Search,
  ArrowUpRight,
  CheckCircle2,
  Clock,
  XCircle,
  Trophy,
  Link2,
  Send,
  BarChart3,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Merchant {
  id: string;
  name: string;
  category: string;
  location: string;
  customers: number;
  pointsEarned: number;
  pointsRedeemed: number;
  status: 'active' | 'pending' | 'suspended';
  joinedDate: string;
  multiplier: number;
}

interface NetworkStats {
  totalMerchants: number;
  sharedTransactions: number;
  settlementDue: string;
  settlementPaid: string;
}

interface Invitation {
  id: string;
  code: string;
  createdAt: string;
  usedBy: string | null;
  status: 'active' | 'used' | 'expired';
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const merchants: Merchant[] = [
  {
    id: '1',
    name: 'The Copper Kettle',
    category: 'Coffee Shop',
    location: '12 High Street, Brunel',
    customers: 843,
    pointsEarned: 124500,
    pointsRedeemed: 41200,
    status: 'active',
    joinedDate: '2025-03-15',
    multiplier: 1.5,
  },
  {
    id: '2',
    name: 'Chapter & Verse Books',
    category: 'Bookstore',
    location: '28 Market Row, Brunel',
    customers: 412,
    pointsEarned: 68300,
    pointsRedeemed: 19800,
    status: 'active',
    joinedDate: '2025-05-22',
    multiplier: 1.0,
  },
  {
    id: '3',
    name: 'The Brunel Arms',
    category: 'Restaurant & Pub',
    location: '1 Station Road, Brunel',
    customers: 1247,
    pointsEarned: 218400,
    pointsRedeemed: 72600,
    status: 'active',
    joinedDate: '2025-01-10',
    multiplier: 2.0,
  },
  {
    id: '4',
    name: 'Iron Bridge Fitness',
    category: 'Gym',
    location: '5 Canal Wharf, Brunel',
    customers: 356,
    pointsEarned: 52100,
    pointsRedeemed: 18400,
    status: 'active',
    joinedDate: '2025-07-01',
    multiplier: 1.0,
  },
  {
    id: '5',
    name: 'Rosemary & Thyme',
    category: 'Hair Salon',
    location: '19 High Street, Brunel',
    customers: 289,
    pointsEarned: 43700,
    pointsRedeemed: 15200,
    status: 'pending',
    joinedDate: '2026-02-28',
    multiplier: 1.0,
  },
];

const networkStats: NetworkStats = {
  totalMerchants: 5,
  sharedTransactions: 3842,
  settlementDue: '£1,247.80',
  settlementPaid: '£8,412.50',
};

const invitations: Invitation[] = [
  { id: '1', code: 'HEARTH-BRN-7X4K', createdAt: '2026-03-01', usedBy: null, status: 'active' },
  { id: '2', code: 'HEARTH-BRN-9M2P', createdAt: '2026-02-15', usedBy: 'Rosemary & Thyme', status: 'used' },
  { id: '3', code: 'HEARTH-BRN-3L8W', createdAt: '2026-01-20', usedBy: null, status: 'expired' },
];

const leaderboard = [
  { rank: 1, name: 'The Brunel Arms', points: 218400, customers: 1247 },
  { rank: 2, name: 'The Copper Kettle', points: 124500, customers: 843 },
  { rank: 3, name: 'Chapter & Verse Books', points: 68300, customers: 412 },
  { rank: 4, name: 'Iron Bridge Fitness', points: 52100, customers: 356 },
  { rank: 5, name: 'Rosemary & Thyme', points: 43700, customers: 289 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusBadge = (status: Merchant['status']) => {
  const map = {
    active: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, cls: 'bg-green-100 text-green-700' },
    pending: { icon: <Clock className="h-3.5 w-3.5" />, cls: 'bg-amber-100 text-amber-700' },
    suspended: { icon: <XCircle className="h-3.5 w-3.5" />, cls: 'bg-red-100 text-red-700' },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      {s.icon}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Merchants: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = merchants.filter(
    (m) =>
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
            <Store className="h-5 w-5 text-hearth" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Merchant Network</h1>
            <p className="text-sm text-gray-500">Hearth Points Network — cross-merchant loyalty</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Send className="h-4 w-4" />
            Invite
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-hearth px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-hearth-dark">
            <Plus className="h-4 w-4" />
            Add Merchant
          </button>
        </div>
      </div>

      {/* Network Stats */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Total Merchants', value: networkStats.totalMerchants.toString(), icon: <Store className="h-4 w-4 text-orange-500" /> },
          { label: 'Shared Transactions', value: networkStats.sharedTransactions.toLocaleString(), icon: <Link2 className="h-4 w-4 text-orange-500" /> },
          { label: 'Settlement Due', value: networkStats.settlementDue, icon: <Clock className="h-4 w-4 text-orange-500" /> },
          { label: 'Total Settled', value: networkStats.settlementPaid, icon: <CheckCircle2 className="h-4 w-4 text-orange-500" /> },
        ].map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {s.icon}
              {s.label}
            </div>
            <p className="mt-1 text-xl font-bold text-gray-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search merchants..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
      </div>

      {/* Merchant Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {filtered.map((m) => (
          <div
            key={m.id}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-base font-semibold text-gray-900">{m.name}</h3>
                <p className="mt-0.5 text-xs text-gray-500">{m.category}</p>
              </div>
              {statusBadge(m.status)}
            </div>

            <div className="mt-3 flex items-center gap-1 text-xs text-gray-500">
              <MapPin className="h-3 w-3" />
              {m.location}
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-bold text-gray-900">{m.customers.toLocaleString()}</p>
                <p className="text-xs text-gray-500">Customers</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">{(m.pointsEarned / 1000).toFixed(1)}k</p>
                <p className="text-xs text-gray-500">Earned</p>
              </div>
              <div>
                <p className="text-lg font-bold text-orange-600">{(m.pointsRedeemed / 1000).toFixed(1)}k</p>
                <p className="text-xs text-gray-500">Redeemed</p>
              </div>
            </div>

            <div className="mt-3 flex items-center justify-between border-t border-gray-100 pt-3">
              <span className="flex items-center gap-1 text-xs text-gray-500">
                <Star className="h-3 w-3 text-orange-400" />
                {m.multiplier}x points
              </span>
              <span className="text-xs text-gray-400">Joined {m.joinedDate}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Cross-Merchant Leaderboard */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Trophy className="h-5 w-5 text-orange-500" />
            <h2 className="text-base font-semibold text-gray-900">Cross-Merchant Leaderboard</h2>
          </div>

          <ul className="mt-4 space-y-2">
            {leaderboard.map((entry) => (
              <li
                key={entry.rank}
                className={`flex items-center justify-between rounded-lg px-3 py-2 ${
                  entry.rank === 1 ? 'bg-orange-50' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold ${
                      entry.rank === 1
                        ? 'bg-orange-500 text-white'
                        : entry.rank === 2
                        ? 'bg-gray-300 text-gray-700'
                        : entry.rank === 3
                        ? 'bg-amber-700 text-white'
                        : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {entry.rank}
                  </span>
                  <span className="text-sm font-medium text-gray-800">{entry.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-gray-500">
                    <Users className="mr-1 inline h-3 w-3" />
                    {entry.customers.toLocaleString()}
                  </span>
                  <span className="font-semibold text-orange-600">
                    {(entry.points / 1000).toFixed(1)}k pts
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Join Code / Invitation Management */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link2 className="h-5 w-5 text-orange-500" />
              <h2 className="text-base font-semibold text-gray-900">Invitation Codes</h2>
            </div>
            <button className="inline-flex items-center gap-1 rounded-md bg-orange-100 px-2.5 py-1 text-xs font-medium text-orange-700 hover:bg-orange-200">
              <Plus className="h-3 w-3" />
              Generate Code
            </button>
          </div>

          <ul className="mt-4 space-y-2">
            {invitations.map((inv) => (
              <li
                key={inv.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-3 py-2.5"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <code className="rounded bg-white px-2 py-0.5 font-mono text-sm text-gray-800">
                      {inv.code}
                    </code>
                    <button
                      className="text-gray-400 hover:text-gray-600"
                      title="Copy code"
                    >
                      <Copy className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">
                    Created {inv.createdAt}
                    {inv.usedBy && <> — Used by <span className="font-medium">{inv.usedBy}</span></>}
                  </p>
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    inv.status === 'active'
                      ? 'bg-green-100 text-green-700'
                      : inv.status === 'used'
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-200 text-gray-500'
                  }`}
                >
                  {inv.status.charAt(0).toUpperCase() + inv.status.slice(1)}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Merchants;
