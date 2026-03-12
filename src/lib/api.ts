// ============================================================================
// Forge Platform — Tauri Invoke Wrapper & Mock Data
// ============================================================================

import type {
  Person,
  Organisation,
  ConsulPipelineEntry,
  ConsulProject,
  ConsulInvoice,
  ConsulTimeEntry,
  ConsulProposal,
  ConsulContract,
  ConsulExpense,
  LodgeMembership,
  LodgeMembershipType,
  LodgeEvent,
  LodgeEventRegistration,
  LodgeChapter,
  HearthLoyaltyAccount,
  HearthLoyaltyTransaction,
  HearthMerchant,
  HearthCampaign,
  HearthLoyaltyRule,
  CommandWorkflow,
  CommandWikiPage,
  CommandReport,
  CommandCalendarEvent,
  Payment,
  Document,
  Notification,
  SearchResult,
  PaginatedResponse,
} from '../types';

// ---------------------------------------------------------------------------
// Tauri invoke helper
// ---------------------------------------------------------------------------

let invoke: ((cmd: string, args?: Record<string, unknown>) => Promise<unknown>) | null = null;

async function getInvoke() {
  if (invoke) return invoke;
  try {
    const tauriApi = await import('@tauri-apps/api/core');
    invoke = tauriApi.invoke;
    return invoke;
  } catch {
    // Running outside Tauri (browser dev mode) — return null
    return null;
  }
}

async function tauriInvoke<T>(command: string, args?: Record<string, unknown>): Promise<T> {
  const inv = await getInvoke();
  if (inv) {
    return inv(command, args) as Promise<T>;
  }
  // Fallback to mock
  throw new Error(`NO_TAURI: ${command}`);
}

async function callOrMock<T>(command: string, args: Record<string, unknown> | undefined, mockFn: () => T): Promise<T> {
  try {
    return await tauriInvoke<T>(command, args);
  } catch {
    console.debug(`[Forge] Using mock data for: ${command}`);
    return mockFn();
  }
}

// ---------------------------------------------------------------------------
// Mock Data
// ---------------------------------------------------------------------------

const now = new Date().toISOString();
const today = new Date().toISOString().split('T')[0];

const mockPersons: Person[] = [
  { id: '1', first_name: 'Alice', last_name: 'Morgan', email: 'alice@example.com', tags: ['vip'], created_at: now, updated_at: now },
  { id: '2', first_name: 'Bob', last_name: 'Chen', email: 'bob@example.com', phone: '+44 7911 123456', tags: ['client'], created_at: now, updated_at: now },
  { id: '3', first_name: 'Clara', last_name: 'Williams', email: 'clara@example.com', tags: ['prospect'], created_at: now, updated_at: now },
  { id: '4', first_name: 'David', last_name: 'Okonkwo', email: 'david@example.com', tags: ['partner'], created_at: now, updated_at: now },
  { id: '5', first_name: 'Emily', last_name: 'Sato', email: 'emily@example.com', tags: ['member'], created_at: now, updated_at: now },
];

const mockOrganisations: Organisation[] = [
  { id: '1', name: 'Acme Corp', domain: 'acme.com', industry: 'Technology', tags: ['enterprise'], created_at: now, updated_at: now },
  { id: '2', name: 'Pinnacle Ltd', domain: 'pinnacle.co.uk', industry: 'Finance', tags: ['sme'], created_at: now, updated_at: now },
  { id: '3', name: 'Horizon Partners', industry: 'Consulting', tags: ['partner'], created_at: now, updated_at: now },
];

const mockPipeline: ConsulPipelineEntry[] = [
  { id: '1', title: 'Acme Digital Transformation', stage: 'proposal', value: 4500000, currency: 'GBP', probability: 60, organisation_id: '1', tags: ['digital'], created_at: now, updated_at: now },
  { id: '2', title: 'Pinnacle Compliance Audit', stage: 'qualified', value: 1200000, currency: 'GBP', probability: 40, organisation_id: '2', tags: ['compliance'], created_at: now, updated_at: now },
  { id: '3', title: 'Horizon Strategy Workshop', stage: 'won', value: 800000, currency: 'GBP', probability: 100, organisation_id: '3', tags: ['strategy'], created_at: now, updated_at: now },
  { id: '4', title: 'Cloud Migration Project', stage: 'lead', value: 2500000, currency: 'GBP', probability: 20, tags: ['cloud'], created_at: now, updated_at: now },
  { id: '5', title: 'Data Analytics Platform', stage: 'negotiation', value: 3200000, currency: 'GBP', probability: 75, tags: ['data'], created_at: now, updated_at: now },
];

