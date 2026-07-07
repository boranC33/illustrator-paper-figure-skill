---
name: illustrator-paper-figure
description: Plan, art-direct, create, revise, automate, safely export, and QA publication-grade Adobe Illustrator scientific figures for LaTeX manuscripts. Use when working with editable .ai masters, Illustrator JSX/Windows COM automation, scripted layout helpers, technical-illustration style tokens, visual polish/aesthetic QA, optional project-local component libraries, text/bounds collision checks, flowchart/process/mechanism diagrams, GPT-image/GPT-image2 rough sketch prompts, local image-to-vector tracing or redraw, MathType or LaTeX formula assets, journal artwork checks, PDF/PNG/TIFF export, user handoff for manual Illustrator fine-tuning, or compiled-paper figure validation.
---

# Illustrator Paper Figure

## Primary Safety Rule

Treat the `.ai` file as the editable master. If the user says they manually edited the AI file or asks only to export it, do not modify the source `.ai`. Export from a temporary copy, then replace only the derived manuscript asset such as `Figure_1.pdf`.

This skill includes the Illustrator JSX/COM scripting guidance needed for figure automation. Do not require a separate `adobe-illustrator-scripting` skill before writing or debugging Illustrator scripts. Use the paper's LaTeX skill, if available, for manuscript compilation and figure checks.

## Aesthetic-First Rule

When the user asks for a polished, refined, high-impact, Nature-style, graphical-abstract-like, or less "scripted" mechanism figure, or criticizes an output as ugly, crude, flat, not detailed, or not refined, do not start with a pure vector-first/script-first redraw unless the user explicitly wants deterministic simple schematics. First create or request a GPT-image/GPT-image2 rough whole-figure blueprint or isolated component references, then locally redraw the selected design into editable Illustrator vectors.

If image generation is unavailable in the current environment, stop the visual-design path long enough to report that limitation and provide the exact GPT-image/GPT-image2 prompt(s) needed. Do not silently fall back to a generic scripted diagram and call it polished.

## Execution Router

- **Export only**: confirm the `.ai` master and target PDF, run the safe export script, then validate the compiled manuscript page if a `.tex` file is available.
- **New or rebuilt mechanism figure**: define the figure contract, define an art direction contract, plan the scientific story, choose the aesthetic route, then proceed. For polished/manuscript/hero mechanism figures, read `references/sketch-to-vector-workflow.md`, create 2--4 GPT-image/GPT-image2 unlabeled blueprint variations or component references when tooling is available, select a composition, redraw locally into editable/vector assets, assemble in Illustrator, add labels/formulas/arrows, export, then QA at manuscript scale and visual-polish scale. Use vector-first scripting directly only for simple deterministic diagrams, tight reproduction of an existing layout, or when image generation is unavailable and the user accepts the limitation.
- **Visual polish/rebuild**: read `references/art-direction-contract.md`, `references/sketch-to-vector-workflow.md`, and `references/mechanism-figure-style-rubric.md`, identify why the figure looks crude, generate or request a better unlabeled visual blueprint/component reference when the problem is composition, silhouette, detail, or material language, then redraw geometry detail, line hierarchy, material cues, color strategy, and visual focus before doing another export.
- **Illustrator automation**: read `references/illustrator-scripting-quick-reference.md`, write JSX with semantic layers and helper functions, use `scripts/layout_helpers.jsx` for text measurement and collision checks, use `scripts/technical_illustration_style.jsx` for generic publication-grade visual tokens when suitable, run it with `scripts/run_illustrator_jsx.ps1` on Windows, then inspect exported PDF/PNG.
- **Optional local component library**: do not build a domain component library by default. If the same domain objects will be reused across figures, read `references/local-component-library-option.md`, ask the user whether to scaffold a project-local library, then run `scripts/init_local_component_library.py` only after that decision.
- **Component generation**: write one prompt per isolated component, reject text/watermark/anatomy errors, clean or redraw locally, and keep provenance in a named asset folder.
- **Figure QA**: run the preflight script when a LaTeX source exists, inspect the standalone export, render the PDF with `scripts/render_pdf_check.ps1` or Poppler, then inspect the rendered manuscript page.
- **Journal submission**: read the target journal artwork rules if available, then check format, naming, fonts, line weights, raster resolution, color use, and separate-file deliverables.

## References To Load As Needed

