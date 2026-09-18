$p = Get-Process -Name "onepluswidget" -ErrorAction SilentlyContinue
if ($p) {
    Write-Host "Process running: PID $($p.Id)"
} else {
    Write-Host "Process NOT running"
}
