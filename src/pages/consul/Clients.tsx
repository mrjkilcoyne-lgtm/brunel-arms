import React, { useState } from 'react';
import {
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  ChevronRight,
  Mail,
  Phone,
  Building2,
  Tag,
  MoreHorizontal,
  Clock,
  Users,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ClientStatus = 'active' | 'lead' | 'inactive' | 'prospect';

interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  status: ClientStatus;
  tags: string[];
  source: string;
  lastActivity: string;
  lastActivityDate: string;
  avatarInitials: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockClients: Client[] = [
  { id: '1', name: 'James Whitfield', company: 'Barclays Corporate', email: 'j.whitfield@barclays.co.uk', phone: '+44 20 7116 1234', status: 'active', tags: ['finance', 'enterprise'], source: 'Referral', lastActivity: 'Meeting scheduled', lastActivityDate: '2026-03-10', avatarInitials: 'JW' },
  { id: '2', name: 'Victoria Hargreaves', company: 'Rolls-Royce PLC', email: 'v.hargreaves@rolls-royce.com', phone: '+44 1332 242424', status: 'active', tags: ['engineering', 'enterprise'], source: 'Conference', lastActivity: 'Proposal sent', lastActivityDate: '2026-03-08', avatarInitials: 'VH' },
  { id: '3', name: 'Sarah Chen', company: 'Telstra Digital', email: 's.chen@telstra.com.au', phone: '+61 3 8647 4700', status: 'lead', tags: ['telecom', 'apac'], source: 'Website', lastActivity: 'Initial call completed', lastActivityDate: '2026-03-07', avatarInitials: 'SC' },
  { id: '4', name: 'Priya Nair', company: 'HSBC Global', email: 'p.nair@hsbc.com', phone: '+44 20 7991 8888', status: 'active', tags: ['finance', 'enterprise'], source: 'Existing Client', lastActivity: 'Invoice paid', lastActivityDate: '2026-03-11', avatarInitials: 'PN' },
  { id: '5', name: 'David Tremblay', company: 'Maple Leaf Analytics', email: 'd.tremblay@mapleleaf.ca', phone: '+1 416 555 0199', status: 'prospect', tags: ['data', 'canada'], source: 'LinkedIn', lastActivity: 'Email opened', lastActivityDate: '2026-03-09', avatarInitials: 'DT' },
  { id: '6', name: 'Charlotte Webb', company: 'Unilever UK', email: 'c.webb@unilever.com', phone: '+44 20 7822 5252', status: 'active', tags: ['fmcg', 'enterprise'], source: 'Referral', lastActivity: 'Contract negotiation', lastActivityDate: '2026-03-11', avatarInitials: 'CW' },
  { id: '7', name: 'Tom Richards', company: 'BHP Consulting', email: 't.richards@bhp.com.au', phone: '+61 3 9609 3333', status: 'lead', tags: ['mining', 'apac'], source: 'Tender', lastActivity: 'Qualification call', lastActivityDate: '2026-03-06', avatarInitials: 'TR' },
  { id: '8', name: 'Michael Fontaine', company: 'TD Bank Group', email: 'm.fontaine@td.com', phone: '+1 416 982 8222', status: 'active', tags: ['finance', 'canada'], source: 'Conference', lastActivity: 'SOW review', lastActivityDate: '2026-03-10', avatarInitials: 'MF' },
  { id: '9', name: 'Rebecca Liu', company: 'Atlassian', email: 'r.liu@atlassian.com', phone: '+61 2 9262 1443', status: 'active', tags: ['tech', 'apac'], source: 'Website', lastActivity: 'Project kickoff', lastActivityDate: '2026-03-12', avatarInitials: 'RL' },
  { id: '10', name: 'Andrew Pemberton', company: 'Lloyds Banking', email: 'a.pemberton@lloydsbanking.com', phone: '+44 20 7626 1500', status: 'inactive', tags: ['finance'], source: 'Existing Client', lastActivity: 'Project completed', lastActivityDate: '2026-02-15', avatarInitials: 'AP' },
  { id: '11', name: 'Emma Ngata', company: 'Air New Zealand', email: 'e.ngata@airnz.co.nz', phone: '+64 9 336 2400', status: 'prospect', tags: ['aviation', 'nz'], source: 'Partner', lastActivity: 'Intro email sent', lastActivityDate: '2026-03-05', avatarInitials: 'EN' },
  { id: '12', name: 'Marcus O\'Brien', company: 'Shopify APAC', email: 'm.obrien@shopify.com', phone: '+61 2 8005 1234', status: 'lead', tags: ['ecommerce', 'tech'], source: 'Referral', lastActivity: 'Demo booked', lastActivityDate: '2026-03-09', avatarInitials: 'MO' },
];

const statusConfig: Record<ClientStatus, { label: string; className: string }> = {
  active: { label: 'Active', className: 'bg-emerald-100 text-emerald-700' },
  lead: { label: 'Lead', className: 'bg-blue-100 text-blue-700' },
  prospect: { label: 'Prospect', className: 'bg-amber-100 text-amber-700' },
  inactive: { label: 'Inactive', className: 'bg-slate-100 text-slate-500' },
};

const allTags = Array.from(new Set(mockClients.flatMap((c) => c.tags))).sort();
const allSources = Array.from(new Set(mockClients.map((c) => c.source))).sort();

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Clients: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [tagFilter, setTagFilter] = useState<string>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('all');

  const filtered = mockClients.filter((c) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (
        !c.name.toLowerCase().includes(q) &&
        !c.company.toLowerCase().includes(q) &&
        !c.email.toLowerCase().includes(q)
      )
        return false;
    }
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (tagFilter !== 'all' && !c.tags.includes(tagFilter)) return false;
    if (sourceFilter !== 'all' && c.source !== sourceFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-surface-secondary">
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-slate-200 bg-white">
        <div className="flex items-center text-sm text-ink-tertiary mb-1">
          <span>Consul</span>
          <ChevronRight className="w-3.5 h-3.5 mx-1" />
          <span className="text-ink-secondary font-medium">Clients</span>
        </div>
        <div className="flex items-center justify-between mt-1">
          <div>
            <h1 className="text-2xl font-display font-bold text-ink">Clients</h1>
            <p className="text-sm text-ink-tertiary mt-0.5">{mockClients.length} total clients</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-ink-secondary">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-ink-secondary">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-consul text-white rounded-lg hover:bg-consul-dark font-medium shadow-sm">
              <Plus className="w-4 h-4" />
              Add Client
            </button>
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
              placeholder="Search clients..."
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
            <option value="lead">Lead</option>
            <option value="prospect">Prospect</option>
            <option value="inactive">Inactive</option>
          </select>
          <select
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-consul/30 focus:border-consul text-ink-secondary bg-white"
          >
            <option value="all">All Tags</option>
            {allTags.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
          <select
            value={sourceFilter}
            onChange={(e) => setSourceFilter(e.target.value)}
            className="text-sm border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-consul/30 focus:border-consul text-ink-secondary bg-white"
          >
            <option value="all">All Sources</option>
            {allSources.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Client List */}
      <div className="flex-1 overflow-y-auto px-6 py-4">
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100">
                <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Client</th>
                <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Contact</th>
                <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Status</th>
                <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Tags</th>
                <th className="text-left text-xs font-medium text-ink-tertiary uppercase tracking-wide px-4 py-3">Last Activity</th>
                <th className="w-10 px-4 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((client) => (
                <tr key={client.id} className="hover:bg-slate-50/50 cursor-pointer group">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-consul/10 text-consul font-semibold text-sm flex items-center justify-center flex-shrink-0">
                        {client.avatarInitials}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">{client.name}</p>
                        <div className="flex items-center gap-1 text-xs text-ink-tertiary">
                          <Building2 className="w-3 h-3" />
                          {client.company}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-1.5 text-xs text-ink-secondary">
                        <Mail className="w-3 h-3 text-ink-faint" />
                        {client.email}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-ink-tertiary">
                        <Phone className="w-3 h-3 text-ink-faint" />
                        {client.phone}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${statusConfig[client.status].className}`}
                    >
                      {statusConfig[client.status].label}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      {client.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 bg-blue-50 text-blue-700 rounded font-medium"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <p className="text-xs text-ink-secondary">{client.lastActivity}</p>
                    <div className="flex items-center gap-1 text-[10px] text-ink-faint mt-0.5">
                      <Clock className="w-3 h-3" />
                      {client.lastActivityDate}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity text-ink-faint hover:text-ink-secondary">
                      <MoreHorizontal className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-ink-tertiary">
              <Users className="w-10 h-10 mb-2 text-ink-faint" />
              <p className="text-sm">No clients match your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Clients;
