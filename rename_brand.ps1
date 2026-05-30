$files = Get-ChildItem -Path . -Recurse -File -Exclude node_modules,vendor,.git,public,storage,*lock*,*.ico,*.png,*.jpg

foreach ($file in $files) {
    $content = Get-Content $file.FullName -Raw
    if ($content -match "(?i)ecocademy") {
        $newContent = $content -creplace "ecocademy\.com", "ecocademy.com"
        $newContent = $newContent -creplace "Eco Academy", "Eco Academy"
        $newContent = $newContent -creplace "Ecocademy", "Ecocademy"
        $newContent = $newContent -creplace "ecocademy", "ecocademy"
        Set-Content -Path $file.FullName -Value $newContent -NoNewline
    }
}
