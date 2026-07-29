import test from "node:test";
import assert from "node:assert/strict";

import {
  DEFAULT_SIGNATURE,
  auditSignatureHtml,
  escapeHtml,
  generatePlainText,
  generateSignatureHtml,
  validateSignature,
} from "../src/signature.js";

const PUBLIC_SIGNATURE = {
  ...DEFAULT_SIGNATURE,
  headshotUrl: "https://images.example.com/kateri-guzman.jpg",
  bannerUrl: "https://images.example.com/join-iad-florida-banner.jpg",
};

test("escapes user-authored HTML", () => {
  assert.equal(
    escapeHtml(`<Kateri & "team">'`),
    "&lt;Kateri &amp; &quot;team&quot;&gt;&#39;",
  );
});

test("validates production URLs and allows empty optional links", () => {
  const valid = validateSignature(PUBLIC_SIGNATURE);
  assert.equal(valid.canCopy, true);
  assert.deepEqual(valid.errors, {});

  const unsafe = validateSignature({
    ...PUBLIC_SIGNATURE,
    headshotUrl: "blob:http://localhost/avatar",
    bannerUrl: "data:image/png;base64,abc",
    facebookUrl: "",
  });
  assert.equal(unsafe.canCopy, false);
  assert.match(unsafe.errors.headshotUrl, /public HTTPS/i);
  assert.match(unsafe.errors.bannerUrl, /public HTTPS/i);
  assert.equal(unsafe.errors.facebookUrl, undefined);
});

test("generates Gmail-safe table HTML and omits empty optional fields", () => {
  const html = generateSignatureHtml({
    ...PUBLIC_SIGNATURE,
    mobile: "",
    instagramUrl: "",
  });

  assert.match(html, /role="presentation"/);
  assert.match(html, /mailto:kateri\.guzman%40iadflorida\.com/);
  assert.match(html, /tel:\+14077200020/);
  assert.match(html, /width="400"/);
  assert.match(html, /height="100"/);
  assert.doesNotMatch(html, />M:</);
  assert.doesNotMatch(html, /Instagram/);
  assert.ok(html.length < 10_000);
});

test("audits forbidden Gmail markup and CSS", () => {
  const safe = auditSignatureHtml(generateSignatureHtml(PUBLIC_SIGNATURE));
  assert.equal(safe.safe, true);
  assert.deepEqual(safe.issues, []);

  const unsafe = auditSignatureHtml(
    `<div class="bad" style="display:flex;background-image:url(data:x)">x<script>x</script></div>`,
  );
  assert.equal(unsafe.safe, false);
  assert.ok(unsafe.issues.length >= 4);
});

test("generates readable plain text", () => {
  const text = generatePlainText(PUBLIC_SIGNATURE);
  assert.match(text, /Kateri Guzman/);
  assert.match(text, /T: \(407\) 720-0020/);
  assert.match(text, /E: kateri\.guzman@iadflorida\.com/);
});
