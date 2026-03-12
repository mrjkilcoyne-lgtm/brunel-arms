use rusqlite::params;
use serde_json::{json, Value};
use std::sync::Mutex;
use tauri::State;
use uuid::Uuid;

use crate::models::*;

pub struct DbState(pub Mutex<rusqlite::Connection>);

// ============================================================
// PEOPLE
// ============================================================

#[tauri::command]
pub fn list_people(state: State<DbState>) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, first_name, last_name, email, phone, status, organisation_id, source, tags, created_at, updated_at \
             FROM people WHERE deleted_at IS NULL ORDER BY updated_at DESC LIMIT 200",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "first_name": row.get::<_, String>(1)?,
                "last_name": row.get::<_, String>(2)?,
                "email": row.get::<_, Option<String>>(3)?,
                "phone": row.get::<_, Option<String>>(4)?,
                "status": row.get::<_, String>(5)?,
                "organisation_id": row.get::<_, Option<String>>(6)?,
                "source": row.get::<_, Option<String>>(7)?,
                "tags": row.get::<_, Option<String>>(8)?,
                "created_at": row.get::<_, String>(9)?,
                "updated_at": row.get::<_, String>(10)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let mut people = Vec::new();
    for row in rows {
        people.push(row.map_err(|e| e.to_string())?);
    }
    Ok(json!(people))
}

#[tauri::command]
pub fn get_person(state: State<DbState>, id: String) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let person = conn
        .query_row(
            "SELECT id, first_name, last_name, email, phone, mobile, address_line1, address_line2, \
             city, county, postcode, country, status, organisation_id, job_title, notes, source, tags, \
             custom_fields, created_at, updated_at FROM people WHERE id = ?1 AND deleted_at IS NULL",
            params![id],
            |row| {
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
                    "status": row.get::<_, String>(12)?,
                    "organisation_id": row.get::<_, Option<String>>(13)?,
                    "job_title": row.get::<_, Option<String>>(14)?,
                    "notes": row.get::<_, Option<String>>(15)?,
                    "source": row.get::<_, Option<String>>(16)?,
                    "tags": row.get::<_, Option<String>>(17)?,
                    "custom_fields": row.get::<_, Option<String>>(18)?,
                    "created_at": row.get::<_, String>(19)?,
                    "updated_at": row.get::<_, String>(20)?,
                }))
            },
        )
        .map_err(|e| e.to_string())?;
    Ok(person)
}

#[tauri::command]
pub fn create_person(state: State<DbState>, data: Value) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let id = Uuid::now_v7().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO people (id, first_name, last_name, email, phone, status, source, tags, created_at, updated_at) \
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        params![
            id,
            data["first_name"].as_str().unwrap_or(""),
            data["last_name"].as_str().unwrap_or(""),
            data["email"].as_str(),
            data["phone"].as_str(),
            data["status"].as_str().unwrap_or("active"),
            data["source"].as_str().unwrap_or("manual"),
            data["tags"].as_str(),
            now,
            now,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "id": id }))
}

#[tauri::command]
pub fn update_person(state: State<DbState>, id: String, data: Value) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "UPDATE people SET first_name = COALESCE(?1, first_name), last_name = COALESCE(?2, last_name), \
         email = COALESCE(?3, email), phone = COALESCE(?4, phone), status = COALESCE(?5, status), \
         updated_at = ?6 WHERE id = ?7",
        params![
            data["first_name"].as_str(),
            data["last_name"].as_str(),
            data["email"].as_str(),
            data["phone"].as_str(),
            data["status"].as_str(),
            now,
            id,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "id": id, "updated": true }))
}

#[tauri::command]
pub fn delete_person(state: State<DbState>, id: String) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().to_rfc3339();
    conn.execute("UPDATE people SET deleted_at = ?1 WHERE id = ?2", params![now, id])
        .map_err(|e| e.to_string())?;
    Ok(json!({ "deleted": true }))
}

