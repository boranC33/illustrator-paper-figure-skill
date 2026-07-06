param(
    [Parameter(Mandatory = $true)]
    [string]$PdfPath,

    [string]$OutputPrefix,

    [int]$Dpi = 220
)

$ErrorActionPreference = "Stop"

$pdf = Resolve-Path -LiteralPath $PdfPath
if (-not $OutputPrefix) {
    $dir = Split-Path -Parent $pdf.Path
    $stem = [System.IO.Path]::GetFileNameWithoutExtension($pdf.Path)
    $OutputPrefix = Join-Path $dir ($stem + "_render_check")
}

$popplerCandidates = @(
    "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdftoppm.exe",
    "pdftoppm"
)

$pdfinfoCandidates = @(
    "$env:USERPROFILE\.cache\codex-runtimes\codex-primary-runtime\dependencies\native\poppler\Library\bin\pdfinfo.exe",
    "pdfinfo"
)

function Resolve-CommandPath {
    param([string[]]$Candidates)
    foreach ($candidate in $Candidates) {
        $cmd = Get-Command $candidate -ErrorAction SilentlyContinue
        if ($cmd) {
            return $cmd.Source
        }
        if (Test-Path -LiteralPath $candidate) {
            return $candidate
        }
    }
    return $null
}

$pdftoppm = Resolve-CommandPath $popplerCandidates
if (-not $pdftoppm) {
    throw "pdftoppm was not found. Install Poppler or use the Codex bundled runtime."
}

$pdfinfo = Resolve-CommandPath $pdfinfoCandidates
if ($pdfinfo) {
    & $pdfinfo $pdf.Path
}

$outDir = Split-Path -Parent ([System.IO.Path]::GetFullPath($OutputPrefix))
if ($outDir -and -not (Test-Path -LiteralPath $outDir)) {
    New-Item -ItemType Directory -Force -Path $outDir | Out-Null
}

& $pdftoppm -png -singlefile -r $Dpi $pdf.Path $OutputPrefix

$png = "$OutputPrefix.png"
if (-not (Test-Path -LiteralPath $png)) {
    throw "PDF render did not create expected PNG: $png"
}

Get-Item -LiteralPath $png
