import type { AnswersState } from "./types";
import {
  P6_AUTOFILL_REV_IDS,
  P6_AUTOFILL_REV_PPP_IDS,
} from "./questionConfig";

const REV_CY = P6_AUTOFILL_REV_IDS.slice(0, 4);
const REV_PY = P6_AUTOFILL_REV_IDS.slice(4, 8);
const REV_PPP_CY = P6_AUTOFILL_REV_PPP_IDS.slice(0, 4);
const REV_PPP_PY = P6_AUTOFILL_REV_PPP_IDS.slice(4, 8);

/**
 * When General Data turnover/PPP change, compute the 16 P6 revenue and rev_ppp values.
 * Returns a partial AnswersState to merge: only keys that should be updated (non-empty).
 */
export function flowGeneralDataToPrinciple6(values: AnswersState): Partial<AnswersState> {
  const turnoverCy = (values["gdata_turnover_cy"] ?? "").trim();
  const turnoverPy = (values["gdata_turnover_py"] ?? "").trim();
  const pppCy = (values["gdata_ppp_cy"] ?? "").trim();
  const pppPy = (values["gdata_ppp_py"] ?? "").trim();

  const out: Partial<AnswersState> = {};

  if (turnoverCy) {
    for (const id of REV_CY) out[id] = turnoverCy;
  }
  if (turnoverPy) {
    for (const id of REV_PY) out[id] = turnoverPy;
  }

  const numCy = parseFloat(turnoverCy);
  const numPy = parseFloat(turnoverPy);
  const denCy = parseFloat(pppCy);
  const denPy = parseFloat(pppPy);
  const revPppCy =
    denCy && !Number.isNaN(numCy) ? (numCy / denCy).toFixed(2) : "";
  const revPppPy =
    denPy && !Number.isNaN(numPy) ? (numPy / denPy).toFixed(2) : "";

  if (revPppCy) {
    for (const id of REV_PPP_CY) out[id] = revPppCy;
  }
  if (revPppPy) {
    for (const id of REV_PPP_PY) out[id] = revPppPy;
  }

  return out;
}
