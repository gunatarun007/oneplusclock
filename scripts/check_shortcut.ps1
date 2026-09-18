$wsh = New-Object -ComObject WScript.Shell
$desktop = [Environment]::GetFolderPath('Desktop')
Get-ChildItem -Path $desktop -Filter '*.lnk' | ForEach-Object {
    $sc = $wsh.CreateShortcut($_.FullName)
    if ($sc.TargetPath -like '*oneplus*') {
        Write-Host "Shortcut:" $_.Name
        Write-Host "  Target:" $sc.TargetPath
        Write-Host "  WorkingDir:" $sc.WorkingDirectory
    }
}
