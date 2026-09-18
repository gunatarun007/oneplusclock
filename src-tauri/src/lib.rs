use serde::{Deserialize, Serialize};
use std::fs;
use std::io::Write;
use std::path::PathBuf;
use tauri::menu::{Menu, MenuItem, PredefinedMenuItem};
use tauri::tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent};
use tauri::{AppHandle, Emitter, Manager, PhysicalPosition, WebviewWindow};

fn log_debug(msg: &str) {
    let now = std::time::SystemTime::now()
        .duration_since(std::time::UNIX_EPOCH)
        .unwrap_or_default()
        .as_secs();
    let line = format!("[{}] {}\n", now, msg);
    let _ = fs::OpenOptions::new()
        .create(true)
        .append(true)
        .open("C:\\Users\\tarun\\Desktop\\Oneplusclock\\app_debug.log")
        .and_then(|mut f| f.write_all(line.as_bytes()));
    if let Ok(app_data) = std::env::var("APPDATA") {
        let dir = std::path::Path::new(&app_data).join("com.oneplus.widget");
        let _ = fs::create_dir_all(&dir);
        let path = dir.join("app_debug.log");
        let _ = fs::OpenOptions::new()
            .create(true)
            .append(true)
            .open(&path)
            .and_then(|mut f| f.write_all(line.as_bytes()));
    }
}

#[derive(Serialize, Deserialize, Default, Clone)]
struct AppConfig {
    x: Option<i32>,
    y: Option<i32>,
    always_on_top: Option<bool>,
    click_through: Option<bool>,
}

fn get_config_path(app: &AppHandle) -> Option<PathBuf> {
    app.path()
        .app_config_dir()
        .ok()
        .map(|dir| dir.join("settings.json"))
}

#[tauri::command]
fn log_frontend(msg: String) {
    log_debug(&format!("[FRONTEND] {}", msg));
}

#[tauri::command]
fn save_position(app: AppHandle, x: i32, y: i32) -> Result<(), String> {
    log_debug(&format!("save_position: x={}, y={}", x, y));
    if let Some(path) = get_config_path(&app) {
        if let Some(parent) = path.parent() {
            let _ = fs::create_dir_all(parent);
        }
        let mut config: AppConfig = fs::read_to_string(&path)
            .ok()
            .and_then(|data| serde_json::from_str(&data).ok())
            .unwrap_or_default();
        config.x = Some(x);
        config.y = Some(y);
        if let Ok(json) = serde_json::to_string_pretty(&config) {
            let _ = fs::write(&path, json);
        }
    }
    Ok(())
}

fn is_position_on_screen(window: &WebviewWindow, x: i32, y: i32) -> bool {
    if let Ok(monitors) = window.available_monitors() {
        if monitors.is_empty() {
            return true;
        }
        let win_size = window.outer_size().unwrap_or(tauri::PhysicalSize::new(650, 400));
        let win_w = win_size.width as i32;
        let win_h = win_size.height as i32;

        for monitor in monitors {
            let mon_pos = monitor.position();
            let mon_size = monitor.size();
            let mon_x = mon_pos.x;
            let mon_y = mon_pos.y;
            let mon_w = mon_size.width as i32;
            let mon_h = mon_size.height as i32;

            let overlap_x = (x < mon_x + mon_w - 50) && (x + win_w > mon_x + 50);
            let overlap_y = (y < mon_y + mon_h - 50) && (y + win_h > mon_y + 50);
            if overlap_x && overlap_y {
                return true;
            }
        }
        false
    } else {
        true
    }
}

fn ensure_window_visible(window: &WebviewWindow) {
    let _ = window.show();
    let _ = window.unminimize();

    if let Ok(pos) = window.outer_position() {
        if !is_position_on_screen(window, pos.x, pos.y) {
            log_debug("Window is off-screen; recentering.");
            let _ = window.center();
        }
    }
    let _ = window.set_focus();
}

#[tauri::command]
fn get_saved_position(app: AppHandle) -> Option<(i32, i32)> {
    let path = get_config_path(&app)?;
    let data = fs::read_to_string(path).ok()?;
    let config: AppConfig = serde_json::from_str(&data).ok()?;
    log_debug(&format!("get_saved_position: x={:?}, y={:?}", config.x, config.y));
    match (config.x, config.y) {
        (Some(x), Some(y)) => {
            if let Some(window) = app.get_webview_window("main") {
                if is_position_on_screen(&window, x, y) {
                    Some((x, y))
                } else {
                    log_debug(&format!(
                        "Saved position ({}, {}) is outside monitor bounds. Will center instead.",
                        x, y
                    ));
                    None
                }
            } else {
                Some((x, y))
            }
        }
        _ => None,
    }
}

