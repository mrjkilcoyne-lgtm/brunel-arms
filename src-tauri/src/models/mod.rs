use serde::{Deserialize, Serialize};

// ============================================================
// CORE MODELS
// ============================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Person {
    pub id: String,
    pub first_name: String,
    pub last_name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub mobile: Option<String>,
    pub address_line1: Option<String>,
    pub address_line2: Option<String>,
    pub city: Option<String>,
    pub county: Option<String>,
    pub postcode: Option<String>,
    pub country: Option<String>,
    pub date_of_birth: Option<String>,
    pub gender: Option<String>,
    pub avatar_url: Option<String>,
    pub notes: Option<String>,
    pub status: String,
    pub organisation_id: Option<String>,
    pub job_title: Option<String>,
    pub department: Option<String>,
    pub source: Option<String>,
    pub tags: Option<String>,
    pub custom_fields: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Organisation {
    pub id: String,
    pub name: String,
    pub trading_name: Option<String>,
    pub company_number: Option<String>,
    pub vat_number: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub website: Option<String>,
    pub address_line1: Option<String>,
    pub address_line2: Option<String>,
    pub city: Option<String>,
    pub county: Option<String>,
    pub postcode: Option<String>,
    pub country: Option<String>,
    pub industry: Option<String>,
    pub size: Option<String>,
    pub notes: Option<String>,
    pub status: String,
    pub logo_url: Option<String>,
    pub tags: Option<String>,
    pub custom_fields: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Document {
    pub id: String,
    pub title: String,
    pub doc_type: String,
    pub content: Option<String>,
    pub file_path: Option<String>,
    pub mime_type: Option<String>,
    pub size_bytes: Option<i64>,
    pub version: i32,
    pub status: String,
    pub owner_id: Option<String>,
    pub person_id: Option<String>,
    pub organisation_id: Option<String>,
    pub tags: Option<String>,
    pub metadata: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Payment {
    pub id: String,
    pub amount: f64,
    pub currency: String,
    pub payment_method: Option<String>,
    pub status: String,
    pub direction: String,
    pub reference: Option<String>,
    pub description: Option<String>,
    pub person_id: Option<String>,
    pub organisation_id: Option<String>,
    pub invoice_id: Option<String>,
    pub stripe_id: Option<String>,
    pub gocardless_id: Option<String>,
    pub metadata: Option<String>,
    pub paid_at: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct User {
    pub id: String,
    pub username: String,
    pub email: String,
    #[serde(skip_serializing)]
    pub password_hash: String,
    pub display_name: String,
    pub role: String,
    pub avatar_url: Option<String>,
    pub person_id: Option<String>,
    pub is_active: bool,
    pub last_login_at: Option<String>,
    pub preferences: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Settings {
    pub id: String,
    pub key: String,
    pub value: String,
    pub category: String,
    pub description: Option<String>,
    pub data_type: String,
    pub created_at: String,
    pub updated_at: String,
}

// ============================================================
// CONSUL MODULE MODELS
// ============================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConsulProject {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub status: String,
    pub budget: Option<f64>,
    pub currency: String,
    pub hourly_rate: Option<f64>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub deadline: Option<String>,
    pub person_id: Option<String>,
    pub organisation_id: Option<String>,
    pub owner_id: Option<String>,
    pub contract_id: Option<String>,
    pub colour: Option<String>,
    pub tags: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConsulInvoice {
    pub id: String,
    pub invoice_number: String,
    pub status: String,
    pub subtotal: f64,
    pub tax_rate: f64,
    pub tax_amount: f64,
    pub total: f64,
    pub currency: String,
    pub issue_date: String,
    pub due_date: String,
    pub paid_date: Option<String>,
    pub notes: Option<String>,
    pub payment_terms: Option<String>,
    pub person_id: Option<String>,
    pub organisation_id: Option<String>,
    pub project_id: Option<String>,
    pub contract_id: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConsulTimeEntry {
    pub id: String,
    pub description: Option<String>,
    pub duration_mins: i32,
    pub billable: bool,
    pub hourly_rate: Option<f64>,
    pub date: String,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub project_id: Option<String>,
    pub task_id: Option<String>,
    pub user_id: Option<String>,
    pub person_id: Option<String>,
    pub invoice_id: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ConsulPipelineEntry {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub value: f64,
    pub currency: String,
    pub probability: i32,
    pub stage_id: String,
    pub person_id: Option<String>,
    pub organisation_id: Option<String>,
    pub owner_id: Option<String>,
    pub expected_close: Option<String>,
    pub source: Option<String>,
    pub tags: Option<String>,
    pub custom_fields: Option<String>,
    pub lost_reason: Option<String>,
    pub won_at: Option<String>,
    pub lost_at: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

// ============================================================
// LODGE MODULE MODELS
// ============================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LodgeMembershipType {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub price: f64,
    pub currency: String,
    pub duration_months: i32,
    pub benefits: Option<String>,
    pub max_members: Option<i32>,
    pub is_active: bool,
    pub colour: Option<String>,
    pub sort_order: i32,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LodgeMembership {
    pub id: String,
    pub membership_number: String,
    pub person_id: String,
    pub membership_type_id: String,
    pub status: String,
    pub start_date: String,
    pub end_date: Option<String>,
    pub renewal_date: Option<String>,
    pub auto_renew: bool,
    pub payment_method: Option<String>,
    pub stripe_subscription_id: Option<String>,
    pub gocardless_mandate_id: Option<String>,
    pub notes: Option<String>,
    pub chapter_id: Option<String>,
    pub joined_at: String,
    pub cancelled_at: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct LodgeEvent {
    pub id: String,
    pub title: String,
    pub description: Option<String>,
    pub event_type: String,
    pub location: Option<String>,
    pub address: Option<String>,
    pub start_datetime: String,
    pub end_datetime: Option<String>,
    pub capacity: Option<i32>,
    pub price: f64,
    pub currency: String,
    pub is_members_only: bool,
    pub status: String,
    pub organiser_id: Option<String>,
    pub chapter_id: Option<String>,
    pub image_url: Option<String>,
    pub tags: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

// ============================================================
// HEARTH MODULE MODELS
// ============================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HearthLoyaltyAccount {
    pub id: String,
    pub person_id: String,
    pub account_number: String,
    pub points_balance: i32,
    pub lifetime_points: i32,
    pub tier: String,
    pub status: String,
    pub last_activity: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HearthMerchant {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub category: Option<String>,
    pub contact_email: Option<String>,
    pub contact_phone: Option<String>,
    pub address: Option<String>,
    pub city: Option<String>,
    pub postcode: Option<String>,
    pub country: Option<String>,
    pub website: Option<String>,
    pub logo_url: Option<String>,
    pub commission_rate: f64,
    pub is_active: bool,
    pub stripe_account_id: Option<String>,
    pub organisation_id: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HearthCampaign {
    pub id: String,
    pub name: String,
    pub description: Option<String>,
    pub campaign_type: String,
    pub status: String,
    pub points_bonus: i32,
    pub multiplier: f64,
    pub min_spend: f64,
    pub budget: Option<f64>,
    pub spent: f64,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub target_tier: Option<String>,
    pub merchant_id: Option<String>,
    pub terms: Option<String>,
    pub created_at: String,
    pub updated_at: String,
}

// ============================================================
// INPUT / CREATION STRUCTS
// ============================================================

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreatePerson {
    pub first_name: String,
    pub last_name: String,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub mobile: Option<String>,
    pub address_line1: Option<String>,
    pub address_line2: Option<String>,
    pub city: Option<String>,
    pub county: Option<String>,
    pub postcode: Option<String>,
    pub country: Option<String>,
    pub date_of_birth: Option<String>,
    pub gender: Option<String>,
    pub notes: Option<String>,
    pub organisation_id: Option<String>,
    pub job_title: Option<String>,
    pub department: Option<String>,
    pub source: Option<String>,
    pub tags: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct UpdatePerson {
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub mobile: Option<String>,
    pub address_line1: Option<String>,
    pub address_line2: Option<String>,
    pub city: Option<String>,
    pub county: Option<String>,
    pub postcode: Option<String>,
    pub country: Option<String>,
    pub date_of_birth: Option<String>,
    pub gender: Option<String>,
    pub notes: Option<String>,
    pub status: Option<String>,
    pub organisation_id: Option<String>,
    pub job_title: Option<String>,
    pub department: Option<String>,
    pub source: Option<String>,
    pub tags: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateProject {
    pub name: String,
    pub description: Option<String>,
    pub budget: Option<f64>,
    pub currency: Option<String>,
    pub hourly_rate: Option<f64>,
    pub start_date: Option<String>,
    pub end_date: Option<String>,
    pub deadline: Option<String>,
    pub person_id: Option<String>,
    pub organisation_id: Option<String>,
    pub owner_id: Option<String>,
    pub colour: Option<String>,
    pub tags: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateInvoice {
    pub invoice_number: String,
    pub subtotal: f64,
    pub tax_rate: Option<f64>,
    pub issue_date: String,
    pub due_date: String,
    pub notes: Option<String>,
    pub payment_terms: Option<String>,
    pub person_id: Option<String>,
    pub organisation_id: Option<String>,
    pub project_id: Option<String>,
    pub items: Option<Vec<CreateInvoiceItem>>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateInvoiceItem {
    pub description: String,
    pub quantity: f64,
    pub unit_price: f64,
    pub tax_rate: Option<f64>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreatePipelineEntry {
    pub title: String,
    pub description: Option<String>,
    pub value: Option<f64>,
    pub currency: Option<String>,
    pub probability: Option<i32>,
    pub stage_id: String,
    pub person_id: Option<String>,
    pub organisation_id: Option<String>,
    pub owner_id: Option<String>,
    pub expected_close: Option<String>,
    pub source: Option<String>,
    pub tags: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateTimeEntry {
    pub description: Option<String>,
    pub duration_mins: i32,
    pub billable: Option<bool>,
    pub hourly_rate: Option<f64>,
    pub date: String,
    pub start_time: Option<String>,
    pub end_time: Option<String>,
    pub project_id: Option<String>,
    pub task_id: Option<String>,
    pub user_id: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateMembership {
    pub person_id: String,
    pub membership_type_id: String,
    pub start_date: String,
    pub end_date: Option<String>,
    pub auto_renew: Option<bool>,
    pub payment_method: Option<String>,
    pub chapter_id: Option<String>,
    pub notes: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct CreateEvent {
    pub title: String,
    pub description: Option<String>,
    pub event_type: Option<String>,
    pub location: Option<String>,
    pub address: Option<String>,
    pub start_datetime: String,
    pub end_datetime: Option<String>,
    pub capacity: Option<i32>,
    pub price: Option<f64>,
    pub is_members_only: Option<bool>,
    pub chapter_id: Option<String>,
    pub image_url: Option<String>,
    pub tags: Option<String>,
}
