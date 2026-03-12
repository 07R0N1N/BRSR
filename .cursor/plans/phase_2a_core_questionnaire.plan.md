# Phase 2a — Core Questionnaire and Save (with Calculations and Autofill)

Reference: **brsr-data-entry 2.html**. This plan includes calculations and General Data → Principle 6 autofill in scope.

## In scope for Phase 2a

- 12-panel questionnaire (generaldata, general, sectionb, p1–p9), Supabase answers table, GET/POST API, debounced save.
- **Calculations:** Percentage (num/denom×100), sum (comma-separated ids), formula (safe expression: only numbers and question_code tokens, no eval). Run on value change; display in read-only cells.
- **General Data → Principle 6 autofill:** When `gdata_turnover_cy`, `gdata_turnover_py`, `gdata_ppp_cy`, `gdata_ppp_py` change: copy turnover to P6 revenue fields; compute PPP-adjusted (turnover/PPP) and copy to P6 rev_ppp fields. Persist autofilled values so they save.

## Out of scope for Phase 2a

- Visibility filtering by role, audit log, DOCX/PDF export, XBRL import.

## P6 autofill mapping (from HTML)

- Revenue CY → `p6_e1_rev_cy`, `p6_e3_rev_cy`, `p6_e7_rev_cy`, `p6_e9_rev_cy`
- Revenue PY → `p6_e1_rev_py`, `p6_e3_rev_py`, `p6_e7_rev_py`, `p6_e9_rev_py`
- Rev PPP CY → `p6_e1_rev_ppp_cy`, `p6_e3_rev_ppp_cy`, `p6_e7_rev_ppp_cy`, `p6_e9_rev_ppp_cy`
- Rev PPP PY → `p6_e1_rev_ppp_py`, `p6_e3_rev_ppp_py`, `p6_e7_rev_ppp_py`, `p6_e9_rev_ppp_py`
