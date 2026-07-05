# Illustrator Paper Figure Skill

> A Codex skill for editable Adobe Illustrator manuscript figures, MathType-ready
> formula assets, and LaTeX PDF export quality checks.

This repository packages a reusable workflow for preparing publication-style
scientific figures when the editable master lives in Adobe Illustrator. It is
designed for LaTeX manuscripts where the final figure is a vector PDF, formulas
must match paper typography, and user-edited `.ai` files must not be modified by
automation.

## What This Skill Provides

- Safe export from Illustrator `.ai` masters through temporary copies.
- Publication-oriented layout rules for multi-panel scientific figures.
- MathType/PDF/EPS formula-asset guidance for symbols and equations.
- Figure-style consistency checks for fonts, arrows, panel labels, and boxes.
- LaTeX integration checks using the compiled manuscript page, not only the
  standalone exported figure.
- A PowerShell export helper for Windows machines with Adobe Illustrator.

## Typical Use Cases

- Export a manually edited Illustrator figure to the PDF used by LaTeX.
- Redraw a manuscript workflow figure while keeping all elements editable.
- Insert MathType-generated formula assets into an Illustrator figure.
- Check whether text is centered inside workflow boxes and arrows are cleanly
  routed.
- Verify that a final figure is readable at manuscript scale after compilation.

## Installation

### Install with skill-installer

In Codex, install directly from the GitHub repository:

```text
$skill-installer install https://github.com/boranC33/illustrator-paper-figure-skill/tree/main/illustrator-paper-figure
```

### Manual user-level install

Clone this repository and place the skill folder under your Codex skills
directory:

```bash
git clone https://github.com/boranC33/illustrator-paper-figure-skill.git
mkdir -p "$HOME/.codex/skills"
cp -R illustrator-paper-figure-skill/illustrator-paper-figure "$HOME/.codex/skills/"
```

On Windows PowerShell:

```powershell
git clone https://github.com/boranC33/illustrator-paper-figure-skill.git
New-Item -ItemType Directory -Force "$env:USERPROFILE\.codex\skills" | Out-Null
Copy-Item -Recurse -Force ".\illustrator-paper-figure-skill\illustrator-paper-figure" "$env:USERPROFILE\.codex\skills\illustrator-paper-figure"
```

Restart Codex after installation so the skill can be discovered.

### Project-level skill

For a project-shared setup, copy the folder into a repository-local skills
directory:

```bash
mkdir -p .codex/skills
cp -R illustrator-paper-figure-skill/illustrator-paper-figure .codex/skills/
```

## Skill Structure

```text
illustrator-paper-figure/
|-- SKILL.md                          # Core workflow and quality rules
|-- agents/
|   `-- openai.yaml                   # Codex display metadata
`-- scripts/
    `-- export_ai_to_pdf.ps1          # Safe Illustrator-to-PDF exporter
```

## How It Works

1. Locate the manuscript figure contract, usually the `.ai` master and the
   `figures/Figure_N.pdf` file referenced by LaTeX.
2. Protect the editable master by copying it to a temporary sibling `.ai` file.
3. Open only the temporary copy in Illustrator and export a vector PDF.
4. Publish the exported PDF to the manuscript figure path if requested.
5. Compile or render the manuscript page and inspect the actual in-paper result.

## Export Example

Use project-relative or placeholder paths rather than machine-specific personal
paths:

```powershell
$FigureDir = "path\to\paper\figures"

powershell -NoProfile -ExecutionPolicy Bypass `
  -File ".\scripts\export_ai_to_pdf.ps1" `
  -AiPath "$FigureDir\Figure_1_illustrator_master.ai" `
  -OutputPdf "$FigureDir\Figure_1_export_check.pdf" `
  -PublishPdf "$FigureDir\Figure_1.pdf"
```

The script exports from a temporary `.ai` copy and closes that copy without
saving, so the original Illustrator master remains untouched.

## Activation Examples

```text
Use $illustrator-paper-figure to export an edited AI figure to PDF and verify it in LaTeX.
Use $illustrator-paper-figure to check whether this workflow figure follows the text-box centering rules.
Use $illustrator-paper-figure to prepare MathType formula assets for an Illustrator manuscript figure.
```

## Figure Quality Checklist

- The `.ai` master remains editable and is not overwritten by automation.
- Text and formula groups are geometrically centered inside workflow boxes.
- Arrows are clean stroked paths with filled arrowheads, routed as straight or
  orthogonal connectors where possible.
- Arrow labels do not collide with arrowheads, formulas, or figure artwork.
- Panel labels match the caption and use consistent size and placement.
- Mathematical symbols such as `\rho_b`, `\xi`, and `C_{\mathrm{sh}}` are placed
  as MathType/PDF/EPS assets when exact equation typography matters.
- The compiled manuscript page is checked for clipping, readability, and scale.

## Safety Notes

- Do not edit a user-corrected `.ai` master unless the user explicitly asks for
  source edits.
- Do not publish local absolute paths, personal usernames, or private project
  directories in public examples.
- Prefer derived outputs such as `Figure_N_export_check.pdf` for review, then
  copy to `Figure_N.pdf` only after visual QA.

## Requirements

- Windows PowerShell for the bundled exporter.
- Adobe Illustrator installed and available through COM automation.
- A LaTeX toolchain for manuscript compilation checks.
- MathType, or pre-exported PDF/EPS formula assets, when exact formula rendering
  is required.

## Status

This skill is intentionally focused on Illustrator-based scientific figures. It
does not attempt to replace full graphic design review, journal-specific artwork
requirements, or manual final inspection.
