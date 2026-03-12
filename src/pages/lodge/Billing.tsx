import React, { useState } from 'react';
import {
  DollarSign,
  TrendingUp,
  AlertCircle,
  CreditCard,
  RefreshCcw,
  Download,
  Settings,
  ChevronDown,
  CheckCircle2,
  XCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight,
  Search,
  Filter,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PaymentStatus = 'paid' | 'pending' | 'failed' | 'refunded';

interface RenewalRow {
  id: string;
  memberName: string;
  memberNumber: string;
  type: string;
  amount: number;
  renewalDate: string;
  autoRenew: boolean;
}

interface FailedPaymentRow {
  id: string;
  memberName: string;
  memberNumber: string;
  amount: number;
  failedDate: string;
  reason: string;
  retries: number;
}

interface PaymentHistoryRow {
  id: string;
  date: string;
  memberName: string;
  description: string;
  method: string;
  amount: number;
  status: PaymentStatus;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_RENEWALS: RenewalRow[] = [
  { id: '1', memberName: 'Sophie Chen-Murray', memberNumber: 'LDG-0058', type: 'Family', amount: 180, renewalDate: '2026-04-10', autoRenew: true },
  { id: '2', memberName: 'Marcus Tan', memberNumber: 'LDG-0125', type: 'Student', amount: 45, renewalDate: '2026-04-01', autoRenew: false },
  { id: '3', memberName: 'Eleanor Whitfield', memberNumber: 'LDG-0012', type: 'Individual', amount: 120, renewalDate: '2026-03-15', autoRenew: true },
  { id: '4', memberName: 'Ravi Kapoor', memberNumber: 'LDG-0071', type: 'Individual', amount: 120, renewalDate: '2026-05-22', autoRenew: true },
  { id: '5', memberName: 'Isla Mackenzie', memberNumber: 'LDG-0118', type: 'Family', amount: 180, renewalDate: '2026-06-30', autoRenew: false },
];

const MOCK_FAILED: FailedPaymentRow[] = [
  { id: '1', memberName: 'Oliver Trent', memberNumber: 'LDG-0015', amount: 120, failedDate: '2025-11-05', reason: 'Card expired', retries: 3 },
  { id: '2', memberName: 'William Drummond', memberNumber: 'LDG-0044', amount: 950, failedDate: '2025-08-20', reason: 'Insufficient funds', retries: 2 },
];

const MOCK_HISTORY: PaymentHistoryRow[] = [
  { id: '1', date: '2026-03-01', memberName: 'Grace Nguyen', description: 'Individual Membership — Annual', method: 'Visa ****4821', amount: 120, status: 'paid' },
  { id: '2', date: '2026-03-01', memberName: 'Isla Mackenzie', description: 'Family Membership — Annual', method: 'Mastercard ****7733', amount: 180, status: 'paid' },
  { id: '3', date: '2026-02-28', memberName: 'James Harrington', description: 'Corporate Membership — Annual', method: 'Bank Transfer', amount: 950, status: 'paid' },
  { id: '4', date: '2026-02-15', memberName: 'Amelia Blackwood', description: 'Student Membership — Annual', method: 'Visa ****1299', amount: 45, status: 'paid' },
  { id: '5', date: '2026-02-10', memberName: 'Oliver Trent', description: 'Individual Membership — Annual', method: 'Visa ****6012', amount: 120, status: 'failed' },
  { id: '6', date: '2026-01-20', memberName: 'Marcus Tan', description: 'Student Membership — Annual', method: 'Mastercard ****3345', amount: 45, status: 'paid' },
  { id: '7', date: '2026-01-05', memberName: 'Eleanor Whitfield', description: 'Individual Membership — Annual', method: 'Visa ****4821', amount: 120, status: 'paid' },
  { id: '8', date: '2025-12-15', memberName: 'William Drummond', description: 'Corporate Membership — Annual', method: 'Bank Transfer', amount: 950, status: 'refunded' },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const fmt = (n: number) => `\u00A3${n.toLocaleString()}`;
const fmtDate = (d: string) => new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

const paymentStatusBadge = (s: PaymentStatus) => {
  const map: Record<PaymentStatus, { icon: React.ElementType; bg: string; text: string; label: string }> = {
    paid: { icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-700', label: 'Paid' },
    pending: { icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700', label: 'Pending' },
    failed: { icon: XCircle, bg: 'bg-red-50', text: 'text-red-700', label: 'Failed' },
    refunded: { icon: RefreshCcw, bg: 'bg-gray-50', text: 'text-gray-600', label: 'Refunded' },
  };
  const c = map[s];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${c.bg} ${c.text}`}>
      <c.icon className="h-3 w-3" />
      {c.label}
    </span>
  );
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Billing: React.FC = () => {
  const [historySearch, setHistorySearch] = useState('');
  const [configOpen, setConfigOpen] = useState(false);

  const filteredHistory = historySearch
    ? MOCK_HISTORY.filter((h) => h.memberName.toLowerCase().includes(historySearch.toLowerCase()) || h.description.toLowerCase().includes(historySearch.toLowerCase()))
    : MOCK_HISTORY;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing</h1>
          <p className="mt-1 text-sm text-gray-500">Membership revenue, renewals, and payment tracking</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export
          </button>
          <button
            onClick={() => setConfigOpen(!configOpen)}
            className="inline-flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <Settings className="h-4 w-4" />
            Configuration
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Monthly Recurring Revenue', value: fmt(4285), change: '+8.3%', up: true, icon: DollarSign, colour: 'text-emerald-600 bg-emerald-50' },
          { label: 'Collection Rate', value: '96.4%', change: '+1.2%', up: true, icon: TrendingUp, colour: 'text-sky-600 bg-sky-50' },
          { label: 'Outstanding', value: fmt(1070), change: '-15%', up: false, icon: AlertCircle, colour: 'text-amber-600 bg-amber-50' },
          { label: 'Failed Payments', value: '2', change: '', up: false, icon: XCircle, colour: 'text-red-600 bg-red-50' },
        ].map((k) => (
          <div key={k.label} className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <div className={`flex h-12 w-12 items-center justify-center rounded-lg ${k.colour}`}>
              <k.icon className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">{k.label}</p>
              <div className="flex items-center gap-2">
                <p className="text-2xl font-semibold text-gray-900">{k.value}</p>
                {k.change && (
                  <span className={`inline-flex items-center text-xs font-medium ${k.up ? 'text-emerald-600' : 'text-red-600'}`}>
                    {k.up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                    {k.change}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Renewals */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Upcoming Renewals</h2>
          <span className="text-xs font-medium text-gray-500">Next 90 days</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Type</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Renewal Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Auto-Renew</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {MOCK_RENEWALS.map((r) => (
                <tr key={r.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3">
                    <p className="text-sm font-medium text-gray-900">{r.memberName}</p>
                    <p className="text-xs text-gray-500">{r.memberNumber}</p>
                  </td>
                  <td className="px-6 py-3 text-sm text-gray-700">{r.type}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{fmt(r.amount)}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{fmtDate(r.renewalDate)}</td>
                  <td className="px-6 py-3">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${r.autoRenew ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                      {r.autoRenew ? 'Yes' : 'No'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Failed Payments */}
      {MOCK_FAILED.length > 0 && (
        <div className="rounded-xl border border-red-200 bg-white shadow-sm">
          <div className="flex items-center gap-2 border-b border-red-100 bg-red-50 px-6 py-4 rounded-t-xl">
            <AlertCircle className="h-5 w-5 text-red-600" />
            <h2 className="text-base font-semibold text-red-800">Failed Payments Requiring Attention</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-100">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Member</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Failed Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Reason</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Retries</th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {MOCK_FAILED.map((f) => (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3">
                      <p className="text-sm font-medium text-gray-900">{f.memberName}</p>
                      <p className="text-xs text-gray-500">{f.memberNumber}</p>
                    </td>
                    <td className="px-6 py-3 text-sm font-medium text-gray-900">{fmt(f.amount)}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{fmtDate(f.failedDate)}</td>
                    <td className="px-6 py-3 text-sm text-red-600">{f.reason}</td>
                    <td className="px-6 py-3 text-sm text-gray-500">{f.retries}</td>
                    <td className="px-6 py-3">
                      <button className="inline-flex items-center gap-1 rounded-md bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700">
                        <RefreshCcw className="h-3 w-3" /> Retry
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Payment History */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-base font-semibold text-gray-900">Payment History</h2>
          <div className="relative w-64">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search payments..."
              value={historySearch}
              onChange={(e) => setHistorySearch(e.target.value)}
              className="w-full rounded-lg border border-gray-300 bg-white py-1.5 pl-10 pr-3 text-sm shadow-sm placeholder:text-gray-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Member</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Method</th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredHistory.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm text-gray-500">{fmtDate(h.date)}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900">{h.memberName}</td>
                  <td className="px-6 py-3 text-sm text-gray-700">{h.description}</td>
                  <td className="px-6 py-3 text-sm text-gray-500">{h.method}</td>
                  <td className="px-6 py-3 text-sm font-medium text-gray-900 text-right">{fmt(h.amount)}</td>
                  <td className="px-6 py-3">{paymentStatusBadge(h.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Billing Configuration */}
      {configOpen && (
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Billing Configuration</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">Accepted Payment Methods</label>
              <div className="mt-2 space-y-2">
                {['Credit / Debit Card', 'Bank Transfer (BACS)', 'Direct Debit', 'PayPal'].map((m) => (
                  <label key={m} className="flex items-center gap-2 text-sm text-gray-700">
                    <input type="checkbox" defaultChecked className="h-4 w-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                    {m}
                  </label>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Grace Period (days)</label>
                <input
                  type="number"
                  defaultValue={14}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Retry Failed Payments</label>
                <select
                  defaultValue="3"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="1">1 attempt</option>
                  <option value="2">2 attempts</option>
                  <option value="3">3 attempts</option>
                  <option value="5">5 attempts</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Default Currency</label>
                <select
                  defaultValue="GBP"
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                >
                  <option value="GBP">GBP (British Pound)</option>
                  <option value="AUD">AUD (Australian Dollar)</option>
                  <option value="CAD">CAD (Canadian Dollar)</option>
                  <option value="NZD">NZD (New Zealand Dollar)</option>
                  <option value="SGD">SGD (Singapore Dollar)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="mt-6 flex justify-end gap-3">
            <button onClick={() => setConfigOpen(false)} className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
            <button onClick={() => setConfigOpen(false)} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700">
              Save Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Billing;
