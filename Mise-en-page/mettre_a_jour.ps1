# Met à jour sommaire, listes de figures/tableaux et table des matières, puis exporte un PDF.
# Usage : powershell -ExecutionPolicy Bypass -File mettre_a_jour.ps1 [-Pdf chemin.pdf]
param([string]$Pdf = "")

$docx = Join-Path (Split-Path $PSScriptRoot -Parent) "Memoire_ALAWO_Adeshina.docx"
if ($Pdf -eq "") { $Pdf = [System.IO.Path]::ChangeExtension($docx, ".pdf") }

$word = New-Object -ComObject Word.Application
$word.Visible = $false
$word.DisplayAlerts = 0
try {
    $doc = $word.Documents.Open($docx)
    # Les listes de figures et de tableaux désignent leur style par "Style,niveau" : le séparateur
    # attendu dépend de la langue de Word (« ; » en français). On l'aligne sur celui de l'installation.
    $sep = $word.International(17)
    foreach ($f in $doc.Fields) {
        $code = $f.Code.Text
        if ($code -match '"Legende') { $f.Code.Text = ($code -replace '"(Legende\w+)[,;](\d)"', ('"$1' + $sep + '$2"')) }
    }
    $doc.Repaginate()
    foreach ($toc in $doc.TablesOfContents) { $toc.Update() }
    $doc.Repaginate()
    foreach ($toc in $doc.TablesOfContents) { $toc.UpdatePageNumbers() }
    $doc.Save()
    $doc.ExportAsFixedFormat($Pdf, 17)   # 17 = wdExportFormatPDF
    Write-Output ("Pages : " + $doc.ComputeStatistics(2))
    $doc.Close()
    Write-Output "Mis à jour : $docx"
    Write-Output "PDF : $Pdf"
} finally {
    $word.Quit()
}
