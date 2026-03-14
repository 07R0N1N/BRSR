# BRSR Docx Comparison: Reference vs Generated Output

## Reference Document
**Eternal Limited_FY_2023_2024_BRSR.docx** (Zomato FY 2023-24 BRSR)

## Generated Output
**BRSR_Test_Company_2024-25.docx** (from Export BRSR tool)

---

## Executive Summary

| Aspect | Reference (Eternal/Zomato) | Generated (BRSR Tool) |
|--------|---------------------------|------------------------|
| **Table structure** | Section-specific multi-column tables | Uniform 2-column (Indicator / Value) for all sections |
| **Section I (Details)** | Label + value pairs, some with sub-tables (e.g. FY dates) | Flat Indicator/Value rows |
| **Section II (Products/Services)** | Tables with columns: Description, NIC Code, % Turnover | 15+ rows per item (Row 1 Main, Row 1 Activity, Row 1 Pct, etc.) |
| **Section III (Operations)** | Location table: Plants, Offices, Total (National/International) | Flat rows; gen_18 fields shown as separate numbered items |
| **Section IV (Employees)** | Multi-column tables: Male/Female/Other, Total, %, by category | 20+ repeated "20(a). Employees and workers..." rows |
| **Section V (Holding/Subsidiary)** | Table: Name, Type, % shares, BR participation | 20 rows (5 entities × 4 fields each) |
| **Section VI (CSR)** | Structured: Applicable Y/N, Turnover, Net worth | 3 flat rows |
| **Section VII (Complaints)** | Wide table: Stakeholder, Mechanism, Web link, FY data, Pending, Remarks | 40+ flat rows (one per question code) |
| **Section VIII (Material Issues)** | Table: Issue, Risk/Opportunity, Rationale, Approach, Financial implications | 25 rows (5 issues × 5 fields) |
| **Section B** | Policies table (principles as columns or rows), Leadership section | Flat Indicator/Value for each sb_* code |
| **Section C (Principles)** | NGRBC statement + Essential table + Leadership table per principle | No NGRBC statement; Essential/Leadership as flat Indicator/Value |
| **Cover page** | Org name, CIN, FY dates, assurance info | Org name, CIN, Reporting Year, Company Type |
| **Footnotes/Headers** | Yes (footnotes, section footers) | No |
| **Page size** | A4 | A4 |

---

## Detailed Differences

### 1. Cover Page

**Reference:**
- Section A: General Disclosures
- I. Details of the listed Entity
- Notes
- 1. Corporate Identity Number (CIN) → value
- 2. Name of the Listed Entity → value
- 3. **Date** of Incorporation (not "Year")
- 9. Financial year: **table** with Start Date, End Date for Current, Previous, Prior to Previous FY
- 10. Stock Exchange: **table** with Name, Description, Country
- 11. Paid-up Capital **(in INR)**
- 12. Contact: **table** (Name, Contact number, Email)
- 14. Assurance: Yes/No

**Generated:**
- Business Responsibility and Sustainability Report
- Org name, CIN, Reporting Year, Company Type (simple body text)
- No FY date table, no contact table, no assurance field on cover

---

### 2. Section I – Details of the Listed Entity

**Reference:** Each item (1–15) is a distinct row/cell with label and value. Item 9 and 10 use **sub-tables**.

**Generated:** Single flat table with 15 rows: "1. Corporate Identity Number (CIN)" / "—", etc. All use the same Indicator/Value pattern.

---

### 3. Section II – Products/Services

**Reference (Item 17 – Business activities):**
| Description of main activity | Description of business activity | % of Turnover |
|------------------------------|-----------------------------------|---------------|
| Information Service Activities (NIC: 63999) | Other information & communication service activities | 100.0 |

**Reference (Item 18 – Products/Services):**
| Product/Service | NIC Code | % of total Turnover |
|-----------------|----------|---------------------|
| Zomato - India Food Ordering... | 63999 | 96.0 |

**Generated:** 15 rows for item 16 (Row 1 Main, Row 1 Activity, Row 1 Pct, Row 2 Main, ...) and 15 for item 17. Each sub-field is a separate Indicator/Value row.

---

### 4. Section III – Operations

**Reference (Item 19 – Locations):**
| Location | Number of plants | Number of offices | Total |
|----------|------------------|-------------------|-------|
| National | 0 | 22 | ... |
| International | 0 | 0 | 0 |

