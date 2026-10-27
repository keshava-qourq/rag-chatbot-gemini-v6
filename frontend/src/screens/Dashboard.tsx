// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Button, Input, Label, Select, Checkbox, Badge, Table, THead, TBody, TR, TH, TD, Empty } = UI;
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Upload } = Icons;

const MB = 1024 * 1024;
const LIMITS = { documents: 10, bytes: 100 * MB, messages: 200 };
const MAX_FILE_BYTES = 25 * MB;
const SUPPORTED_EXT = ["pdf", "doc", "docx", "ppt", "pptx", "txt", "md"];
const SUPPORTED_COPY =
  "PDF, Word (.doc, .docx), PowerPoint (.ppt, .pptx), plain text (.txt) and markdown (.md)";

// Semantic token for failure only — everything else comes from the brand roles.
const DANGER = "#fb7185";

const INITIAL_DOCUMENTS = [
  {
    id: "doc_8f21",
    name: "Q3 Financial Report.pdf",
    file_type: "pdf",
    size_bytes: 4.2 * MB,
    status: "ready",
    failure_reason: null,
    chunks: 412,
    created_at: "2026-10-26T09:14:00Z",
  },
  {
    id: "doc_3b07",
    name: "Q4 Roadmap Review.pptx",
    file_type: "pptx",
    size_bytes: 7.1 * MB,
    status: "processing",
    failure_reason: null,
    chunks: 0,
    created_at: "2026-10-27T07:48:00Z",
  },
  {
    id: "doc_1c55",
    name: "Scanned notes.pdf",
    file_type: "pdf",
    size_bytes: 1.6 * MB,
    status: "failed",
    failure_reason:
      "No extractable text — this PDF looks like a scan, and OCR isn't supported yet.",
    chunks: 0,
    created_at: "2026-10-24T15:02:00Z",
  },
  {
    id: "doc_6a90",
    name: "Employee Handbook.docx",
    file_type: "docx",
    size_bytes: 2.8 * MB,
    status: "ready",
    failure_reason: null,
    chunks: 268,
    created_at: "2026-10-21T08:31:00Z",
  },
  {
    id: "doc_4d12",
    name: "onboarding-checklist.md",
    file_type: "md",
    size_bytes: 0.8 * MB,
    status: "ready",
    failure_reason: null,
    chunks: 57,
    created_at: "2026-10-19T12:10:00Z",
  },
  {
    id: "doc_9e44",
    name: "Supplier Agreement — Northwind.pdf",
    file_type: "pdf",
    size_bytes: 1.9 * MB,
    status: "ready",
    failure_reason: null,
    chunks: 190,
    created_at: "2026-10-14T10:05:00Z",
  },
];

const INITIAL_SESSIONS = [
  {
    id: "ses_4a90",
    name: "Q3 report questions",
    message_count: 12,
    created_at: "2026-10-26T10:02:00Z",
    documents: ["Q3 Financial Report.pdf"],
  },
  {
    id: "ses_77c1",
    name: "Roadmap vs. budget gaps",
    message_count: 18,
    created_at: "2026-10-25T16:40:00Z",
    documents: ["Q4 Roadmap Review.pptx", "Q3 Financial Report.pdf"],
  },
  {
    id: "ses_21bd",
    name: "Employee handbook Q&A",
    message_count: 5,
    created_at: "2026-10-21T08:55:00Z",
    documents: ["Employee Handbook.docx"],
  },
  {
    id: "ses_5d13",
    name: "Onboarding steps for new hires",
    message_count: 4,
    created_at: "2026-10-18T13:20:00Z",
    documents: ["Employee Handbook.docx", "onboarding-checklist.md"],
  },
  {
    id: "ses_9e02",
    name: "Supplier contract review",
    message_count: 3,
    created_at: "2026-10-14T11:30:00Z",
    documents: ["Supplier Agreement — Northwind.pdf"],
  },
];

const SESSION_WF = { ses_4a90: "i-6-0-0", ses_21bd: "i-6-0-1", ses_9e02: "i-6-0-2" };
const PICKER_WF = { doc_8f21: "i-8-0-1", doc_6a90: "i-8-0-2", doc_1c55: "i-8-0-3" };

const fmtSize = (b) =>
  b >= MB ? (b / MB).toFixed(1) + " MB" : Math.max(1, Math.round(b / 1024)) + " KB";

const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const STYLES = `
.np-glass{
  background: linear-gradient(180deg, rgba(255,255,255,.075), rgba(255,255,255,.035));
  border: 1px solid rgba(255,255,255,.13);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
}
.np-focus:focus-visible{
  outline: 2px solid var(--np-primary);
  outline-offset: 2px;
}
.np-row:hover{ background: rgba(255,255,255,.045); }
.np-file::file-selector-button{
  background: rgba(255,255,255,.12);
  color: #fff;
  border: 0;
  border-radius: 999px;
  padding: 7px 16px;
  margin-right: 14px;
  font-weight: 600;
  font-size: 13px;
  cursor: pointer;
  transition: background .18s ease;
}
.np-file::file-selector-button:hover{ background: rgba(255,255,255,.22); }
@keyframes np-in{ from{ opacity:0; transform: translateY(-6px);} to{ opacity:1; transform:none;} }
@keyframes np-pop{ from{ opacity:0; transform: translateY(10px) scale(.985);} to{ opacity:1; transform:none;} }
@keyframes np-fade{ from{ opacity:0;} to{ opacity:1;} }
@keyframes np-beat{ 0%,100%{ opacity:.35; transform: scale(.8);} 50%{ opacity:1; transform: scale(1.25);} }
@keyframes np-sweep{ 0%{ transform: translateX(-100%);} 100%{ transform: translateX(260%);} }
.np-enter{ animation: np-in .32s ease-out both; }
.np-pop{ animation: np-pop .22s ease-out both; }
.np-fade{ animation: np-fade .2s ease-out both; }
.np-beat{ animation: np-beat 1.4s ease-in-out infinite; }
.np-sweep{ animation: np-sweep 1.6s ease-in-out infinite; }
@media (prefers-reduced-motion: reduce){
  *{ animation: none !important; transition: none !important; }
}
`;

