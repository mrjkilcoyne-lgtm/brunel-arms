import React, { useState } from 'react';
import {
  Megaphone,
  Plus,
  Play,
  Pause,
  CheckCircle2,
  Clock,
  FileEdit,
  Users,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
  Zap,
  CalendarDays,
  ToggleLeft,
  ToggleRight,
  Flame,
  Gift,
  Heart,
  Crown,
  Target,
  BarChart3,
  Copy,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type CampaignType = 'Welcome' | 'Win-back' | 'Birthday' | 'Tier-upgrade' | 'Custom';
type CampaignStatus = 'active' | 'scheduled' | 'draft' | 'paused' | 'completed';

interface Campaign {
  id: string;
  name: string;
  type: CampaignType;
  status: CampaignStatus;
  audienceSize: number;
  sent: number;
  opened: number;
  converted: number;
  revenue: string;
  startDate: string;
  endDate: string;
}

interface ABTest {
  id: string;
  campaignName: string;
  variantA: { name: string; openRate: number; conversionRate: number; revenue: string };
  variantB: { name: string; openRate: number; conversionRate: number; revenue: string };
  winner: 'A' | 'B' | null;
  confidence: number;
}

interface AutoTrigger {
  id: string;
  name: string;
  description: string;
  type: string;
  enabled: boolean;
  lastTriggered: string;
  timesTriggered: number;
}

interface ScheduleItem {
  id: string;
  name: string;
  date: string;
  type: CampaignType;
  status: CampaignStatus;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const campaigns: Campaign[] = [
  {
    id: '1',
    name: 'Spring Welcome Bonus',
    type: 'Welcome',
    status: 'active',
    audienceSize: 340,
    sent: 340,
    opened: 278,
    converted: 124,
    revenue: '£2,480',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
  },
  {
    id: '2',
    name: 'We Miss You — 100 Bonus Pts',
    type: 'Win-back',
    status: 'active',
    audienceSize: 562,
    sent: 562,
    opened: 312,
    converted: 87,
    revenue: '£1,740',
    startDate: '2026-03-05',
    endDate: '2026-04-05',
  },
  {
    id: '3',
    name: 'March Birthday Treats',
    type: 'Birthday',
    status: 'active',
    audienceSize: 89,
    sent: 89,
    opened: 74,
    converted: 52,
    revenue: '£780',
    startDate: '2026-03-01',
    endDate: '2026-03-31',
  },
  {
    id: '4',
    name: 'Silver Tier Unlock',
    type: 'Tier-upgrade',
    status: 'scheduled',
    audienceSize: 214,
    sent: 0,
    opened: 0,
    converted: 0,
    revenue: '£0',
    startDate: '2026-04-01',
    endDate: '2026-04-30',
  },
  {
    id: '5',
    name: 'Easter Double Points',
    type: 'Custom',
    status: 'draft',
    audienceSize: 2847,
    sent: 0,
    opened: 0,
    converted: 0,
    revenue: '£0',
    startDate: '2026-04-03',
    endDate: '2026-04-06',
  },
  {
    id: '6',
    name: 'February Win-back Push',
    type: 'Win-back',
    status: 'completed',
    audienceSize: 410,
    sent: 410,
    opened: 241,
    converted: 73,
    revenue: '£1,460',
    startDate: '2026-02-01',
    endDate: '2026-02-28',
  },
];

const abTests: ABTest[] = [
  {
    id: '1',
    campaignName: 'Spring Welcome Bonus',
    variantA: { name: '50 bonus pts', openRate: 78.2, conversionRate: 32.1, revenue: '£1,120' },
    variantB: { name: '10% off first order', openRate: 84.5, conversionRate: 39.4, revenue: '£1,360' },
    winner: 'B',
    confidence: 94,
  },
  {
    id: '2',
    campaignName: 'We Miss You',
    variantA: { name: 'Push notification', openRate: 52.3, conversionRate: 14.8, revenue: '£840' },
    variantB: { name: 'SMS + email', openRate: 58.7, conversionRate: 16.2, revenue: '£900' },
    winner: null,
    confidence: 72,
  },
];

const autoTriggers: AutoTrigger[] = [
  { id: '1', name: 'Welcome Series', description: 'Send 3-part onboarding sequence on signup', type: 'Welcome', enabled: true, lastTriggered: '2 hrs ago', timesTriggered: 1842 },
  { id: '2', name: 'Birthday Reward', description: 'Auto-credit 50 pts on customer birthday', type: 'Birthday', enabled: true, lastTriggered: '6 hrs ago', timesTriggered: 724 },
  { id: '3', name: 'Lapse Warning', description: 'Notify after 30 days of inactivity', type: 'Win-back', enabled: true, lastTriggered: '1 day ago', timesTriggered: 387 },
  { id: '4', name: 'Tier Upgrade Celebration', description: 'Congratulations message on tier change', type: 'Tier-upgrade', enabled: true, lastTriggered: '3 days ago', timesTriggered: 291 },
  { id: '5', name: 'Points Expiry Reminder', description: 'Alert 14 days before points expire', type: 'Custom', enabled: false, lastTriggered: 'Never', timesTriggered: 0 },
];

const schedule: ScheduleItem[] = [
  { id: '1', name: 'Silver Tier Unlock', date: '1 Apr', type: 'Tier-upgrade', status: 'scheduled' },
  { id: '2', name: 'Easter Double Points', date: '3 Apr', type: 'Custom', status: 'draft' },
  { id: '3', name: 'April Birthday Treats', date: '1 Apr', type: 'Birthday', status: 'scheduled' },
  { id: '4', name: 'Summer Referral Push', date: '1 Jun', type: 'Custom', status: 'draft' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const typeIcon = (t: CampaignType) => {
  const map: Record<CampaignType, React.ReactNode> = {
    Welcome: <Gift className="h-4 w-4 text-green-500" />,
    'Win-back': <Heart className="h-4 w-4 text-red-500" />,
    Birthday: <Flame className="h-4 w-4 text-pink-500" />,
    'Tier-upgrade': <Crown className="h-4 w-4 text-amber-500" />,
    Custom: <Target className="h-4 w-4 text-blue-500" />,
  };
  return map[t];
};

const statusBadge = (s: CampaignStatus) => {
  const map: Record<CampaignStatus, { icon: React.ReactNode; cls: string }> = {
    active: { icon: <Play className="h-3 w-3" />, cls: 'bg-green-100 text-green-700' },
    scheduled: { icon: <Clock className="h-3 w-3" />, cls: 'bg-blue-100 text-blue-700' },
    draft: { icon: <FileEdit className="h-3 w-3" />, cls: 'bg-gray-100 text-gray-600' },
    paused: { icon: <Pause className="h-3 w-3" />, cls: 'bg-amber-100 text-amber-700' },
    completed: { icon: <CheckCircle2 className="h-3 w-3" />, cls: 'bg-purple-100 text-purple-700' },
  };
  const cfg = map[s];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${cfg.cls}`}>
      {cfg.icon}
      {s.charAt(0).toUpperCase() + s.slice(1)}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Campaigns: React.FC = () => {
  const [triggers, setTriggers] = useState(autoTriggers);

  const toggleTrigger = (id: string) => {
    setTriggers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t)),
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
            <Megaphone className="h-5 w-5 text-hearth" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
            <p className="text-sm text-gray-500">Loyalty marketing and automated triggers</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Copy className="h-4 w-4" />
            Duplicate
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg bg-hearth px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-hearth-dark">
            <Plus className="h-4 w-4" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Campaign Cards */}
      <div>
        <h2 className="mb-3 text-base font-semibold text-gray-900">All Campaigns</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {campaigns.map((c) => {
            const openRate = c.sent > 0 ? ((c.opened / c.sent) * 100).toFixed(1) : '—';
            const convRate = c.sent > 0 ? ((c.converted / c.sent) * 100).toFixed(1) : '—';
            return (
              <div
                key={c.id}
                className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {typeIcon(c.type)}
                    <span className="text-xs font-medium text-gray-500">{c.type}</span>
                  </div>
                  {statusBadge(c.status)}
                </div>
                <h3 className="mt-2 text-sm font-semibold text-gray-900">{c.name}</h3>
                <p className="mt-0.5 text-xs text-gray-500">
                  {c.startDate} — {c.endDate}
                </p>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Audience</p>
                    <p className="text-sm font-bold text-gray-800">
                      <Users className="mr-1 inline h-3 w-3" />
                      {c.audienceSize.toLocaleString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Revenue</p>
                    <p className="text-sm font-bold text-gray-800">{c.revenue}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Open Rate</p>
                    <p className="text-sm font-bold text-gray-800">{openRate}%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Conversion</p>
                    <p className="text-sm font-bold text-gray-800">{convRate}%</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* A/B Test Results */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-orange-500" />
            <h2 className="text-base font-semibold text-gray-900">A/B Test Results</h2>
          </div>

          <div className="mt-4 space-y-4">
            {abTests.map((t) => (
              <div key={t.id} className="rounded-lg border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm font-medium text-gray-800">{t.campaignName}</p>
                <p className="text-xs text-gray-500">
                  Confidence: {t.confidence}%
                  {t.winner && (
                    <span className="ml-2 rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                      Winner: Variant {t.winner}
                    </span>
                  )}
                </p>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  {[t.variantA, t.variantB].map((v, i) => {
                    const label = i === 0 ? 'A' : 'B';
                    const isWinner = t.winner === label;
                    return (
                      <div
                        key={label}
                        className={`rounded-lg border p-3 ${
                          isWinner ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'
                        }`}
                      >
                        <p className="text-xs font-semibold text-gray-600">
                          Variant {label}: {v.name}
                        </p>
                        <div className="mt-2 space-y-1 text-xs text-gray-600">
                          <p>Open: <span className="font-medium text-gray-800">{v.openRate}%</span></p>
                          <p>Conversion: <span className="font-medium text-gray-800">{v.conversionRate}%</span></p>
                          <p>Revenue: <span className="font-medium text-gray-800">{v.revenue}</span></p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Automated Triggers */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            <h2 className="text-base font-semibold text-gray-900">Automated Triggers</h2>
          </div>

          <ul className="mt-4 space-y-2">
            {triggers.map((t) => (
              <li
                key={t.id}
                className="flex items-center justify-between rounded-lg border border-gray-100 px-3 py-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-gray-800">{t.name}</p>
                    <span className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                      {t.type}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">{t.description}</p>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    Last: {t.lastTriggered} · {t.timesTriggered.toLocaleString()} total
                  </p>
                </div>
                <button
                  onClick={() => toggleTrigger(t.id)}
                  className="ml-3 flex-shrink-0"
                  title={t.enabled ? 'Disable trigger' : 'Enable trigger'}
                >
                  {t.enabled ? (
                    <ToggleRight className="h-6 w-6 text-orange-500" />
                  ) : (
                    <ToggleLeft className="h-6 w-6 text-gray-300" />
                  )}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Schedule Timeline */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <CalendarDays className="h-5 w-5 text-orange-500" />
            <h2 className="text-base font-semibold text-gray-900">Upcoming Schedule</h2>
          </div>

          <ul className="relative mt-4 ml-3 border-l-2 border-orange-200 pl-4 space-y-4">
            {schedule.map((s) => (
              <li key={s.id} className="relative">
                <span className="absolute -left-[22px] top-1 h-3 w-3 rounded-full border-2 border-orange-400 bg-white" />
                <p className="text-sm font-medium text-gray-800">{s.name}</p>
                <div className="mt-0.5 flex items-center gap-2">
                  <span className="text-xs text-gray-500">{s.date}</span>
                  {statusBadge(s.status)}
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Campaign Builder Area */}
        <div className="rounded-xl border-2 border-dashed border-orange-300 bg-orange-50/50 p-5">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-100">
              <Megaphone className="h-7 w-7 text-orange-500" />
            </div>
            <h3 className="mt-4 text-base font-semibold text-gray-900">Campaign Builder</h3>
            <p className="mt-1 max-w-xs text-sm text-gray-500">
              Create targeted campaigns with drag-and-drop audience segments, reward rules and scheduling.
            </p>
            <button className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-hearth px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-hearth-dark">
              <Plus className="h-4 w-4" />
              Build a Campaign
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Campaigns;
