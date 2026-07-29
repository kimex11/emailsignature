import test from "node:test";
import assert from "node:assert/strict";

import { createStandaloneHtml, safeFileName } from "../src/actions.js";

test("creates a standalone UTF-8 HTML document", () => {
  const document = createStandaloneHtml("<table><tr><td>Kateri</td></tr></table>");
  assert.match(document, /^<!doctype html>/i);
  assert.match(document, /charset="utf-8"/i);
  assert.match(document, /<table><tr><td>Kateri<\/td><\/tr><\/table>/);
});

test("creates a safe agent-specific file name", () => {
  assert.equal(safeFileName("Kateri Guzman"), "kateri-guzman-gmail-signature.html");
  assert.equal(safeFileName("  Agent / #42  "), "agent-42-gmail-signature.html");
});
