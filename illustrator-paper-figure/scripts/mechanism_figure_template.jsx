#target illustrator
// layout-helpers: true
// technical-style: true

/*
Adapt this template for new vector-first mechanism/process figures.
Run with scripts/run_illustrator_jsx.ps1 so layout_helpers.jsx is injected.

The template demonstrates the preferred workflow:
1. Draw semantic objects.
2. Center text after Illustrator measures it.
3. Register object bounds.
4. Run layout QA before exporting.
*/

(function () {
    if (typeof FigureLayout === "undefined") {
        throw new Error("FigureLayout is not loaded. Run this file with run_illustrator_jsx.ps1.");
    }
    if (typeof TechnicalFigureStyle === "undefined") {
        throw new Error("TechnicalFigureStyle is not loaded. Run this file with run_illustrator_jsx.ps1.");
    }

    app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

    var OUT_DIR = "C:/tmp/illustrator-paper-figure-output";
    var NAME = "Figure_1_mechanism";
    var mm = 2.8346456693;
    var W = 180 * mm;
    var H = 110 * mm;
    var ARTBOARD = [0, H, W, 0];

    var folder = new Folder(OUT_DIR);
    if (!folder.exists) folder.create();

    var doc = app.documents.add(DocumentColorSpace.RGB, W, H);
    doc.rulerOrigin = [0, 0];
    doc.pageOrigin = [0, 0];
    doc.artboards[0].artboardRect = ARTBOARD;

    var TS = TechnicalFigureStyle;
    var C = TS.colors;
    var LINE = TS.lines;

    function fontByNames(names) {
        for (var i = 0; i < names.length; i++) {
            try {
                return app.textFonts.getByName(names[i]);
            }
            catch (e) {}
        }
        return null;
    }

    var FONT_REG = fontByNames(["ArialMT", "Helvetica", "TimesNewRomanPSMT"]);
    var FONT_BOLD = fontByNames(["Arial-BoldMT", "Helvetica-Bold", "TimesNewRomanPS-BoldMT"]) || FONT_REG;

    function layer(name) {
        var l = doc.layers.add();
        l.name = name;
        return l;
    }

    doc.layers[0].name = "00_background";
    var L_BG = doc.layers[0];
    var L_ART = layer("01_vector_mechanism");
    var L_FLOW = layer("02_workflow_arrows");
    var L_TEXT = layer("03_labels_annotations");

    var qa = new FigureLayout.Registry("mechanism_figure_template");

    function style(item, fill, stroke, width) {
        item.filled = !!fill;
        if (fill) item.fillColor = fill;
        item.stroked = !!stroke;
        if (stroke) item.strokeColor = stroke;
        if (stroke) item.strokeWidth = width || LINE.standard;
        try {
            item.strokeJoin = StrokeJoin.ROUNDENDJOIN;
            item.strokeCap = StrokeCap.ROUNDENDCAP;
        }
        catch (e) {}
        return item;
    }

    function rect(l, x, y, w, h, fill, stroke, width, radius, name) {
        var item = radius ?
            l.pathItems.roundedRectangle(y + h, x, w, h, radius, radius) :
            l.pathItems.rectangle(y + h, x, w, h);
        if (name) item.name = name;
        return style(item, fill, stroke, width);
    }

    function path(l, points, closed, fill, stroke, width, name) {
        var p = l.pathItems.add();
        p.setEntirePath(points);
        p.closed = !!closed;
        if (name) p.name = name;
        return style(p, fill, stroke, width);
    }

    function triangle(l, tip, angle, len, width, fill, name) {
        var ux = Math.cos(angle), uy = Math.sin(angle);
        var nx = -uy, ny = ux;
        var bx = tip[0] - ux * len, by = tip[1] - uy * len;
        return path(l, [
            [tip[0], tip[1]],
            [bx + nx * width / 2, by + ny * width / 2],
            [bx - nx * width / 2, by - ny * width / 2]
        ], true, fill, fill, 0.2, name);
    }

    function arrow(l, x1, y1, x2, y2, color, width, name) {
        var a = Math.atan2(y2 - y1, x2 - x1);
        var headLen = 7, headWidth = 5;
        var shaft = path(l, [[x1, y1], [x2 - Math.cos(a) * headLen, y2 - Math.sin(a) * headLen]], false, null, color, width || 1, name + "_shaft");
        var head = triangle(l, [x2, y2], a, headLen, headWidth, color, name + "_head");
        return FigureLayout.unionItems([shaft, head]);
    }

    function setText(tf, size, color, bold, align) {
        var tr = tf.textRange;
        tr.characterAttributes.size = size;
        tr.characterAttributes.fillColor = color || C.ink;
        if (bold && FONT_BOLD) tr.characterAttributes.textFont = FONT_BOLD;
        if (!bold && FONT_REG) tr.characterAttributes.textFont = FONT_REG;
        tr.paragraphAttributes.justification = align || Justification.LEFT;
    }

    function textCenter(l, content, cx, cy, size, color, bold, name) {
        var tf = l.textFrames.add();
        tf.contents = content;
        if (name) tf.name = name;
        setText(tf, size, color, bold, Justification.CENTER);
        tf.position = [cx, cy];
        FigureLayout.centerTextFrame(tf, cx, cy);
        return tf;
    }

    function textLeft(l, content, x, yTop, size, color, bold, name) {
        var tf = l.textFrames.add();
        tf.contents = content;
        if (name) tf.name = name;
        setText(tf, size, color, bold, Justification.LEFT);
        tf.position = [x, yTop];
        app.redraw();
        return tf;
    }

    rect(L_BG, 0, 0, W, H, C.white, null, 0, 0, "white_background");

    var title = textCenter(L_TEXT, "Mechanism figure title", W / 2, H - 18, 11, C.ink, true, "title");
    qa.add("title", title, "text title");

    var panel = rect(L_BG, 22, 62, W - 44, 184, C.panel, C.hairline, LINE.hairline, 5, "panel_boundary");
    qa.add("panel_boundary", panel, "panel");

    var y = 145;
    var boxW = 105;
    var boxH = 42;
    var xs = [40, 200, 360];
    var labels = ["Input / source", "Mechanism", "Output"];
    var fills = [C.blueSoft, C.orangeSoft, C.greenSoft];
    var strokes = [C.blue, C.orange, C.green];

    for (var i = 0; i < xs.length; i++) {
        var boxName = "box_" + (i + 1);
        var labelName = "label_" + (i + 1);
        var boxParts = TS.materialBand(L_ART, xs[i], y, boxW, boxH, fills[i], strokes[i], boxName);
        var box = boxParts[0];
        qa.add(boxName, box, "box");

        var label = textCenter(L_TEXT, labels[i], xs[i] + boxW / 2, y + boxH / 2, 8, C.ink, false, labelName);
        qa.add(labelName, label, "text box_label");
        qa.requireInside(boxName, labelName, 5);

        if (i < xs.length - 1) {
            var arrowBounds = arrow(L_FLOW, xs[i] + boxW + 10, y + boxH / 2, xs[i + 1] - 10, y + boxH / 2, C.muted, LINE.arrow, "arrow_" + (i + 1));
            qa.addBounds("arrow_" + (i + 1), arrowBounds, "arrow");
        }
    }

    var panelLabel = textLeft(L_TEXT, "(a)", 24, H - 36, 10, C.ink, true, "panel_label_a");
    qa.add("panel_label_a", panelLabel, "text panel_label");

    var note = textLeft(L_TEXT, "Replace this template with domain-specific vector geometry.", 40, 88, 7.2, C.muted, false, "template_note");
    qa.add("template_note", note, "text note");

    qa.requireNoOverlap("title", "box", 12);
    qa.requireNoOverlap("text", "arrow", 2);
    qa.requireInsideBounds("title", ARTBOARD, 6);
    qa.requireInsideBounds("template_note", ARTBOARD, 6);
    qa.throwIfErrors();

    var aiOptions = new IllustratorSaveOptions();
    aiOptions.compatibility = Compatibility.ILLUSTRATOR24;
    aiOptions.pdfCompatible = true;
    doc.saveAs(new File(OUT_DIR + "/" + NAME + "_master.ai"), aiOptions);

    var pngOptions = new ExportOptionsPNG24();
    pngOptions.artBoardClipping = true;
    pngOptions.transparency = false;
    pngOptions.horizontalScale = 300;
    pngOptions.verticalScale = 300;
    doc.exportFile(new File(OUT_DIR + "/" + NAME + "_preview.png"), ExportType.PNG24, pngOptions);

    var pdfOptions = new PDFSaveOptions();
    pdfOptions.compatibility = PDFCompatibility.ACROBAT7;
    pdfOptions.preserveEditability = false;
    doc.saveAs(new File(OUT_DIR + "/" + NAME + ".pdf"), pdfOptions);

    doc.close(SaveOptions.DONOTSAVECHANGES);
    app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
})();
