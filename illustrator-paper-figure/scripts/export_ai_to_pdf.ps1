param(
    [Parameter(Mandatory = $true)]
    [string]$AiPath,

    [Parameter(Mandatory = $true)]
    [string]$OutputPdf,

    [string]$PublishPdf
)

$ErrorActionPreference = "Stop"

function Convert-ToJsPath {
    param([string]$Path)
    $full = [System.IO.Path]::GetFullPath($Path).Replace("\", "/")
    return $full.Replace("'", "\\'")
}

$source = Resolve-Path -LiteralPath $AiPath
$sourcePath = $source.Path
$sourceDir = Split-Path -Parent $sourcePath
$sourceBase = [System.IO.Path]::GetFileNameWithoutExtension($sourcePath)
$tmpAi = Join-Path $sourceDir ($sourceBase + "_export_tmp_" + [System.Guid]::NewGuid().ToString("N") + ".ai")

$outputFull = [System.IO.Path]::GetFullPath($OutputPdf)
$outputDir = Split-Path -Parent $outputFull
if (-not (Test-Path -LiteralPath $outputDir)) {
    New-Item -ItemType Directory -Force -Path $outputDir | Out-Null
}

Copy-Item -LiteralPath $sourcePath -Destination $tmpAi -Force

try {
    $tmpJs = Convert-ToJsPath $tmpAi
    $outJs = Convert-ToJsPath $outputFull
    $jsx = @"
app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
var doc = app.open(new File('$tmpJs'));
var opts = new PDFSaveOptions();
opts.compatibility = PDFCompatibility.ACROBAT7;
opts.preserveEditability = false;
doc.saveAs(new File('$outJs'), opts);
doc.close(SaveOptions.DONOTSAVECHANGES);
app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
"@

    $illustrator = New-Object -ComObject Illustrator.Application
    $illustrator.DoJavaScript($jsx) | Out-Null

    if (-not (Test-Path -LiteralPath $outputFull)) {
        throw "Illustrator did not create output PDF: $outputFull"
    }

    if ($PublishPdf) {
        $publishFull = [System.IO.Path]::GetFullPath($PublishPdf)
        $publishDir = Split-Path -Parent $publishFull
        if (-not (Test-Path -LiteralPath $publishDir)) {
            New-Item -ItemType Directory -Force -Path $publishDir | Out-Null
        }
        Copy-Item -LiteralPath $outputFull -Destination $publishFull -Force
    }

    Get-Item -LiteralPath $outputFull
    if ($PublishPdf) {
        Get-Item -LiteralPath ([System.IO.Path]::GetFullPath($PublishPdf))
    }
}
finally {
    Remove-Item -LiteralPath $tmpAi -Force -ErrorAction SilentlyContinue
}
