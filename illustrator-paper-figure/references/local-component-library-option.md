# Optional Local Component Libraries

Load this when a project may reuse domain-specific objects across multiple figures, or when the user asks to build a reusable component set.

## Policy

Do not build a permanent, skill-wide component library for every domain. That becomes brittle and too broad. Build project-local component libraries only when they help the current work.

## When To Ask The User

Ask whether to scaffold a local component library when any of these are true:

- The same domain components will appear in multiple figures.
- The user asks for a visual system across a paper, thesis, grant, or report.
- The figure needs multiple reusable variants of a component.
- Manual Illustrator refinement is expected and should be preserved for later figures.

For a one-off figure, do not ask by default. Create only the assets needed for that figure inside its normal asset folder.

## Scaffold Command

```bash
python path/to/scripts/init_local_component_library.py \
  path/to/project-or-figure-folder \
  --domain internal-combustion-engine
```

The script creates:

- `figure_components/<domain>-components/prompts/`
- `figure_components/<domain>-components/source_rasters/`
- `figure_components/<domain>-components/cleaned_rasters/`
- `figure_components/<domain>-components/traced_svg/`
- `figure_components/<domain>-components/ai_components/`
- `figure_components/<domain>-components/exports/`
- `figure_components/<domain>-components/component_manifest.json`

## What Belongs In The Manifest

Record each reusable component with:

- component name
- visual role
- source/provenance
- editable master path
- export preview path
- allowed reuse scope
- notes about scale, color, line style, and known limitations

## Reuse Rules

- Reuse components only within the project or with explicit user approval.
- Keep generated/source images separate from cleaned or redrawn assets.
- Prefer editable vector masters over pasted raster components.
- Update the manifest when a component is manually improved in Illustrator.