#[tauri::command]
fn set_click_through(app: AppHandle, window: WebviewWindow, enabled: bool) -> Result<(), String> {
    log_debug(&format!("set_click_through: enabled={}", enabled));
    if let Some(path) = get_config_path(&app) {
        if let Some(parent) = path.parent() {
            let _ = fs::create_dir_all(parent);
        }
        let mut config: AppConfig = fs::read_to_string(&path)
            .ok()
            .and_then(|data| serde_json::from_str(&data).ok())
            .unwrap_or_default();
        config.click_through = Some(enabled);
        if let Ok(json) = serde_json::to_string_pretty(&config) {
            let _ = fs::write(&path, json);
        }
    }
    window
        .set_ignore_cursor_events(enabled)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn set_always_on_top(app: AppHandle, window: WebviewWindow, enabled: bool) -> Result<(), String> {
    log_debug(&format!("set_always_on_top: enabled={}", enabled));
    if let Some(path) = get_config_path(&app) {
        if let Some(parent) = path.parent() {
            let _ = fs::create_dir_all(parent);
        }
        let mut config: AppConfig = fs::read_to_string(&path)
            .ok()
            .and_then(|data| serde_json::from_str(&data).ok())
            .unwrap_or_default();
        config.always_on_top = Some(enabled);
        if let Ok(json) = serde_json::to_string_pretty(&config) {
            let _ = fs::write(&path, json);
        }
    }
    window
        .set_always_on_top(enabled)
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn set_window_position(window: WebviewWindow, x: i32, y: i32) -> Result<(), String> {
    log_debug(&format!("set_window_position: x={}, y={}", x, y));
    let _ = window.show();
    let _ = window.unminimize();
    window
        .set_position(PhysicalPosition::new(x, y))
        .map_err(|e| e.to_string())
}

#[tauri::command]
fn center_window(window: WebviewWindow) -> Result<(), String> {
    log_debug("center_window called");
    ensure_window_visible(&window);
    window.center().map_err(|e| e.to_string())?;
    if let Ok(pos) = window.outer_position() {
        let _ = save_position(window.app_handle().clone(), pos.x, pos.y);
    }
    Ok(())
}

#[tauri::command]
fn get_window_position(window: WebviewWindow) -> Result<(i32, i32), String> {
    let pos = window.outer_position().map_err(|e| e.to_string())?;
    Ok((pos.x, pos.y))
}

#[tauri::command]
fn start_dragging_window(window: WebviewWindow) -> Result<(), String> {
    window.start_dragging().map_err(|e| e.to_string())
}

#[tauri::command]
fn get_autostart() -> bool {
    #[cfg(target_os = "windows")]
    {
        use winreg::enums::*;
        use winreg::RegKey;
        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
        if let Ok(run_key) = hkcu.open_subkey("Software\\Microsoft\\Windows\\CurrentVersion\\Run") {
            let val: Result<String, _> = run_key.get_value("OnePlusClock");
            return val.is_ok();
        }
    }
    false
}

#[tauri::command]
fn set_autostart(enabled: bool) -> Result<(), String> {
    #[cfg(target_os = "windows")]
    {
        use winreg::enums::*;
        use winreg::RegKey;
        let hkcu = RegKey::predef(HKEY_CURRENT_USER);
        let run_key = hkcu
            .open_subkey_with_flags(
                "Software\\Microsoft\\Windows\\CurrentVersion\\Run",
                KEY_WRITE | KEY_READ,
            )
            .map_err(|e| e.to_string())?;

        if enabled {
            if let Ok(exe_path) = std::env::current_exe() {
                let path_str = format!("\"{}\"", exe_path.to_string_lossy());
                run_key
                    .set_value("OnePlusClock", &path_str)
                    .map_err(|e| e.to_string())?;
            }
        } else {
            let _ = run_key.delete_value("OnePlusClock");
        }
        Ok(())
    }
    #[cfg(not(target_os = "windows"))]
    {
        Ok(())
    }
}

#[tauri::command]
fn quit_app(app: AppHandle) {
    log_debug("quit_app called");
    app.exit(0);
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    log_debug("run() entered");
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .setup(|app| {
            log_debug("setup() entered");
            if let Some(window) = app.get_webview_window("main") {
                log_debug(&format!(
                    "main window exists: visible={:?}, pos={:?}, size={:?}",
                    window.is_visible(),
                    window.outer_position(),
                    window.inner_size()
                ));
                let mut restored = false;
                if let Some(path) = get_config_path(app.handle()) {
                    if let Ok(data) = fs::read_to_string(path) {
                        if let Ok(config) = serde_json::from_str::<AppConfig>(&data) {
                            if let (Some(x), Some(y)) = (config.x, config.y) {
                                if is_position_on_screen(&window, x, y) {
                                    let _ = window.set_position(PhysicalPosition::new(x, y));
                                    restored = true;
                                }
                            }
                            if let Some(true) = config.always_on_top {
                                let _ = window.set_always_on_top(true);
                            }
                            if let Some(true) = config.click_through {
                                let _ = window.set_ignore_cursor_events(true);
                            }
                        }
                    }
                }
                if !restored {
                    let _ = window.center();
                }
                ensure_window_visible(&window);
            } else {
                log_debug("ERROR: main window not found in setup()!");
            }

            // Build Tray Icon Menu
            let show_clock_item =
                MenuItem::with_id(app, "show_clock", "Show Clock", true, None::<&str>)?;
            let center_clock_item =
                MenuItem::with_id(app, "center_clock", "Center Clock on Screen", true, None::<&str>)?;
            let toggle_settings_item =
                MenuItem::with_id(app, "settings", "Settings", true, None::<&str>)?;
            let toggle_ontop_item =
                MenuItem::with_id(app, "toggle_ontop", "Toggle Always on Top", true, None::<&str>)?;
            let toggle_click_through_item = MenuItem::with_id(
                app,
                "toggle_clickthrough",
                "Toggle Click-Through",
                true,
                None::<&str>,
            )?;
            let quit_item = MenuItem::with_id(app, "quit", "Quit", true, None::<&str>)?;
            let sep1 = PredefinedMenuItem::separator(app)?;
            let sep2 = PredefinedMenuItem::separator(app)?;

            let tray_menu = Menu::with_items(
                app,
                &[
                    &show_clock_item,
                    &center_clock_item,
                    &toggle_settings_item,
                    &sep1,
                    &toggle_ontop_item,
                    &toggle_click_through_item,
                    &sep2,
                    &quit_item,
                ],
            )?;

            let tray_builder = TrayIconBuilder::new()
                .menu(&tray_menu)
                .show_menu_on_left_click(false)
                .on_menu_event(|app, event| {
                    log_debug(&format!("Tray menu event: {:?}", event.id.as_ref()));
                    match event.id.as_ref() {
                        "show_clock" => {
                            if let Some(window) = app.get_webview_window("main") {
                                ensure_window_visible(&window);
                            }
                            let _ = app.emit("tray-show-clock", ());
                        }
                        "center_clock" => {
                            if let Some(window) = app.get_webview_window("main") {
                                ensure_window_visible(&window);
                                let _ = window.center();
                                if let Ok(pos) = window.outer_position() {
                                    let _ = save_position(app.clone(), pos.x, pos.y);
                                }
                            }
                            let _ = app.emit("tray-show-clock", ());
                        }
                        "settings" => {
                            if let Some(window) = app.get_webview_window("main") {
                                ensure_window_visible(&window);
                            }
                            let _ = app.emit("tray-open-settings", ());
                        }
                        "toggle_ontop" => {
                            let _ = app.emit("tray-toggle-ontop", ());
                        }
                        "toggle_clickthrough" => {
                            let _ = app.emit("tray-toggle-clickthrough", ());
                        }
                        "quit" => {
                            app.exit(0);
                        }
                        _ => {}
                    }
                })
                .on_tray_icon_event(|tray, event| {
                    if let TrayIconEvent::Click {
                        button: MouseButton::Left,
                        button_state: MouseButtonState::Up,
                        ..
                    } = event
                    {
                        log_debug("Tray left click event");
                        let app = tray.app_handle();
                        if let Some(window) = app.get_webview_window("main") {
                            ensure_window_visible(&window);
                        }
                        let _ = app.emit("tray-show-clock", ());
                    }
                });

            if let Some(icon) = app.default_window_icon() {
                let _ = tray_builder.icon(icon.clone()).build(app);
            }

            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            log_frontend,
            save_position,
            get_saved_position,
            set_click_through,
            set_always_on_top,
            set_window_position,
            center_window,
            get_window_position,
            start_dragging_window,
            get_autostart,
            set_autostart,
            quit_app
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
