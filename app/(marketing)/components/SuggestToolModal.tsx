"use client";

import { useEffect, useRef, useState } from "react";
import { Modal } from "./Modal";
import { btnOutline, btnPrimary } from "./shared";

const IDEA_MAX_LENGTH = 2000;

const FORM_ID = "suggest-tool-form";
const TITLE_ID = "suggest-tool-title";

const inputClasses =
  "w-full rounded-[10px] border border-[#e3e8f0] bg-white px-3.5 py-2.5 text-[15px] text-[#0d1526] placeholder:text-[#8b95ad] transition focus:border-[#2f5bff] focus:outline-none focus:ring-2 focus:ring-[#2f5bff]/20";

const labelClasses = "mb-1.5 block text-[14px] font-semibold text-[#0d1526]";

export function SuggestToolModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [idea, setIdea] = useState("");
  const [website, setWebsite] = useState(""); // honeypot — real users never touch this

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSubmitted(false);
    setLoading(false);
  }, [open]);

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
          idea,
          type: "suggest",
          website,
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
            {submitted ? "Thanks — we’ll be in touch" : "Suggest a tool"}
          </h2>
          {!submitted && (
            <p className="mt-1.5 text-[14.5px] text-[#3d4761]">
              Tell us what you’re missing and we’ll add it to the roadmap.
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
                  "Send suggestion"
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
            We’ve received your suggestion and someone from our team will take a look. Thank you for
            shaping the roadmap.
          </p>
          <button type="button" onClick={onClose} className={`${btnOutline()} w-full`}>
            Close
          </button>
        </div>
      ) : (
        <form id={FORM_ID} onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="suggest-name" className={labelClasses}>
              Name
            </label>
            <input
              ref={firstFieldRef}
              id="suggest-name"
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
            <label htmlFor="suggest-email" className={labelClasses}>
              Work email
            </label>
            <input
              id="suggest-email"
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
            <label htmlFor="suggest-idea" className={labelClasses}>
              What&apos;s your idea?
            </label>
            <textarea
              id="suggest-idea"
              name="idea"
              rows={6}
              required
              maxLength={IDEA_MAX_LENGTH}
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
              className={`${inputClasses} resize-y min-h-[140px]`}
              placeholder="Tell us what you'd like to see — as much or as little detail as you want."
            />
          </div>

          {/*
            Honeypot: same pattern as DemoRequestModal — off-screen (not
            display:none), aria-hidden + tabIndex=-1. Must stay named "website"
            to match the server-side check in app/api/contact/route.ts.
          */}
          <div
            aria-hidden="true"
            className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden"
          >
            <label htmlFor="suggest-website">Website</label>
            <input
              id="suggest-website"
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
