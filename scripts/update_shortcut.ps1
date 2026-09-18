$wsh = New-Object -ComObject WScript.Shell
$sc = $wsh.CreateShortcut("C:\Users\Public\Desktop\onepluswidget.lnk")
$sc.TargetPath = "C:\Users\tarun\Desktop\Oneplusclock\onepluswidget.exe"
$sc.WorkingDirectory = "C:\Users\tarun\Desktop\Oneplusclock"
$sc.IconLocation = "C:\Users\tarun\Desktop\Oneplusclock\src-tauri\icons\icon.ico"
$sc.Save()
Write-Host "Updated Public Desktop shortcut successfully"
