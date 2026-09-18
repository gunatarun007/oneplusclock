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

$procs = Get-Process -Name 'onepluswidget' -ErrorAction SilentlyContinue
if (-not $procs) {
    Write-Host "No onepluswidget process found!"
    exit
}

$pids = @($procs | ForEach-Object { $_.Id })
Write-Host "Found PIDs:" ($pids -join ", ")

[WinAPI]::EnumWindows({
    param($hwnd, $lparam)
    $pid = 0
    [WinAPI]::GetWindowThreadProcessId($hwnd, [ref]$pid)
    if ($pids -contains $pid) {
        $sb = New-Object System.Text.StringBuilder 256
        [WinAPI]::GetWindowText($hwnd, $sb, 256)
        $rect = New-Object WinAPI+RECT
        [WinAPI]::GetWindowRect($hwnd, [ref]$rect)
        $vis = [WinAPI]::IsWindowVisible($hwnd)
        Write-Host ("HWND: {0} PID: {1} Title: '{2}' Visible: {3} Rect: ({4},{5})-({6},{7})" -f $hwnd, $pid, $sb.ToString(), $vis, $rect.Left, $rect.Top, $rect.Right, $rect.Bottom)
    }
    return $true
}, [IntPtr]::Zero)
