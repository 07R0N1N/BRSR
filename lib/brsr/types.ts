/** Panel IDs matching brsr-data-entry 2.html */
export type PanelId =
  | "generaldata"
  | "general"
  | "sectionb"
  | "p1"
  | "p2"
  | "p3"
  | "p4"
  | "p5"
  | "p6"
  | "p7"
  | "p8"
  | "p9";

/** Answers state: question_code -> value (string) */
export type AnswersState = Record<string, string>;

/** Calc rule for display-only cells */
export type CalcRulePct = {
  type: "pct";
  outputId: string;
  num: string;
  denom: string;
  decimals?: number;
};
export type CalcRuleSum = {
  type: "sum";
  outputId: string;
  sumIds: string[];
  decimals?: number;
};
export type CalcRuleFormula = {
  type: "formula";
  outputId: string;
  formula: string; // e.g. "gdata_turnover_cy/gdata_ppp_cy"
  decimals?: number;
};
export type CalcRule = CalcRulePct | CalcRuleSum | CalcRuleFormula;
