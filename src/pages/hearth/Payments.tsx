import React, { useState } from 'react';
import {
  CreditCard,
  Landmark,
  Building2,
  Flame,
  Search,
  Download,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowUpRight,
  ArrowDownRight,
  PoundSterling,
  PieChart,
  Calculator,
  RefreshCw,
  Banknote,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PaymentMethod = 'Card' | 'Bank' | 'Direct Debit';
type Processor = 'Stripe' | 'TrueLayer' | 'GoCardless';
type TxStatus = 'completed' | 'pending' | 'failed' | 'refunded';

interface Transaction {
  id: string;
  date: string;
  customer: string;
  amount: string;
  amountRaw: number;
  method: PaymentMethod;
  processor: Processor;
  status: TxStatus;
  fee: string;
  feeRaw: number;
  net: string;
}

interface SettlementSummary {
  date: string;
  gross: string;
  fees: string;
  net: string;
  transactions: number;
}

interface MethodDistribution {
  method: PaymentMethod;
  count: number;
  pct: number;
  color: string;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const transactions: Transaction[] = [
  { id: 'TXN-001', date: '12 Mar 2026 14:32', customer: 'Emma Thompson', amount: '£24.50', amountRaw: 2450, method: 'Card', processor: 'Stripe', status: 'completed', fee: '£0.54', feeRaw: 54, net: '£23.96' },
  { id: 'TXN-002', date: '12 Mar 2026 13:18', customer: 'James Wilson', amount: '£12.80', amountRaw: 1280, method: 'Bank', processor: 'TrueLayer', status: 'completed', fee: '£0.10', feeRaw: 10, net: '£12.70' },
  { id: 'TXN-003', date: '12 Mar 2026 12:45', customer: 'Sophie Brown', amount: '£38.00', amountRaw: 3800, method: 'Card', processor: 'Stripe', status: 'completed', fee: '£0.83', feeRaw: 83, net: '£37.17' },
  { id: 'TXN-004', date: '12 Mar 2026 11:22', customer: 'Oliver Davies', amount: '£8.50', amountRaw: 850, method: 'Bank', processor: 'TrueLayer', status: 'pending', fee: '£0.07', feeRaw: 7, net: '£8.43' },
  { id: 'TXN-005', date: '12 Mar 2026 10:55', customer: 'Charlotte Evans', amount: '£52.00', amountRaw: 5200, method: 'Direct Debit', processor: 'GoCardless', status: 'completed', fee: '£0.26', feeRaw: 26, net: '£51.74' },
  { id: 'TXN-006', date: '12 Mar 2026 10:12', customer: 'Harry Clarke', amount: '£15.90', amountRaw: 1590, method: 'Card', processor: 'Stripe', status: 'failed', fee: '£0.00', feeRaw: 0, net: '£0.00' },
  { id: 'TXN-007', date: '12 Mar 2026 09:48', customer: 'Amelia Roberts', amount: '£29.75', amountRaw: 2975, method: 'Card', processor: 'Stripe', status: 'completed', fee: '£0.65', feeRaw: 65, net: '£29.10' },
  { id: 'TXN-008', date: '12 Mar 2026 09:15', customer: 'George Taylor', amount: '£18.40', amountRaw: 1840, method: 'Bank', processor: 'TrueLayer', status: 'completed', fee: '£0.15', feeRaw: 15, net: '£18.25' },
  { id: 'TXN-009', date: '11 Mar 2026 18:42', customer: 'Isabella White', amount: '£42.60', amountRaw: 4260, method: 'Card', processor: 'Stripe', status: 'refunded', fee: '£0.00', feeRaw: 0, net: '£0.00' },
  { id: 'TXN-010', date: '11 Mar 2026 17:30', customer: 'William Harris', amount: '£67.00', amountRaw: 6700, method: 'Direct Debit', processor: 'GoCardless', status: 'completed', fee: '£0.34', feeRaw: 34, net: '£66.66' },
];

const settlements: SettlementSummary[] = [
  { date: '12 Mar 2026', gross: '£1,247.50', fees: '£28.42', net: '£1,219.08', transactions: 84 },
  { date: '11 Mar 2026', gross: '£1,089.30', fees: '£24.18', net: '£1,065.12', transactions: 72 },
  { date: '10 Mar 2026', gross: '£1,432.80', fees: '£31.56', net: '£1,401.24', transactions: 96 },
];

const methodDistribution: MethodDistribution[] = [
  { method: 'Card', count: 52, pct: 61.9, color: 'bg-orange-500' },
  { method: 'Bank', count: 22, pct: 26.2, color: 'bg-orange-300' },
  { method: 'Direct Debit', count: 10, pct: 11.9, color: 'bg-orange-100' },
];

const feeBreakdown = {
  stripe: { label: 'Stripe (Card)', rate: '1.4% + 20p', totalFees: '£18.92', volume: '£892.25' },
  trueLayer: { label: 'TrueLayer (Bank)', rate: '0.5% + 5p', totalFees: '£3.24', volume: '£342.80' },
  goCardless: { label: 'GoCardless (DD)', rate: '0.5% flat', totalFees: '£6.26', volume: '£1,252.00' },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const statusBadge = (status: TxStatus) => {
  const map: Record<TxStatus, { icon: React.ReactNode; cls: string; label: string }> = {
    completed: { icon: <CheckCircle2 className="h-3.5 w-3.5" />, cls: 'bg-green-100 text-green-700', label: 'Completed' },
    pending: { icon: <Clock className="h-3.5 w-3.5" />, cls: 'bg-amber-100 text-amber-700', label: 'Pending' },
    failed: { icon: <XCircle className="h-3.5 w-3.5" />, cls: 'bg-red-100 text-red-700', label: 'Failed' },
    refunded: { icon: <RefreshCw className="h-3.5 w-3.5" />, cls: 'bg-purple-100 text-purple-700', label: 'Refunded' },
  };
  const s = map[status];
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      {s.icon}
      {s.label}
    </span>
  );
};

const methodIcon = (method: PaymentMethod) => {
  const map: Record<PaymentMethod, React.ReactNode> = {
    Card: <CreditCard className="h-3.5 w-3.5 text-gray-500" />,
    Bank: <Landmark className="h-3.5 w-3.5 text-gray-500" />,
    'Direct Debit': <Building2 className="h-3.5 w-3.5 text-gray-500" />,
  };
  return map[method];
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Payments: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const filtered = transactions.filter(
    (t) =>
      t.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100">
            <CreditCard className="h-5 w-5 text-hearth" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
            <p className="text-sm text-gray-500">Transaction processing and settlement</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Filter className="h-4 w-4" />
            Filter
          </button>
          <button className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          placeholder="Search by customer or reference..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-gray-300 py-2 pl-9 pr-3 text-sm focus:border-orange-400 focus:outline-none focus:ring-1 focus:ring-orange-400"
        />
      </div>

      {/* Transaction Table */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-gray-200 bg-gray-50 text-left text-xs font-medium text-gray-500">
              <tr>
                <th className="px-4 py-3">Reference</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3 text-right">Amount</th>
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Processor</th>
                <th className="px-4 py-3 text-right">Fee</th>
                <th className="px-4 py-3 text-right">Net</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((t) => (
                <tr key={t.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-mono text-xs text-gray-600">{t.id}</td>
                  <td className="px-4 py-3 text-gray-600">{t.date}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{t.customer}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gray-900">{t.amount}</td>
                  <td className="px-4 py-3">
                    <span className="inline-flex items-center gap-1 text-gray-600">
                      {methodIcon(t.method)}
                      {t.method}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">{t.processor}</td>
                  <td className="px-4 py-3 text-right text-gray-500">{t.fee}</td>
                  <td className="px-4 py-3 text-right font-medium text-gray-700">{t.net}</td>
                  <td className="px-4 py-3">{statusBadge(t.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Daily Settlement Summary */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <PoundSterling className="h-5 w-5 text-orange-500" />
            <h2 className="text-base font-semibold text-gray-900">Daily Settlement</h2>
          </div>

          <div className="mt-4 overflow-hidden rounded-lg border border-gray-100">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-xs font-medium text-gray-500">
                <tr>
                  <th className="px-3 py-2 text-left">Date</th>
                  <th className="px-3 py-2 text-right">Gross</th>
                  <th className="px-3 py-2 text-right">Fees</th>
                  <th className="px-3 py-2 text-right">Net</th>
                  <th className="px-3 py-2 text-right">Txns</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {settlements.map((s) => (
                  <tr key={s.date} className="hover:bg-gray-50">
                    <td className="px-3 py-2 font-medium text-gray-800">{s.date}</td>
                    <td className="px-3 py-2 text-right text-gray-600">{s.gross}</td>
                    <td className="px-3 py-2 text-right text-red-500">{s.fees}</td>
                    <td className="px-3 py-2 text-right font-semibold text-gray-900">{s.net}</td>
                    <td className="px-3 py-2 text-right text-gray-500">{s.transactions}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Fee Breakdown */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Banknote className="h-5 w-5 text-orange-500" />
            <h2 className="text-base font-semibold text-gray-900">Fee Breakdown</h2>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">Processing fees by provider (today)</p>

          <ul className="mt-4 space-y-3">
            {Object.values(feeBreakdown).map((f) => (
              <li key={f.label} className="rounded-lg border border-gray-100 bg-gray-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-800">{f.label}</span>
                  <span className="text-xs text-gray-500">Rate: {f.rate}</span>
                </div>
                <div className="mt-1 flex items-center justify-between text-xs">
                  <span className="text-gray-500">Volume: {f.volume}</span>
                  <span className="font-semibold text-red-500">Fees: {f.totalFees}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Payment Method Distribution */}
        <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <PieChart className="h-5 w-5 text-orange-500" />
            <h2 className="text-base font-semibold text-gray-900">Payment Method Distribution</h2>
          </div>
          <p className="mt-0.5 text-xs text-gray-500">Today — 84 transactions</p>

          {/* Stacked bar as pie-chart placeholder */}
          <div className="mt-4 flex h-6 w-full overflow-hidden rounded-full">
            {methodDistribution.map((m) => (
              <div
                key={m.method}
                className={`${m.color} h-full`}
                style={{ width: `${m.pct}%` }}
                title={`${m.method}: ${m.pct}%`}
              />
            ))}
          </div>

          <ul className="mt-4 space-y-2">
            {methodDistribution.map((m) => (
              <li key={m.method} className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${m.color}`} />
                  <span className="font-medium text-gray-700">{m.method}</span>
                </span>
                <span className="text-gray-500">
                  {m.count} txns ({m.pct}%)
                </span>
              </li>
            ))}
          </ul>
        </div>

        {/* Savings Calculator */}
        <div className="rounded-xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-5 shadow-sm">
          <div className="flex items-center gap-2">
            <Calculator className="h-5 w-5 text-orange-500" />
            <h2 className="text-base font-semibold text-gray-900">Savings Calculator</h2>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            Switch from Card payments to <span className="font-semibold text-orange-600">Pay by Bank</span> and save on processing fees.
          </p>

          <div className="mt-4 space-y-3">
            <div className="rounded-lg bg-white p-4 border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Current card fees (monthly)</p>
                  <p className="text-lg font-bold text-gray-900">£567.40</p>
                </div>
                <ArrowDownRight className="h-5 w-5 text-red-500" />
              </div>
            </div>

            <div className="rounded-lg bg-white p-4 border border-orange-100">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Estimated bank transfer fees</p>
                  <p className="text-lg font-bold text-green-600">£142.30</p>
                </div>
                <ArrowUpRight className="h-5 w-5 text-green-500" />
              </div>
            </div>

            <div className="rounded-lg border-2 border-orange-400 bg-orange-50 p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-orange-700">Potential monthly savings</p>
                  <p className="text-2xl font-bold text-orange-600">£425.10</p>
                  <p className="text-xs text-gray-500">That's £5,101 per year</p>
                </div>
                <Flame className="h-8 w-8 text-orange-400" />
              </div>
            </div>

            <button className="w-full rounded-lg bg-hearth py-2.5 text-sm font-medium text-white shadow-sm hover:bg-hearth-dark">
              Enable Pay by Bank
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Payments;