- Read `references/figure-contract.md` when starting a new figure, rebuilding an existing figure, or resolving ambiguous file paths and deliverables.
- Read `references/art-direction-contract.md` when creating, rebuilding, or visually upgrading a figure, especially if the user asks for a more polished, detailed, high-impact, Nature-style, or less "scripted" look.
- Read `references/mechanism-figure-style-rubric.md` before approving a mechanism/process figure or diagnosing why it looks crude.
- Read `references/illustrator-scripting-quick-reference.md` before writing or debugging Illustrator JSX/COM automation.
- Read `references/scripted-layout-and-qa.md` before scripting figures with repeated panels, many labels, arrows, callouts, formulas, or any prior overlap issues.
- Read `references/local-component-library-option.md` when the work may reuse domain-specific components across multiple figures or when the user asks for reusable components.
- Read `references/windows-illustrator-automation.md` when running Illustrator from PowerShell, handling UTF-8/non-ASCII labels, or rendering PDF QA images on Windows.
- Read `references/sketch-to-vector-workflow.md` when the user wants to generate a rough hand-drawn mechanism image and then trace/redraw it locally before Illustrator assembly, and whenever the figure's main risk is visual polish rather than only layout correctness.
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

2. Define the art direction before drawing.
   - Use `references/art-direction-contract.md` to choose the visual class, finish level, detail density, component realism, line language, and color strategy.
   - Make an explicit route decision: `sketch-to-vector`, `component-reference-to-vector`, or `vector-first`.
   - Choose `sketch-to-vector` by default for polished mechanism figures, hero graphical abstracts, figures with no nearby style reference, or any revision responding to "ugly", "not refined", "too scripted", "flat", or "missing detail".
   - Choose `component-reference-to-vector` when the layout is already known but individual objects lack credible silhouettes, material cues, or domain detail.
   - Choose `vector-first` only when the desired output is a simple deterministic schematic, an existing figure must be reproduced exactly, or image generation is unavailable and the user accepts a lower aesthetic ceiling.
   - Decide whether the figure is a one-off custom redraw or part of a project that benefits from a local component library.
   - For one-off figures, do not create a component library. Draw the needed parts directly in the figure asset folder.
   - For repeated domain components across a paper/project, ask the user whether to scaffold a project-local component library.
   - If the target look is unclear, choose a conservative `journal schematic` or `technical illustration` style and keep it editable.

3. Plan the scientific story.
   - Define the scientific story in 3--6 nodes, for example `source inspiration -> engineering abstraction -> design translation -> modeling workflow`.
   - Decide which nodes need literal visual components, such as specimens, devices, materials, environments, instruments, organisms, interfaces, or hardware.
   - Decide which nodes should remain pure vector boxes, arrows, formulas, or labels.
   - Sketch the panel structure, reading order, and arrow topology before creating any image component.

4. Generate or source components conservatively.
   - Use generated images only as rough sketches, source components, or style references, not as the final figure.
   - For a `sketch-to-vector` route, generate 2--4 unlabeled GPT-image/GPT-image2 whole-figure blueprint variations before scripting the final Illustrator figure. Pick one visual direction and redraw it; do not average all variations into a generic layout.
   - If a whole-figure prompt grows long or contains too many constraints, split it into short role-specific prompts: one overall composition blueprint plus isolated component/detail prompts. Generate the composition first, then generate only the component references needed to improve silhouettes, material cues, or insets.
   - A whole-figure rough sketch is acceptable as a redraw blueprint if it has no final text, labels, formulas, logos, signatures, borders, or visible watermarks.
   - Prompt for isolated components on a plain background with no text, labels, logos, signatures, borders, visible watermarks, or decorative framing.
   - Specify the required view, object count, perspective, anatomy/geometry constraints, and manuscript-compatible line style.
   - Generate separate components when possible. It is easier to redraw a clean object, specimen, setup, or material region than to repair a complete AI-generated diagram.
   - Keep prompts, source images, cleaned images, and redraw outputs in a named asset folder so figure provenance can be audited.

5. Convert components locally.
   - Remove plain backgrounds, crop whitespace, and simplify tonal detail before importing into Illustrator.
   - Prefer local redraw, Illustrator Image Trace, Inkscape/Potrace tracing, or controlled code-based line-art conversion over using raw generated bitmaps in the final manuscript figure.
   - Use `scripts/raster_to_svg_trace.py` for clean high-contrast line-art drafts when a Potrace-based SVG trace is useful.
   - Reduce fur, texture, and shading detail until the core structure is readable at final figure size.
   - If a generated image contains watermark-like artifacts, signatures, stray text, wrong object counts, or confusing silhouettes, reject and regenerate or redraw it manually.
   - Do not use third-party watermarked images, and do not attempt to strip hidden provenance metadata from generated assets.
   - Save cleaned intermediates with explicit names such as `component_device_clean.png`, `component_device_lineart.svg`, and `component_device_redraw.ai`.