#[tauri::command]
pub fn search_people(state: State<DbState>, query: String) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let pattern = format!("%{}%", query);
    let mut stmt = conn
        .prepare(
            "SELECT id, first_name, last_name, email, status FROM people \
             WHERE deleted_at IS NULL AND (first_name LIKE ?1 OR last_name LIKE ?1 OR email LIKE ?1) \
             ORDER BY updated_at DESC LIMIT 50",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map(params![pattern], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "first_name": row.get::<_, String>(1)?,
                "last_name": row.get::<_, String>(2)?,
                "email": row.get::<_, Option<String>>(3)?,
                "status": row.get::<_, String>(4)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let mut results = Vec::new();
    for row in rows {
        results.push(row.map_err(|e| e.to_string())?);
    }
    Ok(json!(results))
}

// ============================================================
// CONSUL — Pipeline
// ============================================================

#[tauri::command]
pub fn list_pipeline_entries(state: State<DbState>) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT pe.id, pe.title, pe.value, pe.currency, pe.stage_id, pe.probability, pe.person_id, \
             pe.organisation_id, pe.expected_close_date, pe.notes, pe.created_at, pe.updated_at, \
             ps.name as stage_name \
             FROM consul_pipeline_entries pe \
             LEFT JOIN consul_pipeline_stages ps ON pe.stage_id = ps.id \
             WHERE pe.deleted_at IS NULL ORDER BY pe.updated_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "value": row.get::<_, f64>(2)?,
                "currency": row.get::<_, String>(3)?,
                "stage_id": row.get::<_, String>(4)?,
                "probability": row.get::<_, f64>(5)?,
                "person_id": row.get::<_, Option<String>>(6)?,
                "organisation_id": row.get::<_, Option<String>>(7)?,
                "expected_close_date": row.get::<_, Option<String>>(8)?,
                "notes": row.get::<_, Option<String>>(9)?,
                "created_at": row.get::<_, String>(10)?,
                "updated_at": row.get::<_, String>(11)?,
                "stage_name": row.get::<_, Option<String>>(12)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let mut entries = Vec::new();
    for row in rows {
        entries.push(row.map_err(|e| e.to_string())?);
    }
    Ok(json!(entries))
}

#[tauri::command]
pub fn create_pipeline_entry(state: State<DbState>, data: Value) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let id = Uuid::now_v7().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO consul_pipeline_entries (id, title, value, currency, stage_id, probability, \
         person_id, organisation_id, expected_close_date, notes, created_at, updated_at) \
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)",
        params![
            id,
            data["title"].as_str().unwrap_or(""),
            data["value"].as_f64().unwrap_or(0.0),
            data["currency"].as_str().unwrap_or("GBP"),
            data["stage_id"].as_str().unwrap_or(""),
            data["probability"].as_f64().unwrap_or(0.0),
            data["person_id"].as_str(),
            data["organisation_id"].as_str(),
            data["expected_close_date"].as_str(),
            data["notes"].as_str(),
            now,
            now,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "id": id }))
}

#[tauri::command]
pub fn move_pipeline_entry(state: State<DbState>, id: String, stage_id: String) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().to_rfc3339();
    conn.execute(
        "UPDATE consul_pipeline_entries SET stage_id = ?1, updated_at = ?2 WHERE id = ?3",
        params![stage_id, now, id],
    )
    .map_err(|e| e.to_string())?;
    Ok(json!({ "moved": true }))
}

// ============================================================
// CONSUL — Projects & Invoices
// ============================================================

#[tauri::command]
pub fn list_projects(state: State<DbState>) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, name, client_person_id, client_organisation_id, status, budget_type, \
             budget_amount, currency, start_date, end_date, notes, created_at, updated_at \
             FROM consul_projects WHERE deleted_at IS NULL ORDER BY updated_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "name": row.get::<_, String>(1)?,
                "client_person_id": row.get::<_, Option<String>>(2)?,
                "client_organisation_id": row.get::<_, Option<String>>(3)?,
                "status": row.get::<_, String>(4)?,
                "budget_type": row.get::<_, Option<String>>(5)?,
                "budget_amount": row.get::<_, Option<f64>>(6)?,
                "currency": row.get::<_, String>(7)?,
                "start_date": row.get::<_, Option<String>>(8)?,
                "end_date": row.get::<_, Option<String>>(9)?,
                "notes": row.get::<_, Option<String>>(10)?,
                "created_at": row.get::<_, String>(11)?,
                "updated_at": row.get::<_, String>(12)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let mut projects = Vec::new();
    for row in rows {
        projects.push(row.map_err(|e| e.to_string())?);
    }
    Ok(json!(projects))
}

