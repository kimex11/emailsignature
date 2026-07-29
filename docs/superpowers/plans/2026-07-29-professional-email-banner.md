# Professional Email Banner Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the stretched email-signature banner with a purpose-built 400 × 100 professional iad Real Estate banner.

**Architecture:** A deterministic 1200 × 300 browser-canvas master composes exact text, brand colors, a subtle pattern, and a proportionally extracted iad logo. Canvas export and proportional raster downsampling produce the final 400 × 100 PNG consumed unchanged by the existing signature.

**Tech Stack:** HTML, CSS, browser capture, macOS image utilities, React/Vite verification, Sites deployment.

## Global Constraints

- Final PNG must be exactly 400 × 100 pixels.
- Every required copy line must remain exact.
- The existing iad mark must remain proportional.
- The output must not depend on image stretching, cropping, SVG recreation, or AI-rendered text.
- Signature HTML must continue to render the banner at native 400 × 100 dimensions.

---

### Task 1: Produce the exact-ratio brand asset

**Files:**
- Create: `work/banner/banner-master.html`
- Create: `work/banner/iad-logo-source.png`
- Create: `work/banner/banner-master-1200x300.png`
- Modify: `public/assets/default-banner.png`

**Interfaces:**
- Consumes: supplied reference banner and approved design specification.
- Produces: native-ratio 400 × 100 PNG.

- [ ] **Step 1: Extract and inspect the existing iad logo**

Crop the logo and website lockup from the supplied banner without changing its aspect ratio. Inspect the crop for halos, missing pixels, or surrounding copy.

- [ ] **Step 2: Build the 1200 × 300 master**

Create a 75/25 split editorial composition with exact required copy, safe-zone padding, proportional logo placement, and a restrained dot pattern.

- [ ] **Step 3: Capture at exact master dimensions**

Render the master through the browser and capture only the 1200 × 300 banner element.

- [ ] **Step 4: Export the production PNG**

Downsample proportionally to exactly 400 × 100 and replace the current default banner.

- [ ] **Step 5: Validate pixels and text**

Run image-dimension inspection and visually check every copy line, logo proportions, contrast, and sharpness.

### Task 2: Integrate and verify

**Files:**
- Modify: `design-qa.md`
- Test: `tests/signature.test.mjs`

**Interfaces:**
- Consumes: new default banner.
- Produces: verified signature preview and Gmail-safe output.

- [ ] **Step 1: Run the existing signature tests**

Run: `npm test`

Expected: all signature and action tests pass.

- [ ] **Step 2: Build the production app**

Run: `npm run build && npm run test:sites`

Expected: build succeeds and all hosting checks pass.

- [ ] **Step 3: Capture visual QA evidence**

Open the default signature preview at the same state as the reported issue, confirm the new banner renders at native ratio, and compare it against the user’s stretched screenshot.

- [ ] **Step 4: Update design QA**

Record the new source path, implementation screenshot, exact dimensions, required fidelity surfaces, comparison history, and `final result: passed` when no P0/P1/P2 findings remain.

### Task 3: Publish and refresh the local package

**Files:**
- Modify: `.openai/hosting.json` only through the existing project linkage.
- Modify: `../outputs/signature-builder-source/public/assets/default-banner.png`
- Modify: `../outputs/signature-builder-source/design-qa.md`
- Create: `../outputs/signature-builder-github-vercel.zip`

**Interfaces:**
- Consumes: exact verified source commit.
- Produces: Sites production version and refreshed local GitHub/Vercel deliverables.

- [ ] **Step 1: Commit and push the verified change**

Commit the banner asset and QA evidence, then push the exact branch head to the existing Sites source repository.

- [ ] **Step 2: Package and deploy one Sites version**

Build the archive from the pushed source commit, save a new version, deploy it privately, and wait for `succeeded`.

- [ ] **Step 3: Refresh the Vercel-ready local copy**

Sync the new banner and QA report into the clean source package, verify `npm test` and `npm run build`, remove temporary dependencies/build output, and recreate the ZIP without `.git`, `.openai`, `node_modules`, or `dist`.
