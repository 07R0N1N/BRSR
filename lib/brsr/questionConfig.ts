/**
 * Re-export barrel — preserves all existing import paths.
 *
 * Edit individual source files instead of this file:
 *   - questionCodes.ts  — all *_CODES arrays, getQuestionCodesForPanel, isQuestionCode
 *   - calcRules.ts      — CALC_RULES array
 *   - panels.ts         — PANELS array
 *   - constants.ts      — REPORTING_YEARS, SAVE_DEBOUNCE_MS
 */
export * from "./questionCodes";
export * from "./calcRules";
export * from "./panels";
