Add-Type @'
using System;
using System.Runtime.InteropServices;
using System.Text;

public class ThreadWinAPI {
    [DllImport("user32.dll")]
    public static extern bool EnumThreadWindows(int dwThreadId, EnumThreadDelegate lpfn, IntPtr lParam);
    public delegate bool EnumThreadDelegate(IntPtr hWnd, IntPtr lParam);

    [DllImport("user32.dll")]
    public static extern bool IsWindowVisible(IntPtr hWnd);

    [DllImport("user32.dll")]
    public static extern int GetWindowText(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern int GetClassName(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
        public int Left, Top, Right, Bottom;
    }
}
'@

$proc = Get-Process -Id 34332 -ErrorAction SilentlyContinue
if (-not $proc) {
    Write-Host "Process 34332 not found"
    exit
}

Write-Host "Process 34332 has $($proc.Threads.Count) threads."
foreach ($t in $proc.Threads) {
    [ThreadWinAPI]::EnumThreadWindows($t.Id, {
        param($hwnd, $lparam)
        $sbTitle = New-Object System.Text.StringBuilder 256
        [ThreadWinAPI]::GetWindowText($hwnd, $sbTitle, 256)
        $sbClass = New-Object System.Text.StringBuilder 256
        [ThreadWinAPI]::GetClassName($hwnd, $sbClass, 256)
        $rect = New-Object ThreadWinAPI+RECT
        [ThreadWinAPI]::GetWindowRect($hwnd, [ref]$rect)
        $vis = [ThreadWinAPI]::IsWindowVisible($hwnd)
        Write-Host ("HWND: {0} Class: '{1}' Title: '{2}' Vis: {3} Rect: ({4},{5})-({6},{7})" -f `
            $hwnd, $sbClass.ToString(), $sbTitle.ToString(), $vis, `
            $rect.Left, $rect.Top, $rect.Right, $rect.Bottom)
        return $true
    }, [IntPtr]::Zero)
}
