import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  ChevronRight,
  FileText,
  Send,
  Eye,
  CheckCircle2,
  XCircle,
  Clock,
  MoreHorizontal,
  LayoutTemplate,
  Copy,
  DollarSign,
  ArrowRight,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ProposalStatus = 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined';

interface Proposal {
  id: string;
  title: string;
  client: string;
  value: number;
  currency: string;
  status: ProposalStatus;
  createdDate: string;
  sentDate?: string;
  validUntil?: string;
  description: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  category: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockProposals: Proposal[] = [
  { id: '1', title: 'Digital Transformation — Phase 2', client: 'HSBC Global', value: 210000, currency: 'GBP', status: 'sent', createdDate: '2026-03-01', sentDate: '2026-03-05', validUntil: '2026-04-05', description: 'End-to-end digital transformation for retail banking operations' },
  { id: '2', title: 'Cloud Migration Strategy', client: 'Rolls-Royce PLC', value: 120000, currency: 'GBP', status: 'viewed', createdDate: '2026-02-20', sentDate: '2026-02-25', validUntil: '2026-03-25', description: 'Multi-cloud strategy and migration roadmap for manufacturing systems' },
  { id: '3', title: 'Supply Chain Analytics Platform', client: 'Unilever UK', value: 95000, currency: 'GBP', status: 'accepted', createdDate: '2026-01-10', sentDate: '2026-01-15', validUntil: '2026-02-15', description: 'Real-time analytics dashboard for global supply chain monitoring' },
  { id: '4', title: 'DevOps Transformation Programme', client: 'Atlassian', value: 68000, currency: 'AUD', status: 'accepted', createdDate: '2026-02-01', sentDate: '2026-02-05', validUntil: '2026-03-05', description: 'CI/CD pipeline maturity assessment and implementation roadmap' },
  { id: '5', title: 'Market Entry — Canadian Expansion', client: 'Shopify APAC', value: 85000, currency: 'USD', status: 'declined', createdDate: '2025-11-15', sentDate: '2025-11-20', validUntil: '2025-12-20', description: 'Go-to-market strategy for Canadian B2B expansion' },
  { id: '6', title: 'Customer Data Platform', client: 'Telstra Digital', value: 62000, currency: 'AUD', status: 'sent', createdDate: '2026-03-08', sentDate: '2026-03-10', validUntil: '2026-04-10', description: 'Unified customer data platform with AI-driven segmentation' },
  { id: '7', title: 'Regulatory Compliance Modernisation', client: 'TD Bank Group', value: 130000, currency: 'CAD', status: 'viewed', createdDate: '2026-02-28', sentDate: '2026-03-02', validUntil: '2026-04-02', description: 'End-to-end compliance automation for AML and KYC processes' },
  { id: '8', title: 'ESG Reporting Framework', client: 'BHP Consulting', value: 95000, currency: 'AUD', status: 'draft', createdDate: '2026-03-11', description: 'Sustainability and ESG reporting framework aligned with IFRS S2' },
  { id: '9', title: 'API Strategy & Governance', client: 'Barclays Corporate', value: 45000, currency: 'GBP', status: 'draft', createdDate: '2026-03-12', description: 'API-first architecture strategy and developer experience programme' },
];

const templates: Template[] = [
  { id: 't1', name: 'Strategy Engagement', description: 'Full strategic consulting engagement with discovery, analysis and recommendations', category: 'Strategy' },
  { id: 't2', name: 'Technical Assessment', description: 'Technology audit and maturity assessment with roadmap', category: 'Technical' },
  { id: 't3', name: 'Implementation Project', description: 'Multi-phase implementation project with milestones', category: 'Delivery' },
  { id: 't4', name: 'Advisory Retainer', description: 'Ongoing advisory and coaching retainer agreement', category: 'Advisory' },
  { id: 't5', name: 'Workshop Series', description: 'Facilitated workshop series with deliverables', category: 'Workshop' },
];

const statusConfig: Record<ProposalStatus, { label: string; icon: React.ReactNode; className: string; pipeColor: string }> = {
  draft: { label: 'Draft', icon: <FileText className="w-3.5 h-3.5" />, className: 'bg-slate-100 text-slate-600', pipeColor: 'bg-slate-300' },
  sent: { label: 'Sent', icon: <Send className="w-3.5 h-3.5" />, className: 'bg-blue-100 text-blue-700', pipeColor: 'bg-blue-500' },
  viewed: { label: 'Viewed', icon: <Eye className="w-3.5 h-3.5" />, className: 'bg-amber-100 text-amber-700', pipeColor: 'bg-amber-500' },
  accepted: { label: 'Accepted', icon: <CheckCircle2 className="w-3.5 h-3.5" />, className: 'bg-emerald-100 text-emerald-700', pipeColor: 'bg-emerald-500' },
  declined: { label: 'Declined', icon: <XCircle className="w-3.5 h-3.5" />, className: 'bg-red-100 text-red-700', pipeColor: 'bg-red-400' },
};

const currencySymbols: Record<string, string> = { GBP: '\u00a3', USD: '$', AUD: 'A$', CAD: 'C$' };

function fmt(value: number, currency: string): string {
  const s = currencySymbols[currency] ?? currency + ' ';
  return `${s}${value.toLocaleString()}`;
}

const pipelineOrder: ProposalStatus[] = ['draft', 'sent', 'viewed', 'accepted', 'declined'];

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Proposals: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = mockProposals.filter((p) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!p.title.toLowerCase().includes(q) && !p.client.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== 'all' && p.status !== statusFilter) return false;
    return true;
  });

  // Pipeline counts
  const pipelineCounts = pipelineOrder.map((status) => ({
    status,
    count: mockProposals.filter((p) => p.status === status).length,
    value: mockProposals.filter((p) => p.status === status).reduce((s, p) => s + p.value, 0),
  }));

  return (
    <div className="flex flex-col h-full bg-surface-secondary">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-white">
        <div className="flex items-center text-sm text-ink-tertiary mb-1">
          <span>Consul</span>
          <ChevronRight className="w-3.5 h-3.5 mx-1" />
          <span className="text-ink-secondary font-medium">Proposals</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-2xl font-display font-bold text-ink">Proposals</h1>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-consul text-white rounded-lg hover:bg-consul-dark font-medium shadow-sm">
            <Plus className="w-4 h-4" />
            New Proposal
          </button>
        </div>

        {/* Status Pipeline Visualisation */}
        <div className="flex items-center gap-1 mt-4">
          {pipelineCounts.map((item, i) => {
            const sc = statusConfig[item.status];
            return (
              <React.Fragment key={item.status}>
                <div className="flex-1 bg-white border border-slate-200 rounded-lg p-3 text-center">
                  <div className={`w-full h-1 rounded-full ${sc.pipeColor} mb-2`} />
                  <p className="text-xs font-medium text-ink-tertiary uppercase tracking-wide">{sc.label}</p>
                  <p className="text-lg font-bold text-ink mt-0.5">{item.count}</p>
                  <p className="text-[10px] text-ink-faint">{item.value > 0 ? fmt(item.value, 'GBP') : '-'}</p>
                </div>
                {i < pipelineCounts.length - 1 && (
                  <ArrowRight className="w-4 h-4 text-ink-faint flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
            <input
              type="text"
              placeholder="Search proposals..."
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
            {pipelineOrder.map((s) => (
              <option key={s} value={s}>{statusConfig[s].label}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Proposal Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((proposal) => {
            const sc = statusConfig[proposal.status];
            return (
              <div
                key={proposal.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow p-5 cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${sc.className}`}>
                    {sc.icon}
                    {sc.label}
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-faint hover:text-ink-secondary">
                    <MoreHorizontal className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-sm font-semibold text-ink mt-3">{proposal.title}</h3>
                <p className="text-xs text-ink-tertiary mt-1">{proposal.client}</p>
                <p className="text-xs text-ink-faint mt-2 line-clamp-2">{proposal.description}</p>
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
                  <div>
                    <div className="flex items-center gap-1 text-[10px] text-ink-faint uppercase tracking-wide">
                      <DollarSign className="w-3 h-3" />
                      Value
                    </div>
                    <p className="text-sm font-bold text-ink mt-0.5">{fmt(proposal.value, proposal.currency)}</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1 text-[10px] text-ink-faint uppercase tracking-wide justify-end">
                      <Clock className="w-3 h-3" />
                      Created
                    </div>
                    <p className="text-xs text-ink-secondary mt-0.5">{proposal.createdDate}</p>
                  </div>
                </div>
                {proposal.validUntil && (
                  <p className="text-[10px] text-ink-faint mt-2">Valid until {proposal.validUntil}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Template Gallery */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-100">
            <h2 className="text-sm font-semibold text-ink flex items-center gap-2">
              <LayoutTemplate className="w-4 h-4 text-consul" />
              Template Gallery
            </h2>
            <span className="text-xs text-ink-tertiary">{templates.length} templates</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-5">
            {templates.map((template) => (
              <div
                key={template.id}
                className="border border-slate-200 rounded-lg p-4 hover:border-consul/40 hover:bg-blue-50/30 transition-colors cursor-pointer group"
              >
                <div className="flex items-start justify-between">
                  <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-600 rounded font-medium uppercase tracking-wide">
                    {template.category}
                  </span>
                  <button className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-faint hover:text-consul">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                <h3 className="text-sm font-semibold text-ink mt-2">{template.name}</h3>
                <p className="text-xs text-ink-tertiary mt-1">{template.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Proposals;
