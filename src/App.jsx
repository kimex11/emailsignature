import { useEffect, useMemo, useRef, useState } from "react";
import {
  DEFAULT_SIGNATURE,
  auditSignatureHtml,
  generatePlainText,
  generateSignatureHtml,
  validateSignature,
} from "./signature.js";
import { copyRichSignature, downloadHtml } from "./actions.js";

const STORAGE_KEY = "iad-gmail-signature-builder-v1";

const groups = [
  {
    id: "identity",
    number: "01",
    title: "Identity",
    description: "The agent’s name, role and brokerage.",
    fields: [
      ["fullName", "Full name", "text", "Kateri Guzman"],
      ["role", "Role / title", "text", "REALTOR®"],
      ["company", "Company label", "text", "iad Real Estate"],
      ["companyUrl", "Company website", "url", "https://…"],
    ],
  },
  {
    id: "contact",
    number: "02",
    title: "Contact",
    description: "Rows left empty disappear automatically.",
    fields: [
      ["telephone", "Telephone", "tel", "(407) 720-0020"],
      ["mobile", "Mobile", "tel", "(404) 960-9655"],
      ["email", "Email", "email", "name@iadflorida.com"],
      ["address", "Office address", "text", "Street, city, state, ZIP"],
    ],
  },
  {
    id: "social",
    number: "04",
    title: "Social & website",
    description: "Use the complete public profile URL.",
    fields: [
      ["facebookUrl", "Facebook", "url", "https://facebook.com/…"],
      ["youtubeUrl", "YouTube", "url", "https://youtube.com/…"],
      ["linkedinUrl", "LinkedIn", "url", "https://linkedin.com/in/…"],
      ["instagramUrl", "Instagram", "url", "https://instagram.com/…"],
      ["websiteUrl", "Banner link", "url", "https://…"],
    ],
  },
];

