import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  ChevronRight,
  DollarSign,
  AlertTriangle,
  Clock,
  CheckCircle2,
  FileText,
  Send,
  MoreHorizontal,
  Eye,
  Download,
  ArrowUpRight,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue';

interface Invoice {
  id: string;
  number: string;
  client: string;
  amount: number;
  currency: string;
  status: InvoiceStatus;
  issueDate: string;
  dueDate: string;
  paidDate?: string;
  description: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockInvoices: Invoice[] = [
  { id: '1', number: 'INV-2026-001', client: 'HSBC Global', amount: 42000, currency: 'GBP', status: 'paid', issueDate: '2026-01-15', dueDate: '2026-02-14', paidDate: '2026-02-10', description: 'Digital Transformation — Phase 1 Milestone' },
  { id: '2', number: 'INV-2026-002', client: 'Unilever UK', amount: 35000, currency: 'GBP', status: 'paid', issueDate: '2026-01-20', dueDate: '2026-02-19', paidDate: '2026-02-18', description: 'Supply Chain Optimisation — Monthly Retainer' },
  { id: '3', number: 'INV-2026-003', client: 'Rolls-Royce PLC', amount: 24000, currency: 'GBP', status: 'sent', issueDate: '2026-02-01', dueDate: '2026-03-03', description: 'Cloud Migration Assessment — Discovery Phase' },
  { id: '4', number: 'INV-2026-004', client: 'TD Bank Group', amount: 32500, currency: 'CAD', status: 'sent', issueDate: '2026-02-10', dueDate: '2026-03-12', description: 'Risk & Compliance Review — Q1 Deliverable' },
  { id: '5', number: 'INV-2026-005', client: 'Telstra Digital', amount: 18500, currency: 'AUD', status: 'overdue', issueDate: '2026-01-25', dueDate: '2026-02-24', description: 'Customer Analytics — Requirements Workshop' },
  { id: '6', number: 'INV-2026-006', client: 'Atlassian', amount: 17000, currency: 'AUD', status: 'paid', issueDate: '2026-02-15', dueDate: '2026-03-17', paidDate: '2026-03-05', description: 'DevOps Maturity Assessment — Initial Review' },
  { id: '7', number: 'INV-2026-007', client: 'Shopify APAC', amount: 21250, currency: 'USD', status: 'overdue', issueDate: '2026-01-30', dueDate: '2026-03-01', description: 'Market Entry Strategy — Research Phase' },
  { id: '8', number: 'INV-2026-008', client: 'Lloyds Banking', amount: 23000, currency: 'GBP', status: 'paid', issueDate: '2026-02-28', dueDate: '2026-03-30', paidDate: '2026-03-08', description: 'ERP Implementation — Final Milestone' },
  { id: '9', number: 'INV-2026-009', client: 'Unilever UK', amount: 35000, currency: 'GBP', status: 'sent', issueDate: '2026-02-20', dueDate: '2026-03-22', description: 'Supply Chain Optimisation — February Retainer' },
  { id: '10', number: 'INV-2026-010', client: 'HSBC Global', amount: 42000, currency: 'GBP', status: 'draft', issueDate: '2026-03-10', dueDate: '2026-04-09', description: 'Digital Transformation — Phase 2 Milestone' },
  { id: '11', number: 'INV-2026-011', client: 'BHP Consulting', amount: 23750, currency: 'AUD', status: 'draft', issueDate: '2026-03-12', dueDate: '2026-04-11', description: 'Sustainability Reporting — Scoping' },
  { id: '12', number: 'INV-2026-012', client: 'Barclays Corporate', amount: 15000, currency: 'GBP', status: 'draft', issueDate: '2026-03-12', dueDate: '2026-04-11', description: 'Advisory Retainer — March' },
];

const currencySymbols: Record<string, string> = { GBP: '\u00a3', USD: '$', AUD: 'A$', CAD: 'C$' };

function fmt(value: number, currency: string): string {
  const s = currencySymbols[currency] ?? currency + ' ';
  return `${s}${value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

const statusConfig: Record<InvoiceStatus, { label: string; icon: React.ReactNode; className: string }> = {
  draft: { label: 'Draft', icon: <FileText className="w-3.5 h-3.5" />, className: 'bg-slate-100 text-slate-600' },
  sent: { label: 'Sent', icon: <Send className="w-3.5 h-3.5" />, className: 'bg-amber-100 text-amber-700' },
  paid: { label: 'Paid', icon: <CheckCircle2 className="w-3.5 h-3.5" />, className: 'bg-emerald-100 text-emerald-700' },
  overdue: { label: 'Overdue', icon: <AlertTriangle className="w-3.5 h-3.5" />, className: 'bg-red-100 text-red-700' },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Invoices: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = mockInvoices.filter((inv) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !inv.number.toLowerCase().includes(q) &&
        !inv.client.toLowerCase().includes(q) &&
        !inv.description.toLowerCase().includes(q)
      )
        return false;
    }
    if (statusFilter !== 'all' && inv.status !== statusFilter) return false;
    return true;
  });

  // KPI calculations — approximate GBP equivalents for summary
  const gbpRate: Record<string, number> = { GBP: 1, USD: 0.79, AUD: 0.52, CAD: 0.58 };
  const toGBP = (amount: number, currency: string) => amount * (gbpRate[currency] ?? 1);

  const totalOutstanding = mockInvoices
    .filter((i) => i.status === 'sent' || i.status === 'overdue')
    .reduce((s, i) => s + toGBP(i.amount, i.currency), 0);

  const totalOverdue = mockInvoices
    .filter((i) => i.status === 'overdue')
    .reduce((s, i) => s + toGBP(i.amount, i.currency), 0);

  const totalPaidThisMonth = mockInvoices
    .filter((i) => i.status === 'paid' && i.paidDate && i.paidDate >= '2026-03-01')
    .reduce((s, i) => s + toGBP(i.amount, i.currency), 0);

  const draftCount = mockInvoices.filter((i) => i.status === 'draft').length;

  return (
    <div className="flex flex-col h-full bg-surface-secondary">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-white">
        <div className="flex items-center text-sm text-ink-tertiary mb-1">
          <span>Consul</span>
          <ChevronRight className="w-3.5 h-3.5 mx-1" />
          <span className="text-ink-secondary font-medium">Invoices</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-2xl font-display font-bold text-ink">Invoices</h1>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-consul text-white rounded-lg hover:bg-consul-dark font-medium shadow-sm">
            <Plus className="w-4 h-4" />
            New Invoice
          </button>
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-amber-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
              <Clock className="w-3.5 h-3.5" />
              Outstanding
            </div>
            <p className="text-xl font-bold text-amber-700 mt-1">
              {'\u00a3'}{(totalOutstanding / 1000).toFixed(1)}k
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
              <AlertTriangle className="w-3.5 h-3.5" />
              Overdue
            </div>
            <p className="text-xl font-bold text-red-700 mt-1">
              {'\u00a3'}{(totalOverdue / 1000).toFixed(1)}k
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Paid This Month
            </div>
            <p className="text-xl font-bold text-emerald-700 mt-1">
              {'\u00a3'}{(totalPaidThisMonth / 1000).toFixed(1)}k
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
              <FileText className="w-3.5 h-3.5" />
              Drafts
            </div>
            <p className="text-xl font-bold text-ink mt-1">{draftCount}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex-shrink-0 px-6 py-3 bg-white border-b border-slate-200">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
            <input
              type="text"
              placeholder="Search invoices..."
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
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
          </select>
        </div>
      </div>

      {/* Invoice Table */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Invoice</th>
                <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Client</th>
                <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Description</th>
                <th className="text-right text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Amount</th>
                <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Due Date</th>
                <th className="w-24 text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((inv) => {
                const sc = statusConfig[inv.status];
                return (
                  <tr key={inv.id} className="hover:bg-slate-50/50 group">
                    <td className="px-4 py-3">
                      <span className="text-sm font-mono font-medium text-consul">{inv.number}</span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-secondary">{inv.client}</td>
                    <td className="px-4 py-3 text-sm text-ink-tertiary max-w-[240px] truncate">{inv.description}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-ink text-right">{fmt(inv.amount, inv.currency)}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${sc.className}`}>
                        {sc.icon}
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-ink-tertiary">{inv.dueDate}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-1.5 rounded hover:bg-slate-100 text-ink-faint hover:text-ink-secondary" title="View">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1.5 rounded hover:bg-slate-100 text-ink-faint hover:text-ink-secondary" title="Download">
                          <Download className="w-4 h-4" />
                        </button>
                        {inv.status === 'draft' && (
                          <button className="p-1.5 rounded hover:bg-blue-100 text-ink-faint hover:text-consul" title="Send">
                            <ArrowUpRight className="w-4 h-4" />
                          </button>
                        )}
                        <button className="p-1.5 rounded hover:bg-slate-100 text-ink-faint hover:text-ink-secondary" title="More">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-ink-tertiary">
              <DollarSign className="w-10 h-10 mb-2 text-ink-faint" />
              <p className="text-sm">No invoices match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Invoices;
