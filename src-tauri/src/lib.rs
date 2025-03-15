use tauri_plugin_opener;
use tauri_plugin_sql::Builder as SqlBuilder;
use tauri_plugin_sql::{Migration, MigrationKind};

use tauri::{
    menu::{Menu, MenuItem},
    tray::TrayIconBuilder,
};

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
        Migration {
            version: 2,
            description: "Create daily table",
            sql: r#"
            CREATE TABLE IF NOT EXISTS daily (
                numero INTEGER PRIMARY KEY AUTOINCREMENT,
                fecha DATE NOT NULL,
                marca TEXT NOT NULL,
                documento TEXT NOT NULL,
                estado TEXT NOT NULL,
                estnue TEXT NOT NULL,
                horini TEXT NOT NULL,
                horfin TEXT,
                nota TEXT NOT NULL,
                tiempo TEXT,
                cerrar TEXT NOT NULL
            );
        "#,
            kind: MigrationKind::Up,
        },
    ];

    // Initialize and configure Tauri
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_opener::init()) // Register file opener plugin
        .plugin(
            SqlBuilder::default()
                .add_migrations("sqlite:timer.db", migrations) // Add migrations
                .build(),
        )
        .setup(|app| {
            let quit_i = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let menu = Menu::with_items(app, &[&quit_i])?;
            let _tray = TrayIconBuilder::new()
                .icon(app.default_window_icon().unwrap().clone())
                .menu(&menu)
                .show_menu_on_left_click(true)
                .build(app)?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![]) // Register Rust commands
        .run(tauri::generate_context!())
        .expect("Error while running Tauri application");
}
