# MathType Formula Handoff

Use this reference when a figure contains equations, symbols, or mathematical labels that should be authored in MathType and placed into Adobe Illustrator.

## Formula Inventory

Create a short inventory before exporting formulas:

```text
formula_id: f01
manuscript_notation: C_{\mathrm{sh}} = 1 - exp[-lambda(...)]
source_file: formulas_source/f01_Csh.mteq or formulas_source/f01_Csh.docx
export_pdf: formulas_mathtype_pdf/f01_Csh.pdf
export_eps: formulas_mathtype_eps/f01_Csh.eps
target_panel: Figure 1(b)
placement_note: centered inside recovery-model box
size_note: match surrounding 8 pt labels
```

Keep IDs stable so Illustrator links, revision notes, and regenerated assets do not drift.

## Preferred Asset Order

1. User-provided MathType EPS/PDF assets.
2. MathType-authored assets exported interactively from Word/MathType.
3. LaTeX-generated PDF/EPS assets as stable fallbacks.
4. Plain Illustrator text only for non-mathematical labels.

Avoid screenshot formulas in final artwork.

## Folder Layout

Use a predictable folder structure near the figure master:

```text
figN_illustrator_assets/
  formulas_source/
  formulas_mathtype_pdf/
  formulas_mathtype_eps/
  formulas_latex_pdf/
  formulas_preview_png/
```

Keep source files even after placing PDF/EPS exports into Illustrator.

## Export Rules

- Export each formula as a separate PDF or EPS with a tight bounding box when possible.
- Use transparent or white background only when it will not create visible boxes in Illustrator.
- Keep formula naming semantic: `f01_main_model.pdf`, `f02_loss_function.pdf`.
- Regenerate derived PDF/EPS whenever the source formula changes.
- If MathType automation hangs or shows hidden dialogs, stop automation and use interactive export or LaTeX fallback.

## Illustrator Placement

- Place formula PDF/EPS assets as linked or embedded objects according to the user's editing preference.
- Keep formula assets on a semantic layer such as `04_formula_assets`.
- Align the formula visually, not only by bounding-box center.
- Match formula x-height to nearby labels.
- Align baselines when formulas sit beside text.
- Do not stretch formulas non-uniformly.
- If a formula must be scaled, scale proportionally and record the intended size.

## Notation QA

Check every formula against the manuscript:

- variable spelling and subscripts;
- roman versus italic text, such as `exp`, `sin`, `max`, units, and descriptors;
- Greek letters and capitalization;
- superscripts, signs, and parentheses;
- equation numbering, if shown;
- consistency with nearby labels and caption.

## Handoff Checklist

Before asking the user to manually fine-tune the Illustrator file:

- formula source files are present;
- exported PDF/EPS formula files are present;
- Illustrator file opens without missing links;
- formulas render correctly in exported PDF;
- remaining manual tasks identify specific formulas or panels;
- formula changes can be regenerated without reconstructing the whole figure.