#[tauri::command]
pub fn create_project(state: State<DbState>, data: Value) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let id = Uuid::now_v7().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO consul_projects (id, name, client_person_id, client_organisation_id, status, \
         budget_type, budget_amount, currency, created_at, updated_at) \
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        params![
            id,
            data["name"].as_str().unwrap_or(""),
            data["client_person_id"].as_str(),
            data["client_organisation_id"].as_str(),
            data["status"].as_str().unwrap_or("active"),
            data["budget_type"].as_str(),
            data["budget_amount"].as_f64(),
            data["currency"].as_str().unwrap_or("GBP"),
            now,
            now,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "id": id }))
}

#[tauri::command]
pub fn list_invoices(state: State<DbState>) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, invoice_number, client_person_id, client_organisation_id, status, \
             subtotal, tax_amount, total, currency, issue_date, due_date, paid_date, notes, \
             created_at, updated_at \
             FROM consul_invoices WHERE deleted_at IS NULL ORDER BY created_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "invoice_number": row.get::<_, String>(1)?,
                "client_person_id": row.get::<_, Option<String>>(2)?,
                "client_organisation_id": row.get::<_, Option<String>>(3)?,
                "status": row.get::<_, String>(4)?,
                "subtotal": row.get::<_, f64>(5)?,
                "tax_amount": row.get::<_, f64>(6)?,
                "total": row.get::<_, f64>(7)?,
                "currency": row.get::<_, String>(8)?,
                "issue_date": row.get::<_, Option<String>>(9)?,
                "due_date": row.get::<_, Option<String>>(10)?,
                "paid_date": row.get::<_, Option<String>>(11)?,
                "notes": row.get::<_, Option<String>>(12)?,
                "created_at": row.get::<_, String>(13)?,
                "updated_at": row.get::<_, String>(14)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let mut invoices = Vec::new();
    for row in rows {
        invoices.push(row.map_err(|e| e.to_string())?);
    }
    Ok(json!(invoices))
}

#[tauri::command]
pub fn create_invoice(state: State<DbState>, data: Value) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let id = Uuid::now_v7().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO consul_invoices (id, invoice_number, client_person_id, client_organisation_id, \
         status, subtotal, tax_amount, total, currency, issue_date, due_date, created_at, updated_at) \
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13)",
        params![
            id,
            data["invoice_number"].as_str().unwrap_or(""),
            data["client_person_id"].as_str(),
            data["client_organisation_id"].as_str(),
            data["status"].as_str().unwrap_or("draft"),
            data["subtotal"].as_f64().unwrap_or(0.0),
            data["tax_amount"].as_f64().unwrap_or(0.0),
            data["total"].as_f64().unwrap_or(0.0),
            data["currency"].as_str().unwrap_or("GBP"),
            data["issue_date"].as_str(),
            data["due_date"].as_str(),
            now,
            now,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "id": id }))
}

// ============================================================
// CONSUL — Time Tracking
// ============================================================

#[tauri::command]
pub fn list_time_entries(state: State<DbState>) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, project_id, user_id, description, duration_minutes, billable, \
             hourly_rate, date, start_time, end_time, created_at \
             FROM consul_time_entries ORDER BY date DESC, created_at DESC LIMIT 200",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "project_id": row.get::<_, Option<String>>(1)?,
                "user_id": row.get::<_, Option<String>>(2)?,
                "description": row.get::<_, Option<String>>(3)?,
                "duration_minutes": row.get::<_, i64>(4)?,
                "billable": row.get::<_, bool>(5)?,
                "hourly_rate": row.get::<_, Option<f64>>(6)?,
                "date": row.get::<_, String>(7)?,
                "start_time": row.get::<_, Option<String>>(8)?,
                "end_time": row.get::<_, Option<String>>(9)?,
                "created_at": row.get::<_, String>(10)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let mut entries = Vec::new();
    for row in rows {
        entries.push(row.map_err(|e| e.to_string())?);
    }
    Ok(json!(entries))
}

