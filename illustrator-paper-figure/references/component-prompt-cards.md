# Component Prompt Cards

Use these prompt cards when generating visual components that will later be cleaned, redrawn, vectorized, or placed into an editable Illustrator figure. Do not generate a complete labeled manuscript diagram as one image.

Choose a card by the component's visual role, not by the research field. Keep domain-specific examples in the filled prompt, not in the skill instructions.

## Universal Prompt Pattern

```text
Create an isolated [component] for a scientific manuscript figure.
Role in the figure: [input/specimen/device/material/process/output/context/reference].
View: [front/side/top/three-quarter/cross-section/exploded view/sequence frame].
Style: clean manuscript illustration, simplified linework, light neutral shading, high structural clarity.
Content constraints: [exact count, shape, orientation, boundary, state, or geometry that must be correct].
Background: plain white or transparent-looking background.
Do not include text, labels, arrows, axes, numbers, logos, signatures, borders, visible watermarks, captions, or decorative framing.
The image will be redrawn or vectorized in Adobe Illustrator and combined with editable labels, formulas, boxes, and arrows.
```

## Rough Whole-Figure Blueprint

Use when the user needs a full mechanism or workflow sketch to establish composition before local redraw. This is a planning image only; do not use it as the final manuscript figure.

```text
Create a rough hand-drawn blueprint for a scientific manuscript mechanism figure.
Purpose: [one-sentence mechanism or workflow claim].
Layout: [single panel / multi-panel / left-to-right / top-to-bottom / circular / split before-after].
Visual elements: [objects, states, environment, process, outputs].
Required relationships: [contacts, transitions, flow direction implied by geometry, hierarchy, grouping].
Style: clean monochrome or lightly colored manuscript sketch, simple linework, minimal shading, high structural clarity.
Keep the drawing unlabeled. Do not include text, letters, arrows with labels, formulas, axes, numbers, logos, signatures, borders, visible watermarks, or decorative framing.
The image will be used only as a redraw blueprint. Final labels, arrows, formulas, and panel marks will be created manually in Adobe Illustrator.
```

## Object, Specimen, Or Device

Use for physical things: lab samples, tools, machines, sensors, chips, electrodes, spacecraft parts, implants, organisms, organs, cells, particles, product prototypes, or field hardware.

```text
Create an isolated [object/specimen/device] for a scientific manuscript figure.
View: [orthographic side/top/front/three-quarter/cross-section], centered and readable at small size.
Required features: [parts, interfaces, symmetry, layers, ports, joints, surface pattern, contact points, or distinguishing shape].
Style: simplified technical or biological linework with restrained neutral color and minimal texture.
Background: plain white.
Do not include labels, arrows, dimensions, logos, signatures, borders, or watermarks.
```

## Material, Medium, Or Environment

Use for backgrounds or domains where something happens: tissue, fluid, air, soil, sediment, plasma, membrane, porous medium, microstructure, terrain, atmosphere, reactor volume, channel, chamber, interface, or substrate.

```text
Create an isolated simplified [material/medium/environment] component for a scientific manuscript figure.
View: [cross-section/top view/side view/local magnified region].
Required features: [phase boundary, pores, grains, fibers, flow region, matrix, interface, surface, heterogeneity, gradient, or occupied region].
Style: sparse manuscript line-art with muted fills, clear boundaries, and low texture density.
Background: plain white.
Do not include text, labels, arrows, axes, scale bars, signatures, borders, or watermarks.
```

## Process, Interaction, Or State Change

Use for visual states that need to be shown as component frames: deformation, reaction, transport, binding, assembly, diffusion, learning loop, control action, failure mode, phase transition, manufacturing step, or before/after comparison.

```text
Create one isolated frame showing [process/interaction/state] for a scientific mechanism figure.
Moment shown: [initial/intermediate/final/before/after/contact/release/activation/inhibition].
Required features: [participating objects, changed region, direction implied by shape, contact, deformation, mixing, conversion, or transfer].
Style: clean simplified manuscript linework, minimal shading, no motion blur.
Background: plain white.
Do not include text, labels, arrows, symbols, logos, signatures, borders, or watermarks.
```

## Experimental, Computational, Or Clinical Setup

Use for systems that create data: bench-top rigs, reactors, microscopy setups, field deployments, sensors, medical scanners, culture plates, wind tunnels, robots, simulation pipelines, compute clusters, or data-acquisition layouts.

```text
Create an isolated simplified [setup/system] for a scientific figure.
View: [front/side/three-quarter/schematic perspective], clean and readable at small size.
Required features: [sample location, actuator/source, sensor/detector, container/domain, fixture, data output element, or human/operator context if necessary].
Style: simplified technical illustration with dark outlines and restrained neutral colors.
Background: plain white.
Do not include text, labels, arrows, screen text, logos, signatures, borders, or watermarks.
```

## Multi-Scale Or Cutaway Structure

Use when a figure links scales or reveals hidden structure: macro-to-micro zoom, organ-to-cell, device-to-layer stack, material-to-grain, architecture-to-module, satellite-to-subsystem, code-to-model block, or sample-to-molecule.

```text
Create an isolated [cutaway/magnified/multi-scale] component for a scientific figure.
Scale relationship: [outer object plus inset region / layered cross-section / exploded stack / nested structure].
Required features: [outer boundary, internal layers, repeated units, highlighted region, connection between scales].
Style: clear manuscript line-art, simplified details, consistent perspective, muted fills.
Background: plain white.
Do not include text, labels, arrows, scale bars, logos, signatures, borders, or watermarks.
```

## Abstract Concept Or Workflow Icon

Use only when a literal object would be misleading or too field-specific: model, algorithm, dataset, optimization, uncertainty, feedback, policy, signal, constraint, objective, transformation, or decision.

```text
Create an isolated simple visual icon for [abstract concept] in a scientific workflow figure.
Metaphor constraints: [avoid cliches; use simple geometric form related to the concept].
Style: minimal vector-like linework, manuscript-compatible, no decorative 3D effects.
Background: plain white.
Do not include text, labels, arrows, numbers, logos, signatures, borders, or watermarks.
```

## Filling Guidance

- Replace bracketed fields with precise, domain-local constraints from the paper.
- State what must be correct visually; omit background theory.
- Prefer one component per prompt. Complex full scenes are harder to clean and redraw.
- Ask for no text even when the final figure needs labels; add labels later as editable Illustrator text.
- For sensitive medical, human-subject, or proprietary objects, avoid identifiable persons, brands, patient data, or confidential product geometry unless the user explicitly provides approved source material.

## Rejection Checklist

Reject and regenerate or redraw when the component has:

- wrong object count, missing key parts, impossible geometry, or confused silhouette;
- text, labels, letters, pseudo-signatures, logos, visible watermark-like marks, or decorative borders;
- excessive texture that will not survive vector redraw;
- cropped edges that remove important structure;
- perspective inconsistent with the planned figure;
- background shadows or gradients that make cleanup difficult;
- field-specific visual stereotypes that do not match the actual paper.

## Provenance Folder

Keep each component's trail together:

```text
component_name_prompt.txt
component_name_source.png
component_name_clean.png
component_name_lineart.svg
component_name_redraw.ai
```

If a component is based on a non-generated source image, record the source, license, and any required citation before using it.
