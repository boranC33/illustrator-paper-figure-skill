# Illustrator Paper Figure Skill

Codex skill for preparing editable, publication-style manuscript figures with
Adobe Illustrator, MathType formula assets, and LaTeX PDF export checks.

This skill records the workflow used for the RFT footpad manuscript figures:
protect the editable `.ai` master, export from a temporary copy, keep formulas
editable through MathType-derived PDF/EPS assets, and verify the final figure
inside the LaTeX manuscript rather than only inside Illustrator.

## Contents

- `SKILL.md` - the workflow and quality checklist for Codex.
- `agents/openai.yaml` - a small agent descriptor for the skill.
- `scripts/export_ai_to_pdf.ps1` - a PowerShell Illustrator COM exporter that
  opens a temporary `.ai` copy and publishes a PDF without modifying the master.

## Typical Use

```powershell
powershell -NoProfile -ExecutionPolicy Bypass `
  -File .\scripts\export_ai_to_pdf.ps1 `
  -AiPath "F:\RFT\latex\figures\Figure_1_illustrator_redraw.ai" `
  -OutputPdf "F:\RFT\latex\figures\Figure_1_illustrator_redraw_manual_export.pdf" `
  -PublishPdf "F:\RFT\latex\figures\Figure_1.pdf"
```

## Notes

- Keep one editable Illustrator master and avoid editing it during automated
  export.
- Place mathematical symbols such as `\rho_b` and `\xi` as MathType-generated
  PDF/EPS assets when the figure must match manuscript equation typography.
- Draw workflow arrows as clean straight or orthogonal paths, and center every
  text/formula group geometrically inside its workflow box.
- Validate the exported PDF by compiling the manuscript and inspecting the
  rendered page at final scale.
