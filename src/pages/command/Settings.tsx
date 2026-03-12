import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  Building2,
  Globe,
  CreditCard,
  Puzzle,
  Users,
  Database,
  ChevronRight,
  Save,
  Eye,
  EyeOff,
  Copy,
  RefreshCw,
  Shield,
  Check,
} from 'lucide-react';

// ── Types ──────────────────────────────────────────────────────────────────────

type SettingsSection = 'general' | 'modules' | 'billing' | 'integrations' | 'team' | 'backup';

interface ModuleToggle {
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
  connected: boolean;
  icon: string;
}

// ── Mock Data ──────────────────────────────────────────────────────────────────

const sections: Array<{ id: SettingsSection; label: string; icon: React.ElementType }> = [
  { id: 'general', label: 'General', icon: Building2 },
  { id: 'modules', label: 'Modules', icon: Puzzle },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'integrations', label: 'Integrations', icon: Globe },
  { id: 'team', label: 'Team', icon: Users },
  { id: 'backup', label: 'Backup & Data', icon: Database },
];

const initialModules: ModuleToggle[] = [
  { id: 'consul', name: 'Consul', description: 'Client management, invoicing, and CRM', enabled: true, color: 'bg-blue-500' },
  { id: 'lodge', name: 'Lodge', description: 'Membership tiers and subscriber management', enabled: true, color: 'bg-emerald-500' },
  { id: 'hearth', name: 'Hearth', description: 'Loyalty programme and customer engagement', enabled: true, color: 'bg-orange-500' },
  { id: 'command', name: 'Command', description: 'Dashboard, reports, and administration', enabled: true, color: 'bg-purple-500' },
];

const integrations: Integration[] = [
  { id: 'xero', name: 'Xero', description: 'Accounting and bookkeeping sync', connected: true, icon: 'X' },
  { id: 'stripe', name: 'Stripe', description: 'Payment processing', connected: true, icon: 'S' },
  { id: 'mailchimp', name: 'Mailchimp', description: 'Email marketing campaigns', connected: false, icon: 'M' },
  { id: 'slack', name: 'Slack', description: 'Team notifications', connected: true, icon: 'S' },
  { id: 'google', name: 'Google Workspace', description: 'Calendar and document sync', connected: false, icon: 'G' },
  { id: 'zapier', name: 'Zapier', description: 'Workflow automation bridge', connected: false, icon: 'Z' },
];

// ── Toggle Component ───────────────────────────────────────────────────────────

const Toggle: React.FC<{ enabled: boolean; onChange: () => void }> = ({ enabled, onChange }) => (
  <button
    onClick={onChange}
    className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
      enabled ? 'bg-command' : 'bg-slate-300'
    }`}
  >
    <span
      className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`}
    />
  </button>
);

// ── Component ──────────────────────────────────────────────────────────────────