const StatusChip = ({ status }) => {
  const map = {
    ready: { label: "Ready", tone: brand.primaryColor, Icon: Icons.CheckCircle },
    processing: { label: "Processing", tone: brand.accentColor, Icon: Icons.Clock },
    failed: { label: "Failed", tone: DANGER, Icon: Icons.AlertCircle },
  };
  const { label, tone, Icon } = map[status] || map.processing;
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap"
      style={{
        color: tone,
        backgroundColor: tone + "1f",
        border: "1px solid " + tone + "4d",
      }}
    >
      {status === "processing" ? (
        <span
          className="np-beat h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: tone }}
          aria-hidden="true"
        />
      ) : (
        <Icon className="h-3.5 w-3.5" aria-hidden="true" />
      )}
      {label}
    </span>
  );
};

const Meter = ({ label, value, max, suffix, pct }) => (
  <div>
    <div className="flex items-baseline justify-between gap-3">
      <span
        className="text-[11px] uppercase tracking-[0.14em] font-semibold"
        style={{ color: brand.neutralColor }}
      >
        {label}
      </span>
      <span
        className="text-sm font-semibold text-white"
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {value}
        <span style={{ color: brand.neutralColor }} className="font-normal">
          {" "}
          / {max}
          {suffix ? " " + suffix : ""}
        </span>
      </span>
    </div>
    <div
      className="mt-2 h-1.5 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: "rgba(255,255,255,0.09)" }}
    >
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: Math.min(100, pct) + "%",
          backgroundImage: `linear-gradient(90deg, ${brand.primaryColor}, ${brand.accentColor})`,
          boxShadow: `0 0 18px -2px ${brand.accentColor}`,
        }}
      />
    </div>
  </div>
);