const mockProjects: ConsulProject[] = [
  { id: '1', name: 'Acme Website Redesign', status: 'active', client_id: '1', budget: 2500000, currency: 'GBP', start_date: '2026-01-15', end_date: '2026-06-30', assigned_to: ['1'], tags: ['web'], created_at: now, updated_at: now },
  { id: '2', name: 'Pinnacle Compliance Audit', status: 'active', client_id: '2', budget: 1200000, currency: 'GBP', start_date: '2026-02-01', assigned_to: ['2'], tags: ['audit'], created_at: now, updated_at: now },
  { id: '3', name: 'Horizon Strategy Report', status: 'completed', client_id: '3', budget: 800000, currency: 'GBP', start_date: '2025-11-01', end_date: '2026-01-31', assigned_to: ['1', '3'], tags: ['strategy'], created_at: now, updated_at: now },
];

const mockInvoices: ConsulInvoice[] = [
  { id: '1', invoice_number: 'INV-2026-001', status: 'paid', client_id: '1', items: [], subtotal: 1250000, tax_total: 250000, total: 1500000, currency: 'GBP', issue_date: '2026-02-01', due_date: '2026-03-01', paid_date: '2026-02-28', created_at: now, updated_at: now },
  { id: '2', invoice_number: 'INV-2026-002', status: 'sent', client_id: '2', items: [], subtotal: 600000, tax_total: 120000, total: 720000, currency: 'GBP', issue_date: '2026-03-01', due_date: '2026-03-31', created_at: now, updated_at: now },
  { id: '3', invoice_number: 'INV-2026-003', status: 'overdue', client_id: '3', items: [], subtotal: 400000, tax_total: 80000, total: 480000, currency: 'GBP', issue_date: '2026-01-15', due_date: '2026-02-15', created_at: now, updated_at: now },
];

const mockMembers: LodgeMembership[] = [
  { id: '1', person_id: '1', membership_type_id: '1', status: 'active', member_number: 'MEM-001', start_date: '2025-01-01', renewal_date: '2026-01-01', auto_renew: true, created_at: now, updated_at: now },
  { id: '2', person_id: '5', membership_type_id: '2', status: 'active', member_number: 'MEM-002', start_date: '2025-06-15', renewal_date: '2026-06-15', auto_renew: true, created_at: now, updated_at: now },
  { id: '3', person_id: '3', membership_type_id: '1', status: 'pending', start_date: '2026-03-01', auto_renew: false, created_at: now, updated_at: now },
];

const mockMembershipTypes: LodgeMembershipType[] = [
  { id: '1', name: 'Standard', description: 'Basic membership with core benefits', price: 9900, currency: 'GBP', billing_period: 'annually', benefits: ['Newsletter', 'Events access', 'Member directory'], active: true, sort_order: 1, created_at: now, updated_at: now },
  { id: '2', name: 'Premium', description: 'Full access with premium benefits', price: 24900, currency: 'GBP', billing_period: 'annually', benefits: ['All Standard benefits', 'Priority support', 'Exclusive events', 'Mentoring'], active: true, sort_order: 2, created_at: now, updated_at: now },
];

const mockLoyaltyAccounts: HearthLoyaltyAccount[] = [
  { id: '1', person_id: '1', points_balance: 4250, lifetime_points: 12800, tier: 'gold', status: 'active', enrolled_at: '2024-06-01T00:00:00Z', last_activity_at: now, created_at: now, updated_at: now },
  { id: '2', person_id: '5', points_balance: 1100, lifetime_points: 3200, tier: 'silver', status: 'active', enrolled_at: '2025-01-15T00:00:00Z', last_activity_at: now, created_at: now, updated_at: now },
];

const mockMerchants: HearthMerchant[] = [
  { id: '1', name: 'The Brunel Arms', category: 'Hospitality', commission_rate: 5, status: 'active', points_multiplier: 2, created_at: now, updated_at: now },
  { id: '2', name: 'Sterling Books', category: 'Retail', commission_rate: 3, status: 'active', points_multiplier: 1, created_at: now, updated_at: now },
];

