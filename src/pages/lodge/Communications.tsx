import React, { useState } from 'react';
import {
  MessageSquare,
  ChevronRight,
  Plus,
  Search,
  Send,
  Mail,
  Users,
  Eye,
  MousePointerClick,
  MoreHorizontal,
  CheckCircle2,
  Play,
  Pause,
  FileText,
  Sparkles,
  UserCheck,
  CalendarDays,
  AlertTriangle,
  ArrowRight,
  BarChart3,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CampaignStatus = 'sent' | 'scheduled' | 'draft' | 'active';
type CampaignType = 'email' | 'sms' | 'push';

interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  sentDate: string;
  recipients: number;
  openRate: number;
  clickRate: number;
  audience: string;
}

interface Template {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  uses: number;
}

interface DripCampaign {
  id: string;
  name: string;
  steps: number;
  enrolled: number;
  completionRate: number;
  status: 'active' | 'paused';
  trigger: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockCampaigns: Campaign[] = [
  { id: '1', name: 'March Renewal Reminders', type: 'email', status: 'sent', sentDate: '10 Mar 2026', recipients: 234, openRate: 68.4, clickRate: 24.1, audience: 'Expiring this month' },
  { id: '2', name: 'Welcome New Members Q1', type: 'email', status: 'sent', sentDate: '1 Mar 2026', recipients: 89, openRate: 82.1, clickRate: 45.3, audience: 'New joiners' },
  { id: '3', name: 'Gold Tier Exclusive Invite', type: 'email', status: 'sent', sentDate: '25 Feb 2026', recipients: 156, openRate: 71.8, clickRate: 31.7, audience: 'Gold members' },
  { id: '4', name: 'Lapsed Member Win-Back', type: 'email', status: 'active', sentDate: 'Ongoing', recipients: 312, openRate: 42.3, clickRate: 12.8, audience: 'Expired 30-90 days' },
  { id: '5', name: 'Spring Event Announcement', type: 'email', status: 'scheduled', sentDate: '15 Mar 2026', recipients: 1243, openRate: 0, clickRate: 0, audience: 'All active members' },
  { id: '6', name: 'Renewal SMS Nudge', type: 'sms', status: 'sent', sentDate: '8 Mar 2026', recipients: 67, openRate: 94.2, clickRate: 18.5, audience: 'Expiring in 7 days' },
  { id: '7', name: 'Birthday Rewards', type: 'email', status: 'draft', sentDate: '-', recipients: 0, openRate: 0, clickRate: 0, audience: 'March birthdays' },
];

const mockTemplates: Template[] = [
  { id: '1', name: 'Welcome', description: 'New member welcome email with onboarding steps', icon: UserCheck, color: 'bg-emerald-50 text-emerald-600', uses: 89 },
  { id: '2', name: 'Renewal', description: 'Membership renewal reminder with quick-pay link', icon: CalendarDays, color: 'bg-blue-50 text-blue-600', uses: 234 },
  { id: '3', name: 'Expired', description: 'Win-back message for lapsed members with offer', icon: AlertTriangle, color: 'bg-red-50 text-red-600', uses: 67 },
  { id: '4', name: 'Event', description: 'Event invitation with RSVP and event details', icon: Sparkles, color: 'bg-purple-50 text-purple-600', uses: 156 },
  { id: '5', name: 'Custom', description: 'Blank template for custom communications', icon: FileText, color: 'bg-slate-100 text-slate-600', uses: 42 },
];

const mockDripCampaigns: DripCampaign[] = [
  { id: '1', name: 'New Member Onboarding', steps: 5, enrolled: 89, completionRate: 76.4, status: 'active', trigger: 'Member signup' },
  { id: '2', name: 'Renewal Countdown', steps: 3, enrolled: 234, completionRate: 68.2, status: 'active', trigger: '30 days before expiry' },
  { id: '3', name: 'Win-Back Sequence', steps: 4, enrolled: 67, completionRate: 32.8, status: 'active', trigger: '7 days after expiry' },
  { id: '4', name: 'Tier Upgrade Path', steps: 6, enrolled: 156, completionRate: 45.1, status: 'paused', trigger: 'Points threshold reached' },
];

const statusConfig: Record<CampaignStatus, { label: string; bg: string; text: string; dot: string }> = {
  sent: { label: 'Sent', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500' },
  scheduled: { label: 'Scheduled', bg: 'bg-blue-50', text: 'text-blue-700', dot: 'bg-blue-500' },
  draft: { label: 'Draft', bg: 'bg-slate-100', text: 'text-slate-600', dot: 'bg-slate-400' },
  active: { label: 'Active', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-500' },
};

const typeIcons: Record<CampaignType, React.ElementType> = {
  email: Mail,
  sms: MessageSquare,
  push: Send,
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Communications: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'campaigns' | 'templates' | 'drip'>('campaigns');

  const filteredCampaigns = mockCampaigns.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.audience.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const totalSent = mockCampaigns.filter((c) => c.status === 'sent').reduce((sum, c) => sum + c.recipients, 0);
  const avgOpenRate =
    mockCampaigns.filter((c) => c.openRate > 0).reduce((sum, c) => sum + c.openRate, 0) /
    mockCampaigns.filter((c) => c.openRate > 0).length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center text-sm text-ink-tertiary mb-1">
        <span>Lodge</span>
        <ChevronRight className="w-3.5 h-3.5 mx-1" />
        <span className="text-ink-secondary font-medium">Communications</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lodge/10">
            <Mail className="h-5 w-5 text-lodge" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">Communications</h1>
            <p className="text-sm text-ink-tertiary">Manage campaigns, templates, and drip sequences</p>
          </div>
        </div>
        <button className="flex items-center gap-1.5 px-4 py-2 text-sm bg-lodge text-white rounded-lg hover:bg-lodge-dark font-medium shadow-sm">
          <Plus className="w-4 h-4" />
          New Campaign
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <Send className="w-3.5 h-3.5" />
            Total Sent
          </div>
          <p className="text-2xl font-bold text-ink mt-1">{totalSent.toLocaleString()}</p>
          <p className="text-xs text-ink-tertiary mt-1">This month</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <Eye className="w-3.5 h-3.5" />
            Avg Open Rate
          </div>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{avgOpenRate.toFixed(1)}%</p>
          <p className="text-xs text-ink-tertiary mt-1">Across all campaigns</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <MousePointerClick className="w-3.5 h-3.5" />
            Avg Click Rate
          </div>
          <p className="text-2xl font-bold text-blue-600 mt-1">
            {(mockCampaigns.filter((c) => c.clickRate > 0).reduce((sum, c) => sum + c.clickRate, 0) /
              mockCampaigns.filter((c) => c.clickRate > 0).length).toFixed(1)}%
          </p>
          <p className="text-xs text-ink-tertiary mt-1">Across all campaigns</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <BarChart3 className="w-3.5 h-3.5" />
            Active Drips
          </div>
          <p className="text-2xl font-bold text-ink mt-1">
            {mockDripCampaigns.filter((d) => d.status === 'active').length}
          </p>
          <p className="text-xs text-ink-tertiary mt-1">Running sequences</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200">
        <div className="flex gap-6">
          {(['campaigns', 'templates', 'drip'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 text-sm font-medium capitalize transition-colors border-b-2 ${
                activeTab === tab
                  ? 'border-lodge text-lodge'
                  : 'border-transparent text-ink-tertiary hover:text-ink-secondary'
              }`}
            >
              {tab === 'drip' ? 'Drip Campaigns' : tab}
            </button>
          ))}
        </div>
      </div>

      {/* Campaign List */}
      {activeTab === 'campaigns' && (
        <div className="space-y-4">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-lodge/30 focus:border-lodge"
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="px-6 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wide">Campaign</th>
                  <th className="px-6 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wide">Type</th>
                  <th className="px-6 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wide">Sent</th>
                  <th className="px-6 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wide">Recipients</th>
                  <th className="px-6 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wide">Open Rate</th>
                  <th className="px-6 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wide">Click Rate</th>
                  <th className="px-6 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wide">Status</th>
                  <th className="px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCampaigns.map((campaign) => {
                  const status = statusConfig[campaign.status];
                  const TypeIcon = typeIcons[campaign.type];

                  return (
                    <tr key={campaign.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="text-sm font-medium text-ink">{campaign.name}</p>
                        <p className="text-xs text-ink-tertiary">{campaign.audience}</p>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5">
                          <TypeIcon className="w-3.5 h-3.5 text-ink-tertiary" />
                          <span className="text-sm text-ink-secondary capitalize">{campaign.type}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-ink-secondary">{campaign.sentDate}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-ink">{campaign.recipients > 0 ? campaign.recipients.toLocaleString() : '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-ink">{campaign.openRate > 0 ? `${campaign.openRate}%` : '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-ink">{campaign.clickRate > 0 ? `${campaign.clickRate}%` : '-'}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
                          <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-ink-faint hover:text-ink-secondary">
                          <MoreHorizontal className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Template Gallery */}
      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {mockTemplates.map((template) => {
            const Icon = template.icon;
            return (
              <div
                key={template.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm hover:shadow-md transition-shadow cursor-pointer group"
              >
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${template.color} mb-4`}>
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-sm font-semibold text-ink">{template.name}</h3>
                <p className="text-xs text-ink-tertiary mt-1 line-clamp-2">{template.description}</p>
                <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-ink-faint">{template.uses} uses</span>
                  <button className="text-xs font-medium text-lodge opacity-0 group-hover:opacity-100 transition-opacity">
                    Use template
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drip Campaigns */}
      {activeTab === 'drip' && (
        <div className="space-y-4">
          {mockDripCampaigns.map((drip) => (
            <div
              key={drip.id}
              className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-lodge/10">
                    <Sparkles className="h-5 w-5 text-lodge" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-semibold text-ink">{drip.name}</h3>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        drip.status === 'active'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}>
                        {drip.status === 'active' ? (
                          <Play className="w-3 h-3" />
                        ) : (
                          <Pause className="w-3 h-3" />
                        )}
                        {drip.status === 'active' ? 'Active' : 'Paused'}
                      </span>
                    </div>
                    <p className="text-xs text-ink-tertiary mt-0.5">Trigger: {drip.trigger}</p>
                  </div>
                </div>
                <button className="text-ink-faint hover:text-ink-secondary">
                  <MoreHorizontal className="w-4 h-4" />
                </button>
              </div>

              {/* Step visualisation */}
              <div className="mt-4 ml-13 flex items-center gap-2">
                {Array.from({ length: drip.steps }).map((_, i) => (
                  <React.Fragment key={i}>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-lodge/10 text-lodge text-xs font-semibold">
                      {i + 1}
                    </div>
                    {i < drip.steps - 1 && (
                      <ArrowRight className="w-4 h-4 text-ink-faint" />
                    )}
                  </React.Fragment>
                ))}
              </div>

              {/* Stats */}
              <div className="mt-4 ml-13 flex items-center gap-6 text-xs text-ink-tertiary">
                <span className="flex items-center gap-1">
                  <Users className="w-3.5 h-3.5" />
                  {drip.enrolled} enrolled
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {drip.completionRate}% completion
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5" />
                  {drip.steps} steps
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Communications;
