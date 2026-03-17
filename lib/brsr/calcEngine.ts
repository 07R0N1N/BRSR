import type { AnswersState } from "./types";
import type { CalcRule } from "./types";
import { CALC_RULES } from "./questionConfig";

/**
 * Safe formula evaluation: only numbers, +, -, *, /, (, ), and question_code tokens.
 * No eval(); parses and evaluates with a simple recursive-descent parser.
 */
function safeEvalFormula(formula: string, values: AnswersState): number | null {
  const tokens = formula
    .split(/([+\-*/()])/g)
    .map((s) => s.trim())
    .filter(Boolean);
  let pos = 0;
  const getVal = (id: string): number => {
    const v = values[id];
    if (v === undefined || v === "") return NaN;
    const n = parseFloat(String(v).replace(/,/g, ""));
    return Number.isNaN(n) ? NaN : n;
  };
  const peek = (): string | undefined => tokens[pos];
  const consume = (): string | undefined => tokens[pos++];

  function parseExpr(): number | null {
    let left = parseTerm();
    if (left === null) return null;
    while (true) {
      const op = peek();
      if (op === "+") {
        consume();
        const right = parseTerm();
        if (right === null) return null;
        left = left + right;
      } else if (op === "-") {
        consume();
        const right = parseTerm();
        if (right === null) return null;
        left = left - right;
      } else break;
    }
    return left;
  }
  function parseTerm(): number | null {
    let left = parseFactor();
    if (left === null) return null;
    while (true) {
      const op = peek();
      if (op === "*") {
        consume();
        const right = parseFactor();
        if (right === null) return null;
        left = left * right;
      } else if (op === "/") {
        consume();
        const right = parseFactor();
        if (right === null || right === 0) return null;
        left = left / right;
      } else break;
    }
    return left;
  }
  function parseFactor(): number | null {
    const t = consume();
    if (!t) return null;
    if (t === "(") {
      const v = parseExpr();
      if (peek() !== ")") return null;
      consume();
      return v;
    }
    if (/^[a-zA-Z0-9_]+$/.test(t)) {
      const n = getVal(t);
      return Number.isNaN(n) ? null : n;
    }
    const n = parseFloat(t);
    return Number.isNaN(n) ? null : n;
  }

  pos = 0;
  const result = parseExpr();
  return result !== null && pos >= tokens.length ? result : null;
}

function runOneRule(rule: CalcRule, values: AnswersState): string {
  switch (rule.type) {
    case "pct": {
      const num = parseFloat(values[rule.num] ?? "");
      const denom = parseFloat(values[rule.denom] ?? "");
      if (Number.isNaN(num) || Number.isNaN(denom) || denom === 0)
        return "";
      const pct = (num / denom) * 100;
      const dec = rule.decimals ?? 2;
      const value = dec === 0 ? String(Math.round(pct)) : pct.toFixed(dec);
      return `${value}%`;
    }
    case "sum": {
      let sum = 0;
      for (const id of rule.sumIds) {
        const v = parseFloat(String(values[id] ?? "").replace(/,/g, ""));
        if (!Number.isNaN(v)) sum += v;
      }
      const dec = rule.decimals ?? 0;
      return dec === 0 ? String(Math.round(sum)) : sum.toFixed(dec);
    }
    case "formula": {
      const result = safeEvalFormula(rule.formula, { ...values });
      if (result === null) return "";
      const dec = rule.decimals ?? 2;
      return dec === 0 ? String(Math.round(result)) : result.toFixed(dec);
    }
    default:
      return "";
  }
}

/**
 * Given current answers, compute all display-only values from CALC_RULES.
 * Returns Record<outputId, string> for rendering in read-only cells.
 */
export function runCalculations(values: AnswersState): Record<string, string> {
  const out: Record<string, string> = {};
  const merged: AnswersState = { ...values };
  for (const rule of CALC_RULES) {
    const result = runOneRule(rule, merged);
    out[rule.outputId] = result;
    merged[rule.outputId] = result.replace(/%$/, "");
  }
  return out;
}
