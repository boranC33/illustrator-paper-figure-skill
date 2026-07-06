# Figure Style Specification

Use this reference when drawing, redrawing, or QAing manuscript figures. Adapt exact values to the target journal, but keep readability at final printed size as the governing rule.

## Establish Final Size First

- Single-column figures: usually about 80--90 mm wide.
- Double-column figures: usually about 160--180 mm wide.
- Full-page or graphical abstract figures: use the journal's exact limit.
- Set the Illustrator artboard to the intended final aspect ratio before detailed alignment.
- Check the figure at 100% final size, not only zoomed in.

## Typography

Recommended final-size ranges:

- Main labels: 7--9 pt.
- Panel labels `(a)`, `(b)`: 8--10 pt, often bold.
- Axis tick labels or compact annotations: 6.5--8 pt.
- Figure-internal headings: 8--10 pt, only when needed.
- Avoid text below 6 pt at final size unless the journal explicitly permits it.

Typography rules:

- Match the manuscript or nearby figures where practical, often Times New Roman, Arial, Helvetica, or the journal template font.
- Use one primary font family and at most one secondary technical font.
- Keep letter spacing normal.
- Center text inside boxes geometrically.
- Use balanced line breaks rather than shrinking text aggressively.
- Keep at least one text-height of clearance from arrows, borders, and neighboring labels when possible.

## Lines, Arrows, And Shapes

Recommended final-size ranges:

- Thin internal lines: 0.35--0.5 pt.
- Standard outlines and arrows: 0.6--0.9 pt.
- Emphasis outlines: 1.0--1.2 pt.
- Avoid hairlines below 0.25 pt.

Arrow rules:

- Use stroked paths with real arrowheads.
- Keep arrowhead size proportional to stroke width and target object scale.
- Use straight or orthogonal routes for process flow unless curved arrows express a physical motion.
- Terminate arrows at clear target boundaries or intentional points.
- Keep arrow shafts and heads outside text areas.

Shape rules:

- Align repeated boxes to a grid.
- Use consistent corner radius, if any.
- Keep panel gutters visually even.
- Avoid decorative shadows, glows, bevels, or 3D effects unless they communicate data or structure.

## Color

- Use restrained color accents, not a full decorative palette.
- Avoid encoding meaning by color alone; pair color with label, position, line style, or shape.
- Check grayscale readability.
- Use high contrast for labels and arrows.
- Avoid saturated colors behind small black text.
- Keep colors consistent across figures in the same manuscript.

## Formula Placement

- Use MathType or LaTeX PDF/EPS assets for mathematical expressions.
- Match formula size to neighboring label x-height.
- Align formula baselines with adjacent text.
- Keep formula bounding boxes tight enough for visual alignment but not clipped.
- Do not paste screenshot formulas into final artwork.
- Keep variables and notation consistent with the manuscript.

## Panel Layout

- Panel labels must match caption order.
- Put panel labels in consistent positions, usually upper-left inside or just outside each panel.
- Keep related panels aligned by content edges, not only artboard edges.
- Use consistent scale bars or state explicitly when scales differ.
- Keep enough whitespace for journal compression and PDF rendering.

## Export Checks

- Inspect both the standalone export and the compiled manuscript page.
- Confirm no text is clipped, substituted, or rasterized unexpectedly.
- Confirm thin lines survive at final size.
- Confirm all visible labels are intentional and spelled correctly.
- Confirm the final PDF bounding box matches the artboard/crop intended for LaTeX.
