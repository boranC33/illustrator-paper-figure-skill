/*
Reusable Illustrator JSX layout helpers for scripted scientific figures.

Use with scripts/run_illustrator_jsx.ps1 and add this marker to a figure script:
// layout-helpers: true

The helpers are intentionally ES3-compatible for ExtendScript.
*/

var FigureLayout = (function () {
    function cloneBounds(b) {
        return [b[0], b[1], b[2], b[3]];
    }

    function boundsOf(item) {
        return cloneBounds(item.visibleBounds);
    }

    function boundsFromRect(x, y, w, h) {
        return [x, y + h, x + w, y];
    }

    function boundsFromPoints(points) {
        var left = points[0][0];
        var right = points[0][0];
        var top = points[0][1];
        var bottom = points[0][1];
        for (var i = 1; i < points.length; i++) {
            if (points[i][0] < left) left = points[i][0];
            if (points[i][0] > right) right = points[i][0];
            if (points[i][1] > top) top = points[i][1];
            if (points[i][1] < bottom) bottom = points[i][1];
        }
        return [left, top, right, bottom];
    }

    function unionBounds(boundsList) {
        var out = cloneBounds(boundsList[0]);
        for (var i = 1; i < boundsList.length; i++) {
            var b = boundsList[i];
            if (b[0] < out[0]) out[0] = b[0];
            if (b[1] > out[1]) out[1] = b[1];
            if (b[2] > out[2]) out[2] = b[2];
            if (b[3] < out[3]) out[3] = b[3];
        }
        return out;
    }

    function unionItems(items) {
        var boundsList = [];
        for (var i = 0; i < items.length; i++) {
            boundsList.push(boundsOf(items[i]));
        }
        return unionBounds(boundsList);
    }

    function inflateBounds(b, gap) {
        gap = gap || 0;
        return [b[0] - gap, b[1] + gap, b[2] + gap, b[3] - gap];
    }

    function centerX(b) {
        return (b[0] + b[2]) / 2;
    }

    function centerY(b) {
        return (b[1] + b[3]) / 2;
    }

    function width(b) {
        return b[2] - b[0];
    }

    function height(b) {
        return b[1] - b[3];
    }

    function intersects(a, b, gap) {
        gap = gap || 0;
        return !(
            a[2] + gap < b[0] ||
            b[2] + gap < a[0] ||
            a[3] - gap > b[1] ||
            b[3] - gap > a[1]
        );
    }

    function inside(parent, child, gap) {
        gap = gap || 0;
        return (
            child[0] >= parent[0] + gap &&
            child[2] <= parent[2] - gap &&
            child[1] <= parent[1] - gap &&
            child[3] >= parent[3] + gap
        );
    }

    function translateToCenter(item, x, y) {
        app.redraw();
        var b = boundsOf(item);
        item.translate(x - centerX(b), y - centerY(b));
        app.redraw();
        return boundsOf(item);
    }

    function centerTextFrame(tf, x, y) {
        return translateToCenter(tf, x, y);
    }

    function placeItemRelative(item, anchorBounds, side, margin) {
        margin = margin || 0;
        app.redraw();
        var b = boundsOf(item);
        var dx = 0;
        var dy = 0;
        if (side === "top" || side === "above") {
            dx = centerX(anchorBounds) - centerX(b);
            dy = (anchorBounds[1] + margin) - b[3];
        }
        else if (side === "bottom" || side === "below") {
            dx = centerX(anchorBounds) - centerX(b);
            dy = (anchorBounds[3] - margin) - b[1];
        }
        else if (side === "left") {
            dx = (anchorBounds[0] - margin) - b[2];
            dy = centerY(anchorBounds) - centerY(b);
        }
        else if (side === "right") {
            dx = (anchorBounds[2] + margin) - b[0];
            dy = centerY(anchorBounds) - centerY(b);
        }
        else {
            dx = centerX(anchorBounds) - centerX(b);
            dy = centerY(anchorBounds) - centerY(b);
        }
        item.translate(dx, dy);
        app.redraw();
        return boundsOf(item);
    }

    function nudgeUntilClear(item, obstacles, direction, step, maxSteps, gap) {
        step = step || 2;
        maxSteps = maxSteps || 20;
        gap = gap || 0;
        var dx = 0;
        var dy = 0;
        if (direction === "right") dx = step;
        else if (direction === "left") dx = -step;
        else if (direction === "up") dy = step;
        else dy = -step;

        for (var i = 0; i <= maxSteps; i++) {
            app.redraw();
            var b = boundsOf(item);
            var clear = true;
            for (var j = 0; j < obstacles.length; j++) {
                if (intersects(b, obstacles[j], gap)) {
                    clear = false;
                    break;
                }
            }
            if (clear) return true;
            item.translate(dx, dy);
        }
        return false;
    }

    function groupHas(groups, wanted) {
        if (!wanted) return true;
        return (" " + groups + " ").indexOf(" " + wanted + " ") >= 0;
    }

    function Registry(name) {
        this.name = name || "layout";
        this.records = [];
        this.errors = [];
    }

    Registry.prototype.add = function (name, item, groups, pad) {
        var b = boundsOf(item);
        if (pad) b = inflateBounds(b, pad);
        return this.addBounds(name, b, groups, item);
    };

    Registry.prototype.addBounds = function (name, bounds, groups, item) {
        var record = {
            name: name,
            bounds: cloneBounds(bounds),
            groups: groups || "",
            item: item || null
        };
        this.records.push(record);
        return record.bounds;
    };

    Registry.prototype.get = function (name) {
        for (var i = 0; i < this.records.length; i++) {
            if (this.records[i].name === name) return this.records[i];
        }
        return null;
    };

    Registry.prototype.boundsForGroup = function (group) {
        var out = [];
        for (var i = 0; i < this.records.length; i++) {
            if (groupHas(this.records[i].groups, group)) out.push(this.records[i].bounds);
        }
        return out;
    };

    Registry.prototype.requireInside = function (parentName, childName, gap) {
        var parent = this.get(parentName);
        var child = this.get(childName);
        if (!parent || !child) {
            this.errors.push("missing record for inside check: " + parentName + " / " + childName);
            return false;
        }
        if (!inside(parent.bounds, child.bounds, gap || 0)) {
            this.errors.push(childName + " is outside " + parentName);
            return false;
        }
        return true;
    };

    Registry.prototype.requireNoOverlap = function (groupA, groupB, gap) {
        gap = gap || 0;
        var ok = true;
        for (var i = 0; i < this.records.length; i++) {
            var a = this.records[i];
            if (!groupHas(a.groups, groupA)) continue;
            for (var j = 0; j < this.records.length; j++) {
                var b = this.records[j];
                if (i === j) continue;
                if (groupB && !groupHas(b.groups, groupB)) continue;
                if (!groupB && j <= i) continue;
                if (intersects(a.bounds, b.bounds, gap)) {
                    this.errors.push(a.name + " overlaps " + b.name);
                    ok = false;
                }
            }
        }
        return ok;
    };

    Registry.prototype.requireInsideBounds = function (name, parentBounds, gap) {
        var record = this.get(name);
        if (!record) {
            this.errors.push("missing record for bounds check: " + name);
            return false;
        }
        if (!inside(parentBounds, record.bounds, gap || 0)) {
            this.errors.push(name + " is outside required bounds");
            return false;
        }
        return true;
    };

    Registry.prototype.report = function () {
        if (this.errors.length === 0) return this.name + ": layout QA passed";
        var lines = [this.name + ": layout QA failed"];
        for (var i = 0; i < this.errors.length; i++) {
            lines.push("- " + this.errors[i]);
        }
        return lines.join("\n");
    };

    Registry.prototype.throwIfErrors = function () {
        if (this.errors.length > 0) {
            throw new Error(this.report());
        }
        return true;
    };

    return {
        boundsOf: boundsOf,
        boundsFromRect: boundsFromRect,
        boundsFromPoints: boundsFromPoints,
        unionBounds: unionBounds,
        unionItems: unionItems,
        inflateBounds: inflateBounds,
        centerX: centerX,
        centerY: centerY,
        width: width,
        height: height,
        intersects: intersects,
        inside: inside,
        translateToCenter: translateToCenter,
        centerTextFrame: centerTextFrame,
        placeItemRelative: placeItemRelative,
        nudgeUntilClear: nudgeUntilClear,
        Registry: Registry
    };
})();
