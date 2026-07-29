# Professional Email Banner — Design Specification

## Goal

Replace the stretched 374 × 150 source banner with a purpose-built, professional 4:1 banner that remains crisp and readable at Gmail’s 400 × 100 display size.

## Approved direction

Use a premium editorial split composition:

- 75% cyan/navy message panel on the left;
- 25% white brand panel on the right;
- exact iad Real Estate logo treatment preserved from the supplied brand asset;
- subtle dotted brand pattern for depth;
- strong white headline and compact supporting copy;
- no photography, gradients, artificial logo recreation, or generated text.

## Required copy

Every existing line remains:

- `YOUR DREAM HOME COULD BE JUST A SEARCH AWAY`
- `JOINIADREALESTATE.COM`
- `One Brokerage. Unlimited Possibilities.`
- `Own Your Future. Join iad Florida!`
- `iad REAL ESTATE`
- `WWW.JOINIADREALESTATE.COM`

Spelling, capitalization, and punctuation must remain exact.

## Production method

Create the master banner as deterministic browser canvas artwork at 1200 × 300 pixels using Arial/Helvetica-compatible typography, the existing raster iad logo crop, and a code-authored dotted pattern. Export the canvas at its exact pixel dimensions and downsample proportionally to a 400 × 100 PNG.

This method is selected instead of full-image AI generation because exact small-format copy and brand-mark fidelity are non-negotiable.

## Visual system

- Primary cyan: `#00A6E4`
- Deep cyan: `#0085B8`
- Navy: `#12263B`
- White: `#FFFFFF`
- Main headline: bold uppercase, tightly but legibly tracked
- Supporting copy: medium weight with `Join iad Florida!` emphasized
- Brand panel: generous whitespace with the iad mark optically centered
- Decorative pattern: low-opacity circles confined to outer safe zones

## Gmail and accessibility constraints

- Final image dimensions: exactly 400 × 100 pixels.
- No HTML-side stretching or cropping.
- High-contrast headline and supporting copy.
- No essential information in the outermost 12 pixels.
- Existing meaningful banner alt text remains.
- Production HTML remains table-based and inline styled.

## Integration

Replace `public/assets/default-banner.png` in:

- the primary Sites project;
- the local GitHub/Vercel source package.

The banner URL field remains editable, and local preview behavior remains unchanged.

## Acceptance criteria

- Final PNG is exactly 400 × 100.
- All required copy is visibly legible at 100% scale.
- The iad logo is proportionally correct.
- No blur, stretching, clipping, or interpolation artifacts are visible.
- The signature preview’s banner renders at its native 400 × 100 size.
- Existing application tests and production builds pass.
- Side-by-side visual QA against the stretched version confirms improved proportions, hierarchy, and legibility.