const mockCalendarEvents: CommandCalendarEvent[] = [
  { id: '1', title: 'Team Standup', type: 'meeting', module: 'command', start: '2026-03-12T09:00:00Z', end: '2026-03-12T09:30:00Z', all_day: false, attendees: ['1', '2'], created_by: '1', created_at: now, updated_at: now },
  { id: '2', title: 'Client Review — Acme', type: 'meeting', module: 'consul', start: '2026-03-12T14:00:00Z', end: '2026-03-12T15:00:00Z', all_day: false, attendees: ['1'], color: '#2563eb', created_by: '1', created_at: now, updated_at: now },
  { id: '3', title: 'Invoice Due: INV-2026-002', type: 'deadline', module: 'consul', start: '2026-03-31T00:00:00Z', end: '2026-03-31T23:59:00Z', all_day: true, attendees: [], color: '#2563eb', created_by: '1', created_at: now, updated_at: now },
];

// ---------------------------------------------------------------------------
// API Functions — People & Organisations (shared)
// ---------------------------------------------------------------------------

export const api = {
  // People
  getPersons: () => callOrMock<Person[]>('get_persons', undefined, () => mockPersons),
  getPerson: (id: string) => callOrMock<Person>('get_person', { id }, () => mockPersons.find(p => p.id === id)!),
  createPerson: (data: Partial<Person>) => callOrMock<Person>('create_person', { data }, () => ({ ...mockPersons[0], ...data, id: crypto.randomUUID() })),
  updatePerson: (id: string, data: Partial<Person>) => callOrMock<Person>('update_person', { id, data }, () => ({ ...mockPersons[0], ...data, id })),
  deletePerson: (id: string) => callOrMock<void>('delete_person', { id }, () => undefined),

  // Organisations
  getOrganisations: () => callOrMock<Organisation[]>('get_organisations', undefined, () => mockOrganisations),
  getOrganisation: (id: string) => callOrMock<Organisation>('get_organisation', { id }, () => mockOrganisations.find(o => o.id === id)!),
  createOrganisation: (data: Partial<Organisation>) => callOrMock<Organisation>('create_organisation', { data }, () => ({ ...mockOrganisations[0], ...data, id: crypto.randomUUID() })),
  updateOrganisation: (id: string, data: Partial<Organisation>) => callOrMock<Organisation>('update_organisation', { id, data }, () => ({ ...mockOrganisations[0], ...data, id })),
  deleteOrganisation: (id: string) => callOrMock<void>('delete_organisation', { id }, () => undefined),

  // ---------------------------------------------------------------------------
  // Consul — CRM / Consulting
  // ---------------------------------------------------------------------------
  consul: {
    // Pipeline
    getPipeline: () => callOrMock<ConsulPipelineEntry[]>('consul_get_pipeline', undefined, () => mockPipeline),
    getPipelineEntry: (id: string) => callOrMock<ConsulPipelineEntry>('consul_get_pipeline_entry', { id }, () => mockPipeline.find(p => p.id === id)!),
    createPipelineEntry: (data: Partial<ConsulPipelineEntry>) => callOrMock<ConsulPipelineEntry>('consul_create_pipeline_entry', { data }, () => ({ ...mockPipeline[0], ...data, id: crypto.randomUUID() })),
    updatePipelineEntry: (id: string, data: Partial<ConsulPipelineEntry>) => callOrMock<ConsulPipelineEntry>('consul_update_pipeline_entry', { id, data }, () => ({ ...mockPipeline[0], ...data, id })),
    deletePipelineEntry: (id: string) => callOrMock<void>('consul_delete_pipeline_entry', { id }, () => undefined),

    // Projects
    getProjects: () => callOrMock<ConsulProject[]>('consul_get_projects', undefined, () => mockProjects),
    getProject: (id: string) => callOrMock<ConsulProject>('consul_get_project', { id }, () => mockProjects.find(p => p.id === id)!),
    createProject: (data: Partial<ConsulProject>) => callOrMock<ConsulProject>('consul_create_project', { data }, () => ({ ...mockProjects[0], ...data, id: crypto.randomUUID() })),
    updateProject: (id: string, data: Partial<ConsulProject>) => callOrMock<ConsulProject>('consul_update_project', { id, data }, () => ({ ...mockProjects[0], ...data, id })),
    deleteProject: (id: string) => callOrMock<void>('consul_delete_project', { id }, () => undefined),

    // Invoices
    getInvoices: () => callOrMock<ConsulInvoice[]>('consul_get_invoices', undefined, () => mockInvoices),
    getInvoice: (id: string) => callOrMock<ConsulInvoice>('consul_get_invoice', { id }, () => mockInvoices.find(i => i.id === id)!),
    createInvoice: (data: Partial<ConsulInvoice>) => callOrMock<ConsulInvoice>('consul_create_invoice', { data }, () => ({ ...mockInvoices[0], ...data, id: crypto.randomUUID() })),
    updateInvoice: (id: string, data: Partial<ConsulInvoice>) => callOrMock<ConsulInvoice>('consul_update_invoice', { id, data }, () => ({ ...mockInvoices[0], ...data, id })),
    deleteInvoice: (id: string) => callOrMock<void>('consul_delete_invoice', { id }, () => undefined),

    // Time Entries
    getTimeEntries: (projectId?: string) => callOrMock<ConsulTimeEntry[]>('consul_get_time_entries', { projectId }, () => []),
    createTimeEntry: (data: Partial<ConsulTimeEntry>) => callOrMock<ConsulTimeEntry>('consul_create_time_entry', { data }, () => ({ id: crypto.randomUUID(), description: '', project_id: '', user_id: '', date: today, hours: 0, billable: true, invoiced: false, created_at: now, updated_at: now, ...data } as ConsulTimeEntry)),
    updateTimeEntry: (id: string, data: Partial<ConsulTimeEntry>) => callOrMock<ConsulTimeEntry>('consul_update_time_entry', { id, data }, () => ({ ...data, id } as ConsulTimeEntry)),
    deleteTimeEntry: (id: string) => callOrMock<void>('consul_delete_time_entry', { id }, () => undefined),

    // Proposals
    getProposals: () => callOrMock<ConsulProposal[]>('consul_get_proposals', undefined, () => []),
    getProposal: (id: string) => callOrMock<ConsulProposal>('consul_get_proposal', { id }, () => ({} as ConsulProposal)),
    createProposal: (data: Partial<ConsulProposal>) => callOrMock<ConsulProposal>('consul_create_proposal', { data }, () => ({ ...data, id: crypto.randomUUID() } as ConsulProposal)),
    updateProposal: (id: string, data: Partial<ConsulProposal>) => callOrMock<ConsulProposal>('consul_update_proposal', { id, data }, () => ({ ...data, id } as ConsulProposal)),
    deleteProposal: (id: string) => callOrMock<void>('consul_delete_proposal', { id }, () => undefined),

    // Contracts
    getContracts: () => callOrMock<ConsulContract[]>('consul_get_contracts', undefined, () => []),
    getContract: (id: string) => callOrMock<ConsulContract>('consul_get_contract', { id }, () => ({} as ConsulContract)),
    createContract: (data: Partial<ConsulContract>) => callOrMock<ConsulContract>('consul_create_contract', { data }, () => ({ ...data, id: crypto.randomUUID() } as ConsulContract)),
    updateContract: (id: string, data: Partial<ConsulContract>) => callOrMock<ConsulContract>('consul_update_contract', { id, data }, () => ({ ...data, id } as ConsulContract)),
    deleteContract: (id: string) => callOrMock<void>('consul_delete_contract', { id }, () => undefined),

    // Expenses
    getExpenses: (projectId?: string) => callOrMock<ConsulExpense[]>('consul_get_expenses', { projectId }, () => []),
    createExpense: (data: Partial<ConsulExpense>) => callOrMock<ConsulExpense>('consul_create_expense', { data }, () => ({ ...data, id: crypto.randomUUID() } as ConsulExpense)),
    updateExpense: (id: string, data: Partial<ConsulExpense>) => callOrMock<ConsulExpense>('consul_update_expense', { id, data }, () => ({ ...data, id } as ConsulExpense)),
    deleteExpense: (id: string) => callOrMock<void>('consul_delete_expense', { id }, () => undefined),
  },

  // ---------------------------------------------------------------------------
  // Lodge — Membership
  // ---------------------------------------------------------------------------
  lodge: {
    // Memberships
    getMemberships: () => callOrMock<LodgeMembership[]>('lodge_get_memberships', undefined, () => mockMembers),
    getMembership: (id: string) => callOrMock<LodgeMembership>('lodge_get_membership', { id }, () => mockMembers.find(m => m.id === id)!),
    createMembership: (data: Partial<LodgeMembership>) => callOrMock<LodgeMembership>('lodge_create_membership', { data }, () => ({ ...mockMembers[0], ...data, id: crypto.randomUUID() })),
    updateMembership: (id: string, data: Partial<LodgeMembership>) => callOrMock<LodgeMembership>('lodge_update_membership', { id, data }, () => ({ ...mockMembers[0], ...data, id })),
    deleteMembership: (id: string) => callOrMock<void>('lodge_delete_membership', { id }, () => undefined),

    // Membership Types
    getMembershipTypes: () => callOrMock<LodgeMembershipType[]>('lodge_get_membership_types', undefined, () => mockMembershipTypes),
    createMembershipType: (data: Partial<LodgeMembershipType>) => callOrMock<LodgeMembershipType>('lodge_create_membership_type', { data }, () => ({ ...mockMembershipTypes[0], ...data, id: crypto.randomUUID() })),
    updateMembershipType: (id: string, data: Partial<LodgeMembershipType>) => callOrMock<LodgeMembershipType>('lodge_update_membership_type', { id, data }, () => ({ ...mockMembershipTypes[0], ...data, id })),
    deleteMembershipType: (id: string) => callOrMock<void>('lodge_delete_membership_type', { id }, () => undefined),

    // Events
    getEvents: () => callOrMock<LodgeEvent[]>('lodge_get_events', undefined, () => []),
    getEvent: (id: string) => callOrMock<LodgeEvent>('lodge_get_event', { id }, () => ({} as LodgeEvent)),
    createEvent: (data: Partial<LodgeEvent>) => callOrMock<LodgeEvent>('lodge_create_event', { data }, () => ({ ...data, id: crypto.randomUUID() } as LodgeEvent)),
    updateEvent: (id: string, data: Partial<LodgeEvent>) => callOrMock<LodgeEvent>('lodge_update_event', { id, data }, () => ({ ...data, id } as LodgeEvent)),
    deleteEvent: (id: string) => callOrMock<void>('lodge_delete_event', { id }, () => undefined),

    // Event Registrations
    getEventRegistrations: (eventId: string) => callOrMock<LodgeEventRegistration[]>('lodge_get_event_registrations', { eventId }, () => []),
    createEventRegistration: (data: Partial<LodgeEventRegistration>) => callOrMock<LodgeEventRegistration>('lodge_create_event_registration', { data }, () => ({ ...data, id: crypto.randomUUID() } as LodgeEventRegistration)),
    updateEventRegistration: (id: string, data: Partial<LodgeEventRegistration>) => callOrMock<LodgeEventRegistration>('lodge_update_event_registration', { id, data }, () => ({ ...data, id } as LodgeEventRegistration)),

    // Chapters
    getChapters: () => callOrMock<LodgeChapter[]>('lodge_get_chapters', undefined, () => []),
    getChapter: (id: string) => callOrMock<LodgeChapter>('lodge_get_chapter', { id }, () => ({} as LodgeChapter)),
    createChapter: (data: Partial<LodgeChapter>) => callOrMock<LodgeChapter>('lodge_create_chapter', { data }, () => ({ ...data, id: crypto.randomUUID() } as LodgeChapter)),
    updateChapter: (id: string, data: Partial<LodgeChapter>) => callOrMock<LodgeChapter>('lodge_update_chapter', { id, data }, () => ({ ...data, id } as LodgeChapter)),
    deleteChapter: (id: string) => callOrMock<void>('lodge_delete_chapter', { id }, () => undefined),
  },

  // ---------------------------------------------------------------------------
  // Hearth — Loyalty / Payments
  // ---------------------------------------------------------------------------
  hearth: {
    // Loyalty Accounts
    getLoyaltyAccounts: () => callOrMock<HearthLoyaltyAccount[]>('hearth_get_loyalty_accounts', undefined, () => mockLoyaltyAccounts),
    getLoyaltyAccount: (id: string) => callOrMock<HearthLoyaltyAccount>('hearth_get_loyalty_account', { id }, () => mockLoyaltyAccounts.find(a => a.id === id)!),
    createLoyaltyAccount: (data: Partial<HearthLoyaltyAccount>) => callOrMock<HearthLoyaltyAccount>('hearth_create_loyalty_account', { data }, () => ({ ...mockLoyaltyAccounts[0], ...data, id: crypto.randomUUID() })),
    updateLoyaltyAccount: (id: string, data: Partial<HearthLoyaltyAccount>) => callOrMock<HearthLoyaltyAccount>('hearth_update_loyalty_account', { id, data }, () => ({ ...mockLoyaltyAccounts[0], ...data, id })),

    // Loyalty Transactions
    getLoyaltyTransactions: (accountId?: string) => callOrMock<HearthLoyaltyTransaction[]>('hearth_get_loyalty_transactions', { accountId }, () => []),
    createLoyaltyTransaction: (data: Partial<HearthLoyaltyTransaction>) => callOrMock<HearthLoyaltyTransaction>('hearth_create_loyalty_transaction', { data }, () => ({ ...data, id: crypto.randomUUID() } as HearthLoyaltyTransaction)),

    // Merchants
    getMerchants: () => callOrMock<HearthMerchant[]>('hearth_get_merchants', undefined, () => mockMerchants),
    getMerchant: (id: string) => callOrMock<HearthMerchant>('hearth_get_merchant', { id }, () => mockMerchants.find(m => m.id === id)!),
    createMerchant: (data: Partial<HearthMerchant>) => callOrMock<HearthMerchant>('hearth_create_merchant', { data }, () => ({ ...mockMerchants[0], ...data, id: crypto.randomUUID() })),
    updateMerchant: (id: string, data: Partial<HearthMerchant>) => callOrMock<HearthMerchant>('hearth_update_merchant', { id, data }, () => ({ ...mockMerchants[0], ...data, id })),
    deleteMerchant: (id: string) => callOrMock<void>('hearth_delete_merchant', { id }, () => undefined),

    // Campaigns
    getCampaigns: () => callOrMock<HearthCampaign[]>('hearth_get_campaigns', undefined, () => []),
    getCampaign: (id: string) => callOrMock<HearthCampaign>('hearth_get_campaign', { id }, () => ({} as HearthCampaign)),
    createCampaign: (data: Partial<HearthCampaign>) => callOrMock<HearthCampaign>('hearth_create_campaign', { data }, () => ({ ...data, id: crypto.randomUUID() } as HearthCampaign)),
    updateCampaign: (id: string, data: Partial<HearthCampaign>) => callOrMock<HearthCampaign>('hearth_update_campaign', { id, data }, () => ({ ...data, id } as HearthCampaign)),
    deleteCampaign: (id: string) => callOrMock<void>('hearth_delete_campaign', { id }, () => undefined),

    // Loyalty Rules
    getLoyaltyRules: () => callOrMock<HearthLoyaltyRule[]>('hearth_get_loyalty_rules', undefined, () => []),
    createLoyaltyRule: (data: Partial<HearthLoyaltyRule>) => callOrMock<HearthLoyaltyRule>('hearth_create_loyalty_rule', { data }, () => ({ ...data, id: crypto.randomUUID() } as HearthLoyaltyRule)),
    updateLoyaltyRule: (id: string, data: Partial<HearthLoyaltyRule>) => callOrMock<HearthLoyaltyRule>('hearth_update_loyalty_rule', { id, data }, () => ({ ...data, id } as HearthLoyaltyRule)),
    deleteLoyaltyRule: (id: string) => callOrMock<void>('hearth_delete_loyalty_rule', { id }, () => undefined),
  },

  // ---------------------------------------------------------------------------
  // Command — Platform / Dashboard
  // ---------------------------------------------------------------------------
  command: {
    // Calendar Events
    getCalendarEvents: () => callOrMock<CommandCalendarEvent[]>('command_get_calendar_events', undefined, () => mockCalendarEvents),
    createCalendarEvent: (data: Partial<CommandCalendarEvent>) => callOrMock<CommandCalendarEvent>('command_create_calendar_event', { data }, () => ({ ...data, id: crypto.randomUUID() } as CommandCalendarEvent)),
    updateCalendarEvent: (id: string, data: Partial<CommandCalendarEvent>) => callOrMock<CommandCalendarEvent>('command_update_calendar_event', { id, data }, () => ({ ...data, id } as CommandCalendarEvent)),
    deleteCalendarEvent: (id: string) => callOrMock<void>('command_delete_calendar_event', { id }, () => undefined),

    // Workflows
    getWorkflows: () => callOrMock<CommandWorkflow[]>('command_get_workflows', undefined, () => []),
    getWorkflow: (id: string) => callOrMock<CommandWorkflow>('command_get_workflow', { id }, () => ({} as CommandWorkflow)),
    createWorkflow: (data: Partial<CommandWorkflow>) => callOrMock<CommandWorkflow>('command_create_workflow', { data }, () => ({ ...data, id: crypto.randomUUID() } as CommandWorkflow)),
    updateWorkflow: (id: string, data: Partial<CommandWorkflow>) => callOrMock<CommandWorkflow>('command_update_workflow', { id, data }, () => ({ ...data, id } as CommandWorkflow)),
    deleteWorkflow: (id: string) => callOrMock<void>('command_delete_workflow', { id }, () => undefined),

    // Wiki Pages
    getWikiPages: () => callOrMock<CommandWikiPage[]>('command_get_wiki_pages', undefined, () => []),
    getWikiPage: (id: string) => callOrMock<CommandWikiPage>('command_get_wiki_page', { id }, () => ({} as CommandWikiPage)),
    createWikiPage: (data: Partial<CommandWikiPage>) => callOrMock<CommandWikiPage>('command_create_wiki_page', { data }, () => ({ ...data, id: crypto.randomUUID() } as CommandWikiPage)),
    updateWikiPage: (id: string, data: Partial<CommandWikiPage>) => callOrMock<CommandWikiPage>('command_update_wiki_page', { id, data }, () => ({ ...data, id } as CommandWikiPage)),
    deleteWikiPage: (id: string) => callOrMock<void>('command_delete_wiki_page', { id }, () => undefined),

    // Reports
    getReports: () => callOrMock<CommandReport[]>('command_get_reports', undefined, () => []),
    getReport: (id: string) => callOrMock<CommandReport>('command_get_report', { id }, () => ({} as CommandReport)),
    createReport: (data: Partial<CommandReport>) => callOrMock<CommandReport>('command_create_report', { data }, () => ({ ...data, id: crypto.randomUUID() } as CommandReport)),
    deleteReport: (id: string) => callOrMock<void>('command_delete_report', { id }, () => undefined),
  },

  // ---------------------------------------------------------------------------
  // Cross-cutting
  // ---------------------------------------------------------------------------
  search: (query: string) => callOrMock<SearchResult[]>('global_search', { query }, () => {
    const q = query.toLowerCase();
    const results: SearchResult[] = [];
    mockPersons.filter(p => `${p.first_name} ${p.last_name}`.toLowerCase().includes(q)).forEach(p => {
      results.push({ id: p.id, type: 'person', title: `${p.first_name} ${p.last_name}`, subtitle: p.email, module: 'consul', url: `/consul/clients/${p.id}` });
    });
    mockOrganisations.filter(o => o.name.toLowerCase().includes(q)).forEach(o => {
      results.push({ id: o.id, type: 'organisation', title: o.name, subtitle: o.industry, module: 'consul', url: `/consul/clients/${o.id}` });
    });
    mockProjects.filter(p => p.name.toLowerCase().includes(q)).forEach(p => {
      results.push({ id: p.id, type: 'project', title: p.name, module: 'consul', url: `/consul/projects/${p.id}` });
    });
    return results;
  }),

  getNotifications: () => callOrMock<Notification[]>('get_notifications', undefined, () => []),
  markNotificationRead: (id: string) => callOrMock<void>('mark_notification_read', { id }, () => undefined),

  getDocuments: (entityType?: string, entityId?: string) => callOrMock<Document[]>('get_documents', { entityType, entityId }, () => []),
  uploadDocument: (data: Partial<Document>) => callOrMock<Document>('upload_document', { data }, () => ({ ...data, id: crypto.randomUUID() } as Document)),
  deleteDocument: (id: string) => callOrMock<void>('delete_document', { id }, () => undefined),

  getPayments: () => callOrMock<Payment[]>('get_payments', undefined, () => []),
};