#[tauri::command]
pub fn create_time_entry(state: State<DbState>, data: Value) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let id = Uuid::now_v7().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO consul_time_entries (id, project_id, user_id, description, duration_minutes, \
         billable, hourly_rate, date, start_time, end_time, created_at) \
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)",
        params![
            id,
            data["project_id"].as_str(),
            data["user_id"].as_str(),
            data["description"].as_str(),
            data["duration_minutes"].as_i64().unwrap_or(0),
            data["billable"].as_bool().unwrap_or(true),
            data["hourly_rate"].as_f64(),
            data["date"].as_str().unwrap_or(""),
            data["start_time"].as_str(),
            data["end_time"].as_str(),
            now,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "id": id }))
}

// ============================================================
// LODGE — Memberships
// ============================================================

#[tauri::command]
pub fn list_memberships(state: State<DbState>) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT m.id, m.person_id, m.membership_type_id, m.status, m.start_date, m.end_date, \
             m.renewal_date, m.chapter_id, m.created_at, m.updated_at, \
             mt.name as type_name \
             FROM lodge_memberships m \
             LEFT JOIN lodge_membership_types mt ON m.membership_type_id = mt.id \
             WHERE m.deleted_at IS NULL ORDER BY m.updated_at DESC",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "person_id": row.get::<_, String>(1)?,
                "membership_type_id": row.get::<_, String>(2)?,
                "status": row.get::<_, String>(3)?,
                "start_date": row.get::<_, Option<String>>(4)?,
                "end_date": row.get::<_, Option<String>>(5)?,
                "renewal_date": row.get::<_, Option<String>>(6)?,
                "chapter_id": row.get::<_, Option<String>>(7)?,
                "created_at": row.get::<_, String>(8)?,
                "updated_at": row.get::<_, String>(9)?,
                "type_name": row.get::<_, Option<String>>(10)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let mut memberships = Vec::new();
    for row in rows {
        memberships.push(row.map_err(|e| e.to_string())?);
    }
    Ok(json!(memberships))
}

#[tauri::command]
pub fn create_membership(state: State<DbState>, data: Value) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let id = Uuid::now_v7().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO lodge_memberships (id, person_id, membership_type_id, status, start_date, \
         end_date, renewal_date, chapter_id, created_at, updated_at) \
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        params![
            id,
            data["person_id"].as_str().unwrap_or(""),
            data["membership_type_id"].as_str().unwrap_or(""),
            data["status"].as_str().unwrap_or("active"),
            data["start_date"].as_str(),
            data["end_date"].as_str(),
            data["renewal_date"].as_str(),
            data["chapter_id"].as_str(),
            now,
            now,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "id": id }))
}

#[tauri::command]
pub fn list_membership_types(state: State<DbState>) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, name, description, price, currency, billing_period, benefits, \
             is_active, created_at FROM lodge_membership_types ORDER BY sort_order ASC",
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
                "billing_period": row.get::<_, String>(5)?,
                "benefits": row.get::<_, Option<String>>(6)?,
                "is_active": row.get::<_, bool>(7)?,
                "created_at": row.get::<_, String>(8)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let mut types = Vec::new();
    for row in rows {
        types.push(row.map_err(|e| e.to_string())?);
    }
    Ok(json!(types))
}

// ============================================================
// LODGE — Events
// ============================================================

#[tauri::command]
pub fn list_events(state: State<DbState>) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, title, description, location, start_datetime, end_datetime, capacity, \
             ticket_type, ticket_price, currency, status, chapter_id, created_at \
             FROM lodge_events WHERE deleted_at IS NULL ORDER BY start_datetime ASC",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "description": row.get::<_, Option<String>>(2)?,
                "location": row.get::<_, Option<String>>(3)?,
                "start_datetime": row.get::<_, String>(4)?,
                "end_datetime": row.get::<_, Option<String>>(5)?,
                "capacity": row.get::<_, Option<i64>>(6)?,
                "ticket_type": row.get::<_, String>(7)?,
                "ticket_price": row.get::<_, Option<f64>>(8)?,
                "currency": row.get::<_, String>(9)?,
                "status": row.get::<_, String>(10)?,
                "chapter_id": row.get::<_, Option<String>>(11)?,
                "created_at": row.get::<_, String>(12)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let mut events = Vec::new();
    for row in rows {
        events.push(row.map_err(|e| e.to_string())?);
    }
    Ok(json!(events))
}