export default function Screen() {
  const navigate = useNavigate();
  const [documents, setDocuments] = React.useState(INITIAL_DOCUMENTS);
  const [sessions, setSessions] = React.useState(INITIAL_SESSIONS);

  const [file, setFile] = React.useState(null);
  const [uploadError, setUploadError] = React.useState("");
  const [uploading, setUploading] = React.useState(false);
  const [flash, setFlash] = React.useState(null);

  const [renameTarget, setRenameTarget] = React.useState(null);
  const [renameValue, setRenameValue] = React.useState("");
  const [renameError, setRenameError] = React.useState("");
  const [deleteTarget, setDeleteTarget] = React.useState(null);

  const [sessionOpen, setSessionOpen] = React.useState(false);
  const [sessionName, setSessionName] = React.useState("");
  const [picked, setPicked] = React.useState([]);
  const [sessionError, setSessionError] = React.useState("");

  const messageCount = 42;
  const fileInputRef = React.useRef(null);
  const renameInputRef = React.useRef(null);
  const deleteBtnRef = React.useRef(null);
  const sessionInputRef = React.useRef(null);
  const timers = React.useRef([]);

  const addTimer = (fn, ms) => {
    const t = setTimeout(fn, ms);
    timers.current.push(t);
  };

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const usedBytes = documents.reduce((s, d) => s + d.size_bytes, 0);
  const readyDocs = documents.filter((d) => d.status === "ready");
  const modalOpen = Boolean(renameTarget) || Boolean(deleteTarget) || sessionOpen;

  const closeAll = React.useCallback(() => {
    setRenameTarget(null);
    setRenameError("");
    setDeleteTarget(null);
    setSessionOpen(false);
    setSessionError("");
  }, []);

  React.useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") closeAll();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modalOpen, closeAll]);

  React.useEffect(() => {
    if (renameTarget && renameInputRef.current) renameInputRef.current.focus();
  }, [renameTarget]);
  React.useEffect(() => {
    if (deleteTarget && deleteBtnRef.current) deleteBtnRef.current.focus();
  }, [deleteTarget]);
  React.useEffect(() => {
    if (sessionOpen && sessionInputRef.current) sessionInputRef.current.focus();
  }, [sessionOpen]);

  const say = (text, tone) => {
    setFlash({ text, tone: tone || "good" });
    addTimer(() => setFlash(null), 6000);
  };

  /* ---------------- upload ---------------- */
  function onPickFile(e) {
    const f = e.target.files && e.target.files[0];
    setFile(f || null);
    setUploadError("");
  }

  function onUpload(e) {
    e.preventDefault();
    setFlash(null);
    if (!file) {
      setUploadError("Choose a file first — " + SUPPORTED_COPY + ".");
      return;
    }
    const ext = (file.name.split(".").pop() || "").toLowerCase();
    if (!SUPPORTED_EXT.includes(ext)) {
      setUploadError(
        "We can't read .” + ext + ” files. Supported document types: " + SUPPORTED_COPY + "."
      );
      return;
    }
    if (file.size > MAX_FILE_BYTES) {
      setUploadError(
        file.name + " is " + fmtSize(file.size) + ". The maximum file size is 25 MB."
      );
      return;
    }
    if (documents.length >= LIMITS.documents) {
      setUploadError(
        "You've reached your limit of 10 documents on the free plan. Delete one to make room for " +
          file.name +
          "."
      );
      return;
    }
    if (usedBytes + file.size > LIMITS.bytes) {
      setUploadError(
        "That would put you over your 100 MB storage limit (" +
          fmtSize(usedBytes) +
          " used). Delete a document and try again."
      );
      return;
    }

    setUploading(true);
    const id = "doc_" + Math.random().toString(36).slice(2, 6);
    addTimer(() => {
      setDocuments((prev) => [
        {
          id,
          name: file.name,
          file_type: ext,
          size_bytes: file.size,
          status: "processing",
          failure_reason: null,
          chunks: 0,
          created_at: new Date().toISOString(),
          fresh: true,
        },
        ...prev,
      ]);
      setUploading(false);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
      say(file.name + " queued — parsing and embedding with gemini-embedding-001.");
      addTimer(() => {
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === id
              ? { ...d, status: "ready", chunks: Math.max(24, Math.round(d.size_bytes / 12000)) }
              : d
          )
        );
        say(file.name + " is ready to chat with.");
      }, 3400);
    }, 900);
  }

  /* ---------------- rename ---------------- */
  function openRename(kind, item) {
    setRenameTarget({ kind, id: item.id, name: item.name });
    setRenameValue(item.name);
    setRenameError("");
  }

  function submitRename(e) {
    e.preventDefault();
    if (!renameValue.trim()) {
      setRenameError(
        "Enter a name — " +
          renameTarget.name +
          " keeps its current name until you do."
      );
      return;
    }
    const next = renameValue.trim();
    if (renameTarget.kind === "document") {
      setDocuments((prev) =>
        prev.map((d) => (d.id === renameTarget.id ? { ...d, name: next } : d))
      );
      say("Renamed to " + next + " — citations will use the new name.");
    } else {
      setSessions((prev) =>
        prev.map((s) => (s.id === renameTarget.id ? { ...s, name: next } : s))
      );
      say("Session renamed to " + next + ".");
    }
    setRenameTarget(null);
  }

  /* ---------------- delete ---------------- */
  function confirmDelete() {
    if (deleteTarget.kind === "document") {
      setDocuments((prev) => prev.filter((d) => d.id !== deleteTarget.id));
      setPicked((prev) => prev.filter((id) => id !== deleteTarget.id));
      say(
        deleteTarget.name + " deleted — its chunks and embeddings are gone from the vector store."
      );
    } else {
      setSessions((prev) => prev.filter((s) => s.id !== deleteTarget.id));
      say(deleteTarget.name + " deleted — the documents it used are still in your library.");
    }
    setDeleteTarget(null);
  }

  /* ---------------- new session ---------------- */
  function openSessionModal() {
    setSessionOpen(true);
    setSessionName("");
    setPicked([]);
    setSessionError("");
  }

  function togglePick(docId) {
    setSessionError("");
    setPicked((prev) =>
      prev.includes(docId) ? prev.filter((id) => id !== docId) : [...prev, docId]
    );
  }

  function startSession(e) {
    e.preventDefault();
    if (picked.length === 0) {
      setSessionError("Pick at least one ready document before starting the session.");
      return;
    }
    const name = sessionName.trim() || "Untitled session";
    const names = documents.filter((d) => picked.includes(d.id)).map((d) => d.name);
    setSessions((prev) => [
      {
        id: "ses_" + Math.random().toString(36).slice(2, 6),
        name,
        message_count: 0,
        created_at: new Date().toISOString(),
        documents: names,
      },
      ...prev,
    ]);
    setSessionOpen(false);
    navigate("sessions-id");
  }

  const panelClass =
    "np-glass np-pop relative w-full overflow-hidden text-left";
  const overlayClass =
    "fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 sm:p-6 np-fade";

  const ghostBtn =
    "np-focus inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/70 transition hover:bg-white/15 hover:text-white";

  return (
    <div
      className="relative min-h-full"
      style={{
        "--np-primary": brand.primaryColor,
        "--np-accent": brand.accentColor,
        fontFamily: brand.fontBody,
        color: "#eaf2ff",
      }}
    >
      <style>{STYLES}</style>

      {/* ambient glows */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div
          className="absolute -top-40 -left-24 h-96 w-96 rounded-full opacity-25"
          style={{ background: brand.primaryColor, filter: "blur(120px)" }}
        />
        <div
          className="absolute -top-24 right-0 h-[28rem] w-[28rem] rounded-full opacity-20"
          style={{ background: brand.accentColor, filter: "blur(140px)" }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Row 1 — title */}
        <header data-wf="b-0-0" className="space-y-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <h1
              className="text-[34px] sm:text-[40px] font-extrabold leading-none tracking-tight text-white"
              style={{ fontFamily: brand.fontHeading }}
            >
              Dashboard
            </h1>
            <span
              className="inline-flex items-center gap-2 rounded-full border border-white/12 bg-white/5 px-3 py-1 text-xs"
              style={{ color: brand.neutralColor }}
            >
              <span
                className="np-beat h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: brand.primaryColor }}
                aria-hidden="true"
              />
              Synced 2 minutes ago · updates automatically
            </span>
          </div>
          <div
            className="h-[3px] w-28 rounded-full"
            style={{
              backgroundImage: `linear-gradient(90deg, ${brand.primaryColor}, ${brand.accentColor})`,
              boxShadow: `0 0 28px -4px ${brand.accentColor}`,
            }}
          />
          <p className="max-w-2xl text-sm" style={{ color: brand.neutralColor }}>
            Private to sofia.reyes@northwind.io. Only you can see these documents, sessions and
            messages.
          </p>
        </header>

        {/* live region for action feedback */}
        <div aria-live="polite" className="sr-only">
          {flash ? flash.text : ""}
        </div>
        {flash && (
          <div
            className="np-enter flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm"
            style={{
              borderColor: brand.primaryColor + "59",
              backgroundColor: brand.primaryColor + "14",
              color: "#eaf2ff",
            }}
          >
            <Icons.CheckCircle
              className="mt-0.5 h-4 w-4 shrink-0"
              style={{ color: brand.primaryColor }}
              aria-hidden="true"
            />
            <p>{flash.text}</p>
          </div>
        )}

        {/* Row 2 — usage */}
        <section
          data-wf="b-1-0"
          aria-labelledby="usage-heading"
          className="np-glass rounded-[16px] p-5 sm:p-6"
        >
          <h2 id="usage-heading" className="sr-only">
            Plan usage
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: brand.neutralColor, fontVariantNumeric: "tabular-nums" }}
          >
            <span className="font-semibold text-white">Free at launch — no billing.</span> You have
            used {documents.length} of {LIMITS.documents} documents ({(usedBytes / MB).toFixed(1)} MB
            of 100 MB) and {messageCount} of {LIMITS.messages} messages this month.
          </p>
          <div className="mt-5 grid gap-5 sm:grid-cols-3">
            <Meter
              label="Documents"
              value={documents.length}
              max={LIMITS.documents}
              pct={(documents.length / LIMITS.documents) * 100}
            />
            <Meter
              label="Storage"
              value={(usedBytes / MB).toFixed(1)}
              max={100}
              suffix="MB"
              pct={(usedBytes / LIMITS.bytes) * 100}
            />
            <Meter
              label="Messages this month"
              value={messageCount}
              max={LIMITS.messages}
              pct={(messageCount / LIMITS.messages) * 100}
            />
          </div>
        </section>

        {/* Row 3 — upload */}
        <form
          data-wf="b-2-0"
          onSubmit={onUpload}
          aria-labelledby="upload-heading"
          className="np-glass relative overflow-hidden rounded-[16px] p-5 sm:p-7"
          style={{ boxShadow: `0 28px 70px -40px ${brand.accentColor}` }}
        >
          <div
            className="absolute inset-x-0 top-0 h-[2px]"
            style={{
              backgroundImage: `linear-gradient(90deg, transparent, ${brand.primaryColor}, ${brand.accentColor}, transparent)`,
            }}
            aria-hidden="true"
          />
          <h2
            id="upload-heading"
            className="text-xl font-bold text-white"
            style={{ fontFamily: brand.fontHeading }}
          >
            Upload a document
          </h2>
          <p className="mt-1 text-sm" style={{ color: brand.neutralColor }}>
            We parse it, split it into chunks and embed it with gemini-embedding-001. It becomes
            chattable as soon as it reads <span className="text-white">Ready</span>.
          </p>

          <div className="mt-5 grid gap-4 md:grid-cols-12 md:items-end">
            <div className="md:col-span-9">
              <Label htmlFor="doc-file" className="text-sm font-semibold text-white">
                File — PDF, Word, PowerPoint, text or markdown, max 25 MB
              </Label>
              <input
                data-wf="i-2-0-0"
                id="doc-file"
                ref={fileInputRef}
                type="file"
                onChange={onPickFile}
                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.md"
                aria-describedby="file-help"
                className="np-file np-focus mt-2 w-full cursor-pointer rounded-[16px] border border-white/12 bg-white/5 px-4 py-3 text-sm text-white/80"
              />
              <p id="file-help" className="mt-2 text-xs" style={{ color: brand.neutralColor }}>
                {file
                  ? "Selected: " + file.name + " · " + fmtSize(file.size)
                  : "Scanned-only PDFs can't be read yet — there's no text to embed."}
              </p>
            </div>
            <div className="md:col-span-3">
              <Button
                data-wf="b-2-1"
                type="submit"
                disabled={uploading}
                className="np-focus h-12 w-full rounded-[16px] text-[15px] font-bold transition disabled:cursor-not-allowed disabled:opacity-60"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.accentColor})`,
                  color: brand.backgroundColor,
                  border: "none",
                  boxShadow: `0 0 44px -12px ${brand.accentColor}`,
                }}
              >
                {uploading ? (
                  <span className="inline-flex items-center gap-2">
                    <span
                      className="np-beat h-2 w-2 rounded-full"
                      style={{ backgroundColor: brand.backgroundColor }}
                      aria-hidden="true"
                    />
                    Uploading…
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    <Icons.Plus className="h-4 w-4" aria-hidden="true" />
                    Upload
                  </span>
                )}
              </Button>
            </div>
          </div>

          {uploadError && (
            <p
              role="alert"
              className="np-enter mt-4 flex items-start gap-2 rounded-2xl border px-4 py-3 text-sm"
              style={{
                borderColor: DANGER + "66",
                backgroundColor: DANGER + "1a",
                color: "#ffe9ee",
              }}
            >
              <Icons.AlertCircle
                className="mt-0.5 h-4 w-4 shrink-0"
                style={{ color: DANGER }}
                aria-hidden="true"
              />
              <span>{uploadError}</span>
            </p>
          )}
        </form>

        {/* Row 4 — documents table */}
        <section
          data-wf="b-3-0"
          aria-labelledby="docs-heading"
          className="np-glass overflow-hidden rounded-[16px]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 sm:px-6">
            <div>
              <h2
                id="docs-heading"
                className="text-xl font-bold text-white"
                style={{ fontFamily: brand.fontHeading }}
              >
                My documents
              </h2>
              <p className="mt-1 text-xs" style={{ color: brand.neutralColor }}>
                {documents.length} of {LIMITS.documents} used ·{" "}
                {readyDocs.length} ready to chat with
              </p>
            </div>
            <Badge
              className="rounded-full px-3 py-1 text-xs font-semibold"
              style={{
                backgroundColor: "rgba(255,255,255,0.07)",
                color: brand.neutralColor,
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              Embeddings: gemini-embedding-001
            </Badge>
          </div>

          <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />

          {documents.length > 0 && (
            <React.Fragment>
              {/* desktop table */}
              <div className="hidden md:block">
                <Table
                  className="w-full text-sm"
                  style={{ fontVariantNumeric: "tabular-nums", borderCollapse: "collapse" }}
                >
                  <THead>
                    <TR style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                      <TH
                        data-wf="i-3-0-0"
                        scope="col"
                        className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em]"
                        style={{ color: brand.neutralColor }}
                      >
                        Name
                      </TH>
                      <TH
                        data-wf="i-3-0-1"
                        scope="col"
                        className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em]"
                        style={{ color: brand.neutralColor }}
                      >
                        Type
                      </TH>
                      <TH
                        data-wf="i-3-0-2"
                        scope="col"
                        className="px-4 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.14em]"
                        style={{ color: brand.neutralColor }}
                      >
                        Size
                      </TH>
                      <TH
                        data-wf="i-3-0-3"
                        scope="col"
                        className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em]"
                        style={{ color: brand.neutralColor }}
                      >
                        Status
                      </TH>
                      <TH
                        data-wf="i-3-0-4"
                        scope="col"
                        className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-[0.14em]"
                        style={{ color: brand.neutralColor }}
                      >
                        Uploaded
                      </TH>
                      <TH
                        data-wf="i-3-0-5"
                        scope="col"
                        className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-[0.14em]"
                        style={{ color: brand.neutralColor }}
                      >
                        Actions
                      </TH>
                    </TR>
                  </THead>
                  <TBody>
                    {documents.map((doc) => (
                      <TR
                        key={doc.id}
                        className={"np-row transition" + (doc.fresh ? " np-enter" : "")}
                        style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                      >
                        <TD className="px-6 py-4 align-top">
                          <span className="block font-semibold text-white">{doc.name}</span>
                          <span className="mt-1 block text-xs" style={{ color: brand.neutralColor }}>
                            {doc.status === "ready"
                              ? doc.chunks + " chunks embedded"
                              : doc.status === "processing"
                              ? "Parsing and embedding…"
                              : doc.failure_reason}
                          </span>
                          {doc.status === "processing" && (
                            <span
                              className="mt-2 block h-1 w-32 overflow-hidden rounded-full"
                              style={{ backgroundColor: "rgba(255,255,255,0.09)" }}
                              aria-hidden="true"
                            >
                              <span
                                className="np-sweep block h-full w-1/3 rounded-full"
                                style={{
                                  backgroundImage: `linear-gradient(90deg, ${brand.primaryColor}, ${brand.accentColor})`,
                                }}
                              />
                            </span>
                          )}
                        </TD>
                        <TD className="px-4 py-4 align-top uppercase" style={{ color: brand.neutralColor }}>
                          {doc.file_type}
                        </TD>
                        <TD className="px-4 py-4 text-right align-top text-white/90">
                          {fmtSize(doc.size_bytes)}
                        </TD>
                        <TD className="px-4 py-4 align-top">
                          <StatusChip status={doc.status} />
                        </TD>
                        <TD className="px-4 py-4 align-top" style={{ color: brand.neutralColor }}>
                          {fmtDate(doc.created_at)}
                        </TD>
                        <TD className="px-6 py-4 align-top">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              className={ghostBtn}
                              title={"Rename " + doc.name}
                              aria-label={"Rename " + doc.name}
                              onClick={() => openRename("document", doc)}
                            >
                              <Icons.Edit className="h-4 w-4" aria-hidden="true" />
                            </button>
                            <button
                              type="button"
                              className={ghostBtn}
                              title={"Delete " + doc.name}
                              aria-label={"Delete " + doc.name}
                              onClick={() => setDeleteTarget({ kind: "document", ...doc })}
                            >
                              <Icons.Trash className="h-4 w-4" aria-hidden="true" />
                            </button>
                          </div>
                        </TD>
                      </TR>
                    ))}
                  </TBody>
                </Table>
              </div>

              {/* mobile cards */}
              <ul className="md:hidden divide-y" style={{ borderColor: "rgba(255,255,255,0.08)" }}>
                {documents.map((doc) => (
                  <li
                    key={doc.id}
                    className={"px-5 py-4" + (doc.fresh ? " np-enter" : "")}
                    style={{ borderTop: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-semibold text-white">{doc.name}</p>
                        <p
                          className="mt-1 text-xs"
                          style={{ color: brand.neutralColor, fontVariantNumeric: "tabular-nums" }}
                        >
                          {doc.file_type.toUpperCase()} · {fmtSize(doc.size_bytes)} ·{" "}
                          {fmtDate(doc.created_at)}
                        </p>
                      </div>
                      <StatusChip status={doc.status} />
                    </div>
                    {doc.status === "failed" && (
                      <p className="mt-2 text-xs" style={{ color: DANGER }}>
                        {doc.failure_reason}
                      </p>
                    )}
                    <div className="mt-3 flex gap-2">
                      <button
                        type="button"
                        className="np-focus rounded-full border border-white/12 bg-white/5 px-4 py-2 text-xs font-semibold text-white/85 transition hover:bg-white/15"
                        onClick={() => openRename("document", doc)}
                      >
                        Rename
                      </button>
                      <button
                        type="button"
                        className="np-focus rounded-full border px-4 py-2 text-xs font-semibold transition hover:bg-white/10"
                        style={{ borderColor: DANGER + "59", color: DANGER }}
                        onClick={() => setDeleteTarget({ kind: "document", ...doc })}
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </React.Fragment>
          )}

          {/* Row 5 — documents empty state */}
          {documents.length === 0 && (
            <div data-wf="b-4-0" className="np-fade px-5 py-12 sm:px-8">
              <Empty
                title="Your library is empty"
                description="No documents yet — upload a PDF, Word, PowerPoint, text or markdown file to start chatting with it."
                action={
                  <Button
                    type="button"
                    onClick={() => fileInputRef.current && fileInputRef.current.focus()}
                    className="np-focus rounded-[16px] px-5 py-2.5 text-sm font-bold"
                    style={{
                      backgroundImage: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.accentColor})`,
                      color: brand.backgroundColor,
                      border: "none",
                    }}
                  >
                    Choose a file to upload
                  </Button>
                }
              />
            </div>
          )}
        </section>

        {/* Row 7 — chat sessions */}
        <div className="grid gap-4 md:grid-cols-12 md:items-start">
          <section
            data-wf="b-6-0"
            aria-labelledby="sessions-heading"
            className="np-glass overflow-hidden rounded-[16px] md:col-span-8"
          >
            <div className="flex items-center justify-between gap-3 px-5 py-4 sm:px-6">
              <h2
                id="sessions-heading"
                className="text-xl font-bold text-white"
                style={{ fontFamily: brand.fontHeading }}
              >
                Chat sessions
              </h2>
              <span
                className="text-xs"
                style={{ color: brand.neutralColor, fontVariantNumeric: "tabular-nums" }}
              >
                {sessions.length} {sessions.length === 1 ? "session" : "sessions"}
              </span>
            </div>
            <div style={{ height: 1, backgroundColor: "rgba(255,255,255,0.1)" }} />

            {sessions.length > 0 ? (
              <ul>
                {sessions.map((s) => (
                  <li
                    key={s.id}
                    className="np-row flex items-center gap-2 px-3 py-2 transition sm:px-4"
                    style={{ borderBottom: "1px solid rgba(255,255,255,0.07)" }}
                  >
                    <button
                      type="button"
                      data-wf={SESSION_WF[s.id]}
                      onClick={() => navigate("sessions-id")}
                      className="np-focus group flex min-w-0 flex-1 items-center gap-3 rounded-[14px] px-3 py-3 text-left transition"
                    >
                      <span
                        className="hidden h-9 w-9 shrink-0 items-center justify-center rounded-full sm:flex"
                        style={{
                          backgroundColor: brand.accentColor + "1f",
                          border: "1px solid " + brand.accentColor + "40",
                        }}
                        aria-hidden="true"
                      >
                        <Icons.FileText className="h-4 w-4" style={{ color: brand.accentColor }} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-semibold text-white">{s.name}</span>
                        <span
                          className="mt-0.5 block truncate text-xs"
                          style={{
                            color: brand.neutralColor,
                            fontVariantNumeric: "tabular-nums",
                          }}
                        >
                          {s.message_count} {s.message_count === 1 ? "message" : "messages"} ·{" "}
                          {fmtDate(s.created_at)} · {s.documents.join(", ")}
                        </span>
                      </span>
                      <Icons.ChevronRight
                        className="h-4 w-4 shrink-0 transition group-hover:translate-x-1"
                        style={{ color: brand.primaryColor }}
                        aria-hidden="true"
                      />
                    </button>
                    <button
                      type="button"
                      className={ghostBtn}
                      title={"Rename session " + s.name}
                      aria-label={"Rename session " + s.name}
                      onClick={() => openRename("session", s)}
                    >
                      <Icons.Edit className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                      type="button"
                      className={ghostBtn}
                      title={"Delete session " + s.name}
                      aria-label={"Delete session " + s.name}
                      onClick={() => setDeleteTarget({ kind: "session", ...s })}
                    >
                      <Icons.Trash className="h-4 w-4" aria-hidden="true" />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              /* Row 8 — sessions empty state */
              <div data-wf="b-7-0" className="np-fade px-5 py-12 sm:px-8">
                <Empty
                  title="No conversations yet"
                  description="No chat sessions yet — start a new session and pick the documents you want to ask about."
                  action={
                    <Button
                      type="button"
                      onClick={openSessionModal}
                      className="np-focus rounded-[16px] px-5 py-2.5 text-sm font-bold"
                      style={{
                        backgroundImage: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.accentColor})`,
                        color: brand.backgroundColor,
                        border: "none",
                      }}
                    >
                      New chat session
                    </Button>
                  }
                />
              </div>
            )}
          </section>

          <div className="md:col-span-4">
            <Button
              data-wf="b-6-1"
              type="button"
              onClick={openSessionModal}
              className="np-focus h-12 w-full rounded-[16px] text-[15px] font-bold transition hover:bg-white/10"
              style={{
                backgroundColor: "rgba(255,255,255,0.06)",
                border: "1px solid " + brand.accentColor + "66",
                color: "#ffffff",
              }}
            >
              <span className="inline-flex items-center gap-2">
                <Icons.Plus className="h-4 w-4" style={{ color: brand.accentColor }} aria-hidden="true" />
                New chat session
              </span>
            </Button>
            <p className="mt-3 px-1 text-xs leading-relaxed" style={{ color: brand.neutralColor }}>
              {readyDocs.length > 0
                ? "Answers come from gemini-2.5-flash, grounded only in the documents you pick."
                : "You'll need at least one ready document before a session can answer questions."}
            </p>
          </div>
        </div>
      </div>

      {/* Row 6 — rename modal */}
      {renameTarget && (
        <div
          className={overlayClass}
          style={{ backgroundColor: "rgba(3,9,22,0.72)", backdropFilter: "blur(6px)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeAll();
          }}
        >
          <form
            data-wf="b-5-0"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rename-title"
            onSubmit={submitRename}
            className={panelClass + " max-w-lg rounded-[16px] p-6"}
            style={{ boxShadow: `0 40px 90px -30px ${brand.accentColor}` }}
          >
            <h2
              id="rename-title"
              className="text-lg font-bold text-white"
              style={{ fontFamily: brand.fontHeading }}
            >
              {renameTarget.kind === "document" ? "Rename document" : "Rename chat session"}
            </h2>
            <p className="mt-1 text-sm" style={{ color: brand.neutralColor }}>
              {renameTarget.kind === "document"
                ? "The new name shows everywhere this document is listed, including answer citations."
                : "The new name shows in your sessions list."}
            </p>

            <div className="mt-5">
              <Label htmlFor="rename-input" className="text-sm font-semibold text-white">
                Name
              </Label>
              <Input
                data-wf="i-5-0-0"
                id="rename-input"
                ref={renameInputRef}
                value={renameValue}
                onChange={(e) => {
                  setRenameValue(e.target.value);
                  setRenameError("");
                }}
                aria-invalid={renameError ? "true" : "false"}
                aria-describedby={renameError ? "rename-error" : undefined}
                className="np-focus mt-2 w-full rounded-[16px] border px-4 py-3 text-sm text-white"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderColor: renameError ? DANGER : "rgba(255,255,255,0.14)",
                }}
              />
              {renameError && (
                <p
                  id="rename-error"
                  role="alert"
                  className="mt-2 flex items-start gap-2 text-sm"
                  style={{ color: DANGER }}
                >
                  <Icons.AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                  {renameError}
                </p>
              )}
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                data-wf="i-5-0-2"
                type="button"
                onClick={closeAll}
                className="np-focus rounded-[16px] px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "#ffffff",
                }}
              >
                Cancel
              </Button>
              <Button
                data-wf="i-5-0-1"
                type="submit"
                className="np-focus rounded-[16px] px-6 py-2.5 text-sm font-bold"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.accentColor})`,
                  color: brand.backgroundColor,
                  border: "none",
                }}
              >
                Save
              </Button>
            </div>
          </form>
        </div>
      )}

      {/* Row 6 — delete modal */}
      {deleteTarget && (
        <div
          className={overlayClass}
          style={{ backgroundColor: "rgba(3,9,22,0.72)", backdropFilter: "blur(6px)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeAll();
          }}
        >
          <div
            data-wf="b-5-1"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-title"
            aria-describedby="delete-desc"
            className={panelClass + " max-w-lg rounded-[16px] p-6"}
            style={{ boxShadow: `0 40px 90px -30px ${DANGER}` }}
          >
            <h2
              id="delete-title"
              className="text-lg font-bold text-white"
              style={{ fontFamily: brand.fontHeading }}
            >
              {deleteTarget.kind === "document" ? "Delete document?" : "Delete chat session?"}
            </h2>
            <p
              data-wf="i-5-1-0"
              id="delete-desc"
              className="mt-2 text-sm leading-relaxed"
              style={{ color: brand.neutralColor }}
            >
              {deleteTarget.kind === "document" ? (
                <React.Fragment>
                  Deletes <span className="font-semibold text-white">{deleteTarget.name}</span>, its
                  chunks and its embeddings. This cannot be undone.
                </React.Fragment>
              ) : (
                <React.Fragment>
                  Deletes <span className="font-semibold text-white">{deleteTarget.name}</span> and
                  its {deleteTarget.message_count} messages. The documents it used stay in your
                  library. This cannot be undone.
                </React.Fragment>
              )}
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                data-wf="i-5-1-2"
                type="button"
                onClick={closeAll}
                className="np-focus rounded-[16px] px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "#ffffff",
                }}
              >
                Cancel
              </Button>
              <Button
                data-wf="i-5-1-1"
                ref={deleteBtnRef}
                type="button"
                onClick={confirmDelete}
                className="np-focus rounded-[16px] px-6 py-2.5 text-sm font-bold transition"
                style={{ backgroundColor: DANGER, color: "#2b0712", border: "none" }}
              >
                {deleteTarget.kind === "document" ? "Delete document" : "Delete session"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Row 9 — new chat session modal */}
      {sessionOpen && (
        <div
          className={overlayClass}
          style={{ backgroundColor: "rgba(3,9,22,0.72)", backdropFilter: "blur(6px)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeAll();
          }}
        >
          <form
            data-wf="b-8-0"
            role="dialog"
            aria-modal="true"
            aria-labelledby="new-session-title"
            onSubmit={startSession}
            className={panelClass + " max-h-[88vh] max-w-2xl overflow-y-auto rounded-[16px] p-6"}
            style={{ boxShadow: `0 40px 90px -30px ${brand.primaryColor}` }}
          >
            <h2
              id="new-session-title"
              className="text-lg font-bold text-white"
              style={{ fontFamily: brand.fontHeading }}
            >
              New chat session
            </h2>
            <p className="mt-1 text-sm" style={{ color: brand.neutralColor }}>
              Answers in this session are grounded only in the documents you select here.
            </p>

            <div className="mt-5">
              <Label htmlFor="session-name" className="text-sm font-semibold text-white">
                Session name
              </Label>
              <Input
                data-wf="i-8-0-0"
                id="session-name"
                ref={sessionInputRef}
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
                placeholder="Q3 report questions"
                className="np-focus mt-2 w-full rounded-[16px] border px-4 py-3 text-sm text-white placeholder:text-white/35"
                style={{
                  backgroundColor: "rgba(255,255,255,0.06)",
                  borderColor: "rgba(255,255,255,0.14)",
                }}
              />
            </div>

            <fieldset className="mt-6">
              <legend className="text-sm font-semibold text-white">Documents in this session</legend>
              {documents.length === 0 ? (
                <p
                  className="mt-3 rounded-[16px] border border-dashed px-4 py-6 text-sm"
                  style={{ borderColor: "rgba(255,255,255,0.18)", color: brand.neutralColor }}
                >
                  Nothing to select yet — upload a document first, and it'll appear here once it's
                  ready.
                </p>
              ) : (
                <ul className="mt-3 space-y-2">
                  {documents.map((doc) => {
                    const selectable = doc.status === "ready";
                    const checked = picked.includes(doc.id);
                    return (
                      <li key={doc.id}>
                        <div
                          className="flex items-center gap-3 rounded-[16px] border px-4 py-3 transition"
                          style={{
                            borderColor: checked
                              ? brand.primaryColor + "80"
                              : "rgba(255,255,255,0.12)",
                            backgroundColor: checked
                              ? brand.primaryColor + "14"
                              : "rgba(255,255,255,0.04)",
                            opacity: selectable ? 1 : 0.6,
                          }}
                        >
                          <Checkbox
                            data-wf={PICKER_WF[doc.id]}
                            id={"pick-" + doc.id}
                            checked={checked}
                            disabled={!selectable}
                            onChange={() => togglePick(doc.id)}
                            className="np-focus h-5 w-5 shrink-0 accent-current"
                            style={{ color: brand.primaryColor }}
                          />
                          <Label
                            htmlFor={"pick-" + doc.id}
                            className={
                              "min-w-0 flex-1 text-sm " +
                              (selectable ? "cursor-pointer text-white" : "text-white/70")
                            }
                          >
                            <span className="block truncate font-semibold">{doc.name}</span>
                            <span className="mt-0.5 block text-xs" style={{ color: brand.neutralColor }}>
                              {doc.status === "ready"
                                ? "ready · " + doc.chunks + " chunks"
                                : doc.status === "processing"
                                ? "processing, cannot be selected yet"
                                : "failed, cannot be selected — " + doc.failure_reason}
                            </span>
                          </Label>
                          <StatusChip status={doc.status} />
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </fieldset>

            <p
              data-wf="i-8-0-4"
              role={sessionError ? "alert" : undefined}
              className="mt-4 flex items-start gap-2 text-sm"
              style={{ color: sessionError ? DANGER : brand.neutralColor }}
            >
              {sessionError ? (
                <Icons.AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
              ) : (
                <Icons.Check
                  className="mt-0.5 h-4 w-4 shrink-0"
                  style={{ color: picked.length ? brand.primaryColor : brand.neutralColor }}
                  aria-hidden="true"
                />
              )}
              <span>
                {sessionError
                  ? sessionError
                  : picked.length > 0
                  ? picked.length +
                    (picked.length === 1 ? " document selected" : " documents selected")
                  : "Select at least one ready document"}
              </span>
            </p>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <Button
                type="button"
                onClick={closeAll}
                className="np-focus rounded-[16px] px-5 py-2.5 text-sm font-semibold transition hover:bg-white/10"
                style={{
                  backgroundColor: "transparent",
                  border: "1px solid rgba(255,255,255,0.16)",
                  color: "#ffffff",
                }}
              >
                Cancel
              </Button>
              <Button
                data-wf="b-8-1"
                type="submit"
                disabled={picked.length === 0}
                className="np-focus rounded-[16px] px-6 py-2.5 text-sm font-bold transition disabled:cursor-not-allowed disabled:opacity-50"
                style={{
                  backgroundImage: `linear-gradient(135deg, ${brand.primaryColor}, ${brand.accentColor})`,
                  color: brand.backgroundColor,
                  border: "none",
                  boxShadow:
                    picked.length > 0 ? `0 0 44px -12px ${brand.accentColor}` : "none",
                }}
              >
                Start session
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
