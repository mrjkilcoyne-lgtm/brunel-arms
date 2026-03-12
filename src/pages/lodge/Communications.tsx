import React, { useState } from 'react';
import {
  Plus,
  Send,
  Mail,
  MessageSquare,
  BarChart3,
  MousePointerClick,
  Eye,
  Clock,
  CheckCircle2,
  FileText,
  Users,
  ChevronRight,
  Zap,
  Layers,
  Calendar,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CampaignStatus = 'sent' | 'scheduled' | 'draft';
type CampaignChannel = 'email' | 'sms';

interface Campaign {
  id: string;
  name: string;
  channel: CampaignChannel;
  status: CampaignStatus;
  sentDate?: string;
  scheduledDate?: string;
  recipients: number;
  openRate?: number;
  clickRate?: number;
  segment: string;
}

interface TemplateCard {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ElementType;
}

interface DripStep {
  id: string;
  label: string;
  delay: string;
  channel: CampaignChannel;
  status: 'completed' | 'active' | 'pending';
}

interface ScheduledItem {
  id: string;
  name: string;
  channel: CampaignChannel;
  scheduledDate: string;
  recipients: number;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_CAMPAIGNS: Campaign[] = [
  { id: '1', name: 'March Newsletter', channel: 'email', status: 'sent', sentDate: '2026-03-01', recipients: 539, openRate: 47.2, clickRate: 12.8, segment: 'All Active Members' },
  { id: '2', name: 'Renewal Reminder — Q1 Expiry', channel: 'email', status: 'sent', sentDate: '2026-02-15', recipients: 34, openRate: 68.1, clickRate: 41.2, segment: 'Expiring Q1' },
  { id: '3', name: 'Conference Early Bird Offer', channel: 'email', status: 'sent', sentDate: '2026-02-01', recipients: 539, openRate: 52.4, clickRate: 18.9, segment: 'All Active Members' },
  { id: '4', name: 'Lapsed Member Win-Back', channel: 'email', status: 'sent', sentDate: '2026-01-20', recipients: 28, openRate: 32.1, clickRate: 8.6, segment: 'Expired 6+ Months' },
  { id: '5', name: 'SMS — Event Reminder (London Meetup)', channel: 'sms', status: 'sent', sentDate: '2026-03-10', recipients: 43, openRate: 94.0, clickRate: undefined, segment: 'London HQ Active' },
  { id: '6', name: 'April Newsletter', channel: 'email', status: 'scheduled', scheduledDate: '2026-04-01', recipients: 545, segment: 'All Active Members' },
  { id: '7', name: 'Student Scholarship Announcement', channel: 'email', status: 'draft', recipients: 63, segment: 'Student Members' },
];

const MOCK_TEMPLATES: TemplateCard[] = [
  { id: '1', name: 'Welcome', description: 'Onboarding email sent when a new member joins.', category: 'Lifecycle', icon: CheckCircle2 },
  { id: '2', name: 'Renewal Reminder', description: 'Sent 30/14/7 days before membership expiry.', category: 'Lifecycle', icon: Clock },
  { id: '3', name: 'Expired Notice', description: 'Notification that membership has lapsed.', category: 'Lifecycle', icon: Mail },
  { id: '4', name: 'Thank You', description: 'Post-event or post-renewal appreciation.', category: 'Engagement', icon: FileText },
  { id: '5', name: 'Event Invitation', description: 'Invitation to upcoming lodge events.', category: 'Events', icon: Calendar },
  { id: '6', name: 'Custom', description: 'Start from a blank canvas.', category: 'Other', icon: Layers },
];

const DRIP_STEPS: DripStep[] = [
  { id: '1', label: 'Welcome Email', delay: 'Immediate', channel: 'email', status: 'completed' },
  { id: '2', label: 'Getting Started Guide', delay: '+3 days', channel: 'email', status: 'completed' },
  { id: '3', label: 'Community Introduction', delay: '+7 days', channel: 'email', status: 'active' },
  { id: '4', label: 'First Event Nudge', delay: '+14 days', channel: 'email', status: 'pending' },
  { id: '5', label: 'Feedback SMS', delay: '+30 days', channel: 'sms', status: 'pending' },
];

const MOCK_QUEUE: ScheduledItem[] = [
  { id: '1', name: 'April Newsletter', channel: 'email', scheduledDate: '2026-04-01T09:00:00', recipients: 545 },
  { id: '2', name: 'Renewal Reminder — Q2 Expiry', channel: 'email', scheduledDate: '2026-04-15T10:00:00', recipients: 41 },
  { id: '3', name: 'Melbourne Dinner RSVP', channel: 'sms', scheduledDate: '2026-04-16T11:00:00', recipients: 38 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
const fmtDateTime = (d: string) => {
  const dt = new Date(d);
  return dt.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' }) + ' at ' + dt.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
};

const statusBadge = (s: CampaignStatus) => {
  const map: Record<CampaignStatus, { bg: string; text: string; label: string }> = {
    sent: { bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Sent' },
    scheduled: { bg: 'bg-sky-50', text: 'text-sky-700', label: 'Scheduled' },
    draft: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Draft' },
  };
  const c = map[s];
  return <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>{c.label}</span>;
};

const channelIcon = (ch: CampaignChannel) =>
  ch === 'email' ? <Mail className="h-4 w-4 text-emerald-600" /> : <MessageSquare className="h-4 w-4 text-violet-600" />;

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Communications: React.FC = () => {
  const [tab, setTab] = useState<'campaigns' | 'templates' | 'drip' | 'queue'>('campaigns');
  const [search, setSearch] = useState('');

  const filteredCampaigns = search
    ? MOCK_CAMPAIGNS.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()))
    : MOCK_CAMPAIGNS;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communications</h1>
          <p className="mt-1 text-sm text-gray-500">Email and SMS campaigns, templates, and automation</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          New Campaign
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-gray-200">
        {([
          { key: 'campaigns', label: 'Campaigns' },
          { key: 'templates', label: 'Templates' },
          { key: 'drip', label: 'Drip Sequences' },
          { key: 'queue', label: 'Schedule Queue' },
        ] as const).map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`pb-2.5 text-sm font-medium transition-colors ${
              tab === t.key
                ? 'border-b-2 border-emerald-600 text-emerald-700'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ----------------------------------------------------------------- */}
      {/* Campaigns Tab */}
      {/* ----------------------------------------------------------------- */}
      {tab === 'campaigns' && (
        <div className="space-y-4">
          {/* Search */}
          <div className="relative max-w-sm">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-2 pl-10 pr-4 text-sm shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Campaign</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Recipients</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Open Rate</th>
                  <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Click Rate</th>
                  <th className="w-10 px-6 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredCampaigns.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-3">
                        {channelIcon(c.channel)}
                        <div>
                          <p className="text-sm font-medium text-gray-900">{c.name}</p>
                          <p className="text-xs text-gray-500">{c.segment}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3">{statusBadge(c.status)}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">
                      {c.sentDate ? fmtDate(c.sentDate) : c.scheduledDate ? fmtDate(c.scheduledDate) : '--'}
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-900 text-right">{c.recipients.toLocaleString()}</td>
                    <td className="px-6 py-3 text-sm text-right">
                      {c.openRate !== undefined ? (
                        <span className="inline-flex items-center gap-1 text-gray-900">
                          <Eye className="h-3 w-3 text-gray-400" /> {c.openRate}%
                        </span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-sm text-right">
                      {c.clickRate !== undefined ? (
                        <span className="inline-flex items-center gap-1 text-gray-900">
                          <MousePointerClick className="h-3 w-3 text-gray-400" /> {c.clickRate}%
                        </span>
                      ) : (
                        <span className="text-gray-400">--</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right">
                      <button className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Segment builder preview */}
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Segment Builder Preview</h3>
            <div className="flex flex-wrap items-center gap-2 text-sm">
              <span className="rounded-lg bg-emerald-50 px-3 py-1.5 font-medium text-emerald-700">Status = Active</span>
              <span className="text-gray-400 font-medium">AND</span>
              <span className="rounded-lg bg-sky-50 px-3 py-1.5 font-medium text-sky-700">Chapter = London HQ</span>
              <span className="text-gray-400 font-medium">AND</span>
              <span className="rounded-lg bg-violet-50 px-3 py-1.5 font-medium text-violet-700">Type = Individual OR Family</span>
              <ChevronRight className="h-4 w-4 text-gray-300" />
              <span className="rounded-lg bg-gray-100 px-3 py-1.5 font-semibold text-gray-800">
                <Users className="mr-1 inline h-3.5 w-3.5" />
                214 members matched
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Templates Tab */}
      {/* ----------------------------------------------------------------- */}
      {tab === 'templates' && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_TEMPLATES.map((t) => (
            <div key={t.id} className="flex flex-col rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
              <div className="flex items-center gap-3 mb-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600">
                  <t.icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-gray-900">{t.name}</h4>
                  <span className="text-xs text-gray-400">{t.category}</span>
                </div>
              </div>
              <p className="flex-1 text-sm text-gray-500">{t.description}</p>
              <div className="mt-4 flex gap-2">
                <button className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                  Preview
                </button>
                <button className="flex-1 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                  Use Template
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Drip Sequences Tab */}
      {/* ----------------------------------------------------------------- */}
      {tab === 'drip' && (
        <div className="space-y-4">
          <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">New Member Onboarding</h3>
                <p className="text-sm text-gray-500">Automated welcome sequence for newly joined members</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                  <Play className="h-3 w-3" /> Active
                </span>
              </div>
            </div>

            {/* Drip visualizer */}
            <div className="relative">
              {DRIP_STEPS.map((step, i) => (
                <div key={step.id} className="flex items-start gap-4 mb-0">
                  {/* Timeline */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                        step.status === 'completed'
                          ? 'border-emerald-500 bg-emerald-500 text-white'
                          : step.status === 'active'
                          ? 'border-emerald-500 bg-white text-emerald-500'
                          : 'border-gray-300 bg-white text-gray-400'
                      }`}
                    >
                      {step.status === 'completed' ? (
                        <CheckCircle2 className="h-4 w-4" />
                      ) : step.channel === 'email' ? (
                        <Mail className="h-3.5 w-3.5" />
                      ) : (
                        <MessageSquare className="h-3.5 w-3.5" />
                      )}
                    </div>
                    {i < DRIP_STEPS.length - 1 && (
                      <div className={`h-10 w-0.5 ${step.status === 'completed' ? 'bg-emerald-300' : 'bg-gray-200'}`} />
                    )}
                  </div>
                  {/* Content */}
                  <div className="pt-1 pb-6">
                    <p className="text-sm font-medium text-gray-900">{step.label}</p>
                    <p className="text-xs text-gray-500">{step.delay} &middot; {step.channel.toUpperCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------- */}
      {/* Schedule Queue Tab */}
      {/* ----------------------------------------------------------------- */}
      {tab === 'queue' && (
        <div className="space-y-4">
          {MOCK_QUEUE.length === 0 && (
            <div className="py-12 text-center text-sm text-gray-500">No scheduled items.</div>
          )}
          {MOCK_QUEUE.map((q) => (
            <div key={q.id} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-sky-50 text-sky-600">
                <Clock className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {channelIcon(q.channel)}
                  <p className="text-sm font-medium text-gray-900 truncate">{q.name}</p>
                </div>
                <p className="text-xs text-gray-500 mt-0.5">
                  Scheduled for {fmtDateTime(q.scheduledDate)} &middot; {q.recipients} recipients
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-50">
                  Edit
                </button>
                <button className="rounded-lg border border-red-200 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50">
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Communications;
