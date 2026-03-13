"use client";

import { useEffect, useMemo, useRef } from "react";
import type { AnswersState } from "@/lib/brsr/types";
import { getPrincipleTemplate } from "@/lib/brsr/principleTemplates";

type Tab = "essential" | "leadership";

// ---------------------------------------------------------------------------
// Calc helpers (used by the HTML template layer only; calcEngine handles JSX panels)
// ---------------------------------------------------------------------------

function toNumber(value: string | undefined): number {
  const n = Number.parseFloat((value ?? "").trim());
  return Number.isFinite(n) ? n : 0;
}

function formatCalc(value: number, decimals = 2, suffix = ""): string {
  if (!Number.isFinite(value)) return "";
  return `${value.toFixed(decimals)}${suffix}`;
}

function evalFormula(formula: string, values: AnswersState): number {
  const expr = formula.replace(/[a-zA-Z][a-zA-Z0-9_]*/g, (token) =>
    String(toNumber(values[token]))
  );
  try {
    // eslint-disable-next-line no-new-func
    const result = Function(`"use strict"; return (${expr});`)() as number;
    return Number.isFinite(result) ? result : 0;
  } catch {
    return 0;
  }
}

/**
 * Pre-processes HTML template strings: clones dynamic table rows from the
 * first row (data-row-index="0") based on the saved rowcount value.
 */
function expandDynamicRows(html: string, values: AnswersState): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(`<div id="root">${html}</div>`, "text/html");
  const root = doc.getElementById("root");
  if (!root) return html;

  const tables = root.querySelectorAll("table[data-dynamic-rows]");
  tables.forEach((table) => {
    const tableId = table.getAttribute("data-dynamic-rows");
    if (!tableId) return;
    const rowCountEl = root.querySelector<HTMLInputElement>(`#${tableId}_rowcount`);
    const rowCount = Math.max(
      1,
      Number.parseInt(values[`${tableId}_rowcount`] ?? rowCountEl?.value ?? "1", 10) || 1
    );
    if (rowCountEl) rowCountEl.value = String(rowCount);
    const tbody = table.querySelector("tbody");
    const firstRow = tbody?.querySelector('tr[data-row-index="0"]');
    if (!tbody || !firstRow) return;
    for (let i = 1; i < rowCount; i++) {
      const clone = firstRow.cloneNode(true) as HTMLElement;
      clone.setAttribute("data-row-index", String(i));
      clone
        .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
          "input[id], textarea[id], select[id]"
        )
        .forEach((input) => {
          if (input.id.includes("_row0_")) {
            input.id = input.id.replace("_row0_", `_row${i}_`);
            if ("value" in input) input.value = "";
          }
        });
      clone.querySelectorAll<HTMLElement>("[data-num], [data-denom]").forEach((el) => {
        const num = el.getAttribute("data-num");
        const denom = el.getAttribute("data-denom");
        if (num?.includes("_row0_")) el.setAttribute("data-num", num.replace("_row0_", `_row${i}_`));
        if (denom?.includes("_row0_"))
          el.setAttribute("data-denom", denom.replace("_row0_", `_row${i}_`));
      });
      clone.querySelectorAll<HTMLElement>(".btn-remove-row").forEach((btn) => {
        btn.style.display = "";
      });
      tbody.appendChild(clone);
    }
  });

  return root.innerHTML;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

type Props = {
  principleNum: number;
  activeTab: Tab;
  values: AnswersState;
  onChange: (code: string, value: string) => void;
  allowedSet?: Set<string> | null;
};

