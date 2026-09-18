Add-Type @'
using System;
using System.Runtime.InteropServices;
using System.Text;

public class WinAPI {
    [DllImport("user32.dll")]
    public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
    
    [DllImport("user32.dll")]
    public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint lpdwProcessId);
    
    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);
    
    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
        public int Left, Top, Right, Bottom;
    }
}
'@

[WinAPI]::EnumWindows({
    param($hwnd, $lparam)
    $procId = [uint32]0
    [WinAPI]::GetWindowThreadProcessId($hwnd, [ref]$procId)
    $proc = Get-Process -Id $procId -ErrorAction SilentlyContinue
    $pName = if ($proc) { $proc.ProcessName } else { "Unknown" }
    
    if ($pName -like "*oneplus*" -or $pName -like "*webview2*") {
        $sb = New-Object System.Text.StringBuilder 256
        [WinAPI]::GetWindowText($hwnd, $sb, 256)
        $rect = New-Object WinAPI+RECT
        [WinAPI]::GetWindowRect($hwnd, [ref]$rect)
        $vis = [WinAPI]::IsWindowVisible($hwnd)
        Write-Host ("HWND: {0} PID: {1} ({2}) Title: '{3}' Vis: {4} Rect: ({5},{6})-({7},{8})" -f $hwnd, $procId, $pName, $sb.ToString(), $vis, $rect.Left, $rect.Top, $rect.Right, $rect.Bottom)
    }
    return $true
}, [IntPtr]::Zero)
