// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { Edit } = Icons;

const SESSION = { id: "ses_8d31f0", name: "Q3 report questions", created_at: "24 Oct 2026" };

const DOCS = [
  { id: "doc_7f21ab", name: "Q3 Financial Report.pdf", file_type: "pdf" },
  { id: "doc_9c04de", name: "Employee Handbook.docx", file_type: "docx" },
];

const MESSAGE_LIMIT = 200;

const INITIAL_MESSAGES = [
  { id: "msg_4101", wf: "i-2-0-0", role: "user", content: "What was revenue in Q3?", time: "10:02" },
  {
    id: "msg_4102",
    wf: "i-2-0-1",
    role: "assistant",
    content: "Q3 revenue was £4.2m, up 11% on Q2.",
    time: "10:02",
    citations: ["Q3 Financial Report.pdf"],
  },
  { id: "msg_4103", wf: "i-2-0-2", role: "user", content: "And how did that compare to the forecast?", time: "10:04" },
  {
    id: "msg_4104",
    wf: "i-2-0-3",
    role: "assistant",
    content: "It came in 3% above the £4.08m forecast.",
    time: "10:04",
    citations: ["Q3 Financial Report.pdf"],
  },
  { id: "msg_4105", wf: "i-2-0-4", role: "user", content: "What is the parental leave policy in France?", time: "10:07" },
  {
    id: "msg_4106",
    wf: "i-2-0-5",
    role: "assistant",
    content: "I can't find the answer to that in the selected documents.",
    time: "10:07",
    citations: [],
    notFound: true,
  },
];

const KNOWLEDGE = [
  {
    keys: ["revenue", "turnover", "sales", "top line"],
    answer:
      "Q3 revenue was £4.2m, up 11% on Q2's £3.78m. Subscription revenue made up £3.1m of the total and professional services £1.1m.",
    citations: ["Q3 Financial Report.pdf"],
  },
  {
    keys: ["forecast", "budget", "plan", "target"],
    answer:
      "Q3 landed 3% above the £4.08m forecast. Two enterprise renewals closed in September rather than slipping into Q4, which accounts for most of the variance.",
    citations: ["Q3 Financial Report.pdf"],
  },
  {
    keys: ["margin", "gross", "cost of sales"],
    answer:
      "Gross margin held at 74% in Q3, a point below Q2, mainly because of higher inference costs on the new document pipeline.",
    citations: ["Q3 Financial Report.pdf"],
  },
  {
    keys: ["churn", "retention", "renewal", "nrr"],
    answer:
      "Net revenue retention was 112% for Q3. Logo churn was 1.8%, with three accounts lost in the SMB tier and none in enterprise.",
    citations: ["Q3 Financial Report.pdf"],
  },
  {
    keys: ["cash", "runway", "burn"],
    answer: "Cash at the end of Q3 was £9.6m, which is 19 months of runway at the current monthly burn of £505k.",
    citations: ["Q3 Financial Report.pdf"],
  },
  {
    keys: ["headcount", "hire", "hiring", "staff", "team size", "employees"],
    answer:
      "Headcount closed Q3 at 148, a net increase of 9 on Q2. New joiners complete the onboarding checklist within their first two weeks.",
    citations: ["Q3 Financial Report.pdf", "Employee Handbook.docx"],
  },
  {
    keys: ["holiday", "annual leave", "time off", "vacation", "pto"],
    answer:
      "Full-time employees receive 25 days of annual leave plus public holidays. Up to 5 unused days can be carried into the next year with your manager's approval.",
    citations: ["Employee Handbook.docx"],
  },
  {
    keys: ["remote", "hybrid", "office", "work from home"],
    answer:
      "The handbook sets a hybrid default of two days a week in the office, agreed with your line manager. Fully remote arrangements need director approval.",
    citations: ["Employee Handbook.docx"],
  },
  {
    keys: ["expense", "travel", "receipt"],
    answer:
      "Expenses must be submitted within 30 days with a receipt attached. Anything above £250, including travel, needs prior written approval from your manager.",
    citations: ["Employee Handbook.docx"],
  },
  {
    keys: ["notice", "probation", "resign"],
    answer:
      "Probation runs for three months with a one-week notice period on either side. After probation, notice is one month for all roles below director level.",
    citations: ["Employee Handbook.docx"],
  },
];

