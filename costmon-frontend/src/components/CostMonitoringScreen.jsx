import  { useState, useMemo } from 'react';
import { Search, FileSpreadsheet, Receipt } from 'lucide-react';

const EXPENSE_CATEGORIES = [
  'Materials/Purchases', 'Labor /SUBCONTRACTOR', 'Gas & Oil', 'Office Supplies', 
  'Tools & Equipment', 'Office Furniture', 'Shop Supplies', 'Food/Meals', 
  'Transpo/Travel', 'Repair & Maint.', 'Parking', 'Toll Fee', 'Handling Fee', 
  'Communication', 'Miscellaneous / Sending Fee / Schematic', 'Light & Power', 
  'Water', 'Rental/Hotel Accom.', 'Representation', 'Salaries & Wages', 
  'Cash Advance/Payroll', 'Cash Advance/Project', 'Permit/Licenses', 
  'Insurance Expense/CONST', 'Insurance Expenses/CAR', 'SOP/Retainer Fee', 
  'Incentives Fee', 'Service Fee', 'Entrance'
];

export default function CostMonitoringScreen({ projects, disbursements }) {
  const [selectedProjectId, setSelectedProjectId] = useState(projects[0]?.id || '');
  const project = projects.find(p => p.id === selectedProjectId);

  const financials = useMemo(() => {
    if (!project) return null;
    
    // EXCEL-MATCHING COMPUTATIONS
    const contractCost = parseFloat(project.contract_cost) || 0;
    const budgetCost = contractCost / 1.12; 
    const vatAmount = contractCost - budgetCost;
    
    const profitPercent = parseFloat(project.profit_percentage) || 0;
    const profitAmount = budgetCost * profitPercent;
    const budgetCostLimit = budgetCost - profitAmount;

    // Filter lang ang mga disbursements na para sa napiling project
    const projectExpenses = disbursements.filter(d => 
      d.project_code && d.project_code.toUpperCase() === project.project_code.toUpperCase()
    );
    
    const totalExpenses = projectExpenses.reduce((sum, item) => sum + (parseFloat(item.gross_amount) || 0), 0);
    const remainingBudget = budgetCostLimit - totalExpenses;

    const breakdown = {};
    projectExpenses.forEach(d => {
      if(d.expenses) {
        d.expenses.forEach(exp => {
          // I-group by exact category name (case-insensitive para sigurado)
          const cat = exp.category.toUpperCase().trim();
          breakdown[cat] = (breakdown[cat] || 0) + parseFloat(exp.amount || 0);
        });
      }
    });

    return { 
      contractCost, budgetCost, vatAmount, profitAmount, profitPercent,
      budgetCostLimit, totalExpenses, remainingBudget, 
      projectExpenses, breakdown 
    };
  }, [project, disbursements]);

  if (!project) return <div className="p-8 text-slate-500 font-medium">Naglo-load ng data...</div>;

  // Helper function para makuha ang total ng specific Excel categories
  const getCatSum = (searchTerms) => {
    let sum = 0;
    searchTerms.forEach(term => {
      // Hanapin ang tugmang kategorya sa breakdown
      Object.keys(financials.breakdown).forEach(key => {
        if (key.includes(term.toUpperCase())) {
          sum += financials.breakdown[key];
        }
      });
    });
    return sum;
  };

  // Pagma-map ng mga Categories sa Inyong Excel Format
  const permits = getCatSum(['Permit']);
  const supervision = getCatSum(['Supervision']);
  const carpentry = getCatSum(['Carpentry']);
  const painting = getCatSum(['Painting']);
  const electrical = getCatSum(['Electrical']);
  const plumbing = getCatSum(['Plumbing']);
  const temperedGlass = getCatSum(['Tempered', 'Glass']);
  const miscellaneous = getCatSum(['Miscellaneous', 'Misc']);
  const labor = getCatSum(['Labor', 'Salary', 'Salaries', 'Wages', 'Payroll']);

  // Helper para kunin ang amount ng specific category sa isang disbursement (Para sa Ledger)
  const getCategoryAmount = (disbursement, catName) => {
    if (!disbursement.expenses) return null;
    const exp = disbursement.expenses.find(e => e.category === catName);
    return exp && parseFloat(exp.amount) ? parseFloat(exp.amount) : null;
  };

  return (
    <div className="p-4 w-full h-full bg-slate-100 font-sans overflow-hidden flex flex-col">
      
      {/* HEADER & PROJECT SELECTOR */}
      <div className="flex justify-between items-center bg-blue-900 p-2 border-b-4 border-amber-400 shrink-0 mb-4 rounded-t-sm shadow-sm">
        <div className="flex items-center gap-2">
          <FileSpreadsheet className="text-white" size={24} />
          <h2 className="text-xl font-black text-white tracking-tight uppercase px-1 drop-shadow-sm">Project Cost Monitoring (Excel View)</h2>
        </div>
        <div className="w-80 relative">
          <Search className="absolute left-2 top-1.5 text-blue-600" size={14} />
          <select 
            className="w-full pl-7 p-1 border border-blue-400 text-xs font-bold text-blue-900 bg-blue-50 focus:outline-none appearance-none cursor-pointer"
            value={selectedProjectId} 
            onChange={e => setSelectedProjectId(e.target.value)}
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.project_code} - {p.project_name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-auto flex-1 flex flex-col gap-6 pr-2">
        {/* ==================================================================== */}
        {/* EXCEL-STYLE HEADER SUMMARY BLOCK */}
        {/* ==================================================================== */}
        <div className="overflow-x-auto shrink-0 pb-2">
          <table className="border-collapse border border-slate-300 text-[11px] text-slate-800 whitespace-nowrap min-w-max">
            <tbody>
              {/* ROW 1: HEADERS */}
              <tr>
                <td colSpan="2" className="bg-blue-700 text-white border border-slate-400 p-1 px-2 text-left font-bold w-[300px] tracking-wide">PROJECT PROGRESS COSTING</td>
                <td className="w-2 border-none"></td>
                <td colSpan="2" className="bg-emerald-600 text-white border border-slate-400 p-1 px-2 text-left font-bold w-[300px] tracking-wide">PROGRESS-BASED COSTING</td>
                <td className="w-2 border-none"></td>
                <td colSpan="2" className="bg-indigo-600 text-white border border-slate-400 p-1 px-2 text-left font-bold w-[300px] tracking-wide">ADDITIONAL-BASED COSTING</td>
              </tr>
              
              {/* ROW 2 */}
              <tr>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-blue-50 text-blue-900 w-[120px]">PROJECT CODE:</td>
                <td className="border border-slate-300 p-1 px-2 font-bold text-blue-700 bg-white">{project.project_code}</td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-emerald-50 text-emerald-900 w-[160px]">PERMITS & CONST'N PLANS:</td>
                <td className="border border-slate-300 p-1 px-2 text-right bg-white font-medium">{permits > 0 ? permits.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0'}</td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-indigo-50 text-indigo-900 w-[160px]">APPROVED QUOTATIONS</td>
                <td className="border border-slate-300 p-1 px-2 text-right bg-white text-slate-400">0</td>
              </tr>

              {/* ROW 3 */}
              <tr>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-blue-50 text-blue-900">PROJECT NAME:</td>
                <td className="border border-slate-300 p-1 px-2 font-bold truncate max-w-[200px] bg-white text-slate-800" title={project.project_name}>{project.project_name}</td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-emerald-50 text-emerald-900">SUPERVISION COST:</td>
                <td className="border border-slate-300 p-1 px-2 text-right bg-white font-medium">{supervision > 0 ? supervision.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0'}</td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-indigo-50 text-indigo-900">PERMIT WAIVER</td>
                <td className="border border-slate-300 p-1 px-2 text-right bg-white text-slate-400">0</td>
              </tr>

              {/* ROW 4 */}
              <tr>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-blue-50 text-blue-900">PROJECT AREA:</td>
                <td className="border border-slate-300 p-1 px-2 bg-white"></td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-emerald-50 text-emerald-900">CARPENTRY:</td>
                <td className="border border-slate-300 p-1 px-2 text-right bg-white font-medium">{carpentry > 0 ? carpentry.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0'}</td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold border-b-0 bg-indigo-50/50"></td>
                <td className="border border-slate-300 p-1 px-2 border-b-0 bg-indigo-50/50"></td>
              </tr>

              {/* ROW 5 */}
              <tr>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-blue-50 text-blue-900">PROJECT START:</td>
                <td className="border border-slate-300 p-1 px-2 bg-white"></td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-emerald-50 text-emerald-900">PAINTING:</td>
                <td className="border border-slate-300 p-1 px-2 text-right bg-white font-medium">{painting > 0 ? painting.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0'}</td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-indigo-50 text-indigo-900">UNAPPROVED QUOTATIONS</td>
                <td className="border border-slate-300 p-1 px-2 text-right bg-white text-slate-400">0</td>
              </tr>

              {/* ROW 6 */}
              <tr>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-blue-50 text-blue-900">40 DAYS END:</td>
                <td className="border border-slate-300 p-1 px-2 bg-white"></td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-emerald-50 text-emerald-900">ELECTRICAL:</td>
                <td className="border border-slate-300 p-1 px-2 text-right bg-white font-medium">{electrical > 0 ? electrical.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0'}</td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold border-b-0 bg-indigo-50/50"></td>
                <td className="border border-slate-300 p-1 px-2 border-b-0 bg-indigo-50/50"></td>
              </tr>

              {/* ROW 7 */}
              <tr>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-blue-100 text-blue-900">CONTRACT COST:</td>
                <td className="border border-slate-300 p-1 px-2 font-bold text-right bg-blue-50 text-blue-900">
                  {financials.contractCost > 0 ? financials.contractCost.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0'}
                </td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-emerald-50 text-emerald-900">PLUMBING:</td>
                <td className="border border-slate-300 p-1 px-2 text-right bg-white font-medium">{plumbing > 0 ? plumbing.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0'}</td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold border-b-0 bg-indigo-50/50"></td>
                <td className="border border-slate-300 p-1 px-2 border-b-0 bg-indigo-50/50"></td>
              </tr>

              {/* ROW 8 */}
              <tr>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-slate-100 text-slate-700">VAT AMOUNT:</td>
                <td className="border border-slate-300 p-1 px-2 font-bold text-right bg-slate-50 text-slate-700">
                  {financials.vatAmount > 0 ? financials.vatAmount.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0'}
                </td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-emerald-50 text-emerald-900">TEMPERED GLASS:</td>
                <td className="border border-slate-300 p-1 px-2 text-right bg-white font-medium">{temperedGlass > 0 ? temperedGlass.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0'}</td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold border-b-0 bg-indigo-50/50"></td>
                <td className="border border-slate-300 p-1 px-2 border-b-0 bg-indigo-50/50"></td>
              </tr>

              {/* ROW 9 */}
              <tr>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-indigo-100 text-indigo-900">BUDGET COST:</td>
                <td className="border border-slate-300 p-1 px-2 font-bold text-right bg-indigo-50 text-indigo-900">
                  {financials.budgetCost > 0 ? financials.budgetCost.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0'}
                </td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-emerald-50 text-emerald-900">MISCELLANEOUS COST:</td>
                <td className="border border-slate-300 p-1 px-2 text-right bg-white font-medium">{miscellaneous > 0 ? miscellaneous.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0'}</td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-indigo-50 text-indigo-900">ADDITIONAL WORKS</td>
                <td className="border border-slate-300 p-1 px-2 text-right bg-white text-slate-400">0</td>
              </tr>

              {/* ROW 10 */}
              <tr>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-rose-100 text-rose-900">PROFIT @ {(financials.profitPercent * 100).toFixed(0)}%</td>
                <td className="border border-slate-300 p-1 px-2 font-bold text-right bg-rose-50 text-rose-800">
                  {financials.profitAmount > 0 ? financials.profitAmount.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0'}
                </td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-emerald-50 text-emerald-900">LABOR/PAYROLL:</td>
                <td className="border border-slate-300 p-1 px-2 text-right bg-white font-medium">{labor > 0 ? labor.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0'}</td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-indigo-100 text-indigo-900">TOTAL ADDITIONAL</td>
                <td className="border border-slate-300 p-1 px-2 font-bold text-right bg-indigo-50 text-indigo-800">0</td>
              </tr>

              {/* ROW 11 */}
              <tr>
                <td className="border-2 border-emerald-500 p-1.5 px-2 font-bold bg-emerald-100 text-emerald-900">BUDGET COST LIMIT:</td>
                <td className="border-2 border-emerald-500 p-1.5 px-2 font-bold text-right bg-emerald-50 text-emerald-800 text-[12px]">
                  {financials.budgetCostLimit > 0 ? financials.budgetCostLimit.toLocaleString(undefined, {minimumFractionDigits: 2}) : '0'}
                </td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold border-t-0 bg-emerald-50/50"></td>
                <td className="border border-slate-300 p-1 px-2 border-t-0 bg-emerald-50/50"></td>
                <td className="border-none"></td>
                <td className="border border-slate-300 p-1 px-2 font-bold bg-indigo-50 text-indigo-900">VAT AMOUNT</td>
                <td className="border border-slate-300 p-1 px-2 text-right bg-white text-slate-400">0</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* ==================================================================== */}
        {/* ITEMIZED PROJECT LEDGER (Mismong kopya ng Excel Format sa Ibaba) */}
        {/* ==================================================================== */}
        <div className="flex flex-col flex-1 h-full min-h-[400px]">
          <div className="p-1.5 bg-slate-800 border-t border-l border-r border-slate-700 flex justify-between items-center shrink-0">
            <h3 className="font-bold text-slate-300 text-[10px] px-2 flex items-center gap-1.5 tracking-wider">
              <Receipt size={12} className="text-amber-400" />
              DETAILED EXPENSES LIST ({project.project_code})
            </h3>
            <div className="flex items-center gap-6 text-[11px] font-bold px-2">
               <span className="text-slate-300">TOTAL EXPENSES: <span className="text-amber-400 text-[12px] ml-1">₱{financials.totalExpenses.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></span>
               <span className="text-slate-300 border-l border-slate-600 pl-6">REMAINING PONDO: <span className={financials.remainingBudget < 0 ? 'text-red-400 text-[12px] ml-1' : 'text-emerald-400 text-[12px] ml-1'}>₱{financials.remainingBudget.toLocaleString(undefined, {minimumFractionDigits: 2})}</span></span>
            </div>
          </div>

          <div className="overflow-x-auto overflow-y-auto flex-1 border border-slate-300 bg-white">
            <table className="w-max text-left whitespace-nowrap border-collapse min-w-full text-[11px] text-slate-800">
              <thead className="sticky top-0 z-20 bg-slate-200">
                <tr>
                  <th className="border border-slate-300 p-1.5 px-2 font-bold text-slate-800 sticky left-0 z-30 bg-slate-200">Date</th>
                  <th className="border border-slate-300 p-1.5 px-2 font-bold text-slate-800">CV#</th>
                  <th className="border border-slate-300 p-1.5 px-2 font-bold text-slate-800">Payee</th>
                  <th className="border border-slate-300 p-1.5 px-2 font-bold text-slate-800">Particulars / Description</th>
                  <th className="border border-slate-300 p-1.5 px-2 font-black text-amber-900 bg-amber-100 text-right">Gross Amount</th>
                  
                  {EXPENSE_CATEGORIES.map(cat => (
                    <th key={cat} className="border border-slate-300 p-1.5 px-2 font-bold text-slate-700 text-right" title={cat}>
                      {cat.length > 20 ? cat.substring(0, 18) + '...' : cat}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {financials.projectExpenses.length === 0 ? (
                  <tr>
                    <td colSpan={5 + EXPENSE_CATEGORIES.length} className="p-4 text-center text-slate-400 italic">
                      Walang data
                    </td>
                  </tr>
                ) : (
                  financials.projectExpenses.map(d => (
                    <tr key={d.id} className="hover:bg-blue-50 transition-colors odd:bg-white even:bg-slate-50">
                      <td className="border border-slate-300 p-1 px-2 sticky left-0 z-10 bg-inherit font-medium text-slate-600 shadow-[1px_0_0_0_#cbd5e1]">{d.date}</td>
                      <td className="border border-slate-300 p-1 px-2 font-bold text-slate-800">{d.cv_no || ''}</td>
                      <td className="border border-slate-300 p-1 px-2 max-w-[200px] truncate" title={d.payee}>{d.payee}</td>
                      <td className="border border-slate-300 p-1 px-2 max-w-[250px] truncate" title={d.particulars}>{d.particulars}</td>
                      <td className="border border-slate-300 p-1 px-2 text-right font-bold text-amber-700 bg-amber-50/50">
                        {d.gross_amount ? parseFloat(d.gross_amount).toLocaleString(undefined, {minimumFractionDigits: 2}) : '0'}
                      </td>
                      
                      {EXPENSE_CATEGORIES.map(cat => {
                        const amt = getCategoryAmount(d, cat);
                        return (
                          <td key={cat} className="border border-slate-300 p-1 px-2 text-right text-slate-700">
                            {amt ? amt.toLocaleString(undefined, {minimumFractionDigits: 2}) : ''}
                          </td>
                        );
                      })}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}