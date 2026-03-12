use std::sync::Mutex;
use rusqlite::Connection;
use serde_json::{json, Value};
use uuid::Uuid;

use crate::models::*;

/// Application state holding the database connection behind a Mutex.
pub struct DbState {
    pub db: Mutex<Connection>,
}

// Helper to generate a UUID v7 string.
fn new_id() -> String {
    Uuid::now_v7().to_string()
}

fn now_utc() -> String {
    chrono::Utc::now().format("%Y-%m-%dT%H:%M:%S%.3fZ").to_string()
}

// ============================================================
// PEOPLE COMMANDS
// ============================================================

#[tauri::command]
pub fn list_people(
    state: tauri::State<'_, DbState>,
    search: Option<String>,
    status: Option<String>,
    limit: Option<i64>,
    offset: Option<i64>,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(100);
    let offset = offset.unwrap_or(0);
    let status = status.unwrap_or_else(|| "active".to_string());

    let mut stmt = if let Some(ref q) = search {
        let pattern = format!("%{}%", q);
        let mut s = db
            .prepare(
                "SELECT id, first_name, last_name, email, phone, mobile,
                        address_line1, address_line2, city, county, postcode, country,
                        date_of_birth, gender, avatar_url, notes, status,
                        organisation_id, job_title, department, source, tags, custom_fields,
                        created_at, updated_at
                 FROM people
                 WHERE status = ?1
                   AND (first_name LIKE ?2 OR last_name LIKE ?2 OR email LIKE ?2)
                 ORDER BY last_name, first_name
                 LIMIT ?3 OFFSET ?4",
            )
            .map_err(|e| e.to_string())?;
        let rows = s
            .query_map(
                rusqlite::params![status, pattern, limit, offset],
                row_to_person,
            )
            .map_err(|e| e.to_string())?;
        let people: Vec<Value> = rows.filter_map(|r| r.ok()).collect();
        return Ok(json!({ "data": people, "total": people.len() }));
    } else {
        db.prepare(
            "SELECT id, first_name, last_name, email, phone, mobile,
                    address_line1, address_line2, city, county, postcode, country,
                    date_of_birth, gender, avatar_url, notes, status,
                    organisation_id, job_title, department, source, tags, custom_fields,
                    created_at, updated_at
             FROM people
             WHERE status = ?1
             ORDER BY last_name, first_name
             LIMIT ?2 OFFSET ?3",
        )
        .map_err(|e| e.to_string())?
    };

    let rows = stmt
        .query_map(rusqlite::params![status, limit, offset], row_to_person)
        .map_err(|e| e.to_string())?;
    let people: Vec<Value> = rows.filter_map(|r| r.ok()).collect();
    Ok(json!({ "data": people, "total": people.len() }))
}

fn row_to_person(row: &rusqlite::Row) -> rusqlite::Result<Value> {
    Ok(json!({
        "id": row.get::<_, String>(0)?,
        "first_name": row.get::<_, String>(1)?,
        "last_name": row.get::<_, String>(2)?,
        "email": row.get::<_, Option<String>>(3)?,
        "phone": row.get::<_, Option<String>>(4)?,
        "mobile": row.get::<_, Option<String>>(5)?,
        "address_line1": row.get::<_, Option<String>>(6)?,
        "address_line2": row.get::<_, Option<String>>(7)?,
        "city": row.get::<_, Option<String>>(8)?,
        "county": row.get::<_, Option<String>>(9)?,
        "postcode": row.get::<_, Option<String>>(10)?,
        "country": row.get::<_, Option<String>>(11)?,
        "date_of_birth": row.get::<_, Option<String>>(12)?,
        "gender": row.get::<_, Option<String>>(13)?,
        "avatar_url": row.get::<_, Option<String>>(14)?,
        "notes": row.get::<_, Option<String>>(15)?,
        "status": row.get::<_, String>(16)?,
        "organisation_id": row.get::<_, Option<String>>(17)?,
        "job_title": row.get::<_, Option<String>>(18)?,
        "department": row.get::<_, Option<String>>(19)?,
        "source": row.get::<_, Option<String>>(20)?,
        "tags": row.get::<_, Option<String>>(21)?,
        "custom_fields": row.get::<_, Option<String>>(22)?,
        "created_at": row.get::<_, String>(23)?,
        "updated_at": row.get::<_, String>(24)?,
    }))
}

#[tauri::command]
pub fn get_person(state: tauri::State<'_, DbState>, id: String) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let mut stmt = db
        .prepare(
            "SELECT id, first_name, last_name, email, phone, mobile,
                    address_line1, address_line2, city, county, postcode, country,
                    date_of_birth, gender, avatar_url, notes, status,
                    organisation_id, job_title, department, source, tags, custom_fields,
                    created_at, updated_at
             FROM people WHERE id = ?1",
        )
        .map_err(|e| e.to_string())?;

    let person = stmt
        .query_row(rusqlite::params![id], row_to_person)
        .map_err(|e| e.to_string())?;

    Ok(person)
}

#[tauri::command]
pub fn create_person(
    state: tauri::State<'_, DbState>,
    data: CreatePerson,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let id = new_id();
    let now = now_utc();

    db.execute(
        "INSERT INTO people (id, first_name, last_name, email, phone, mobile,
                             address_line1, address_line2, city, county, postcode, country,
                             date_of_birth, gender, notes, organisation_id, job_title,
                             department, source, tags, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16, ?17, ?18, ?19, ?20, ?21, ?22)",
        rusqlite::params![
            id, data.first_name, data.last_name, data.email, data.phone, data.mobile,
            data.address_line1, data.address_line2, data.city, data.county, data.postcode,
            data.country, data.date_of_birth, data.gender, data.notes,
            data.organisation_id, data.job_title, data.department, data.source, data.tags,
            now, now,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "id": id, "created_at": now }))
}

#[tauri::command]
pub fn update_person(
    state: tauri::State<'_, DbState>,
    id: String,
    data: UpdatePerson,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let now = now_utc();

    // Build dynamic update
    let mut sets: Vec<String> = Vec::new();
    let mut params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    let mut idx = 1;

    macro_rules! maybe_set {
        ($field:ident, $col:expr) => {
            if let Some(ref val) = data.$field {
                sets.push(format!("{} = ?{}", $col, idx));
                params.push(Box::new(val.clone()));
                idx += 1;
            }
        };
    }

    maybe_set!(first_name, "first_name");
    maybe_set!(last_name, "last_name");
    maybe_set!(email, "email");
    maybe_set!(phone, "phone");
    maybe_set!(mobile, "mobile");
    maybe_set!(address_line1, "address_line1");
    maybe_set!(address_line2, "address_line2");
    maybe_set!(city, "city");
    maybe_set!(county, "county");
    maybe_set!(postcode, "postcode");
    maybe_set!(country, "country");
    maybe_set!(date_of_birth, "date_of_birth");
    maybe_set!(gender, "gender");
    maybe_set!(notes, "notes");
    maybe_set!(status, "status");
    maybe_set!(organisation_id, "organisation_id");
    maybe_set!(job_title, "job_title");
    maybe_set!(department, "department");
    maybe_set!(source, "source");
    maybe_set!(tags, "tags");

    if sets.is_empty() {
        return Ok(json!({ "id": id, "updated": false }));
    }

    sets.push(format!("updated_at = ?{}", idx));
    params.push(Box::new(now.clone()));
    idx += 1;

    let sql = format!(
        "UPDATE people SET {} WHERE id = ?{}",
        sets.join(", "),
        idx
    );
    params.push(Box::new(id.clone()));

    let param_refs: Vec<&dyn rusqlite::types::ToSql> = params.iter().map(|p| p.as_ref()).collect();
    db.execute(&sql, param_refs.as_slice())
        .map_err(|e| e.to_string())?;

    Ok(json!({ "id": id, "updated_at": now }))
}

