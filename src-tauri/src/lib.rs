use tauri_plugin_sql::{Migration, MigrationKind};
use tauri_plugin_sql::Builder as SqlBuilder;
use tauri_plugin_opener;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // Define database migrations
    let migrations = vec![
        Migration {
            version: 1,
            description: "Create settings table",
            sql: "CREATE TABLE IF NOT EXISTS settings (token TEXT NOT NULL);",
            kind: MigrationKind::Up,
        },
    ];

    // Initialize and configure Tauri
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init()) // Register file opener plugin
        .plugin(
            SqlBuilder::default()
                .add_migrations("sqlite:timer.db", migrations) // Add migrations
                .build(),
        )
        .invoke_handler(tauri::generate_handler![]) // Register Rust commands
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}

