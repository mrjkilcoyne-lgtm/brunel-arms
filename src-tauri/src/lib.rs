pub mod commands;
pub mod db;
pub mod models;
pub mod services;

use commands::DbState;
use std::sync::Mutex;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            let conn = db::init_db(app.handle())
                .expect("Failed to initialise database");

            app.manage(DbState {
                db: Mutex::new(conn),
            });

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            // People
            commands::list_people,
            commands::get_person,
            commands::create_person,
            commands::update_person,
            commands::delete_person,
            commands::search_people,
            // Consul — Projects
            commands::list_projects,
            commands::create_project,
            // Consul — Invoices
            commands::list_invoices,
            commands::create_invoice,
            // Consul — Pipeline
            commands::list_pipeline_entries,
            commands::create_pipeline_entry,
            commands::move_pipeline_entry,
            // Consul — Time Tracking
            commands::list_time_entries,
            commands::create_time_entry,
            commands::get_dashboard_stats,
            // Lodge — Memberships
            commands::list_memberships,
            commands::create_membership,
            commands::list_membership_types,
            // Lodge — Events
            commands::list_events,
            commands::create_event,
            commands::check_in_member,
            // Hearth — Loyalty
            commands::get_loyalty_account,
            commands::add_loyalty_points,
            commands::redeem_points,
            commands::list_merchants,
            commands::get_merchant_analytics,
            // Command — Dashboard & Operations
            commands::get_command_dashboard,
            commands::global_search,
            commands::list_notifications,
            commands::get_calendar_events,
        ])
        .run(tauri::generate_context!())
        .expect("Error running Forge application");
}