6. Preserve and organize the master.
   - Never run a script that opens, saves, or closes the user's source `.ai` unless they explicitly ask for edits.
   - For export-only tasks, copy the AI to a temporary sibling file and open that temporary file in Illustrator.
   - For new scripted figures, start from `scripts/mechanism_figure_template.jsx` when a vector mechanism/process layout is useful.
   - If the route is `sketch-to-vector`, place the selected rough sketch on a locked, low-opacity reference layer or keep it as an external redraw guide. The final exported artwork should be recreated with editable paths, fills, labels, arrows, and formula assets.
   - Do not let raw generated reference PNGs leak into final PDF/PNG exports. Illustrator may embed hidden placed rasters into PDFs. Prefer keeping generated references external; if references are placed in the AI master, save the master first, then remove or delete the reference layer before exporting manuscript PDF/PNG.
   - When writing JSX, use the bundled Illustrator quick reference instead of assuming DOM signatures from memory.
   - When labels, arrows, or boxes may collide, add `// layout-helpers: true`, register object bounds with `FigureLayout.Registry`, and fail before export if text overlaps arrows or leaves its parent box.
   - When the figure needs a more polished technical-illustration finish, add `// technical-style: true` and use `TechnicalFigureStyle` for neutral palettes, line hierarchy, material bands, hatching, and semantic state colors.
   - Use semantic layers such as `01_panel_a_source`, `02_mechanism`, `04_workflow`, and `05_formula_assets`.
   - Draw boxes, arrows, labels, callouts, and panel labels as Illustrator objects.
   - Place cleaned raster or vectorized image components on locked reference layers, then redraw important outlines as editable paths when publication quality or future editing matters.

7. Handle formulas as assets.
   - Prefer user-provided MathType EPS/PDF formula assets when exact MathType appearance is required.
   - Use LaTeX-generated EPS/PDF formula assets as stable fallbacks when MathType automation is unreliable.
   - Create a formula inventory before placing formulas so source files, PDF/EPS exports, target panels, and size notes stay linked.
   - Avoid visible code-style text such as `rho_b` or `C_sh` unless the user accepts it.
   - Keep formula assets in clearly named folders such as `formulas_mathtype_pdf/`, `formulas_mathtype_eps/`, or `formulas_pdf/`.
   - Place formulas as linked or embedded PDF/EPS assets in Illustrator, align them visually with surrounding labels, and keep the original formula source next to the exported asset.

8. Match manuscript style and art direction.
   - Use the same visible font family as the paper's other figures, typically Times New Roman for labels.
   - Determine final figure width first; judge font size, line weight, and spacing at that final size.
   - Use restrained colors already present in the paper or project. Avoid color-only encoding; combine color with labels, shape, line style, or position.
   - Keep panel labels `(a)`, `(b)`, etc. consistent in size, weight, and placement.
   - Avoid decorative effects that will not reproduce well in a journal PDF.
   - When a user-corrected figure exists, inspect it first and treat its arrow routing, label placement, and box typography as the style source.
   - Use the style rubric to catch figures that are clean but visually flat: weak hierarchy, generic geometry, missing material cues, or overly loud arrows.

9. Follow flowchart layout conventions.
   - Draw arrows as clean Illustrator stroked paths with filled arrowheads, not as decorative shapes.
   - Use straight or orthogonal routes for workflow links, with arrow tips meeting the midpoint of the target box edge or object boundary.
   - Keep arrowheads and shafts outside text areas. Leave a small visual gap from box borders unless the arrow is intentionally connected to that border.
   - Center arrow labels along their associated arrow path, offset enough that they do not collide with arrowheads, formulas, or panel artwork.
   - For every colored or outlined workflow box, place the text or formula group at the geometric center of the box.
   - If centered text does not fit comfortably, enlarge the box or split the label into balanced lines. Do not shrink fonts below the surrounding figure's readable scale just to force a label into place.
   - In scripted figures, measure text after font assignment and register bounds before choosing adjacent label or arrow positions.

10. Export deliverables.
   - Export a vector PDF for LaTeX and submission.
   - Optionally export PNG for preview and TIFF for journal upload, but keep PDF as the LaTeX source unless the paper workflow requires another format.
   - Keep a separate review copy such as `Figure_N_export_check.pdf` when useful, then copy it to `Figure_N.pdf` only after visual QA.

11. Prepare user handoff for manual Illustrator fine-tuning.
   - Keep the editable `.ai` master, formula source assets, cleaned/redrawn components, preview PNG, and exported PDF together.
   - Leave only actionable manual edits for the user, such as final label nudges, formula baseline alignment, arrow rerouting, or style choices that require judgment.
   - Do not present raw generated images as final publishable artwork.