#[tauri::command]
pub fn create_event(state: State<DbState>, data: Value) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let id = Uuid::now_v7().to_string();
    let now = chrono::Utc::now().to_rfc3339();

    conn.execute(
        "INSERT INTO lodge_events (id, title, description, location, start_datetime, end_datetime, \
         capacity, ticket_type, ticket_price, currency, status, chapter_id, created_at, updated_at) \
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12, ?13, ?14)",
        params![
            id,
            data["title"].as_str().unwrap_or(""),
            data["description"].as_str(),
            data["location"].as_str(),
            data["start_datetime"].as_str().unwrap_or(""),
            data["end_datetime"].as_str(),
            data["capacity"].as_i64(),
            data["ticket_type"].as_str().unwrap_or("free"),
            data["ticket_price"].as_f64(),
            data["currency"].as_str().unwrap_or("GBP"),
            data["status"].as_str().unwrap_or("upcoming"),
            data["chapter_id"].as_str(),
            now,
            now,
        ],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "id": id }))
}

#[tauri::command]
pub fn check_in_member(state: State<DbState>, member_id: String, event_id: String) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().to_rfc3339();
    conn.execute(
        "UPDATE lodge_event_registrations SET checked_in = 1, checked_in_at = ?1 \
         WHERE membership_id = ?2 AND event_id = ?3",
        params![now, member_id, event_id],
    )
    .map_err(|e| e.to_string())?;
    Ok(json!({ "checked_in": true }))
}

// ============================================================
// HEARTH — Loyalty
// ============================================================

#[tauri::command]
pub fn get_loyalty_account(state: State<DbState>, person_id: String) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let account = conn
        .query_row(
            "SELECT id, person_id, points_balance, lifetime_points, tier, merchant_id, created_at \
             FROM hearth_loyalty_accounts WHERE person_id = ?1",
            params![person_id],
            |row| {
                Ok(json!({
                    "id": row.get::<_, String>(0)?,
                    "person_id": row.get::<_, String>(1)?,
                    "points_balance": row.get::<_, i64>(2)?,
                    "lifetime_points": row.get::<_, i64>(3)?,
                    "tier": row.get::<_, String>(4)?,
                    "merchant_id": row.get::<_, Option<String>>(5)?,
                    "created_at": row.get::<_, String>(6)?,
                }))
            },
        )
        .map_err(|e| e.to_string())?;
    Ok(account)
}

#[tauri::command]
pub fn add_loyalty_points(state: State<DbState>, person_id: String, points: i64, reason: String) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().to_rfc3339();
    let txn_id = Uuid::now_v7().to_string();

    conn.execute(
        "UPDATE hearth_loyalty_accounts SET points_balance = points_balance + ?1, \
         lifetime_points = lifetime_points + ?1, updated_at = ?2 WHERE person_id = ?3",
        params![points, now, person_id],
    )
    .map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO hearth_loyalty_transactions (id, account_id, type, points, description, created_at) \
         SELECT ?1, id, 'earn', ?2, ?3, ?4 FROM hearth_loyalty_accounts WHERE person_id = ?5",
        params![txn_id, points, reason, now, person_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "transaction_id": txn_id }))
}

