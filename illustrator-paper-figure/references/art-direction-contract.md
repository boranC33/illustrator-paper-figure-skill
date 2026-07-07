# Art Direction Contract

Load this before creating or substantially rebuilding a figure whose visual quality matters, especially when the figure risks looking like a simple script/PPT diagram.

## Purpose

Use this contract to define the visual target before drawing. A figure can pass layout QA and still look crude if it lacks hierarchy, detail, material language, or a coherent style.

## Required Fields

- Figure role: mechanism diagram, graphical abstract, workflow, device schematic, experimental setup, model pipeline, or hybrid.
- Target visual class:
  - `journal schematic`: clean vector, restrained detail, strong labels.
  - `technical illustration`: richer component geometry, material cues, cross-sections, callouts.
  - `CAD-clean`: precise outlines, orthographic/isometric structure, minimal color.
  - `graphical abstract`: more visual hierarchy and explanatory emphasis, still editable.
  - `review figure`: multi-panel, consistent symbolic language, moderate detail.
- Desired finish level: `draft`, `manuscript`, or `hero`.
- Detail density: `low`, `medium`, or `high`.
- Component realism: `symbolic`, `schematic`, `semi-realistic vector`, or `CAD-like`.
- Line language: monoline, weighted outlines, cross-section hatching, isometric edges, cutaway walls, or soft material bands.
- Color strategy: 2-4 restrained accents, grayscale-compatible, semantic color map.
- Visual hierarchy: primary object, secondary mechanisms, supporting annotations, labels.
- Reference basis: nearby paper figures, user-provided references, generated rough sketch, or local examples.
- Aesthetic route: `sketch-to-vector`, `component-reference-to-vector`, or `vector-first`.
- Local component library decision: no library, create project-local library, or reuse existing project-local library.

## Decision Rules

- For one-off figures, do not build a domain component library. Draw only the components needed for the figure.
- For a paper/project with repeated domain objects across figures, ask the user whether to scaffold a local component library under the project.
- For mechanism figures, favor a refined custom redraw over a generic box-and-arrow template.
- For polished, high-impact, hero, graphical-abstract-like, or user-criticized-as-ugly mechanism figures, choose `sketch-to-vector` unless the user explicitly requests a simple deterministic schematic.
- Use generated images only for direction, component references, or rough composition. Redraw important elements as editable vectors.
- If the figure has no nearby style reference and visual quality matters, create or request a generated rough sketch before scripting the Illustrator layout.
- If no reference images are available, choose a conservative `journal schematic` or `technical illustration` style based on the user goal.

## Quick Contract Template

```text
Figure role:
Target visual class:
Finish level:
Detail density:
Component realism:
Line language:
Color strategy:
Primary visual focus:
Secondary details:
Label density:
Reference basis:
Aesthetic route:
Local component library:
```

## Common Bad Outcomes To Avoid

- The figure reads as PowerPoint clip art.
- Mechanical or biological parts are reduced to generic rectangles.
- Every line has the same weight, so there is no depth or focus.
- Saturated colors dominate instead of clarifying.
- Arrows are visually louder than the mechanism.
- There are no small structural details to communicate domain credibility.
- Decorative shadows or gradients replace meaningful material cues.
