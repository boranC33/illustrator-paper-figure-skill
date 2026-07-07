# Sketch To Vector Workflow

Use this workflow when the user wants to first create a rough GPT-image/GPT-image2 hand-drawn mechanism sketch, then recreate it locally as editable/vector artwork before Adobe Illustrator layout.

Also use this workflow by default when the user asks for a polished, refined, high-impact, Nature-style, graphical-abstract-like, or less "scripted" mechanism figure, or when a previous vector-first output was criticized as ugly, crude, flat, not detailed, or not refined. In those cases, visual ideation is not optional: a generated or user-provided visual reference is the route to a higher aesthetic ceiling.

## Principle

Treat the generated image as a visual brief, not a final asset. Do not remove a third-party watermark or strip provenance metadata. If the image has visible watermark-like marks, pseudo-signatures, text artifacts, or contaminated details, regenerate it or redraw the intended structure locally. The final figure should be assembled from editable Illustrator objects, locally traced/redrawn vector paths, and approved formula assets.

## Step 1: Mechanism Brief

Before writing an image prompt, define:

- scientific claim or mechanism the figure must communicate;
- objects, states, flows, interactions, and outputs that must appear;
- relationships that must be visually correct;
- items that must not appear because they would mislead readers;
- final format, such as single-column, double-column, multi-panel, or graphical abstract;
- style reference from existing manuscript figures, if available.
- aesthetic route decision and reason, especially why `sketch-to-vector` is being used or why it is intentionally skipped.

Do not skip the blueprint step merely because a deterministic JSX script is easier to write. Skip it only when the user asks for a simple schematic, an existing layout must be reproduced exactly, or image generation is unavailable and the user accepts the lower aesthetic ceiling.

## Step 2: Rough Whole-Figure Sketch Prompt

Use a whole-figure sketch only to get composition and visual rhythm. Keep labels and formulas out; add them later as editable Illustrator/MathType assets.

```text
Create a rough hand-drawn blueprint for a scientific mechanism figure.
Purpose: [one-sentence mechanism or workflow claim].
Layout: [single panel / multi-panel / left-to-right / top-to-bottom / circular / split before-after].
Visual elements: [objects, states, environment, process, outputs].
Required relationships: [contacts, transitions, flow direction implied by geometry, hierarchy, grouping].
Style: clean monochrome or lightly colored manuscript sketch, simple linework, minimal shading, high structural clarity.
Keep the drawing unlabeled. Do not include text, letters, arrows with labels, formulas, axes, numbers, logos, signatures, borders, visible watermarks, or decorative framing.
The image will be used only as a redraw blueprint. Final labels, arrows, formulas, and panel marks will be created manually in Adobe Illustrator.
```

Generate 2--4 variations when composition is uncertain or visual polish is the main objective. Select the best layout, then convert it into a redraw plan rather than trying to repair it as an image. Preserve the selected prompt and source image path in the figure asset folder.

When a single prompt becomes too long, split the generation into a small prompt set:

```text
01_overall_composition.txt       -> overall layout and visual rhythm
02_primary_object_component.txt  -> main device/specimen/body geometry
03_process_detail_inset.txt      -> local mechanism detail or magnified inset
04_output_or_boundary_component.txt -> output region, boundary, fins, outlet, detector, etc.
```

Keep each prompt short and single-purpose. Generate the overall composition first; only generate component references that will materially improve the final redraw. Save generated images with matching names such as `figure_blueprint_overall.png` and `component_primary_object.png`.

If GPT-image/GPT-image2 generation is unavailable in the current environment, write the exact prompt(s), report the missing capability or credential, and wait for either a user-supplied sketch/reference or permission to proceed with a vector-first fallback. Do not silently proceed as if the result will have the same polish.

## Step 3: Redraw Plan

Decompose the chosen sketch into:

- final Illustrator vector objects: boxes, arrows, axes, outlines, callouts, panels;
- traced/redrawn components: specimens, devices, materials, environments, icons, insets;
- formula assets: MathType EPS/PDF or LaTeX PDF/EPS;
- optional raster references: locked background guides that will not appear in the final export.

Make a layer plan before opening Illustrator:

```text
00_locked_reference_sketch
01_panel_a_objects
02_panel_a_arrows
03_panel_a_labels
04_formula_assets
90_guides_and_notes
```

## Step 4: Local Trace Or Redraw

Choose the least fragile method that preserves publication quality:

- **Manual Illustrator redraw**: best for mechanisms, arrows, labels, and clean technical figures.
- **Illustrator Image Trace**: useful for simple high-contrast line art; always expand and clean paths afterward.
- **Inkscape/Potrace tracing**: useful for black-and-white silhouettes or line art before importing SVG/PDF into Illustrator.
- **Code-based tracing**: useful when batch-processing clean raster components into SVG contours; inspect and simplify paths manually.
- **Hybrid redraw**: use local tracing for rough outlines, then replace important geometry with clean paths, primitives, and aligned text.

For clean line-art drafts, use:

```bash
python scripts/raster_to_svg_trace.py component_clean.png component_trace.svg --preview-png component_threshold.png
```

Do not keep noisy auto-traced paths if manual paths would be clearer. Simplify strokes, remove speckles, merge duplicate contours, close shapes intentionally, and use consistent stroke widths.

## Step 5: Illustrator Assembly

In Illustrator:

- place the rough sketch on a locked low-opacity reference layer, or keep generated references external and use them side-by-side while redrawing;
- redraw key shapes using paths, primitives, and semantic groups;
- add arrows as stroked paths with real arrowheads;
- add labels as editable text with the manuscript's figure font;
- place MathType or LaTeX formula PDF/EPS assets, not screenshot formulas;
- align formula baselines and label centers visually;
- keep panels, labels, arrows, components, and formulas on separate semantic layers.

Generated reference handling:

- Prefer external references when scripted export is the main deliverable.
- If generated PNG references are placed into the AI master, save the editable AI first, then remove the reference layer from the current document before exporting PDF/PNG.
- Do not trust hidden layers alone. Illustrator can still embed hidden placed rasters into PDFs, producing oversized files even when the bitmap is not visible.

## Step 6: Formula Handling

Prefer this order:

1. MathType-authored EPS/PDF from the user.
2. MathType-authored assets exported interactively.
3. LaTeX-generated PDF/EPS as a stable fallback.
4. Plain Illustrator text only for non-mathematical labels.

Keep source and export files together:

```text
formulas_source/
formulas_mathtype_pdf/
formulas_mathtype_eps/
formulas_latex_pdf/
```

Check every formula for notation consistency with the manuscript.

## Step 7: User Manual Fine-Tuning Handoff

When the figure is ready for user edits, provide:

- editable `.ai` master;
- final or review PDF export;
- preview PNG;
- formula source/export folder;
- cleaned/redrawn component folder;
- concise manual-tuning checklist.

Manual-tuning checklist:

- final label nudges and overlap fixes;
- arrow routing and arrowhead contact points;
- formula baseline and size alignment;
- panel-label position;
- color/style preference;
- final crop/artboard check.

## Step 8: Approval QA

Before approving the figure:

- inspect the standalone PDF and compiled manuscript page;
- confirm no raw generated sketch appears as final art unless explicitly accepted;
- confirm no visible watermark-like artifacts, pseudo-signatures, or stray text remain;
- confirm the exported PDF file size is plausible for a mostly vector figure; investigate very large PDFs for hidden placed references;
- confirm text is readable at final scale;
- confirm formulas, labels, and arrows are editable or traceable to source assets;
- confirm journal file requirements are met.
