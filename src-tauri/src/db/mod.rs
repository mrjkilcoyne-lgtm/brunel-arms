use rusqlite::{Connection, Result as SqliteResult};
use std::path::PathBuf;
use tauri::AppHandle;
use tauri::Manager;

/// Resolves the path to the SQLite database file within the app data directory.
fn db_path(app_handle: &AppHandle) -> PathBuf {
    let app_dir = app_handle
        .path()
        .app_data_dir()
        .expect("Failed to resolve app data directory");
    std::fs::create_dir_all(&app_dir).expect("Failed to create app data directory");
    app_dir.join("forge.db")
}

/// Initialises the SQLite database, creating all tables if they do not exist.
/// Returns an open `Connection` ready for use.
pub fn init_db(app_handle: &AppHandle) -> SqliteResult<Connection> {
    let path = db_path(app_handle);
    let conn = Connection::open(path)?;

    // Enable WAL mode for better concurrent read performance
    conn.execute_batch("PRAGMA journal_mode=WAL;")?;
    conn.execute_batch("PRAGMA foreign_keys=ON;")?;

    create_schema(&conn)?;

    Ok(conn)
}

fn create_schema(conn: &Connection) -> SqliteResult<()> {
    conn.execute_batch(SCHEMA_SQL)?;
    Ok(())
}

const SCHEMA_SQL: &str = r#"
-- ============================================================
-- CORE TABLES
-- ============================================================

