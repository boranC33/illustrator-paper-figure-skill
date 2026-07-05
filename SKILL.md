---
name: illustrator-paper-figure
description: Create, update, export, and QA editable Adobe Illustrator manuscript figures for LaTeX papers. Use when working with .ai figure masters, exporting Illustrator figures to PDF/PNG/TIFF, protecting a user-edited AI source from accidental modification, matching typography/style across paper figures, inserting exported figures into LaTeX, or validating figure appearance in compiled PDFs.
---

# Illustrator Paper Figure

## Operating Rule

Treat the `.ai` file as the editable master. If the user says they manually edited the AI file or asks only to export it, do not modify the source `.ai`. Export from a temporary copy, then replace only the derived manuscript asset such as `Figure_1.pdf`.

Use this skill with `adobe-illustrator-scripting` when writing or debugging JSX. Use the paper's LaTeX skill, if available, for compile and figure checks.

## Workflow

1. Locate the figure contract.
   - Identify the manuscript figure path in `main.tex`, usually `figures/Figure_N.pdf`.
   - Identify the editable source, usually `figures/Figure_N_... .ai`.
   - Inspect a nearby finished figure such as `Figure_4.pdf/png` for font, stroke, color, panel-label, and caption conventions.

2. Preserve the master.
   - Never run a script that opens, saves, or closes the user's source `.ai` unless they explicitly ask for edits.
   - For export-only tasks, copy the AI to a temporary sibling file and open that temporary file in Illustrator.
   - Save PDF from the temporary document, close it without saving, and delete the temporary AI.

3. Keep the graphic editable.
   - Draw boxes, arrows, labels, callouts, and panel labels as Illustrator objects.
   - Use layers with semantic names such as `01_panel_a_source`, `04_workflow`, and `05_formula_assets`.
   - Keep formulas as placed assets when possible. Prefer MathType-exported EPS/PDF or LaTeX-generated PDF/EPS over plain text placeholders.
   - If a formula asset cannot be automated reliably, keep a clearly named replacement folder and use stable PDF/EPS fallbacks. Do not leave visible code-style text such as `rho_b` or `C_sh` unless the user accepts it.

4. Match manuscript style.
   - Use the same visible font family as the paper's other figures, typically Times New Roman for labels.
   - Use restrained colors already present in the paper. For this RFT paper, the established palette includes dark brown/black strokes, muted blue, red, teal, pale blue, pale red, and pale green workflow boxes.
   - Use panel labels `(a)`, `(b)`, etc. with consistent size, weight, and placement.
   - Avoid decorative effects that will not reproduce well in a journal PDF.
   - When a user-corrected figure exists, inspect it first and treat its arrow routing, label placement, and box typography as the style source for the next revision.

5. Follow the learned Fig. 1 layout conventions.
   - Draw arrows as clean Illustrator stroked paths with filled arrowheads, not as decorative shapes. Use straight or orthogonal routes for workflow links, with arrow tips meeting the midpoint of the target box edge or object boundary.
   - Keep arrowheads and shafts outside text areas. Leave a small visual gap from box borders unless the arrow is intentionally connected to that border.
   - Center arrow labels along their associated arrow path, and keep labels offset enough that they do not collide with arrowheads, formulas, or panel artwork.
   - For every colored or outlined workflow box, place the text or formula group at the geometric center of the box. Use area text or grouped MathType/PDF/EPS formula assets aligned horizontally and vertically to the box center.
   - Do not leave operation words such as `fit` or `apply` sitting near a box border. If they belong inside the box, make them part of the centered box label; if they describe an arrow, move them outside the box and align them to the arrow.
   - If centered text does not fit comfortably, enlarge the box or split the label into balanced lines. Do not shrink fonts below the surrounding figure's readable scale just to force a label into place.

6. Export deliverables.
   - Export a vector PDF for LaTeX and submission.
   - Optionally export PNG for preview and TIFF for journal upload, but keep PDF as the LaTeX source.
   - Keep a separate copy such as `Figure_N_illustrator_redraw_manual_export.pdf` when useful, then copy it to `Figure_N.pdf`.

7. Validate.
   - Compile with a non-conflicting job name when the main PDF may be open:
     `latexmk -pdf -interaction=nonstopmode -halt-on-error -jobname=main_check main.tex`
   - Render the page containing the figure with `pdftocairo` and inspect it visually.
   - Check that text is readable, formulas render, panel labels match the caption, no element is clipped, arrows attach cleanly, and text/formulas sit centered inside their boxes.
   - Run the paper figure checker when available. On Windows, set `PYTHONIOENCODING=utf-8` if a script fails only while printing Unicode status icons.

## Export Script

Use `scripts/export_ai_to_pdf.ps1` for export-only tasks. It copies the AI master to a temporary file before opening Illustrator, so the original AI is not saved or changed by automation.

Example:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass `
  -File F:\RFT\skills\illustrator-paper-figure\scripts\export_ai_to_pdf.ps1 `
  -AiPath F:\RFT\latex\figures\Figure_1_illustrator_redraw.ai `
  -OutputPdf F:\RFT\latex\figures\Figure_1_illustrator_redraw_manual_export.pdf `
  -PublishPdf F:\RFT\latex\figures\Figure_1.pdf
```

After exporting, compile the paper and render the figure page for QA.

## Formula Guidance

MathType is preferred when the user requests MathType-written formulas, but batch export can be unreliable through Word/MathType automation. Use this order:

1. User-provided MathType EPS/PDF formula assets.
2. MathType-exported assets created interactively through Word/MathType export tools.
3. LaTeX-generated EPS/PDF formula assets as stable placeholders.
4. Plain Illustrator text only for non-mathematical labels.

Keep formula assets in clearly named folders, for example:

- `figures/fig1_illustrator_assets/formulas_mathtype_pdf/`
- `figures/fig1_illustrator_assets/formulas_mathtype_eps/`
- `figures/fig1_illustrator_assets/formulas_pdf/`

When a formula source changes, regenerate the derived PDF and re-export the AI-derived figure.

## Common Failure Modes

- Illustrator may drop or fail to render EMF objects during PDF/PNG export. Prefer PDF/EPS formula placement over EMF.
- Illustrator COM SVG export can crash when the document contains placed formula/raster assets. Do not make SVG mandatory.
- Word/MathType batch export may hang on hidden dialogs. Clean up background `WINWORD`, `MathType`, or `MathTypeLib` processes only when they were started by the current automation and are visibly stalled.
- Exported page previews can look good while the compiled LaTeX figure is too small. Always render the compiled manuscript page, not only the standalone figure.
- Do not overwrite user-edited `.ai` files. Derived files are replaceable; the AI master is not.
