// @ts-nocheck -- generated from the approved design under its JS runtime contract; not hand-written TypeScript.
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";

import * as UI from "@/lib/ui";
import { Icons } from "@/lib/icons";
import { brand } from "@/lib/brand";
import { useNavigate } from "@/lib/navigate";
import { apiFetch, ApiError } from "@/lib/api";

 
const { Switch } = UI;
 
const { Home, ArrowLeft, ArrowRight, AlertCircle, CheckCircle } = Icons;

const PRODUCT = "RAG Chatbot";
const PAGE_TITLE = "Sign in to RAG Chatbot";
const MIN_PASSWORD = 10;

const TABS = [
  { key: "signin", label: "Sign in", wf: "i-1-0-0" },
  { key: "signup", label: "Create account", wf: "i-1-0-1" },
];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const mix = (colour, percent) => `color-mix(in srgb, ${colour} ${percent}%, transparent)`;

// Turns a 422 response body into { email, password } messages. FastAPI's own request
// validation returns `detail: [{ loc, msg }]`; a handler that raises its own
// HTTPException instead may send `detail` as a plain string or as `{ email, password }`.
// All three are read here so whichever shape the API answers with still reaches the field.
function fieldErrorsFrom(body) {
  const result = { email: null, password: null };
  const detail = body && body.detail;
  if (Array.isArray(detail)) {
    detail.forEach((item) => {
      const field = Array.isArray(item.loc) ? item.loc[item.loc.length - 1] : item.field;
      const msg = item.msg || item.message;
      if (field === "email" && msg) result.email = msg;
      else if (field === "password" && msg) result.password = msg;
    });
  } else if (detail && typeof detail === "object") {
    if (detail.email) result.email = detail.email;
    if (detail.password) result.password = detail.password;
  } else if (typeof detail === "string") {
    result.password = detail;
  }
  if (!result.email && !result.password) {
    result.password = "That didn't work — check your details and try again.";
  }
  return result;
}

