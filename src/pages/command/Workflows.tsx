import React, { useState } from 'react';
import {
  Zap,
  Plus,
  Play,
  Pause,
  ArrowRight,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronDown,
  Search,
  Filter,
  Copy,
  MoreVertical,
  Mail,
  FileText,
  Bell,
  CreditCard,
  Heart,
  UserCheck,
  RefreshCw,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  trigger: string;
  condition: string;
  action: string;
  status: 'active' | 'paused' | 'error';
  lastRun: string;
  runsToday: number;
  module: 'Consul' | 'Lodge' | 'Hearth' | 'Command';
}

interface WorkflowTemplate {
  id: string;
  name: string;
  description: string;
  trigger: string;
  action: string;
  icon: React.ElementType;
  category: string;
}

interface LogEntry {
  id: string;
  workflow: string;
  status: 'success' | 'failed' | 'warning';
  message: string;
  timestamp: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const workflows: WorkflowItem[] = [
  {
    id: '1',
    name: 'Invoice Overdue Reminder',
    description: 'Send email reminder when invoice is 7 days past due',
    trigger: 'Invoice overdue > 7 days',
    condition: 'Amount > \u00A3500',
    action: 'Send reminder email to client',
    status: 'active',
    lastRun: '12 Mar, 09:15',
    runsToday: 3,
    module: 'Consul',
  },
  {
    id: '2',
    name: 'New Member Welcome Sequence',
    description: 'Trigger welcome email series for new members',
    trigger: 'New membership created',
    condition: 'All tiers',
    action: 'Send 3-part welcome email sequence',
    status: 'active',
    lastRun: '12 Mar, 08:42',
    runsToday: 5,
    module: 'Lodge',
  },
  {
    id: '3',
    name: 'Loyalty Points Expiry Warning',
    description: 'Notify customers 30 days before points expire',
    trigger: 'Points expiry < 30 days',
    condition: 'Balance > 500 points',
    action: 'Send expiry warning + redemption suggestions',
    status: 'active',
    lastRun: '12 Mar, 07:00',
    runsToday: 12,
    module: 'Hearth',
  },
  {
    id: '4',
    name: 'Weekly Revenue Report',
    description: 'Auto-generate and email weekly revenue summary',
    trigger: 'Every Monday 08:00',
    condition: 'Always',
    action: 'Generate report + email to leadership',
    status: 'active',
    lastRun: '10 Mar, 08:00',
    runsToday: 0,
    module: 'Command',
  },
  {
    id: '5',
    name: 'Membership Renewal Reminder',
    description: 'Send renewal notice 14 days before expiry',
    trigger: 'Membership expiry < 14 days',
    condition: 'Auto-renew disabled',
    action: 'Send renewal email + in-app notification',
    status: 'paused',
    lastRun: '8 Mar, 09:00',
    runsToday: 0,
    module: 'Lodge',
  },
  {
    id: '6',
    name: 'Failed Payment Retry',
    description: 'Retry failed payments after 24 hours',
    trigger: 'Payment failed',
    condition: 'Retry count < 3',
    action: 'Retry payment + notify client',
    status: 'error',
    lastRun: '11 Mar, 14:30',
    runsToday: 0,
    module: 'Consul',
  },
];

const templates: WorkflowTemplate[] = [
  { id: 't1', name: 'Welcome Email', description: 'Send onboarding email to new clients or members', trigger: 'New record', action: 'Send email', icon: Mail, category: 'Onboarding' },
  { id: 't2', name: 'Invoice Follow-up', description: 'Automatic payment reminders at intervals', trigger: 'Overdue invoice', action: 'Send reminder', icon: FileText, category: 'Billing' },
  { id: 't3', name: 'Membership Upgrade Offer', description: 'Suggest upgrades based on engagement', trigger: 'Usage threshold', action: 'Send offer', icon: UserCheck, category: 'Retention' },
  { id: 't4', name: 'Team Notification', description: 'Alert team on important events', trigger: 'Custom event', action: 'Slack/Email alert', icon: Bell, category: 'Notifications' },
  { id: 't5', name: 'Loyalty Re-engagement', description: 'Win back lapsed loyalty customers', trigger: 'Inactivity > 60 days', action: 'Send campaign', icon: Heart, category: 'Retention' },
  { id: 't6', name: 'Payment Receipt', description: 'Auto-send receipts after payment', trigger: 'Payment received', action: 'Send receipt', icon: CreditCard, category: 'Billing' },
];

const automationLog: LogEntry[] = [
  { id: '1', workflow: 'Invoice Overdue Reminder', status: 'success', message: 'Reminder sent to Barclays UK (INV-2026-0338)', timestamp: '12 Mar, 09:15' },
  { id: '2', workflow: 'New Member Welcome Sequence', status: 'success', message: 'Welcome email 1/3 sent to sarah.w@email.com', timestamp: '12 Mar, 08:42' },
  { id: '3', workflow: 'Loyalty Points Expiry Warning', status: 'success', message: '12 expiry warnings sent successfully', timestamp: '12 Mar, 07:00' },
  { id: '4', workflow: 'Failed Payment Retry', status: 'failed', message: 'Retry failed \u2014 card declined (Marcus Chen, A$240)', timestamp: '11 Mar, 14:30' },
  { id: '5', workflow: 'Invoice Overdue Reminder', status: 'success', message: 'Reminder sent to Meridian Finance (INV-2026-0335)', timestamp: '11 Mar, 09:15' },
  { id: '6', workflow: 'New Member Welcome Sequence', status: 'warning', message: 'Email delayed \u2014 SMTP queue backed up (resolved)', timestamp: '11 Mar, 08:50' },
  { id: '7', workflow: 'Weekly Revenue Report', status: 'success', message: 'Report generated and emailed to 4 recipients', timestamp: '10 Mar, 08:00' },
];

// ── Helpers ────────────────────────────────────────────────────────────────────

const statusConfig = {
  active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: Play },
  paused: { label: 'Paused', bg: 'bg-amber-50', text: 'text-amber-700', icon: Pause },
  error: { label: 'Error', bg: 'bg-red-50', text: 'text-red-700', icon: AlertTriangle },
};

