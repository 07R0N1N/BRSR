"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "./Modal";
import { btnOutline, btnPrimary } from "./shared";

// Keep in sync with the ALLOWED_PROBLEMS allow-list in
// app/api/contact/route.ts — the server rejects the whole submission if a
// value here doesn't match exactly.
const PROBLEM_OPTIONS = [
  "Coordinating BRSR data collection across departments",
  "Currently using spreadsheets and it's chaotic",
  "Don't have visibility into what's missing or incomplete",
  "Need help with the actual export/filing format",
  "Curious about peer benchmarking",
  "Not sure where to start with BRSR",
] as const;

const MESSAGE_MAX_LENGTH = 1000;

const FORM_ID = "demo-request-form";
const TITLE_ID = "demo-request-title";

const inputClasses =
  "w-full rounded-[10px] border border-[#e3e8f0] bg-white px-3.5 py-2.5 text-[15px] text-[#0d1526] placeholder:text-[#8b95ad] transition focus:border-[#2f5bff] focus:outline-none focus:ring-2 focus:ring-[#2f5bff]/20";

const labelClasses = "mb-1.5 block text-[14px] font-semibold text-[#0d1526]";

export function DemoRequestModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [problems, setProblems] = useState<Set<string>>(new Set());
  const [message, setMessage] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — real users never touch this

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const firstFieldRef = useRef<HTMLInputElement>(null);

  // Reset transient state each time the modal is (re)opened. Focus is handled
  // by Modal via initialFocusRef.
  useEffect(() => {
    if (!open) return;
    setError(null);
    setSubmitted(false);
    setLoading(false);
  }, [open]);

  const toggleProblem = (option: string) => {
    setProblems((prev) => {
      const next = new Set(prev);
      if (next.has(option)) next.delete(option);
      else next.add(option);
      return next;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          company,
          problems: Array.from(problems),
          message,
          website,
          type: "demo",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? `Request failed (${res.status})`);
      }
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      titleId={TITLE_ID}
      initialFocusRef={firstFieldRef}
      header={
        <>
          <h2 id={TITLE_ID} className="text-xl font-bold tracking-[-0.02em] text-[#0d1526]">
            {submitted ? "Thanks — we’ll be in touch" : "Request a demo"}
          </h2>
          {!submitted && (
            <p className="mt-1.5 text-[14.5px] text-[#3d4761]">
              Tell us a bit about your team and we’ll set up a walkthrough.
            </p>
          )}
        </>
      }
      footer={
        submitted ? undefined : (
          <>
            {error && (
              <p className="rounded-[10px] border border-red-200 bg-red-50 px-3.5 py-2.5 text-[14px] text-red-600">
                {error}
              </p>
            )}
            <div className="flex flex-col gap-2.5 sm:flex-row-reverse">
              {/*
                form= associates this button with the form in the body slot —
                needed because Modal's footer lives outside the <form> element.
              */}
              <button
                type="submit"
                form={FORM_ID}
                disabled={loading}
                className={`${btnPrimary()} w-full disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto`}
              >
                {loading ? (
                  <>
                    <span
                      className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white"
                      aria-hidden
                    />
                    Sending…
                  </>
                ) : (
                  "Send request"
                )}
              </button>
              <button
                type="button"
                onClick={onClose}
                className={`${btnOutline()} w-full sm:w-auto`}
              >
                Cancel
              </button>
            </div>
          </>
        )
      }
    >
      {submitted ? (
        <div className="flex flex-col items-start gap-4">
          <span className="grid h-12 w-12 place-items-center rounded-full bg-[#e6f8f4] text-[#0a7d6e]">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6">
              <path d="M20 6 9 17l-5-5" />
            </svg>
          </span>
          <p className="text-[15px] leading-relaxed text-[#3d4761]">
            We’ve received your request and someone from our team will reach out shortly to set up a
            walkthrough.
          </p>
          <button type="button" onClick={onClose} className={`${btnOutline()} w-full`}>
            Close
          </button>
        </div>
      ) : (
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="demo-name" className={labelClasses}>
              Name
            </label>
            <input
              ref={firstFieldRef}
              id="demo-name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClasses}
              placeholder="Jane Doe"
              autoComplete="name"
            />
          </div>

          <div>
            <label htmlFor="demo-email" className={labelClasses}>
              Work email
            </label>
            <input
              id="demo-email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClasses}
              placeholder="jane@company.com"
              autoComplete="email"
            />
          </div>

          <div>
            <label htmlFor="demo-company" className={labelClasses}>
              Company
            </label>
            <input
              id="demo-company"
              name="company"
              type="text"
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className={inputClasses}
              placeholder="Acme Ltd."
              autoComplete="organization"
            />
          </div>

          <fieldset>
            <legend className={labelClasses}>What are you trying to solve?</legend>
            <div className="grid gap-2">
              {PROBLEM_OPTIONS.map((option) => (
                <label
                  key={option}
                  className="flex cursor-pointer items-start gap-2.5 rounded-[10px] border border-[#e3e8f0] px-3 py-2.5 text-[14.5px] text-[#3d4761] transition hover:border-[#c3ccdd] hover:bg-[#fafbfd]"
                >
                  <input
                    type="checkbox"
                    checked={problems.has(option)}
                    onChange={() => toggleProblem(option)}
                    className="mt-0.5 h-4 w-4 flex-none rounded border-[#c3ccdd] text-[#2f5bff] focus:ring-2 focus:ring-[#2f5bff]/30"
                  />
                  {option}
                </label>
              ))}
            </div>
          </fieldset>

          <div>
            <label htmlFor="demo-message" className={labelClasses}>
              Anything else you’d like to share?
            </label>
            <textarea
              id="demo-message"
              name="message"
              rows={3}
              maxLength={MESSAGE_MAX_LENGTH}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className={`${inputClasses} resize-none`}
              placeholder="Optional — anything that'll help us prep for the call."
            />
          </div>

          {/*
            Honeypot: hidden from real users (off-screen, not display:none,
            so it survives some bot heuristics) and from screen readers
            (aria-hidden + tabIndex -1), but still present in the DOM for a
            bot that blindly fills every input. Must stay named "website"
            to match the server-side check in app/api/contact/route.ts.
          */}
          <div
            aria-hidden="true"
            className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
          >
            <label htmlFor="demo-website">Website</label>
            <input
              id="demo-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>
        </form>
      )}
    </Modal>
  );
}
