import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  ChevronRight,
  FileSignature,
  FileText,
  Send,
  CheckCircle2,
  Clock,
  AlertTriangle,
  MoreHorizontal,
  Building2,
  DollarSign,
  CalendarDays,
  ShieldCheck,
  PenLine,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ContractStatus = 'draft' | 'sent' | 'signed' | 'active' | 'expired';

interface Contract {
  id: string;
  title: string;
  client: string;
  status: ContractStatus;
  value: number;
  currency: string;
  startDate: string;
  endDate: string;
  signedDate?: string;
  signedBy?: string;
  daysUntilExpiry?: number;
  type: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockContracts: Contract[] = [
  { id: '1', title: 'Digital Transformation MSA', client: 'HSBC Global', status: 'active', value: 210000, currency: 'GBP', startDate: '2026-01-15', endDate: '2026-06-30', signedDate: '2026-01-10', signedBy: 'Priya Nair', daysUntilExpiry: 110, type: 'MSA' },
  { id: '2', title: 'Supply Chain Advisory Agreement', client: 'Unilever UK', status: 'active', value: 175000, currency: 'GBP', startDate: '2025-11-01', endDate: '2026-04-30', signedDate: '2025-10-28', signedBy: 'Charlotte Webb', daysUntilExpiry: 49, type: 'Advisory' },
  { id: '3', title: 'Cloud Migration SOW', client: 'Rolls-Royce PLC', status: 'active', value: 120000, currency: 'GBP', startDate: '2026-02-01', endDate: '2026-07-31', signedDate: '2026-01-28', signedBy: 'Victoria Hargreaves', daysUntilExpiry: 141, type: 'SOW' },
  { id: '4', title: 'DevOps Assessment Contract', client: 'Atlassian', status: 'active', value: 68000, currency: 'AUD', startDate: '2026-02-15', endDate: '2026-05-15', signedDate: '2026-02-12', signedBy: 'Rebecca Liu', daysUntilExpiry: 64, type: 'Fixed-Price' },
  { id: '5', title: 'Compliance Review Agreement', client: 'TD Bank Group', status: 'signed', value: 130000, currency: 'CAD', startDate: '2026-01-10', endDate: '2026-06-15', signedDate: '2026-01-08', signedBy: 'Michael Fontaine', daysUntilExpiry: 95, type: 'T&M' },
  { id: '6', title: 'ERP Implementation Contract', client: 'Lloyds Banking', status: 'expired', value: 92000, currency: 'GBP', startDate: '2025-06-01', endDate: '2026-02-28', signedDate: '2025-05-28', signedBy: 'Andrew Pemberton', type: 'Fixed-Price' },
  { id: '7', title: 'Customer Analytics SOW', client: 'Telstra Digital', status: 'sent', value: 62000, currency: 'AUD', startDate: '2026-04-01', endDate: '2026-08-15', type: 'SOW' },
  { id: '8', title: 'ESG Reporting Framework SOW', client: 'BHP Consulting', status: 'draft', value: 95000, currency: 'AUD', startDate: '2026-04-15', endDate: '2026-09-30', type: 'SOW' },
  { id: '9', title: 'Advisory Retainer — Barclays', client: 'Barclays Corporate', status: 'active', value: 180000, currency: 'GBP', startDate: '2026-01-01', endDate: '2026-03-31', signedDate: '2025-12-20', signedBy: 'James Whitfield', daysUntilExpiry: 19, type: 'Retainer' },
  { id: '10', title: 'Market Entry Strategy', client: 'Shopify APAC', status: 'expired', value: 85000, currency: 'USD', startDate: '2025-12-01', endDate: '2026-02-28', signedDate: '2025-11-25', signedBy: 'Marcus O\'Brien', type: 'Fixed-Price' },
];

const statusConfig: Record<ContractStatus, { label: string; icon: React.ReactNode; className: string }> = {
  draft: { label: 'Draft', icon: <FileText className="w-3.5 h-3.5" />, className: 'bg-slate-100 text-slate-600' },
  sent: { label: 'Sent', icon: <Send className="w-3.5 h-3.5" />, className: 'bg-blue-100 text-blue-700' },
  signed: { label: 'Signed', icon: <PenLine className="w-3.5 h-3.5" />, className: 'bg-indigo-100 text-indigo-700' },
  active: { label: 'Active', icon: <CheckCircle2 className="w-3.5 h-3.5" />, className: 'bg-emerald-100 text-emerald-700' },
  expired: { label: 'Expired', icon: <Clock className="w-3.5 h-3.5" />, className: 'bg-red-100 text-red-600' },
};

const currencySymbols: Record<string, string> = { GBP: '\u00a3', USD: '$', AUD: 'A$', CAD: 'C$' };

function fmt(value: number, currency: string): string {
  const s = currencySymbols[currency] ?? currency + ' ';
  return `${s}${value.toLocaleString()}`;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Contracts: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filtered = mockContracts.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!c.title.toLowerCase().includes(q) && !c.client.toLowerCase().includes(q)) return false;
    }
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    return true;
  });

  const expiringSoon = mockContracts.filter(
    (c) => c.status === 'active' && c.daysUntilExpiry !== undefined && c.daysUntilExpiry <= 30,
  );

  return (
    <div className="flex flex-col h-full bg-surface-secondary">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-white">
        <div className="flex items-center text-sm text-ink-tertiary mb-1">
          <span>Consul</span>
          <ChevronRight className="w-3.5 h-3.5 mx-1" />
          <span className="text-ink-secondary font-medium">Contracts</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div>
            <h1 className="text-2xl font-display font-bold text-ink">Contracts</h1>
            <p className="text-sm text-ink-tertiary mt-0.5">
              {mockContracts.filter((c) => c.status === 'active').length} active contracts
            </p>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-consul text-white rounded-lg hover:bg-consul-dark font-medium shadow-sm">
            <Plus className="w-4 h-4" />
            New Contract
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
        {/* Expiring Soon Alert */}
        {expiringSoon.length > 0 && (
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              <h2 className="text-sm font-semibold text-amber-800">Expiring Soon</h2>
              <span className="text-xs bg-amber-200 text-amber-800 px-2 py-0.5 rounded-full font-medium">
                {expiringSoon.length}
              </span>
            </div>
            <div className="space-y-2">
              {expiringSoon.map((c) => (
                <div
                  key={c.id}
                  className="flex items-center justify-between bg-white rounded-lg border border-amber-200 px-4 py-2.5 hover:shadow-sm transition-shadow cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <FileSignature className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="text-sm font-medium text-ink">{c.title}</p>
                      <p className="text-xs text-ink-tertiary">{c.client}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-semibold text-amber-700">{c.daysUntilExpiry} days</p>
                    <p className="text-xs text-ink-faint">Expires {c.endDate}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
            <input
              type="text"
              placeholder="Search contracts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-consul/30 focus:border-consul bg-white"
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
            <option value="signed">Signed</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
        </div>

        {/* Contracts Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Contract</th>
                <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Client</th>
                <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Dates</th>
                <th className="text-right text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Value</th>
                <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Signature</th>
                <th className="w-10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((contract) => {
                const sc = statusConfig[contract.status];
                return (
                  <tr key={contract.id} className="hover:bg-slate-50/50 cursor-pointer group">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <FileSignature className="w-4 h-4 text-consul flex-shrink-0" />
                        <div>
                          <p className="text-sm font-medium text-ink">{contract.title}</p>
                          <span className="text-[10px] px-1.5 py-0.5 bg-slate-100 text-slate-500 rounded font-medium">
                            {contract.type}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5 text-sm text-ink-secondary">
                        <Building2 className="w-3.5 h-3.5 text-ink-faint" />
                        {contract.client}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${sc.className}`}>
                        {sc.icon}
                        {sc.label}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1 text-xs text-ink-secondary">
                        <CalendarDays className="w-3 h-3 text-ink-faint" />
                        {contract.startDate}
                      </div>
                      <div className="flex items-center gap-1 text-xs text-ink-faint mt-0.5">
                        <span className="w-3 h-3 flex items-center justify-center text-[10px]">to</span>
                        {contract.endDate}
                      </div>
                      {contract.daysUntilExpiry !== undefined && contract.status === 'active' && (
                        <p
                          className={`text-[10px] mt-0.5 font-medium ${
                            contract.daysUntilExpiry <= 30 ? 'text-amber-600' : 'text-ink-faint'
                          }`}
                        >
                          {contract.daysUntilExpiry}d remaining
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <DollarSign className="w-3 h-3 text-ink-faint" />
                        <span className="text-sm font-semibold text-ink">{fmt(contract.value, contract.currency)}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      {contract.signedDate ? (
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="w-4 h-4 text-emerald-500" />
                          <div>
                            <p className="text-xs text-emerald-700 font-medium">Signed</p>
                            <p className="text-[10px] text-ink-faint">{contract.signedBy} - {contract.signedDate}</p>
                          </div>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-ink-faint" />
                          <span className="text-xs text-ink-faint">Pending</span>
                        </div>
                      )}
                    </td>
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

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-ink-tertiary">
              <FileSignature className="w-10 h-10 mb-2 text-ink-faint" />
              <p className="text-sm">No contracts match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Contracts;