const logStatusIcon = {
  success: { icon: CheckCircle2, color: 'text-emerald-500' },
  failed: { icon: XCircle, color: 'text-red-500' },
  warning: { icon: AlertTriangle, color: 'text-amber-500' },
};

const moduleColors: Record<string, string> = {
  Consul: 'bg-blue-100 text-blue-700',
  Lodge: 'bg-emerald-100 text-emerald-700',
  Hearth: 'bg-orange-100 text-orange-700',
  Command: 'bg-purple-100 text-purple-700',
};

// ── Component ──────────────────────────────────────────────────────────────────

const Workflows: React.FC = () => {
  const [showLog, setShowLog] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-command/10">
            <Zap className="h-5 w-5 text-command" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">Workflows</h1>
            <p className="text-sm text-ink-tertiary">Automate repetitive tasks across modules</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowLog(!showLog)}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink-secondary hover:bg-surface-tertiary"
          >
            <Clock className="h-4 w-4" /> Activity Log
            <ChevronDown className={`h-3 w-3 transition-transform ${showLog ? 'rotate-180' : ''}`} />
          </button>
          <button className="flex items-center gap-1.5 rounded-lg bg-command px-4 py-2 text-sm font-medium text-white hover:bg-command-dark">
            <Plus className="h-4 w-4" /> New Workflow
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: 'Active Workflows', value: workflows.filter((w) => w.status === 'active').length, color: 'text-emerald-600' },
          { label: 'Paused', value: workflows.filter((w) => w.status === 'paused').length, color: 'text-amber-600' },
          { label: 'Errors', value: workflows.filter((w) => w.status === 'error').length, color: 'text-red-600' },
          { label: 'Runs Today', value: workflows.reduce((sum, w) => sum + w.runsToday, 0), color: 'text-command' },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-xs text-ink-tertiary">{stat.label}</p>
            <p className={`text-2xl font-bold ${stat.color}`}>{stat.value}</p>
          </div>
        ))}
      </div>

      {/* Activity Log (collapsible) */}
      {showLog && (
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-ink">Automation Log</h2>
          <div className="space-y-3">
            {automationLog.map((entry) => {
              const logIcon = logStatusIcon[entry.status];
              const Icon = logIcon.icon;
              return (
                <div key={entry.id} className="flex items-start gap-3">
                  <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${logIcon.color}`} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink-secondary">
                      <span className="font-medium text-ink">{entry.workflow}</span> &mdash; {entry.message}
                    </p>
                    <p className="mt-0.5 text-xs text-ink-faint">{entry.timestamp}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Active Workflows */}
      <div>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-ink">Active Workflows</h2>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-faint" />
              <input
                type="text"
                placeholder="Search workflows..."
                className="w-56 rounded-lg border border-slate-200 py-1.5 pl-9 pr-3 text-sm text-ink placeholder:text-ink-faint focus:border-command focus:outline-none focus:ring-1 focus:ring-command"
              />
            </div>
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-ink-secondary hover:bg-surface-tertiary">
              <Filter className="h-4 w-4" /> Filter
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {workflows.map((wf) => {
            const config = statusConfig[wf.status];
            const StatusIcon = config.icon;
            return (
              <div
                key={wf.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`mt-0.5 flex h-8 w-8 items-center justify-center rounded-lg ${config.bg}`}>
                      <StatusIcon className={`h-4 w-4 ${config.text}`} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-semibold text-ink">{wf.name}</h3>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${moduleColors[wf.module]}`}>
                          {wf.module}
                        </span>
                        <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.bg} ${config.text}`}>
                          {config.label}
                        </span>
                      </div>
                      <p className="mt-0.5 text-xs text-ink-tertiary">{wf.description}</p>
                    </div>
                  </div>
                  <button className="rounded p-1 text-ink-faint hover:bg-surface-tertiary">
                    <MoreVertical className="h-4 w-4" />
                  </button>
                </div>

                {/* Trigger -> Condition -> Action */}
                <div className="mt-4 flex items-center gap-2 rounded-lg bg-surface-secondary p-3">
                  <div className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase text-ink-faint">Trigger</p>
                    <p className="text-xs font-medium text-ink-secondary">{wf.trigger}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-ink-faint" />
                  <div className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase text-ink-faint">Condition</p>
                    <p className="text-xs font-medium text-ink-secondary">{wf.condition}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 shrink-0 text-ink-faint" />
                  <div className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase text-ink-faint">Action</p>
                    <p className="text-xs font-medium text-ink-secondary">{wf.action}</p>
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-4 text-xs text-ink-faint">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> Last run: {wf.lastRun}
                  </span>
                  <span className="flex items-center gap-1">
                    <RefreshCw className="h-3 w-3" /> {wf.runsToday} runs today
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Template Gallery */}
      <div>
        <h2 className="mb-4 text-lg font-semibold text-ink">Template Gallery</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((tmpl) => {
            const Icon = tmpl.icon;
            return (
              <div
                key={tmpl.id}
                className="group rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-command/30 hover:shadow-md"
              >
                <div className="mb-3 flex items-center justify-between">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-50 text-command">
                    <Icon className="h-5 w-5" />
                  </div>
                  <span className="rounded-full bg-surface-tertiary px-2 py-0.5 text-[10px] font-medium text-ink-tertiary">
                    {tmpl.category}
                  </span>
                </div>
                <h3 className="mb-1 text-sm font-semibold text-ink">{tmpl.name}</h3>
                <p className="mb-3 text-xs text-ink-tertiary">{tmpl.description}</p>
                <div className="flex items-center gap-3 text-xs text-ink-faint">
                  <span>Trigger: {tmpl.trigger}</span>
                  <ArrowRight className="h-3 w-3" />
                  <span>Action: {tmpl.action}</span>
                </div>
                <button className="mt-3 flex items-center gap-1.5 text-xs font-medium text-command opacity-0 transition-opacity group-hover:opacity-100">
                  <Copy className="h-3 w-3" /> Use Template
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Workflows;
