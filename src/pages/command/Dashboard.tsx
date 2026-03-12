import React, { useState } from 'react';
import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Users,
  UserCheck,
  Heart,
  CheckSquare,
  FileText,
  UserPlus,
  Megaphone,
  Clock,
  Plus,
  AlertTriangle,
  AlertCircle,
  Bell,
  DollarSign,
  ArrowRight,
  Activity,
} from 'lucide-react';
import KPICard from '@/components/shared/KPICard';

// ── Mock Data ──────────────────────────────────────────────────────────────────

const kpis = [
  {
    title: 'Total Revenue',
    value: '£284,620',
    change: '+12.4%',
    trend: 'up' as const,
    icon: DollarSign,
    subtitle: 'vs last month',
  },
  {
    title: 'Active Clients',
    value: '47',
    change: '+3',
    trend: 'up' as const,
    icon: Users,
    subtitle: 'this quarter',
  },
  {
    title: 'Active Members',
    value: '1,243',
    change: '+89',
    trend: 'up' as const,
    icon: UserCheck,
    subtitle: 'across all tiers',
  },
  {
    title: 'Loyalty Customers',
    value: '3,817',
    change: '-2.1%',
    trend: 'down' as const,
    icon: Heart,
    subtitle: 'enrolled total',
  },
  {
    title: 'Tasks Due',
    value: '14',
    change: '5 overdue',
    trend: 'down' as const,
    icon: CheckSquare,
    subtitle: 'this week',
  },
];

const revenueData = [
  { month: 'Sep', consulting: 38, memberships: 22, loyalty: 14, other: 8 },
  { month: 'Oct', consulting: 42, memberships: 24, loyalty: 16, other: 9 },
  { month: 'Nov', consulting: 36, memberships: 26, loyalty: 18, other: 7 },
  { month: 'Dec', consulting: 48, memberships: 28, loyalty: 20, other: 12 },
  { month: 'Jan', consulting: 44, memberships: 30, loyalty: 22, other: 10 },
  { month: 'Feb', consulting: 52, memberships: 32, loyalty: 24, other: 11 },
];

interface ActivityItem {
  id: string;
  type: 'invoice' | 'member' | 'loyalty' | 'task' | 'client';
  message: string;
  time: string;
  module: string;
}

const recentActivity: ActivityItem[] = [
  { id: '1', type: 'invoice', message: 'Invoice #INV-2026-0341 sent to Barclays UK — £12,400', time: '12 min ago', module: 'Consul' },
  { id: '2', type: 'member', message: 'Sarah Whitfield upgraded to Gold membership', time: '34 min ago', module: 'Lodge' },
  { id: '3', type: 'loyalty', message: '42 new loyalty sign-ups from Auckland campaign', time: '1 hr ago', module: 'Hearth' },
  { id: '4', type: 'task', message: 'Q1 tax filing completed by James Thornton', time: '2 hrs ago', module: 'Command' },
  { id: '5', type: 'client', message: 'New client onboarded: Meridian Finance (Toronto)', time: '3 hrs ago', module: 'Consul' },
  { id: '6', type: 'invoice', message: 'Payment received from ANZ Group — A$8,750', time: '4 hrs ago', module: 'Consul' },
  { id: '7', type: 'member', message: 'Membership renewal batch: 23 auto-renewed', time: '5 hrs ago', module: 'Lodge' },
  { id: '8', type: 'loyalty', message: 'Points redemption: 1,420 points by Marcus Chen', time: '6 hrs ago', module: 'Hearth' },
];

interface Alert {
  id: string;
  severity: 'high' | 'medium' | 'low';
  title: string;
  detail: string;
}

const alerts: Alert[] = [
  { id: '1', severity: 'high', title: 'Overdue Invoices (3)', detail: 'Total outstanding: £18,240 — oldest 34 days past due' },
  { id: '2', severity: 'medium', title: 'Expiring Memberships (12)', detail: '12 memberships expire within 14 days — renewal emails pending' },
  { id: '3', severity: 'medium', title: 'Lapsed Loyalty Customers (28)', detail: 'No activity in 60+ days — re-engagement campaign recommended' },
  { id: '4', severity: 'low', title: 'Pending Approvals (4)', detail: '2 expense claims and 2 time-off requests awaiting review' },
];

interface CashFlowForecast {
  period: string;
  inflow: number;
  outflow: number;
  net: number;
}

const cashFlowForecast: CashFlowForecast[] = [
  { period: '30 Days', inflow: 94200, outflow: 67800, net: 26400 },
  { period: '60 Days', inflow: 182500, outflow: 141200, net: 41300 },
  { period: '90 Days', inflow: 278400, outflow: 218600, net: 59800 },
];

