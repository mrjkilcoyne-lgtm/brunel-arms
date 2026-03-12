import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  Globe,
  Puzzle,
  Database,
  Save,
  ToggleLeft,
  ToggleRight,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

type SettingsTab = 'general' | 'modules' | 'integrations' | 'backup';

interface ModuleConfig {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  color: string;
}

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'connected' | 'disconnected';
  icon: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const initialModules: ModuleConfig[] = [
  { id: 'consul', name: 'Consul', description: 'CRM, project management, invoicing, and time tracking for consulting', enabled: true, color: 'bg-blue-500' },
  { id: 'hearth', name: 'Hearth', description: 'Loyalty programmes, merchant management, campaigns, and analytics', enabled: true, color: 'bg-orange-500' },
  { id: 'lodge', name: 'Lodge', description: 'Membership management, billing, events, and chapter coordination', enabled: true, color: 'bg-emerald-500' },
  { id: 'command', name: 'Command', description: 'Dashboard, calendar, files, wiki, reports, and team management', enabled: true, color: 'bg-purple-500' },
];

const integrations: Integration[] = [
  { id: '1', name: 'Stripe', description: 'Payment processing for invoices and memberships', status: 'connected', icon: 'S' },
  { id: '2', name: 'Xero', description: 'Accounting and bookkeeping sync', status: 'connected', icon: 'X' },
  { id: '3', name: 'Mailchimp', description: 'Email marketing and campaign automation', status: 'disconnected', icon: 'M' },
  { id: '4', name: 'Slack', description: 'Team notifications and workflow alerts', status: 'connected', icon: '#' },
  { id: '5', name: 'Google Workspace', description: 'Calendar, Drive, and email integration', status: 'disconnected', icon: 'G' },
  { id: '6', name: 'Zapier', description: 'Connect with 5,000+ third-party apps', status: 'disconnected', icon: 'Z' },
];

const backups = [
  { date: '12 Mar 2026, 03:00', size: '2.4 GB', status: 'Completed' },
  { date: '11 Mar 2026, 03:00', size: '2.3 GB', status: 'Completed' },
  { date: '10 Mar 2026, 03:00', size: '2.3 GB', status: 'Completed' },
  { date: '09 Mar 2026, 03:00', size: '2.2 GB', status: 'Completed' },
];

const tabs: { key: SettingsTab; label: string; icon: React.ElementType }[] = [
  { key: 'general', label: 'General', icon: Building2 },
  { key: 'modules', label: 'Modules', icon: Puzzle },
  { key: 'integrations', label: 'Integrations', icon: Globe },
  { key: 'backup', label: 'Backup', icon: Database },
];

// ── Component ──────────────────────────────────────────────────────────────────