#[tauri::command]
pub fn redeem_points(state: State<DbState>, person_id: String, points: i64, reward_id: String) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let now = chrono::Utc::now().to_rfc3339();
    let txn_id = Uuid::now_v7().to_string();

    conn.execute(
        "UPDATE hearth_loyalty_accounts SET points_balance = points_balance - ?1, updated_at = ?2 \
         WHERE person_id = ?3 AND points_balance >= ?1",
        params![points, now, person_id],
    )
    .map_err(|e| e.to_string())?;

    conn.execute(
        "INSERT INTO hearth_loyalty_transactions (id, account_id, type, points, description, created_at) \
         SELECT ?1, id, 'redeem', ?2, ?3, ?4 FROM hearth_loyalty_accounts WHERE person_id = ?5",
        params![txn_id, -points, reward_id, now, person_id],
    )
    .map_err(|e| e.to_string())?;

    Ok(json!({ "transaction_id": txn_id, "redeemed": true }))
}

#[tauri::command]
pub fn list_merchants(state: State<DbState>) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, name, category, address, contact_email, contact_phone, status, \
             points_earn_rate, points_burn_rate, created_at \
             FROM hearth_merchants WHERE deleted_at IS NULL ORDER BY name ASC",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "name": row.get::<_, String>(1)?,
                "category": row.get::<_, Option<String>>(2)?,
                "address": row.get::<_, Option<String>>(3)?,
                "contact_email": row.get::<_, Option<String>>(4)?,
                "contact_phone": row.get::<_, Option<String>>(5)?,
                "status": row.get::<_, String>(6)?,
                "points_earn_rate": row.get::<_, f64>(7)?,
                "points_burn_rate": row.get::<_, f64>(8)?,
                "created_at": row.get::<_, String>(9)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let mut merchants = Vec::new();
    for row in rows {
        merchants.push(row.map_err(|e| e.to_string())?);
    }
    Ok(json!(merchants))
}

#[tauri::command]
pub fn get_merchant_analytics(state: State<DbState>, merchant_id: String) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;

    let total_customers: i64 = conn
        .query_row(
            "SELECT COUNT(DISTINCT person_id) FROM hearth_loyalty_accounts WHERE merchant_id = ?1",
            params![merchant_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let total_points: i64 = conn
        .query_row(
            "SELECT COALESCE(SUM(ABS(points)), 0) FROM hearth_loyalty_transactions t \
             JOIN hearth_loyalty_accounts a ON t.account_id = a.id WHERE a.merchant_id = ?1",
            params![merchant_id],
            |row| row.get(0),
        )
        .unwrap_or(0);

    Ok(json!({
        "merchant_id": merchant_id,
        "total_customers": total_customers,
        "total_points_activity": total_points,
    }))
}

// ============================================================
// COMMAND — Dashboard & Search
// ============================================================

#[tauri::command]
pub fn get_command_dashboard(state: State<DbState>) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;

    let people_count: i64 = conn
        .query_row("SELECT COUNT(*) FROM people WHERE deleted_at IS NULL", [], |row| row.get(0))
        .unwrap_or(0);

    let invoices_outstanding: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM consul_invoices WHERE status IN ('sent', 'overdue') AND deleted_at IS NULL",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let active_members: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM lodge_memberships WHERE status = 'active' AND deleted_at IS NULL",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);

    let active_projects: i64 = conn
        .query_row(
            "SELECT COUNT(*) FROM consul_projects WHERE status = 'active' AND deleted_at IS NULL",
            [],
            |row| row.get(0),
        )
        .unwrap_or(0);

    Ok(json!({
        "people_count": people_count,
        "invoices_outstanding": invoices_outstanding,
        "active_members": active_members,
        "active_projects": active_projects,
    }))
}

