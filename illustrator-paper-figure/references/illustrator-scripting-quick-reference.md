# Illustrator Scripting Quick Reference

Load this when creating or debugging Illustrator JSX/COM automation. This skill includes the needed Illustrator scripting basics so it does not depend on a separate `adobe-illustrator-scripting` skill.

## Execution

- Write Illustrator automation as ExtendScript-compatible JavaScript (`.jsx`).
- Start standalone scripts with `#target illustrator` when the file may be run from Illustrator or ExtendScript hosts.
- For Windows COM automation, prefer reading the JSX as UTF-8 text and calling `Application.DoJavaScript(text)`.
- Avoid relying on `DoJavaScriptFile(path)`; it can report `JavaScript code was missing` in some COM sessions.
- Avoid `//@charset "UTF-8"` when the script is sent through `DoJavaScript(text)`; Illustrator can treat it as a syntax error.

## Coordinate System

- Illustrator scripting uses points. `1 mm = 2.8346456693 pt`; `1 in = 72 pt`.
- Script-created documents usually have origin at the bottom-left.
- `pathItems.rectangle(top, left, width, height)` uses top-left style parameters.
- `TextFrame.position` is the top-left of the text frame bounds.
- Page item bounds are `[left, top, right, bottom]`.

## Core Objects

- `app`: Illustrator application.
- `app.documents.add(DocumentColorSpace.RGB, width, height)`: create a document.
- `doc.layers.add()`: create a layer.
- `layer.pathItems.rectangle(top, left, width, height)`: rectangle.
- `layer.pathItems.roundedRectangle(top, left, width, height, hRadius, vRadius)`: rounded rectangle.
- `layer.pathItems.ellipse(top, left, width, height)`: ellipse.
- `layer.pathItems.add().setEntirePath([[x, y], ...])`: freeform path.
- `doc.textFrames.add()`: point text.
- `doc.saveAs(new File(path), options)`: save AI or PDF depending on options.
- `doc.exportFile(new File(path), ExportType.PNG24, options)`: export PNG.

## Colors

Use explicit color constructors:

```javascript
function rgb(r, g, b) {
    var c = new RGBColor();
    c.red = r;
    c.green = g;
    c.blue = b;
    return c;
}
```

Set paths with `filled`, `fillColor`, `stroked`, `strokeColor`, and `strokeWidth`. Use `NoColor` only when the API requires a color object; otherwise set `filled = false` or `stroked = false`.

## Text

For reliable centered labels:

1. Create a point text frame.
2. Set contents, font, size, color, and paragraph justification.
3. Place roughly at the target center.
4. Call `app.redraw()`.
5. Read `visibleBounds`, compute the current center, and translate to the target center.

Use font fallback lists. On multilingual figures, test `MicrosoftYaHei`, `MicrosoftYaHeiUI`, `SimSun`, `ArialMT`, and `TimesNewRomanPSMT` rather than assuming one font exists.

## Layout Helpers

For mechanism/process figures with several labels, arrows, and panels, add this marker:

```javascript
// layout-helpers: true
```

Then run the file through `scripts/run_illustrator_jsx.ps1`. The runner injects `scripts/layout_helpers.jsx`, which provides `FigureLayout.centerTextFrame`, `FigureLayout.placeItemRelative`, `FigureLayout.nudgeUntilClear`, and `FigureLayout.Registry`.

Use the registry to fail before export when text leaves its parent box, text overlaps arrowheads, or labels escape the artboard. This catches most coordinate mistakes before the PDF/PNG visual QA pass.

## Technical Illustration Style Tokens

For a more polished but still generic visual system, add:

```javascript
// technical-style: true
```

Then run the file through `scripts/run_illustrator_jsx.ps1`. The runner injects `scripts/technical_illustration_style.jsx`, which provides `TechnicalFigureStyle.colors`, `TechnicalFigureStyle.lines`, material bands, restrained state palettes, hatching helpers, and callout-dot helpers.

Use these tokens to create consistent line hierarchy and material/state cues. Do not treat them as a domain component library; they are generic visual primitives.

## Save And Export

```javascript
var aiOptions = new IllustratorSaveOptions();
aiOptions.compatibility = Compatibility.ILLUSTRATOR24;
aiOptions.pdfCompatible = true;
doc.saveAs(new File(aiPath), aiOptions);

var pdfOptions = new PDFSaveOptions();
pdfOptions.compatibility = PDFCompatibility.ACROBAT7;
pdfOptions.preserveEditability = false;
doc.saveAs(new File(pdfPath), pdfOptions);

var pngOptions = new ExportOptionsPNG24();
pngOptions.artBoardClipping = true;
pngOptions.transparency = false;
pngOptions.horizontalScale = 300;
pngOptions.verticalScale = 300;
doc.exportFile(new File(pngPath), ExportType.PNG24, pngOptions);
```

## Common Pitfalls

- Use forward slashes in file paths passed to JSX, or create `File` objects from escaped Windows paths.
- Restore `app.userInteractionLevel` after suppressing dialogs.
- Do not export SVG as a required deliverable when placed PDFs, formulas, or raster assets are present; Illustrator SVG export can be fragile.
- If labels look shifted after export, regenerate with stable text-centering helpers and inspect a rendered PDF, not only Illustrator's canvas.