Plus Notes paragraph.

**Reference (Item 20 – Markets):**
- i. Number of locations (National states, International countries)
- ii. Export % with Notes
- iii. Brief on types of customers

**Generated:** Flat rows for gen_18 (4 rows), gen_19 (2), gen_19b, gen_19c. No multi-column layout.

---

### 5. Section IV – Employees & Workers

**Reference:** Multiple tables:
- 21.i Employees: Male/Female/Other, Total, %, by Permanent/Other/Total
- 21.ii Workers: same structure
- 21.iii Differently abled Employees
- 21.iv Differently abled Workers
- 22. Participation of women: Board, KMP table
- 23. Turnover rate: 3-year table (Male %, Female %, Total % for Employees/Workers)

**Generated:** 20+ rows all labeled "20(a). Employees and workers..." or "20(b). Differently abled...", "21. Participation/Inclusion of women", "22. Turnover rate...". Each question code is a separate row; no grid layout.

---

### 6. Section V – Holding/Subsidiary/JVs

**Reference:**
| Name | Holding/Subsidiary/Associate/JV | % of shares | Participate in BR initiatives? |
|------|--------------------------------|-------------|-------------------------------|
| Zomato Chile SpA | Subsidiary | 0.0 | No |
| ... | ... | ... | ... |

**Generated:** 20 rows (5 entities × Name, Type, Pct, Br). Same Indicator/Value pattern.

---

### 7. Section VI – CSR

**Reference:** "Whether CSR is applicable" (Yes/No), Turnover (INR), Net worth (INR), with Notes.

**Generated:** 3 flat rows.

---

### 8. Section VII – Complaints

**Reference:** Wide table:
- Stakeholder group
- Grievance Redressal Mechanism (Y/N)
- Web-link
- No. filed (current year)
- No. pending (current year)
- Remark
- Same for previous year

**Generated:** 40+ rows, one per gen_25_* code (comm_mech, comm_cy_f, comm_cy_p, etc.).

---

### 9. Section VIII – Material Issues

**Reference:**
| Material issue | Risk or opportunity | Rationale | Approach to mitigate | Financial implications |
|----------------|---------------------|-----------|----------------------|------------------------|

**Generated:** 25 rows (5 issues × Issue, Ro, Rationale, Approach, Fin).

---

### 10. Section B – Management & Process

**Reference:** Policies as a structured table (principles as rows/columns), Leadership (sb_7, sb_8, sb_9) as narrative/structured blocks.

**Generated:** Flat Indicator/Value for each sb_1a_p1, sb_1a_p2, ... sb_12e_other.

---

### 11. Section C – Principles 1–9

**Reference (per principle):**
1. **NGRBC principle statement** (full text)
2. **Essential indicators** – section-specific table layout
3. **Leadership indicators** – section-specific table layout
4. Notes where applicable

**Generated:**
- No NGRBC statement
- Essential: flat Indicator/Value rows
- Leadership: flat Indicator/Value rows

---

## Recommendations for Alignment

To better match the reference (SEBI BRSR template):

1. **Section-specific table layouts** – Replace the single Indicator/Value pattern with section-appropriate tables (e.g. multi-column for Employees, Complaints, Holding/Subsidiary).
2. **Group row-based data** – For gen_16, gen_17, gen_23, gen_26: one table per item with columns (e.g. Main, Activity, %) instead of one row per sub-field.
3. **Add NGRBC statements** – Include the full NGRBC principle text before each Principle 1–9 section.
4. **Cover page** – Add FY date table, contact table, assurance field.
5. **Label wording** – Align with reference (e.g. "Date of Incorporation" vs "Year of incorporation", "Paid-up Capital (in INR)").
6. **Footnotes/headers** – Add where the reference uses them.

---

## Data Model Implications

The current `BRSRIndicator[]` (label + value) structure is too flat for sections that need:
- Multi-column tables (Employees, Complaints, Holding)
- Row grouping (Products/Services rows as table rows, not separate indicators)
- NGRBC statements (principle text, not from answers)

Consider extending `types/brsr.ts` with:
- `BRSRTable` for section-specific column definitions
- `BRSRRow[]` for grouped rows (e.g. one row = one business activity with Main, Activity, Pct)
- `ngrbcStatement: string` per principle in Section C
