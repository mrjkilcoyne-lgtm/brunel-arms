import React from 'react';
import {
  Flame,
  Star,
  Award,
  Gift,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  AlertTriangle,
  Sparkles,
  Crown,
  Shield,
  Medal,
  RefreshCw,
  Plus,
  Download,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface KpiCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

interface TierData {
  tier: string;
  count: number;
  pct: number;
  color: string;
  icon: React.ReactNode;
}

interface RfmSegment {
  label: string;
  count: number;
  description: string;
  color: string;
}

interface ActivityItem {
  id: string;
  customer: string;
  action: string;
  points: number;
  type: 'earn' | 'redeem' | 'bonus' | 'expire';
  time: string;
}

interface RewardItem {
  id: string;
  name: string;
  pointsCost: number;
  timesRedeemed: number;
  stock: number | null;
}

interface ExpiryWarning {
  customersAffected: number;
  pointsExpiring: number;
  deadline: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const kpis: KpiCard[] = [
  {
    label: 'Total Points in Circulation',
    value: '1,284,750',
    change: '+8.3%',
    trend: 'up',
    icon: <Star className="h-5 w-5 text-orange-500" />,
  },
  {
    label: 'Active Customers',
    value: '2,847',
    change: '+3.1%',
    trend: 'up',
    icon: <Users className="h-5 w-5 text-orange-500" />,
  },
  {
    label: 'Redemption Rate',
    value: '34.2%',
    change: '-1.4%',
    trend: 'down',
    icon: <Gift className="h-5 w-5 text-orange-500" />,
  },
  {
    label: 'Avg Points per Customer',
    value: '451',
    change: '+5.7%',
    trend: 'up',
    icon: <TrendingUp className="h-5 w-5 text-orange-500" />,
  },
];

const tiers: TierData[] = [
  {
    tier: 'Bronze',
    count: 1842,
    pct: 64.7,
    color: 'bg-amber-700',
    icon: <Shield className="h-4 w-4 text-amber-700" />,
  },
  {
    tier: 'Silver',
    count: 714,
    pct: 25.1,
    color: 'bg-gray-400',
    icon: <Medal className="h-4 w-4 text-gray-400" />,
  },
  {
    tier: 'Gold',
    count: 248,
    pct: 8.7,
    color: 'bg-yellow-500',
    icon: <Award className="h-4 w-4 text-yellow-500" />,
  },
  {
    tier: 'Platinum',
    count: 43,
    pct: 1.5,
    color: 'bg-orange-500',
    icon: <Crown className="h-4 w-4 text-orange-500" />,
  },
];

const rfmSegments: RfmSegment[] = [
  { label: 'Regulars', count: 1124, description: 'Visit 3+ times/month, high spend', color: 'border-green-500 bg-green-50' },
  { label: 'At-risk', count: 387, description: 'No visit in 30-60 days, previously active', color: 'border-amber-500 bg-amber-50' },
  { label: 'Lapsed', count: 562, description: 'No visit in 60+ days', color: 'border-red-500 bg-red-50' },
  { label: 'New', count: 774, description: 'Enrolled in last 30 days', color: 'border-blue-500 bg-blue-50' },
];

const recentActivity: ActivityItem[] = [
  { id: '1', customer: 'Emma Thompson', action: 'Earned points — Coffee purchase', points: 45, type: 'earn', time: '2 min ago' },
  { id: '2', customer: 'James Wilson', action: 'Redeemed — Free flat white', points: -200, type: 'redeem', time: '8 min ago' },
  { id: '3', customer: 'Sophie Brown', action: 'Birthday bonus applied', points: 100, type: 'bonus', time: '15 min ago' },
  { id: '4', customer: 'Oliver Davies', action: 'Earned points — Lunch set', points: 85, type: 'earn', time: '22 min ago' },
  { id: '5', customer: 'Charlotte Evans', action: 'Points expired (90-day)', points: -150, type: 'expire', time: '1 hr ago' },
  { id: '6', customer: 'Harry Clarke', action: 'Tier upgrade to Silver', points: 0, type: 'bonus', time: '2 hr ago' },
  { id: '7', customer: 'Amelia Roberts', action: 'Redeemed — 10% off next visit', points: -350, type: 'redeem', time: '3 hr ago' },
];

const rewardCatalogue: RewardItem[] = [
  { id: '1', name: 'Free flat white', pointsCost: 200, timesRedeemed: 342, stock: null },
  { id: '2', name: '10% off next visit', pointsCost: 350, timesRedeemed: 218, stock: null },
  { id: '3', name: 'Free pastry', pointsCost: 150, timesRedeemed: 189, stock: null },
  { id: '4', name: 'Branded tote bag', pointsCost: 800, timesRedeemed: 47, stock: 23 },
  { id: '5', name: 'Sunday roast for two', pointsCost: 1500, timesRedeemed: 12, stock: null },
];

const expiryWarnings: ExpiryWarning[] = [
  { customersAffected: 124, pointsExpiring: 38400, deadline: '31 Mar 2026' },
  { customersAffected: 89, pointsExpiring: 22150, deadline: '30 Apr 2026' },
];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Loyalty: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
            <Flame className="h-5 w-5 text-hearth" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Loyalty Engine</h1>
            <p className="text-sm text-gray-500">Points, tiers and reward management</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-hearth px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-hearth-dark">
            <Plus className="h-4 w-4" />
            New Reward
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">{kpi.label}</span>
              {kpi.icon}
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-2xl font-bold text-gray-900">{kpi.value}</span>
              <span
                className={`mb-0.5 flex items-center text-xs font-medium ${
                  kpi.trend === 'up' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {kpi.trend === 'up' ? (
                  <ArrowUpRight className="mr-0.5 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-0.5 h-3 w-3" />
                )}
                {kpi.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Tier Breakdown */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-1">
          <h2 className="text-base font-semibold text-gray-900">Tier Breakdown</h2>
          <p className="mt-0.5 text-xs text-gray-500">2,847 active members</p>

          <div className="mt-4 flex h-4 w-full overflow-hidden rounded-full">
            {tiers.map((t) => (
              <div
                key={t.tier}
                className={`${t.color} h-full`}
                style={{ width: `${t.pct}%` }}
                title={`${t.tier}: ${t.pct}%`}
              />
            ))}
          </div>

          <ul className="mt-4 space-y-3">
            {tiers.map((t) => (
              <li key={t.tier} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  {t.icon}
                  <span className="font-medium text-gray-700">{t.tier}</span>
                </span>
                <span className="text-gray-500">
                  {t.count.toLocaleString()} <span className="text-xs">({t.pct}%)</span>
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* RFM Segments */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm lg:col-span-2">
          <h2 className="text-base font-semibold text-gray-900">Customer Segments (RFM)</h2>
          <p className="mt-0.5 text-xs text-gray-500">Recency, Frequency, Monetary analysis</p>

          <div className="mt-4 grid grid-cols-2 gap-3">
            {rfmSegments.map((s) => (
              <div
                key={s.label}
                className={`rounded-lg border-l-4 p-4 ${s.color}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-gray-800">{s.label}</span>
                  <span className="text-lg font-bold text-gray-900">{s.count.toLocaleString()}</span>
                </div>
                <p className="mt-1 text-xs text-gray-600">{s.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Activity */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Recent Activity</h2>
            <button className="text-xs font-medium text-hearth hover:underline">View all</button>
          </div>

          <ul className="mt-4 divide-y divide-gray-100">
            {recentActivity.map((a) => (
              <li key={a.id} className="flex items-center justify-between py-2.5">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-gray-800">{a.customer}</p>
                  <p className="truncate text-xs text-gray-500">{a.action}</p>
                </div>
                <div className="ml-4 flex flex-col items-end">
                  <span
                    className={`text-sm font-semibold ${
                      a.type === 'earn' || a.type === 'bonus'
                        ? 'text-green-600'
                        : a.type === 'redeem'
                        ? 'text-orange-600'
                        : 'text-red-500'
                    }`}
                  >
                    {a.points > 0 ? '+' : ''}
                    {a.points} pts
                  </span>
                  <span className="text-xs text-gray-400">{a.time}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Reward Catalogue Summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold text-gray-900">Reward Catalogue</h2>
            <button className="inline-flex items-center gap-1 text-xs font-medium text-hearth hover:underline">
              <RefreshCw className="h-3 w-3" />
              Manage
            </button>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-medium text-gray-500">
                <tr>
                  <th className="px-3 py-2">Reward</th>
                  <th className="px-3 py-2 text-right">Cost</th>
                  <th className="px-3 py-2 text-right">Redeemed</th>
                  <th className="px-3 py-2 text-right">Stock</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rewardCatalogue.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-800">{r.name}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{r.pointsCost} pts</td>
                    <td className="px-3 py-2 text-right text-gray-600">{r.timesRedeemed}</td>
                    <td className="px-3 py-2 text-right text-gray-500">
                      {r.stock !== null ? r.stock : <span className="text-xs italic">unlimited</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Points Expiry Warnings */}
        <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <h2 className="text-base font-semibold text-amber-800">Points Expiry Warnings</h2>
          </div>

          <ul className="mt-4 space-y-3">
            {expiryWarnings.map((w, i) => (
              <li key={i} className="rounded-lg bg-white p-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800">
                      {w.customersAffected} customers — {w.pointsExpiring.toLocaleString()} pts expiring
                    </p>
                    <p className="text-xs text-gray-500">
                      <Clock className="mr-1 inline h-3 w-3" />
                      Deadline: {w.deadline}
                    </p>
                  </div>
                  <button className="rounded-md border border-amber-300 bg-amber-100 px-2 py-1 text-xs font-medium text-amber-700 hover:bg-amber-200">
                    Notify
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* AI Reward Suggestions */}
        <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-orange-500" />
            <h2 className="text-base font-semibold text-gray-900">AI Reward Suggestions</h2>
          </div>
          <p className="mt-1 text-xs text-gray-500">Based on 90-day spending patterns and redemption behaviour</p>

          <ul className="mt-4 space-y-3">
            <li className="rounded-lg border border-orange-100 bg-white p-3">
              <p className="text-sm font-medium text-gray-800">
                Launch "Weekday Morning Boost" — 2x points on coffee before 10 am
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Predicted uplift: +12% morning footfall. 387 customers match the target segment.
              </p>
            </li>
            <li className="rounded-lg border border-orange-100 bg-white p-3">
              <p className="text-sm font-medium text-gray-800">
                Introduce "Bring a Friend" referral reward — 250 pts per signup
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Your Regulars segment has 3.2 avg social connections in the network. Estimated 140 new sign-ups.
              </p>
            </li>
            <li className="rounded-lg border border-orange-100 bg-white p-3">
              <p className="text-sm font-medium text-gray-800">
                Re-engage Lapsed tier with "We miss you — 100 bonus pts" push
              </p>
              <p className="mt-1 text-xs text-gray-500">
                562 lapsed customers. Win-back campaigns historically recover 18% within 14 days.
              </p>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Loyalty;
