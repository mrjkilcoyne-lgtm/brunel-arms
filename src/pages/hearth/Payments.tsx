import React, { useState } from 'react';
import {
  CreditCard,
  ChevronRight,
  Search,
  Download,
  TrendingUp,
  CheckCircle2,
  Clock,
  XCircle,
  AlertTriangle,
  MoreHorizontal,
  Building2,
  Banknote,
  Receipt,
  PoundSterling,
  Smartphone,
  Wifi,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PaymentStatus = 'completed' | 'pending' | 'failed' | 'refunded';
type PaymentMethod = 'card' | 'contactless' | 'mobile' | 'bank_transfer';

interface Transaction {
  id: string;
  date: string;
  time: string;
  customer: string;
  description: string;
  amount: number;
  method: PaymentMethod;
  processor: string;
  status: PaymentStatus;
  cardLast4?: string;
  fee: number;
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const mockTransactions: Transaction[] = [
  { id: 'TXN-4821', date: '12 Mar 2026', time: '14:23', customer: 'Sarah Whitfield', description: 'Gold membership renewal', amount: 89.00, method: 'card', processor: 'Stripe', status: 'completed', cardLast4: '4242', fee: 2.28 },
  { id: 'TXN-4820', date: '12 Mar 2026', time: '13:47', customer: 'Marcus Chen', description: 'Points redemption refund', amount: -15.50, method: 'card', processor: 'Stripe', status: 'refunded', cardLast4: '8819', fee: 0 },
  { id: 'TXN-4819', date: '12 Mar 2026', time: '12:15', customer: 'James Thornton', description: 'Silver membership signup', amount: 49.00, method: 'contactless', processor: 'SumUp', status: 'completed', cardLast4: '3156', fee: 0.86 },
  { id: 'TXN-4818', date: '12 Mar 2026', time: '11:30', customer: 'Priya Nair', description: 'Event ticket — Spring Gala', amount: 125.00, method: 'mobile', processor: 'Stripe', status: 'completed', fee: 3.23 },
  { id: 'TXN-4817', date: '12 Mar 2026', time: '10:48', customer: 'Tom Richards', description: 'Loyalty top-up', amount: 50.00, method: 'card', processor: 'Stripe', status: 'pending', cardLast4: '7734', fee: 1.30 },
  { id: 'TXN-4816', date: '11 Mar 2026', time: '17:22', customer: 'Charlotte Webb', description: 'Annual membership', amount: 299.00, method: 'bank_transfer', processor: 'GoCardless', status: 'completed', fee: 0.60 },
  { id: 'TXN-4815', date: '11 Mar 2026', time: '16:05', customer: 'David Tremblay', description: 'Bronze membership signup', amount: 29.00, method: 'card', processor: 'Stripe', status: 'failed', cardLast4: '9921', fee: 0 },
  { id: 'TXN-4814', date: '11 Mar 2026', time: '14:33', customer: 'Rebecca Liu', description: 'Event ticket — Wine Tasting', amount: 45.00, method: 'contactless', processor: 'SumUp', status: 'completed', cardLast4: '1188', fee: 0.79 },
  { id: 'TXN-4813', date: '11 Mar 2026', time: '12:18', customer: 'Emma Ngata', description: 'Gold membership renewal', amount: 89.00, method: 'card', processor: 'Stripe', status: 'completed', cardLast4: '5567', fee: 2.28 },
  { id: 'TXN-4812', date: '11 Mar 2026', time: '09:41', customer: 'Ben Holt', description: 'Loyalty top-up', amount: 25.00, method: 'mobile', processor: 'Stripe', status: 'completed', fee: 0.68 },
];

const statusConfig: Record<PaymentStatus, { label: string; icon: React.ElementType; bg: string; text: string }> = {
  completed: { label: 'Completed', icon: CheckCircle2, bg: 'bg-emerald-50', text: 'text-emerald-700' },
  pending: { label: 'Pending', icon: Clock, bg: 'bg-amber-50', text: 'text-amber-700' },
  failed: { label: 'Failed', icon: XCircle, bg: 'bg-red-50', text: 'text-red-700' },
  refunded: { label: 'Refunded', icon: AlertTriangle, bg: 'bg-blue-50', text: 'text-blue-700' },
};

const methodConfig: Record<PaymentMethod, { label: string; icon: React.ElementType }> = {
  card: { label: 'Card', icon: CreditCard },
  contactless: { label: 'Contactless', icon: Wifi },
  mobile: { label: 'Mobile', icon: Smartphone },
  bank_transfer: { label: 'Bank Transfer', icon: Building2 },
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const Payments: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | PaymentStatus>('all');

  const filteredTransactions = mockTransactions.filter((t) => {
    const matchesSearch =
      t.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || t.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const completedTxns = mockTransactions.filter((t) => t.status === 'completed');
  const todayRevenue = completedTxns
    .filter((t) => t.date === '12 Mar 2026')
    .reduce((sum, t) => sum + t.amount, 0);
  const totalProcessed = completedTxns.reduce((sum, t) => sum + t.amount, 0);
  const totalFees = mockTransactions.reduce((sum, t) => sum + t.fee, 0);
  const pendingAmount = mockTransactions
    .filter((t) => t.status === 'pending')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center text-sm text-ink-tertiary mb-1">
        <span>Hearth</span>
        <ChevronRight className="w-3.5 h-3.5 mx-1" />
        <span className="text-ink-secondary font-medium">Payments</span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-hearth/10">
            <CreditCard className="h-5 w-5 text-hearth" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-ink">Payment Processing</h1>
            <p className="text-sm text-ink-tertiary">Track transactions, settlements, and fees</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-2 text-sm border border-slate-200 rounded-lg hover:bg-slate-50 text-ink-secondary">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Settlement Summary KPIs */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <PoundSterling className="w-3.5 h-3.5" />
            Today&apos;s Revenue
          </div>
          <p className="text-2xl font-bold text-ink mt-1">&pound;{todayRevenue.toFixed(2)}</p>
          <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +8.3% vs yesterday
          </p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <Banknote className="w-3.5 h-3.5" />
            Total Processed
          </div>
          <p className="text-2xl font-bold text-ink mt-1">&pound;{totalProcessed.toFixed(2)}</p>
          <p className="text-xs text-ink-tertiary mt-1">This period</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <Clock className="w-3.5 h-3.5" />
            Pending Settlement
          </div>
          <p className="text-2xl font-bold text-amber-600 mt-1">&pound;{pendingAmount.toFixed(2)}</p>
          <p className="text-xs text-ink-tertiary mt-1">Awaiting clearance</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex items-center gap-2 text-xs text-ink-tertiary font-medium uppercase tracking-wide">
            <Receipt className="w-3.5 h-3.5" />
            Processing Fees
          </div>
          <p className="text-2xl font-bold text-red-500 mt-1">&pound;{totalFees.toFixed(2)}</p>
          <p className="text-xs text-ink-tertiary mt-1">
            Avg {((totalFees / totalProcessed) * 100).toFixed(2)}% rate
          </p>
        </div>
      </div>

      {/* Fee Breakdown */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-base font-semibold text-ink mb-4">Fee Breakdown by Processor</h2>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {[
            { name: 'Stripe', txns: 7, volume: 527.00, fees: 10.45, rate: '1.98%' },
            { name: 'SumUp', txns: 2, volume: 94.00, fees: 1.65, rate: '1.76%' },
            { name: 'GoCardless', txns: 1, volume: 299.00, fees: 0.60, rate: '0.20%' },
          ].map((proc) => (
            <div key={proc.name} className="rounded-lg border border-slate-100 bg-surface-secondary p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-ink">{proc.name}</h3>
                <span className="text-xs text-ink-tertiary">{proc.txns} txns</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-ink-tertiary">Volume</span>
                  <span className="font-medium text-ink">&pound;{proc.volume.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-ink-tertiary">Fees</span>
                  <span className="font-medium text-red-500">&pound;{proc.fees.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs border-t border-slate-200 pt-2">
                  <span className="text-ink-tertiary">Effective Rate</span>
                  <span className="font-semibold text-ink">{proc.rate}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-faint" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-hearth/30 focus:border-hearth"
          />
        </div>
        <div className="flex items-center gap-1 rounded-lg border border-slate-200 p-1">
          {(['all', 'completed', 'pending', 'failed', 'refunded'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium capitalize transition-colors ${
                filterStatus === status
                  ? 'bg-hearth text-white'
                  : 'text-ink-tertiary hover:bg-surface-tertiary'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-6 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wide">Transaction</th>
                <th className="px-6 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wide">Customer</th>
                <th className="px-6 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wide">Amount</th>
                <th className="px-6 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wide">Method</th>
                <th className="px-6 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wide">Processor</th>
                <th className="px-6 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wide">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-ink-tertiary uppercase tracking-wide">Fee</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTransactions.map((txn) => {
                const status = statusConfig[txn.status];
                const StatusIcon = status.icon;
                const method = methodConfig[txn.method];
                const MethodIcon = method.icon;

                return (
                  <tr key={txn.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-ink">{txn.id}</p>
                      <p className="text-xs text-ink-tertiary">{txn.date} at {txn.time}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-ink">{txn.customer}</p>
                      <p className="text-xs text-ink-tertiary">{txn.description}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-semibold ${txn.amount < 0 ? 'text-blue-600' : 'text-ink'}`}>
                        {txn.amount < 0 ? '-' : ''}&pound;{Math.abs(txn.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <MethodIcon className="w-3.5 h-3.5 text-ink-tertiary" />
                        <span className="text-sm text-ink-secondary">{method.label}</span>
                        {txn.cardLast4 && (
                          <span className="text-xs text-ink-faint">****{txn.cardLast4}</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-ink-secondary">{txn.processor}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${status.bg} ${status.text}`}>
                        <StatusIcon className="w-3 h-3" />
                        {status.label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-ink-tertiary">
                        {txn.fee > 0 ? `\u00A3${txn.fee.toFixed(2)}` : '-'}
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
    </div>
  );
};

export default Payments;
