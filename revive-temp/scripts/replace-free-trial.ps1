$root = 'C:\Users\rajni\OneDrive\Desktop\All Projects\Revive Fight Club\revive-temp'
$files = Get-ChildItem -Path $root -Recurse -Include '*.tsx','*.ts' |
    Where-Object { $_.FullName -notmatch '\.next' -and $_.FullName -notmatch 'node_modules' }

$count = 0
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName)
    $new = $content `
        -replace 'BOOK A FREE TRIAL', 'BOOK TRIAL' `
        -replace 'BOOK FREE TRIAL', 'BOOK TRIAL' `
        -replace 'Book your free trial class', 'Book your trial class' `
        -replace 'free trial class', 'trial class' `
        -replace 'Free trial classes are offered at our discretion and are limited to one per person\.', 'Trial classes are charged at Rs 1000 per session.' `
        -replace 'Book your free trial', 'Book your trial'
    if ($new -ne $content) {
        [System.IO.File]::WriteAllText($file.FullName, $new)
        Write-Host "Updated: $($file.Name)"
        $count++
    }
}
Write-Host "Done - $count files updated."
