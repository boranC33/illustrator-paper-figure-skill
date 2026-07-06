# Illustrator Paper Figure Skill

> A Codex skill for editable Adobe Illustrator scientific flowcharts,
> mechanism diagrams, MathType-ready formula assets, and LaTeX PDF export
> quality checks.

This repository packages a reusable workflow for preparing publication-style
scientific process diagrams. It guides Codex through concept planning,
GPT-image/GPT-image2 rough sketch or component prompting, local hand-drawn or
line-art redraw, Illustrator assembly, MathType-style formula placement, manual
fine-tuning handoff, and manuscript-scale QA. It is designed for LaTeX papers where the
final figure is a vector PDF, formulas must match paper typography, and
user-edited `.ai` files must not be modified by automation.

## What This Skill Provides

- Flowchart-first planning for workflow and mechanism figures.
- Rough whole-figure blueprint prompting for composition before local redraw.
- GPT-image/GPT-image2 component prompt patterns organized by visual role,
  not by a single research field.
- Local cleanup, line-art, and hand-drawn redraw guidance before Illustrator
  assembly.
- Safe export from Illustrator `.ai` masters through temporary copies.
- Publication-oriented layout rules for multi-panel scientific flowcharts.
- MathType/PDF/EPS formula-asset guidance for symbols and equations.
- Formula source/export handoff rules for MathType-heavy figures.
- General style specifications for font sizes, line weights, arrows, colors,
  panel labels, and formula placement.
- Manual Illustrator fine-tuning handoff guidance.
- Figure-style consistency checks for fonts, arrows, panel labels, and boxes.
- LaTeX integration checks using the compiled manuscript page, not only the
  standalone exported figure.
- A lightweight LaTeX figure-asset preflight script for path, format, and
  companion `.ai` checks.
- A Potrace-based raster-to-SVG tracing helper for clean line-art drafts.
- A PowerShell export helper for Windows machines with Adobe Illustrator.

## Typical Use Cases

- Export a manually edited Illustrator figure to the PDF used by LaTeX.
- Redraw a manuscript workflow figure while keeping all elements editable.
- Plan GPT-image/GPT-image2 prompts for components such as specimens, devices,
  materials, environments, processes, setups, multi-scale structures, or
  abstract workflow concepts.
- Convert generated raster components into simplified line-art or hand-drawn
  assets before importing them into Illustrator.
- Insert MathType-generated formula assets into an Illustrator figure.
- Organize formula source files, PDF/EPS exports, and Illustrator placement
  notes for later regeneration.
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
|-- references/
|   |-- component-prompt-cards.md     # General prompt cards by visual role
|   |-- figure-contract.md            # Figure path and deliverable contract
|   |-- figure-style-spec.md          # Font, line, color, and layout standards
|   |-- mathtype-formula-handoff.md   # MathType source/export handoff workflow
|   |-- sketch-to-vector-workflow.md  # Rough sketch to editable vector workflow
|   `-- figure-qa-checklist.md        # Final publication QA checklist
`-- scripts/
    |-- export_ai_to_pdf.ps1          # Safe Illustrator-to-PDF exporter
    |-- preflight_figure_assets.py    # LaTeX figure asset preflight
    `-- raster_to_svg_trace.py        # Clean raster line art to SVG via Potrace
```

## How It Works

1. Define the flowchart story and node sequence before drawing.
2. Write GPT-image/GPT-image2 prompts for a rough full-figure blueprint or for
   isolated visual components, with no text, logos, signatures, borders, or
   visible watermarks.
3. Generate sketches/components and inspect them for structural correctness.
4. Clean, simplify, locally redraw, or vectorize sketches/components as
   line-art assets.
5. Import only cleaned components into Illustrator and assemble editable boxes,
   arrows, labels, and formulas.
6. Place MathType or LaTeX PDF/EPS formula assets and keep formula sources
   organized for regeneration.
7. Locate the manuscript figure contract, usually the `.ai` master and the
   `figures/Figure_N.pdf` file referenced by LaTeX.
8. Protect the editable master by copying it to a temporary sibling `.ai` file.
9. Open only the temporary copy in Illustrator and export a vector PDF.
10. Publish the exported PDF to the manuscript figure path if requested.
11. Compile or render the manuscript page and inspect the actual in-paper result.

## Trace Example

Convert a clean raster line-art draft into an SVG for Illustrator cleanup:

```bash
python illustrator-paper-figure/scripts/raster_to_svg_trace.py \
  path/to/component_clean.png \
  path/to/component_trace.svg \
  --preview-png path/to/component_threshold.png
```

The helper requires Pillow and Potrace. Inspect and simplify the resulting SVG
after import; auto-traced paths are starting points, not final artwork.

## Preflight Example

Check figure assets referenced by a LaTeX manuscript:

```bash
python illustrator-paper-figure/scripts/preflight_figure_assets.py path/to/main.tex
```

Use `--require-ai` when every final figure is expected to have a nearby
Illustrator master.

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
Use $illustrator-paper-figure to plan a scientific workflow figure and write GPT-image/GPT-image2 prompts for its visual components.
Use $illustrator-paper-figure to generate a rough mechanism sketch, locally redraw it into vector assets, and assemble it in Illustrator.
Use $illustrator-paper-figure to convert generated specimen, device, material, or process components into clean line-art assets before Illustrator assembly.
Use $illustrator-paper-figure to export an edited AI figure to PDF and verify it in LaTeX.
Use $illustrator-paper-figure to check whether this workflow figure follows the text-box centering rules.
Use $illustrator-paper-figure to prepare MathType formula assets for an Illustrator manuscript figure.
```

## Figure Quality Checklist

- The `.ai` master remains editable and is not overwritten by automation.
- Generated components are used as references or redraw inputs, not as complete
  AI-generated flowcharts.
- Components with wrong anatomy, missing parts, visible watermark-like marks, or
  text artifacts are regenerated or redrawn before use.
- Text and formula groups are geometrically centered inside workflow boxes.
- Arrows are clean stroked paths with filled arrowheads, routed as straight or
  orthogonal connectors where possible.
- Arrow labels do not collide with arrowheads, formulas, or figure artwork.
- Panel labels match the caption and use consistent size and placement.
- Mathematical symbols such as `\rho_b`, `\xi`, and `C_{\mathrm{sh}}` are placed
  as MathType/PDF/EPS assets when exact equation typography matters.
- Formula source files and exported formula assets remain available for later
  regeneration.
- The compiled manuscript page is checked for clipping, readability, and scale.

## Safety Notes

- Do not edit a user-corrected `.ai` master unless the user explicitly asks for
  source edits.
- Do not use third-party watermarked images as source material. For AI-generated
  components, avoid visible marks at prompt time and produce a clean local redraw
  or vectorized component for the final figure.
- Do not attempt to strip hidden provenance metadata from generated assets.
- Do not publish local absolute paths, personal usernames, or private project
  directories in public examples.
- Prefer derived outputs such as `Figure_N_export_check.pdf` for review, then
  copy to `Figure_N.pdf` only after visual QA.

## Requirements

- Windows PowerShell for the bundled exporter.
- Adobe Illustrator installed and available through COM automation.
- A LaTeX toolchain for manuscript compilation checks.
- Pillow and Potrace for the optional raster-to-SVG tracing helper.
- MathType, or pre-exported PDF/EPS formula assets, when exact formula rendering
  is required.

## Status

This skill is intentionally focused on Illustrator-based scientific figures. It
does not attempt to replace full graphic design review, journal-specific artwork
requirements, or manual final inspection.
