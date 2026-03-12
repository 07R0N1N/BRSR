export type PrincipleTemplate = { essential: string; leadership: string };

export function getPrincipleTemplate(principleNum: number): PrincipleTemplate | null {
  const p = `p${principleNum}_`;
  switch (principleNum) {
    case 1:
      return {
        essential: `
          <div class="section-block"><h3>Essential indicators</h3>
            <p class="brsr-section">1. Percentage coverage by training and awareness programmes</p>
            <table class="brsr-table"><thead><tr><th>Segment</th><th>No. of programmes</th><th>Topics/principles &amp; impact</th><th>Total in category (A)</th><th>Covered (B)</th><th>% (B/A) calc</th></tr></thead><tbody>
              <tr><td>Board of Directors</td><td><input type="text" id="${p}e1_bod_prog" class="calc-input"></td><td><input type="text" id="${p}e1_bod_topics"></td><td><input type="text" id="${p}e1_bod_total" class="calc-input"></td><td><input type="text" id="${p}e1_bod_covered" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1_bod_covered" data-denom="${p}e1_bod_total"></span></td></tr>
              <tr><td>Key Managerial Personnel</td><td><input type="text" id="${p}e1_kmp_prog" class="calc-input"></td><td><input type="text" id="${p}e1_kmp_topics"></td><td><input type="text" id="${p}e1_kmp_total" class="calc-input"></td><td><input type="text" id="${p}e1_kmp_covered" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1_kmp_covered" data-denom="${p}e1_kmp_total"></span></td></tr>
              <tr><td>Employees (other than BoD/KMP)</td><td><input type="text" id="${p}e1_emp_prog" class="calc-input"></td><td><input type="text" id="${p}e1_emp_topics"></td><td><input type="text" id="${p}e1_emp_total" class="calc-input"></td><td><input type="text" id="${p}e1_emp_covered" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1_emp_covered" data-denom="${p}e1_emp_total"></span></td></tr>
              <tr><td>Workers</td><td><input type="text" id="${p}e1_wrk_prog" class="calc-input"></td><td><input type="text" id="${p}e1_wrk_topics"></td><td><input type="text" id="${p}e1_wrk_total" class="calc-input"></td><td><input type="text" id="${p}e1_wrk_covered" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1_wrk_covered" data-denom="${p}e1_wrk_total"></span></td></tr>
            </tbody></table>
            <p class="brsr-section">2. Fines/penalties/punishment/award/compounding/settlement (monetary)</p>
            <table class="brsr-table"><thead><tr><th>Type</th><th>NGRBC Principle</th><th>Regulator/agency</th><th>Amount (INR)</th><th>Brief of case</th><th>Appeal preferred? (Y/N)</th></tr></thead><tbody>
              <tr><td>Penalty/Fine</td><td><input type="text" id="${p}e2_pf_principle"></td><td><input type="text" id="${p}e2_pf_agency"></td><td><input type="text" id="${p}e2_pf_amt"></td><td><input type="text" id="${p}e2_pf_brief"></td><td><input type="text" id="${p}e2_pf_appeal"></td></tr>
              <tr><td>Settlement</td><td><input type="text" id="${p}e2_set_principle"></td><td><input type="text" id="${p}e2_set_agency"></td><td><input type="text" id="${p}e2_set_amt"></td><td><input type="text" id="${p}e2_set_brief"></td><td><input type="text" id="${p}e2_set_appeal"></td></tr>
              <tr><td>Compounding fee</td><td><input type="text" id="${p}e2_cmp_principle"></td><td><input type="text" id="${p}e2_cmp_agency"></td><td><input type="text" id="${p}e2_cmp_amt"></td><td><input type="text" id="${p}e2_cmp_brief"></td><td><input type="text" id="${p}e2_cmp_appeal"></td></tr>
            </tbody></table>
            <p class="brsr-section">3. Appeal/Revision details (where action appealed)</p>
            <div class="field"><textarea id="${p}e3_appeal" placeholder="Case details, authority" style="min-height:60px"></textarea></div>
            <p class="brsr-section">4. Anti-corruption / anti-bribery policy (Y/N). If yes, details and weblink</p>
            <div class="field"><input type="text" id="${p}e4_anticorr" placeholder="Y/N and weblink"></div>
            <p class="brsr-section">5. Disciplinary action (law enforcement) – bribery/corruption</p>
            <table class="brsr-table"><thead><tr><th></th><th>Current FY</th><th>Previous FY</th></tr></thead><tbody>
              <tr><td>Directors</td><td><input type="text" id="${p}e5_dir_cy"></td><td><input type="text" id="${p}e5_dir_py"></td></tr>
              <tr><td>KMPs</td><td><input type="text" id="${p}e5_kmp_cy"></td><td><input type="text" id="${p}e5_kmp_py"></td></tr>
              <tr><td>Employees</td><td><input type="text" id="${p}e5_emp_cy"></td><td><input type="text" id="${p}e5_emp_py"></td></tr>
              <tr><td>Workers</td><td><input type="text" id="${p}e5_wrk_cy"></td><td><input type="text" id="${p}e5_wrk_py"></td></tr>
            </tbody></table>
            <p class="brsr-section">6. Complaints – conflict of interest (Directors / KMPs)</p>
            <table class="brsr-table"><thead><tr><th></th><th>Current FY – No.</th><th>Current FY – Remarks</th><th>Previous FY – No.</th><th>Previous FY – Remarks</th></tr></thead><tbody>
              <tr><td>Directors</td><td><input type="text" id="${p}e6_dir_cy"></td><td><input type="text" id="${p}e6_dir_cy_rem"></td><td><input type="text" id="${p}e6_dir_py"></td><td><input type="text" id="${p}e6_dir_py_rem"></td></tr>
              <tr><td>KMPs</td><td><input type="text" id="${p}e6_kmp_cy"></td><td><input type="text" id="${p}e6_kmp_cy_rem"></td><td><input type="text" id="${p}e6_kmp_py"></td><td><input type="text" id="${p}e6_kmp_py_rem"></td></tr>
            </tbody></table>
            <p class="brsr-section">7. Corrective action on fines/penalties/corruption/conflict of interest</p>
            <div class="field"><textarea id="${p}e7_corrective" style="min-height:60px"></textarea></div>
            <p class="brsr-section">8. Days of accounts payables (AP × 365 / Cost of goods procured)</p>
            <table class="brsr-table"><thead><tr><th></th><th>Current FY</th><th>Previous FY</th></tr></thead><tbody>
              <tr><td>Accounts payables (Rs.)</td><td><input type="text" id="${p}e8_ap_cy" class="calc-input"></td><td><input type="text" id="${p}e8_ap_py" class="calc-input"></td></tr>
              <tr><td>Cost of goods/services procured (Rs.)</td><td><input type="text" id="${p}e8_cost_cy" class="calc-input"></td><td><input type="text" id="${p}e8_cost_py" class="calc-input"></td></tr>
              <tr><td>Days (calc)</td><td><span class="calc-display calc-formula" data-formula="${p}e8_ap_cy*365/${p}e8_cost_cy"></span></td><td><span class="calc-display calc-formula" data-formula="${p}e8_ap_py*365/${p}e8_cost_py"></span></td></tr>
            </tbody></table>
            <p class="brsr-section">9. Open-ness – concentration of purchases/sales, RPTs</p>
            <table class="brsr-table"><thead><tr><th>Parameter</th><th>Current FY</th><th>Previous FY</th></tr></thead><tbody>
              <tr><td>Purchases from trading houses as % of total purchases</td><td><input type="text" id="${p}e9_purch_cy"></td><td><input type="text" id="${p}e9_purch_py"></td></tr>
              <tr><td>Sales to dealers/distributors as % of total sales</td><td><input type="text" id="${p}e9_sales_cy"></td><td><input type="text" id="${p}e9_sales_py"></td></tr>
              <tr><td>Related party – Purchases %</td><td><input type="text" id="${p}e9_rpt_purch_cy"></td><td><input type="text" id="${p}e9_rpt_purch_py"></td></tr>
              <tr><td>Related party – Sales %</td><td><input type="text" id="${p}e9_rpt_sales_cy"></td><td><input type="text" id="${p}e9_rpt_sales_py"></td></tr>
            </tbody></table>
          </div>`,
        leadership: `
          <div class="section-block"><h3>Leadership indicators</h3>
            <p class="brsr-section">1. Awareness programmes for value chain partners</p>
            <table class="brsr-table"><thead><tr><th>No. of programmes</th><th>Topics/principles covered</th><th>Value chain partners – total business (Rs.)</th><th>Partners covered (Rs.)</th><th>% covered (calc)</th></tr></thead><tbody>
              <tr><td><input type="text" id="${p}l1_prog" class="calc-input"></td><td><input type="text" id="${p}l1_topics"></td><td><input type="text" id="${p}l1_total_val" class="calc-input"></td><td><input type="text" id="${p}l1_covered_val" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}l1_covered_val" data-denom="${p}l1_total_val"></span></td></tr>
            </tbody></table>
            <p class="brsr-section">2. Processes to avoid/manage conflict of interests (Board)? (Y/N). If yes, details</p>
            <div class="field"><input type="text" id="${p}l2_conflict" placeholder="Y/N and details"></div>
          </div>`,
      };
    case 2:
      return {
        essential: `
          <div class="section-block"><h3>Essential indicators</h3>
            <p class="brsr-section">1. R&amp;D and capex % for environmental and social impacts</p>
            <table class="brsr-table"><thead><tr><th></th><th>Current FY %</th><th>Previous FY %</th><th>Details of improvements</th></tr></thead><tbody>
              <tr><td>R&amp;D – Total investment (Rs.)</td><td><input type="text" id="${p}e1_rd_cy" class="calc-input"></td><td><input type="text" id="${p}e1_rd_py" class="calc-input"></td><td><input type="text" id="${p}e1_rd_details"></td></tr>
              <tr><td>R&amp;D – Env/social (Rs.)</td><td><input type="text" id="${p}e1_rd_env_cy" class="calc-input"></td><td><input type="text" id="${p}e1_rd_env_py" class="calc-input"></td><td rowspan="2"></td></tr>
              <tr><td>R&amp;D % (calc)</td><td><span class="calc-display calc-pct" data-num="${p}e1_rd_env_cy" data-denom="${p}e1_rd_cy"></span></td><td><span class="calc-display calc-pct" data-num="${p}e1_rd_env_py" data-denom="${p}e1_rd_py"></span></td></tr>
              <tr><td>Capex – Total (Rs.)</td><td><input type="text" id="${p}e1_capex_cy" class="calc-input"></td><td><input type="text" id="${p}e1_capex_py" class="calc-input"></td><td><input type="text" id="${p}e1_capex_details"></td></tr>
              <tr><td>Capex – Env/social (Rs.)</td><td><input type="text" id="${p}e1_capex_env_cy" class="calc-input"></td><td><input type="text" id="${p}e1_capex_env_py" class="calc-input"></td><td></td></tr>
              <tr><td>Capex % (calc)</td><td><span class="calc-display calc-pct" data-num="${p}e1_capex_env_cy" data-denom="${p}e1_capex_cy"></span></td><td><span class="calc-display calc-pct" data-num="${p}e1_capex_env_py" data-denom="${p}e1_capex_py"></span></td><td></td></tr>
            </tbody></table>
            <p class="brsr-section">2. Sustainable sourcing</p>
            <table class="brsr-table"><thead><tr><th>Procedures in place (Y/N)</th><th>Total inputs (by value) (Rs.)</th><th>Inputs sourced sustainably (Rs.)</th><th>% sourced sustainably (calc)</th></tr></thead><tbody>
              <tr><td><input type="text" id="${p}e2_yn" placeholder="Y/N"></td><td><input type="text" id="${p}e2_total" class="calc-input"></td><td><input type="text" id="${p}e2_sustainable" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_sustainable" data-denom="${p}e2_total"></span></td></tr>
            </tbody></table>
            <p class="brsr-section">3. Processes to reclaim products (reuse, recycle, dispose)</p>
            <table class="brsr-table"><thead><tr><th>Category</th><th>Process / details</th></tr></thead><tbody>
              <tr><td>(a) Plastics (incl. packaging)</td><td><input type="text" id="${p}e3_plastics"></td></tr>
              <tr><td>(b) E-waste</td><td><input type="text" id="${p}e3_ewaste"></td></tr>
              <tr><td>(c) Hazardous waste</td><td><input type="text" id="${p}e3_hazardous"></td></tr>
              <tr><td>(d) Other waste</td><td><input type="text" id="${p}e3_other"></td></tr>
            </tbody></table>
            <p class="brsr-section">4. EPR applicable (Y/N). Waste collection plan in line with EPR? Steps if not.</p>
            <div class="field"><input type="text" id="${p}e4_epr" placeholder="Y/N"></div>
            <div class="field"><label>If not in line, steps taken</label><textarea id="${p}e4_steps" style="min-height:50px"></textarea></div>
          </div>`,
        leadership: `
          <div class="section-block"><h3>Leadership indicators</h3>
            <p class="brsr-section">1. Life Cycle Perspective / Assessments (LCA)</p>
            <table class="brsr-table" data-dynamic-rows="${p}l1" data-row-prefix="${p}l1"><thead><tr><th>NIC Code</th><th>Product/Service</th><th>% of turnover</th><th>Boundary (LCA)</th><th>Independent agency (Y/N)</th><th>Public domain (Y/N)</th><th>Weblink</th><th></th></tr></thead><tbody>
              <tr data-row-index="0"><td><input type="text" id="${p}l1_row0_nic"></td><td><input type="text" id="${p}l1_row0_product"></td><td><input type="text" id="${p}l1_row0_pct"></td><td><input type="text" id="${p}l1_row0_boundary"></td><td><input type="text" id="${p}l1_row0_ext"></td><td><input type="text" id="${p}l1_row0_public"></td><td><input type="text" id="${p}l1_row0_link"></td><td><button type="button" class="btn btn-sm btn-remove-row" data-table="${p}l1" title="Remove row" style="display:none">Remove</button></td></tr>
            </tbody></table>
            <input type="hidden" id="${p}l1_rowcount" value="1">
            <div class="add-row-wrap btn-row" style="margin-bottom:1rem"><button type="button" class="btn btn-outline add-row-btn" data-table="${p}l1">Add row</button></div>
            <p class="brsr-section">2. Significant social/environmental concerns from production/disposal – action taken</p>
            <table class="brsr-table" data-dynamic-rows="${p}l2" data-row-prefix="${p}l2"><thead><tr><th>Product/Service</th><th>Risk/concern</th><th>Action taken</th><th></th></tr></thead><tbody>
              <tr data-row-index="0"><td><input type="text" id="${p}l2_row0_product"></td><td><input type="text" id="${p}l2_row0_risk"></td><td><input type="text" id="${p}l2_row0_action"></td><td><button type="button" class="btn btn-sm btn-remove-row" data-table="${p}l2" title="Remove row" style="display:none">Remove</button></td></tr>
            </tbody></table>
            <input type="hidden" id="${p}l2_rowcount" value="1">
            <div class="add-row-wrap btn-row" style="margin-bottom:1rem"><button type="button" class="btn btn-outline add-row-btn" data-table="${p}l2">Add row</button></div>
            <p class="brsr-section">3. Recycled or reused input material as % of total material (by value)</p>
            <table class="brsr-table" data-dynamic-rows="${p}l3" data-row-prefix="${p}l3"><thead><tr><th>Input material</th><th>Recycled/reused (Rs.)</th><th>Total material (Rs.)</th><th>% (calc)</th><th></th></tr></thead><tbody>
              <tr data-row-index="0"><td><input type="text" id="${p}l3_row0_material"></td><td><input type="text" id="${p}l3_row0_recycled" class="calc-input"></td><td><input type="text" id="${p}l3_row0_total" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}l3_row0_recycled" data-denom="${p}l3_row0_total"></span></td><td><button type="button" class="btn btn-sm btn-remove-row" data-table="${p}l3" title="Remove row" style="display:none">Remove</button></td></tr>
            </tbody></table>
            <input type="hidden" id="${p}l3_rowcount" value="1">
            <div class="add-row-wrap btn-row" style="margin-bottom:1rem"><button type="button" class="btn btn-outline add-row-btn" data-table="${p}l3">Add row</button></div>
            <p class="brsr-section">4. Products and packaging reclaimed at end of life (metric tonnes)</p>
            <table class="brsr-table"><thead><tr><th>Category</th><th>Current FY – Re-used</th><th>Recycled</th><th>Safely disposed</th><th>Previous FY – Re-used</th><th>Recycled</th><th>Safely disposed</th></tr></thead><tbody>
              <tr><td>Plastics (incl. packaging)</td><td><input type="text" id="${p}l4_plast_cy_re" class="calc-input"></td><td><input type="text" id="${p}l4_plast_cy_rc" class="calc-input"></td><td><input type="text" id="${p}l4_plast_cy_d" class="calc-input"></td><td><input type="text" id="${p}l4_plast_py_re"></td><td><input type="text" id="${p}l4_plast_py_rc"></td><td><input type="text" id="${p}l4_plast_py_d"></td></tr>
              <tr><td>E-waste</td><td><input type="text" id="${p}l4_ew_cy_re"></td><td><input type="text" id="${p}l4_ew_cy_rc"></td><td><input type="text" id="${p}l4_ew_cy_d"></td><td><input type="text" id="${p}l4_ew_py_re"></td><td><input type="text" id="${p}l4_ew_py_rc"></td><td><input type="text" id="${p}l4_ew_py_d"></td></tr>
              <tr><td>Hazardous waste</td><td><input type="text" id="${p}l4_haz_cy_re"></td><td><input type="text" id="${p}l4_haz_cy_rc"></td><td><input type="text" id="${p}l4_haz_cy_d"></td><td><input type="text" id="${p}l4_haz_py_re"></td><td><input type="text" id="${p}l4_haz_py_rc"></td><td><input type="text" id="${p}l4_haz_py_d"></td></tr>
              <tr><td>Other waste</td><td><input type="text" id="${p}l4_oth_cy_re"></td><td><input type="text" id="${p}l4_oth_cy_rc"></td><td><input type="text" id="${p}l4_oth_cy_d"></td><td><input type="text" id="${p}l4_oth_py_re"></td><td><input type="text" id="${p}l4_oth_py_rc"></td><td><input type="text" id="${p}l4_oth_py_d"></td></tr>
            </tbody></table>
            <p class="brsr-section">5. Reclaimed products and packaging as % of products sold (by category)</p>
            <table class="brsr-table"><thead><tr><th>Product category</th><th>Reclaimed %</th></tr></thead><tbody>
              <tr><td><input type="text" id="${p}l5_category"></td><td><input type="text" id="${p}l5_pct"></td></tr>
            </tbody></table>
          </div>`,
      };
    case 3:
      return {
        essential: `
          <div class="section-block"><h3>Essential indicators</h3>
            <p class="brsr-section">1(a). Well-being measures – Employees (% covered)</p>
            <table class="brsr-table"><thead><tr><th>Category</th><th>Total (A)</th><th>Health ins. No.</th><th>% (calc)</th><th>Accident ins. No.</th><th>% (calc)</th><th>Maternity No.</th><th>% (calc)</th><th>Paternity No.</th><th>% (calc)</th><th>Day care No.</th><th>% (calc)</th></tr></thead><tbody>
              <tr><td>Permanent – Male</td><td><input type="text" id="${p}e1a_perm_m_t" class="calc-input"></td><td><input type="text" id="${p}e1a_perm_m_hi" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_perm_m_hi" data-denom="${p}e1a_perm_m_t"></span></td><td><input type="text" id="${p}e1a_perm_m_ac" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_perm_m_ac" data-denom="${p}e1a_perm_m_t"></span></td><td><input type="text" id="${p}e1a_perm_m_mat" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_perm_m_mat" data-denom="${p}e1a_perm_m_t"></span></td><td><input type="text" id="${p}e1a_perm_m_pat" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_perm_m_pat" data-denom="${p}e1a_perm_m_t"></span></td><td><input type="text" id="${p}e1a_perm_m_dc" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_perm_m_dc" data-denom="${p}e1a_perm_m_t"></span></td></tr>
              <tr><td>Permanent – Female</td><td><input type="text" id="${p}e1a_perm_f_t" class="calc-input"></td><td><input type="text" id="${p}e1a_perm_f_hi" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_perm_f_hi" data-denom="${p}e1a_perm_f_t"></span></td><td><input type="text" id="${p}e1a_perm_f_ac" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_perm_f_ac" data-denom="${p}e1a_perm_f_t"></span></td><td><input type="text" id="${p}e1a_perm_f_mat" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_perm_f_mat" data-denom="${p}e1a_perm_f_t"></span></td><td><input type="text" id="${p}e1a_perm_f_pat" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_perm_f_pat" data-denom="${p}e1a_perm_f_t"></span></td><td><input type="text" id="${p}e1a_perm_f_dc" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_perm_f_dc" data-denom="${p}e1a_perm_f_t"></span></td></tr>
              <tr><td>Other than permanent – Male</td><td><input type="text" id="${p}e1a_oth_m_t" class="calc-input"></td><td><input type="text" id="${p}e1a_oth_m_hi" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_oth_m_hi" data-denom="${p}e1a_oth_m_t"></span></td><td><input type="text" id="${p}e1a_oth_m_ac" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_oth_m_ac" data-denom="${p}e1a_oth_m_t"></span></td><td><input type="text" id="${p}e1a_oth_m_mat" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_oth_m_mat" data-denom="${p}e1a_oth_m_t"></span></td><td><input type="text" id="${p}e1a_oth_m_pat" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_oth_m_pat" data-denom="${p}e1a_oth_m_t"></span></td><td><input type="text" id="${p}e1a_oth_m_dc" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_oth_m_dc" data-denom="${p}e1a_oth_m_t"></span></td></tr>
              <tr><td>Other than permanent – Female</td><td><input type="text" id="${p}e1a_oth_f_t" class="calc-input"></td><td><input type="text" id="${p}e1a_oth_f_hi" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_oth_f_hi" data-denom="${p}e1a_oth_f_t"></span></td><td><input type="text" id="${p}e1a_oth_f_ac" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_oth_f_ac" data-denom="${p}e1a_oth_f_t"></span></td><td><input type="text" id="${p}e1a_oth_f_mat" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_oth_f_mat" data-denom="${p}e1a_oth_f_t"></span></td><td><input type="text" id="${p}e1a_oth_f_pat" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_oth_f_pat" data-denom="${p}e1a_oth_f_t"></span></td><td><input type="text" id="${p}e1a_oth_f_dc" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1a_oth_f_dc" data-denom="${p}e1a_oth_f_t"></span></td></tr>
            </tbody></table>
            <p class="brsr-section">1(b). Well-being measures – Workers (% covered)</p>
            <table class="brsr-table"><thead><tr><th>Category</th><th>Total (A)</th><th>Health ins. No.</th><th>% (calc)</th><th>Accident ins. No.</th><th>% (calc)</th><th>Maternity No.</th><th>% (calc)</th><th>Paternity No.</th><th>% (calc)</th><th>Day care No.</th><th>% (calc)</th></tr></thead><tbody>
              <tr><td>Permanent – Male</td><td><input type="text" id="${p}e1b_perm_m_t" class="calc-input"></td><td><input type="text" id="${p}e1b_perm_m_hi" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_perm_m_hi" data-denom="${p}e1b_perm_m_t"></span></td><td><input type="text" id="${p}e1b_perm_m_ac" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_perm_m_ac" data-denom="${p}e1b_perm_m_t"></span></td><td><input type="text" id="${p}e1b_perm_m_mat" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_perm_m_mat" data-denom="${p}e1b_perm_m_t"></span></td><td><input type="text" id="${p}e1b_perm_m_pat" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_perm_m_pat" data-denom="${p}e1b_perm_m_t"></span></td><td><input type="text" id="${p}e1b_perm_m_dc" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_perm_m_dc" data-denom="${p}e1b_perm_m_t"></span></td></tr>
              <tr><td>Permanent – Female</td><td><input type="text" id="${p}e1b_perm_f_t" class="calc-input"></td><td><input type="text" id="${p}e1b_perm_f_hi" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_perm_f_hi" data-denom="${p}e1b_perm_f_t"></span></td><td><input type="text" id="${p}e1b_perm_f_ac" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_perm_f_ac" data-denom="${p}e1b_perm_f_t"></span></td><td><input type="text" id="${p}e1b_perm_f_mat" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_perm_f_mat" data-denom="${p}e1b_perm_f_t"></span></td><td><input type="text" id="${p}e1b_perm_f_pat" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_perm_f_pat" data-denom="${p}e1b_perm_f_t"></span></td><td><input type="text" id="${p}e1b_perm_f_dc" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_perm_f_dc" data-denom="${p}e1b_perm_f_t"></span></td></tr>
              <tr><td>Other than permanent – Male</td><td><input type="text" id="${p}e1b_oth_m_t" class="calc-input"></td><td><input type="text" id="${p}e1b_oth_m_hi" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_oth_m_hi" data-denom="${p}e1b_oth_m_t"></span></td><td><input type="text" id="${p}e1b_oth_m_ac" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_oth_m_ac" data-denom="${p}e1b_oth_m_t"></span></td><td><input type="text" id="${p}e1b_oth_m_mat" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_oth_m_mat" data-denom="${p}e1b_oth_m_t"></span></td><td><input type="text" id="${p}e1b_oth_m_pat" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_oth_m_pat" data-denom="${p}e1b_oth_m_t"></span></td><td><input type="text" id="${p}e1b_oth_m_dc" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_oth_m_dc" data-denom="${p}e1b_oth_m_t"></span></td></tr>
              <tr><td>Other than permanent – Female</td><td><input type="text" id="${p}e1b_oth_f_t" class="calc-input"></td><td><input type="text" id="${p}e1b_oth_f_hi" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_oth_f_hi" data-denom="${p}e1b_oth_f_t"></span></td><td><input type="text" id="${p}e1b_oth_f_ac" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_oth_f_ac" data-denom="${p}e1b_oth_f_t"></span></td><td><input type="text" id="${p}e1b_oth_f_mat" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_oth_f_mat" data-denom="${p}e1b_oth_f_t"></span></td><td><input type="text" id="${p}e1b_oth_f_pat" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_oth_f_pat" data-denom="${p}e1b_oth_f_t"></span></td><td><input type="text" id="${p}e1b_oth_f_dc" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1b_oth_f_dc" data-denom="${p}e1b_oth_f_t"></span></td></tr>
            </tbody></table>
            <p class="brsr-section">1(c). Spending on well-being as % of total revenue</p>
            <table class="brsr-table"><thead><tr><th></th><th>Current FY – Spending (Rs.)</th><th>Current FY – Revenue (Rs.)</th><th>% (calc)</th><th>Previous FY – Spending</th><th>Previous FY – Revenue</th><th>% (calc)</th></tr></thead><tbody>
              <tr><td>Cost on well-being</td><td><input type="text" id="${p}e1c_cy_spend" class="calc-input"></td><td><input type="text" id="${p}e1c_cy_rev" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1c_cy_spend" data-denom="${p}e1c_cy_rev"></span></td><td><input type="text" id="${p}e1c_py_spend" class="calc-input"></td><td><input type="text" id="${p}e1c_py_rev" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1c_py_spend" data-denom="${p}e1c_py_rev"></span></td></tr>
            </tbody></table>
            <p class="brsr-section">2. Retirement benefits (PF, Gratuity, ESI, Others)</p>
            <table class="brsr-table"><thead><tr><th>Benefit</th><th>Current FY – Employees %</th><th>Current FY – Workers %</th><th>Deducted/deposited (Y/N)</th><th>Previous FY – Employees %</th><th>Previous FY – Workers %</th><th>Deducted/deposited</th></tr></thead><tbody>
              <tr><td>PF</td><td><input type="text" id="${p}e2_pf_emp_cy"></td><td><input type="text" id="${p}e2_pf_wrk_cy"></td><td><input type="text" id="${p}e2_pf_dep_cy"></td><td><input type="text" id="${p}e2_pf_emp_py"></td><td><input type="text" id="${p}e2_pf_wrk_py"></td><td><input type="text" id="${p}e2_pf_dep_py"></td></tr>
              <tr><td>Gratuity</td><td><input type="text" id="${p}e2_gr_emp_cy"></td><td><input type="text" id="${p}e2_gr_wrk_cy"></td><td><input type="text" id="${p}e2_gr_dep_cy"></td><td><input type="text" id="${p}e2_gr_emp_py"></td><td><input type="text" id="${p}e2_gr_wrk_py"></td><td><input type="text" id="${p}e2_gr_dep_py"></td></tr>
              <tr><td>ESI</td><td><input type="text" id="${p}e2_esi_emp_cy"></td><td><input type="text" id="${p}e2_esi_wrk_cy"></td><td><input type="text" id="${p}e2_esi_dep_cy"></td><td><input type="text" id="${p}e2_esi_emp_py"></td><td><input type="text" id="${p}e2_esi_wrk_py"></td><td><input type="text" id="${p}e2_esi_dep_py"></td></tr>
              <tr><td>Others</td><td><input type="text" id="${p}e2_oth_emp_cy"></td><td><input type="text" id="${p}e2_oth_wrk_cy"></td><td><input type="text" id="${p}e2_oth_dep_cy"></td><td><input type="text" id="${p}e2_oth_emp_py"></td><td><input type="text" id="${p}e2_oth_wrk_py"></td><td><input type="text" id="${p}e2_oth_dep_py"></td></tr>
            </tbody></table>
            <p class="brsr-section">3. Accessibility for differently abled (Rights of Persons with Disabilities Act)</p>
            <div class="field"><input type="text" id="${p}e3_access" placeholder="Y/N. If not, steps"></div>
            <p class="brsr-section">4. Equal opportunity policy (Y/N). Weblink</p>
            <div class="field"><input type="text" id="${p}e4_equal" placeholder="Y/N and weblink"></div>
            <p class="brsr-section">5. Return to work and retention (parental leave)</p>
            <table class="brsr-table"><thead><tr><th>Gender</th><th>Permanent employees – Return %</th><th>Permanent employees – Retention %</th><th>Permanent workers – Return %</th><th>Permanent workers – Retention %</th></tr></thead><tbody>
              <tr><td>Male</td><td><input type="text" id="${p}e5_m_emp_ret"></td><td><input type="text" id="${p}e5_m_emp_retn"></td><td><input type="text" id="${p}e5_m_wrk_ret"></td><td><input type="text" id="${p}e5_m_wrk_retn"></td></tr>
              <tr><td>Female</td><td><input type="text" id="${p}e5_f_emp_ret"></td><td><input type="text" id="${p}e5_f_emp_retn"></td><td><input type="text" id="${p}e5_f_wrk_ret"></td><td><input type="text" id="${p}e5_f_wrk_retn"></td></tr>
            </tbody></table>
            <p class="brsr-section">6. Grievance mechanism (Y/N and details)</p>
            <table class="brsr-table"><thead><tr><th>Category</th><th>Y/N and details</th></tr></thead><tbody>
              <tr><td>Permanent workers</td><td><input type="text" id="${p}e6_wrk_perm"></td></tr>
              <tr><td>Other than permanent workers</td><td><input type="text" id="${p}e6_wrk_oth"></td></tr>
              <tr><td>Permanent employees</td><td><input type="text" id="${p}e6_emp_perm"></td></tr>
              <tr><td>Other than permanent employees</td><td><input type="text" id="${p}e6_emp_oth"></td></tr>
            </tbody></table>
            <p class="brsr-section">7. Membership in associations/unions</p>
            <table class="brsr-table"><thead><tr><th>Category</th><th>Current FY – Total (A)</th><th>In union (B)</th><th>% (calc)</th><th>Previous FY – Total</th><th>In union</th><th>% (calc)</th></tr></thead><tbody>
              <tr><td>Permanent employees – Male</td><td><input type="text" id="${p}e7_emp_m_t_cy" class="calc-input"></td><td><input type="text" id="${p}e7_emp_m_u_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e7_emp_m_u_cy" data-denom="${p}e7_emp_m_t_cy"></span></td><td><input type="text" id="${p}e7_emp_m_t_py" class="calc-input"></td><td><input type="text" id="${p}e7_emp_m_u_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e7_emp_m_u_py" data-denom="${p}e7_emp_m_t_py"></span></td></tr>
              <tr><td>Permanent employees – Female</td><td><input type="text" id="${p}e7_emp_f_t_cy" class="calc-input"></td><td><input type="text" id="${p}e7_emp_f_u_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e7_emp_f_u_cy" data-denom="${p}e7_emp_f_t_cy"></span></td><td><input type="text" id="${p}e7_emp_f_t_py" class="calc-input"></td><td><input type="text" id="${p}e7_emp_f_u_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e7_emp_f_u_py" data-denom="${p}e7_emp_f_t_py"></span></td></tr>
              <tr><td>Permanent workers – Male</td><td><input type="text" id="${p}e7_wrk_m_t_cy" class="calc-input"></td><td><input type="text" id="${p}e7_wrk_m_u_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e7_wrk_m_u_cy" data-denom="${p}e7_wrk_m_t_cy"></span></td><td colspan="3"></td></tr>
              <tr><td>Permanent workers – Female</td><td><input type="text" id="${p}e7_wrk_f_t_cy" class="calc-input"></td><td><input type="text" id="${p}e7_wrk_f_u_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e7_wrk_f_u_cy" data-denom="${p}e7_wrk_f_t_cy"></span></td><td colspan="3"></td></tr>
            </tbody></table>
            <p class="brsr-section">8. Training (health &amp; safety, skill upgradation)</p>
            <table class="brsr-table"><thead><tr><th>Category</th><th>Current FY – Total (A)</th><th>Health &amp; safety No.</th><th>% (calc)</th><th>Skill upgradation No.</th><th>% (calc)</th><th>Previous FY – Total</th><th>Health &amp; safety No.</th><th>% (calc)</th><th>Skill upgradation No.</th><th>% (calc)</th></tr></thead><tbody>
              <tr><td>Employees – Male</td><td><input type="text" id="${p}e8_emp_m_t_cy" class="calc-input"></td><td><input type="text" id="${p}e8_emp_m_hs_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e8_emp_m_hs_cy" data-denom="${p}e8_emp_m_t_cy"></span></td><td><input type="text" id="${p}e8_emp_m_sk_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e8_emp_m_sk_cy" data-denom="${p}e8_emp_m_t_cy"></span></td><td><input type="text" id="${p}e8_emp_m_t_py" class="calc-input"></td><td><input type="text" id="${p}e8_emp_m_hs_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e8_emp_m_hs_py" data-denom="${p}e8_emp_m_t_py"></span></td><td><input type="text" id="${p}e8_emp_m_sk_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e8_emp_m_sk_py" data-denom="${p}e8_emp_m_t_py"></span></td></tr>
              <tr><td>Employees – Female</td><td><input type="text" id="${p}e8_emp_f_t_cy" class="calc-input"></td><td><input type="text" id="${p}e8_emp_f_hs_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e8_emp_f_hs_cy" data-denom="${p}e8_emp_f_t_cy"></span></td><td><input type="text" id="${p}e8_emp_f_sk_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e8_emp_f_sk_cy" data-denom="${p}e8_emp_f_t_cy"></span></td><td><input type="text" id="${p}e8_emp_f_t_py" class="calc-input"></td><td><input type="text" id="${p}e8_emp_f_hs_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e8_emp_f_hs_py" data-denom="${p}e8_emp_f_t_py"></span></td><td><input type="text" id="${p}e8_emp_f_sk_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e8_emp_f_sk_py" data-denom="${p}e8_emp_f_t_py"></span></td></tr>
              <tr><td>Workers – Male</td><td><input type="text" id="${p}e8_wrk_m_t_cy" class="calc-input"></td><td><input type="text" id="${p}e8_wrk_m_hs_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e8_wrk_m_hs_cy" data-denom="${p}e8_wrk_m_t_cy"></span></td><td><input type="text" id="${p}e8_wrk_m_sk_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e8_wrk_m_sk_cy" data-denom="${p}e8_wrk_m_t_cy"></span></td><td><input type="text" id="${p}e8_wrk_m_t_py" class="calc-input"></td><td><input type="text" id="${p}e8_wrk_m_hs_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e8_wrk_m_hs_py" data-denom="${p}e8_wrk_m_t_py"></span></td><td><input type="text" id="${p}e8_wrk_m_sk_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e8_wrk_m_sk_py" data-denom="${p}e8_wrk_m_t_py"></span></td></tr>
              <tr><td>Workers – Female</td><td><input type="text" id="${p}e8_wrk_f_t_cy" class="calc-input"></td><td><input type="text" id="${p}e8_wrk_f_hs_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e8_wrk_f_hs_cy" data-denom="${p}e8_wrk_f_t_cy"></span></td><td><input type="text" id="${p}e8_wrk_f_sk_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e8_wrk_f_sk_cy" data-denom="${p}e8_wrk_f_t_cy"></span></td><td><input type="text" id="${p}e8_wrk_f_t_py" class="calc-input"></td><td><input type="text" id="${p}e8_wrk_f_hs_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e8_wrk_f_hs_py" data-denom="${p}e8_wrk_f_t_py"></span></td><td><input type="text" id="${p}e8_wrk_f_sk_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e8_wrk_f_sk_py" data-denom="${p}e8_wrk_f_t_py"></span></td></tr>
            </tbody></table>
            <p class="brsr-section">9. Performance and career development reviews</p>
            <table class="brsr-table"><thead><tr><th>Category</th><th>Current FY – Total (A)</th><th>Reviewed (B)</th><th>% (calc)</th><th>Previous FY – Total</th><th>Reviewed</th><th>% (calc)</th></tr></thead><tbody>
              <tr><td>Employees – Male</td><td><input type="text" id="${p}e9_emp_m_t_cy" class="calc-input"></td><td><input type="text" id="${p}e9_emp_m_r_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e9_emp_m_r_cy" data-denom="${p}e9_emp_m_t_cy"></span></td><td><input type="text" id="${p}e9_emp_m_t_py" class="calc-input"></td><td><input type="text" id="${p}e9_emp_m_r_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e9_emp_m_r_py" data-denom="${p}e9_emp_m_t_py"></span></td></tr>
              <tr><td>Employees – Female</td><td><input type="text" id="${p}e9_emp_f_t_cy" class="calc-input"></td><td><input type="text" id="${p}e9_emp_f_r_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e9_emp_f_r_cy" data-denom="${p}e9_emp_f_t_cy"></span></td><td><input type="text" id="${p}e9_emp_f_t_py" class="calc-input"></td><td><input type="text" id="${p}e9_emp_f_r_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e9_emp_f_r_py" data-denom="${p}e9_emp_f_t_py"></span></td></tr>
              <tr><td>Workers – Male</td><td><input type="text" id="${p}e9_wrk_m_t_cy" class="calc-input"></td><td><input type="text" id="${p}e9_wrk_m_r_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e9_wrk_m_r_cy" data-denom="${p}e9_wrk_m_t_cy"></span></td><td><input type="text" id="${p}e9_wrk_m_t_py" class="calc-input"></td><td><input type="text" id="${p}e9_wrk_m_r_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e9_wrk_m_r_py" data-denom="${p}e9_wrk_m_t_py"></span></td></tr>
              <tr><td>Workers – Female</td><td><input type="text" id="${p}e9_wrk_f_t_cy" class="calc-input"></td><td><input type="text" id="${p}e9_wrk_f_r_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e9_wrk_f_r_cy" data-denom="${p}e9_wrk_f_t_cy"></span></td><td><input type="text" id="${p}e9_wrk_f_t_py" class="calc-input"></td><td><input type="text" id="${p}e9_wrk_f_r_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e9_wrk_f_r_py" data-denom="${p}e9_wrk_f_t_py"></span></td></tr>
            </tbody></table>
            <p class="brsr-section">10. Health and safety management system (Y/N). Coverage. Processes for hazards. Worker reporting. Non-occupational medical access.</p>
            <div class="field"><textarea id="${p}e10_hs" style="min-height:60px"></textarea></div>
            <p class="brsr-section">11. Safety-related incidents (LTIFR, recordable injuries, fatalities, high consequence)</p>
            <table class="brsr-table"><thead><tr><th>Incident type</th><th>Category</th><th>Current FY</th><th>Previous FY</th></tr></thead><tbody>
              <tr><td>LTIFR (per million person-hours)</td><td>Employees</td><td><input type="text" id="${p}e11_ltifr_emp_cy"></td><td><input type="text" id="${p}e11_ltifr_emp_py"></td></tr>
              <tr><td></td><td>Workers</td><td><input type="text" id="${p}e11_ltifr_wrk_cy"></td><td><input type="text" id="${p}e11_ltifr_wrk_py"></td></tr>
              <tr><td>Total recordable work-related injuries</td><td>Employees</td><td><input type="text" id="${p}e11_rec_emp_cy"></td><td><input type="text" id="${p}e11_rec_emp_py"></td></tr>
              <tr><td></td><td>Workers</td><td><input type="text" id="${p}e11_rec_wrk_cy"></td><td><input type="text" id="${p}e11_rec_wrk_py"></td></tr>
              <tr><td>No. of fatalities</td><td>Employees</td><td><input type="text" id="${p}e11_fat_emp_cy"></td><td><input type="text" id="${p}e11_fat_emp_py"></td></tr>
              <tr><td></td><td>Workers</td><td><input type="text" id="${p}e11_fat_wrk_cy"></td><td><input type="text" id="${p}e11_fat_wrk_py"></td></tr>
              <tr><td>High consequence (excl. fatalities)</td><td>Employees</td><td><input type="text" id="${p}e11_hc_emp_cy"></td><td><input type="text" id="${p}e11_hc_emp_py"></td></tr>
              <tr><td></td><td>Workers</td><td><input type="text" id="${p}e11_hc_wrk_cy"></td><td><input type="text" id="${p}e11_hc_wrk_py"></td></tr>
            </tbody></table>
            <p class="brsr-section">12. Measures for safe and healthy workplace</p>
            <div class="field"><textarea id="${p}e12_measures" style="min-height:50px"></textarea></div>
            <p class="brsr-section">13. Complaints (working conditions, health &amp; safety)</p>
            <table class="brsr-table"><thead><tr><th></th><th>Current FY – Filed</th><th>Pending</th><th>Remarks</th><th>Previous FY – Filed</th><th>Pending</th><th>Remarks</th></tr></thead><tbody>
              <tr><td>Working conditions</td><td><input type="text" id="${p}e13_wc_cy_f"></td><td><input type="text" id="${p}e13_wc_cy_p"></td><td><input type="text" id="${p}e13_wc_cy_r"></td><td><input type="text" id="${p}e13_wc_py_f"></td><td><input type="text" id="${p}e13_wc_py_p"></td><td><input type="text" id="${p}e13_wc_py_r"></td></tr>
              <tr><td>Health &amp; safety</td><td><input type="text" id="${p}e13_hs_cy_f"></td><td><input type="text" id="${p}e13_hs_cy_p"></td><td><input type="text" id="${p}e13_hs_cy_r"></td><td><input type="text" id="${p}e13_hs_py_f"></td><td><input type="text" id="${p}e13_hs_py_p"></td><td><input type="text" id="${p}e13_hs_py_r"></td></tr>
            </tbody></table>
            <p class="brsr-section">14. Assessments (% plants/offices assessed)</p>
            <table class="brsr-table"><thead><tr><th></th><th>% assessed</th></tr></thead><tbody>
              <tr><td>Health and safety practices</td><td><input type="text" id="${p}e14_hs"></td></tr>
              <tr><td>Working conditions</td><td><input type="text" id="${p}e14_wc"></td></tr>
            </tbody></table>
            <p class="brsr-section">15. Corrective action (safety incidents, assessments)</p>
            <div class="field"><textarea id="${p}e15_corrective" style="min-height:50px"></textarea></div>
          </div>`,
        leadership: `
          <div class="section-block"><h3>Leadership indicators</h3>
            <p class="brsr-section">1. Life insurance / compensatory package (death) – Employees (Y/N), Workers (Y/N)</p>
            <div class="field"><input type="text" id="${p}l1_emp" placeholder="Employees Y/N"> <input type="text" id="${p}l1_wrk" placeholder="Workers Y/N"></div>
            <p class="brsr-section">2. Statutory dues deducted and deposited by value chain partners</p>
            <div class="field"><textarea id="${p}l2_statutory" style="min-height:50px"></textarea></div>
            <p class="brsr-section">3. Rehabilitation (affected employees/workers or family placed)</p>
            <table class="brsr-table"><thead><tr><th></th><th>Current FY – Total affected</th><th>Previous FY – Total affected</th><th>Current FY – Rehabilitated/placed</th><th>Previous FY – Rehabilitated/placed</th></tr></thead><tbody>
              <tr><td>Employees</td><td><input type="text" id="${p}l3_emp_cy_t"></td><td><input type="text" id="${p}l3_emp_py_t"></td><td><input type="text" id="${p}l3_emp_cy_r"></td><td><input type="text" id="${p}l3_emp_py_r"></td></tr>
              <tr><td>Workers</td><td><input type="text" id="${p}l3_wrk_cy_t"></td><td><input type="text" id="${p}l3_wrk_py_t"></td><td><input type="text" id="${p}l3_wrk_cy_r"></td><td><input type="text" id="${p}l3_wrk_py_r"></td></tr>
            </tbody></table>
            <p class="brsr-section">4. Transition assistance (retirement/termination) (Y/N)</p>
            <div class="field"><input type="text" id="${p}l4_transition" placeholder="Y/N"></div>
            <p class="brsr-section">5. Value chain partners assessed (%) – Health &amp; safety, Working conditions</p>
            <table class="brsr-table"><thead><tr><th></th><th>% of value chain partners (by value)</th></tr></thead><tbody>
              <tr><td>Health and safety practices</td><td><input type="text" id="${p}l5_hs"></td></tr>
              <tr><td>Working conditions</td><td><input type="text" id="${p}l5_wc"></td></tr>
            </tbody></table>
            <p class="brsr-section">6. Corrective actions (value chain assessments)</p>
            <div class="field"><textarea id="${p}l6_corrective" style="min-height:50px"></textarea></div>
          </div>`,
      };
    case 4:
      return {
        essential: `
          <div class="section-block"><h3>Essential indicators</h3>
            <p class="brsr-section">1. Processes for identifying key stakeholder groups</p>
            <div class="field"><textarea id="${p}e1_process" style="min-height:60px"></textarea></div>
            <p class="brsr-section">2. Stakeholder groups – engagement</p>
            <table class="brsr-table" data-dynamic-rows="${p}e2" data-row-prefix="${p}e2"><thead><tr><th>Stakeholder group</th><th>Vulnerable &amp; marginalized (Y/N)</th><th>Channels of communication</th><th>Frequency of engagement</th><th>Purpose and scope / key topics</th><th></th></tr></thead><tbody>
              <tr data-row-index="0"><td><input type="text" id="${p}e2_row0_name"></td><td><input type="text" id="${p}e2_row0_vuln"></td><td><input type="text" id="${p}e2_row0_chan"></td><td><input type="text" id="${p}e2_row0_freq"></td><td><input type="text" id="${p}e2_row0_purpose"></td><td><button type="button" class="btn btn-sm btn-remove-row" data-table="${p}e2" title="Remove row" style="display:none">Remove</button></td></tr>
            </tbody></table>
            <input type="hidden" id="${p}e2_rowcount" value="1">
            <div class="add-row-wrap btn-row" style="margin-bottom:1rem"><button type="button" class="btn btn-outline add-row-btn" data-table="${p}e2">Add row</button></div>
          </div>`,
        leadership: `
          <div class="section-block"><h3>Leadership indicators</h3>
            <p class="brsr-section">1. Consultation between stakeholders and Board on economic, environmental, social topics (or how feedback to Board)</p>
            <div class="field"><textarea id="${p}l1_consult" style="min-height:60px"></textarea></div>
            <p class="brsr-section">2. Stakeholder consultation for environmental/social topics (Y/N). Instances of inputs incorporated</p>
            <div class="field"><input type="text" id="${p}l2_yn" placeholder="Y/N"></div>
            <div class="field"><textarea id="${p}l2_instances" placeholder="Instances" style="min-height:50px"></textarea></div>
            <p class="brsr-section">3. Engagement with vulnerable/marginalized groups – actions taken</p>
            <div class="field"><textarea id="${p}l3_engagement" style="min-height:60px"></textarea></div>
          </div>`,
      };
    case 5:
      return {
        essential: `
          <div class="section-block"><h3>Essential indicators</h3>
            <p class="brsr-section">1. Training on human rights</p>
            <table class="brsr-table"><thead><tr><th>Category</th><th>Current FY – Total (A)</th><th>Covered (B)</th><th>% (calc)</th><th>Previous FY – Total</th><th>Covered</th><th>% (calc)</th></tr></thead><tbody>
              <tr><td>Employees – Permanent</td><td><input type="text" id="${p}e1_emp_perm_t_cy" class="calc-input"></td><td><input type="text" id="${p}e1_emp_perm_c_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1_emp_perm_c_cy" data-denom="${p}e1_emp_perm_t_cy"></span></td><td><input type="text" id="${p}e1_emp_perm_t_py" class="calc-input"></td><td><input type="text" id="${p}e1_emp_perm_c_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1_emp_perm_c_py" data-denom="${p}e1_emp_perm_t_py"></span></td></tr>
              <tr><td>Employees – Other than permanent</td><td><input type="text" id="${p}e1_emp_oth_t_cy" class="calc-input"></td><td><input type="text" id="${p}e1_emp_oth_c_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1_emp_oth_c_cy" data-denom="${p}e1_emp_oth_t_cy"></span></td><td><input type="text" id="${p}e1_emp_oth_t_py" class="calc-input"></td><td><input type="text" id="${p}e1_emp_oth_c_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1_emp_oth_c_py" data-denom="${p}e1_emp_oth_t_py"></span></td></tr>
              <tr><td>Workers – Permanent</td><td><input type="text" id="${p}e1_wrk_perm_t_cy" class="calc-input"></td><td><input type="text" id="${p}e1_wrk_perm_c_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1_wrk_perm_c_cy" data-denom="${p}e1_wrk_perm_t_cy"></span></td><td><input type="text" id="${p}e1_wrk_perm_t_py" class="calc-input"></td><td><input type="text" id="${p}e1_wrk_perm_c_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1_wrk_perm_c_py" data-denom="${p}e1_wrk_perm_t_py"></span></td></tr>
              <tr><td>Workers – Other than permanent</td><td><input type="text" id="${p}e1_wrk_oth_t_cy" class="calc-input"></td><td><input type="text" id="${p}e1_wrk_oth_c_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1_wrk_oth_c_cy" data-denom="${p}e1_wrk_oth_t_cy"></span></td><td><input type="text" id="${p}e1_wrk_oth_t_py" class="calc-input"></td><td><input type="text" id="${p}e1_wrk_oth_c_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e1_wrk_oth_c_py" data-denom="${p}e1_wrk_oth_t_py"></span></td></tr>
            </tbody></table>
            <p class="brsr-section">2. Minimum wages (Equal to / More than minimum)</p>
            <table class="brsr-table"><thead><tr><th>Category</th><th>Current FY – Total (A)</th><th>Equal to min No.</th><th>% (calc)</th><th>More than min No.</th><th>% (calc)</th><th>Previous FY – Total</th><th>Equal No.</th><th>% (calc)</th><th>More No.</th><th>% (calc)</th></tr></thead><tbody>
              <tr><td>Employees – Permanent Male</td><td><input type="text" id="${p}e2_emp_pm_t_cy" class="calc-input"></td><td><input type="text" id="${p}e2_emp_pm_eq_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_emp_pm_eq_cy" data-denom="${p}e2_emp_pm_t_cy"></span></td><td><input type="text" id="${p}e2_emp_pm_more_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_emp_pm_more_cy" data-denom="${p}e2_emp_pm_t_cy"></span></td><td><input type="text" id="${p}e2_emp_pm_t_py" class="calc-input"></td><td><input type="text" id="${p}e2_emp_pm_eq_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_emp_pm_eq_py" data-denom="${p}e2_emp_pm_t_py"></span></td><td><input type="text" id="${p}e2_emp_pm_more_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_emp_pm_more_py" data-denom="${p}e2_emp_pm_t_py"></span></td></tr>
              <tr><td>Employees – Permanent Female</td><td><input type="text" id="${p}e2_emp_pf_t_cy" class="calc-input"></td><td><input type="text" id="${p}e2_emp_pf_eq_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_emp_pf_eq_cy" data-denom="${p}e2_emp_pf_t_cy"></span></td><td><input type="text" id="${p}e2_emp_pf_more_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_emp_pf_more_cy" data-denom="${p}e2_emp_pf_t_cy"></span></td><td><input type="text" id="${p}e2_emp_pf_t_py" class="calc-input"></td><td><input type="text" id="${p}e2_emp_pf_eq_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_emp_pf_eq_py" data-denom="${p}e2_emp_pf_t_py"></span></td><td><input type="text" id="${p}e2_emp_pf_more_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_emp_pf_more_py" data-denom="${p}e2_emp_pf_t_py"></span></td></tr>
              <tr><td>Workers – Permanent Male</td><td><input type="text" id="${p}e2_wrk_pm_t_cy" class="calc-input"></td><td><input type="text" id="${p}e2_wrk_pm_eq_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_wrk_pm_eq_cy" data-denom="${p}e2_wrk_pm_t_cy"></span></td><td><input type="text" id="${p}e2_wrk_pm_more_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_wrk_pm_more_cy" data-denom="${p}e2_wrk_pm_t_cy"></span></td><td><input type="text" id="${p}e2_wrk_pm_t_py" class="calc-input"></td><td><input type="text" id="${p}e2_wrk_pm_eq_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_wrk_pm_eq_py" data-denom="${p}e2_wrk_pm_t_py"></span></td><td><input type="text" id="${p}e2_wrk_pm_more_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_wrk_pm_more_py" data-denom="${p}e2_wrk_pm_t_py"></span></td></tr>
              <tr><td>Workers – Permanent Female</td><td><input type="text" id="${p}e2_wrk_pf_t_cy" class="calc-input"></td><td><input type="text" id="${p}e2_wrk_pf_eq_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_wrk_pf_eq_cy" data-denom="${p}e2_wrk_pf_t_cy"></span></td><td><input type="text" id="${p}e2_wrk_pf_more_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_wrk_pf_more_cy" data-denom="${p}e2_wrk_pf_t_cy"></span></td><td><input type="text" id="${p}e2_wrk_pf_t_py" class="calc-input"></td><td><input type="text" id="${p}e2_wrk_pf_eq_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_wrk_pf_eq_py" data-denom="${p}e2_wrk_pf_t_py"></span></td><td><input type="text" id="${p}e2_wrk_pf_more_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e2_wrk_pf_more_py" data-denom="${p}e2_wrk_pf_t_py"></span></td></tr>
            </tbody></table>
            <p class="brsr-section">3(a). Median remuneration (BoD, KMP, Employees, Workers – Male/Female)</p>
            <table class="brsr-table"><thead><tr><th>Category</th><th>Male – No.</th><th>Male – Median (Rs.)</th><th>Female – No.</th><th>Female – Median (Rs.)</th></tr></thead><tbody>
              <tr><td>Board of Directors</td><td><input type="text" id="${p}e3a_bod_m_n"></td><td><input type="text" id="${p}e3a_bod_m_med"></td><td><input type="text" id="${p}e3a_bod_f_n"></td><td><input type="text" id="${p}e3a_bod_f_med"></td></tr>
              <tr><td>KMP</td><td><input type="text" id="${p}e3a_kmp_m_n"></td><td><input type="text" id="${p}e3a_kmp_m_med"></td><td><input type="text" id="${p}e3a_kmp_f_n"></td><td><input type="text" id="${p}e3a_kmp_f_med"></td></tr>
              <tr><td>Employees (other than BoD/KMP)</td><td><input type="text" id="${p}e3a_emp_m_n"></td><td><input type="text" id="${p}e3a_emp_m_med"></td><td><input type="text" id="${p}e3a_emp_f_n"></td><td><input type="text" id="${p}e3a_emp_f_med"></td></tr>
              <tr><td>Workers</td><td><input type="text" id="${p}e3a_wrk_m_n"></td><td><input type="text" id="${p}e3a_wrk_m_med"></td><td><input type="text" id="${p}e3a_wrk_f_n"></td><td><input type="text" id="${p}e3a_wrk_f_med"></td></tr>
            </tbody></table>
            <p class="brsr-section">3(b). Gross wages to females as % of total wages</p>
            <table class="brsr-table"><thead><tr><th></th><th>Current FY – Female wages (Rs.)</th><th>Current FY – Total wages (Rs.)</th><th>% (calc)</th><th>Previous FY – Female</th><th>Previous FY – Total</th><th>% (calc)</th></tr></thead><tbody>
              <tr><td>Gross wages</td><td><input type="text" id="${p}e3b_cy_f" class="calc-input"></td><td><input type="text" id="${p}e3b_cy_t" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e3b_cy_f" data-denom="${p}e3b_cy_t"></span></td><td><input type="text" id="${p}e3b_py_f" class="calc-input"></td><td><input type="text" id="${p}e3b_py_t" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e3b_py_f" data-denom="${p}e3b_py_t"></span></td></tr>
            </tbody></table>
            <p class="brsr-section">4. Focal point for human rights (Y/N)</p>
            <div class="field"><input type="text" id="${p}e4_focal" placeholder="Y/N"></div>
            <p class="brsr-section">5. Internal mechanisms for human rights grievances</p>
            <div class="field"><textarea id="${p}e5_mech" style="min-height:50px"></textarea></div>
            <p class="brsr-section">6. Complaints (sexual harassment, discrimination, child labour, forced labour, wages, other)</p>
            <table class="brsr-table"><thead><tr><th></th><th>Current FY – Filed</th><th>Pending</th><th>Remarks</th><th>Previous FY – Filed</th><th>Pending</th><th>Remarks</th></tr></thead><tbody>
              <tr><td>Sexual harassment</td><td><input type="text" id="${p}e6_sh_cy_f"></td><td><input type="text" id="${p}e6_sh_cy_p"></td><td><input type="text" id="${p}e6_sh_cy_r"></td><td><input type="text" id="${p}e6_sh_py_f"></td><td><input type="text" id="${p}e6_sh_py_p"></td><td><input type="text" id="${p}e6_sh_py_r"></td></tr>
              <tr><td>Discrimination</td><td><input type="text" id="${p}e6_disc_cy_f"></td><td><input type="text" id="${p}e6_disc_cy_p"></td><td><input type="text" id="${p}e6_disc_cy_r"></td><td><input type="text" id="${p}e6_disc_py_f"></td><td><input type="text" id="${p}e6_disc_py_p"></td><td><input type="text" id="${p}e6_disc_py_r"></td></tr>
              <tr><td>Child labour</td><td><input type="text" id="${p}e6_cl_cy_f"></td><td><input type="text" id="${p}e6_cl_cy_p"></td><td><input type="text" id="${p}e6_cl_cy_r"></td><td><input type="text" id="${p}e6_cl_py_f"></td><td><input type="text" id="${p}e6_cl_py_p"></td><td><input type="text" id="${p}e6_cl_py_r"></td></tr>
              <tr><td>Forced/Involuntary labour</td><td><input type="text" id="${p}e6_fl_cy_f"></td><td><input type="text" id="${p}e6_fl_cy_p"></td><td><input type="text" id="${p}e6_fl_cy_r"></td><td><input type="text" id="${p}e6_fl_py_f"></td><td><input type="text" id="${p}e6_fl_py_p"></td><td><input type="text" id="${p}e6_fl_py_r"></td></tr>
              <tr><td>Wages</td><td><input type="text" id="${p}e6_wg_cy_f"></td><td><input type="text" id="${p}e6_wg_cy_p"></td><td><input type="text" id="${p}e6_wg_cy_r"></td><td><input type="text" id="${p}e6_wg_py_f"></td><td><input type="text" id="${p}e6_wg_py_p"></td><td><input type="text" id="${p}e6_wg_py_r"></td></tr>
              <tr><td>Other</td><td><input type="text" id="${p}e6_oth_cy_f"></td><td><input type="text" id="${p}e6_oth_cy_p"></td><td><input type="text" id="${p}e6_oth_cy_r"></td><td><input type="text" id="${p}e6_oth_py_f"></td><td><input type="text" id="${p}e6_oth_py_p"></td><td><input type="text" id="${p}e6_oth_py_r"></td></tr>
            </tbody></table>
            <p class="brsr-section">7. POSH – Total complaints, % of female employees/workers, Complaints upheld</p>
            <table class="brsr-table"><thead><tr><th></th><th>Current FY</th><th>Previous FY</th></tr></thead><tbody>
              <tr><td>Total POSH complaints</td><td><input type="text" id="${p}e7_tot_cy"></td><td><input type="text" id="${p}e7_tot_py"></td></tr>
              <tr><td>Female employees/workers (total)</td><td><input type="text" id="${p}e7_f_cy" class="calc-input"></td><td><input type="text" id="${p}e7_f_py" class="calc-input"></td></tr>
              <tr><td>POSH as % of female (calc)</td><td><span class="calc-display calc-pct" data-num="${p}e7_tot_cy" data-denom="${p}e7_f_cy"></span></td><td><span class="calc-display calc-pct" data-num="${p}e7_tot_py" data-denom="${p}e7_f_py"></span></td></tr>
              <tr><td>Complaints upheld</td><td><input type="text" id="${p}e7_up_cy"></td><td><input type="text" id="${p}e7_up_py"></td></tr>
            </tbody></table>
            <p class="brsr-section">8. Mechanisms to prevent adverse consequences (discrimination/harassment)</p>
            <div class="field"><textarea id="${p}e8_mech" style="min-height:50px"></textarea></div>
            <p class="brsr-section">9. Human rights in business agreements/contracts (Y/N)</p>
            <div class="field"><input type="text" id="${p}e9_contracts" placeholder="Y/N"></div>
            <p class="brsr-section">10. Assessments (% plants/offices) – Child labour, Forced labour, Sexual harassment, Discrimination, Wages, Others</p>
            <table class="brsr-table"><thead><tr><th></th><th>% assessed</th></tr></thead><tbody>
              <tr><td>Child labour</td><td><input type="text" id="${p}e10_cl"></td></tr>
              <tr><td>Forced/Involuntary labour</td><td><input type="text" id="${p}e10_fl"></td></tr>
              <tr><td>Sexual harassment</td><td><input type="text" id="${p}e10_sh"></td></tr>
              <tr><td>Discrimination</td><td><input type="text" id="${p}e10_disc"></td></tr>
              <tr><td>Wages</td><td><input type="text" id="${p}e10_wg"></td></tr>
              <tr><td>Others</td><td><input type="text" id="${p}e10_oth"></td></tr>
            </tbody></table>
            <p class="brsr-section">11. Corrective actions</p>
            <div class="field"><textarea id="${p}e11_corrective" style="min-height:50px"></textarea></div>
          </div>`,
        leadership: `
          <div class="section-block"><h3>Leadership indicators</h3>
            <p class="brsr-section">1. Business process modified due to human rights grievances</p>
            <div class="field"><textarea id="${p}l1_process" style="min-height:50px"></textarea></div>
            <p class="brsr-section">2. Human rights due diligence – scope and coverage</p>
            <div class="field"><textarea id="${p}l2_scope" style="min-height:50px"></textarea></div>
            <p class="brsr-section">3. Premises accessible to differently abled visitors (Y/N)</p>
            <div class="field"><input type="text" id="${p}l3_access" placeholder="Y/N"></div>
            <p class="brsr-section">4. Value chain partners assessed (%) – Sexual harassment, Discrimination, Child labour, Forced labour, Wages, Others</p>
            <table class="brsr-table"><thead><tr><th></th><th>% assessed</th></tr></thead><tbody>
              <tr><td>Sexual harassment</td><td><input type="text" id="${p}l4_sh"></td></tr>
              <tr><td>Discrimination</td><td><input type="text" id="${p}l4_disc"></td></tr>
              <tr><td>Child labour</td><td><input type="text" id="${p}l4_cl"></td></tr>
              <tr><td>Forced labour</td><td><input type="text" id="${p}l4_fl"></td></tr>
              <tr><td>Wages</td><td><input type="text" id="${p}l4_wg"></td></tr>
              <tr><td>Others</td><td><input type="text" id="${p}l4_oth"></td></tr>
            </tbody></table>
            <p class="brsr-section">5. Corrective actions (value chain assessments)</p>
            <div class="field"><textarea id="${p}l5_corrective" style="min-height:50px"></textarea></div>
          </div>`,
      };
    case 7:
      return {
        essential: `
          <div class="section-block"><h3>Essential indicators</h3>
            <p class="brsr-section">1(a). Number of affiliations with trade and industry chambers/associations</p>
            <div class="field"><input type="text" id="${p}e1a_count" placeholder="Number"></div>
            <p class="brsr-section">1(b). Top 10 trade and industry chambers/associations (by membership)</p>
            <table class="brsr-table"><thead><tr><th>S. No.</th><th>Name of chamber/association</th><th>Reach (State/National)</th></tr></thead><tbody>
              <tr><td>1</td><td><input type="text" id="${p}e1b_1_name"></td><td><input type="text" id="${p}e1b_1_reach"></td></tr>
              <tr><td>2</td><td><input type="text" id="${p}e1b_2_name"></td><td><input type="text" id="${p}e1b_2_reach"></td></tr>
              <tr><td>3</td><td><input type="text" id="${p}e1b_3_name"></td><td><input type="text" id="${p}e1b_3_reach"></td></tr>
              <tr><td>4</td><td><input type="text" id="${p}e1b_4_name"></td><td><input type="text" id="${p}e1b_4_reach"></td></tr>
              <tr><td>5</td><td><input type="text" id="${p}e1b_5_name"></td><td><input type="text" id="${p}e1b_5_reach"></td></tr>
              <tr><td>6</td><td><input type="text" id="${p}e1b_6_name"></td><td><input type="text" id="${p}e1b_6_reach"></td></tr>
              <tr><td>7</td><td><input type="text" id="${p}e1b_7_name"></td><td><input type="text" id="${p}e1b_7_reach"></td></tr>
              <tr><td>8</td><td><input type="text" id="${p}e1b_8_name"></td><td><input type="text" id="${p}e1b_8_reach"></td></tr>
              <tr><td>9</td><td><input type="text" id="${p}e1b_9_name"></td><td><input type="text" id="${p}e1b_9_reach"></td></tr>
              <tr><td>10</td><td><input type="text" id="${p}e1b_10_name"></td><td><input type="text" id="${p}e1b_10_reach"></td></tr>
            </tbody></table>
            <p class="brsr-section">2. Corrective action on anti-competitive conduct (adverse orders)</p>
            <table class="brsr-table"><thead><tr><th>Name of authority</th><th>Brief of case</th><th>Corrective action taken</th></tr></thead><tbody>
              <tr><td><input type="text" id="${p}e2_auth"></td><td><input type="text" id="${p}e2_brief"></td><td><input type="text" id="${p}e2_action"></td></tr>
            </tbody></table>
          </div>`,
        leadership: `
          <div class="section-block"><h3>Leadership indicators</h3>
            <p class="brsr-section">1. Public policy positions advocated</p>
            <table class="brsr-table"><thead><tr><th>S. No.</th><th>Public policy advocated</th><th>Method for advocacy</th><th>In public domain (Y/N)</th><th>Frequency of review by Board</th></tr></thead><tbody>
              <tr><td>1</td><td><input type="text" id="${p}l1_1_policy"></td><td><input type="text" id="${p}l1_1_method"></td><td><input type="text" id="${p}l1_1_public"></td><td><input type="text" id="${p}l1_1_freq"></td></tr>
              <tr><td>2</td><td><input type="text" id="${p}l1_2_policy"></td><td><input type="text" id="${p}l1_2_method"></td><td><input type="text" id="${p}l1_2_public"></td><td><input type="text" id="${p}l1_2_freq"></td></tr>
            </tbody></table>
          </div>`,
      };
    case 8:
      return {
        essential: `
          <div class="section-block"><h3>Essential indicators</h3>
            <p class="brsr-section">1. Social Impact Assessments (SIA) of projects</p>
            <table class="brsr-table"><thead><tr><th>Project name / details</th><th>SIA notification no.</th><th>Date</th><th>Independent agency (Y/N)</th><th>Public domain (Y/N)</th><th>Weblink</th></tr></thead><tbody>
              <tr><td><input type="text" id="${p}e1_name"></td><td><input type="text" id="${p}e1_notif"></td><td><input type="text" id="${p}e1_date"></td><td><input type="text" id="${p}e1_ind"></td><td><input type="text" id="${p}e1_pub"></td><td><input type="text" id="${p}e1_link"></td></tr>
            </tbody></table>
            <p class="brsr-section">2. Rehabilitation and Resettlement (R&amp;R) – ongoing projects</p>
            <table class="brsr-table"><thead><tr><th>S. No.</th><th>Project name</th><th>State</th><th>District</th><th>No. of PAFs</th><th>% PAFs covered by R&amp;R</th><th>Amount paid to PAFs in FY (Rs.)</th></tr></thead><tbody>
              <tr><td>1</td><td><input type="text" id="${p}e2_1_name"></td><td><input type="text" id="${p}e2_1_state"></td><td><input type="text" id="${p}e2_1_dist"></td><td><input type="text" id="${p}e2_1_paf"></td><td><input type="text" id="${p}e2_1_pct"></td><td><input type="text" id="${p}e2_1_amt"></td></tr>
              <tr><td>2</td><td><input type="text" id="${p}e2_2_name"></td><td><input type="text" id="${p}e2_2_state"></td><td><input type="text" id="${p}e2_2_dist"></td><td><input type="text" id="${p}e2_2_paf"></td><td><input type="text" id="${p}e2_2_pct"></td><td><input type="text" id="${p}e2_2_amt"></td></tr>
            </tbody></table>
            <p class="brsr-section">3. Grievance mechanism for community</p>
            <div class="field"><textarea id="${p}e3_griev" style="min-height:50px"></textarea></div>
            <p class="brsr-section">4. % input material sourced from MSMEs/small producers and from within India</p>
            <table class="brsr-table"><thead><tr><th></th><th>Current FY</th><th>Previous FY</th></tr></thead><tbody>
              <tr><td>Directly from MSMEs/small producers (% of total inputs by value)</td><td><input type="text" id="${p}e4_msme_cy"></td><td><input type="text" id="${p}e4_msme_py"></td></tr>
              <tr><td>Directly from within India (% of total inputs)</td><td><input type="text" id="${p}e4_india_cy"></td><td><input type="text" id="${p}e4_india_py"></td></tr>
            </tbody></table>
            <p class="brsr-section">5. Job creation in smaller towns – wages as % of total wage cost (Rural, Semi-urban, Urban, Metropolitan)</p>
            <table class="brsr-table"><thead><tr><th>Location</th><th>Current FY – Wages (Rs.)</th><th>Current FY – Total wage cost (Rs.)</th><th>% (calc)</th><th>Previous FY – Wages</th><th>Previous FY – Total</th><th>% (calc)</th></tr></thead><tbody>
              <tr><td>Rural</td><td><input type="text" id="${p}e5_rural_w_cy" class="calc-input"></td><td><input type="text" id="${p}e5_rural_t_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e5_rural_w_cy" data-denom="${p}e5_rural_t_cy"></span></td><td><input type="text" id="${p}e5_rural_w_py" class="calc-input"></td><td><input type="text" id="${p}e5_rural_t_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e5_rural_w_py" data-denom="${p}e5_rural_t_py"></span></td></tr>
              <tr><td>Semi-urban</td><td><input type="text" id="${p}e5_semi_w_cy" class="calc-input"></td><td><input type="text" id="${p}e5_semi_t_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e5_semi_w_cy" data-denom="${p}e5_semi_t_cy"></span></td><td><input type="text" id="${p}e5_semi_w_py" class="calc-input"></td><td><input type="text" id="${p}e5_semi_t_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e5_semi_w_py" data-denom="${p}e5_semi_t_py"></span></td></tr>
              <tr><td>Urban</td><td><input type="text" id="${p}e5_urb_w_cy" class="calc-input"></td><td><input type="text" id="${p}e5_urb_t_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e5_urb_w_cy" data-denom="${p}e5_urb_t_cy"></span></td><td><input type="text" id="${p}e5_urb_w_py" class="calc-input"></td><td><input type="text" id="${p}e5_urb_t_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e5_urb_w_py" data-denom="${p}e5_urb_t_py"></span></td></tr>
              <tr><td>Metropolitan</td><td><input type="text" id="${p}e5_metro_w_cy" class="calc-input"></td><td><input type="text" id="${p}e5_metro_t_cy" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e5_metro_w_cy" data-denom="${p}e5_metro_t_cy"></span></td><td><input type="text" id="${p}e5_metro_w_py" class="calc-input"></td><td><input type="text" id="${p}e5_metro_t_py" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}e5_metro_w_py" data-denom="${p}e5_metro_t_py"></span></td></tr>
            </tbody></table>
          </div>`,
        leadership: `
          <div class="section-block"><h3>Leadership indicators</h3>
            <p class="brsr-section">1. Mitigation of negative social impacts (from SIA)</p>
            <table class="brsr-table"><thead><tr><th>Negative impact identified</th><th>Corrective action taken</th></tr></thead><tbody>
              <tr><td><input type="text" id="${p}l1_impact"></td><td><input type="text" id="${p}l1_action"></td></tr>
            </tbody></table>
            <p class="brsr-section">2. CSR in designated aspirational districts</p>
            <table class="brsr-table"><thead><tr><th>S. No.</th><th>State</th><th>Aspirational district</th><th>Amount spent (Rs.)</th></tr></thead><tbody>
              <tr><td>1</td><td><input type="text" id="${p}l2_1_state"></td><td><input type="text" id="${p}l2_1_dist"></td><td><input type="text" id="${p}l2_1_amt"></td></tr>
              <tr><td>2</td><td><input type="text" id="${p}l2_2_state"></td><td><input type="text" id="${p}l2_2_dist"></td><td><input type="text" id="${p}l2_2_amt"></td></tr>
            </tbody></table>
            <p class="brsr-section">3. Preferential procurement from marginalized/vulnerable groups (Y/N). Groups. % of total procurement (calc)</p>
            <div class="field"><input type="text" id="${p}l3_yn" placeholder="Y/N"> <input type="text" id="${p}l3_groups" placeholder="Groups"></div>
            <table class="brsr-table"><thead><tr><th>Total procurement (Rs.)</th><th>From preferred groups (Rs.)</th><th>% (calc)</th></tr></thead><tbody>
              <tr><td><input type="text" id="${p}l3_total" class="calc-input"></td><td><input type="text" id="${p}l3_pref" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}l3_pref" data-denom="${p}l3_total"></span></td></tr>
            </tbody></table>
            <p class="brsr-section">4. Benefits from IP based on traditional knowledge – Owned/Acquired, Benefit shared (Y/N), Basis</p>
            <table class="brsr-table"><thead><tr><th>S. No.</th><th>IP (traditional knowledge)</th><th>Owned/Acquired</th><th>Benefit shared (Y/N)</th><th>Basis of benefit share</th></tr></thead><tbody>
              <tr><td>1</td><td><input type="text" id="${p}l4_1_ip"></td><td><input type="text" id="${p}l4_1_own"></td><td><input type="text" id="${p}l4_1_ben"></td><td><input type="text" id="${p}l4_1_basis"></td></tr>
            </tbody></table>
            <p class="brsr-section">5. Corrective action on IP disputes (adverse orders)</p>
            <table class="brsr-table"><thead><tr><th>Authority</th><th>Brief of case</th><th>Corrective action</th></tr></thead><tbody>
              <tr><td><input type="text" id="${p}l5_auth"></td><td><input type="text" id="${p}l5_brief"></td><td><input type="text" id="${p}l5_action"></td></tr>
            </tbody></table>
            <p class="brsr-section">6. Beneficiaries of CSR projects – No. benefitted, % from vulnerable/marginalized (calc)</p>
            <table class="brsr-table"><thead><tr><th>S. No.</th><th>CSR project</th><th>No. benefitted</th><th>Total beneficiaries (A)</th><th>From vulnerable/marginalized (B)</th><th>% (calc)</th></tr></thead><tbody>
              <tr><td>1</td><td><input type="text" id="${p}l6_1_proj"></td><td><input type="text" id="${p}l6_1_num"></td><td><input type="text" id="${p}l6_1_tot" class="calc-input"></td><td><input type="text" id="${p}l6_1_vuln" class="calc-input"></td><td><span class="calc-display calc-pct" data-num="${p}l6_1_vuln" data-denom="${p}l6_1_tot"></span></td></tr>
            </tbody></table>
          </div>`,
      };
    case 9:
      return {
        essential: `
          <div class="section-block"><h3>Essential indicators</h3>
            <p class="brsr-section">1. Mechanisms for consumer complaints and feedback</p>
            <div class="field"><textarea id="${p}e1_mech" style="min-height:50px"></textarea></div>
            <p class="brsr-section">2. Turnover % with product information (environmental/social, safe usage, recycling/disposal)</p>
            <table class="brsr-table"><thead><tr><th></th><th>% of total turnover</th></tr></thead><tbody>
              <tr><td>Environmental and social parameters</td><td><input type="text" id="${p}e2_env"></td></tr>
              <tr><td>Safe and responsible usage</td><td><input type="text" id="${p}e2_safe"></td></tr>
              <tr><td>Recycling and/or safe disposal</td><td><input type="text" id="${p}e2_recycle"></td></tr>
            </tbody></table>
            <p class="brsr-section">3. Consumer complaints (Data privacy, Advertising, Cybersecurity, Delivery, Restrictive/Unfair trade, Other)</p>
            <table class="brsr-table"><thead><tr><th></th><th>Current FY – Received</th><th>Current FY – Pending</th><th>Remarks</th><th>Previous FY – Received</th><th>Previous FY – Pending</th><th>Remarks</th></tr></thead><tbody>
              <tr><td>Data privacy</td><td><input type="text" id="${p}e3_dp_cy_f"></td><td><input type="text" id="${p}e3_dp_cy_p"></td><td><input type="text" id="${p}e3_dp_cy_r"></td><td><input type="text" id="${p}e3_dp_py_f"></td><td><input type="text" id="${p}e3_dp_py_p"></td><td><input type="text" id="${p}e3_dp_py_r"></td></tr>
              <tr><td>Advertising</td><td><input type="text" id="${p}e3_adv_cy_f"></td><td><input type="text" id="${p}e3_adv_cy_p"></td><td><input type="text" id="${p}e3_adv_cy_r"></td><td><input type="text" id="${p}e3_adv_py_f"></td><td><input type="text" id="${p}e3_adv_py_p"></td><td><input type="text" id="${p}e3_adv_py_r"></td></tr>
              <tr><td>Cyber-security</td><td><input type="text" id="${p}e3_cs_cy_f"></td><td><input type="text" id="${p}e3_cs_cy_p"></td><td><input type="text" id="${p}e3_cs_cy_r"></td><td><input type="text" id="${p}e3_cs_py_f"></td><td><input type="text" id="${p}e3_cs_py_p"></td><td><input type="text" id="${p}e3_cs_py_r"></td></tr>
              <tr><td>Delivery of essential services</td><td><input type="text" id="${p}e3_del_cy_f"></td><td><input type="text" id="${p}e3_del_cy_p"></td><td><input type="text" id="${p}e3_del_cy_r"></td><td><input type="text" id="${p}e3_del_py_f"></td><td><input type="text" id="${p}e3_del_py_p"></td><td><input type="text" id="${p}e3_del_py_r"></td></tr>
              <tr><td>Restrictive trade practices</td><td><input type="text" id="${p}e3_rtp_cy_f"></td><td><input type="text" id="${p}e3_rtp_cy_p"></td><td><input type="text" id="${p}e3_rtp_cy_r"></td><td><input type="text" id="${p}e3_rtp_py_f"></td><td><input type="text" id="${p}e3_rtp_py_p"></td><td><input type="text" id="${p}e3_rtp_py_r"></td></tr>
              <tr><td>Unfair trade practices</td><td><input type="text" id="${p}e3_utp_cy_f"></td><td><input type="text" id="${p}e3_utp_cy_p"></td><td><input type="text" id="${p}e3_utp_cy_r"></td><td><input type="text" id="${p}e3_utp_py_f"></td><td><input type="text" id="${p}e3_utp_py_p"></td><td><input type="text" id="${p}e3_utp_py_r"></td></tr>
              <tr><td>Other</td><td><input type="text" id="${p}e3_oth_cy_f"></td><td><input type="text" id="${p}e3_oth_cy_p"></td><td><input type="text" id="${p}e3_oth_cy_r"></td><td><input type="text" id="${p}e3_oth_py_f"></td><td><input type="text" id="${p}e3_oth_py_p"></td><td><input type="text" id="${p}e3_oth_py_r"></td></tr>
            </tbody></table>
            <p class="brsr-section">4. Product recalls (safety) – Voluntary / Forced – Number, Reasons</p>
            <table class="brsr-table"><thead><tr><th></th><th>Number</th><th>Reasons for recall</th></tr></thead><tbody>
              <tr><td>Voluntary recalls</td><td><input type="text" id="${p}e4_vol_num"></td><td><input type="text" id="${p}e4_vol_reason"></td></tr>
              <tr><td>Forced recalls</td><td><input type="text" id="${p}e4_for_num"></td><td><input type="text" id="${p}e4_for_reason"></td></tr>
            </tbody></table>
            <p class="brsr-section">5. Framework on cybersecurity and data privacy (Y/N). Weblink</p>
            <div class="field"><input type="text" id="${p}e5_framework" placeholder="Y/N"> <input type="text" id="${p}e5_link" placeholder="Weblink"></div>
            <p class="brsr-section">6. Corrective actions (advertising, delivery, cybersecurity, data privacy, recalls, regulatory penalty)</p>
            <div class="field"><textarea id="${p}e6_corrective" style="min-height:50px"></textarea></div>
            <p class="brsr-section">7. Data breaches – (a) Number (b) % involving PII (c) Impact</p>
            <table class="brsr-table"><thead><tr><th></th><th>Current FY</th><th>Previous FY</th></tr></thead><tbody>
              <tr><td>(a) Number of data breaches</td><td><input type="text" id="${p}e7a_cy"></td><td><input type="text" id="${p}e7a_py"></td></tr>
              <tr><td>(b) Breaches involving PII – Count</td><td><input type="text" id="${p}e7b_cy" class="calc-input"></td><td><input type="text" id="${p}e7b_py" class="calc-input"></td></tr>
              <tr><td>(b) % involving PII (calc)</td><td><span class="calc-display calc-pct" data-num="${p}e7b_cy" data-denom="${p}e7a_cy"></span></td><td><span class="calc-display calc-pct" data-num="${p}e7b_py" data-denom="${p}e7a_py"></span></td></tr>
              <tr><td>(c) Impact of data breaches</td><td><input type="text" id="${p}e7c_cy"></td><td><input type="text" id="${p}e7c_py"></td></tr>
            </tbody></table>
          </div>`,
        leadership: `
          <div class="section-block"><h3>Leadership indicators</h3>
            <p class="brsr-section">1. Channels/platforms for product information (weblink)</p>
            <div class="field"><input type="text" id="${p}l1_channels" placeholder="Weblink"></div>
            <p class="brsr-section">2. Steps to inform and educate on safe and responsible usage</p>
            <div class="field"><textarea id="${p}l2_steps" style="min-height:50px"></textarea></div>
            <p class="brsr-section">3. Mechanisms for disruption/discontinuation of essential services</p>
            <div class="field"><textarea id="${p}l3_mech" style="min-height:50px"></textarea></div>
            <p class="brsr-section">4. Product information beyond legal requirement (Y/N). Details. Consumer satisfaction survey (Y/N)</p>
            <div class="field"><input type="text" id="${p}l4_beyond" placeholder="Y/N"> <input type="text" id="${p}l4_detail" placeholder="Details"> <input type="text" id="${p}l4_survey" placeholder="Survey Y/N"></div>
          </div>`,
      };
    default:
      return null;
  }
}