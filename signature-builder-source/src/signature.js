export const DEFAULT_SIGNATURE = {
  fullName: "Kateri Guzman",
  role: "REALTOR®",
  company: "iad Real Estate",
  companyUrl: "https://www.joiniadrealestate.com",
  telephone: "(407) 720-0020",
  mobile: "(404) 960-9655",
  email: "kateri.guzman@iadflorida.com",
  address: "7362 Futures Dr #18 Orlando, FL 32819",
  headshotUrl: "",
  headshotAlt: "Kateri Guzman, REALTOR®",
  bannerUrl: "",
  bannerAlt: "Join iad Florida — your dream home could be just a search away",
  facebookUrl: "https://www.facebook.com/",
  youtubeUrl: "https://www.youtube.com/",
  linkedinUrl: "https://www.linkedin.com/",
  instagramUrl: "https://www.instagram.com/",
  websiteUrl: "https://www.joiniadrealestate.com",
  disclaimer:
    "The information contained in this email is confidential and intended solely for the use of the individual or entity to whom it is addressed. Any disclosure, copying, or distribution of this message without the sender's written consent is strictly prohibited. If you have received this communication in error, please notify the sender immediately and delete the original message.",
  accentColor: "#009fe3",
};

export function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function isHttpsUrl(value) {
  if (!value) return false;
  try {
    return new URL(value).protocol === "https:";
  } catch {
    return false;
  }
}

export function validateSignature(data) {
  const errors = {};
  const required = [
    ["fullName", "Full name is required."],
    ["role", "Role is required."],
    ["email", "Email is required."],
  ];

  for (const [field, message] of required) {
    if (!data[field]?.trim()) errors[field] = message;
  }

  for (const field of ["headshotUrl", "bannerUrl"]) {
    if (!isHttpsUrl(data[field])) {
      errors[field] =
        "Add a permanent, public HTTPS image URL before copying to Gmail.";
    }
  }

  for (const field of [
    "companyUrl",
    "facebookUrl",
    "youtubeUrl",
    "linkedinUrl",
    "instagramUrl",
    "websiteUrl",
  ]) {
    if (data[field] && !isHttpsUrl(data[field])) {
      errors[field] = "Use a complete HTTPS URL.";
    }
  }

  return { errors, canCopy: Object.keys(errors).length === 0 };
}

function cleanPhone(value) {
  const digits = value.replace(/\D/g, "");
  if (value.trim().startsWith("+")) return `+${digits}`;
  if (digits.length === 10) return `+1${digits}`;
  return digits;
}

function link(url, content, title = "") {
  const safeTitle = title ? ` title="${escapeHtml(title)}"` : "";
  return `<a href="${escapeHtml(url)}"${safeTitle} style="color:#2f3540;text-decoration:none;">${content}</a>`;
}

function contactRow(label, value, href) {
  if (!value) return "";
  const content = href ? link(href, escapeHtml(value)) : escapeHtml(value);
  return `<tr><td style="padding:0 0 2px 0;font-family:Arial,Helvetica,sans-serif;font-size:11px;line-height:14px;color:#2f3540;"><strong>${label}:</strong> ${content}</td></tr>`;
}

const socialIcons = {
  facebookUrl: [
    "Facebook",
    "https://img.icons8.com/ios-filled/50/ffffff/facebook-f.png",
    "#4267B2",
  ],
  youtubeUrl: [
    "YouTube",
    "https://img.icons8.com/ios-filled/50/ffffff/youtube-play.png",
    "#5b6fcf",
  ],
  linkedinUrl: [
    "LinkedIn",
    "https://img.icons8.com/ios-filled/50/ffffff/linkedin.png",
    "#3f63bd",
  ],
  instagramUrl: [
    "Instagram",
    "https://img.icons8.com/ios-filled/50/ffffff/instagram-new.png",
    "#4867c8",
  ],
};

function socialCells(data) {
  return Object.entries(socialIcons)
    .filter(([field]) => Boolean(data[field]))
    .map(([field, [name, icon, background]]) => {
      return `<td style="padding:0 5px 0 0;"><a href="${escapeHtml(data[field])}" title="${name}" style="text-decoration:none;"><span style="display:block;width:18px;height:18px;background:${background};"><img src="${icon}" width="12" height="12" alt="${name}" style="display:block;border:0;width:12px;height:12px;padding:3px;" /></span></a></td>`;
    })
    .join("");
}

