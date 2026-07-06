# Figure QA Checklist

Use this checklist before publishing a derived figure asset to the manuscript path or before journal submission.

## Manuscript Integration

- The LaTeX source references the intended final file path.
- The compiled manuscript page, not only the standalone figure PDF, has been rendered and inspected.
- The figure is readable at final manuscript scale.
- The caption order matches panel labels and visual reading order.
- No element is clipped by the artboard, PDF bounding box, or LaTeX crop.

## Editability And Source Safety

- The `.ai` master remains the editable source and was not overwritten by export-only automation.
- Derived files are clearly named and replaceable.
- Layers are semantic enough for a future editor to find panels, labels, arrows, formulas, and components.
- Important lines, boxes, arrows, labels, and panel marks are editable Illustrator objects.
- Raster or generated components are either locked references or simplified enough for final use.
- The rough generated sketch is not visible in final artwork unless the user explicitly accepted it as a raster reference.
- No visible watermark-like marks, pseudo-signatures, or stray text from generated images remain in the exported figure.

## Typography

- Figure font matches nearby paper figures as closely as practical.
- Labels, panel letters, formulas, and callouts are consistent in size and weight.
- Box text is centered geometrically and split into balanced lines where needed.
- No text collides with arrowheads, box borders, panel artwork, formulas, or page margins.
- Mathematical notation matches manuscript notation; variables are not replaced by plain code-style text unless accepted.

## Geometry And Arrows

- Arrows are stroked paths with filled arrowheads.
- Arrow tips terminate at box edges, object boundaries, or intentional target points.
- Arrow labels are aligned to their associated arrows and do not float ambiguously.
- Mechanism components have correct object counts, orientation, and relation to the text.
- Repeated objects use consistent scale unless a scale change is intentional and clear.

## Visual Polish

- The figure follows an explicit art direction contract rather than defaulting to generic boxes and arrows.
- The primary mechanism or object is visually dominant without being overwhelmed by arrows or labels.
- Important components have domain-specific silhouettes, proportions, cutaways, hatching, material bands, or other meaningful detail.
- Line weights create hierarchy: outer contours, internal details, arrows, callouts, and hatching are not all the same weight.
- Colors use neutral structure plus semantic accents, not saturated decoration.
- Detail density supports the mechanism: enough to look credible, not enough to clutter the reading path.
- The figure does not look like default PowerPoint or a raw script output.

## Scripted Layout QA

- Text is measured after the final font and size are assigned, not positioned from guessed string length.
- Important objects are registered with semantic bounds: title, panel labels, boxes, formulas, arrows, callouts, and repeated panels.
- Box labels pass an inside-parent check with a visible margin.
- Text and formulas do not overlap arrow shafts or arrowheads in the internal layout registry.
- Titles, panel labels, legends, and captions remain inside the artboard bounds.
- Any automatic nudging is followed by re-registering the final bounds before export.
- The script fails before export when layout checks fail, rather than producing a known-bad PDF.

## Color And Accessibility

- Color palette is restrained and consistent with nearby figures.
- Meaning is not encoded by color alone.
- The figure remains understandable in grayscale or low-saturation preview.
- Contrast is sufficient for labels, arrows, and thin boundaries.
- Decorative shading does not obscure the scientific message.

## Export And Journal Readiness

- Preferred LaTeX source is vector PDF unless the workflow requires another format.
- Raster exports are at least 300 dpi for continuous-tone images, and higher when line art or text is rasterized.
- Fonts are embedded or converted according to the journal's instructions.
- Final assets use stable submission names such as `Figure_1.pdf`, `Figure_1.tif`, or the journal-required pattern.
- Third-party or generated components have acceptable provenance and no visible watermark-like artifacts.

## Manual Handoff

- Editable `.ai` master opens without missing linked assets.
- Formula source/export files are included near the `.ai` master.
- Preview PNG and review PDF reflect the current `.ai` state.
- Optional project-local component libraries include a manifest and are not silently created for one-off figures.
- Remaining manual edits are listed as specific actions, not vague requests to "polish the figure."

## Failure Response

If a check fails, fix the source or exported asset, then repeat the manuscript-page render. Do not approve a figure based only on the standalone exported PDF when the final use is inside a compiled paper.
