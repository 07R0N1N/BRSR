"use client";

import { type ReactNode, type RefObject, useEffect, useRef } from "react";

/**
 * Generic marketing-site modal chrome: backdrop, Escape, focus trap, fixed
 * header/footer with a scrollable body. Knows nothing about forms or APIs —
 * callers supply header / body / footer content via slots.
 */
export function Modal({
  open,
  onClose,
  titleId,
  header,
  footer,
  children,
  initialFocusRef,
}: {
  open: boolean;
  onClose: () => void;
  /** id of the element that labels this dialog (passed to aria-labelledby). */
  titleId: string;
  header: ReactNode;
  footer?: ReactNode;
  children: ReactNode;
  /** Element to focus when the modal opens (e.g. the first form field). */
  initialFocusRef?: RefObject<HTMLElement | null>;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  // Autofocus the caller's preferred target on open.
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => initialFocusRef?.current?.focus(), 0);
    return () => clearTimeout(timer);
  }, [open, initialFocusRef]);

  // Escape-to-close + focus trap while the modal is open.
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key !== "Tab") return;

      const container = dialogRef.current;
      if (!container) return;
      // Exclude disabled, aria-hidden (e.g. honeypot wrappers), and tabindex=-1
      // so the trap still reaches footer Cancel/Submit after the layout split.
      const focusable = Array.from(
        container.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )
      ).filter(
        (el) =>
          !el.hasAttribute("disabled") &&
          el.getAttribute("aria-hidden") !== "true" &&
          el.tabIndex !== -1 &&
          !el.closest('[aria-hidden="true"]')
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0c1526]/70 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="flex max-h-[90vh] w-full max-w-[560px] flex-col overflow-hidden rounded-[20px] border border-[#e3e8f0] bg-white shadow-[0_24px_60px_rgba(13,21,38,.24)]"
      >
        {/* Fixed header — does not scroll with body content */}
        <div className="flex flex-none items-start justify-between gap-4 border-b border-[#eef1f6] px-[30px] pb-5 pt-[30px]">
          <div className="min-w-0 flex-1">{header}</div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="grid h-9 w-9 flex-none place-items-center rounded-full text-[#8b95ad] transition hover:bg-[#f0f4ff] hover:text-[#0d1526]"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="h-[18px] w-[18px]">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="min-h-0 flex-1 overflow-y-auto px-[30px] py-5">{children}</div>

        {/* Fixed footer — always visible when provided */}
        {footer != null ? (
          <div className="flex flex-none flex-col gap-3 border-t border-[#eef1f6] px-[30px] pb-[30px] pt-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}
