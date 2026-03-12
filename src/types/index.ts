// ============================================================================
// Forge Platform — Core Type Definitions
// ============================================================================

// ---------------------------------------------------------------------------
// Common / Shared
// ---------------------------------------------------------------------------

export type UUID = string;
export type ISODate = string;
export type ISODateTime = string;
export type Currency = number; // stored as cents/pence

export interface Person {
  id: UUID;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  avatar_url?: string;
  organisation_id?: UUID;
  tags: string[];
  notes?: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface Organisation {
  id: UUID;
  name: string;
  domain?: string;
  logo_url?: string;
  industry?: string;
  website?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  region?: string;
  postal_code?: string;
  country?: string;
  phone?: string;
  email?: string;
  notes?: string;
  tags: string[];
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface Document {
  id: UUID;
  title: string;
  description?: string;
  file_path: string;
  file_type: string;
  file_size: number;
  module: 'consul' | 'hearth' | 'lodge' | 'command';
  entity_type?: string;
  entity_id?: UUID;
  uploaded_by: UUID;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface Payment {
  id: UUID;
  amount: Currency;
  currency: string;
  status: 'pending' | 'processing' | 'completed' | 'failed' | 'refunded';
  method: 'card' | 'bank_transfer' | 'cash' | 'cheque' | 'other';
  reference?: string;
  description?: string;
  payer_id?: UUID;
  payee_id?: UUID;
  module: 'consul' | 'hearth' | 'lodge';
  entity_type?: string;
  entity_id?: UUID;
  paid_at?: ISODateTime;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface User {
  id: UUID;
  email: string;
  display_name: string;
  avatar_url?: string;
  role: 'admin' | 'manager' | 'member' | 'viewer';
  modules: ('consul' | 'hearth' | 'lodge' | 'command')[];
  preferences: UserPreferences;
  last_login?: ISODateTime;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  sidebar_collapsed: boolean;
  default_module: string;
  notification_email: boolean;
  notification_desktop: boolean;
  date_format: string;
  currency: string;
  timezone: string;
}

export interface Settings {
  id: UUID;
  key: string;
  value: string;
  module?: string;
  description?: string;
  updated_by: UUID;
  updated_at: ISODateTime;
}

export interface Notification {
  id: UUID;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  module?: 'consul' | 'hearth' | 'lodge' | 'command';
  entity_type?: string;
  entity_id?: UUID;
  action_url?: string;
  read: boolean;
  user_id: UUID;
  created_at: ISODateTime;
}

// ---------------------------------------------------------------------------
// Consul — Consulting / CRM
// ---------------------------------------------------------------------------

export type ConsulPipelineStage =
  | 'lead'
  | 'qualified'
  | 'proposal'
  | 'negotiation'
  | 'won'
  | 'lost'
  | 'on_hold';

export interface ConsulPipelineEntry {
  id: UUID;
  title: string;
  description?: string;
  stage: ConsulPipelineStage;
  value: Currency;
  currency: string;
  probability: number; // 0-100
  person_id?: UUID;
  organisation_id?: UUID;
  person?: Person;
  organisation?: Organisation;
  expected_close_date?: ISODate;
  source?: string;
  assigned_to?: UUID;
  tags: string[];
  notes?: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface ConsulProject {
  id: UUID;
  name: string;
  description?: string;
  status: 'planning' | 'active' | 'on_hold' | 'completed' | 'cancelled';
  client_id: UUID;
  client?: Person | Organisation;
  budget: Currency;
  currency: string;
  start_date?: ISODate;
  end_date?: ISODate;
  assigned_to: UUID[];
  tags: string[];
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface ConsulTask {
  id: UUID;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  project_id: UUID;
  assigned_to?: UUID;
  due_date?: ISODate;
  estimated_hours?: number;
  actual_hours?: number;
  tags: string[];
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface ConsulInvoiceItem {
  id: UUID;
  invoice_id: UUID;
  description: string;
  quantity: number;
  unit_price: Currency;
  tax_rate: number;
  total: Currency;
  sort_order: number;
}

export interface ConsulInvoice {
  id: UUID;
  invoice_number: string;
  status: 'draft' | 'sent' | 'viewed' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  client_id: UUID;
  client?: Person | Organisation;
  project_id?: UUID;
  items: ConsulInvoiceItem[];
  subtotal: Currency;
  tax_total: Currency;
  total: Currency;
  currency: string;
  issue_date: ISODate;
  due_date: ISODate;
  paid_date?: ISODate;
  notes?: string;
  payment_terms?: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface ConsulTimeEntry {
  id: UUID;
  description: string;
  project_id: UUID;
  task_id?: UUID;
  user_id: UUID;
  date: ISODate;
  hours: number;
  billable: boolean;
  rate?: Currency;
  invoiced: boolean;
  invoice_id?: UUID;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface ConsulProposal {
  id: UUID;
  title: string;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'declined' | 'expired';
  client_id: UUID;
  client?: Person | Organisation;
  pipeline_entry_id?: UUID;
  content: string;
  value: Currency;
  currency: string;
  valid_until?: ISODate;
  sent_at?: ISODateTime;
  responded_at?: ISODateTime;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface ConsulContract {
  id: UUID;
  title: string;
  status: 'draft' | 'pending_signature' | 'active' | 'completed' | 'terminated';
  client_id: UUID;
  client?: Person | Organisation;
  project_id?: UUID;
  content: string;
  value: Currency;
  currency: string;
  start_date: ISODate;
  end_date?: ISODate;
  signed_at?: ISODateTime;
  signed_by?: UUID;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface ConsulExpense {
  id: UUID;
  description: string;
  amount: Currency;
  currency: string;
  category: string;
  project_id?: UUID;
  receipt_url?: string;
  date: ISODate;
  billable: boolean;
  reimbursed: boolean;
  user_id: UUID;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

// ---------------------------------------------------------------------------
// Lodge — Membership
// ---------------------------------------------------------------------------

export interface LodgeMembershipType {
  id: UUID;
  name: string;
  description?: string;
  price: Currency;
  currency: string;
  billing_period: 'monthly' | 'quarterly' | 'annually' | 'lifetime';
  benefits: string[];
  max_members?: number;
  active: boolean;
  sort_order: number;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface LodgeMembership {
  id: UUID;
  person_id: UUID;
  person?: Person;
  membership_type_id: UUID;
  membership_type?: LodgeMembershipType;
  status: 'active' | 'pending' | 'suspended' | 'expired' | 'cancelled';
  member_number?: string;
  chapter_id?: UUID;
  start_date: ISODate;
  end_date?: ISODate;
  renewal_date?: ISODate;
  auto_renew: boolean;
  notes?: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface LodgeEvent {
  id: UUID;
  title: string;
  description?: string;
  type: 'meeting' | 'social' | 'workshop' | 'conference' | 'other';
  status: 'draft' | 'published' | 'cancelled' | 'completed';
  chapter_id?: UUID;
  location?: string;
  virtual_url?: string;
  start_date: ISODateTime;
  end_date: ISODateTime;
  capacity?: number;
  registration_deadline?: ISODateTime;
  fee?: Currency;
  currency?: string;
  members_only: boolean;
  tags: string[];
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface LodgeEventRegistration {
  id: UUID;
  event_id: UUID;
  person_id: UUID;
  person?: Person;
  status: 'registered' | 'waitlisted' | 'attended' | 'cancelled' | 'no_show';
  payment_status: 'pending' | 'paid' | 'refunded' | 'waived';
  registered_at: ISODateTime;
  checked_in_at?: ISODateTime;
  notes?: string;
}

export interface LodgeChapter {
  id: UUID;
  name: string;
  description?: string;
  region?: string;
  leader_id?: UUID;
  leader?: Person;
  member_count: number;
  status: 'active' | 'forming' | 'inactive';
  meeting_schedule?: string;
  location?: string;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

// ---------------------------------------------------------------------------
// Hearth — Loyalty / Payments
// ---------------------------------------------------------------------------

export interface HearthLoyaltyAccount {
  id: UUID;
  person_id: UUID;
  person?: Person;
  points_balance: number;
  lifetime_points: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  status: 'active' | 'suspended' | 'closed';
  enrolled_at: ISODateTime;
  last_activity_at?: ISODateTime;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface HearthLoyaltyTransaction {
  id: UUID;
  account_id: UUID;
  type: 'earn' | 'redeem' | 'adjust' | 'expire' | 'bonus';
  points: number;
  balance_after: number;
  description: string;
  merchant_id?: UUID;
  merchant?: HearthMerchant;
  reference_id?: string;
  created_at: ISODateTime;
}

export interface HearthMerchant {
  id: UUID;
  name: string;
  category: string;
  logo_url?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  commission_rate: number;
  status: 'active' | 'pending' | 'suspended' | 'inactive';
  points_multiplier: number;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface HearthCampaign {
  id: UUID;
  name: string;
  description?: string;
  type: 'bonus_points' | 'double_points' | 'discount' | 'referral' | 'milestone';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed' | 'cancelled';
  start_date: ISODateTime;
  end_date: ISODateTime;
  target_tiers: string[];
  merchant_ids: UUID[];
  rules: Record<string, unknown>;
  budget?: Currency;
  spent?: Currency;
  participants_count: number;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface HearthLoyaltyRule {
  id: UUID;
  name: string;
  description?: string;
  type: 'earn' | 'redeem' | 'tier_upgrade' | 'tier_downgrade' | 'bonus';
  conditions: Record<string, unknown>;
  actions: Record<string, unknown>;
  priority: number;
  active: boolean;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

// ---------------------------------------------------------------------------
// Command — Dashboard / Platform
// ---------------------------------------------------------------------------

export interface CommandWorkflow {
  id: UUID;
  name: string;
  description?: string;
  module: 'consul' | 'hearth' | 'lodge' | 'command';
  trigger_type: 'manual' | 'scheduled' | 'event';
  trigger_config: Record<string, unknown>;
  steps: CommandWorkflowStep[];
  status: 'active' | 'inactive' | 'draft';
  last_run_at?: ISODateTime;
  created_by: UUID;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface CommandWorkflowStep {
  id: UUID;
  type: 'action' | 'condition' | 'delay' | 'notification';
  config: Record<string, unknown>;
  sort_order: number;
}

export interface CommandWikiPage {
  id: UUID;
  title: string;
  content: string;
  slug: string;
  parent_id?: UUID;
  module?: 'consul' | 'hearth' | 'lodge' | 'command';
  tags: string[];
  published: boolean;
  author_id: UUID;
  last_edited_by: UUID;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface CommandReport {
  id: UUID;
  title: string;
  description?: string;
  type: 'revenue' | 'pipeline' | 'membership' | 'loyalty' | 'activity' | 'custom';
  module?: 'consul' | 'hearth' | 'lodge' | 'command';
  config: Record<string, unknown>;
  schedule?: 'daily' | 'weekly' | 'monthly';
  last_generated_at?: ISODateTime;
  created_by: UUID;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

export interface CommandCalendarEvent {
  id: UUID;
  title: string;
  description?: string;
  type: 'meeting' | 'deadline' | 'reminder' | 'event' | 'task';
  module?: 'consul' | 'hearth' | 'lodge' | 'command';
  start: ISODateTime;
  end: ISODateTime;
  all_day: boolean;
  location?: string;
  virtual_url?: string;
  attendees: UUID[];
  recurrence?: string;
  reminder_minutes?: number;
  color?: string;
  entity_type?: string;
  entity_id?: UUID;
  created_by: UUID;
  created_at: ISODateTime;
  updated_at: ISODateTime;
}

// ---------------------------------------------------------------------------
// Utility Types
// ---------------------------------------------------------------------------

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  total_pages: number;
}

export interface SearchResult {
  id: UUID;
  type: 'person' | 'organisation' | 'project' | 'invoice' | 'member' | 'event' | 'merchant' | 'campaign' | 'document' | 'wiki_page';
  title: string;
  subtitle?: string;
  module: 'consul' | 'hearth' | 'lodge' | 'command';
  url: string;
}

export type ModuleName = 'command' | 'consul' | 'hearth' | 'lodge';

export interface ModuleConfig {
  name: ModuleName;
  label: string;
  color: string;
  icon: string;
}

export type SortDirection = 'asc' | 'desc';

export interface SortConfig {
  key: string;
  direction: SortDirection;
}

export interface FilterConfig {
  key: string;
  operator: 'eq' | 'neq' | 'contains' | 'gt' | 'lt' | 'gte' | 'lte' | 'in';
  value: unknown;
}