const Settings: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('general');
  const [modules, setModules] = useState(initialModules);
  const [companyName, setCompanyName] = useState('CANZUK Ltd');
  const [email, setEmail] = useState('admin@canzuk.io');
  const [currency, setCurrency] = useState('GBP');
  const [timezone, setTimezone] = useState('Europe/London');

  const toggleModule = (id: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)),
    );
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-command/10">
          <SettingsIcon className="h-5 w-5 text-command" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-ink">Settings</h1>
          <p className="text-sm text-ink-tertiary">Manage your Forge platform configuration</p>
        </div>
      </div>

      <div className="flex gap-6">
        {/* Sidebar Tabs */}
        <div className="w-56 shrink-0 space-y-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  activeTab === tab.key
                    ? 'bg-command/10 text-command'
                    : 'text-ink-secondary hover:bg-surface-tertiary'
                }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
                {activeTab === tab.key && <ChevronRight className="ml-auto h-4 w-4" />}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          {/* General Tab */}
          {activeTab === 'general' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-ink">Company Information</h2>
                <p className="mt-1 text-sm text-ink-tertiary">Update your organisation details and preferences</p>
              </div>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Company Name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-command focus:outline-none focus:ring-2 focus:ring-command/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Admin Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-command focus:outline-none focus:ring-2 focus:ring-command/30"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Default Currency</label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-command focus:outline-none focus:ring-2 focus:ring-command/30"
                  >
                    <option value="GBP">GBP (£) — British Pound</option>
                    <option value="AUD">AUD (A$) — Australian Dollar</option>
                    <option value="NZD">NZD (NZ$) — New Zealand Dollar</option>
                    <option value="CAD">CAD (C$) — Canadian Dollar</option>
                    <option value="USD">USD ($) — US Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Timezone</label>
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-command focus:outline-none focus:ring-2 focus:ring-command/30"
                  >
                    <option value="Europe/London">Europe/London (GMT+0)</option>
                    <option value="Australia/Sydney">Australia/Sydney (GMT+11)</option>
                    <option value="Pacific/Auckland">Pacific/Auckland (GMT+13)</option>
                    <option value="America/Toronto">America/Toronto (GMT-5)</option>
                    <option value="Asia/Singapore">Asia/Singapore (GMT+8)</option>
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-3 border-t border-slate-100 pt-5">
                <button className="flex items-center gap-2 rounded-lg bg-command px-4 py-2 text-sm font-medium text-white hover:bg-command/90">
                  <Save className="h-4 w-4" />
                  Save Changes
                </button>
                <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-ink-secondary hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Modules Tab */}
          {activeTab === 'modules' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-ink">Module Configuration</h2>
                <p className="mt-1 text-sm text-ink-tertiary">Enable or disable Forge modules for your organisation</p>
              </div>

              <div className="space-y-3">
                {modules.map((mod) => (
                  <div
                    key={mod.id}
                    className="flex items-center justify-between rounded-lg border border-slate-200 p-4 transition-colors hover:bg-slate-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`h-10 w-10 rounded-lg ${mod.color} flex items-center justify-center text-white text-sm font-bold`}>
                        {mod.name.charAt(0)}
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-ink">{mod.name}</h3>
                        <p className="mt-0.5 text-xs text-ink-tertiary">{mod.description}</p>
                      </div>
                    </div>
                    <button onClick={() => toggleModule(mod.id)}>
                      {mod.enabled ? (
                        <ToggleRight className="h-7 w-7 text-command" />
                      ) : (
                        <ToggleLeft className="h-7 w-7 text-slate-300" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Integrations Tab */}
          {activeTab === 'integrations' && (
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold text-ink">Integrations</h2>
                <p className="mt-1 text-sm text-ink-tertiary">Connect external services to extend Forge capabilities</p>
              </div>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {integrations.map((int) => (
                  <div
                    key={int.id}
                    className="flex items-center gap-4 rounded-lg border border-slate-200 p-4"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-ink-secondary">
                      {int.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-sm font-semibold text-ink">{int.name}</h3>
                      <p className="mt-0.5 text-xs text-ink-tertiary">{int.description}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1.5">
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          int.status === 'connected'
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-slate-100 text-ink-faint'
                        }`}
                      >
                        {int.status === 'connected' ? 'Connected' : 'Disconnected'}
                      </span>
                      <button className="text-xs font-medium text-command hover:underline flex items-center gap-1">
                        {int.status === 'connected' ? 'Configure' : 'Connect'}
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Backup Tab */}
          {activeTab === 'backup' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-ink">Backup &amp; Recovery</h2>
                  <p className="mt-1 text-sm text-ink-tertiary">Automated daily backups with 30-day retention</p>
                </div>
                <button className="flex items-center gap-2 rounded-lg bg-command px-4 py-2 text-sm font-medium text-white hover:bg-command/90">
                  <Database className="h-4 w-4" />
                  Backup Now
                </button>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-sm font-medium text-emerald-700">All systems healthy</span>
                </div>
                <p className="mt-1 text-xs text-emerald-600">Last successful backup: 12 Mar 2026, 03:00 GMT — Next backup in 14h 22m</p>
              </div>

              <div>
                <h3 className="mb-3 text-sm font-semibold text-ink">Recent Backups</h3>
                <div className="overflow-hidden rounded-lg border border-slate-200">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-left">
                        <th className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-ink-tertiary">Date</th>
                        <th className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-ink-tertiary">Size</th>
                        <th className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-ink-tertiary">Status</th>
                        <th className="px-4 py-2.5 text-xs font-medium uppercase tracking-wider text-ink-tertiary">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {backups.map((backup, i) => (
                        <tr key={i} className="hover:bg-slate-50">
                          <td className="px-4 py-3 text-ink-secondary">{backup.date}</td>
                          <td className="px-4 py-3 text-ink-secondary">{backup.size}</td>
                          <td className="px-4 py-3">
                            <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                              {backup.status}
                            </span>
                          </td>
                          <td className="px-4 py-3">
                            <button className="text-xs font-medium text-command hover:underline">Restore</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
