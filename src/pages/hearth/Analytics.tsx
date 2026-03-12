import React from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  PoundSterling,
  ShoppingCart,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Gift,
  Flame,
  Calendar,
  Download,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RealtimeStat {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
  icon: React.ReactNode;
}

interface RevenueBar {
  day: string;
  amount: number;
}

interface CohortRow {
  cohort: string;
  months: number[];
}

interface HeatmapCell {
  day: string;
  hours: number[];
}

interface RewardROI {
  reward: string;
  cost: string;
  revenueGenerated: string;
  roi: string;
  positive: boolean;
}

interface PeriodComparison {
  metric: string;
  thisPeriod: string;
  lastPeriod: string;
  change: string;
  trend: 'up' | 'down';
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const realtimeStats: RealtimeStat[] = [
  { label: "Today's Revenue", value: '£1,247.50', change: '+14.2%', trend: 'up', icon: <PoundSterling className="h-5 w-5 text-orange-500" /> },
  { label: 'Transactions', value: '84', change: '+8.1%', trend: 'up', icon: <ShoppingCart className="h-5 w-5 text-orange-500" /> },
  { label: 'New Customers', value: '12', change: '-3.2%', trend: 'down', icon: <Users className="h-5 w-5 text-orange-500" /> },
];

const revenueBars: RevenueBar[] = [
  { day: 'Mon', amount: 1120 },
  { day: 'Tue', amount: 890 },
  { day: 'Wed', amount: 1340 },
  { day: 'Thu', amount: 1560 },
  { day: 'Fri', amount: 1890 },
  { day: 'Sat', amount: 2010 },
  { day: 'Sun', amount: 1680 },
];

const maxRevenue = Math.max(...revenueBars.map((r) => r.amount));

const cohorts: CohortRow[] = [
  { cohort: 'Jan 2026', months: [100, 72, 58] },
  { cohort: 'Feb 2026', months: [100, 68] },
  { cohort: 'Mar 2026', months: [100] },
];

const heatmapDays: HeatmapCell[] = [
  { day: 'Mon', hours: [2, 4, 12, 28, 35, 22, 18, 30, 42, 38, 24, 10] },
  { day: 'Tue', hours: [1, 3, 10, 22, 30, 20, 16, 28, 36, 32, 20, 8] },
  { day: 'Wed', hours: [2, 5, 14, 30, 38, 26, 20, 34, 44, 40, 28, 12] },
  { day: 'Thu', hours: [3, 6, 16, 32, 40, 28, 22, 36, 48, 44, 30, 14] },
  { day: 'Fri', hours: [4, 8, 18, 36, 44, 32, 26, 40, 52, 50, 38, 20] },
  { day: 'Sat', hours: [6, 10, 24, 42, 50, 38, 30, 44, 56, 52, 42, 24] },
  { day: 'Sun', hours: [5, 8, 20, 38, 44, 34, 28, 38, 46, 40, 32, 16] },
];

const heatmapHours = ['8a', '9a', '10a', '11a', '12p', '1p', '2p', '3p', '4p', '5p', '6p', '7p'];
const heatmapMax = 56;

const rewardROI: RewardROI[] = [
  { reward: 'Free flat white', cost: '£342', revenueGenerated: '£1,890', roi: '+452%', positive: true },
  { reward: '10% off next visit', cost: '£654', revenueGenerated: '£2,410', roi: '+268%', positive: true },
  { reward: 'Free pastry', cost: '£189', revenueGenerated: '£940', roi: '+397%', positive: true },
  { reward: 'Branded tote bag', cost: '£235', revenueGenerated: '£280', roi: '+19%', positive: true },
  { reward: 'Sunday roast for two', cost: '£360', revenueGenerated: '£420', roi: '+17%', positive: true },
];

const basketValues: { month: string; value: number }[] = [
  { month: 'Oct', value: 14.2 },
  { month: 'Nov', value: 14.8 },
  { month: 'Dec', value: 16.5 },
  { month: 'Jan', value: 15.1 },
  { month: 'Feb', value: 15.6 },
  { month: 'Mar', value: 16.2 },
];

const periodComparison: PeriodComparison[] = [
  { metric: 'Revenue', thisPeriod: '£12,480', lastPeriod: '£11,230', change: '+11.1%', trend: 'up' },
  { metric: 'Transactions', thisPeriod: '847', lastPeriod: '792', change: '+6.9%', trend: 'up' },
  { metric: 'New Customers', thisPeriod: '124', lastPeriod: '138', change: '-10.1%', trend: 'down' },
  { metric: 'Avg Basket Value', thisPeriod: '£16.20', lastPeriod: '£15.60', change: '+3.8%', trend: 'up' },
  { metric: 'Points Issued', thisPeriod: '42,350', lastPeriod: '38,900', change: '+8.9%', trend: 'up' },
  { metric: 'Redemptions', thisPeriod: '218', lastPeriod: '195', change: '+11.8%', trend: 'up' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const heatColor = (val: number): string => {
  const pct = val / heatmapMax;
  if (pct >= 0.8) return 'bg-orange-600 text-white';
  if (pct >= 0.6) return 'bg-orange-400 text-white';
  if (pct >= 0.4) return 'bg-orange-300 text-orange-900';
  if (pct >= 0.2) return 'bg-orange-200 text-orange-800';
  return 'bg-orange-50 text-orange-600';
};

const cohortColor = (val: number): string => {
  if (val >= 80) return 'bg-green-500 text-white';
  if (val >= 60) return 'bg-green-400 text-white';
  if (val >= 40) return 'bg-amber-400 text-white';
  return 'bg-red-400 text-white';
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Analytics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
            <BarChart3 className="h-5 w-5 text-hearth" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
            <p className="text-sm text-gray-500">Merchant performance and customer insights</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <select className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
            <option>This year</option>
          </select>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Real-time Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {realtimeStats.map((s) => (
          <div key={s.label} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-500">{s.label}</span>
              {s.icon}
            </div>
            <div className="mt-3 flex items-end gap-2">
              <span className="text-2xl font-bold text-gray-900">{s.value}</span>
              <span
                className={`mb-0.5 flex items-center text-xs font-medium ${
                  s.trend === 'up' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {s.trend === 'up' ? (
                  <ArrowUpRight className="mr-0.5 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-0.5 h-3 w-3" />
                )}
                {s.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Trend (Tailwind Bar Chart) */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-gray-900">Revenue Trend</h2>
            <p className="text-xs text-gray-500">This week — daily totals</p>
          </div>
          <TrendingUp className="h-5 w-5 text-orange-500" />
        </div>

        <div className="mt-6 flex items-end gap-3" style={{ height: 180 }}>
          {revenueBars.map((b) => {
            const pct = (b.amount / maxRevenue) * 100;
            return (
              <div key={b.day} className="flex flex-1 flex-col items-center">
                <span className="mb-1 text-xs font-medium text-gray-700">
                  £{(b.amount / 1000).toFixed(1)}k
                </span>
                <div
                  className="w-full rounded-t-md bg-gradient-to-t from-orange-500 to-orange-300 transition-all"
                  style={{ height: `${pct}%` }}
                />
                <span className="mt-2 text-xs text-gray-500">{b.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Customer Cohort Retention */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Customer Cohort Retention</h2>
          <p className="mt-0.5 text-xs text-gray-500">% of customers returning each month</p>

          <div className="mt-4 overflow-hidden rounded-lg">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-xs text-gray-500">
                  <th className="px-3 py-2 text-left font-medium">Cohort</th>
                  <th className="px-3 py-2 text-center font-medium">Month 1</th>
                  <th className="px-3 py-2 text-center font-medium">Month 2</th>
                  <th className="px-3 py-2 text-center font-medium">Month 3</th>
                </tr>
              </thead>
              <tbody>
                {cohorts.map((c) => (
                  <tr key={c.cohort}>
                    <td className="px-3 py-2 text-sm font-medium text-gray-700">{c.cohort}</td>
                    {[0, 1, 2].map((i) => (
                      <td key={i} className="px-3 py-1 text-center">
                        {c.months[i] !== undefined ? (
                          <span
                            className={`inline-block rounded px-3 py-1 text-xs font-bold ${cohortColor(c.months[i])}`}
                          >
                            {c.months[i]}%
                          </span>
                        ) : (
                          <span className="text-xs text-gray-300">—</span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Busiest Hours Heatmap */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-orange-500" />
            <h2 className="text-base font-semibold text-gray-900">Busiest Hours</h2>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">Transactions per hour (this week)</p>

          <div className="mt-4 overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="w-10" />
                  {heatmapHours.map((h) => (
                    <th key={h} className="px-1 py-1 text-center text-[10px] font-medium text-gray-500">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapDays.map((row) => (
                  <tr key={row.day}>
                    <td className="pr-2 text-right text-xs font-medium text-gray-600">{row.day}</td>
                    {row.hours.map((val, i) => (
                      <td key={i} className="p-0.5">
                        <div
                          className={`flex h-7 w-full items-center justify-center rounded text-[10px] font-semibold ${heatColor(val)}`}
                        >
                          {val}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Reward ROI */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Gift className="h-5 w-5 text-orange-500" />
            <h2 className="text-base font-semibold text-gray-900">Reward ROI Breakdown</h2>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">Reward</th>
                  <th className="px-3 py-2 text-right">Cost</th>
                  <th className="px-3 py-2 text-right">Revenue</th>
                  <th className="px-3 py-2 text-right">ROI</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {rewardROI.map((r) => (
                  <tr key={r.reward} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-800">{r.reward}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{r.cost}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{r.revenueGenerated}</td>
                    <td className={`px-3 py-2 text-right font-semibold ${r.positive ? 'text-green-600' : 'text-red-500'}`}>
                      {r.roi}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Average Basket Value Trend */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Average Basket Value</h2>
          <p className="mt-0.5 text-xs text-gray-500">6-month trend</p>

          <div className="mt-6 flex items-end gap-4" style={{ height: 140 }}>
            {basketValues.map((b) => {
              const pct = ((b.value - 12) / (18 - 12)) * 100;
              return (
                <div key={b.month} className="flex flex-1 flex-col items-center">
                  <span className="mb-1 text-xs font-medium text-gray-700">£{b.value.toFixed(2)}</span>
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-orange-400 to-orange-200 transition-all"
                    style={{ height: `${pct}%` }}
                  />
                  <span className="mt-2 text-xs text-gray-500">{b.month}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Period Comparison */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-orange-500" />
          <h2 className="text-base font-semibold text-gray-900">Period Comparison</h2>
          <span className="text-xs text-gray-500">This month vs Last month</span>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {periodComparison.map((p) => (
            <div key={p.metric} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-center">
              <p className="text-xs text-gray-500">{p.metric}</p>
              <p className="mt-1 text-lg font-bold text-gray-900">{p.thisPeriod}</p>
              <p className="text-xs text-gray-400">vs {p.lastPeriod}</p>
              <span
                className={`mt-1 inline-flex items-center text-xs font-medium ${
                  p.trend === 'up' ? 'text-green-600' : 'text-red-500'
                }`}
              >
                {p.trend === 'up' ? (
                  <ArrowUpRight className="mr-0.5 h-3 w-3" />
                ) : (
                  <ArrowDownRight className="mr-0.5 h-3 w-3" />
                )}
                {p.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
