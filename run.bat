@echo off
if not exist "%~dp0WebView2Loader.dll" (
    if exist "%~dp0src-tauri\target\release\WebView2Loader.dll" (
        copy /y "%~dp0src-tauri\target\release\WebView2Loader.dll" "%~dp0WebView2Loader.dll" >nul
    )
)
if exist "%~dp0onepluswidget.exe" (
    start "" "%~dp0onepluswidget.exe"
) else (
    start "" "%~dp0src-tauri\target\release\onepluswidget.exe"
)
