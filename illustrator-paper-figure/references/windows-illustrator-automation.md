# Windows Illustrator Automation

Load this when running Illustrator from Codex, PowerShell, or another Windows automation host.

## Recommended JSX Runner

Use the bundled runner:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass `
  -File path\to\illustrator-paper-figure\scripts\run_illustrator_jsx.ps1 `
  -JsxPath path\to\build_figure.jsx
```

The runner reads the JSX as UTF-8 text and calls `Illustrator.Application.DoJavaScript(text)`. This avoids the `DoJavaScriptFile(path)` failure mode where Illustrator reports that JavaScript code was missing.

When the JSX contains `// layout-helpers: true` or `// technical-style: true`, the runner injects the corresponding bundled helper before sending the script to Illustrator. These markers are stripped before execution so Illustrator does not interpret them as preprocessor directives.

## Encoding Rules

- Keep JSX source UTF-8.
- Do not include `//@charset "UTF-8"` when sending code through COM `DoJavaScript(text)`.
- If non-ASCII labels must survive hostile shells, either:
  - keep all file writing inside a UTF-8 editor or `apply_patch`, or
  - encode labels as JavaScript `\uXXXX` string escapes.
- Do not trust terminal display alone for Chinese/Japanese/Korean text. Verify by opening the exported PNG/PDF.

## PowerShell Pattern

```powershell
$jsx = "C:\path\to\figure.jsx"
$code = Get-Content -Raw -Encoding UTF8 $jsx
$ai = New-Object -ComObject Illustrator.Application
$ai.DoJavaScript($code)
```

Avoid setting `$ai.Visible` unless needed; some Illustrator COM sessions expose it as read-only.

## Safe Export Pattern

For export-only work on a user-edited `.ai` file, use `scripts/export_ai_to_pdf.ps1`. It copies the AI to a temporary sibling file, opens that copy, exports the PDF, and deletes the temporary file.

For new/rebuilt figures, the JSX may save a new `.ai` master and derived exports directly because the script owns those outputs.

## PDF Render QA

Use the bundled renderer:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass `
  -File path\to\illustrator-paper-figure\scripts\render_pdf_check.ps1 `
  -PdfPath figures\Figure_1.pdf `
  -OutputPrefix figures\tmp\Figure_1_check `
  -Dpi 220
```

Inspect the generated PNG for clipped text, label overlap, missing formulas, and bad bounding boxes. A good Illustrator PNG export is not enough; the final PDF can still differ.

## Troubleshooting

- `JavaScript code was missing`: use `DoJavaScript(text)` through the bundled runner.
- `Syntax error` on line 1 or 2: remove `//@charset` and check that the first line is valid ExtendScript.
- Missing CJK glyphs: switch font fallback order or outline final text only if the journal permits it and editability is no longer required.
- Empty or partial PDF: close hidden Illustrator dialogs, simplify placed assets, and retry PDF export before attempting SVG.
- Poppler shim cannot find a path: call `native\poppler\Library\bin\pdftoppm.exe` directly or use `render_pdf_check.ps1`, which searches common Codex runtime locations.