const Settings: React.FC = () => {
  const [activeSection, setActiveSection] = useState<SettingsSection>('general');
  const [modules, setModules] = useState(initialModules);
  const [showApiKey, setShowApiKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const mockApiKey = 'frg_live_a8b2c4d6e8f0g2h4i6j8k0l2m4n6o8p0';

  const toggleModule = (id: string) => {
    setModules((prev) =>
      prev.map((m) => (m.id === id ? { ...m, enabled: !m.enabled } : m)),
    );
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'general':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="mb-4 text-base font-semibold text-ink">Company Information</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Company Name</label>
                  <input
                    type="text"
                    defaultValue="Brunel & Arms Ltd"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink focus:border-command focus:outline-none focus:ring-1 focus:ring-command"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Trading Name</label>
                  <input
                    type="text"
                    defaultValue="Brunel Arms"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink focus:border-command focus:outline-none focus:ring-1 focus:ring-command"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Email</label>
                  <input
                    type="email"
                    defaultValue="admin@brunelarms.co.uk"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink focus:border-command focus:outline-none focus:ring-1 focus:ring-command"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Phone</label>
                  <input
                    type="tel"
                    defaultValue="+44 20 7946 0958"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink focus:border-command focus:outline-none focus:ring-1 focus:ring-command"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Address</label>
                  <input
                    type="text"
                    defaultValue="14 Isambard Wharf, Bristol BS1 6QH, United Kingdom"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink focus:border-command focus:outline-none focus:ring-1 focus:ring-command"
                  />
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="mb-4 text-base font-semibold text-ink">Regional Settings</h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Primary Currency</label>
                  <select
                    defaultValue="GBP"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink focus:border-command focus:outline-none focus:ring-1 focus:ring-command"
                  >
                    <option value="GBP">GBP (&pound;) &mdash; British Pound</option>
                    <option value="AUD">AUD ($) &mdash; Australian Dollar</option>
                    <option value="CAD">CAD ($) &mdash; Canadian Dollar</option>
                    <option value="NZD">NZD ($) &mdash; New Zealand Dollar</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Timezone</label>
                  <select
                    defaultValue="Europe/London"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink focus:border-command focus:outline-none focus:ring-1 focus:ring-command"
                  >
                    <option value="Europe/London">Europe/London (GMT+0)</option>
                    <option value="Australia/Sydney">Australia/Sydney (GMT+11)</option>
                    <option value="America/Toronto">America/Toronto (GMT-5)</option>
                    <option value="Pacific/Auckland">Pacific/Auckland (GMT+13)</option>
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-ink-secondary">Date Format</label>
                  <select
                    defaultValue="DD/MM/YYYY"
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-ink focus:border-command focus:outline-none focus:ring-1 focus:ring-command"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-6">
              <h3 className="mb-4 text-base font-semibold text-ink">Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">Email Notifications</p>
                    <p className="text-xs text-ink-tertiary">Receive email alerts for important events</p>
                  </div>
                  <Toggle enabled={true} onChange={() => {}} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">Two-Factor Authentication</p>
                    <p className="text-xs text-ink-tertiary">Require 2FA for all team logins</p>
                  </div>
                  <Toggle enabled={true} onChange={() => {}} />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-ink">Dark Mode</p>
                    <p className="text-xs text-ink-tertiary">Use dark theme across the application</p>
                  </div>
                  <Toggle enabled={false} onChange={() => {}} />
                </div>
              </div>
            </div>
          </div>
        );

      case 'modules':
        return (
          <div className="space-y-4">
            <p className="text-sm text-ink-tertiary">
              Enable or disable modules for your organisation. Disabled modules will be hidden from navigation.
            </p>
            {modules.map((mod) => (
              <div
                key={mod.id}
                className="flex items-center justify-between rounded-xl border border-slate-200 bg-white p-5"
              >
                <div className="flex items-center gap-4">
                  <div className={`h-10 w-10 rounded-lg ${mod.color} flex items-center justify-center text-white font-bold text-sm`}>
                    {mod.name[0]}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-ink">{mod.name}</p>
                    <p className="text-xs text-ink-tertiary">{mod.description}</p>
                  </div>
                </div>
                <Toggle enabled={mod.enabled} onChange={() => toggleModule(mod.id)} />
              </div>
            ))}
          </div>
        );

      case 'billing':
        return (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-gradient-to-r from-command/5 to-purple-50 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-ink-tertiary">Current Plan</p>
                  <p className="text-2xl font-bold text-ink">Professional</p>
                  <p className="mt-1 text-sm text-ink-secondary">&pound;149/month &middot; Billed annually</p>
                </div>
                <button className="rounded-lg bg-command px-4 py-2 text-sm font-medium text-white hover:bg-command-dark">
                  Upgrade Plan
                </button>
              </div>
              <div className="mt-4 flex gap-6 text-xs text-ink-tertiary">
                <span>10 team seats</span>
                <span>50 GB storage</span>
                <span>All modules</span>
                <span>Priority support</span>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-base font-semibold text-ink">Payment Method</h3>
              <div className="flex items-center justify-between rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-14 items-center justify-center rounded bg-slate-100 text-xs font-bold text-ink-secondary">
                    VISA
                  </div>
                  <div>
                    <p className="text-sm font-medium text-ink">Visa ending in 4829</p>
                    <p className="text-xs text-ink-tertiary">Expires 08/2027</p>
                  </div>
                </div>
                <button className="text-sm font-medium text-command hover:underline">Update</button>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-base font-semibold text-ink">Recent Invoices</h3>
              <div className="space-y-2">
                {[
                  { date: '1 Mar 2026', amount: '\u00A3149.00', status: 'Paid' },
                  { date: '1 Feb 2026', amount: '\u00A3149.00', status: 'Paid' },
                  { date: '1 Jan 2026', amount: '\u00A3149.00', status: 'Paid' },
                ].map((inv, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg border border-slate-100 px-4 py-3">
                    <span className="text-sm text-ink-secondary">{inv.date}</span>
                    <span className="text-sm font-medium text-ink">{inv.amount}</span>
                    <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-600">
                      {inv.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'integrations':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-base font-semibold text-ink">API Key</h3>
              <div className="rounded-lg border border-slate-200 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex-1 rounded-lg bg-surface-tertiary px-3 py-2 font-mono text-sm text-ink-secondary">
                    {showApiKey ? mockApiKey : '\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022'}
                  </div>
                  <button
                    onClick={() => setShowApiKey(!showApiKey)}
                    className="rounded-lg border border-slate-200 p-2 text-ink-secondary hover:bg-surface-tertiary"
                    title={showApiKey ? 'Hide' : 'Show'}
                  >
                    {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <button className="rounded-lg border border-slate-200 p-2 text-ink-secondary hover:bg-surface-tertiary" title="Copy">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg border border-slate-200 p-2 text-ink-secondary hover:bg-surface-tertiary" title="Regenerate">
                    <RefreshCw className="h-4 w-4" />
                  </button>
                </div>
                <p className="mt-2 flex items-center gap-1 text-xs text-ink-faint">
                  <Shield className="h-3 w-3" /> Keep this key secure. Do not share it publicly.
                </p>
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-base font-semibold text-ink">Connected Services</h3>
              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                {integrations.map((int) => (
                  <div key={int.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 text-sm font-bold text-ink-secondary">
                        {int.icon}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-ink">{int.name}</p>
                        <p className="text-xs text-ink-tertiary">{int.description}</p>
                      </div>
                    </div>
                    <button
                      className={`rounded-lg px-3 py-1.5 text-xs font-medium ${
                        int.connected
                          ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                          : 'bg-slate-100 text-ink-secondary hover:bg-slate-200'
                      }`}
                    >
                      {int.connected ? 'Connected' : 'Connect'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'team':
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-tertiary">Manage team seats and permissions. 6 of 10 seats used.</p>
              <button className="flex items-center gap-1.5 rounded-lg bg-command px-3 py-1.5 text-sm font-medium text-white hover:bg-command-dark">
                <Users className="h-4 w-4" /> Invite Member
              </button>
            </div>
            <div className="rounded-xl border border-slate-200 bg-white">
              {[
                { name: 'Emma Clarke', email: 'emma@brunelarms.co.uk', role: 'Admin', status: 'Active' },
                { name: 'James Thornton', email: 'james@brunelarms.co.uk', role: 'Manager', status: 'Active' },
                { name: 'Sarah Whitfield', email: 'sarah@brunelarms.co.uk', role: 'Manager', status: 'Active' },
                { name: "Liam O'Brien", email: 'liam@brunelarms.co.uk', role: 'Member', status: 'Active' },
                { name: 'Aroha Tane', email: 'aroha@brunelarms.co.nz', role: 'Member', status: 'Active' },
                { name: 'Marcus Chen', email: 'marcus@brunelarms.com.au', role: 'Member', status: 'Invited' },
              ].map((member, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between border-b border-slate-50 px-5 py-3 last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-command/10 text-sm font-semibold text-command">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-ink">{member.name}</p>
                      <p className="text-xs text-ink-faint">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                      member.role === 'Admin' ? 'bg-purple-100 text-purple-700' :
                      member.role === 'Manager' ? 'bg-blue-100 text-blue-700' :
                      'bg-slate-100 text-slate-600'
                    }`}>
                      {member.role}
                    </span>
                    <span className={`text-xs ${member.status === 'Active' ? 'text-emerald-600' : 'text-amber-500'}`}>
                      {member.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'backup':
        return (
          <div className="space-y-6">
            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-1 text-base font-semibold text-ink">Automatic Backups</h3>
              <p className="mb-4 text-sm text-ink-tertiary">Your data is automatically backed up daily at 02:00 UTC.</p>
              <div className="space-y-3">
                {[
                  { date: '12 Mar 2026, 02:00', size: '1.2 GB', status: 'Complete' },
                  { date: '11 Mar 2026, 02:00', size: '1.2 GB', status: 'Complete' },
                  { date: '10 Mar 2026, 02:00', size: '1.1 GB', status: 'Complete' },
                ].map((backup, idx) => (
                  <div key={idx} className="flex items-center justify-between rounded-lg bg-surface-secondary px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm text-ink-secondary">{backup.date}</span>
                    </div>
                    <span className="text-sm text-ink-tertiary">{backup.size}</span>
                    <button className="text-xs font-medium text-command hover:underline">Restore</button>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6">
              <h3 className="mb-1 text-base font-semibold text-ink">Export Data</h3>
              <p className="mb-4 text-sm text-ink-tertiary">Download a full export of your data in CSV or JSON format.</p>
              <div className="flex gap-3">
                <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-ink-secondary hover:bg-surface-tertiary">
                  Export as CSV
                </button>
                <button className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-ink-secondary hover:bg-surface-tertiary">
                  Export as JSON
                </button>
              </div>
            </div>

            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <h3 className="mb-1 text-base font-semibold text-red-700">Danger Zone</h3>
              <p className="mb-4 text-sm text-red-600/80">These actions are irreversible. Please proceed with caution.</p>
              <button className="rounded-lg border border-red-300 bg-white px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50">
                Delete All Data
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-command/10">
            <SettingsIcon className="h-5 w-5 text-command" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">Settings</h1>
            <p className="text-sm text-ink-tertiary">Configure your Forge workspace</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors ${
            saved ? 'bg-emerald-500' : 'bg-command hover:bg-command-dark'
          }`}
        >
          {saved ? <Check className="h-4 w-4" /> : <Save className="h-4 w-4" />}
          {saved ? 'Saved' : 'Save Changes'}
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        {/* Section Navigation */}
        <div className="rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
          <nav className="space-y-0.5">
            {sections.map((section) => {
              const Icon = section.icon;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    activeSection === section.id
                      ? 'bg-command/10 font-medium text-command'
                      : 'text-ink-secondary hover:bg-surface-tertiary'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {section.label}
                  <ChevronRight className="ml-auto h-3.5 w-3.5 text-ink-faint" />
                </button>
              );
            })}
          </nav>
        </div>

        {/* Content */}
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-3">
          <h2 className="mb-6 text-lg font-semibold capitalize text-ink">
            {sections.find((s) => s.id === activeSection)?.label}
          </h2>
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default Settings;