function TextField({ field, label, type, placeholder, value, error, onChange }) {
  return (
    <label className="field" htmlFor={field}>
      <span>{label}</span>
      <input
        id={field}
        name={field}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(field, event.target.value)}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${field}-error` : undefined}
      />
      {error && (
        <small className="field-error" id={`${field}-error`}>
          {error}
        </small>
      )}
    </label>
  );
}

function FormGroup({ group, data, errors, onChange }) {
  return (
    <section className="form-card" aria-labelledby={`${group.id}-title`}>
      <div className="card-heading">
        <span>{group.number}</span>
        <div>
          <h2 id={`${group.id}-title`}>{group.title}</h2>
          <p>{group.description}</p>
        </div>
      </div>
      <div className="fields-grid">
        {group.fields.map(([field, label, type, placeholder]) => (
          <TextField
            key={field}
            field={field}
            label={label}
            type={type}
            placeholder={placeholder}
            value={data[field]}
            error={errors[field]}
            onChange={onChange}
          />
        ))}
      </div>
    </section>
  );
}

function ImageField({
  field,
  label,
  value,
  error,
  localPreview,
  onChange,
  onFile,
}) {
  return (
    <div className="image-field">
      <TextField
        field={field}
        label={`${label} public URL`}
        type="url"
        placeholder="https://your-public-image-host.com/image.jpg"
        value={value}
        error={error}
        onChange={onChange}
      />
      <label className="upload-control">
        <span>Temporary preview upload</span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => onFile(field, event.target.files?.[0])}
        />
        <strong>{localPreview ? "Preview loaded" : "Choose image"}</strong>
        <small>Preview only — Gmail needs the public URL above.</small>
      </label>
    </div>
  );
}

export function App() {
  const [data, setData] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? { ...DEFAULT_SIGNATURE, ...JSON.parse(saved) } : DEFAULT_SIGNATURE;
    } catch {
      return DEFAULT_SIGNATURE;
    }
  });
  const [localImages, setLocalImages] = useState({ headshotUrl: "", bannerUrl: "" });
  const [status, setStatus] = useState("Ready for your agent details.");
  const previewRef = useRef(null);

  const validation = useMemo(() => validateSignature(data), [data]);
  const outputHtml = useMemo(() => generateSignatureHtml(data), [data]);
  const audit = useMemo(() => auditSignatureHtml(outputHtml), [outputHtml]);
  const previewData = useMemo(
    () => ({
      ...data,
      headshotUrl:
        localImages.headshotUrl || data.headshotUrl || "/assets/default-headshot.png",
      bannerUrl:
        localImages.bannerUrl || data.bannerUrl || "/assets/default-banner.png",
    }),
    [data, localImages],
  );
  const previewHtml = useMemo(
    () => generateSignatureHtml(previewData),
    [previewData],
  );

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(
    () => () => {
      Object.values(localImages).forEach((url) => {
        if (url.startsWith("blob:")) URL.revokeObjectURL(url);
      });
    },
    [localImages],
  );

  function update(field, value) {
    setData((current) => ({ ...current, [field]: value }));
  }

  function loadFile(field, file) {
    if (!file) return;
    setLocalImages((current) => {
      if (current[field]?.startsWith("blob:")) URL.revokeObjectURL(current[field]);
      return { ...current, [field]: URL.createObjectURL(file) };
    });
    setStatus(`${field === "headshotUrl" ? "Headshot" : "Banner"} preview loaded. Add its public URL before copying.`);
  }

  async function copyForGmail() {
    if (!validation.canCopy || !audit.safe) {
      setStatus("Add valid public HTTPS image URLs before copying.");
      return;
    }
    try {
      const method = await copyRichSignature(
        outputHtml,
        generatePlainText(data),
        previewRef.current,
      );
      setStatus(
        method === "rich"
          ? "Copied. Paste directly into Gmail’s signature editor."
          : "Copied using browser fallback. Paste into Gmail now.",
      );
    } catch {
      setStatus("Automatic copy was blocked. Select the preview and copy it manually.");
    }
  }

  function download() {
    if (!validation.canCopy) {
      setStatus("Add valid public HTTPS image URLs before downloading.");
      return;
    }
    downloadHtml(outputHtml, data.fullName);
    setStatus("HTML signature downloaded.");
  }

  function reset() {
    if (!window.confirm("Reset every field to the Kateri Guzman sample?")) return;
    setData(DEFAULT_SIGNATURE);
    setLocalImages({ headshotUrl: "", bannerUrl: "" });
    localStorage.removeItem(STORAGE_KEY);
    setStatus("Sample signature restored.");
  }

  if (new URLSearchParams(window.location.search).has("signature-only")) {
    return (
      <main className="signature-only-page">
        <div
          className="signature-only-output"
          data-testid="signature-only-output"
          dangerouslySetInnerHTML={{ __html: previewHtml }}
        />
      </main>
    );
  }

  return (
    <main className="app-shell">
      <header className="topbar">
        <a className="brand-mark" href="#top" aria-label="Join iad signature builder home">
          <span className="brand-dot" />
          <span>iad<span>/</span>signature</span>
        </a>
        <div className="topbar-actions">
          <span className={`safety-pill ${audit.safe ? "is-safe" : ""}`}>
            <i /> Gmail-safe HTML
          </span>
          <button className="text-button" type="button" onClick={reset}>
            Reset sample
          </button>
        </div>
      </header>

      <section className="hero" id="top">
        <div>
          <p className="eyebrow">Agent communications toolkit</p>
          <h1>One signature.<br /><em>Every detail editable.</em></h1>
        </div>
        <p className="hero-note">
          Built for Gmail’s signature editor: table layout, inline styles and
          public HTTPS images. Update the form, check the preview, then copy.
        </p>
      </section>

      <div className="workspace">
        <form className="editor-column" onSubmit={(event) => event.preventDefault()}>
          {groups.slice(0, 2).map((group) => (
            <FormGroup key={group.id} group={group} data={data} errors={validation.errors} onChange={update} />
          ))}

          <section className="form-card" aria-labelledby="imagery-title">
            <div className="card-heading">
              <span>03</span>
              <div>
                <h2 id="imagery-title">Imagery</h2>
                <p>Permanent URLs for Gmail, uploads for previewing.</p>
              </div>
            </div>
            <div className="image-fields">
              <ImageField
                field="headshotUrl"
                label="Headshot"
                value={data.headshotUrl}
                error={validation.errors.headshotUrl}
                localPreview={localImages.headshotUrl}
                onChange={update}
                onFile={loadFile}
              />
              <ImageField
                field="bannerUrl"
                label="Banner"
                value={data.bannerUrl}
                error={validation.errors.bannerUrl}
                localPreview={localImages.bannerUrl}
                onChange={update}
                onFile={loadFile}
              />
            </div>
            <div className="fields-grid image-alt-fields">
              <TextField field="headshotAlt" label="Headshot alt text" type="text" placeholder="Agent name and role" value={data.headshotAlt} onChange={update} />
              <TextField field="bannerAlt" label="Banner alt text" type="text" placeholder="Describe the banner" value={data.bannerAlt} onChange={update} />
            </div>
          </section>

          <FormGroup group={groups[2]} data={data} errors={validation.errors} onChange={update} />

          <section className="form-card" aria-labelledby="legal-title">
            <div className="card-heading">
              <span>05</span>
              <div>
                <h2 id="legal-title">Legal & brand</h2>
                <p>Disclaimer language and signature accent.</p>
              </div>
            </div>
            <label className="field" htmlFor="disclaimer">
              <span>Confidentiality disclaimer</span>
              <textarea id="disclaimer" rows="6" value={data.disclaimer} onChange={(event) => update("disclaimer", event.target.value)} />
            </label>
            <label className="colour-field" htmlFor="accentColor">
              <span>Accent colour</span>
              <input id="accentColor" type="color" value={data.accentColor} onChange={(event) => update("accentColor", event.target.value)} />
              <code>{data.accentColor.toUpperCase()}</code>
            </label>
          </section>
        </form>

        <aside className="preview-column">
          <div className="preview-sticky">
            <div className="preview-heading">
              <div>
                <p className="eyebrow">Live output</p>
                <h2>Email signature preview</h2>
              </div>
              <span>{audit.characterCount.toLocaleString()} / 10,000 chars</span>
            </div>

            <div className="preview-stage">
              <div
                ref={previewRef}
                className="signature-preview"
                data-testid="signature-preview"
                dangerouslySetInnerHTML={{ __html: previewHtml }}
              />
            </div>

            {!validation.canCopy && (
              <div className="notice">
                <strong>Production images needed</strong>
                <span>Add public HTTPS URLs for the headshot and banner. Local uploads are preview-only.</span>
              </div>
            )}

            <div className="primary-actions">
              <button type="button" className="primary-button" onClick={copyForGmail} disabled={!validation.canCopy || !audit.safe}>
                Copy for Gmail
              </button>
              <button type="button" className="secondary-button" onClick={download} disabled={!validation.canCopy}>
                Download HTML
              </button>
            </div>

            <p className="status-line" role="status" aria-live="polite">{status}</p>

            <section className="gmail-steps" aria-labelledby="gmail-steps-title">
              <div>
                <p className="eyebrow">Install in Gmail</p>
                <h3 id="gmail-steps-title">Paste once, use everywhere.</h3>
              </div>
              <ol>
                <li><span>1</span><p>Open <strong>Settings → See all settings</strong>.</p></li>
                <li><span>2</span><p>Under <strong>General</strong>, find Signature and create one.</p></li>
                <li><span>3</span><p>Paste the copied signature and choose your defaults.</p></li>
                <li><span>4</span><p>Scroll down and select <strong>Save Changes</strong>.</p></li>
              </ol>
            </section>
          </div>
        </aside>
      </div>
    </main>
  );
}
