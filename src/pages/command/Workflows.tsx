import React, { useState } from 'react';
import {
  Workflow,
  ChevronRight,
  Plus,
  Search,
  Zap,
  Mail,
  Clock,
  UserCheck,
  Award,
  AlertTriangle,
  MoreHorizontal,
  ArrowRight,
  Play,
  Pause,
  Settings,
  Filter,
  ToggleLeft,
  ToggleRight,
  CheckCircle2,
  XCircle,
  History,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type WorkflowStatus = 'active' | 'paused' | 'draft';

interface WorkflowTrigger {
  label: string;
  icon: React.ElementType;
}

interface WorkflowCondition {
  label: string;
}

interface WorkflowAction {
  label: string;
  icon: React.ElementType;
}

interface WorkflowItem {
  id: string;
  name: string;
  description: string;
  status: WorkflowStatus;
  trigger: WorkflowTrigger;
  condition: WorkflowCondition;
  action: WorkflowAction;
  lastRun: string;
  totalRuns: number;
  successRate: number;
  module: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockWorkflows: WorkflowItem[] = [
  {
    id: '1',
    name: 'Invoice Overdue Reminder',
    description: 'Send email reminders when invoices are past due by 7, 14, and 30 days',
    status: 'active',
    trigger: { label: 'Invoice overdue 7+ days', icon: Clock },
    condition: { label: 'Amount > £500 AND status = unpaid' },
    action: { label: 'Send reminder email to client', icon: Mail },
    lastRun: '2 hours ago',
    totalRuns: 247,
    successRate: 98.4,
    module: 'Consul',
  },
  {
    id: '2',
    name: 'Member Expiry Win-back',
    description: 'Automatically re-engage members whose memberships have expired within 30 days',
    status: 'active',
    trigger: { label: 'Membership expired', icon: UserCheck },
    condition: { label: 'Tier = Silver or Gold AND tenure > 6 months' },
    action: { label: 'Send win-back offer + 10% discount', icon: Mail },
    lastRun: '6 hours ago',
    totalRuns: 89,
    successRate: 94.2,
    module: 'Lodge',
  },
  {
    id: '3',
    name: 'Gold Tier Congratulations',
    description: 'Send congratulatory email and reward when a member reaches Gold tier',
    status: 'active',
    trigger: { label: 'Member upgraded to Gold', icon: Award },
    condition: { label: 'Points balance >= 5,000' },
    action: { label: 'Send congrats email + 500 bonus points', icon: Zap },
    lastRun: '1 day ago',
    totalRuns: 156,
    successRate: 100,
    module: 'Hearth',
  },
  {
    id: '4',
    name: 'New Client Welcome Sequence',
    description: 'Send a series of onboarding emails over 7 days when a new client is added',
    status: 'active',
    trigger: { label: 'New client created', icon: UserCheck },
    condition: { label: 'Client type = Active' },
    action: { label: 'Send 3-part welcome email series', icon: Mail },
    lastRun: '3 days ago',
    totalRuns: 64,
    successRate: 97.8,
    module: 'Consul',
  },
  {
    id: '5',
    name: 'Project Milestone Alert',
    description: 'Notify team leads when project milestones are approaching or overdue',
    status: 'paused',
    trigger: { label: 'Milestone due in 3 days', icon: AlertTriangle },
    condition: { label: 'Project status = Active AND milestone incomplete' },
    action: { label: 'Send Slack notification + email', icon: Zap },
    lastRun: '2 weeks ago',
    totalRuns: 312,
    successRate: 96.1,
    module: 'Consul',
  },
  {
    id: '6',
    name: 'Loyalty Points Expiry Warning',
    description: 'Warn customers when their loyalty points are about to expire in 30 days',
    status: 'active',
    trigger: { label: 'Points expire in 30 days', icon: Clock },
    condition: { label: 'Points balance > 100 AND status = active' },
    action: { label: 'Send expiry warning email', icon: Mail },
    lastRun: '12 hours ago',
    totalRuns: 534,
    successRate: 99.1,
    module: 'Hearth',
  },
  {
    id: '7',
    name: 'Monthly Revenue Report',
    description: 'Generate and distribute monthly revenue summary to all directors',
    status: 'draft',
    trigger: { label: '1st of each month at 9:00 AM', icon: Clock },
    condition: { label: 'Always run' },
    action: { label: 'Generate report + email directors', icon: Mail },
    lastRun: 'Never',
    totalRuns: 0,
    successRate: 0,
    module: 'Command',
  },
];

const statusConfig: Record<WorkflowStatus, { label: string; bg: string; text: string; dot: string }> = {
  active: { label: 'Active', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  paused: { label: 'Paused', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
  draft: { label: 'Draft', bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
};

const moduleColors: Record<string, string> = {
  Consul: 'text-blue-600 bg-blue-50',
  Lodge: 'text-emerald-600 bg-emerald-50',
  Hearth: 'text-orange-600 bg-orange-50',
  Command: 'text-purple-600 bg-purple-50',
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Workflows: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | WorkflowStatus>('all');
  const [workflows, setWorkflows] = useState(mockWorkflows);

  const filteredWorkflows = workflows.filter((w) => {
    const matchesSearch =
      w.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      w.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || w.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const activeCount = workflows.filter((w) => w.status === 'active').length;
  const pausedCount = workflows.filter((w) => w.status === 'paused').length;
  const totalRuns = workflows.reduce((sum, w) => sum + w.totalRuns, 0);

  const toggleWorkflow = (id: string) => {
    setWorkflows((prev) =>
      prev.map((w) =>
        w.id === id
          ? { ...w, status: (w.status === 'active' ? 'paused' : 'active') as WorkflowStatus }
          : w,
      ),
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center text-sm text-ink-tertiary mb-1">
        <span>Command</span>
        <ChevronRight className="w-3.5 h-3.5 mx-1" />
        <span className="text-ink-secondary font-medium">Workflows</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-command/10">
            <Workflow className="h-5 w-5 text-command" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">Workflow Automation</h1>
            <p className="text-sm text-ink-tertiary">Automate repetitive tasks across all modules</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-command text-white rounded-lg hover:bg-command-dark font-medium shadow-sm">
          <Plus className="w-4 h-4" />
          New Workflow
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <Zap className="w-3.5 h-3.5" />
            Active Workflows
          </div>
          <p className="text-2xl font-bold text-ink mt-1">{activeCount}</p>
          <p className="text-xs text-ink-tertiary mt-1">Running automations</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <Pause className="w-3.5 h-3.5" />
            Paused
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-1">{pausedCount}</p>
          <p className="text-xs text-ink-tertiary mt-1">Temporarily disabled</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <History className="w-3.5 h-3.5" />
            Total Executions
          </div>
          <p className="text-2xl font-bold text-ink mt-1">{totalRuns.toLocaleString()}</p>
          <p className="text-xs text-ink-tertiary mt-1">All time</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Avg Success Rate
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">
            {(workflows.filter((w) => w.totalRuns > 0).reduce((sum, w) => sum + w.successRate, 0) /
              workflows.filter((w) => w.totalRuns > 0).length).toFixed(1)}%
          </p>
          <p className="text-xs text-ink-tertiary mt-1">Across active workflows</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-command/30 focus:border-command"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
          {(['all', 'active', 'paused', 'draft'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-command text-white'
                  : 'text-ink-tertiary hover:bg-surface-tertiary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Workflow List */}
      <div className="space-y-4">
        {filteredWorkflows.map((workflow) => {
          const status = statusConfig[workflow.status];
          const TriggerIcon = workflow.trigger.icon;
          const ActionIcon = workflow.action.icon;

          return (
            <div
              key={workflow.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              {/* Top row */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-command/10 mt-0.5">
                    <Zap className="h-5 w-5 text-command" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-ink">{workflow.name}</h3>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                        {status.label}
                      </span>
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${moduleColors[workflow.module]}`}>
                        {workflow.module}
                      </span>
                    </div>
                    <p className="text-sm text-ink-tertiary mt-1">{workflow.description}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleWorkflow(workflow.id)}
                    className="text-ink-tertiary hover:text-ink-secondary transition-colors"
                    title={workflow.status === 'active' ? 'Pause workflow' : 'Activate workflow'}
                  >
                    {workflow.status === 'active' ? (
                      <ToggleRight className="w-8 h-8 text-emerald-500" />
                    ) : (
                      <ToggleLeft className="w-8 h-8 text-slate-300" />
                    )}
                  </button>
                  <button className="text-ink-faint hover:text-ink-secondary transition-colors p-1">
                    <Settings className="w-4 h-4" />
                  </button>
                  <button className="text-ink-faint hover:text-ink-secondary transition-colors p-1">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Flow visualization */}
              <div className="mt-5 flex items-center gap-3 ml-14">
                {/* Trigger */}
                <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
                  <TriggerIcon className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-[10px] font-medium text-blue-500 uppercase tracking-wide">Trigger</p>
                    <p className="text-xs font-medium text-blue-800">{workflow.trigger.label}</p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-ink-faint shrink-0" />

                {/* Condition */}
                <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2">
                  <Filter className="w-4 h-4 text-amber-600" />
                  <div>
                    <p className="text-[10px] font-medium text-amber-500 uppercase tracking-wide">Condition</p>
                    <p className="text-xs font-medium text-amber-800">{workflow.condition.label}</p>
                  </div>
                </div>

                <ArrowRight className="w-4 h-4 text-ink-faint shrink-0" />

                {/* Action */}
                <div className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2">
                  <ActionIcon className="w-4 h-4 text-emerald-600" />
                  <div>
                    <p className="text-[10px] font-medium text-emerald-500 uppercase tracking-wide">Action</p>
                    <p className="text-xs font-medium text-emerald-800">{workflow.action.label}</p>
                  </div>
                </div>
              </div>

              {/* Stats footer */}
              <div className="mt-4 ml-14 flex items-center gap-6 text-xs text-ink-tertiary">
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  Last run: {workflow.lastRun}
                </span>
                <span className="flex items-center gap-1">
                  <Play className="w-3.5 h-3.5" />
                  {workflow.totalRuns} total runs
                </span>
                {workflow.totalRuns > 0 && (
                  <span className="flex items-center gap-1">
                    {workflow.successRate >= 95 ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    ) : (
                      <XCircle className="w-3.5 h-3.5 text-red-500" />
                    )}
                    {workflow.successRate}% success rate
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Workflows;
