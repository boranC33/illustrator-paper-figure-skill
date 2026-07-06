# Scripted Layout And QA

Load this before writing or revising a scripted Illustrator mechanism/process figure that has many labels, arrows, boxes, callouts, or repeated panels.

## Goal

Reduce manual export-inspect-adjust loops by making layout scripts measure text and check bounds before exporting. Final rendered PDF/PNG inspection is still required, but the script should catch obvious collisions first.

## Use The Helper Library

Add this marker near the top of the JSX:

```javascript
// layout-helpers: true
```

Run the script with:

```powershell
powershell -NoProfile -ExecutionPolicy Bypass `
  -File path\to\scripts\run_illustrator_jsx.ps1 `
  -JsxPath path\to\build_figure.jsx
```

The runner injects `scripts/layout_helpers.jsx` before executing the figure script.

For a more refined technical-illustration style, add this marker as well:

```javascript
// technical-style: true
```

The runner injects generic style tokens and drawing helpers from `scripts/technical_illustration_style.jsx`.

## Recommended Pattern

Create a registry:

```javascript
var qa = new FigureLayout.Registry("figure_1_layout");
```

After drawing each important item, register it:

```javascript
var box = rect(layer, x, y, w, h, fill, stroke, 0.8, 5, "box_1");
qa.add("box_1", box, "box");

var label = textCenter(labelLayer, "Mechanism", x + w / 2, y + h / 2, 8, black, false, "label_1");
qa.add("label_1", label, "text box_label");
qa.requireInside("box_1", "label_1", 5);
```

For arrows made of multiple path items, register a union bounds:

```javascript
var arrowBounds = FigureLayout.unionItems([shaft, head]);
qa.addBounds("arrow_1", arrowBounds, "arrow");
```

Before export:

```javascript
qa.requireNoOverlap("text", "arrow", 2);
qa.requireNoOverlap("title", "box", 10);
qa.requireInsideBounds("title", [0, H, W, 0], 6);
qa.throwIfErrors();
```

## Text Placement Rules

- Create text at a rough position, set font/size/color, call `FigureLayout.centerTextFrame(tf, cx, cy)`, then register the text.
- For side labels, create the text and call `FigureLayout.placeItemRelative(tf, anchorBounds, "below", 6)` or `"above"`, `"left"`, `"right"`.
- If a label may collide with known obstacles, call `FigureLayout.nudgeUntilClear(label, obstacleBounds, "down", 2, 20, 2)` and register the final position.

## What To Check Automatically

- Box labels are inside their parent box with a margin.
- Panel labels and titles are inside the artboard.
- Text does not overlap arrows, arrowheads, formulas, or panel borders.
- Callout text is near but not on top of the target object.
- Repeated panels use consistent box sizes and label positions.

## What Still Needs Visual QA

- Font substitution and missing glyphs.
- PDF export differences from the Illustrator canvas.
- Whether arrow routing is scientifically clear.
- Whether the figure is readable at final manuscript scale.
- Aesthetic balance and domain-specific judgment.

The target is not to eliminate rendered QA. The target is to make the first export close enough that rendered QA usually needs only one final pass.