12. Validate.
   - Run `scripts/preflight_figure_assets.py path/to/main.tex` when a LaTeX source is available.
   - Compile with a non-conflicting job name when the main PDF may be open:
     `latexmk -pdf -interaction=nonstopmode -halt-on-error -jobname=main_check main.tex`
   - Render the standalone PDF with `scripts/render_pdf_check.ps1`, `pdftoppm`, `pdftocairo`, or an equivalent PDF renderer and inspect it visually.
   - Render the page containing the figure after manuscript compilation when a `.tex` source is available.
   - For scripted figures, run internal layout QA before export by checking parent containment, text-arrow overlap, title/panel margins, and artboard containment.
   - Run visual-polish QA with `references/mechanism-figure-style-rubric.md` when the figure is a mechanism/process diagram.
   - For aesthetic-first routes, confirm that the final figure can be traced back to an intentional generated or user-provided visual reference, and that the reference did not leak into the final export as a raw low-quality bitmap.
   - Check derived PDF file size when generated references were used; an unexpectedly large vector PDF can indicate hidden raster references were embedded.
   - Check that text is readable, formulas render, panel labels match the caption, no element is clipped, arrows attach cleanly, and text/formulas sit centered inside their boxes.
   - Run the paper figure checker when available. On Windows, set `PYTHONIOENCODING=utf-8` if a script fails only while printing Unicode status icons.

## Illustrator Automation Scripts

Use `scripts/run_illustrator_jsx.ps1` to execute new or rebuilt figure scripts on Windows:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass `
  -File .\scripts\run_illustrator_jsx.ps1 `
  -JsxPath path\to\build_figure.jsx
```

Prefer this runner over raw `DoJavaScriptFile(path)`. It reads the JSX as UTF-8 and calls `DoJavaScript(text)`, which avoids common COM path/encoding failures.

Use `scripts/mechanism_figure_template.jsx` as a starting point for vector-first mechanism or workflow diagrams. Adapt the output paths, scientific story, layer names, colors, and geometry before running it. Keep final text, arrows, panels, and mechanism parts editable as Illustrator objects.

For scripts with many labels or arrows, add `// layout-helpers: true` and use `FigureLayout.Registry` from `scripts/layout_helpers.jsx`. The runner injects the helper automatically, so the figure script can measure text, place labels relative to object bounds, nudge labels away from obstacles, and throw a clear layout QA error before exporting.

For a more refined technical-illustration finish, add `// technical-style: true` and use `TechnicalFigureStyle` from `scripts/technical_illustration_style.jsx`. It provides generic palettes, line weights, rounded technical boxes, material bands, hatching, callout dots, and semantic state colors without creating a domain-specific component library.

## Optional Component Library Script

Use `scripts/init_local_component_library.py` only when the user chooses to create a project-local reusable component set:

```bash
python scripts/init_local_component_library.py path/to/project-or-figure-folder --domain internal-combustion-engine
```

This creates a local `figure_components/<domain>-components/` folder with source, cleaned, traced, AI, export, and manifest locations. Do not create this for every one-off figure.

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

## PDF Render QA Script

Use `scripts/render_pdf_check.ps1` to render a standalone figure PDF to PNG for visual inspection:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass `
  -File .\scripts\render_pdf_check.ps1 `
  -PdfPath path\to\figures\Figure_1.pdf `
  -OutputPrefix path\to\figures\tmp\Figure_1_check `
  -Dpi 220
```

Inspect the PNG before approving or publishing the figure. Confirm labels do not collide with arrows, boxes, formulas, or panel boundaries.

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
- Illustrator COM `DoJavaScriptFile(path)` may fail with `JavaScript code was missing`. Use `scripts/run_illustrator_jsx.ps1` or `DoJavaScript(text)`.
- `//@charset "UTF-8"` can trigger a syntax error when JSX is sent through COM. Keep source UTF-8 and remove that directive.
- Non-ASCII labels can display incorrectly in terminals even when the exported art is correct. Verify the rendered PNG/PDF, and use JavaScript `\uXXXX` escapes if the shell corrupts source text.
- Illustrator COM SVG export can crash when the document contains placed formula/raster assets. Do not make SVG mandatory.
- Word/MathType batch export may hang on hidden dialogs. Clean up background `WINWORD`, `MathType`, or `MathTypeLib` processes only when they were started by the current automation and are visibly stalled.
- Exported page previews can look good while the compiled LaTeX figure is too small. Always render the compiled manuscript page, not only the standalone figure.
- Do not overwrite user-edited `.ai` files. Derived files are replaceable; the AI master is not.
