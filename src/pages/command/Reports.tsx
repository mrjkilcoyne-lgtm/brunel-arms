import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  FileText,
  Calendar,
  Filter,
  Plus,
  Play,
  Clock,
  Star,
  TrendingUp,
  Users,
  Heart,
  DollarSign,
  Briefcase,
  Target,
  PieChart,
  ArrowUpRight,
  MoreVertical,
  Mail,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface SavedReport {
  id: string;
  name: string;
  type: string;
  lastRun: string;
  schedule?: string;
  starred?: boolean;
  module: 'Consul' | 'Lodge' | 'Hearth' | 'Command';
}

interface ReportType {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  module: string;
  color: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const savedReports: SavedReport[] = [
  { id: '1', name: 'Monthly Revenue Summary', type: 'Revenue', lastRun: '12 Mar 2026', schedule: 'Monthly (1st)', starred: true, module: 'Command' },
  { id: '2', name: 'Client Retention Analysis', type: 'Clients', lastRun: '10 Mar 2026', module: 'Consul' },
  { id: '3', name: 'Membership Growth Q1 2026', type: 'Members', lastRun: '8 Mar 2026', starred: true, module: 'Lodge' },
  { id: '4', name: 'Loyalty Programme ROI', type: 'Loyalty', lastRun: '6 Mar 2026', schedule: 'Weekly (Mon)', module: 'Hearth' },
  { id: '5', name: 'Team Utilisation Report', type: 'Time', lastRun: '5 Mar 2026', schedule: 'Weekly (Fri)', module: 'Command' },
  { id: '6', name: 'Accounts Receivable Aging', type: 'Revenue', lastRun: '3 Mar 2026', module: 'Consul' },
  { id: '7', name: 'Campaign Performance — Feb', type: 'Campaigns', lastRun: '1 Mar 2026', module: 'Hearth' },
  { id: '8', name: 'New Member Onboarding Funnel', type: 'Members', lastRun: '28 Feb 2026', module: 'Lodge' },
];

const reportTypes: ReportType[] = [
  { id: 'revenue', name: 'Revenue Report', description: 'Income, expenses, profit margins across all modules', icon: DollarSign, module: 'Finance', color: 'bg-emerald-50 text-emerald-600' },
  { id: 'clients', name: 'Client Report', description: 'Client acquisition, retention, lifetime value', icon: Briefcase, module: 'Consul', color: 'bg-blue-50 text-blue-600' },
  { id: 'members', name: 'Membership Report', description: 'Member growth, churn, tier distribution', icon: Users, module: 'Lodge', color: 'bg-teal-50 text-teal-600' },
  { id: 'loyalty', name: 'Loyalty Report', description: 'Points earned, redeemed, programme engagement', icon: Heart, module: 'Hearth', color: 'bg-orange-50 text-orange-600' },
  { id: 'time', name: 'Time Report', description: 'Billable hours, utilisation, team productivity', icon: Clock, module: 'Command', color: 'bg-purple-50 text-purple-600' },
  { id: 'campaigns', name: 'Campaign Report', description: 'Campaign reach, conversions, ROI metrics', icon: Target, module: 'Hearth', color: 'bg-pink-50 text-pink-600' },
  { id: 'pipeline', name: 'Pipeline Report', description: 'Sales pipeline stages, conversion rates', icon: TrendingUp, module: 'Consul', color: 'bg-indigo-50 text-indigo-600' },
  { id: 'custom', name: 'Custom Report', description: 'Build a report with custom metrics and filters', icon: PieChart, module: 'All', color: 'bg-slate-50 text-slate-600' },
];

const moduleColors: Record<string, string> = {
  Consul: 'bg-blue-100 text-blue-700',
  Lodge: 'bg-emerald-100 text-emerald-700',
  Hearth: 'bg-orange-100 text-orange-700',
  Command: 'bg-purple-100 text-purple-700',
};

// ── Component ──────────────────────────────────────────────────────────────────

const Reports: React.FC = () => {
  const [dateRange, setDateRange] = useState<'7d' | '30d' | '90d' | 'custom'>('30d');
  const [filterModule, setFilterModule] = useState<string>('All');

  const filteredReports = savedReports.filter(
    (r) => filterModule === 'All' || r.module === filterModule,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-command/10">
            <BarChart3 className="h-5 w-5 text-command" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">Reports</h1>
            <p className="text-sm text-ink-tertiary">Generate and manage business reports</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 rounded-lg bg-command px-4 py-2 text-sm font-medium text-white hover:bg-command-dark">
          <Plus className="h-4 w-4" /> New Report
        </button>
      </div>

      {/* Date Range & Filters */}
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-ink-faint" />
          <span className="text-sm font-medium text-ink-secondary">Date Range:</span>
        </div>
        <div className="flex rounded-lg border border-slate-200">
          {(['7d', '30d', '90d', 'custom'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setDateRange(range)}
              className={`px-3 py-1.5 text-sm font-medium first:rounded-l-lg last:rounded-r-lg ${
                dateRange === range ? 'bg-command text-white' : 'text-ink-secondary hover:bg-surface-tertiary'
              }`}
            >
              {range === 'custom' ? 'Custom' : range === '7d' ? '7 Days' : range === '30d' ? '30 Days' : '90 Days'}
            </button>
          ))}
        </div>

        <div className="mx-2 h-6 w-px bg-slate-200" />

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-ink-faint" />
          <span className="text-sm font-medium text-ink-secondary">Module:</span>
        </div>
        <div className="flex gap-1">
          {['All', 'Consul', 'Lodge', 'Hearth', 'Command'].map((mod) => (
            <button
              key={mod}
              onClick={() => setFilterModule(mod)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                filterModule === mod
                  ? 'bg-command text-white'
                  : 'bg-surface-tertiary text-ink-tertiary hover:text-ink-secondary'
              }`}
            >
              {mod}
            </button>
          ))}
        </div>

        <div className="ml-auto flex gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-ink-secondary hover:bg-surface-tertiary">
            <Download className="h-4 w-4" /> Export All
          </button>
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-ink-secondary hover:bg-surface-tertiary">
            <Mail className="h-4 w-4" /> Schedule
          </button>
        </div>
      </div>

      {/* Report Type Cards */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-ink">Create a Report</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {reportTypes.map((rt) => {
            const Icon = rt.icon;
            return (
              <button
                key={rt.id}
                className="group rounded-xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-command/30 hover:shadow-md"
              >
                <div className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg ${rt.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mb-1 text-sm font-semibold text-ink group-hover:text-command">{rt.name}</h3>
                <p className="text-xs text-ink-tertiary">{rt.description}</p>
                <div className="mt-3 flex items-center gap-1 text-xs font-medium text-command opacity-0 transition-opacity group-hover:opacity-100">
                  Create <ArrowUpRight className="h-3 w-3" />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Saved Reports */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-ink">Saved Reports</h2>
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left">
                <th className="px-5 py-3 font-semibold text-ink-tertiary">Report Name</th>
                <th className="px-5 py-3 font-semibold text-ink-tertiary">Type</th>
                <th className="px-5 py-3 font-semibold text-ink-tertiary">Module</th>
                <th className="px-5 py-3 font-semibold text-ink-tertiary">Last Run</th>
                <th className="px-5 py-3 font-semibold text-ink-tertiary">Schedule</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody>
              {filteredReports.map((report) => (
                <tr key={report.id} className="group border-b border-slate-50 last:border-0 hover:bg-surface-secondary">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-ink-faint" />
                      <span className="font-medium text-ink">{report.name}</span>
                      {report.starred && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
                    </div>
                  </td>
                  <td className="px-5 py-3 text-ink-secondary">{report.type}</td>
                  <td className="px-5 py-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${moduleColors[report.module]}`}>
                      {report.module}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-ink-tertiary">{report.lastRun}</td>
                  <td className="px-5 py-3 text-ink-tertiary">{report.schedule || '—'}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                      <button className="rounded p-1.5 text-command hover:bg-command/10" title="Run report">
                        <Play className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1.5 text-ink-faint hover:bg-surface-tertiary" title="Download">
                        <Download className="h-4 w-4" />
                      </button>
                      <button className="rounded p-1.5 text-ink-faint hover:bg-surface-tertiary" title="More">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
