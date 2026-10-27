// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
 
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { apiFetch } from "@/lib/api";

 
const { Button, Input, Label, Badge, Avatar } = UI;
 
const { Check, Clock, Trash, ArrowRight, AlertCircle, CheckCircle } = Icons;

const ACCOUNT = {
  email: "alex@example.com",
  display_name: "Alex Rivera",
  created_at: "12 March 2026",
  session_started: "Today at 09:14 · Chrome on macOS",
  last_sync: "4 minutes ago",
};

const FOOTPRINT = [
  { label: "Documents", value: "7", hint: "41.8 MB stored" },
  { label: "Embedded chunks", value: "1,284", hint: "in the vector store" },
  { label: "Chat sessions", value: "5", hint: "last opened yesterday" },
  { label: "Messages", value: "162", hint: "since 12 March 2026" },
];

const DELETE_STEPS = [
  "Revoking your session on every device",
  "Removing 1,284 embeddings from the vector store",
  "Deleting 7 documents and their extracted text",
  "Deleting 5 chat sessions and 162 messages",
];

const TOKENS = {
  glass: "rgba(255,255,255,0.06)",
  glassStrong: "rgba(255,255,255,0.09)",
  hairline: "rgba(255,255,255,0.13)",
  hairlineSoft: "rgba(255,255,255,0.08)",
  textPrimary: "rgba(255,255,255,0.94)",
  danger: "#ff4d6d",
  dangerWash: "rgba(255,77,109,0.09)",
  dangerLine: "rgba(255,77,109,0.34)",
};

