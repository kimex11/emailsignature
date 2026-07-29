export function createStandaloneHtml(signatureHtml) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Gmail Signature</title>
</head>
<body style="margin:24px;background:#ffffff;">
${signatureHtml}
</body>
</html>`;
}

export function safeFileName(name) {
  const slug = String(name)
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${slug || "agent"}-gmail-signature.html`;
}

export async function copyRichSignature(html, plainText, previewElement) {
  if (globalThis.ClipboardItem && navigator.clipboard?.write) {
    const item = new ClipboardItem({
      "text/html": new Blob([html], { type: "text/html" }),
      "text/plain": new Blob([plainText], { type: "text/plain" }),
    });
    await navigator.clipboard.write([item]);
    return "rich";
  }

  const selection = globalThis.getSelection?.();
  if (!selection || !previewElement) throw new Error("Clipboard unavailable");
  const range = document.createRange();
  range.selectNodeContents(previewElement);
  selection.removeAllRanges();
  selection.addRange(range);
  const copied = document.execCommand("copy");
  selection.removeAllRanges();
  if (!copied) throw new Error("Clipboard unavailable");
  return "fallback";
}

export function downloadHtml(signatureHtml, fullName) {
  const blob = new Blob([createStandaloneHtml(signatureHtml)], {
    type: "text/html;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = safeFileName(fullName);
  anchor.click();
  URL.revokeObjectURL(url);
}