export function LegacyPrincipleRenderer({
  principleNum,
  activeTab,
  values,
  onChange,
  allowedSet = null,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const template = useMemo(() => getPrincipleTemplate(principleNum), [principleNum]);
  const rawHtml = activeTab === "essential" ? template?.essential ?? "" : template?.leadership ?? "";
  const html = useMemo(() => expandDynamicRows(rawHtml, values), [rawHtml, values]);

  // Sync input values into the rendered HTML after each re-render
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    root
      .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        "input[id], textarea[id], select[id]"
      )
      .forEach((input) => {
        const next = values[input.id] ?? "";
        if (input.value !== next) input.value = next;
      });
  }, [html, values]);

  // Hide unassigned inputs and rows when restricted.
  useEffect(() => {
    if (!allowedSet) return;
    const root = containerRef.current;
    if (!root) return;
    root
      .querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
        "input[id], textarea[id], select[id]"
      )
      .forEach((input) => {
        const allowed = allowedSet.has(input.id);
        const cell = input.closest("td, th, div");
        if (cell) (cell as HTMLElement).style.display = allowed ? "" : "none";
      });

    root.querySelectorAll<HTMLTableRowElement>("tr").forEach((tr) => {
      const ids = Array.from(
        tr.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
          "input[id], textarea[id], select[id]"
        )
      ).map((el) => el.id);
      if (ids.length === 0) return;
      const showRow = ids.some((id) => allowedSet.has(id));
      tr.style.display = showRow ? "" : "none";
    });
  }, [html, allowedSet]);

  // Update calc-display cells after each values change
  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;
    root.querySelectorAll<HTMLElement>(".calc-display").forEach((el) => {
      if (el.classList.contains("calc-pct")) {
        const num = toNumber(values[el.getAttribute("data-num") ?? ""]);
        const denom = toNumber(values[el.getAttribute("data-denom") ?? ""]);
        el.textContent = denom === 0 ? "" : formatCalc((num / denom) * 100, 2, "%");
        return;
      }
      if (el.classList.contains("calc-sum")) {
        const ids = (el.getAttribute("data-sum") ?? "")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const decimals = Number.parseInt(el.getAttribute("data-decimals") ?? "2", 10) || 2;
        const sum = ids.reduce((acc, id) => acc + toNumber(values[id]), 0);
        el.textContent = formatCalc(sum, decimals);
        return;
      }
      if (el.classList.contains("calc-formula")) {
        const formula = el.getAttribute("data-formula") ?? "";
        el.textContent = formula ? formatCalc(evalFormula(formula, values), 2) : "";
      }
    });
  }, [html, values]);

  if (!template) return null;

  return (
    <div
      ref={containerRef}
      className="principle-template mt-6"
      onInput={(e) => {
        const t = e.target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement;
        if (t?.id) onChange(t.id, t.value);
      }}
      onClick={(e) => {
        const btn = (e.target as HTMLElement).closest("button");
        if (!btn) return;
        const tableId = btn.getAttribute("data-table");
        if (!tableId) return;
        if (btn.classList.contains("add-row-btn")) {
          const rowCountId = `${tableId}_rowcount`;
          const curr = Math.max(1, Number.parseInt(values[rowCountId] ?? "1", 10) || 1);
          onChange(rowCountId, String(curr + 1));
        }
        if (btn.classList.contains("btn-remove-row")) {
          const rowCountId = `${tableId}_rowcount`;
          const curr = Math.max(1, Number.parseInt(values[rowCountId] ?? "1", 10) || 1);
          const row = btn.closest("tr");
          const idx = Number.parseInt(row?.getAttribute("data-row-index") ?? "-1", 10);
          if (idx <= 0 || curr <= 1) return;
          const rowInputs =
            row?.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>(
              "input[id], textarea[id], select[id]"
            ) ?? [];
          const patterns = Array.from(rowInputs)
            .map((el) => el.id)
            .filter((id) => id.includes(`_row${idx}_`))
            .map((id) => ({
              from: id,
              prefix: id.split(`_row${idx}_`)[0],
              suffix: id.split(`_row${idx}_`)[1],
            }));
          for (let r = idx; r < curr - 1; r++) {
            patterns.forEach(({ prefix, suffix }) => {
              onChange(`${prefix}_row${r}_${suffix}`, values[`${prefix}_row${r + 1}_${suffix}`] ?? "");
            });
          }
          patterns.forEach(({ prefix, suffix }) => {
            onChange(`${prefix}_row${curr - 1}_${suffix}`, "");
          });
          onChange(rowCountId, String(curr - 1));
        }
      }}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