#[tauri::command]
pub fn delete_person(state: tauri::State<'_, DbState>, id: String) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let now = now_utc();

    // Soft delete
    db.execute(
        "UPDATE people SET status = 'deleted', updated_at = ?1 WHERE id = ?2",
        rusqlite::params![now, id],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "id": id, "deleted": true }))
}

#[tauri::command]
pub fn search_people(
    state: tauri::State<'_, DbState>,
    query: String,
    limit: Option<i64>,
) -> Result<Value, String> {
    list_people(state, Some(query), None, limit, None)
}

// ============================================================
// CONSUL — Projects
// ============================================================

#[tauri::command]
pub fn list_projects(
    state: tauri::State<'_, DbState>,
    status: Option<String>,
    limit: Option<i64>,
    offset: Option<i64>,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let status = status.unwrap_or_else(|| "active".to_string());
    let limit = limit.unwrap_or(100);
    let offset = offset.unwrap_or(0);

    let mut stmt = db
        .prepare(
            "SELECT id, name, description, status, budget, currency, hourly_rate,
                    start_date, end_date, deadline, person_id, organisation_id,
                    owner_id, contract_id, colour, tags, created_at, updated_at
             FROM consul_projects
             WHERE status = ?1
             ORDER BY created_at DESC
             LIMIT ?2 OFFSET ?3",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map(rusqlite::params![status, limit, offset], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "name": row.get::<_, String>(1)?,
                "description": row.get::<_, Option<String>>(2)?,
                "status": row.get::<_, String>(3)?,
                "budget": row.get::<_, Option<f64>>(4)?,
                "currency": row.get::<_, String>(5)?,
                "hourly_rate": row.get::<_, Option<f64>>(6)?,
                "start_date": row.get::<_, Option<String>>(7)?,
                "end_date": row.get::<_, Option<String>>(8)?,
                "deadline": row.get::<_, Option<String>>(9)?,
                "person_id": row.get::<_, Option<String>>(10)?,
                "organisation_id": row.get::<_, Option<String>>(11)?,
                "owner_id": row.get::<_, Option<String>>(12)?,
                "contract_id": row.get::<_, Option<String>>(13)?,
                "colour": row.get::<_, Option<String>>(14)?,
                "tags": row.get::<_, Option<String>>(15)?,
                "created_at": row.get::<_, String>(16)?,
                "updated_at": row.get::<_, String>(17)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let projects: Vec<Value> = rows.filter_map(|r| r.ok()).collect();
    Ok(json!({ "data": projects, "total": projects.len() }))
}

#[tauri::command]
pub fn create_project(
    state: tauri::State<'_, DbState>,
    data: CreateProject,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let id = new_id();
    let now = now_utc();
    let currency = data.currency.unwrap_or_else(|| "GBP".to_string());

    db.execute(
        "INSERT INTO consul_projects (id, name, description, budget, currency, hourly_rate,
                                      start_date, end_date, deadline, person_id, organisation_id,
                                      owner_id, colour, tags, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)",
        rusqlite::params![
            id, data.name, data.description, data.budget, currency, data.hourly_rate,
            data.start_date, data.end_date, data.deadline, data.person_id,
            data.organisation_id, data.owner_id, data.colour, data.tags, now, now,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "id": id, "created_at": now }))
}

// ============================================================
// CONSUL — Invoices
// ============================================================

#[tauri::command]
pub fn list_invoices(
    state: tauri::State<'_, DbState>,
    status: Option<String>,
    limit: Option<i64>,
    offset: Option<i64>,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(100);
    let offset = offset.unwrap_or(0);

    let (sql, params): (String, Vec<Box<dyn rusqlite::types::ToSql>>) = if let Some(ref s) = status
    {
        (
            "SELECT id, invoice_number, status, subtotal, tax_rate, tax_amount, total,
                    currency, issue_date, due_date, paid_date, notes, payment_terms,
                    person_id, organisation_id, project_id, contract_id, created_at, updated_at
             FROM consul_invoices
             WHERE status = ?1
             ORDER BY issue_date DESC
             LIMIT ?2 OFFSET ?3"
                .to_string(),
            vec![
                Box::new(s.clone()),
                Box::new(limit),
                Box::new(offset),
            ],
        )
    } else {
        (
            "SELECT id, invoice_number, status, subtotal, tax_rate, tax_amount, total,
                    currency, issue_date, due_date, paid_date, notes, payment_terms,
                    person_id, organisation_id, project_id, contract_id, created_at, updated_at
             FROM consul_invoices
             ORDER BY issue_date DESC
             LIMIT ?1 OFFSET ?2"
                .to_string(),
            vec![Box::new(limit), Box::new(offset)],
        )
    };

    let param_refs: Vec<&dyn rusqlite::types::ToSql> = params.iter().map(|p| p.as_ref()).collect();
    let mut stmt = db.prepare(&sql).map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map(param_refs.as_slice(), |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "invoice_number": row.get::<_, String>(1)?,
                "status": row.get::<_, String>(2)?,
                "subtotal": row.get::<_, f64>(3)?,
                "tax_rate": row.get::<_, f64>(4)?,
                "tax_amount": row.get::<_, f64>(5)?,
                "total": row.get::<_, f64>(6)?,
                "currency": row.get::<_, String>(7)?,
                "issue_date": row.get::<_, String>(8)?,
                "due_date": row.get::<_, String>(9)?,
                "paid_date": row.get::<_, Option<String>>(10)?,
                "notes": row.get::<_, Option<String>>(11)?,
                "payment_terms": row.get::<_, Option<String>>(12)?,
                "person_id": row.get::<_, Option<String>>(13)?,
                "organisation_id": row.get::<_, Option<String>>(14)?,
                "project_id": row.get::<_, Option<String>>(15)?,
                "contract_id": row.get::<_, Option<String>>(16)?,
                "created_at": row.get::<_, String>(17)?,
                "updated_at": row.get::<_, String>(18)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let invoices: Vec<Value> = rows.filter_map(|r| r.ok()).collect();
    Ok(json!({ "data": invoices, "total": invoices.len() }))
}

#[tauri::command]
pub fn create_invoice(
    state: tauri::State<'_, DbState>,
    data: CreateInvoice,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let id = new_id();
    let now = now_utc();
    let tax_rate = data.tax_rate.unwrap_or(20.0);
    let tax_amount = data.subtotal * (tax_rate / 100.0);
    let total = data.subtotal + tax_amount;

    db.execute(
        "INSERT INTO consul_invoices (id, invoice_number, subtotal, tax_rate, tax_amount, total,
                                      issue_date, due_date, notes, payment_terms,
                                      person_id, organisation_id, project_id,
                                      created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)",
        rusqlite::params![
            id, data.invoice_number, data.subtotal, tax_rate, tax_amount, total,
            data.issue_date, data.due_date, data.notes, data.payment_terms,
            data.person_id, data.organisation_id, data.project_id, now, now,
        ],
    )
    .map_err(|e| e.to_string())?;

    // Insert line items if provided
    if let Some(items) = data.items {
        for (i, item) in items.iter().enumerate() {
            let item_id = new_id();
            let item_tax = item.tax_rate.unwrap_or(tax_rate);
            let amount = item.quantity * item.unit_price;
            db.execute(
                "INSERT INTO consul_invoice_items (id, invoice_id, description, quantity,
                                                   unit_price, amount, tax_rate, sort_order, created_at)
                 VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
                rusqlite::params![
                    item_id, id, item.description, item.quantity,
                    item.unit_price, amount, item_tax, i as i32, now,
                ],
            )
            .map_err(|e| e.to_string())?;
        }
    }

    Ok(json!({ "id": id, "invoice_number": data.invoice_number, "total": total, "created_at": now }))
}