CREATE TABLE IF NOT EXISTS people (
    id              TEXT PRIMARY KEY NOT NULL,
    first_name      TEXT NOT NULL,
    last_name       TEXT NOT NULL,
    email           TEXT,
    phone           TEXT,
    mobile          TEXT,
    address_line1   TEXT,
    address_line2   TEXT,
    city            TEXT,
    county          TEXT,
    postcode        TEXT,
    country         TEXT DEFAULT 'GB',
    date_of_birth   TEXT,
    gender          TEXT,
    avatar_url      TEXT,
    notes           TEXT,
    status          TEXT NOT NULL DEFAULT 'active',
    organisation_id TEXT REFERENCES organisations(id),
    job_title       TEXT,
    department      TEXT,
    source          TEXT,
    tags            TEXT,
    custom_fields   TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_people_email ON people(email);
CREATE INDEX IF NOT EXISTS idx_people_status ON people(status);
CREATE INDEX IF NOT EXISTS idx_people_organisation ON people(organisation_id);
CREATE INDEX IF NOT EXISTS idx_people_name ON people(last_name, first_name);

CREATE TABLE IF NOT EXISTS organisations (
    id              TEXT PRIMARY KEY NOT NULL,
    name            TEXT NOT NULL,
    trading_name    TEXT,
    company_number  TEXT,
    vat_number      TEXT,
    email           TEXT,
    phone           TEXT,
    website         TEXT,
    address_line1   TEXT,
    address_line2   TEXT,
    city            TEXT,
    county          TEXT,
    postcode        TEXT,
    country         TEXT DEFAULT 'GB',
    industry        TEXT,
    size            TEXT,
    notes           TEXT,
    status          TEXT NOT NULL DEFAULT 'active',
    logo_url        TEXT,
    tags            TEXT,
    custom_fields   TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_organisations_name ON organisations(name);
CREATE INDEX IF NOT EXISTS idx_organisations_status ON organisations(status);

CREATE TABLE IF NOT EXISTS documents (
    id              TEXT PRIMARY KEY NOT NULL,
    title           TEXT NOT NULL,
    doc_type        TEXT NOT NULL,
    content         TEXT,
    file_path       TEXT,
    mime_type       TEXT,
    size_bytes      INTEGER,
    version         INTEGER NOT NULL DEFAULT 1,
    status          TEXT NOT NULL DEFAULT 'draft',
    owner_id        TEXT REFERENCES users(id),
    person_id       TEXT REFERENCES people(id),
    organisation_id TEXT REFERENCES organisations(id),
    tags            TEXT,
    metadata        TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(doc_type);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_owner ON documents(owner_id);

CREATE TABLE IF NOT EXISTS payments (
    id              TEXT PRIMARY KEY NOT NULL,
    amount          REAL NOT NULL,
    currency        TEXT NOT NULL DEFAULT 'GBP',
    payment_method  TEXT,
    status          TEXT NOT NULL DEFAULT 'pending',
    direction       TEXT NOT NULL DEFAULT 'inbound',
    reference       TEXT,
    description     TEXT,
    person_id       TEXT REFERENCES people(id),
    organisation_id TEXT REFERENCES organisations(id),
    invoice_id      TEXT,
    stripe_id       TEXT,
    gocardless_id   TEXT,
    metadata        TEXT,
    paid_at         TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_payments_person ON payments(person_id);
CREATE INDEX IF NOT EXISTS idx_payments_direction ON payments(direction);
CREATE INDEX IF NOT EXISTS idx_payments_paid_at ON payments(paid_at);

CREATE TABLE IF NOT EXISTS audit_log (
    id              TEXT PRIMARY KEY NOT NULL,
    user_id         TEXT REFERENCES users(id),
    action          TEXT NOT NULL,
    entity_type     TEXT NOT NULL,
    entity_id       TEXT NOT NULL,
    old_value       TEXT,
    new_value       TEXT,
    ip_address      TEXT,
    user_agent      TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_audit_entity ON audit_log(entity_type, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_user ON audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_created ON audit_log(created_at);

CREATE TABLE IF NOT EXISTS users (
    id              TEXT PRIMARY KEY NOT NULL,
    username        TEXT NOT NULL UNIQUE,
    email           TEXT NOT NULL UNIQUE,
    password_hash   TEXT NOT NULL,
    display_name    TEXT NOT NULL,
    role            TEXT NOT NULL DEFAULT 'user',
    avatar_url      TEXT,
    person_id       TEXT REFERENCES people(id),
    is_active       INTEGER NOT NULL DEFAULT 1,
    last_login_at   TEXT,
    preferences     TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

CREATE TABLE IF NOT EXISTS settings (
    id              TEXT PRIMARY KEY NOT NULL,
    key             TEXT NOT NULL UNIQUE,
    value           TEXT NOT NULL,
    category        TEXT NOT NULL DEFAULT 'general',
    description     TEXT,
    data_type       TEXT NOT NULL DEFAULT 'string',
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_settings_key ON settings(key);
CREATE INDEX IF NOT EXISTS idx_settings_category ON settings(category);

CREATE TABLE IF NOT EXISTS files (
    id              TEXT PRIMARY KEY NOT NULL,
    filename        TEXT NOT NULL,
    original_name   TEXT NOT NULL,
    mime_type       TEXT NOT NULL,
    size_bytes      INTEGER NOT NULL,
    storage_path    TEXT NOT NULL,
    checksum_sha256 TEXT,
    uploaded_by     TEXT REFERENCES users(id),
    entity_type     TEXT,
    entity_id       TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_files_entity ON files(entity_type, entity_id);

CREATE TABLE IF NOT EXISTS notifications (
    id              TEXT PRIMARY KEY NOT NULL,
    user_id         TEXT NOT NULL REFERENCES users(id),
    title           TEXT NOT NULL,
    body            TEXT,
    notification_type TEXT NOT NULL DEFAULT 'info',
    entity_type     TEXT,
    entity_id       TEXT,
    is_read         INTEGER NOT NULL DEFAULT 0,
    read_at         TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id, is_read);

CREATE TABLE IF NOT EXISTS tags (
    id              TEXT PRIMARY KEY NOT NULL,
    name            TEXT NOT NULL UNIQUE,
    colour          TEXT DEFAULT '#6366f1',
    category        TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);

-- ============================================================
-- CONSUL MODULE — Consulting / CRM
-- ============================================================

CREATE TABLE IF NOT EXISTS consul_pipeline_stages (
    id              TEXT PRIMARY KEY NOT NULL,
    name            TEXT NOT NULL,
    position        INTEGER NOT NULL DEFAULT 0,
    colour          TEXT DEFAULT '#6366f1',
    is_terminal     INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS consul_pipeline_entries (
    id              TEXT PRIMARY KEY NOT NULL,
    title           TEXT NOT NULL,
    description     TEXT,
    value           REAL DEFAULT 0.0,
    currency        TEXT NOT NULL DEFAULT 'GBP',
    probability     INTEGER DEFAULT 50,
    stage_id        TEXT NOT NULL REFERENCES consul_pipeline_stages(id),
    person_id       TEXT REFERENCES people(id),
    organisation_id TEXT REFERENCES organisations(id),
    owner_id        TEXT REFERENCES users(id),
    expected_close  TEXT,
    source          TEXT,
    tags            TEXT,
    custom_fields   TEXT,
    lost_reason     TEXT,
    won_at          TEXT,
    lost_at         TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_consul_pipeline_stage ON consul_pipeline_entries(stage_id);
CREATE INDEX IF NOT EXISTS idx_consul_pipeline_person ON consul_pipeline_entries(person_id);
CREATE INDEX IF NOT EXISTS idx_consul_pipeline_org ON consul_pipeline_entries(organisation_id);

CREATE TABLE IF NOT EXISTS consul_proposals (
    id              TEXT PRIMARY KEY NOT NULL,
    title           TEXT NOT NULL,
    content         TEXT,
    status          TEXT NOT NULL DEFAULT 'draft',
    value           REAL DEFAULT 0.0,
    currency        TEXT NOT NULL DEFAULT 'GBP',
    valid_until     TEXT,
    pipeline_entry_id TEXT REFERENCES consul_pipeline_entries(id),
    person_id       TEXT REFERENCES people(id),
    organisation_id TEXT REFERENCES organisations(id),
    sent_at         TEXT,
    accepted_at     TEXT,
    rejected_at     TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS consul_contracts (
    id              TEXT PRIMARY KEY NOT NULL,
    title           TEXT NOT NULL,
    description     TEXT,
    status          TEXT NOT NULL DEFAULT 'draft',
    value           REAL DEFAULT 0.0,
    currency        TEXT NOT NULL DEFAULT 'GBP',
    start_date      TEXT,
    end_date        TEXT,
    renewal_date    TEXT,
    auto_renew      INTEGER NOT NULL DEFAULT 0,
    person_id       TEXT REFERENCES people(id),
    organisation_id TEXT REFERENCES organisations(id),
    proposal_id     TEXT REFERENCES consul_proposals(id),
    document_id     TEXT REFERENCES documents(id),
    signed_at       TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS consul_invoices (
    id              TEXT PRIMARY KEY NOT NULL,
    invoice_number  TEXT NOT NULL UNIQUE,
    status          TEXT NOT NULL DEFAULT 'draft',
    subtotal        REAL NOT NULL DEFAULT 0.0,
    tax_rate        REAL NOT NULL DEFAULT 20.0,
    tax_amount      REAL NOT NULL DEFAULT 0.0,
    total           REAL NOT NULL DEFAULT 0.0,
    currency        TEXT NOT NULL DEFAULT 'GBP',
    issue_date      TEXT NOT NULL,
    due_date        TEXT NOT NULL,
    paid_date       TEXT,
    notes           TEXT,
    payment_terms   TEXT DEFAULT 'Net 30',
    person_id       TEXT REFERENCES people(id),
    organisation_id TEXT REFERENCES organisations(id),
    project_id      TEXT REFERENCES consul_projects(id),
    contract_id     TEXT REFERENCES consul_contracts(id),
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_consul_invoices_number ON consul_invoices(invoice_number);
CREATE INDEX IF NOT EXISTS idx_consul_invoices_status ON consul_invoices(status);
CREATE INDEX IF NOT EXISTS idx_consul_invoices_due ON consul_invoices(due_date);

CREATE TABLE IF NOT EXISTS consul_invoice_items (
    id              TEXT PRIMARY KEY NOT NULL,
    invoice_id      TEXT NOT NULL REFERENCES consul_invoices(id) ON DELETE CASCADE,
    description     TEXT NOT NULL,
    quantity         REAL NOT NULL DEFAULT 1.0,
    unit_price      REAL NOT NULL DEFAULT 0.0,
    amount          REAL NOT NULL DEFAULT 0.0,
    tax_rate        REAL DEFAULT 20.0,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_consul_invoice_items_invoice ON consul_invoice_items(invoice_id);

CREATE TABLE IF NOT EXISTS consul_expenses (
    id              TEXT PRIMARY KEY NOT NULL,
    description     TEXT NOT NULL,
    amount          REAL NOT NULL,
    currency        TEXT NOT NULL DEFAULT 'GBP',
    category        TEXT,
    receipt_file_id TEXT REFERENCES files(id),
    project_id      TEXT REFERENCES consul_projects(id),
    person_id       TEXT REFERENCES people(id),
    billable        INTEGER NOT NULL DEFAULT 0,
    reimbursed      INTEGER NOT NULL DEFAULT 0,
    expense_date    TEXT NOT NULL,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS consul_time_entries (
    id              TEXT PRIMARY KEY NOT NULL,
    description     TEXT,
    duration_mins   INTEGER NOT NULL,
    billable        INTEGER NOT NULL DEFAULT 1,
    hourly_rate     REAL,
    date            TEXT NOT NULL,
    start_time      TEXT,
    end_time        TEXT,
    project_id      TEXT REFERENCES consul_projects(id),
    task_id         TEXT REFERENCES consul_tasks(id),
    user_id         TEXT REFERENCES users(id),
    person_id       TEXT REFERENCES people(id),
    invoice_id      TEXT REFERENCES consul_invoices(id),
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_consul_time_project ON consul_time_entries(project_id);
CREATE INDEX IF NOT EXISTS idx_consul_time_user ON consul_time_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_consul_time_date ON consul_time_entries(date);

CREATE TABLE IF NOT EXISTS consul_projects (
    id              TEXT PRIMARY KEY NOT NULL,
    name            TEXT NOT NULL,
    description     TEXT,
    status          TEXT NOT NULL DEFAULT 'active',
    budget          REAL,
    currency        TEXT NOT NULL DEFAULT 'GBP',
    hourly_rate     REAL,
    start_date      TEXT,
    end_date        TEXT,
    deadline        TEXT,
    person_id       TEXT REFERENCES people(id),
    organisation_id TEXT REFERENCES organisations(id),
    owner_id        TEXT REFERENCES users(id),
    contract_id     TEXT REFERENCES consul_contracts(id),
    colour          TEXT DEFAULT '#6366f1',
    tags            TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_consul_projects_status ON consul_projects(status);
CREATE INDEX IF NOT EXISTS idx_consul_projects_org ON consul_projects(organisation_id);

CREATE TABLE IF NOT EXISTS consul_tasks (
    id              TEXT PRIMARY KEY NOT NULL,
    title           TEXT NOT NULL,
    description     TEXT,
    status          TEXT NOT NULL DEFAULT 'todo',
    priority        TEXT NOT NULL DEFAULT 'medium',
    due_date        TEXT,
    estimated_mins  INTEGER,
    actual_mins     INTEGER,
    project_id      TEXT NOT NULL REFERENCES consul_projects(id),
    assignee_id     TEXT REFERENCES users(id),
    parent_task_id  TEXT REFERENCES consul_tasks(id),
    sort_order      INTEGER NOT NULL DEFAULT 0,
    completed_at    TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_consul_tasks_project ON consul_tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_consul_tasks_assignee ON consul_tasks(assignee_id);
CREATE INDEX IF NOT EXISTS idx_consul_tasks_status ON consul_tasks(status);

-- ============================================================
-- LODGE MODULE — Membership / Club Management
-- ============================================================

CREATE TABLE IF NOT EXISTS lodge_membership_types (
    id              TEXT PRIMARY KEY NOT NULL,
    name            TEXT NOT NULL,
    description     TEXT,
    price           REAL NOT NULL DEFAULT 0.0,
    currency        TEXT NOT NULL DEFAULT 'GBP',
    duration_months INTEGER NOT NULL DEFAULT 12,
    benefits        TEXT,
    max_members     INTEGER,
    is_active       INTEGER NOT NULL DEFAULT 1,
    colour          TEXT DEFAULT '#10b981',
    sort_order      INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS lodge_memberships (
    id                  TEXT PRIMARY KEY NOT NULL,
    membership_number   TEXT NOT NULL UNIQUE,
    person_id           TEXT NOT NULL REFERENCES people(id),
    membership_type_id  TEXT NOT NULL REFERENCES lodge_membership_types(id),
    status              TEXT NOT NULL DEFAULT 'active',
    start_date          TEXT NOT NULL,
    end_date            TEXT,
    renewal_date        TEXT,
    auto_renew          INTEGER NOT NULL DEFAULT 0,
    payment_method      TEXT,
    stripe_subscription_id TEXT,
    gocardless_mandate_id TEXT,
    notes               TEXT,
    chapter_id          TEXT REFERENCES lodge_chapters(id),
    joined_at           TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    cancelled_at        TEXT,
    created_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at          TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_lodge_memberships_person ON lodge_memberships(person_id);
CREATE INDEX IF NOT EXISTS idx_lodge_memberships_status ON lodge_memberships(status);
CREATE INDEX IF NOT EXISTS idx_lodge_memberships_type ON lodge_memberships(membership_type_id);
CREATE INDEX IF NOT EXISTS idx_lodge_memberships_number ON lodge_memberships(membership_number);

CREATE TABLE IF NOT EXISTS lodge_events (
    id              TEXT PRIMARY KEY NOT NULL,
    title           TEXT NOT NULL,
    description     TEXT,
    event_type      TEXT NOT NULL DEFAULT 'general',
    location        TEXT,
    address         TEXT,
    start_datetime  TEXT NOT NULL,
    end_datetime    TEXT,
    capacity        INTEGER,
    price           REAL DEFAULT 0.0,
    currency        TEXT NOT NULL DEFAULT 'GBP',
    is_members_only INTEGER NOT NULL DEFAULT 0,
    status          TEXT NOT NULL DEFAULT 'scheduled',
    organiser_id    TEXT REFERENCES users(id),
    chapter_id      TEXT REFERENCES lodge_chapters(id),
    image_url       TEXT,
    tags            TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_lodge_events_start ON lodge_events(start_datetime);
CREATE INDEX IF NOT EXISTS idx_lodge_events_status ON lodge_events(status);

CREATE TABLE IF NOT EXISTS lodge_event_registrations (
    id              TEXT PRIMARY KEY NOT NULL,
    event_id        TEXT NOT NULL REFERENCES lodge_events(id),
    person_id       TEXT NOT NULL REFERENCES people(id),
    status          TEXT NOT NULL DEFAULT 'registered',
    ticket_type     TEXT,
    amount_paid     REAL DEFAULT 0.0,
    payment_id      TEXT REFERENCES payments(id),
    checked_in_at   TEXT,
    notes           TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_lodge_registrations_event ON lodge_event_registrations(event_id);
CREATE INDEX IF NOT EXISTS idx_lodge_registrations_person ON lodge_event_registrations(person_id);

CREATE TABLE IF NOT EXISTS lodge_chapters (
    id              TEXT PRIMARY KEY NOT NULL,
    name            TEXT NOT NULL,
    description     TEXT,
    location        TEXT,
    leader_id       TEXT REFERENCES people(id),
    status          TEXT NOT NULL DEFAULT 'active',
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

-- ============================================================
-- HEARTH MODULE — Loyalty / Payments
-- ============================================================

CREATE TABLE IF NOT EXISTS hearth_loyalty_rules (
    id              TEXT PRIMARY KEY NOT NULL,
    name            TEXT NOT NULL,
    description     TEXT,
    points_per_unit REAL NOT NULL DEFAULT 1.0,
    unit_type       TEXT NOT NULL DEFAULT 'currency',
    min_transaction REAL DEFAULT 0.0,
    max_points      INTEGER,
    multiplier      REAL DEFAULT 1.0,
    is_active       INTEGER NOT NULL DEFAULT 1,
    merchant_id     TEXT REFERENCES hearth_merchants(id),
    valid_from      TEXT,
    valid_until     TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS hearth_loyalty_accounts (
    id              TEXT PRIMARY KEY NOT NULL,
    person_id       TEXT NOT NULL REFERENCES people(id),
    account_number  TEXT NOT NULL UNIQUE,
    points_balance  INTEGER NOT NULL DEFAULT 0,
    lifetime_points INTEGER NOT NULL DEFAULT 0,
    tier            TEXT NOT NULL DEFAULT 'bronze',
    status          TEXT NOT NULL DEFAULT 'active',
    last_activity   TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_hearth_accounts_person ON hearth_loyalty_accounts(person_id);
CREATE INDEX IF NOT EXISTS idx_hearth_accounts_number ON hearth_loyalty_accounts(account_number);

CREATE TABLE IF NOT EXISTS hearth_loyalty_transactions (
    id              TEXT PRIMARY KEY NOT NULL,
    account_id      TEXT NOT NULL REFERENCES hearth_loyalty_accounts(id),
    transaction_type TEXT NOT NULL,
    points          INTEGER NOT NULL,
    balance_after   INTEGER NOT NULL,
    description     TEXT,
    reference       TEXT,
    merchant_id     TEXT REFERENCES hearth_merchants(id),
    payment_id      TEXT REFERENCES payments(id),
    rule_id         TEXT REFERENCES hearth_loyalty_rules(id),
    expires_at      TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_hearth_transactions_account ON hearth_loyalty_transactions(account_id);
CREATE INDEX IF NOT EXISTS idx_hearth_transactions_type ON hearth_loyalty_transactions(transaction_type);

CREATE TABLE IF NOT EXISTS hearth_merchants (
    id              TEXT PRIMARY KEY NOT NULL,
    name            TEXT NOT NULL,
    description     TEXT,
    category        TEXT,
    contact_email   TEXT,
    contact_phone   TEXT,
    address         TEXT,
    city            TEXT,
    postcode        TEXT,
    country         TEXT DEFAULT 'GB',
    website         TEXT,
    logo_url        TEXT,
    commission_rate REAL DEFAULT 0.0,
    is_active       INTEGER NOT NULL DEFAULT 1,
    stripe_account_id TEXT,
    organisation_id TEXT REFERENCES organisations(id),
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_hearth_merchants_active ON hearth_merchants(is_active);

CREATE TABLE IF NOT EXISTS hearth_campaigns (
    id              TEXT PRIMARY KEY NOT NULL,
    name            TEXT NOT NULL,
    description     TEXT,
    campaign_type   TEXT NOT NULL DEFAULT 'bonus_points',
    status          TEXT NOT NULL DEFAULT 'draft',
    points_bonus    INTEGER DEFAULT 0,
    multiplier      REAL DEFAULT 1.0,
    min_spend       REAL DEFAULT 0.0,
    budget          REAL,
    spent           REAL DEFAULT 0.0,
    start_date      TEXT,
    end_date        TEXT,
    target_tier     TEXT,
    merchant_id     TEXT REFERENCES hearth_merchants(id),
    terms           TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_hearth_campaigns_status ON hearth_campaigns(status);
CREATE INDEX IF NOT EXISTS idx_hearth_campaigns_dates ON hearth_campaigns(start_date, end_date);

-- ============================================================
-- COMMAND MODULE — Dashboard / Operations
-- ============================================================

CREATE TABLE IF NOT EXISTS command_workflows (
    id              TEXT PRIMARY KEY NOT NULL,
    name            TEXT NOT NULL,
    description     TEXT,
    trigger_type    TEXT NOT NULL DEFAULT 'manual',
    trigger_config  TEXT,
    steps           TEXT NOT NULL,
    is_active       INTEGER NOT NULL DEFAULT 1,
    created_by      TEXT REFERENCES users(id),
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS command_workflow_runs (
    id              TEXT PRIMARY KEY NOT NULL,
    workflow_id     TEXT NOT NULL REFERENCES command_workflows(id),
    status          TEXT NOT NULL DEFAULT 'running',
    started_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    completed_at    TEXT,
    error           TEXT,
    result          TEXT,
    triggered_by    TEXT REFERENCES users(id)
);
CREATE INDEX IF NOT EXISTS idx_command_workflow_runs_workflow ON command_workflow_runs(workflow_id);

CREATE TABLE IF NOT EXISTS command_wiki_pages (
    id              TEXT PRIMARY KEY NOT NULL,
    title           TEXT NOT NULL,
    slug            TEXT NOT NULL UNIQUE,
    content         TEXT,
    parent_id       TEXT REFERENCES command_wiki_pages(id),
    author_id       TEXT REFERENCES users(id),
    is_published    INTEGER NOT NULL DEFAULT 0,
    sort_order      INTEGER NOT NULL DEFAULT 0,
    tags            TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_command_wiki_slug ON command_wiki_pages(slug);

CREATE TABLE IF NOT EXISTS command_reports (
    id              TEXT PRIMARY KEY NOT NULL,
    name            TEXT NOT NULL,
    description     TEXT,
    report_type     TEXT NOT NULL,
    query           TEXT,
    parameters      TEXT,
    schedule        TEXT,
    last_run_at     TEXT,
    created_by      TEXT REFERENCES users(id),
    is_favourite    INTEGER NOT NULL DEFAULT 0,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);

CREATE TABLE IF NOT EXISTS command_calendar_events (
    id              TEXT PRIMARY KEY NOT NULL,
    title           TEXT NOT NULL,
    description     TEXT,
    event_type      TEXT NOT NULL DEFAULT 'meeting',
    start_datetime  TEXT NOT NULL,
    end_datetime    TEXT,
    all_day         INTEGER NOT NULL DEFAULT 0,
    location        TEXT,
    attendees       TEXT,
    recurrence      TEXT,
    reminder_mins   INTEGER DEFAULT 15,
    colour          TEXT DEFAULT '#6366f1',
    user_id         TEXT NOT NULL REFERENCES users(id),
    entity_type     TEXT,
    entity_id       TEXT,
    created_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at      TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
);
CREATE INDEX IF NOT EXISTS idx_command_calendar_user ON command_calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_command_calendar_start ON command_calendar_events(start_datetime);
"#;
