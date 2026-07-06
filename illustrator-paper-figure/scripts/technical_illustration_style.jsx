/*
Generic technical-illustration style tokens and drawing helpers.

Use with scripts/run_illustrator_jsx.ps1 and add this marker to a figure script:
// technical-style: true

This is deliberately domain-neutral. It improves finish through consistent
palette, line hierarchy, hatching, highlights, and soft material cues without
creating a domain-specific component library.
*/

var TechnicalFigureStyle = (function () {
    function rgb(r, g, b) {
        var c = new RGBColor();
        c.red = r;
        c.green = g;
        c.blue = b;
        return c;
    }

    function style(item, fill, stroke, width, opacity) {
        item.filled = !!fill;
        if (fill) item.fillColor = fill;
        item.stroked = !!stroke;
        if (stroke) item.strokeColor = stroke;
        if (stroke && width !== undefined) item.strokeWidth = width;
        if (opacity !== undefined) item.opacity = opacity;
        try {
            item.strokeJoin = StrokeJoin.ROUNDENDJOIN;
            item.strokeCap = StrokeCap.ROUNDENDCAP;
        }
        catch (e) {}
        return item;
    }

    var colors = {
        ink: rgb(34, 38, 42),
        label: rgb(45, 52, 58),
        muted: rgb(114, 124, 133),
        hairline: rgb(180, 188, 196),
        panel: rgb(247, 248, 249),
        metal0: rgb(245, 247, 248),
        metal1: rgb(222, 227, 232),
        metal2: rgb(171, 181, 190),
        metal3: rgb(95, 106, 116),
        blue: rgb(45, 122, 190),
        blueSoft: rgb(220, 237, 250),
        orange: rgb(226, 122, 42),
        orangeSoft: rgb(255, 229, 194),
        red: rgb(198, 74, 60),
        redSoft: rgb(252, 226, 222),
        green: rgb(67, 142, 94),
        greenSoft: rgb(221, 239, 226),
        violet: rgb(106, 99, 170),
        violetSoft: rgb(230, 228, 247),
        white: rgb(255, 255, 255)
    };

    var lines = {
        hairline: 0.35,
        detail: 0.5,
        standard: 0.75,
        outline: 1.05,
        emphasis: 1.35,
        arrow: 0.95
    };

    var radii = {
        small: 2,
        medium: 4,
        large: 7
    };

    function drawPath(layer, points, closed, fill, stroke, width, opacity, name) {
        var p = layer.pathItems.add();
        p.setEntirePath(points);
        p.closed = !!closed;
        if (name) p.name = name;
        return style(p, fill, stroke, width, opacity);
    }

    function roundedRect(layer, x, y, w, h, fill, stroke, width, radius, name) {
        var item = layer.pathItems.roundedRectangle(y + h, x, w, h, radius || radii.medium, radius || radii.medium);
        if (name) item.name = name;
        return style(item, fill, stroke, width || lines.standard);
    }

    function materialBand(layer, x, y, w, h, fill, stroke, name) {
        var base = roundedRect(layer, x, y, w, h, fill, stroke || colors.metal3, lines.outline, radii.medium, name ? name + "_base" : "");
        var hi = layer.pathItems.roundedRectangle(y + h - 4, x + 5, w - 10, Math.max(5, h * 0.18), radii.small, radii.small);
        style(hi, colors.white, null, 0, 28);
        if (name) hi.name = name + "_highlight";
        var shade = layer.pathItems.roundedRectangle(y + 8, x + 5, w - 10, Math.max(4, h * 0.13), radii.small, radii.small);
        style(shade, colors.metal3, null, 0, 10);
        if (name) shade.name = name + "_shade";
        return [base, hi, shade];
    }

    function hatchRect(layer, x, y, w, h, spacing, angle, color, width, name) {
        spacing = spacing || 8;
        angle = angle || -45;
        var items = [];
        var rad = angle * Math.PI / 180;
        var dx = Math.cos(rad);
        var dy = Math.sin(rad);
        var len = Math.sqrt(w * w + h * h) * 1.4;
        var count = Math.ceil((w + h) / spacing) + 2;
        for (var i = -count; i <= count; i++) {
            var cx = x + w / 2 + i * spacing;
            var cy = y + h / 2;
            var p = drawPath(layer, [
                [cx - dx * len / 2, cy - dy * len / 2],
                [cx + dx * len / 2, cy + dy * len / 2]
            ], false, null, color || colors.hairline, width || lines.hairline, 55, name ? name + "_" + i : "");
            items.push(p);
        }
        return items;
    }

    function calloutDot(layer, cx, cy, r, fill, stroke, name) {
        var item = layer.pathItems.ellipse(cy + r, cx - r, r * 2, r * 2);
        if (name) item.name = name;
        return style(item, fill || colors.white, stroke || colors.ink, lines.detail);
    }

    function statePalette(state) {
        if (state === "inlet" || state === "cool" || state === "fluid") return { fill: colors.blueSoft, stroke: colors.blue };
        if (state === "heat" || state === "reaction" || state === "pressure") return { fill: colors.orangeSoft, stroke: colors.orange };
        if (state === "exhaust" || state === "loss") return { fill: colors.redSoft, stroke: colors.red };
        if (state === "output" || state === "work") return { fill: colors.greenSoft, stroke: colors.green };
        if (state === "model" || state === "signal") return { fill: colors.violetSoft, stroke: colors.violet };
        return { fill: colors.metal0, stroke: colors.metal3 };
    }

    return {
        colors: colors,
        lines: lines,
        radii: radii,
        rgb: rgb,
        style: style,
        drawPath: drawPath,
        roundedRect: roundedRect,
        materialBand: materialBand,
        hatchRect: hatchRect,
        calloutDot: calloutDot,
        statePalette: statePalette
    };
})();
