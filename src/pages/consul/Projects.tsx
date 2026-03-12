import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  ChevronRight,
  LayoutGrid,
  List,
  Building2,
  Clock,
  CheckCircle2,
  PauseCircle,
  CircleDot,
  ListTodo,
  MoreHorizontal,
  DollarSign,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProjectStatus = 'active' | 'completed' | 'on_hold' | 'planning';

interface Project {
  id: string;
  name: string;
  client: string;
  status: ProjectStatus;
  budget: number;
  currency: string;
  hoursTracked: number;
  hoursEstimated: number;
  progress: number;
  tasksTotal: number;
  tasksDone: number;
  startDate: string;
  endDate: string;
  tags: string[];
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockProjects: Project[] = [
  { id: '1', name: 'Digital Transformation Strategy', client: 'HSBC Global', status: 'active', budget: 210000, currency: 'GBP', hoursTracked: 284, hoursEstimated: 500, progress: 57, tasksTotal: 24, tasksDone: 14, startDate: '2026-01-15', endDate: '2026-06-30', tags: ['strategy', 'digital'] },
  { id: '2', name: 'Supply Chain Optimisation', client: 'Unilever UK', status: 'active', budget: 175000, currency: 'GBP', hoursTracked: 412, hoursEstimated: 600, progress: 69, tasksTotal: 32, tasksDone: 22, startDate: '2025-11-01', endDate: '2026-04-30', tags: ['operations', 'supply-chain'] },
  { id: '3', name: 'Cloud Migration Assessment', client: 'Rolls-Royce PLC', status: 'active', budget: 120000, currency: 'GBP', hoursTracked: 96, hoursEstimated: 300, progress: 32, tasksTotal: 18, tasksDone: 6, startDate: '2026-02-01', endDate: '2026-07-31', tags: ['cloud', 'infrastructure'] },
  { id: '4', name: 'Customer Analytics Platform', client: 'Telstra Digital', status: 'planning', budget: 62000, currency: 'AUD', hoursTracked: 0, hoursEstimated: 200, progress: 0, tasksTotal: 12, tasksDone: 0, startDate: '2026-04-01', endDate: '2026-08-15', tags: ['data', 'analytics'] },
  { id: '5', name: 'ERP Implementation', client: 'Lloyds Banking', status: 'completed', budget: 92000, currency: 'GBP', hoursTracked: 380, hoursEstimated: 400, progress: 100, tasksTotal: 28, tasksDone: 28, startDate: '2025-06-01', endDate: '2026-02-28', tags: ['erp', 'implementation'] },
  { id: '6', name: 'DevOps Maturity Assessment', client: 'Atlassian', status: 'active', budget: 68000, currency: 'AUD', hoursTracked: 45, hoursEstimated: 150, progress: 30, tasksTotal: 10, tasksDone: 3, startDate: '2026-02-15', endDate: '2026-05-15', tags: ['devops', 'assessment'] },
  { id: '7', name: 'Market Entry Strategy — Canada', client: 'Shopify APAC', status: 'on_hold', budget: 85000, currency: 'USD', hoursTracked: 120, hoursEstimated: 250, progress: 48, tasksTotal: 16, tasksDone: 8, startDate: '2025-12-01', endDate: '2026-05-31', tags: ['strategy', 'market-entry'] },
  { id: '8', name: 'Risk & Compliance Review', client: 'TD Bank Group', status: 'active', budget: 130000, currency: 'CAD', hoursTracked: 168, hoursEstimated: 350, progress: 48, tasksTotal: 20, tasksDone: 10, startDate: '2026-01-10', endDate: '2026-06-15', tags: ['compliance', 'risk'] },
  { id: '9', name: 'Sustainability Reporting Framework', client: 'BHP Consulting', status: 'planning', budget: 95000, currency: 'AUD', hoursTracked: 0, hoursEstimated: 280, progress: 0, tasksTotal: 15, tasksDone: 0, startDate: '2026-04-15', endDate: '2026-09-30', tags: ['esg', 'reporting'] },
];

const statusConfig: Record<ProjectStatus, { label: string; icon: React.ReactNode; className: string; badgeClass: string }> = {
  active: { label: 'Active', icon: <CircleDot className="w-3.5 h-3.5" />, className: 'text-emerald-600', badgeClass: 'bg-emerald-100 text-emerald-700' },
  completed: { label: 'Completed', icon: <CheckCircle2 className="w-3.5 h-3.5" />, className: 'text-blue-600', badgeClass: 'bg-blue-100 text-blue-700' },
  on_hold: { label: 'On Hold', icon: <PauseCircle className="w-3.5 h-3.5" />, className: 'text-amber-600', badgeClass: 'bg-amber-100 text-amber-700' },
  planning: { label: 'Planning', icon: <Clock className="w-3.5 h-3.5" />, className: 'text-slate-500', badgeClass: 'bg-slate-100 text-slate-600' },
};

const currencySymbols: Record<string, string> = { GBP: '£', USD: '$', AUD: 'A$', CAD: 'C$' };

function fmt(value: number, currency: string): string {
  const s = currencySymbols[currency] ?? currency + ' ';
  return `${s}${value.toLocaleString()}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const filtered = mockProjects.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.name.toLowerCase().includes(q) && !p.client.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-surface-secondary">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-white">
        <div className="flex items-center text-sm text-ink-tertiary mb-1">
          <span>Consul</span>
          <ChevronRight className="w-3.5 h-3.5 mx-1" />
          <span className="text-ink-secondary font-medium">Projects</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div>
            <h1 className="text-2xl font-display font-bold text-ink">Projects</h1>
            <p className="text-sm text-ink-tertiary mt-0.5">
              {mockProjects.filter((p) => p.status === 'active').length} active projects
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-consul text-white rounded-lg hover:bg-consul-dark font-medium shadow-sm">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-consul/30 focus:border-consul"
              />
            </div>
            <div className="flex items-center gap-1.5 text-sm text-ink-tertiary">
              <Filter className="w-4 h-4" />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-consul/30 focus:border-consul text-ink-secondary bg-white"
            >
              <option value="all">All Statuses</option>
              <option value="active">Active</option>
              <option value="planning">Planning</option>
              <option value="on_hold">On Hold</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 ${viewMode === 'grid' ? 'bg-consul text-white' : 'text-ink-tertiary hover:bg-slate-50'}`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 ${viewMode === 'list' ? 'bg-consul text-white' : 'text-ink-tertiary hover:bg-slate-50'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Project Cards / List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map((project) => {
              const sc = statusConfig[project.status];
              return (
                <div
                  key={project.id}
                  className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 cursor-pointer group"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-ink truncate">{project.name}</h3>
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-ink-tertiary">
                        <Building2 className="w-3 h-3" />
                        {project.client}
                      </div>
                    </div>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-faint hover:text-ink-secondary ml-2">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-2 mt-3">
                    <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${sc.badgeClass}`}>
                      {sc.icon}
                      {sc.label}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="mt-4">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-ink-tertiary">Progress</span>
                      <span className="font-medium text-ink-secondary">{project.progress}%</span>
                    </div>
                    <div className="w-full bg-slate-100 rounded-full h-1.5">
                      <div
                        className="bg-consul rounded-full h-1.5 transition-all"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-100">
                    <div>
                      <div className="flex items-center gap-1 text-[10px] text-ink-faint uppercase tracking-wide">
                        <DollarSign className="w-3 h-3" />
                        Budget
                      </div>
                      <p className="text-xs font-semibold text-ink mt-0.5">{fmt(project.budget, project.currency)}</p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[10px] text-ink-faint uppercase tracking-wide">
                        <Clock className="w-3 h-3" />
                        Hours
                      </div>
                      <p className="text-xs font-semibold text-ink mt-0.5">
                        {project.hoursTracked}/{project.hoursEstimated}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-1 text-[10px] text-ink-faint uppercase tracking-wide">
                        <ListTodo className="w-3 h-3" />
                        Tasks
                      </div>
                      <p className="text-xs font-semibold text-ink mt-0.5">
                        {project.tasksDone}/{project.tasksTotal}
                      </p>
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-1 mt-3">
                    {project.tags.map((tag) => (
                      <span key={tag} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Project</th>
                  <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Client</th>
                  <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Status</th>
                  <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Budget</th>
                  <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Progress</th>
                  <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Tasks</th>
                  <th className="w-10 px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((project) => {
                  const sc = statusConfig[project.status];
                  return (
                    <tr key={project.id} className="hover:bg-slate-50/50 cursor-pointer group">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-ink">{project.name}</p>
                        <div className="flex gap-1 mt-1">
                          {project.tags.map((t) => (
                            <span key={t} className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-medium">{t}</span>
                          ))}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-secondary">{project.client}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${sc.badgeClass}`}>
                          {sc.icon}
                          {sc.label}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-ink">{fmt(project.budget, project.currency)}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 min-w-[120px]">
                          <div className="flex-1 bg-slate-100 rounded-full h-1.5">
                            <div className="bg-consul rounded-full h-1.5" style={{ width: `${project.progress}%` }} />
                          </div>
                          <span className="text-xs text-ink-tertiary w-8 text-right">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-ink-secondary">{project.tasksDone}/{project.tasksTotal}</td>
                      <td className="px-4 py-3">
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-faint hover:text-ink-secondary">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Projects;