const findAnswer = (question) => {
  const q = question.toLowerCase();
  const hit = KNOWLEDGE.find((entry) => entry.keys.some((k) => q.includes(k)));
  if (hit) return { content: hit.answer, citations: hit.citations, notFound: false };
  return {
    content: "I can't find the answer to that in the selected documents.",
    citations: [],
    notFound: true,
  };
};

export default function Screen() {
  const navigate = useNavigate();
  const hairline = "1px solid rgba(255,255,255,0.14)";
  const glass = {
    backgroundColor: "rgba(255,255,255,0.06)",
    border: hairline,
    borderRadius: brand.radius,
  };
  const ink = "rgba(255,255,255,0.93)";
  const muted = brand.neutralColor;

  const [sessionName, setSessionName] = React.useState(SESSION.name);
  const [messages, setMessages] = React.useState(INITIAL_MESSAGES);
  const [draft, setDraft] = React.useState("");
  const [pending, setPending] = React.useState(false);
  const [sendError, setSendError] = React.useState(null);
  const [formError, setFormError] = React.useState("");
  const [used, setUsed] = React.useState(42);
  const [renameOpen, setRenameOpen] = React.useState(false);
  const [renameValue, setRenameValue] = React.useState(SESSION.name);
  const [renameError, setRenameError] = React.useState("");
  const [renamedFlash, setRenamedFlash] = React.useState(false);

  const attempts = React.useRef(0);
  const timers = React.useRef([]);
  const streamRef = React.useRef(null);
  const draftRef = React.useRef(null);
  const renameInputRef = React.useRef(null);
  const renameBtnRef = React.useRef(null);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  React.useEffect(() => {
    if (streamRef.current) streamRef.current.scrollTop = streamRef.current.scrollHeight;
  }, [messages.length, pending, sendError]);

  React.useEffect(() => {
    if (renameOpen && renameInputRef.current) renameInputRef.current.focus();
  }, [renameOpen]);

  const limitReached = used >= MESSAGE_LIMIT;
  const clock = () => {
    const d = new Date();
    return String(d.getHours()).padStart(2, "0") + ":" + String(d.getMinutes()).padStart(2, "0");
  };

  const ask = (text, isRetry) => {
    setSendError(null);
    setFormError("");
    if (!isRetry) {
      attempts.current += 1;
      setMessages((prev) => [
        ...prev,
        { id: "msg_" + (4200 + prev.length), role: "user", content: text, time: clock(), fresh: true },
      ]);
      setUsed((u) => Math.min(MESSAGE_LIMIT, u + 1));
    }
    setPending(true);
    const willFail = !isRetry && attempts.current % 3 === 0;
    const t = setTimeout(() => {
      setPending(false);
      if (willFail) {
        setSendError({ question: text });
        return;
      }
      const reply = findAnswer(text);
      setMessages((prev) => [
        ...prev,
        { id: "msg_" + (4300 + prev.length), role: "assistant", time: clock(), fresh: true, ...reply },
      ]);
    }, 1200);
    timers.current.push(t);
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (pending || limitReached) return;
    const text = draft.trim();
    if (!text) {
      setFormError("Type a question first — answers come only from the documents in this session.");
      if (draftRef.current) draftRef.current.focus();
      return;
    }
    setDraft("");
    ask(text, false);
  };

  const saveRename = (e) => {
    e.preventDefault();
    const next = renameValue.trim();
    if (!next) {
      setRenameError("A session needs a name. The current name has been kept.");
      if (renameInputRef.current) renameInputRef.current.focus();
      return;
    }
    setSessionName(next);
    setRenameOpen(false);
    setRenameError("");
    setRenamedFlash(true);
    const t = setTimeout(() => setRenamedFlash(false), 3200);
    timers.current.push(t);
    if (renameBtnRef.current) renameBtnRef.current.focus();
  };

  const closeRename = () => {
    setRenameOpen(false);
    setRenameError("");
    setRenameValue(sessionName);
    if (renameBtnRef.current) renameBtnRef.current.focus();
  };

  const css = `
    @keyframes np-rise { from { opacity:0; transform: translateY(10px) } to { opacity:1; transform:none } }
    @keyframes np-dot { 0%,80%,100% { opacity:.25; transform:translateY(0) } 40% { opacity:1; transform:translateY(-3px) } }
    @keyframes np-fade { from { opacity:0 } to { opacity:1 } }
    .np-rise { animation: np-rise .3s cubic-bezier(.2,.7,.3,1) both }
    .np-fade { animation: np-fade .25s ease-out both }
    .np-dot { animation: np-dot 1.1s infinite ease-in-out }
    .np-f:focus-visible { outline: 2px solid ${brand.primaryColor}; outline-offset: 2px; border-radius: ${brand.radius} }
    .np-stream::-webkit-scrollbar { width: 8px }
    .np-stream::-webkit-scrollbar-thumb { background: rgba(255,255,255,.14); border-radius: 8px }
    @media (prefers-reduced-motion: reduce) {
      .np-rise, .np-fade, .np-dot { animation: none !important }
      .np-t { transition: none !important }
    }
  `;

  const ghostBtn = {
    ...glass,
    color: ink,
    minHeight: 44,
    fontWeight: 600,
    backgroundColor: "rgba(255,255,255,0.05)",
  };

  const Chip = ({ children, tone }) => (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 text-[12px] font-semibold np-t"
      style={{
        borderRadius: 999,
        color: tone === "accent" ? brand.accentColor : brand.primaryColor,
        backgroundColor: tone === "accent" ? "rgba(232,121,249,0.12)" : "rgba(34,211,238,0.12)",
        border: "1px solid " + (tone === "accent" ? "rgba(232,121,249,0.35)" : "rgba(34,211,238,0.35)"),
      }}
    >
      {children}
    </span>
  );

  return (
    <div
      className="min-h-full w-full"
      style={{ backgroundColor: brand.backgroundColor, fontFamily: brand.fontBody, color: ink }}
    >
      <style>{css}</style>

      <div className="mx-auto w-full max-w-[1100px] px-4 py-8 sm:px-6 lg:px-8">
        {/* Row 1 — header */}
        <div className="grid grid-cols-12 items-start gap-3">
          <div className="col-span-2 md:col-span-1" data-wf="b-0-0">
            <UI.Button
              type="button"
              onClick={() => navigate("dashboard")}
              aria-label="Back to dashboard"
              className="np-f np-t inline-flex h-11 w-11 items-center justify-center hover:brightness-125"
              style={{ ...ghostBtn, padding: 0 }}
            >
              <Icons.ArrowLeft className="h-5 w-5" aria-hidden="true" />
            </UI.Button>
          </div>

          <div className="col-span-10 md:col-span-7" data-wf="b-0-1">
            <h1
              className="text-[30px] font-extrabold leading-tight tracking-tight sm:text-[36px]"
              style={{ fontFamily: brand.fontHeading }}
            >
              {sessionName}
            </h1>
            <p className="mt-1.5 text-[13px]" style={{ color: muted, fontVariantNumeric: "tabular-nums" }}>
              Session {SESSION.id} · started {SESSION.created_at} · {messages.length} messages · private to your account
            </p>
            {renamedFlash && (
              <p
                className="np-fade mt-2 inline-flex items-center gap-1.5 text-[13px] font-semibold"
                role="status"
                style={{ color: brand.primaryColor }}
              >
                <Icons.CheckCircle className="h-4 w-4" aria-hidden="true" />
                Session renamed. The new name shows in your sessions list.
              </p>
            )}
          </div>

          <div className="col-span-6 md:col-span-2">
            <UI.Button
              ref={renameBtnRef}
              type="button"
              data-wf="b-0-2"
              onClick={() => {
                setRenameValue(sessionName);
                setRenameError("");
                setRenameOpen(true);
              }}
              className="np-f np-t inline-flex w-full items-center justify-center gap-2 px-4 hover:brightness-125"
              style={ghostBtn}
            >
              <Icons.Edit className="h-4 w-4" aria-hidden="true" />
              Rename
            </UI.Button>
          </div>

          <div className="col-span-6 md:col-span-2">
            <UI.Button
              type="button"
              data-wf="b-0-3"
              onClick={() => navigate("dashboard")}
              className="np-f np-t inline-flex w-full items-center justify-center gap-2 px-4 hover:brightness-110"
              style={{
                ...ghostBtn,
                color: brand.accentColor,
                border: "1px solid rgba(232,121,249,0.4)",
                backgroundColor: "rgba(232,121,249,0.08)",
              }}
            >
              <Icons.Trash className="h-4 w-4" aria-hidden="true" />
              Delete session
            </UI.Button>
          </div>
        </div>

        {/* Row 2 — scope */}
        <div
          data-wf="b-1-0"
          className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3"
          style={{ ...glass, backgroundColor: "rgba(255,255,255,0.04)" }}
        >
          <span className="text-[13px] font-semibold uppercase tracking-[0.12em]" style={{ color: muted }}>
            Answering from:
          </span>
          <ul className="flex flex-wrap items-center gap-2">
            {DOCS.map((d) => (
              <li key={d.id}>
                <Chip>
                  <Icons.FileText className="h-3.5 w-3.5" aria-hidden="true" />
                  {d.name}
                </Chip>
              </li>
            ))}
          </ul>
          <span className="ml-auto inline-flex items-center gap-1.5 text-[12px]" style={{ color: muted }}>
            <Icons.Clock className="h-3.5 w-3.5" aria-hidden="true" />
            <span style={{ fontVariantNumeric: "tabular-nums" }}>Synced 10:07 · gemini-2.5-flash</span>
          </span>
        </div>

        {/* Row 3 — conversation */}
        <section
          data-wf="b-2-0"
          className="relative mt-6 overflow-hidden"
          style={{ ...glass, backdropFilter: "blur(14px)" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full"
            style={{ background: brand.primaryColor, opacity: 0.1, filter: "blur(70px)" }}
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-28 right-0 h-64 w-64 rounded-full"
            style={{ background: brand.accentColor, opacity: 0.1, filter: "blur(80px)" }}
          />

          <div className="relative flex items-center justify-between px-5 py-4" style={{ borderBottom: hairline }}>
            <h2 className="text-[13px] font-bold uppercase tracking-[0.16em]" style={{ color: muted }}>
              Conversation
            </h2>
            <span className="text-[12px]" style={{ color: muted, fontVariantNumeric: "tabular-nums" }}>
              {messages.filter((m) => m.role === "assistant").length} grounded answers
            </span>
          </div>

          <div
            ref={streamRef}
            className="np-stream relative max-h-[52vh] min-h-[320px] overflow-y-auto px-4 py-6 sm:px-6"
          >
            {messages.length === 0 ? (
              <UI.Empty
                title="No questions yet in this session"
                description="Ask something that your selected documents can answer — a figure, a policy, a date — and the answer will appear here with its source."
              />
            ) : (
              <ol className="flex flex-col gap-5">
                {messages.map((m) => {
                  const mine = m.role === "user";
                  return (
                    <li
                      key={m.id}
                      data-wf={m.wf}
                      className={(m.fresh ? "np-rise " : "") + "flex " + (mine ? "justify-end" : "justify-start")}
                    >
                      <div className={"max-w-[90%] sm:max-w-[76%] " + (mine ? "text-right" : "text-left")}>
                        <p
                          className="mb-1.5 text-[12px] font-bold uppercase tracking-[0.14em]"
                          style={{ color: mine ? brand.primaryColor : brand.accentColor, fontVariantNumeric: "tabular-nums" }}
                        >
                          {mine ? "You" : "Assistant"} · {m.time}
                        </p>

                        {mine ? (
                          <p
                            className="px-4 py-3 text-[15px] leading-relaxed"
                            style={{
                              borderRadius: brand.radius,
                              backgroundColor: "rgba(34,211,238,0.10)",
                              border: "1px solid rgba(34,211,238,0.32)",
                              color: ink,
                            }}
                          >
                            {m.content}
                          </p>
                        ) : (
                          <div className="flex gap-3">
                            <span
                              aria-hidden="true"
                              className="mt-1 w-[3px] shrink-0 rounded-full"
                              style={{
                                background: m.notFound
                                  ? "rgba(255,255,255,0.18)"
                                  : "linear-gradient(180deg," + brand.primaryColor + "," + brand.accentColor + ")",
                              }}
                            />
                            <div
                              className="px-4 py-3"
                              style={{
                                ...glass,
                                backgroundColor: m.notFound ? "rgba(255,255,255,0.035)" : "rgba(255,255,255,0.07)",
                              }}
                            >
                              <p className="text-[15px] leading-relaxed" style={{ color: ink }}>
                                {m.notFound && (
                                  <Icons.AlertCircle
                                    className="mr-2 -mt-0.5 inline h-4 w-4"
                                    aria-hidden="true"
                                    style={{ color: brand.accentColor }}
                                  />
                                )}
                                {m.content}
                              </p>
                              {m.citations && m.citations.length > 0 ? (
                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                  <span className="text-[12px] font-semibold" style={{ color: muted }}>
                                    {m.citations.length > 1 ? "Sources:" : "Source:"}
                                  </span>
                                  {m.citations.map((c) => (
                                    <Chip key={c}>
                                      <Icons.FileText className="h-3.5 w-3.5" aria-hidden="true" />
                                      {c}
                                    </Chip>
                                  ))}
                                </div>
                              ) : (
                                <p className="mt-3 text-[12px]" style={{ color: muted }}>
                                  No source cited — nothing in {DOCS.length} selected documents matched this question.
                                </p>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ol>
            )}

            <div aria-live="polite" className="mt-5">
              {pending && (
                <div className="np-fade flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-1 w-[3px] shrink-0 rounded-full"
                    style={{
                      background: "linear-gradient(180deg," + brand.primaryColor + "," + brand.accentColor + ")",
                    }}
                  />
                  <div className="px-4 py-3" style={{ ...glass, backgroundColor: "rgba(255,255,255,0.05)" }}>
                    <p className="flex items-center gap-2 text-[14px]" style={{ color: muted }}>
                      <span className="flex items-end gap-1" aria-hidden="true">
                        {[0, 1, 2].map((i) => (
                          <span
                            key={i}
                            className="np-dot inline-block h-1.5 w-1.5 rounded-full"
                            style={{ backgroundColor: brand.primaryColor, animationDelay: i * 0.15 + "s" }}
                          />
                        ))}
                      </span>
                      Retrieving chunks from {DOCS.length} documents, then answering with gemini-2.5-flash…
                    </p>
                  </div>
                </div>
              )}

              {sendError && (
                <div
                  className="np-fade px-4 py-4"
                  style={{
                    borderRadius: brand.radius,
                    border: "1px solid rgba(232,121,249,0.45)",
                    backgroundColor: "rgba(232,121,249,0.10)",
                  }}
                >
                  <p className="flex items-center gap-2 text-[14px] font-semibold" style={{ color: ink }}>
                    <Icons.AlertCircle className="h-4 w-4" aria-hidden="true" style={{ color: brand.accentColor }} />
                    Gemini didn't answer — the request timed out after 30s
                  </p>
                  <p className="mt-1.5 text-[13px] leading-relaxed" style={{ color: muted }}>
                    Your question is saved, nothing was lost, and this attempt hasn't used another message from your
                    allowance beyond the one already counted.
                  </p>
                  <p
                    className="mt-3 px-3 py-2 text-[13px] italic"
                    style={{ borderRadius: 12, backgroundColor: "rgba(255,255,255,0.06)", color: ink }}
                  >
                    “{sendError.question}”
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <UI.Button
                      type="button"
                      onClick={() => ask(sendError.question, true)}
                      className="np-f np-t inline-flex items-center gap-2 px-4 hover:brightness-110"
                      style={{
                        minHeight: 44,
                        borderRadius: brand.radius,
                        fontWeight: 700,
                        color: brand.backgroundColor,
                        background: "linear-gradient(90deg," + brand.primaryColor + "," + brand.accentColor + ")",
                      }}
                    >
                      Retry this question
                    </UI.Button>
                    <UI.Button
                      type="button"
                      onClick={() => {
                        setDraft(sendError.question);
                        setSendError(null);
                        if (draftRef.current) draftRef.current.focus();
                      }}
                      className="np-f np-t inline-flex items-center gap-2 px-4 hover:brightness-125"
                      style={ghostBtn}
                    >
                      Edit the question
                    </UI.Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Row 4 — usage */}
        <div data-wf="b-3-0" className="mt-5 px-4 py-4" style={{ ...glass, backgroundColor: "rgba(255,255,255,0.035)" }}>
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-[14px] leading-relaxed" style={{ color: muted, maxWidth: "68ch" }}>
              <span className="font-bold" style={{ color: ink, fontVariantNumeric: "tabular-nums" }}>
                {used} of {MESSAGE_LIMIT} messages
              </span>{" "}
              used this month. When the limit is reached, new messages are blocked until the period resets.
            </p>
            <span className="text-[12px]" style={{ color: muted, fontVariantNumeric: "tabular-nums" }}>
              Resets 1 Nov · free at launch, no billing
            </span>
          </div>
          <div
            className="mt-3 h-1.5 w-full overflow-hidden rounded-full"
            role="progressbar"
            aria-valuemin={0}
            aria-valuemax={MESSAGE_LIMIT}
            aria-valuenow={used}
            aria-label="Messages used this month"
            style={{ backgroundColor: "rgba(255,255,255,0.10)" }}
          >
            <div
              className="np-t h-full rounded-full"
              style={{
                width: Math.min(100, (used / MESSAGE_LIMIT) * 100) + "%",
                background: "linear-gradient(90deg," + brand.primaryColor + "," + brand.accentColor + ")",
                transition: "width .4s ease-out",
              }}
            />
          </div>
          {limitReached && (
            <p className="mt-3 flex items-center gap-2 text-[13px] font-semibold" style={{ color: brand.accentColor }}>
              <Icons.AlertCircle className="h-4 w-4" aria-hidden="true" />
              You've reached your {MESSAGE_LIMIT} message limit for this period. Asking resumes on 1 Nov — your history
              stays exactly as it is.
            </p>
          )}
        </div>

        {/* Row 5 — composer */}
        <form onSubmit={onSubmit} className="mt-5 grid grid-cols-12 items-end gap-3" noValidate>
          <div className="col-span-12 md:col-span-10">
            <UI.Label htmlFor="question" className="mb-2 block text-[13px] font-semibold" style={{ color: muted }}>
              Ask a question about your selected documents
            </UI.Label>
            <UI.Textarea
              id="question"
              data-wf="b-4-0"
              ref={draftRef}
              rows={2}
              value={draft}
              disabled={limitReached}
              aria-describedby="question-help"
              aria-invalid={formError ? "true" : "false"}
              onChange={(e) => {
                setDraft(e.target.value);
                if (formError) setFormError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) onSubmit(e);
              }}
              placeholder="e.g. What was gross margin in Q3, and how much annual leave do staff get?"
              className="np-f np-t w-full resize-none px-4 py-3 text-[15px] placeholder:opacity-60"
              style={{
                ...glass,
                borderRadius: brand.radius,
                color: ink,
                backgroundColor: limitReached ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.06)",
                opacity: limitReached ? 0.6 : 1,
                borderColor: formError ? brand.accentColor : undefined,
              }}
            />
            <p id="question-help" className="mt-2 text-[12px]" style={{ color: formError ? brand.accentColor : muted }}>
              {formError
                ? formError
                : limitReached
                ? "Message limit reached — the composer unlocks when the period resets."
                : "Enter sends · Shift + Enter adds a line. Follow-ups use the rest of this conversation for context."}
            </p>
          </div>
          <div className="col-span-12 md:col-span-2">
            <UI.Button
              type="submit"
              data-wf="b-4-1"
              disabled={pending || limitReached}
              aria-label="Send question"
              className="np-f np-t inline-flex w-full items-center justify-center gap-2 px-4 hover:brightness-110 disabled:cursor-not-allowed"
              style={{
                minHeight: 52,
                borderRadius: brand.radius,
                fontWeight: 800,
                color: brand.backgroundColor,
                background:
                  pending || limitReached
                    ? "rgba(255,255,255,0.14)"
                    : "linear-gradient(90deg," + brand.primaryColor + "," + brand.accentColor + ")",
                boxShadow: pending || limitReached ? "none" : "0 0 48px rgba(34,211,238,0.28)",
                opacity: pending || limitReached ? 0.7 : 1,
              }}
            >
              <span style={{ color: pending || limitReached ? brand.neutralColor : brand.backgroundColor }}>
                {pending ? "Sending…" : "Send"}
              </span>
              <Icons.ArrowRight
                className="h-4 w-4"
                aria-hidden="true"
                style={{ color: pending || limitReached ? brand.neutralColor : brand.backgroundColor }}
              />
            </UI.Button>
          </div>
        </form>
      </div>

      {/* Row 6 — rename modal */}
      {renameOpen && (
        <div
          className="np-fade fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: "rgba(6,20,43,0.78)" }}
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) closeRename();
          }}
        >
          <div
            data-wf="b-5-0"
            role="dialog"
            aria-modal="true"
            aria-labelledby="rename-title"
            onKeyDown={(e) => {
              if (e.key === "Escape") closeRename();
            }}
            className="np-rise w-full max-w-[440px] p-6"
            style={{
              ...glass,
              backgroundColor: "rgba(16,32,60,0.96)",
              backdropFilter: "blur(18px)",
              boxShadow: "0 24px 80px rgba(0,0,0,0.55), 0 0 60px rgba(232,121,249,0.14)",
            }}
          >
            <h2 id="rename-title" className="text-[22px] font-bold" style={{ fontFamily: brand.fontHeading }}>
              Rename chat session
            </h2>
            <p className="mt-1.5 text-[13px]" style={{ color: muted }}>
              The name only changes how this session appears in your list. Messages and documents stay as they are.
            </p>

            <form onSubmit={saveRename} className="mt-5" noValidate>
              <UI.Label htmlFor="session-name" className="mb-2 block text-[13px] font-semibold" style={{ color: muted }}>
                Name
              </UI.Label>
              <UI.Input
                id="session-name"
                data-wf="i-5-0-0"
                ref={renameInputRef}
                value={renameValue}
                aria-invalid={renameError ? "true" : "false"}
                aria-describedby="rename-help"
                onChange={(e) => {
                  setRenameValue(e.target.value);
                  if (renameError) setRenameError("");
                }}
                className="np-f np-t w-full px-4 py-3 text-[15px]"
                style={{
                  ...glass,
                  borderRadius: brand.radius,
                  color: ink,
                  borderColor: renameError ? brand.accentColor : undefined,
                }}
              />
              <p id="rename-help" className="mt-2 text-[12px]" style={{ color: renameError ? brand.accentColor : muted }}>
                {renameError || "Up to 80 characters."}
              </p>

              <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
                <UI.Button
                  type="button"
                  data-wf="i-5-0-2"
                  onClick={closeRename}
                  className="np-f np-t px-5 hover:brightness-125"
                  style={ghostBtn}
                >
                  Cancel
                </UI.Button>
                <UI.Button
                  type="submit"
                  data-wf="i-5-0-1"
                  className="np-f np-t px-6 hover:brightness-110"
                  style={{
                    minHeight: 44,
                    borderRadius: brand.radius,
                    fontWeight: 800,
                    color: brand.backgroundColor,
                    background: "linear-gradient(90deg," + brand.primaryColor + "," + brand.accentColor + ")",
                  }}
                >
                  Save
                </UI.Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