// ============================================================
// CONSUL — Pipeline
// ============================================================

#[tauri::command]
pub fn list_pipeline_entries(
    state: tauri::State<'_, DbState>,
    stage_id: Option<String>,
    limit: Option<i64>,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(200);

    let (sql, params): (String, Vec<Box<dyn rusqlite::types::ToSql>>) = if let Some(ref sid) =
        stage_id
    {
        (
            "SELECT e.id, e.title, e.description, e.value, e.currency, e.probability,
                    e.stage_id, e.person_id, e.organisation_id, e.owner_id,
                    e.expected_close, e.source, e.tags, e.custom_fields,
                    e.lost_reason, e.won_at, e.lost_at, e.created_at, e.updated_at,
                    s.name as stage_name
             FROM consul_pipeline_entries e
             JOIN consul_pipeline_stages s ON s.id = e.stage_id
             WHERE e.stage_id = ?1
             ORDER BY e.created_at DESC
             LIMIT ?2"
                .to_string(),
            vec![Box::new(sid.clone()), Box::new(limit)],
        )
    } else {
        (
            "SELECT e.id, e.title, e.description, e.value, e.currency, e.probability,
                    e.stage_id, e.person_id, e.organisation_id, e.owner_id,
                    e.expected_close, e.source, e.tags, e.custom_fields,
                    e.lost_reason, e.won_at, e.lost_at, e.created_at, e.updated_at,
                    s.name as stage_name
             FROM consul_pipeline_entries e
             JOIN consul_pipeline_stages s ON s.id = e.stage_id
             ORDER BY s.position, e.created_at DESC
             LIMIT ?1"
                .to_string(),
            vec![Box::new(limit)],
        )
    };

    let param_refs: Vec<&dyn rusqlite::types::ToSql> = params.iter().map(|p| p.as_ref()).collect();
    let mut stmt = db.prepare(&sql).map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map(param_refs.as_slice(), |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "description": row.get::<_, Option<String>>(2)?,
                "value": row.get::<_, f64>(3)?,
                "currency": row.get::<_, String>(4)?,
                "probability": row.get::<_, i32>(5)?,
                "stage_id": row.get::<_, String>(6)?,
                "person_id": row.get::<_, Option<String>>(7)?,
                "organisation_id": row.get::<_, Option<String>>(8)?,
                "owner_id": row.get::<_, Option<String>>(9)?,
                "expected_close": row.get::<_, Option<String>>(10)?,
                "source": row.get::<_, Option<String>>(11)?,
                "tags": row.get::<_, Option<String>>(12)?,
                "custom_fields": row.get::<_, Option<String>>(13)?,
                "lost_reason": row.get::<_, Option<String>>(14)?,
                "won_at": row.get::<_, Option<String>>(15)?,
                "lost_at": row.get::<_, Option<String>>(16)?,
                "created_at": row.get::<_, String>(17)?,
                "updated_at": row.get::<_, String>(18)?,
                "stage_name": row.get::<_, String>(19)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let entries: Vec<Value> = rows.filter_map(|r| r.ok()).collect();
    Ok(json!({ "data": entries, "total": entries.len() }))
}

#[tauri::command]
pub fn create_pipeline_entry(
    state: tauri::State<'_, DbState>,
    data: CreatePipelineEntry,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let id = new_id();
    let now = now_utc();
    let value = data.value.unwrap_or(0.0);
    let currency = data.currency.unwrap_or_else(|| "GBP".to_string());
    let probability = data.probability.unwrap_or(50);

    db.execute(
        "INSERT INTO consul_pipeline_entries (id, title, description, value, currency, probability,
                                              stage_id, person_id, organisation_id, owner_id,
                                              expected_close, source, tags, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15)",
        rusqlite::params![
            id, data.title, data.description, value, currency, probability,
            data.stage_id, data.person_id, data.organisation_id, data.owner_id,
            data.expected_close, data.source, data.tags, now, now,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "id": id, "created_at": now }))
}