export default function Screen() {
  const navigate = useNavigate();
  const [signOutState, setSignOutState] = React.useState("idle");
  const [modalOpen, setModalOpen] = React.useState(false);
  const [confirmText, setConfirmText] = React.useState("");
  const [confirmError, setConfirmError] = React.useState("");
  const [deleteState, setDeleteState] = React.useState("confirm");
  const [step, setStep] = React.useState(0);

  const dialogRef = React.useRef(null);
  const inputRef = React.useRef(null);
  const triggerRef = React.useRef(null);

  // Sign out -> POST /auth/signout, drop any client auth state, back to the sign-in screen.
  const handleSignOut = async () => {
    if (signOutState === "pending") return;
    setSignOutState("pending");
    try {
      await apiFetch("/auth/signout", { method: "POST" });
    } catch {
      // Even if the call itself failed (already signed out, network hiccup), the client
      // still forgets its session and sends the user back to sign in.
    } finally {
      navigate("auth");
    }
  };

  // Deletion progress
  React.useEffect(() => {
    if (deleteState !== "deleting") return undefined;
    const id = setInterval(() => setStep((s) => Math.min(s + 1, DELETE_STEPS.length)), 620);
    return () => clearInterval(id);
  }, [deleteState]);

  React.useEffect(() => {
    if (deleteState === "deleting" && step >= DELETE_STEPS.length) setDeleteState("done");
  }, [deleteState, step]);

  React.useEffect(() => {
    if (deleteState !== "done") return undefined;
    const t = setTimeout(() => navigate("auth"), 2400);
    return () => clearTimeout(t);
  }, [deleteState]);

  React.useEffect(() => {
    if (modalOpen && inputRef.current) inputRef.current.focus();
  }, [modalOpen]);

  const closeModal = () => {
    setModalOpen(false);
    setConfirmText("");
    setConfirmError("");
    setDeleteState("confirm");
    setStep(0);
    if (triggerRef.current) triggerRef.current.focus();
  };

  const handleDialogKeyDown = (e) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      if (deleteState === "confirm") closeModal();
      return;
    }
    if (e.key !== "Tab" || !dialogRef.current) return;
    const nodes = Array.from(
      dialogRef.current.querySelectorAll("button:not([disabled]), input:not([disabled]), [href]"),
    );
    if (nodes.length === 0) return;
    const first = nodes[0];
    const last = nodes[nodes.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const matches = confirmText.trim() === "DELETE";

  const handleConfirmSubmit = (e) => {
    e.preventDefault();
    if (deleteState !== "confirm") return;
    if (!matches) {
      setConfirmError(
        confirmText.trim().length === 0
          ? "Type DELETE in capital letters to confirm."
          : "That doesn’t match. Type DELETE in capital letters — you typed “" + confirmText + "”.",
      );
      if (inputRef.current) inputRef.current.focus();
      return;
    }
    setConfirmError("");
    setStep(0);
    setDeleteState("deleting");
  };

  const label = "text-[12px] font-semibold uppercase tracking-[0.16em]";

  return (
    <div
      className="pulse-root relative mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 sm:py-12"
      style={{
        fontFamily: brand.fontBody,
        color: TOKENS.textPrimary,
        ["--pulse-primary"]: brand.primaryColor,
        ["--pulse-accent"]: brand.accentColor,
        ["--pulse-danger"]: TOKENS.danger,
        ["--pulse-radius"]: brand.radius,
      }}
    >
      <style>{`
        .pulse-root :is(button,a,input,summary,[tabindex]):focus-visible{
          outline:2px solid var(--pulse-primary);outline-offset:3px;border-radius:var(--pulse-radius);
        }
        @keyframes pulseDot{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.4;transform:scale(.78)}}
        @keyframes pulseRise{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:none}}
        @keyframes pulseFade{from{opacity:0}to{opacity:1}}
        @keyframes pulseSweep{0%{transform:translateX(-120%)}100%{transform:translateX(320%)}}
        .pulse-rise{animation:pulseRise .32s cubic-bezier(.2,.7,.3,1) both}
        .pulse-fade{animation:pulseFade .24s ease-out both}
        .pulse-dot{animation:pulseDot 2s ease-in-out infinite}
        .pulse-sweep{animation:pulseSweep 1.4s ease-in-out infinite}
        .pulse-root [data-soft]:hover{background:rgba(255,255,255,0.1)}
        @media (prefers-reduced-motion: reduce){
          .pulse-root *,.pulse-root *::before,.pulse-root *::after{
            animation-duration:.001ms!important;animation-iteration-count:1!important;transition-duration:.001ms!important}
        }
      `}</style>

      {/* decorative glows */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full blur-[90px]"
        style={{ background: brand.primaryColor, opacity: 0.17 }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 top-40 h-80 w-80 rounded-full blur-[110px]"
        style={{ background: brand.accentColor, opacity: 0.13 }}
      />

      {/* Row 1 — page title */}
      <header data-wf="b-0-0" className="relative mb-8">
        <p className={label} style={{ color: brand.primaryColor }}>
          Your account
        </p>
        <h1
          className="mt-3 text-[34px] font-bold leading-[1.1] tracking-[-0.02em] sm:text-[40px]"
          style={{ fontFamily: brand.fontHeading }}
        >
          Account settings
        </h1>
      </header>

      {/* Row 2 — identity */}
      <section
        data-wf="b-1-0"
        className="relative overflow-hidden p-6 sm:p-8"
        style={{
          background: TOKENS.glass,
          border: "1px solid " + TOKENS.hairline,
          borderRadius: brand.radius,
          backdropFilter: "blur(18px)",
        }}
      >
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          <div className="relative shrink-0">
            <div
              aria-hidden="true"
              className="absolute -inset-1 rounded-full blur-[14px]"
              style={{
                backgroundImage:
                  "linear-gradient(135deg, " + brand.primaryColor + ", " + brand.accentColor + ")",
                opacity: 0.55,
              }}
            />
            <Avatar
              name={ACCOUNT.display_name}
              className="relative h-16 w-16 text-lg font-semibold"
            />
            <span
              aria-hidden="true"
              className="pulse-dot absolute -bottom-0.5 -right-0.5 block h-4 w-4 rounded-full"
              style={{
                background: brand.primaryColor,
                border: "2px solid " + brand.backgroundColor,
              }}
            />
          </div>

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2
                className="text-xl font-semibold tracking-[-0.01em]"
                style={{ fontFamily: brand.fontHeading }}
              >
                {ACCOUNT.display_name}
              </h2>
              <Badge
                className="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]"
                style={{
                  background: "rgba(34,211,238,0.14)",
                  color: brand.primaryColor,
                  border: "1px solid rgba(34,211,238,0.34)",
                }}
              >
                Session active
              </Badge>
            </div>

            <p
              className="mt-3 max-w-[62ch] text-[15px] leading-[1.6]"
              style={{ color: brand.neutralColor }}
            >
              Signed in as{" "}
              <span style={{ color: TOKENS.textPrimary, fontWeight: 600 }}>{ACCOUNT.email}</span>.
              Account created {ACCOUNT.created_at}. Only you can see your documents and chats.
            </p>

            <dl className="mt-6 grid grid-cols-1 gap-x-8 gap-y-5 sm:grid-cols-2">
              {[
                { k: "Email", v: ACCOUNT.email },
                { k: "Account created", v: ACCOUNT.created_at },
                { k: "This session", v: ACCOUNT.session_started },
                { k: "Data visibility", v: "Private to you only" },
              ].map((row) => (
                <div key={row.k}>
                  <dt className={label} style={{ color: brand.neutralColor, opacity: 0.85 }}>
                    {row.k}
                  </dt>
                  <dd
                    className="mt-1.5 text-[15px] font-medium"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {row.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </section>

      {/* Row 3 — sign out */}
      <div className="mt-8 grid grid-cols-12 items-center gap-x-6 gap-y-4">
        <div className="col-span-12 sm:col-span-4">
          <Button
            data-wf="b-2-0"
            type="button"
            onClick={handleSignOut}
            aria-busy={signOutState === "pending"}
            disabled={signOutState === "pending"}
            className="w-full justify-center border-0 transition-transform duration-200 hover:-translate-y-[1px]"
            style={{
              minHeight: "52px",
              padding: "0 24px",
              borderRadius: brand.radius,
              backgroundImage:
                "linear-gradient(110deg, " + brand.primaryColor + ", " + brand.accentColor + ")",
              color: brand.backgroundColor,
              fontSize: "16px",
              fontWeight: 700,
              letterSpacing: "-0.01em",
              boxShadow: "0 18px 48px -18px " + brand.accentColor,
              opacity: signOutState === "pending" ? 0.75 : 1,
            }}
          >
            {signOutState === "pending" ? (
              <span className="inline-flex items-center gap-2">
                <Clock className="h-4 w-4" aria-hidden="true" />
                Signing you out…
              </span>
            ) : (
              <span className="inline-flex items-center gap-2">
                Sign out
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </span>
            )}
          </Button>
        </div>
        <p
          className="col-span-12 max-w-[56ch] text-[14px] leading-[1.6] sm:col-span-8"
          style={{ color: brand.neutralColor }}
          role="status"
        >
          {signOutState === "pending"
            ? "Ending your session and returning you to the sign-in page. Nothing has been deleted."
            : "Ends this session and sends you back to the sign-in page. Your documents, embeddings and chat history stay exactly as they are."}
        </p>
      </div>

      {/* Danger panel: rows 4 and 5 */}
      <section
        className="relative mt-10 overflow-hidden"
        style={{
          background: TOKENS.dangerWash,
          border: "1px solid " + TOKENS.dangerLine,
          borderRadius: brand.radius,
        }}
      >
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-0 h-px"
          style={{
            backgroundImage:
              "linear-gradient(90deg, transparent, " + TOKENS.danger + ", transparent)",
          }}
        />
        <div className="p-6 sm:p-8">
          <h2
            className="flex items-center gap-2.5 text-lg font-semibold tracking-[-0.01em]"
            style={{ fontFamily: brand.fontHeading, color: TOKENS.danger }}
          >
            <AlertCircle className="h-5 w-5" aria-hidden="true" />
            Delete account
          </h2>

          {/* Row 4 — text */}
          <div data-wf="b-3-0" className="mt-4">
            <p
              className="max-w-[66ch] text-[15px] leading-[1.65]"
              style={{ color: TOKENS.textPrimary }}
            >
              Deleting your account permanently removes your account, all documents and their
              embeddings, and every chat session and message. This cannot be undone.
            </p>

            <ul
              className="mt-6 grid grid-cols-2 gap-px lg:grid-cols-4"
              style={{
                background: TOKENS.hairlineSoft,
                borderRadius: brand.radius,
                overflow: "hidden",
                border: "1px solid " + TOKENS.hairlineSoft,
              }}
            >
              {FOOTPRINT.map((item) => (
                <li
                  key={item.label}
                  className="px-5 py-5"
                  style={{ background: "rgba(6,20,43,0.55)" }}
                >
                  <p
                    className="text-[30px] font-bold leading-none tracking-[-0.03em]"
                    style={{ fontVariantNumeric: "tabular-nums", fontFamily: brand.fontHeading }}
                  >
                    {item.value}
                  </p>
                  <p className="mt-2 text-[13px] font-semibold">{item.label}</p>
                  <p className="mt-1 text-[12px]" style={{ color: brand.neutralColor }}>
                    {item.hint}
                  </p>
                </li>
              ))}
            </ul>

            <p
              className="mt-3 flex items-center gap-1.5 text-[12px]"
              style={{ color: brand.neutralColor }}
            >
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              Usage figures refreshed {ACCOUNT.last_sync}
            </p>
          </div>

          {/* Row 5 — delete button */}
          <div className="mt-8 grid grid-cols-12 items-center gap-x-6 gap-y-4">
            <div className="col-span-12 sm:col-span-4">
              <Button
                data-wf="b-4-0"
                type="button"
                ref={triggerRef}
                onClick={() => setModalOpen(true)}
                className="w-full justify-center transition-colors duration-200"
                data-soft
                style={{
                  minHeight: "52px",
                  padding: "0 24px",
                  borderRadius: brand.radius,
                  background: "transparent",
                  border: "1px solid " + TOKENS.danger,
                  color: TOKENS.danger,
                  fontSize: "15px",
                  fontWeight: 700,
                }}
              >
                <span className="inline-flex items-center gap-2">
                  <Trash className="h-4 w-4" aria-hidden="true" />
                  Delete my account
                </span>
              </Button>
            </div>
            <p
              className="col-span-12 max-w-[52ch] text-[13px] leading-[1.6] sm:col-span-8"
              style={{ color: brand.neutralColor }}
            >
              You’ll be asked to type DELETE before anything is removed.
            </p>
          </div>
        </div>
      </section>

      {/* Row 6 — modal */}
      <div data-wf="b-5-0">
        {modalOpen && (
          <div
            className="pulse-fade fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center"
            style={{ background: "rgba(3,10,24,0.74)", backdropFilter: "blur(10px)" }}
          >
            <div
              ref={dialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="delete-dialog-title"
              aria-describedby="delete-dialog-desc"
              onKeyDown={handleDialogKeyDown}
              className="pulse-rise relative w-full max-w-lg overflow-hidden p-6 sm:p-8"
              style={{
                background: "rgba(10,24,48,0.92)",
                border: "1px solid " + TOKENS.dangerLine,
                borderRadius: brand.radius,
                boxShadow: "0 50px 110px -30px rgba(0,0,0,0.85), 0 0 60px -20px " + TOKENS.danger,
              }}
            >
              {deleteState !== "done" && (
                <>
                  <h2
                    id="delete-dialog-title"
                    className="text-[22px] font-bold leading-[1.2] tracking-[-0.02em]"
                    style={{ fontFamily: brand.fontHeading }}
                  >
                    Permanently delete your account?
                  </h2>
                  <p
                    id="delete-dialog-desc"
                    className="mt-3 text-[14px] leading-[1.65]"
                    style={{ color: brand.neutralColor }}
                  >
                    This erases {ACCOUNT.email} along with 7 documents, 1,284 embeddings, 5 chat
                    sessions and 162 messages. There is no backup and no undo.
                  </p>
                </>
              )}

              {deleteState === "confirm" && (
                <form onSubmit={handleConfirmSubmit} className="mt-6">
                  <Label
                    htmlFor="confirm-delete"
                    className="block text-[13px] font-semibold"
                    style={{ color: TOKENS.textPrimary }}
                  >
                    Type DELETE to confirm
                  </Label>
                  <Input
                    data-wf="i-5-0-0"
                    id="confirm-delete"
                    ref={inputRef}
                    value={confirmText}
                    autoComplete="off"
                    spellCheck="false"
                    onChange={(e) => {
                      setConfirmText(e.target.value);
                      if (confirmError) setConfirmError("");
                    }}
                    aria-invalid={confirmError ? "true" : "false"}
                    aria-describedby={confirmError ? "confirm-delete-error" : "confirm-delete-hint"}
                    className="mt-2 w-full"
                    style={{
                      minHeight: "48px",
                      padding: "0 16px",
                      borderRadius: brand.radius,
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid " + (confirmError ? TOKENS.danger : TOKENS.hairline),
                      color: TOKENS.textPrimary,
                      fontSize: "16px",
                      letterSpacing: "0.08em",
                      fontVariantNumeric: "tabular-nums",
                    }}
                  />
                  {confirmError ? (
                    <p
                      id="confirm-delete-error"
                      role="alert"
                      className="mt-2 flex items-start gap-1.5 text-[13px] leading-[1.5]"
                      style={{ color: TOKENS.danger }}
                    >
                      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                      {confirmError}
                    </p>
                  ) : (
                    <p
                      id="confirm-delete-hint"
                      className="mt-2 text-[13px]"
                      style={{ color: brand.neutralColor }}
                    >
                      Capital letters, exactly: DELETE
                    </p>
                  )}
                </form>
              )}

              {deleteState === "deleting" && (
                <div className="mt-6">
                  <div
                    className="relative h-1 w-full overflow-hidden"
                    style={{ background: "rgba(255,255,255,0.08)", borderRadius: "999px" }}
                    role="progressbar"
                    aria-label="Deleting your account"
                    aria-valuemin={0}
                    aria-valuemax={DELETE_STEPS.length}
                    aria-valuenow={step}
                  >
                    <span
                      className="pulse-sweep absolute inset-y-0 left-0 w-1/3 rounded-full"
                      style={{ background: TOKENS.danger }}
                      aria-hidden="true"
                    />
                  </div>
                  <ul className="mt-5 space-y-3">
                    {DELETE_STEPS.map((s, i) => {
                      const done = i < step;
                      return (
                        <li
                          key={s}
                          className="flex items-start gap-2.5 text-[14px] leading-[1.5] transition-opacity duration-300"
                          style={{
                            color: done ? TOKENS.textPrimary : brand.neutralColor,
                            opacity: done ? 1 : 0.6,
                          }}
                        >
                          {done ? (
                            <Check
                              className="mt-0.5 h-4 w-4 shrink-0"
                              aria-hidden="true"
                              style={{ color: brand.primaryColor }}
                            />
                          ) : (
                            <Clock className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                          )}
                          <span>
                            {s}
                            <span className="sr-only">{done ? " — done" : " — in progress"}</span>
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {deleteState === "done" && (
                <div className="pulse-fade">
                  <CheckCircle
                    className="h-10 w-10"
                    aria-hidden="true"
                    style={{ color: brand.primaryColor }}
                  />
                  <h2
                    id="delete-dialog-title"
                    className="mt-4 text-[22px] font-bold leading-[1.2] tracking-[-0.02em]"
                    style={{ fontFamily: brand.fontHeading }}
                  >
                    Your account is gone
                  </h2>
                  <p
                    id="delete-dialog-desc"
                    role="status"
                    className="mt-3 text-[14px] leading-[1.65]"
                    style={{ color: brand.neutralColor }}
                  >
                    {ACCOUNT.email}, 7 documents, 1,284 embeddings, 5 chat sessions and 162 messages
                    have been deleted. Taking you to the sign-in page…
                  </p>
                </div>
              )}

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Button
                  data-wf="i-5-0-2"
                  type="button"
                  onClick={closeModal}
                  disabled={deleteState !== "confirm"}
                  data-soft
                  className="justify-center transition-colors duration-200"
                  style={{
                    minHeight: "48px",
                    padding: "0 22px",
                    borderRadius: brand.radius,
                    background: TOKENS.glass,
                    border: "1px solid " + TOKENS.hairline,
                    color: TOKENS.textPrimary,
                    fontSize: "15px",
                    fontWeight: 600,
                    opacity: deleteState === "confirm" ? 1 : 0.4,
                  }}
                >
                  Cancel
                </Button>

                <Button
                  data-wf="i-5-0-1"
                  type="button"
                  onClick={(e) => {
                    if (deleteState === "done") {
                      navigate("auth");
                      return;
                    }
                    if (deleteState === "deleting") return;
                    handleConfirmSubmit(e);
                  }}
                  aria-disabled={deleteState === "confirm" && !matches ? "true" : "false"}
                  aria-busy={deleteState === "deleting"}
                  className="justify-center transition-all duration-200"
                  style={{
                    minHeight: "48px",
                    padding: "0 22px",
                    borderRadius: brand.radius,
                    background:
                      deleteState === "done"
                        ? brand.primaryColor
                        : matches || deleteState === "deleting"
                          ? TOKENS.danger
                          : "rgba(255,77,109,0.14)",
                    border:
                      matches || deleteState !== "confirm"
                        ? "1px solid transparent"
                        : "1px solid " + TOKENS.dangerLine,
                    color:
                      matches || deleteState !== "confirm" ? brand.backgroundColor : TOKENS.danger,
                    fontSize: "15px",
                    fontWeight: 700,
                    boxShadow:
                      matches && deleteState === "confirm"
                        ? "0 16px 44px -18px " + TOKENS.danger
                        : "none",
                  }}
                >
                  {deleteState === "done"
                    ? "Go to sign in"
                    : deleteState === "deleting"
                      ? "Deleting your account…"
                      : "Delete account permanently"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
