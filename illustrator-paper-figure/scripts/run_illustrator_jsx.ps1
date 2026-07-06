param(
    [Parameter(Mandatory = $true)]
    [string]$JsxPath,

    [switch]$WithLayoutHelpers,

    [switch]$WithTechnicalStyle,

    [switch]$Visible
)

$ErrorActionPreference = "Stop"

$resolved = Resolve-Path -LiteralPath $JsxPath
$source = Get-Content -LiteralPath $resolved.Path -Raw -Encoding UTF8
$scriptDir = Split-Path -Parent $PSCommandPath
$helperPath = Join-Path $scriptDir "layout_helpers.jsx"
$stylePath = Join-Path $scriptDir "technical_illustration_style.jsx"
$needsLayoutHelpers = $WithLayoutHelpers -or $source -match "(?m)^\s*//\s*(?:layout-helpers:\s*true|@include-layout-helpers)\s*$"
$needsTechnicalStyle = $WithTechnicalStyle -or $source -match "(?m)^\s*//\s*technical-style:\s*true\s*$"
$source = $source -replace "(?m)^\s*//\s*(?:layout-helpers:\s*true|@include-layout-helpers|technical-style:\s*true)\s*\r?\n?", ""

function Add-JsxPrelude {
    param(
        [string]$Source,
        [string]$Prelude
    )

    $target = ""
    $rest = $Source
    if ($Source -match "^\s*#target[^\r\n]*(\r?\n)?") {
        $target = $Matches[0]
        $rest = $Source.Substring($target.Length)
    }
    return $target + $Prelude + [Environment]::NewLine + $rest
}

if ($needsLayoutHelpers) {
    if (-not (Test-Path -LiteralPath $helperPath)) {
        throw "layout helper not found: $helperPath"
    }
    $helperSource = Get-Content -LiteralPath $helperPath -Raw -Encoding UTF8
    $source = Add-JsxPrelude -Source $source -Prelude $helperSource
}

if ($needsTechnicalStyle) {
    if (-not (Test-Path -LiteralPath $stylePath)) {
        throw "technical style helper not found: $stylePath"
    }
    $styleSource = Get-Content -LiteralPath $stylePath -Raw -Encoding UTF8
    $source = Add-JsxPrelude -Source $source -Prelude $styleSource
}

# Illustrator COM is more reliable with DoJavaScript(text) than with
# DoJavaScriptFile(path) across Windows/Illustrator versions.
$illustrator = New-Object -ComObject Illustrator.Application

if ($Visible) {
    try {
        $illustrator.Visible = $true
    }
    catch {
        Write-Verbose "Illustrator.Visible is read-only in this COM session."
    }
}

try {
    $result = $illustrator.DoJavaScript($source)
    if ($null -ne $result) {
        Write-Output $result
    }
}
catch {
    $message = $_.Exception.Message
    throw "Illustrator failed while running '$($resolved.Path)': $message"
}
