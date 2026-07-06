---
name: illustrator-paper-figure
description: Plan, create, revise, safely export, and QA publication-grade Adobe Illustrator scientific figures for LaTeX manuscripts. Use when working with editable .ai masters, flowchart/process/mechanism diagrams, GPT-image/GPT-image2 rough sketch prompts, local image-to-vector tracing or redraw, MathType or LaTeX formula assets, journal artwork checks, PDF/PNG/TIFF export, user handoff for manual Illustrator fine-tuning, or compiled-paper figure validation.
---

# Illustrator Paper Figure

## Primary Safety Rule

Treat the `.ai` file as the editable master. If the user says they manually edited the AI file or asks only to export it, do not modify the source `.ai`. Export from a temporary copy, then replace only the derived manuscript asset such as `Figure_1.pdf`.

Use this skill with `adobe-illustrator-scripting` when writing or debugging Illustrator JSX/COM automation. Use the paper's LaTeX skill, if available, for manuscript compilation and figure checks.

## Execution Router

- **Export only**: confirm the `.ai` master and target PDF, run the safe export script, then validate the compiled manuscript page if a `.tex` file is available.
- **New or rebuilt mechanism figure**: define the figure contract, plan the scientific story, create a rough GPT-image/GPT-image2 sketch or component set, redraw locally into editable/vector assets, assemble in Illustrator, add formula assets, export, then QA at manuscript scale.
- **Component generation**: write one prompt per isolated component, reject text/watermark/anatomy errors, clean or redraw locally, and keep provenance in a named asset folder.
- **Figure QA**: run the preflight script when a LaTeX source exists, inspect the standalone export, then inspect the rendered manuscript page.
- **Journal submission**: read the target journal artwork rules if available, then check format, naming, fonts, line weights, raster resolution, color use, and separate-file deliverables.

## References To Load As Needed

- Read `references/figure-contract.md` when starting a new figure, rebuilding an existing figure, or resolving ambiguous file paths and deliverables.
- Read `references/sketch-to-vector-workflow.md` when the user wants to generate a rough hand-drawn mechanism image and then trace/redraw it locally before Illustrator assembly.
- Read `references/component-prompt-cards.md` when generating, revising, or cleaning AI-created visual components.
- Read `references/figure-style-spec.md` when setting or checking font sizes, line weights, arrow geometry, colors, panel labels, formula placement, and final manuscript readability.
- Read `references/mathtype-formula-handoff.md` when a figure uses MathType formulas or needs formula source/export organization.
- Read `references/figure-qa-checklist.md` before final approval, journal submission, or major visual revisions.

## Core Workflow

1. Locate the figure contract.
   - Identify the manuscript figure path in `main.tex`, usually `figures/Figure_N.pdf`.
   - Identify the editable source, usually `figures/Figure_N_*.ai`.
   - Inspect a nearby finished figure such as `Figure_4.pdf/png` for font, stroke, color, panel-label, and caption conventions.
   - If the paper has venue-specific artwork rules, keep them visible while choosing file type, resolution, and naming.

2. Plan before drawing.
   - Define the scientific story in 3--6 nodes, for example `source inspiration -> engineering abstraction -> design translation -> modeling workflow`.
   - Decide which nodes need literal visual components, such as specimens, devices, materials, environments, instruments, organisms, interfaces, or hardware.
   - Decide which nodes should remain pure vector boxes, arrows, formulas, or labels.
   - Sketch the panel structure, reading order, and arrow topology before creating any image component.

3. Generate or source components conservatively.
   - Use generated images only as rough sketches, source components, or style references, not as the final figure.
   - A whole-figure rough sketch is acceptable as a redraw blueprint if it has no final text, labels, formulas, logos, signatures, borders, or visible watermarks.
   - Prompt for isolated components on a plain background with no text, labels, logos, signatures, borders, visible watermarks, or decorative framing.
   - Specify the required view, object count, perspective, anatomy/geometry constraints, and manuscript-compatible line style.
   - Generate separate components when possible. It is easier to redraw a clean object, specimen, setup, or material region than to repair a complete AI-generated diagram.
   - Keep prompts, source images, cleaned images, and redraw outputs in a named asset folder so figure provenance can be audited.

4. Convert components locally.
   - Remove plain backgrounds, crop whitespace, and simplify tonal detail before importing into Illustrator.
   - Prefer local redraw, Illustrator Image Trace, Inkscape/Potrace tracing, or controlled code-based line-art conversion over using raw generated bitmaps in the final manuscript figure.
   - Use `scripts/raster_to_svg_trace.py` for clean high-contrast line-art drafts when a Potrace-based SVG trace is useful.
   - Reduce fur, texture, and shading detail until the core structure is readable at final figure size.
   - If a generated image contains watermark-like artifacts, signatures, stray text, wrong object counts, or confusing silhouettes, reject and regenerate or redraw it manually.
   - Do not use third-party watermarked images, and do not attempt to strip hidden provenance metadata from generated assets.
   - Save cleaned intermediates with explicit names such as `component_device_clean.png`, `component_device_lineart.svg`, and `component_device_redraw.ai`.

5. Preserve and organize the master.
   - Never run a script that opens, saves, or closes the user's source `.ai` unless they explicitly ask for edits.
   - For export-only tasks, copy the AI to a temporary sibling file and open that temporary file in Illustrator.
   - Use semantic layers such as `01_panel_a_source`, `02_mechanism`, `04_workflow`, and `05_formula_assets`.
   - Draw boxes, arrows, labels, callouts, and panel labels as Illustrator objects.
   - Place cleaned raster or vectorized image components on locked reference layers, then redraw important outlines as editable paths when publication quality or future editing matters.

