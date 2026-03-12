import React, { useState } from 'react';
import {
  Plus,
  Edit3,
  Check,
  Crown,
  Users,
  Briefcase,
  GraduationCap,
  Award,
  Gem,
  Star,
  X,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Local types
// ---------------------------------------------------------------------------

type BillingPeriod = 'monthly' | 'quarterly' | 'annually' | 'lifetime';
type Tier = 'bronze' | 'silver' | 'gold' | null;

interface MembershipTypeData {
  id: string;
  name: string;
  description: string;
  price: number; // in GBP whole pounds for display
  currency: string;
  billingPeriod: BillingPeriod;
  memberCount: number;
  benefits: string[];
  tier: Tier;
  icon: React.ElementType;
  active: boolean;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_TYPES: MembershipTypeData[] = [
  {
    id: '1',
    name: 'Individual',
    description: 'Standard personal membership with full benefits and community access.',
    price: 120,
    currency: 'GBP',
    billingPeriod: 'annually',
    memberCount: 342,
    benefits: [
      'Full community access',
      'Monthly newsletter',
      'Member events discount',
      'Online resource library',
      'Voting rights at AGM',
    ],
    tier: null,
    icon: Users,
    active: true,
  },
  {
    id: '2',
    name: 'Family',
    description: 'Covers up to 4 household members under a single subscription.',
    price: 180,
    currency: 'GBP',
    billingPeriod: 'annually',
    memberCount: 87,
    benefits: [
      'Up to 4 household members',
      'Full community access',
      'Family event invitations',
      'Shared resource library',
      'Combined voting rights',
    ],
    tier: null,
    icon: Users,
    active: true,
  },
  {
    id: '3',
    name: 'Corporate',
    description: 'Organisation-level membership with branded benefits and multiple seats.',
    price: 950,
    currency: 'GBP',
    billingPeriod: 'annually',
    memberCount: 24,
    benefits: [
      'Up to 10 named members',
      'Brand visibility at events',
      'Priority sponsorship opportunities',
      'Dedicated account manager',
      'Quarterly business roundtable',
      'Logo on partner directory',
    ],
    tier: 'gold',
    icon: Briefcase,
    active: true,
  },
  {
    id: '4',
    name: 'Student',
    description: 'Discounted rate for full-time students with valid enrolment.',
    price: 45,
    currency: 'GBP',
    billingPeriod: 'annually',
    memberCount: 63,
    benefits: [
      'Full community access',
      'Career mentoring programme',
      'Free workshop attendance',
      'Online resource library',
    ],
    tier: null,
    icon: GraduationCap,
    active: true,
  },
  {
    id: '5',
    name: 'Honorary',
    description: 'Complimentary membership awarded by the Board for distinguished service.',
    price: 0,
    currency: 'GBP',
    billingPeriod: 'lifetime',
    memberCount: 8,
    benefits: [
      'Lifetime community access',
      'VIP event invitations',
      'Recognition on honour roll',
      'Board advisory privileges',
    ],
    tier: 'gold',
    icon: Award,
    active: true,
  },
  {
    id: '6',
    name: 'Lifetime',
    description: 'One-time payment for permanent membership with premium perks.',
    price: 2500,
    currency: 'GBP',
    billingPeriod: 'lifetime',
    memberCount: 15,
    benefits: [
      'Permanent community access',
      'All Individual benefits',
      'Priority event registration',
      'Exclusive Lifetime Members lounge',
      'Annual commemorative gift',
      'Lifetime pin & certificate',
    ],
    tier: 'gold',
    icon: Gem,
    active: true,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const billingLabel = (bp: BillingPeriod) => {
  const map: Record<BillingPeriod, string> = {
    monthly: '/month',
    quarterly: '/quarter',
    annually: '/year',
    lifetime: 'one-time',
  };
  return map[bp];
};

const tierColour = (tier: Tier) => {
  if (!tier) return null;
  const map: Record<string, { ring: string; text: string; bg: string }> = {
    bronze: { ring: 'ring-amber-700/30', text: 'text-amber-800', bg: 'bg-amber-50' },
    silver: { ring: 'ring-gray-400/40', text: 'text-gray-600', bg: 'bg-gray-50' },
    gold: { ring: 'ring-yellow-500/40', text: 'text-yellow-700', bg: 'bg-yellow-50' },
  };
  return map[tier];
};

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

const MembershipTypes: React.FC = () => {
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Membership Types</h1>
          <p className="mt-1 text-sm text-gray-500">Configure tiers, pricing, and benefits for your members</p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-emerald-700">
          <Plus className="h-4 w-4" />
          Create Type
        </button>
      </div>

      {/* Summary bar */}
      <div className="flex items-center gap-6 rounded-xl border border-gray-200 bg-white px-6 py-4 shadow-sm">
        <div>
          <p className="text-xs font-medium uppercase text-gray-500">Total Types</p>
          <p className="text-xl font-semibold text-gray-900">{MOCK_TYPES.length}</p>
        </div>
        <div className="h-10 w-px bg-gray-200" />
        <div>
          <p className="text-xs font-medium uppercase text-gray-500">Total Members</p>
          <p className="text-xl font-semibold text-gray-900">{MOCK_TYPES.reduce((s, t) => s + t.memberCount, 0)}</p>
        </div>
        <div className="h-10 w-px bg-gray-200" />
        <div>
          <p className="text-xs font-medium uppercase text-gray-500">Active Types</p>
          <p className="text-xl font-semibold text-emerald-600">{MOCK_TYPES.filter((t) => t.active).length}</p>
        </div>
      </div>

      {/* Cards grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {MOCK_TYPES.map((t) => {
          const tc = tierColour(t.tier);
          return (
            <div
              key={t.id}
              className="relative flex flex-col rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              {/* Tier badge */}
              {tc && (
                <span
                  className={`absolute right-4 top-4 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ring-inset ${tc.bg} ${tc.text} ${tc.ring}`}
                >
                  <Star className="h-3 w-3" />
                  {t.tier!.charAt(0).toUpperCase() + t.tier!.slice(1)}
                </span>
              )}

              <div className="flex items-start gap-4 p-6 pb-0">
                <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <t.icon className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{t.name}</h3>
                  <p className="mt-0.5 text-sm text-gray-500">{t.description}</p>
                </div>
              </div>

              {/* Price */}
              <div className="px-6 pt-4">
                <span className="text-3xl font-bold text-gray-900">
                  {t.price === 0 ? 'Free' : `\u00A3${t.price.toLocaleString()}`}
                </span>
                {t.price > 0 && (
                  <span className="ml-1 text-sm text-gray-500">{billingLabel(t.billingPeriod)}</span>
                )}
              </div>

              {/* Member count */}
              <div className="px-6 pt-3">
                <p className="text-sm text-gray-500">
                  <span className="font-semibold text-gray-900">{t.memberCount}</span> current members
                </p>
              </div>

              {/* Benefits */}
              <div className="flex-1 px-6 pt-4">
                <p className="text-xs font-medium uppercase tracking-wider text-gray-400">Benefits</p>
                <ul className="mt-2 space-y-1.5">
                  {t.benefits.map((b) => (
                    <li key={b} className="flex items-start gap-2 text-sm text-gray-700">
                      <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-emerald-500" />
                      {b}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 border-t border-gray-100 px-6 py-4 mt-4">
                <button
                  onClick={() => setEditingId(t.id)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  <Edit3 className="h-3.5 w-3.5" />
                  Edit
                </button>
                <span
                  className={`ml-auto inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    t.active ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {t.active ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit modal placeholder */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="w-full max-w-lg rounded-xl bg-white p-6 shadow-xl">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Edit {MOCK_TYPES.find((t) => t.id === editingId)?.name} Membership
              </h2>
              <button onClick={() => setEditingId(null)} className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  defaultValue={MOCK_TYPES.find((t) => t.id === editingId)?.name}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  rows={2}
                  defaultValue={MOCK_TYPES.find((t) => t.id === editingId)?.description}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price (GBP)</label>
                  <input
                    type="number"
                    defaultValue={MOCK_TYPES.find((t) => t.id === editingId)?.price}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Billing Period</label>
                  <select
                    defaultValue={MOCK_TYPES.find((t) => t.id === editingId)?.billingPeriod}
                    className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                    <option value="lifetime">Lifetime</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Benefits (one per line)</label>
                <textarea
                  rows={4}
                  defaultValue={MOCK_TYPES.find((t) => t.id === editingId)?.benefits.join('\n')}
                  className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setEditingId(null)}
                className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={() => setEditingId(null)}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MembershipTypes;
