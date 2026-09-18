$wsh = New-Object -ComObject WScript.Shell
$sc = $wsh.CreateShortcut('C:\Users\Public\Desktop\onepluswidget.lnk')
Write-Host "Target:" $sc.TargetPath
Write-Host "WorkingDir:" $sc.WorkingDirectory