#[tauri::command]
pub fn global_search(state: State<DbState>, query: String) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let pattern = format!("%{}%", query);
    let mut results = Vec::new();

    // Search people
    let mut stmt = conn
        .prepare(
            "SELECT id, first_name || ' ' || last_name, email FROM people \
             WHERE deleted_at IS NULL AND (first_name LIKE ?1 OR last_name LIKE ?1 OR email LIKE ?1) LIMIT 5",
        )
        .map_err(|e| e.to_string())?;
    let people = stmt
        .query_map(params![pattern], |row| {
            Ok(json!({
                "type": "person",
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "subtitle": row.get::<_, Option<String>>(2)?,
            }))
        })
        .map_err(|e| e.to_string())?;
    for p in people {
        results.push(p.map_err(|e| e.to_string())?);
    }

    // Search invoices
    let mut stmt = conn
        .prepare(
            "SELECT id, invoice_number, total || ' ' || currency FROM consul_invoices \
             WHERE deleted_at IS NULL AND invoice_number LIKE ?1 LIMIT 5",
        )
        .map_err(|e| e.to_string())?;
    let invoices = stmt
        .query_map(params![pattern], |row| {
            Ok(json!({
                "type": "invoice",
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "subtitle": row.get::<_, Option<String>>(2)?,
            }))
        })
        .map_err(|e| e.to_string())?;
    for i in invoices {
        results.push(i.map_err(|e| e.to_string())?);
    }

    // Search projects
    let mut stmt = conn
        .prepare(
            "SELECT id, name, status FROM consul_projects \
             WHERE deleted_at IS NULL AND name LIKE ?1 LIMIT 5",
        )
        .map_err(|e| e.to_string())?;
    let projects = stmt
        .query_map(params![pattern], |row| {
            Ok(json!({
                "type": "project",
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "subtitle": row.get::<_, Option<String>>(2)?,
            }))
        })
        .map_err(|e| e.to_string())?;
    for p in projects {
        results.push(p.map_err(|e| e.to_string())?);
    }

    Ok(json!(results))
}

#[tauri::command]
pub fn list_notifications(state: State<DbState>) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut stmt = conn
        .prepare(
            "SELECT id, user_id, type, title, body, link, read, created_at \
             FROM notifications ORDER BY created_at DESC LIMIT 50",
        )
        .map_err(|e| e.to_string())?;

    let rows = stmt
        .query_map([], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "user_id": row.get::<_, String>(1)?,
                "type": row.get::<_, String>(2)?,
                "title": row.get::<_, String>(3)?,
                "body": row.get::<_, Option<String>>(4)?,
                "link": row.get::<_, Option<String>>(5)?,
                "read": row.get::<_, bool>(6)?,
                "created_at": row.get::<_, String>(7)?,
            }))
        })
        .map_err(|e| e.to_string())?;

    let mut notifs = Vec::new();
    for row in rows {
        notifs.push(row.map_err(|e| e.to_string())?);
    }
    Ok(json!(notifs))
}

#[tauri::command]
pub fn get_calendar_events(state: State<DbState>, start: String, end: String) -> Result<Value, String> {
    let conn = state.0.lock().map_err(|e| e.to_string())?;
    let mut events = Vec::new();

    // Lodge events
    let mut stmt = conn
        .prepare(
            "SELECT id, title, start_datetime, end_datetime, location, 'lodge' as module \
             FROM lodge_events WHERE deleted_at IS NULL \
             AND start_datetime >= ?1 AND start_datetime <= ?2 ORDER BY start_datetime",
        )
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map(params![start, end], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "start": row.get::<_, String>(2)?,
                "end": row.get::<_, Option<String>>(3)?,
                "location": row.get::<_, Option<String>>(4)?,
                "module": row.get::<_, String>(5)?,
            }))
        })
        .map_err(|e| e.to_string())?;
    for row in rows {
        events.push(row.map_err(|e| e.to_string())?);
    }

    // Invoice due dates
    let mut stmt = conn
        .prepare(
            "SELECT id, 'Invoice Due: ' || invoice_number, due_date, due_date, '' as location, 'consul' as module \
             FROM consul_invoices WHERE deleted_at IS NULL AND status IN ('sent', 'overdue') \
             AND due_date >= ?1 AND due_date <= ?2",
        )
        .map_err(|e| e.to_string())?;
    let rows = stmt
        .query_map(params![start, end], |row| {
            Ok(json!({
                "id": row.get::<_, String>(0)?,
                "title": row.get::<_, String>(1)?,
                "start": row.get::<_, Option<String>>(2)?,
                "end": row.get::<_, Option<String>>(3)?,
                "location": row.get::<_, Option<String>>(4)?,
                "module": row.get::<_, String>(5)?,
            }))
        })
        .map_err(|e| e.to_string())?;
    for row in rows {
        events.push(row.map_err(|e| e.to_string())?);
    }

    Ok(json!(events))
}