const quickActions = [
  { label: 'New Invoice', icon: FileText, color: 'bg-blue-500' },
  { label: 'New Member', icon: UserPlus, color: 'bg-emerald-500' },
  { label: 'New Campaign', icon: Megaphone, color: 'bg-orange-500' },
  { label: 'Log Time', icon: Clock, color: 'bg-purple-500' },
  { label: 'New Task', icon: Plus, color: 'bg-violet-500' },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const moduleColor: Record<string, string> = {
  Consul: 'bg-blue-500',
  Lodge: 'bg-emerald-500',
  Hearth: 'bg-orange-500',
  Command: 'bg-purple-500',
};

const activityIcon: Record<ActivityItem['type'], React.ElementType> = {
  invoice: FileText,
  member: UserCheck,
  loyalty: Heart,
  task: CheckSquare,
  client: Users,
};

const severityStyles: Record<Alert['severity'], { bg: string; border: string; icon: React.ElementType }> = {
  high: { bg: 'bg-red-50', border: 'border-red-200', icon: AlertCircle },
  medium: { bg: 'bg-amber-50', border: 'border-amber-200', icon: AlertTriangle },
  low: { bg: 'bg-blue-50', border: 'border-blue-200', icon: Bell },
};

function formatCurrency(value: number): string {
  return `£${value.toLocaleString()}`;
}

// ── Component ──────────────────────────────────────────────────────────────────

const Dashboard: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter'>('month');

  const maxBarValue = Math.max(
    ...revenueData.map((d) => d.consulting + d.memberships + d.loyalty + d.other),
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-command/10">
            <LayoutDashboard className="h-5 w-5 text-command" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">Command Dashboard</h1>
            <p className="text-sm text-ink-tertiary">Overview of your entire Forge ecosystem</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {(['week', 'month', 'quarter'] as const).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`rounded-lg px-3 py-1.5 text-sm font-medium capitalize transition-colors ${
                selectedPeriod === period
                  ? 'bg-command text-white'
                  : 'text-ink-tertiary hover:bg-surface-tertiary'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {kpis.map((kpi) => (
          <KPICard
            key={kpi.title}
            title={kpi.title}
            value={kpi.value}
            change={kpi.change}
            trend={kpi.trend}
            icon={kpi.icon}
            subtitle={kpi.subtitle}
          />
        ))}
      </div>

      {/* Revenue Chart + Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Revenue Breakdown Chart */}
        <div className="col-span-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-ink">Revenue Breakdown</h2>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded bg-blue-500" /> Consulting
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded bg-emerald-500" /> Memberships
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded bg-orange-400" /> Loyalty
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-block h-3 w-3 rounded bg-slate-300" /> Other
              </span>
            </div>
          </div>

          {/* Mock bar chart built with divs */}
          <div className="flex items-end gap-3" style={{ height: 220 }}>
            {revenueData.map((d) => {
              const total = d.consulting + d.memberships + d.loyalty + d.other;
              const scale = 200 / maxBarValue;
              return (
                <div key={d.month} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex w-full flex-col-reverse overflow-hidden rounded-t-md">
                    <div
                      className="w-full bg-blue-500 transition-all"
                      style={{ height: d.consulting * scale }}
                      title={`Consulting: £${d.consulting}k`}
                    />
                    <div
                      className="w-full bg-emerald-500 transition-all"
                      style={{ height: d.memberships * scale }}
                      title={`Memberships: £${d.memberships}k`}
                    />
                    <div
                      className="w-full bg-orange-400 transition-all"
                      style={{ height: d.loyalty * scale }}
                      title={`Loyalty: £${d.loyalty}k`}
                    />
                    <div
                      className="w-full bg-slate-300 transition-all"
                      style={{ height: d.other * scale }}
                      title={`Other: £${d.other}k`}
                    />
                  </div>
                  <span className="text-xs text-ink-tertiary">{d.month}</span>
                  <span className="text-[10px] font-medium text-ink-secondary">£{total}k</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">Recent Activity</h2>
          <div className="space-y-4">
            {recentActivity.slice(0, 6).map((item) => {
              const Icon = activityIcon[item.type];
              return (
                <div key={item.id} className="flex gap-3">
                  <div className="relative flex flex-col items-center">
                    <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${moduleColor[item.module]} text-white`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="mt-1 w-px flex-1 bg-slate-200" />
                  </div>
                  <div className="min-w-0 pb-4">
                    <p className="text-sm text-ink-secondary">{item.message}</p>
                    <p className="mt-0.5 text-xs text-ink-faint">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Alerts + Quick Actions */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Alerts */}
        <div className="col-span-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold text-ink">Alerts &amp; Notifications</h2>
          <div className="space-y-3">
            {alerts.map((alert) => {
              const style = severityStyles[alert.severity];
              const AlertIcon = style.icon;
              return (
                <div
                  key={alert.id}
                  className={`flex items-start gap-3 rounded-lg border p-4 ${style.bg} ${style.border}`}
                >
                  <AlertIcon className={`mt-0.5 h-5 w-5 shrink-0 ${
                    alert.severity === 'high' ? 'text-red-500' : alert.severity === 'medium' ? 'text-amber-500' : 'text-blue-500'
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink">{alert.title}</p>
                    <p className="mt-0.5 text-xs text-ink-secondary">{alert.detail}</p>
                  </div>
                  <button className="ml-auto shrink-0 text-xs font-medium text-command hover:underline">
                    View
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-ink">Quick Actions</h2>
          <div className="space-y-2">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.label}
                  className="flex w-full items-center gap-3 rounded-lg p-3 text-left transition-colors hover:bg-surface-tertiary"
                >
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${action.color} text-white`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="text-sm font-medium text-ink-secondary">{action.label}</span>
                  <ArrowRight className="ml-auto h-4 w-4 text-ink-faint" />
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Cash Flow Forecast */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Cash Flow Forecast</h2>
          <Activity className="h-5 w-5 text-ink-faint" />
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cashFlowForecast.map((cf) => (
            <div key={cf.period} className="rounded-lg border border-slate-100 bg-surface-secondary p-5">
              <p className="text-sm font-medium text-ink-tertiary">{cf.period}</p>
              <div className="mt-3 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-emerald-600">
                    <TrendingUp className="h-4 w-4" /> Inflow
                  </span>
                  <span className="text-sm font-semibold text-ink">{formatCurrency(cf.inflow)}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-sm text-red-500">
                    <TrendingDown className="h-4 w-4" /> Outflow
                  </span>
                  <span className="text-sm font-semibold text-ink">{formatCurrency(cf.outflow)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-ink-secondary">Net</span>
                    <span className="text-base font-bold text-command">{formatCurrency(cf.net)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