6. Handle formulas as assets.
   - Prefer user-provided MathType EPS/PDF formula assets when exact MathType appearance is required.
   - Use LaTeX-generated EPS/PDF formula assets as stable fallbacks when MathType automation is unreliable.
   - Create a formula inventory before placing formulas so source files, PDF/EPS exports, target panels, and size notes stay linked.
   - Avoid visible code-style text such as `rho_b` or `C_sh` unless the user accepts it.
   - Keep formula assets in clearly named folders such as `formulas_mathtype_pdf/`, `formulas_mathtype_eps/`, or `formulas_pdf/`.
   - Place formulas as linked or embedded PDF/EPS assets in Illustrator, align them visually with surrounding labels, and keep the original formula source next to the exported asset.

7. Match manuscript style.
   - Use the same visible font family as the paper's other figures, typically Times New Roman for labels.
   - Determine final figure width first; judge font size, line weight, and spacing at that final size.
   - Use restrained colors already present in the paper or project. Avoid color-only encoding; combine color with labels, shape, line style, or position.
   - Keep panel labels `(a)`, `(b)`, etc. consistent in size, weight, and placement.
   - Avoid decorative effects that will not reproduce well in a journal PDF.
   - When a user-corrected figure exists, inspect it first and treat its arrow routing, label placement, and box typography as the style source.

8. Follow flowchart layout conventions.
   - Draw arrows as clean Illustrator stroked paths with filled arrowheads, not as decorative shapes.
   - Use straight or orthogonal routes for workflow links, with arrow tips meeting the midpoint of the target box edge or object boundary.
   - Keep arrowheads and shafts outside text areas. Leave a small visual gap from box borders unless the arrow is intentionally connected to that border.
   - Center arrow labels along their associated arrow path, offset enough that they do not collide with arrowheads, formulas, or panel artwork.
   - For every colored or outlined workflow box, place the text or formula group at the geometric center of the box.
   - If centered text does not fit comfortably, enlarge the box or split the label into balanced lines. Do not shrink fonts below the surrounding figure's readable scale just to force a label into place.

9. Export deliverables.
   - Export a vector PDF for LaTeX and submission.
   - Optionally export PNG for preview and TIFF for journal upload, but keep PDF as the LaTeX source unless the paper workflow requires another format.
   - Keep a separate review copy such as `Figure_N_export_check.pdf` when useful, then copy it to `Figure_N.pdf` only after visual QA.

10. Prepare user handoff for manual Illustrator fine-tuning.
   - Keep the editable `.ai` master, formula source assets, cleaned/redrawn components, preview PNG, and exported PDF together.
   - Leave only actionable manual edits for the user, such as final label nudges, formula baseline alignment, arrow rerouting, or style choices that require judgment.
   - Do not present raw generated images as final publishable artwork.

11. Validate.
   - Run `scripts/preflight_figure_assets.py path/to/main.tex` when a LaTeX source is available.
   - Compile with a non-conflicting job name when the main PDF may be open:
     `latexmk -pdf -interaction=nonstopmode -halt-on-error -jobname=main_check main.tex`
   - Render the page containing the figure with `pdftocairo` or an equivalent PDF renderer and inspect it visually.
   - Check that text is readable, formulas render, panel labels match the caption, no element is clipped, arrows attach cleanly, and text/formulas sit centered inside their boxes.
   - Run the paper figure checker when available. On Windows, set `PYTHONIOENCODING=utf-8` if a script fails only while printing Unicode status icons.

## Export Script

Use `scripts/export_ai_to_pdf.ps1` for export-only tasks. It copies the AI master to a temporary file before opening Illustrator, so the original AI is not saved or changed by automation.

Example:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass `
  -File .\scripts\export_ai_to_pdf.ps1 `
  -AiPath path\to\paper\figures\Figure_1_illustrator_master.ai `
  -OutputPdf path\to\paper\figures\Figure_1_export_check.pdf `
  -PublishPdf path\to\paper\figures\Figure_1.pdf
```

After exporting, compile the paper and render the figure page for QA.

## Local Trace Script

Use `scripts/raster_to_svg_trace.py` for clean black/white or high-contrast raster sketches that should become editable SVG outlines before Illustrator cleanup. It requires Pillow and Potrace.

Example:

```bash
python scripts/raster_to_svg_trace.py \
  path/to/component_clean.png \
  path/to/component_trace.svg \
  --preview-png path/to/component_threshold.png
```

Inspect the SVG after import. Replace noisy auto-traced paths with clean manual paths when readability or geometry matters.

## Common Failure Modes

- Illustrator may drop or fail to render EMF objects during PDF/PNG export. Prefer PDF/EPS formula placement over EMF.
- Illustrator COM SVG export can crash when the document contains placed formula/raster assets. Do not make SVG mandatory.
- Word/MathType batch export may hang on hidden dialogs. Clean up background `WINWORD`, `MathType`, or `MathTypeLib` processes only when they were started by the current automation and are visibly stalled.
- Exported page previews can look good while the compiled LaTeX figure is too small. Always render the compiled manuscript page, not only the standalone figure.
- Do not overwrite user-edited `.ai` files. Derived files are replaceable; the AI master is not.
