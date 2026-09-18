Add-Type @'
using System;
using System.Runtime.InteropServices;
using System.Text;

public class WinAPI2 {
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
    public static extern int GetClassName(IntPtr hWnd, StringBuilder lpString, int nMaxCount);

    [DllImport("user32.dll")]
    public static extern bool GetWindowRect(IntPtr hWnd, out RECT lpRect);

    [DllImport("user32.dll")]
    public static extern int GetWindowLong(IntPtr hWnd, int nIndex);

    [StructLayout(LayoutKind.Sequential)]
    public struct RECT {
        public int Left, Top, Right, Bottom;
    }
}
'@

$procs = Get-Process -Name "onepluswidget" -ErrorAction SilentlyContinue
if (-not $procs) {
    Write-Host "No onepluswidget running"
    exit
}

$pids = @($procs | ForEach-Object { $_.Id })
Write-Host "onepluswidget PIDs: $($pids -join ', ')"

# Also get child processes (like msedgewebview2)
$allPids = [System.Collections.Generic.List[int]]::new()
foreach ($p in $pids) {
    $allPids.Add($p)
    $children = Get-CimInstance Win32_Process | Where-Object { $_.ParentProcessId -eq $p }
    foreach ($c in $children) {
        $allPids.Add($c.ProcessId)
        Write-Host "Child of $p -> $($c.Name) (PID $($c.ProcessId))"
    }
}

Write-Host "Total PIDs to check: $($allPids.Count)"

$count = 0
[WinAPI2]::EnumWindows({
    param($hwnd, $lparam)
    $procId = [uint32]0
    [WinAPI2]::GetWindowThreadProcessId($hwnd, [ref]$procId)
    if ($allPids.Contains([int]$procId)) {
        $sbTitle = New-Object System.Text.StringBuilder 256
        [WinAPI2]::GetWindowText($hwnd, $sbTitle, 256)
        $sbClass = New-Object System.Text.StringBuilder 256
        [WinAPI2]::GetClassName($hwnd, $sbClass, 256)
        $rect = New-Object WinAPI2+RECT
        [WinAPI2]::GetWindowRect($hwnd, [ref]$rect)
        $vis = [WinAPI2]::IsWindowVisible($hwnd)
        $exStyle = [WinAPI2]::GetWindowLong($hwnd, -20) # GWL_EXSTYLE
        $style = [WinAPI2]::GetWindowLong($hwnd, -16) # GWL_STYLE
        
        Write-Host ("HWND: {0} PID: {1} Class: '{2}' Title: '{3}' Vis: {4} Rect: ({5},{6})-({7},{8}) [w={9}, h={10}] Style: 0x{11:X} ExStyle: 0x{12:X}" -f `
            $hwnd, $procId, $sbClass.ToString(), $sbTitle.ToString(), $vis, `
            $rect.Left, $rect.Top, $rect.Right, $rect.Bottom, `
            ($rect.Right - $rect.Left), ($rect.Bottom - $rect.Top), `
            $style, $exStyle)
    }
    return $true
}, [IntPtr]::Zero)