#[tauri::command]
pub fn move_pipeline_entry(
    state: tauri::State<'_, DbState>,
    id: String,
    stage_id: String,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let now = now_utc();

    // Check if the target stage is terminal (won/lost)
    let is_terminal: bool = db
        .query_row(
            "SELECT is_terminal FROM consul_pipeline_stages WHERE id = ?1",
            rusqlite::params![stage_id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    if is_terminal {
        let stage_name: String = db
            .query_row(
                "SELECT name FROM consul_pipeline_stages WHERE id = ?1",
                rusqlite::params![stage_id],
                |row| row.get(0),
            )
            .map_err(|e| e.to_string())?;

        let ts_field = if stage_name.to_lowercase().contains("won") {
            "won_at"
        } else {
            "lost_at"
        };

        db.execute(
            &format!(
                "UPDATE consul_pipeline_entries SET stage_id = ?1, {} = ?2, updated_at = ?3 WHERE id = ?4",
                ts_field
            ),
            rusqlite::params![stage_id, now, now, id],
        )
        .map_err(|e| e.to_string())?;
    } else {
        db.execute(
            "UPDATE consul_pipeline_entries SET stage_id = ?1, updated_at = ?2 WHERE id = ?3",
            rusqlite::params![stage_id, now, id],
        )
        .map_err(|e| e.to_string())?;
    }

    Ok(json!({ "id": id, "stage_id": stage_id, "updated_at": now }))
}

// ============================================================
// CONSUL — Time Entries
// ============================================================

#[tauri::command]
pub fn list_time_entries(
    state: tauri::State<'_, DbState>,
    project_id: Option<String>,
    user_id: Option<String>,
    date_from: Option<String>,
    date_to: Option<String>,
    limit: Option<i64>,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(200);

    let mut conditions: Vec<String> = vec!["1=1".to_string()];
    let mut params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    let mut idx = 1;

    if let Some(ref pid) = project_id {
        conditions.push(format!("project_id = ?{}", idx));
        params.push(Box::new(pid.clone()));
        idx += 1;
    }
    if let Some(ref uid) = user_id {
        conditions.push(format!("user_id = ?{}", idx));
        params.push(Box::new(uid.clone()));
        idx += 1;
    }
    if let Some(ref df) = date_from {
        conditions.push(format!("date >= ?{}", idx));
        params.push(Box::new(df.clone()));
        idx += 1;
    }
    if let Some(ref dt) = date_to {
        conditions.push(format!("date <= ?{}", idx));
        params.push(Box::new(dt.clone()));
        idx += 1;
    }

    let sql = format!(
        "SELECT id, description, duration_mins, billable, hourly_rate, date,
                start_time, end_time, project_id, task_id, user_id, person_id,
                invoice_id, created_at, updated_at
         FROM consul_time_entries
         WHERE {}
         ORDER BY date DESC, created_at DESC
         LIMIT ?{}",
        conditions.join(" AND "),
        idx
    );
    params.push(Box::new(limit));

    let param_refs: Vec<&dyn rusqlite::types::ToSql> = params.iter().map(|p| p.as_ref()).collect();
    let mut stmt = db.prepare(&sql).map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map(param_refs.as_slice(), |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "description": row.get::<_, Option<String>>(1)?,
                "duration_mins": row.get::<_, i32>(2)?,
                "billable": row.get::<_, bool>(3)?,
                "hourly_rate": row.get::<_, Option<f64>>(4)?,
                "date": row.get::<_, String>(5)?,
                "start_time": row.get::<_, Option<String>>(6)?,
                "end_time": row.get::<_, Option<String>>(7)?,
                "project_id": row.get::<_, Option<String>>(8)?,
                "task_id": row.get::<_, Option<String>>(9)?,
                "user_id": row.get::<_, Option<String>>(10)?,
                "person_id": row.get::<_, Option<String>>(11)?,
                "invoice_id": row.get::<_, Option<String>>(12)?,
                "created_at": row.get::<_, String>(13)?,
                "updated_at": row.get::<_, String>(14)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let entries: Vec<Value> = rows.filter_map(|r| r.ok()).collect();
    Ok(json!({ "data": entries, "total": entries.len() }))
}

#[tauri::command]
pub fn create_time_entry(
    state: tauri::State<'_, DbState>,
    data: CreateTimeEntry,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let id = new_id();
    let now = now_utc();
    let billable = data.billable.unwrap_or(true);

    db.execute(
        "INSERT INTO consul_time_entries (id, description, duration_mins, billable, hourly_rate,
                                          date, start_time, end_time, project_id, task_id,
                                          user_id, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
        rusqlite::params![
            id, data.description, data.duration_mins, billable, data.hourly_rate,
            data.date, data.start_time, data.end_time, data.project_id, data.task_id,
            data.user_id, now, now,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "id": id, "created_at": now }))
}

#[tauri::command]
pub fn get_dashboard_stats(state: tauri::State<'_, DbState>) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let total_people: i64 = db
        .query_row(
            "SELECT COUNT(*) FROM people WHERE status = 'active'",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let total_projects: i64 = db
        .query_row(
            "SELECT COUNT(*) FROM consul_projects WHERE status = 'active'",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let pipeline_value: f64 = db
        .query_row(
            "SELECT COALESCE(SUM(value), 0.0) FROM consul_pipeline_entries
             WHERE won_at IS NULL AND lost_at IS NULL",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0.0);

    let outstanding_invoices: f64 = db
        .query_row(
            "SELECT COALESCE(SUM(total), 0.0) FROM consul_invoices
             WHERE status IN ('sent', 'overdue')",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0.0);

    let overdue_invoices: i64 = db
        .query_row(
            "SELECT COUNT(*) FROM consul_invoices
             WHERE status = 'sent' AND due_date < date('now')",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let hours_this_month: f64 = db
        .query_row(
            "SELECT COALESCE(SUM(duration_mins), 0) / 60.0 FROM consul_time_entries
             WHERE date >= strftime('%Y-%m-01', 'now')",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0.0);

    let revenue_this_month: f64 = db
        .query_row(
            "SELECT COALESCE(SUM(total), 0.0) FROM consul_invoices
             WHERE status = 'paid' AND paid_date >= strftime('%Y-%m-01', 'now')",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0.0);

    Ok(json!({
        "total_people": total_people,
        "total_projects": total_projects,
        "pipeline_value": pipeline_value,
        "outstanding_invoices": outstanding_invoices,
        "overdue_invoices": overdue_invoices,
        "hours_this_month": hours_this_month,
        "revenue_this_month": revenue_this_month,
    }))
}

// ============================================================
// LODGE — Memberships
// ============================================================

#[tauri::command]
pub fn list_memberships(
    state: tauri::State<'_, DbState>,
    status: Option<String>,
    membership_type_id: Option<String>,
    limit: Option<i64>,
    offset: Option<i64>,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(100);
    let offset = offset.unwrap_or(0);

    let mut conditions: Vec<String> = vec!["1=1".to_string()];
    let mut params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    let mut idx = 1;

    if let Some(ref s) = status {
        conditions.push(format!("m.status = ?{}", idx));
        params.push(Box::new(s.clone()));
        idx += 1;
    }
    if let Some(ref tid) = membership_type_id {
        conditions.push(format!("m.membership_type_id = ?{}", idx));
        params.push(Box::new(tid.clone()));
        idx += 1;
    }

    let sql = format!(
        "SELECT m.id, m.membership_number, m.person_id, m.membership_type_id, m.status,
                m.start_date, m.end_date, m.renewal_date, m.auto_renew, m.payment_method,
                m.notes, m.chapter_id, m.joined_at, m.cancelled_at, m.created_at, m.updated_at,
                p.first_name, p.last_name, p.email,
                mt.name as type_name
         FROM lodge_memberships m
         JOIN people p ON p.id = m.person_id
         JOIN lodge_membership_types mt ON mt.id = m.membership_type_id
         WHERE {}
         ORDER BY m.created_at DESC
         LIMIT ?{} OFFSET ?{}",
        conditions.join(" AND "),
        idx,
        idx + 1
    );
    params.push(Box::new(limit));
    params.push(Box::new(offset));

    let param_refs: Vec<&dyn rusqlite::types::ToSql> = params.iter().map(|p| p.as_ref()).collect();
    let mut stmt = db.prepare(&sql).map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map(param_refs.as_slice(), |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "membership_number": row.get::<_, String>(1)?,
                "person_id": row.get::<_, String>(2)?,
                "membership_type_id": row.get::<_, String>(3)?,
                "status": row.get::<_, String>(4)?,
                "start_date": row.get::<_, String>(5)?,
                "end_date": row.get::<_, Option<String>>(6)?,
                "renewal_date": row.get::<_, Option<String>>(7)?,
                "auto_renew": row.get::<_, bool>(8)?,
                "payment_method": row.get::<_, Option<String>>(9)?,
                "notes": row.get::<_, Option<String>>(10)?,
                "chapter_id": row.get::<_, Option<String>>(11)?,
                "joined_at": row.get::<_, String>(12)?,
                "cancelled_at": row.get::<_, Option<String>>(13)?,
                "created_at": row.get::<_, String>(14)?,
                "updated_at": row.get::<_, String>(15)?,
                "person_first_name": row.get::<_, String>(16)?,
                "person_last_name": row.get::<_, String>(17)?,
                "person_email": row.get::<_, Option<String>>(18)?,
                "type_name": row.get::<_, String>(19)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let memberships: Vec<Value> = rows.filter_map(|r| r.ok()).collect();
    Ok(json!({ "data": memberships, "total": memberships.len() }))
}

#[tauri::command]
pub fn create_membership(
    state: tauri::State<'_, DbState>,
    data: CreateMembership,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let id = new_id();
    let now = now_utc();
    let auto_renew = data.auto_renew.unwrap_or(false);

    // Generate membership number: LDG-YYYYMMDD-XXXX
    let date_part = chrono::Utc::now().format("%Y%m%d").to_string();
    let count: i64 = db
        .query_row(
            "SELECT COUNT(*) FROM lodge_memberships",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);
    let membership_number = format!("LDG-{}-{:04}", date_part, count + 1);

    db.execute(
        "INSERT INTO lodge_memberships (id, membership_number, person_id, membership_type_id,
                                        start_date, end_date, auto_renew, payment_method,
                                        chapter_id, notes, joined_at, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
        rusqlite::params![
            id, membership_number, data.person_id, data.membership_type_id,
            data.start_date, data.end_date, auto_renew, data.payment_method,
            data.chapter_id, data.notes, now, now, now,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "id": id, "membership_number": membership_number, "created_at": now }))
}

#[tauri::command]
pub fn list_membership_types(state: tauri::State<'_, DbState>) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let mut stmt = db
        .prepare(
            "SELECT id, name, description, price, currency, duration_months,
                    benefits, max_members, is_active, colour, sort_order,
                    created_at, updated_at
             FROM lodge_membership_types
             WHERE is_active = 1
             ORDER BY sort_order, name",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "name": row.get::<_, String>(1)?,
                "description": row.get::<_, Option<String>>(2)?,
                "price": row.get::<_, f64>(3)?,
                "currency": row.get::<_, String>(4)?,
                "duration_months": row.get::<_, i32>(5)?,
                "benefits": row.get::<_, Option<String>>(6)?,
                "max_members": row.get::<_, Option<i32>>(7)?,
                "is_active": row.get::<_, bool>(8)?,
                "colour": row.get::<_, Option<String>>(9)?,
                "sort_order": row.get::<_, i32>(10)?,
                "created_at": row.get::<_, String>(11)?,
                "updated_at": row.get::<_, String>(12)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let types: Vec<Value> = rows.filter_map(|r| r.ok()).collect();
    Ok(json!({ "data": types }))
}

// ============================================================
// LODGE — Events
// ============================================================

#[tauri::command]
pub fn list_events(
    state: tauri::State<'_, DbState>,
    status: Option<String>,
    limit: Option<i64>,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(50);

    let (sql, params): (String, Vec<Box<dyn rusqlite::types::ToSql>>) = if let Some(ref s) = status
    {
        (
            "SELECT id, title, description, event_type, location, address,
                    start_datetime, end_datetime, capacity, price, currency,
                    is_members_only, status, organiser_id, chapter_id, image_url, tags,
                    created_at, updated_at
             FROM lodge_events
             WHERE status = ?1
             ORDER BY start_datetime
             LIMIT ?2"
                .to_string(),
            vec![Box::new(s.clone()), Box::new(limit)],
        )
    } else {
        (
            "SELECT id, title, description, event_type, location, address,
                    start_datetime, end_datetime, capacity, price, currency,
                    is_members_only, status, organiser_id, chapter_id, image_url, tags,
                    created_at, updated_at
             FROM lodge_events
             ORDER BY start_datetime
             LIMIT ?1"
                .to_string(),
            vec![Box::new(limit)],
        )
    };

    let param_refs: Vec<&dyn rusqlite::types::ToSql> = params.iter().map(|p| p.as_ref()).collect();
    let mut stmt = db.prepare(&sql).map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map(param_refs.as_slice(), |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "description": row.get::<_, Option<String>>(2)?,
                "event_type": row.get::<_, String>(3)?,
                "location": row.get::<_, Option<String>>(4)?,
                "address": row.get::<_, Option<String>>(5)?,
                "start_datetime": row.get::<_, String>(6)?,
                "end_datetime": row.get::<_, Option<String>>(7)?,
                "capacity": row.get::<_, Option<i32>>(8)?,
                "price": row.get::<_, f64>(9)?,
                "currency": row.get::<_, String>(10)?,
                "is_members_only": row.get::<_, bool>(11)?,
                "status": row.get::<_, String>(12)?,
                "organiser_id": row.get::<_, Option<String>>(13)?,
                "chapter_id": row.get::<_, Option<String>>(14)?,
                "image_url": row.get::<_, Option<String>>(15)?,
                "tags": row.get::<_, Option<String>>(16)?,
                "created_at": row.get::<_, String>(17)?,
                "updated_at": row.get::<_, String>(18)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let events: Vec<Value> = rows.filter_map(|r| r.ok()).collect();
    Ok(json!({ "data": events, "total": events.len() }))
}

#[tauri::command]
pub fn create_event(
    state: tauri::State<'_, DbState>,
    data: CreateEvent,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let id = new_id();
    let now = now_utc();
    let event_type = data.event_type.unwrap_or_else(|| "general".to_string());
    let price = data.price.unwrap_or(0.0);
    let is_members_only = data.is_members_only.unwrap_or(false);

    db.execute(
        "INSERT INTO lodge_events (id, title, description, event_type, location, address,
                                   start_datetime, end_datetime, capacity, price,
                                   is_members_only, chapter_id, image_url, tags,
                                   created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14, ?15, ?16)",
        rusqlite::params![
            id, data.title, data.description, event_type, data.location, data.address,
            data.start_datetime, data.end_datetime, data.capacity, price,
            is_members_only, data.chapter_id, data.image_url, data.tags, now, now,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "id": id, "created_at": now }))
}

#[tauri::command]
pub fn check_in_member(
    state: tauri::State<'_, DbState>,
    event_id: String,
    person_id: String,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let now = now_utc();

    // Find the registration
    let reg_id: Result<String, _> = db.query_row(
        "SELECT id FROM lodge_event_registrations WHERE event_id = ?1 AND person_id = ?2",
        rusqlite::params![event_id, person_id],
        |row| row.get(0),
    );

    match reg_id {
        Ok(rid) => {
            db.execute(
                "UPDATE lodge_event_registrations SET checked_in_at = ?1, status = 'checked_in' WHERE id = ?2",
                rusqlite::params![now, rid],
            )
            .map_err(|e| e.to_string())?;
            Ok(json!({ "registration_id": rid, "checked_in_at": now }))
        }
        Err(_) => {
            // Auto-register and check in
            let rid = new_id();
            db.execute(
                "INSERT INTO lodge_event_registrations (id, event_id, person_id, status, checked_in_at, created_at)
                 VALUES (?1, ?2, ?3, 'checked_in', ?4, ?5)",
                rusqlite::params![rid, event_id, person_id, now, now],
            )
            .map_err(|e| e.to_string())?;
            Ok(json!({ "registration_id": rid, "checked_in_at": now, "auto_registered": true }))
        }
    }
}

// ============================================================
// HEARTH — Loyalty
// ============================================================

#[tauri::command]
pub fn get_loyalty_account(
    state: tauri::State<'_, DbState>,
    person_id: String,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let result = db.query_row(
        "SELECT id, person_id, account_number, points_balance, lifetime_points,
                tier, status, last_activity, created_at, updated_at
         FROM hearth_loyalty_accounts
         WHERE person_id = ?1 AND status = 'active'",
        rusqlite::params![person_id],
        |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "person_id": row.get::<_, String>(1)?,
                "account_number": row.get::<_, String>(2)?,
                "points_balance": row.get::<_, i32>(3)?,
                "lifetime_points": row.get::<_, i32>(4)?,
                "tier": row.get::<_, String>(5)?,
                "status": row.get::<_, String>(6)?,
                "last_activity": row.get::<_, Option<String>>(7)?,
                "created_at": row.get::<_, String>(8)?,
                "updated_at": row.get::<_, String>(9)?,
            }))
        },
    );

    match result {
        Ok(account) => Ok(account),
        Err(rusqlite::Error::QueryReturnedNoRows) => {
            // Create a new loyalty account for this person
            let id = new_id();
            let now = now_utc();
            let count: i64 = db
                .query_row(
                    "SELECT COUNT(*) FROM hearth_loyalty_accounts",
                    [],
                    |row| row.get(0),
                )
                .unwrap_or(0);
            let account_number = format!("HTH-{:08}", count + 1);

            db.execute(
                "INSERT INTO hearth_loyalty_accounts (id, person_id, account_number, created_at, updated_at)
                 VALUES (?1, ?2, ?3, ?4, ?5)",
                rusqlite::params![id, person_id, account_number, now, now],
            )
            .map_err(|e| e.to_string())?;

            Ok(json!({
                "id": id,
                "person_id": person_id,
                "account_number": account_number,
                "points_balance": 0,
                "lifetime_points": 0,
                "tier": "bronze",
                "status": "active",
                "last_activity": null,
                "created_at": now,
                "updated_at": now,
            }))
        }
        Err(e) => Err(e.to_string()),
    }
}

#[tauri::command]
pub fn add_loyalty_points(
    state: tauri::State<'_, DbState>,
    account_id: String,
    points: i32,
    description: Option<String>,
    merchant_id: Option<String>,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let now = now_utc();
    let tx_id = new_id();

    // Get current balance
    let current_balance: i32 = db
        .query_row(
            "SELECT points_balance FROM hearth_loyalty_accounts WHERE id = ?1",
            rusqlite::params![account_id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    let new_balance = current_balance + points;

    // Update account
    db.execute(
        "UPDATE hearth_loyalty_accounts
         SET points_balance = ?1, lifetime_points = lifetime_points + ?2,
             last_activity = ?3, updated_at = ?3
         WHERE id = ?4",
        rusqlite::params![new_balance, points, now, account_id],
    )
    .map_err(|e| e.to_string())?;

    // Determine tier based on lifetime points
    let lifetime: i32 = db
        .query_row(
            "SELECT lifetime_points FROM hearth_loyalty_accounts WHERE id = ?1",
            rusqlite::params![account_id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    let tier = match lifetime {
        0..=999 => "bronze",
        1000..=4999 => "silver",
        5000..=19999 => "gold",
        _ => "platinum",
    };

    db.execute(
        "UPDATE hearth_loyalty_accounts SET tier = ?1 WHERE id = ?2",
        rusqlite::params![tier, account_id],
    )
    .map_err(|e| e.to_string())?;

    // Record transaction
    db.execute(
        "INSERT INTO hearth_loyalty_transactions (id, account_id, transaction_type, points,
                                                   balance_after, description, merchant_id, created_at)
         VALUES (?1, ?2, 'earn', ?3, ?4, ?5, ?6, ?7)",
        rusqlite::params![tx_id, account_id, points, new_balance, description, merchant_id, now],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({
        "transaction_id": tx_id,
        "points_added": points,
        "new_balance": new_balance,
        "tier": tier,
    }))
}

#[tauri::command]
pub fn redeem_points(
    state: tauri::State<'_, DbState>,
    account_id: String,
    points: i32,
    description: Option<String>,
    merchant_id: Option<String>,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let now = now_utc();

    let current_balance: i32 = db
        .query_row(
            "SELECT points_balance FROM hearth_loyalty_accounts WHERE id = ?1",
            rusqlite::params![account_id],
            |row| row.get(0),
        )
        .map_err(|e| e.to_string())?;

    if points > current_balance {
        return Err("Insufficient points balance".to_string());
    }

    let new_balance = current_balance - points;
    let tx_id = new_id();

    db.execute(
        "UPDATE hearth_loyalty_accounts SET points_balance = ?1, last_activity = ?2, updated_at = ?2 WHERE id = ?3",
        rusqlite::params![new_balance, now, account_id],
    )
    .map_err(|e| e.to_string())?;

    db.execute(
        "INSERT INTO hearth_loyalty_transactions (id, account_id, transaction_type, points,
                                                   balance_after, description, merchant_id, created_at)
         VALUES (?1, ?2, 'redeem', ?3, ?4, ?5, ?6, ?7)",
        rusqlite::params![tx_id, account_id, -points, new_balance, description, merchant_id, now],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({
        "transaction_id": tx_id,
        "points_redeemed": points,
        "new_balance": new_balance,
    }))
}

#[tauri::command]
pub fn list_merchants(
    state: tauri::State<'_, DbState>,
    active_only: Option<bool>,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let active_only = active_only.unwrap_or(true);

    let sql = if active_only {
        "SELECT id, name, description, category, contact_email, contact_phone,
                address, city, postcode, country, website, logo_url,
                commission_rate, is_active, organisation_id, created_at, updated_at
         FROM hearth_merchants WHERE is_active = 1 ORDER BY name"
    } else {
        "SELECT id, name, description, category, contact_email, contact_phone,
                address, city, postcode, country, website, logo_url,
                commission_rate, is_active, organisation_id, created_at, updated_at
         FROM hearth_merchants ORDER BY name"
    };

    let mut stmt = db.prepare(sql).map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map([], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "name": row.get::<_, String>(1)?,
                "description": row.get::<_, Option<String>>(2)?,
                "category": row.get::<_, Option<String>>(3)?,
                "contact_email": row.get::<_, Option<String>>(4)?,
                "contact_phone": row.get::<_, Option<String>>(5)?,
                "address": row.get::<_, Option<String>>(6)?,
                "city": row.get::<_, Option<String>>(7)?,
                "postcode": row.get::<_, Option<String>>(8)?,
                "country": row.get::<_, Option<String>>(9)?,
                "website": row.get::<_, Option<String>>(10)?,
                "logo_url": row.get::<_, Option<String>>(11)?,
                "commission_rate": row.get::<_, f64>(12)?,
                "is_active": row.get::<_, bool>(13)?,
                "organisation_id": row.get::<_, Option<String>>(14)?,
                "created_at": row.get::<_, String>(15)?,
                "updated_at": row.get::<_, String>(16)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let merchants: Vec<Value> = rows.filter_map(|r| r.ok()).collect();
    Ok(json!({ "data": merchants }))
}

#[tauri::command]
pub fn get_merchant_analytics(
    state: tauri::State<'_, DbState>,
    merchant_id: String,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    let total_transactions: i64 = db
        .query_row(
            "SELECT COUNT(*) FROM hearth_loyalty_transactions WHERE merchant_id = ?1",
            rusqlite::params![merchant_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let total_points_issued: i64 = db
        .query_row(
            "SELECT COALESCE(SUM(points), 0) FROM hearth_loyalty_transactions
             WHERE merchant_id = ?1 AND transaction_type = 'earn'",
            rusqlite::params![merchant_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let total_points_redeemed: i64 = db
        .query_row(
            "SELECT COALESCE(SUM(ABS(points)), 0) FROM hearth_loyalty_transactions
             WHERE merchant_id = ?1 AND transaction_type = 'redeem'",
            rusqlite::params![merchant_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let unique_customers: i64 = db
        .query_row(
            "SELECT COUNT(DISTINCT account_id) FROM hearth_loyalty_transactions
             WHERE merchant_id = ?1",
            rusqlite::params![merchant_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let active_campaigns: i64 = db
        .query_row(
            "SELECT COUNT(*) FROM hearth_campaigns
             WHERE merchant_id = ?1 AND status = 'active'",
            rusqlite::params![merchant_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    Ok(json!({
        "merchant_id": merchant_id,
        "total_transactions": total_transactions,
        "total_points_issued": total_points_issued,
        "total_points_redeemed": total_points_redeemed,
        "unique_customers": unique_customers,
        "active_campaigns": active_campaigns,
    }))
}

// ============================================================
// COMMAND — Dashboard & Operations
// ============================================================

#[tauri::command]
pub fn get_command_dashboard(state: tauri::State<'_, DbState>) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;

    // Aggregate stats across all modules
    let total_people: i64 = db
        .query_row("SELECT COUNT(*) FROM people WHERE status = 'active'", [], |row| row.get(0))
        .unwrap_or(0);

    let total_organisations: i64 = db
        .query_row("SELECT COUNT(*) FROM organisations WHERE status = 'active'", [], |row| row.get(0))
        .unwrap_or(0);

    let active_projects: i64 = db
        .query_row("SELECT COUNT(*) FROM consul_projects WHERE status = 'active'", [], |row| row.get(0))
        .unwrap_or(0);

    let pipeline_value: f64 = db
        .query_row(
            "SELECT COALESCE(SUM(value * probability / 100.0), 0.0) FROM consul_pipeline_entries
             WHERE won_at IS NULL AND lost_at IS NULL",
            [], |row| row.get(0),
        )
        .unwrap_or(0.0);

    let active_memberships: i64 = db
        .query_row("SELECT COUNT(*) FROM lodge_memberships WHERE status = 'active'", [], |row| row.get(0))
        .unwrap_or(0);

    let upcoming_events: i64 = db
        .query_row(
            "SELECT COUNT(*) FROM lodge_events
             WHERE start_datetime > datetime('now') AND status = 'scheduled'",
            [], |row| row.get(0),
        )
        .unwrap_or(0);

    let total_loyalty_points: i64 = db
        .query_row(
            "SELECT COALESCE(SUM(points_balance), 0) FROM hearth_loyalty_accounts WHERE status = 'active'",
            [], |row| row.get(0),
        )
        .unwrap_or(0);

    let active_merchants: i64 = db
        .query_row("SELECT COUNT(*) FROM hearth_merchants WHERE is_active = 1", [], |row| row.get(0))
        .unwrap_or(0);

    let unread_notifications: i64 = db
        .query_row("SELECT COUNT(*) FROM notifications WHERE is_read = 0", [], |row| row.get(0))
        .unwrap_or(0);

    // Recent activity (last 5 audit entries)
    let mut stmt = db
        .prepare(
            "SELECT id, action, entity_type, entity_id, created_at
             FROM audit_log ORDER BY created_at DESC LIMIT 5",
        )
        .map_err(|e| e.to_string())?;

    let recent: Vec<Value> = stmt
        .query_map([], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "action": row.get::<_, String>(1)?,
                "entity_type": row.get::<_, String>(2)?,
                "entity_id": row.get::<_, String>(3)?,
                "created_at": row.get::<_, String>(4)?,
            }))
        })
        .map_err(|e| e.to_string())?
        .filter_map(|r| r.ok())
        .collect();

    Ok(json!({
        "people": total_people,
        "organisations": total_organisations,
        "consul": {
            "active_projects": active_projects,
            "weighted_pipeline_value": pipeline_value,
        },
        "lodge": {
            "active_memberships": active_memberships,
            "upcoming_events": upcoming_events,
        },
        "hearth": {
            "total_loyalty_points_in_circulation": total_loyalty_points,
            "active_merchants": active_merchants,
        },
        "unread_notifications": unread_notifications,
        "recent_activity": recent,
    }))
}

#[tauri::command]
pub fn global_search(
    state: tauri::State<'_, DbState>,
    query: String,
    limit: Option<i64>,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(20);
    let pattern = format!("%{}%", query);
    let mut results: Vec<Value> = Vec::new();

    // Search people
    {
        let mut stmt = db
            .prepare(
                "SELECT id, first_name || ' ' || last_name as name, email, 'person' as entity_type
                 FROM people
                 WHERE status != 'deleted'
                   AND (first_name LIKE ?1 OR last_name LIKE ?1 OR email LIKE ?1)
                 LIMIT ?2",
            )
            .map_err(|e| e.to_string())?;

        let rows = stmt
            .query_map(rusqlite::params![pattern, limit], |row| {
                Ok(json!({
                    "id": row.get::<_, String>(0)?,
                    "name": row.get::<_, String>(1)?,
                    "detail": row.get::<_, Option<String>>(2)?,
                    "entity_type": row.get::<_, String>(3)?,
                }))
            })
            .map_err(|e| e.to_string())?;

        results.extend(rows.filter_map(|r| r.ok()));
    }

    // Search organisations
    {
        let mut stmt = db
            .prepare(
                "SELECT id, name, email, 'organisation' as entity_type
                 FROM organisations
                 WHERE status != 'deleted' AND (name LIKE ?1 OR email LIKE ?1)
                 LIMIT ?2",
            )
            .map_err(|e| e.to_string())?;

        let rows = stmt
            .query_map(rusqlite::params![pattern, limit], |row| {
                Ok(json!({
                    "id": row.get::<_, String>(0)?,
                    "name": row.get::<_, String>(1)?,
                    "detail": row.get::<_, Option<String>>(2)?,
                    "entity_type": row.get::<_, String>(3)?,
                }))
            })
            .map_err(|e| e.to_string())?;

        results.extend(rows.filter_map(|r| r.ok()));
    }

    // Search projects
    {
        let mut stmt = db
            .prepare(
                "SELECT id, name, description, 'project' as entity_type
                 FROM consul_projects
                 WHERE name LIKE ?1 OR description LIKE ?1
                 LIMIT ?2",
            )
            .map_err(|e| e.to_string())?;

        let rows = stmt
            .query_map(rusqlite::params![pattern, limit], |row| {
                Ok(json!({
                    "id": row.get::<_, String>(0)?,
                    "name": row.get::<_, String>(1)?,
                    "detail": row.get::<_, Option<String>>(2)?,
                    "entity_type": row.get::<_, String>(3)?,
                }))
            })
            .map_err(|e| e.to_string())?;

        results.extend(rows.filter_map(|r| r.ok()));
    }

    // Search pipeline entries
    {
        let mut stmt = db
            .prepare(
                "SELECT id, title, description, 'pipeline_entry' as entity_type
                 FROM consul_pipeline_entries
                 WHERE title LIKE ?1 OR description LIKE ?1
                 LIMIT ?2",
            )
            .map_err(|e| e.to_string())?;

        let rows = stmt
            .query_map(rusqlite::params![pattern, limit], |row| {
                Ok(json!({
                    "id": row.get::<_, String>(0)?,
                    "name": row.get::<_, String>(1)?,
                    "detail": row.get::<_, Option<String>>(2)?,
                    "entity_type": row.get::<_, String>(3)?,
                }))
            })
            .map_err(|e| e.to_string())?;

        results.extend(rows.filter_map(|r| r.ok()));
    }

    // Search events
    {
        let mut stmt = db
            .prepare(
                "SELECT id, title, location, 'event' as entity_type
                 FROM lodge_events
                 WHERE title LIKE ?1 OR description LIKE ?1
                 LIMIT ?2",
            )
            .map_err(|e| e.to_string())?;

        let rows = stmt
            .query_map(rusqlite::params![pattern, limit], |row| {
                Ok(json!({
                    "id": row.get::<_, String>(0)?,
                    "name": row.get::<_, String>(1)?,
                    "detail": row.get::<_, Option<String>>(2)?,
                    "entity_type": row.get::<_, String>(3)?,
                }))
            })
            .map_err(|e| e.to_string())?;

        results.extend(rows.filter_map(|r| r.ok()));
    }

    Ok(json!({ "results": results, "total": results.len() }))
}

#[tauri::command]
pub fn list_notifications(
    state: tauri::State<'_, DbState>,
    unread_only: Option<bool>,
    limit: Option<i64>,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(50);
    let unread_only = unread_only.unwrap_or(false);

    let sql = if unread_only {
        "SELECT id, user_id, title, body, notification_type, entity_type, entity_id,
                is_read, read_at, created_at
         FROM notifications
         WHERE is_read = 0
         ORDER BY created_at DESC
         LIMIT ?1"
    } else {
        "SELECT id, user_id, title, body, notification_type, entity_type, entity_id,
                is_read, read_at, created_at
         FROM notifications
         ORDER BY created_at DESC
         LIMIT ?1"
    };

    let mut stmt = db.prepare(sql).map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map(rusqlite::params![limit], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "user_id": row.get::<_, String>(1)?,
                "title": row.get::<_, String>(2)?,
                "body": row.get::<_, Option<String>>(3)?,
                "notification_type": row.get::<_, String>(4)?,
                "entity_type": row.get::<_, Option<String>>(5)?,
                "entity_id": row.get::<_, Option<String>>(6)?,
                "is_read": row.get::<_, bool>(7)?,
                "read_at": row.get::<_, Option<String>>(8)?,
                "created_at": row.get::<_, String>(9)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let notifications: Vec<Value> = rows.filter_map(|r| r.ok()).collect();
    Ok(json!({ "data": notifications, "total": notifications.len() }))
}

#[tauri::command]
pub fn get_calendar_events(
    state: tauri::State<'_, DbState>,
    user_id: Option<String>,
    date_from: Option<String>,
    date_to: Option<String>,
    limit: Option<i64>,
) -> Result<Value, String> {
    let db = state.db.lock().map_err(|e| e.to_string())?;
    let limit = limit.unwrap_or(100);

    let mut conditions: Vec<String> = vec!["1=1".to_string()];
    let mut params: Vec<Box<dyn rusqlite::types::ToSql>> = Vec::new();
    let mut idx = 1;

    if let Some(ref uid) = user_id {
        conditions.push(format!("user_id = ?{}", idx));
        params.push(Box::new(uid.clone()));
        idx += 1;
    }
    if let Some(ref df) = date_from {
        conditions.push(format!("start_datetime >= ?{}", idx));
        params.push(Box::new(df.clone()));
        idx += 1;
    }
    if let Some(ref dt) = date_to {
        conditions.push(format!("start_datetime <= ?{}", idx));
        params.push(Box::new(dt.clone()));
        idx += 1;
    }

    let sql = format!(
        "SELECT id, title, description, event_type, start_datetime, end_datetime,
                all_day, location, attendees, recurrence, reminder_mins, colour,
                user_id, entity_type, entity_id, created_at, updated_at
         FROM command_calendar_events
         WHERE {}
         ORDER BY start_datetime
         LIMIT ?{}",
        conditions.join(" AND "),
        idx
    );
    params.push(Box::new(limit));

    let param_refs: Vec<&dyn rusqlite::types::ToSql> = params.iter().map(|p| p.as_ref()).collect();
    let mut stmt = db.prepare(&sql).map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map(param_refs.as_slice(), |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "description": row.get::<_, Option<String>>(2)?,
                "event_type": row.get::<_, String>(3)?,
                "start_datetime": row.get::<_, String>(4)?,
                "end_datetime": row.get::<_, Option<String>>(5)?,
                "all_day": row.get::<_, bool>(6)?,
                "location": row.get::<_, Option<String>>(7)?,
                "attendees": row.get::<_, Option<String>>(8)?,
                "recurrence": row.get::<_, Option<String>>(9)?,
                "reminder_mins": row.get::<_, Option<i32>>(10)?,
                "colour": row.get::<_, Option<String>>(11)?,
                "user_id": row.get::<_, String>(12)?,
                "entity_type": row.get::<_, Option<String>>(13)?,
                "entity_id": row.get::<_, Option<String>>(14)?,
                "created_at": row.get::<_, String>(15)?,
                "updated_at": row.get::<_, String>(16)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let events: Vec<Value> = rows.filter_map(|r| r.ok()).collect();
    Ok(json!({ "data": events, "total": events.len() }))
}
