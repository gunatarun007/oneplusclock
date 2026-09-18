// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[cfg(windows)]
mod single_instance {
    use std::ffi::OsStr;
    use std::os::windows::ffi::OsStrExt;
    use windows_sys::Win32::Foundation::{CloseHandle, GetLastError, ERROR_ALREADY_EXISTS};
    use windows_sys::Win32::System::Threading::CreateMutexW;
    use windows_sys::Win32::UI::WindowsAndMessaging::{
        FindWindowW, SetForegroundWindow, ShowWindow, SW_RESTORE,
    };

    pub fn ensure_single_instance() -> Option<isize> {
        let name: Vec<u16> = OsStr::new("OnePlusClockAppSingleInstanceMutex\0")
            .encode_wide()
            .collect();
        let hmutex = unsafe { CreateMutexW(std::ptr::null(), 1, name.as_ptr()) };
        if unsafe { GetLastError() } == ERROR_ALREADY_EXISTS {
            let win_name: Vec<u16> = OsStr::new("OnePlus Clock\0").encode_wide().collect();
            let hwnd = unsafe { FindWindowW(std::ptr::null(), win_name.as_ptr()) };
            if !hwnd.is_null() {
                unsafe {
                    ShowWindow(hwnd, SW_RESTORE);
                    SetForegroundWindow(hwnd);
                }
            }
            if !hmutex.is_null() {
                unsafe { CloseHandle(hmutex) };
            }
            std::process::exit(0);
        }
        Some(hmutex as isize)
    }
}

fn main() {
    #[cfg(windows)]
    let _mutex = single_instance::ensure_single_instance();

    std::panic::set_hook(Box::new(|info| {
        let msg = format!("{info}\n\nBacktrace:\n{:?}", std::backtrace::Backtrace::capture());
        let _ = std::fs::write("C:\\Users\\tarun\\Desktop\\Oneplusclock\\panic.txt", msg);
    }));
    onepluswidget_lib::run()
}