export default function Screen() {
  const navigate = useNavigate();
  const [mode, setMode] = React.useState("signin");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [phase, setPhase] = React.useState("idle"); // idle | submitting | success
  const [credentialError, setCredentialError] = React.useState(false);
  const [errors, setErrors] = React.useState({ email: null, password: null });

  const emailRef = React.useRef(null);
  const passwordRef = React.useRef(null);
  const tabRefs = React.useRef([]);
  const timers = React.useRef([]);

  React.useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const glass = {
    backgroundColor: "rgba(255,255,255,0.07)",
    border: "1px solid rgba(255,255,255,0.14)",
    borderRadius: brand.radius,
  };
  const glow = `0 20px 60px -10px ${mix(brand.primaryColor, 70)}`;
  const busy = phase === "submitting";
  const done = phase === "success";

  const switchMode = (next) => {
    setMode(next);
    setCredentialError(false);
    setErrors({ email: null, password: null });
  };

  const onTabKeyDown = (event, index) => {
    const last = TABS.length - 1;
    let target = null;
    if (event.key === "ArrowRight") target = index === last ? 0 : index + 1;
    if (event.key === "ArrowLeft") target = index === 0 ? last : index - 1;
    if (event.key === "Home") target = 0;
    if (event.key === "End") target = last;
    if (target === null) return;
    event.preventDefault();
    switchMode(TABS[target].key);
    const node = tabRefs.current[target];
    if (node) node.focus();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (busy || done) return;

    const trimmed = email.trim();
    const next = { email: null, password: null };

    if (!trimmed) next.email = "Enter the email address for your account.";
    else if (!EMAIL_RE.test(trimmed))
      next.email = "That is not a complete email address — check the @ and the domain.";

    if (!password) next.password = `Choose a password of at least ${MIN_PASSWORD} characters.`;

    if (next.email || next.password) {
      setErrors(next);
      setCredentialError(false);
      const node = next.email ? emailRef.current : passwordRef.current;
      if (node) node.focus();
      return;
    }

    setErrors({ email: null, password: null });
    setCredentialError(false);
    setPhase("submitting");

    const endpoint = mode === "signin" ? "/auth/signin" : "/auth/signup";

    try {
      await apiFetch(endpoint, {
        method: "POST",
        body: JSON.stringify({ email: trimmed, password }),
      });
      setPhase("success");
      timers.current.push(setTimeout(() => navigate("dashboard"), 700));
    } catch (err) {
      setPhase("idle");
      if (err instanceof ApiError) {
        if (err.status === 401) {
          setCredentialError(true);
          return;
        }
        if (err.status === 409) {
          setErrors({
            email: `${trimmed} is already registered. Switch to Sign in to reach your documents.`,
            password: null,
          });
          if (emailRef.current) emailRef.current.focus();
          return;
        }
        if (err.status === 422) {
          const fieldErrors = fieldErrorsFrom(err.body);
          setErrors(fieldErrors);
          const node = fieldErrors.email ? emailRef.current : passwordRef.current;
          if (node) node.focus();
          return;
        }
      }
      setErrors({ email: null, password: "Something went wrong — try again." });
    }
  };

  const primaryLabel = mode === "signin" ? "Sign in" : "Create account";

  return (
    <div
      className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-12 text-white"
      style={{ fontFamily: brand.fontBody, backgroundColor: brand.backgroundColor }}
    >
      <style>{`
        .np-focus:focus-visible { outline: 2px solid ${brand.primaryColor}; outline-offset: 3px; border-radius: ${brand.radius}; }
        @keyframes np-rise { from { opacity: 0; transform: translateY(7px); } to { opacity: 1; transform: none; } }
        .np-rise { animation: np-rise .3s ease-out both; }
        @keyframes np-pulse { 0%,100% { opacity: 1; } 50% { opacity: .35; } }
        .np-pulse { animation: np-pulse 1.9s ease-in-out infinite; }
        @keyframes np-spin { to { transform: rotate(360deg); } }
        .np-spin { animation: np-spin .8s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .np-rise, .np-pulse, .np-spin { animation: none !important; }
          .np-grad { transition: none !important; }
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-[-120px] h-[520px] w-[520px] rounded-full blur-[120px]"
        style={{ backgroundColor: mix(brand.primaryColor, 70) }}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-[-160px] right-[-80px] h-[560px] w-[560px] rounded-full blur-[130px]"
        style={{ backgroundColor: mix(brand.accentColor, 60) }}
      />
      <p
        className="absolute left-6 top-7 text-lg font-bold sm:left-10 sm:top-8"
        style={{ fontFamily: brand.fontHeading }}
      >
        {PRODUCT}
      </p>

      <main
        className="relative w-full max-w-[440px] p-6 backdrop-blur-2xl sm:p-10"
        style={{ ...glass, boxShadow: "0 40px 120px -20px rgba(0,0,0,0.6)" }}
      >
        {/* b-0-0 page_title */}
        <header data-wf="b-0-0">
          <p
            className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold"
            style={{ backgroundColor: mix(brand.accentColor, 25), color: "#fff" }}
          >
            <span
              aria-hidden
              className="np-pulse inline-block h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: brand.primaryColor }}
            />
            Gemini 2.5 Flash · answers grounded in your files
          </p>
          <h1
            className="mt-5 text-[34px] font-extrabold leading-[1.1] tracking-tight sm:text-4xl"
            style={{ fontFamily: brand.fontHeading }}
          >
            {PAGE_TITLE}
          </h1>
          <p className="mt-3 max-w-[46ch] text-sm leading-relaxed text-white/65">
            Your documents, their embeddings and every chat session stay locked to your account — no
            one else can open or cite them.
          </p>
        </header>

        {/* b-1-0 tabs */}
        <div
          data-wf="b-1-0"
          role="tablist"
          aria-label="Sign in or create an account"
          className="mt-7 grid grid-cols-2 gap-1 p-1"
          style={{ ...glass, backgroundColor: "rgba(255,255,255,0.05)" }}
        >
          {TABS.map((tab, index) => {
            const active = mode === tab.key;
            return (
              <button
                key={tab.key}
                data-wf={tab.wf}
                ref={(node) => {
                  tabRefs.current[index] = node;
                }}
                type="button"
                role="tab"
                id={`auth-tab-${tab.key}`}
                aria-selected={active}
                aria-controls="auth-panel"
                tabIndex={active ? 0 : -1}
                onClick={() => switchMode(tab.key)}
                onKeyDown={(e) => onTabKeyDown(e, index)}
                className={`np-focus h-11 px-3 text-sm transition-colors ${active ? "font-bold text-white" : "font-semibold text-white/60 hover:bg-white/10 hover:text-white/90"}`}
                style={{
                  borderRadius: `calc(${brand.radius} - 4px)`,
                  background: active
                    ? `linear-gradient(90deg, ${brand.primaryColor}, ${brand.accentColor})`
                    : "transparent",
                  color: active ? "#06142b" : undefined,
                  boxShadow: active ? `0 10px 30px -12px ${mix(brand.accentColor, 90)}` : "none",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        <div
          id="auth-panel"
          role="tabpanel"
          aria-labelledby={`auth-tab-${mode}`}
          tabIndex={-1}
          className="outline-none"
        >
          {done ? (
            <div
              key="done"
              className="np-rise mt-7 p-5"
              style={{ ...glass, boxShadow: glow }}
              role="status"
            >
              <p className="flex items-center gap-2 text-sm font-bold">
                <CheckCircle
                  aria-hidden
                  className="h-4 w-4"
                  style={{ color: brand.primaryColor }}
                />
                {mode === "signin" ? "Signed in" : "Account created"}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Opening the dashboard for {email.trim()} — your documents and chat sessions load
                next.
              </p>
            </div>
          ) : (
            <React.Fragment>
              {/* b-2-0 form */}
              <form data-wf="b-2-0" noValidate className="mt-7 space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="auth-email"
                    className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/70"
                  >
                    Email
                  </label>
                  <input
                    data-wf="i-2-0-0"
                    id="auth-email"
                    ref={emailRef}
                    name="email"
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    disabled={busy}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (errors.email) setErrors((p) => ({ ...p, email: null }));
                    }}
                    aria-invalid={errors.email ? true : undefined}
                    aria-describedby={errors.email ? "auth-email-error" : undefined}
                    className="np-focus mt-2 h-12 w-full px-4 text-sm text-white outline-none transition-colors placeholder:text-white/35 disabled:opacity-60"
                    style={{
                      ...glass,
                      borderColor: errors.email ? brand.accentColor : "rgba(255,255,255,0.14)",
                    }}
                    placeholder="you@company.com"
                  />
                  {errors.email && (
                    <p
                      id="auth-email-error"
                      className="np-rise mt-2 flex items-start gap-2 text-xs font-semibold leading-relaxed"
                      style={{ color: brand.accentColor }}
                    >
                      <AlertCircle aria-hidden className="mt-px h-3.5 w-3.5 shrink-0" />
                      <span>{errors.email}</span>
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="auth-password"
                    className="block text-xs font-semibold uppercase tracking-[0.12em] text-white/70"
                  >
                    Password (at least {MIN_PASSWORD} characters)
                  </label>
                  <input
                    data-wf="i-2-0-1"
                    id="auth-password"
                    ref={passwordRef}
                    name="password"
                    type="password"
                    autoComplete={mode === "signin" ? "current-password" : "new-password"}
                    value={password}
                    disabled={busy}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((p) => ({ ...p, password: null }));
                    }}
                    aria-invalid={errors.password ? true : undefined}
                    aria-describedby={
                      errors.password ? "auth-password-error" : "auth-password-hint"
                    }
                    className="np-focus mt-2 h-12 w-full px-4 text-sm text-white outline-none transition-colors placeholder:text-white/35 disabled:opacity-60"
                    style={{
                      ...glass,
                      borderColor: errors.password ? brand.accentColor : "rgba(255,255,255,0.14)",
                    }}
                    placeholder="••••••••••"
                  />
                  {errors.password ? (
                    <p
                      id="auth-password-error"
                      className="np-rise mt-2 flex items-start gap-2 text-xs font-semibold leading-relaxed"
                      style={{ color: brand.accentColor }}
                    >
                      <AlertCircle aria-hidden className="mt-px h-3.5 w-3.5 shrink-0" />
                      <span>{errors.password}</span>
                    </p>
                  ) : (
                    <p
                      id="auth-password-hint"
                      className="mt-2 text-xs leading-relaxed text-white/50"
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {password.length} of {MIN_PASSWORD} characters
                    </p>
                  )}
                </div>

                {/* b-3-0 button */}
                <button
                  data-wf="b-3-0"
                  type="submit"
                  disabled={busy}
                  aria-busy={busy}
                  className="np-focus np-grad flex h-12 w-full items-center justify-center gap-2 text-sm font-bold transition-transform hover:scale-[1.02] disabled:scale-100 disabled:opacity-80"
                  style={{
                    background: `linear-gradient(90deg, ${brand.primaryColor}, ${brand.accentColor})`,
                    borderRadius: brand.radius,
                    boxShadow: glow,
                    color: "#06142b",
                  }}
                >
                  {busy ? (
                    <React.Fragment>
                      <span
                        aria-hidden
                        className="np-spin inline-block h-4 w-4 rounded-full border-2 border-[#06142b]/30 border-t-[#06142b]"
                      />
                      {mode === "signin"
                        ? "Checking your credentials…"
                        : "Setting up your workspace…"}
                    </React.Fragment>
                  ) : (
                    <React.Fragment>
                      {primaryLabel}
                      <ArrowRight aria-hidden className="h-4 w-4" />
                    </React.Fragment>
                  )}
                </button>
              </form>

              {/* b-4-0 text */}
              <div
                data-wf="b-4-0"
                className={credentialError ? "np-rise mt-5 p-4" : "mt-5 px-1"}
                style={
                  credentialError
                    ? {
                        ...glass,
                        borderColor: mix(brand.accentColor, 55),
                        backgroundColor: mix(brand.accentColor, 12),
                      }
                    : undefined
                }
              >
                <p
                  role={credentialError ? "alert" : undefined}
                  className="flex items-start gap-2 text-sm leading-relaxed text-white/70"
                >
                  {credentialError && (
                    <AlertCircle
                      aria-hidden
                      className="mt-0.5 h-4 w-4 shrink-0"
                      style={{ color: brand.accentColor }}
                    />
                  )}
                  <span>
                    {credentialError && (
                      <strong className="font-bold text-white">
                        Email or password is incorrect.{" "}
                      </strong>
                    )}
                    {mode === "signin" ? (
                      <React.Fragment>
                        New here?{" "}
                        <button
                          type="button"
                          onClick={() => switchMode("signup")}
                          className="np-focus font-bold underline underline-offset-4"
                          style={{ color: brand.accentColor }}
                        >
                          Switch to Create account
                        </button>{" "}
                        — your account works straight away, no email verification needed.
                      </React.Fragment>
                    ) : (
                      <React.Fragment>
                        Your account works straight away, no email verification needed. Already
                        registered?{" "}
                        <button
                          type="button"
                          onClick={() => switchMode("signin")}
                          className="np-focus font-bold underline underline-offset-4"
                          style={{ color: brand.accentColor }}
                        >
                          Switch to Sign in
                        </button>
                        .
                      </React.Fragment>
                    )}
                  </span>
                </p>
              </div>
            </React.Fragment>
          )}
        </div>
      </main>
    </div>
  );
}
