import React, { useState } from 'react';
import {
  Plus,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Building2,
  User,
  Clock,
  MoreHorizontal,
  Filter,
  Search,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface Deal {
  id: string;
  company: string;
  contact: string;
  value: number;
  currency: string;
  probability: number;
  daysInStage: number;
  source: string;
  tags: string[];
}

interface PipelineColumn {
  key: string;
  label: string;
  color: string;
  deals: Deal[];
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const columns: PipelineColumn[] = [
  {
    key: 'lead',
    label: 'Lead',
    color: 'bg-slate-100 border-slate-300',
    deals: [
      { id: '1', company: 'Barclays Corporate', contact: 'James Whitfield', value: 45000, currency: 'GBP', probability: 10, daysInStage: 2, source: 'Referral', tags: ['finance'] },
      { id: '2', company: 'Telstra Digital', contact: 'Sarah Chen', value: 62000, currency: 'AUD', probability: 15, daysInStage: 5, source: 'Website', tags: ['telecom'] },
      { id: '3', company: 'Maple Leaf Analytics', contact: 'David Tremblay', value: 38000, currency: 'CAD', probability: 10, daysInStage: 1, source: 'LinkedIn', tags: ['data'] },
    ],
  },
  {
    key: 'qualified',
    label: 'Qualified',
    color: 'bg-blue-50 border-blue-300',
    deals: [
      { id: '4', company: 'Rolls-Royce PLC', contact: 'Victoria Hargreaves', value: 120000, currency: 'GBP', probability: 30, daysInStage: 8, source: 'Conference', tags: ['engineering', 'enterprise'] },
      { id: '5', company: 'Shopify APAC', contact: 'Marcus O\'Brien', value: 85000, currency: 'USD', probability: 35, daysInStage: 4, source: 'Referral', tags: ['ecommerce'] },
    ],
  },
  {
    key: 'proposal',
    label: 'Proposal',
    color: 'bg-indigo-50 border-indigo-300',
    deals: [
      { id: '6', company: 'HSBC Global', contact: 'Priya Nair', value: 210000, currency: 'GBP', probability: 50, daysInStage: 12, source: 'Existing Client', tags: ['finance', 'enterprise'] },
      { id: '7', company: 'BHP Consulting', contact: 'Tom Richards', value: 95000, currency: 'AUD', probability: 45, daysInStage: 6, source: 'Tender', tags: ['mining'] },
      { id: '8', company: 'Air New Zealand', contact: 'Emma Ngata', value: 74000, currency: 'NZD', probability: 55, daysInStage: 3, source: 'Partner', tags: ['aviation'] },
    ],
  },
  {
    key: 'negotiation',
    label: 'Negotiation',
    color: 'bg-amber-50 border-amber-300',
    deals: [
      { id: '9', company: 'Unilever UK', contact: 'Charlotte Webb', value: 175000, currency: 'GBP', probability: 75, daysInStage: 15, source: 'Referral', tags: ['fmcg', 'enterprise'] },
      { id: '10', company: 'TD Bank Group', contact: 'Michael Fontaine', value: 130000, currency: 'CAD', probability: 70, daysInStage: 9, source: 'Conference', tags: ['finance'] },
    ],
  },
  {
    key: 'won',
    label: 'Won',
    color: 'bg-emerald-50 border-emerald-300',
    deals: [
      { id: '11', company: 'Lloyds Banking', contact: 'Andrew Pemberton', value: 92000, currency: 'GBP', probability: 100, daysInStage: 0, source: 'Existing Client', tags: ['finance'] },
      { id: '12', company: 'Atlassian', contact: 'Rebecca Liu', value: 68000, currency: 'AUD', probability: 100, daysInStage: 0, source: 'Website', tags: ['tech'] },
    ],
  },
  {
    key: 'lost',
    label: 'Lost',
    color: 'bg-red-50 border-red-300',
    deals: [
      { id: '13', company: 'Vodafone NZ', contact: 'Ben Holt', value: 54000, currency: 'NZD', probability: 0, daysInStage: 0, source: 'Tender', tags: ['telecom'] },
    ],
  },
];

const currencySymbols: Record<string, string> = {
  GBP: '£',
  USD: '$',
  AUD: 'A$',
  CAD: 'C$',
  NZD: 'NZ$',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatCurrency(value: number, currency: string): string {
  const symbol = currencySymbols[currency] ?? currency + ' ';
  if (value >= 1000) {
    return `${symbol}${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k`;
  }
  return `${symbol}${value.toLocaleString()}`;
}

function columnTotal(deals: Deal[]): number {
  return deals.reduce((sum, d) => sum + d.value, 0);
}

function weightedTotal(deals: Deal[]): number {
  return deals.reduce((sum, d) => sum + d.value * (d.probability / 100), 0);
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Pipeline: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const allDeals = columns.flatMap((c) => c.deals);
  const totalPipelineValue = allDeals.reduce((s, d) => s + d.value, 0);
  const totalWeightedValue = weightedTotal(allDeals);
  const wonDeals = columns.find((c) => c.key === 'won')?.deals ?? [];
  const wonValue = columnTotal(wonDeals);

  return (
    <div className="flex flex-col h-full">
      {/* Page Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-white">
        <div className="flex items-center text-sm text-ink-tertiary mb-1">
          <span>Consul</span>
          <ChevronRight className="w-3.5 h-3.5 mx-1" />
          <span className="text-ink-secondary font-medium">Pipeline</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <h1 className="text-2xl font-display font-bold text-ink">Sales Pipeline</h1>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
              <input
                type="text"
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-consul/30 focus:border-consul w-56"
              />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-ink-secondary">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-consul text-white rounded-lg hover:bg-consul-dark font-medium shadow-sm">
              <Plus className="w-4 h-4" />
              Add Deal
            </button>
          </div>
        </div>

        {/* KPI Summary */}
        <div className="grid grid-cols-4 gap-4 mt-4">
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
              <DollarSign className="w-3.5 h-3.5" />
              Total Pipeline
            </div>
            <p className="text-xl font-bold text-ink mt-1">
              £{(totalPipelineValue / 1000).toFixed(0)}k
            </p>
          </div>
          <div className="bg-blue-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
              <TrendingUp className="w-3.5 h-3.5" />
              Weighted Value
            </div>
            <p className="text-xl font-bold text-consul mt-1">
              £{(totalWeightedValue / 1000).toFixed(0)}k
            </p>
          </div>
          <div className="bg-emerald-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
              <DollarSign className="w-3.5 h-3.5" />
              Won This Quarter
            </div>
            <p className="text-xl font-bold text-emerald-700 mt-1">
              £{(wonValue / 1000).toFixed(0)}k
            </p>
          </div>
          <div className="bg-slate-50 rounded-lg p-3">
            <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
              <Building2 className="w-3.5 h-3.5" />
              Active Deals
            </div>
            <p className="text-xl font-bold text-ink mt-1">{allDeals.length}</p>
          </div>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-4 h-full min-w-max">
          {columns.map((col) => {
            const filtered = searchQuery
              ? col.deals.filter(
                  (d) =>
                    d.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    d.contact.toLowerCase().includes(searchQuery.toLowerCase()),
                )
              : col.deals;

            return (
              <div
                key={col.key}
                className={`flex flex-col w-72 rounded-xl border ${col.color} bg-opacity-50`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-slate-200/60">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm text-ink">{col.label}</h3>
                    <span className="bg-white text-xs font-medium text-ink-tertiary px-2 py-0.5 rounded-full border border-slate-200">
                      {filtered.length}
                    </span>
                  </div>
                  <span className="text-xs font-medium text-ink-tertiary">
                    £{(columnTotal(filtered) / 1000).toFixed(0)}k
                  </span>
                </div>

                {/* Cards */}
                <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
                  {filtered.map((deal) => (
                    <div
                      key={deal.id}
                      className="bg-white rounded-lg border border-slate-200 p-3.5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-1.5 text-xs text-consul font-semibold">
                          <Building2 className="w-3.5 h-3.5" />
                          {deal.company}
                        </div>
                        <button className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-faint hover:text-ink-secondary">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5 mt-2 text-xs text-ink-secondary">
                        <User className="w-3 h-3 text-ink-faint" />
                        {deal.contact}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        <span className="text-sm font-bold text-ink">
                          {formatCurrency(deal.value, deal.currency)}
                        </span>
                        <span className="text-xs text-ink-tertiary">{deal.probability}%</span>
                      </div>

                      {/* Probability bar */}
                      <div className="w-full bg-slate-100 rounded-full h-1 mt-2">
                        <div
                          className="bg-consul rounded-full h-1 transition-all"
                          style={{ width: `${deal.probability}%` }}
                        />
                      </div>

                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex gap-1">
                          {deal.tags.slice(0, 2).map((tag) => (
                            <span
                              key={tag}
                              className="text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-medium"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                        {deal.daysInStage > 0 && (
                          <div className="flex items-center gap-1 text-[10px] text-ink-faint">
                            <Clock className="w-3 h-3" />
                            {deal.daysInStage}d
                          </div>
                        )}
                      </div>
                    </div>
                  ))}

                  {/* Add deal placeholder */}
                  <button className="w-full py-2 border border-dashed border-slate-300 rounded-lg text-xs text-ink-faint hover:text-ink-tertiary hover:border-slate-400 transition-colors flex items-center justify-center gap-1">
                    <Plus className="w-3.5 h-3.5" />
                    Add deal
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Pipeline;