export function generateSignatureHtml(data) {
  const color = /^#[0-9a-f]{6}$/i.test(data.accentColor)
    ? data.accentColor
    : "#009fe3";
  const headshot = data.headshotUrl
    ? `<td width="82" valign="top" style="padding:0 14px 0 0;"><img src="${escapeHtml(data.headshotUrl)}" width="70" height="90" alt="${escapeHtml(data.headshotAlt)}" style="display:block;border:0;width:70px;height:90px;" /></td>`
    : "";
  const banner = data.bannerUrl
    ? `<tr><td style="padding:22px 0 0 0;"><a href="${escapeHtml(data.websiteUrl || data.companyUrl)}" style="text-decoration:none;"><img src="${escapeHtml(data.bannerUrl)}" width="400" height="100" alt="${escapeHtml(data.bannerAlt)}" style="display:block;border:0;width:400px;height:100px;" /></a></td></tr>`
    : "";

  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0" width="400" style="border-collapse:collapse;width:400px;max-width:400px;font-family:Arial,Helvetica,sans-serif;color:#2f3540;">
<tr><td style="padding:0 0 3px 0;font-family:Arial,Helvetica,sans-serif;font-size:18px;line-height:22px;font-weight:700;color:${color};">${escapeHtml(data.fullName)}</td></tr>
<tr><td style="padding:0 0 7px 0;border-bottom:1px solid ${color};font-family:Arial,Helvetica,sans-serif;font-size:10px;line-height:13px;color:#2f3540;"><strong>${escapeHtml(data.role)}</strong>${data.company ? ` | ${link(data.companyUrl, `<span style="color:${color};font-weight:700;">${escapeHtml(data.company)}</span>`)}` : ""}</td></tr>
<tr><td style="padding:16px 0 0 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;"><tr>
${headshot}
<td valign="top" style="padding:5px 0 0 0;"><table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
${contactRow("T", data.telephone, data.telephone ? `tel:${cleanPhone(data.telephone)}` : "")}
${contactRow("M", data.mobile, data.mobile ? `tel:${cleanPhone(data.mobile)}` : "")}
${contactRow("E", data.email, data.email ? `mailto:${encodeURIComponent(data.email)}` : "")}
${contactRow("A", data.address, "")}
</table>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;margin-top:7px;"><tr>${socialCells(data)}</tr></table>
</td></tr></table></td></tr>
${banner}
<tr><td style="padding:14px 0 0 0;font-family:Arial,Helvetica,sans-serif;font-size:7px;line-height:9px;color:#777777;text-align:justify;">${escapeHtml(data.disclaimer)}</td></tr>
</table>`;
}

export function generatePlainText(data) {
  return [
    data.fullName,
    [data.role, data.company].filter(Boolean).join(" | "),
    data.telephone && `T: ${data.telephone}`,
    data.mobile && `M: ${data.mobile}`,
    data.email && `E: ${data.email}`,
    data.address && `A: ${data.address}`,
    data.websiteUrl,
    data.disclaimer,
  ]
    .filter(Boolean)
    .join("\n");
}

export function auditSignatureHtml(html) {
  const checks = [
    [/<script/i, "Scripts are not allowed."],
    [/\sclass=/i, "CSS classes are not allowed."],
    [/<style/i, "Style blocks are not allowed."],
    [/<svg/i, "SVG is not allowed."],
    [/(?:src|href)=["'](?:data|blob):/i, "Temporary image URLs are not allowed."],
    [/display\s*:\s*(?:flex|grid)/i, "Flexbox and grid are not allowed."],
    [/position\s*:/i, "Positioning is not allowed."],
    [/background-image\s*:/i, "Background images are not allowed."],
  ];
  const issues = checks
    .filter(([pattern]) => pattern.test(html))
    .map(([, message]) => message);
  if (html.length >= 10_000) issues.push("Signature exceeds 10,000 characters.");
  return { safe: issues.length === 0, characterCount: html.length, issues };
}
