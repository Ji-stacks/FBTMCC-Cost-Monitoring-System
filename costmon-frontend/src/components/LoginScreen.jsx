import { Wallet, Receipt, BarChart3, LayoutDashboard } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center justify-center p-4">
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Wallet className="text-blue-600 w-10 h-10" />
          <h1 className="text-4xl font-bold text-slate-800 tracking-tight">CostMon.</h1>
        </div>
        <p className="text-slate-500">Pumili ng account para mag-login</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl w-full">
        <div onClick={() => onLogin('encoder')} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-blue-500 hover:shadow-md transition-all text-center group">
          <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-600 transition-colors"><Receipt className="text-blue-600 group-hover:text-white" size={28} /></div>
          <h3 className="font-bold text-lg text-slate-800">Encoder</h3><p className="text-xs text-slate-500 mt-2">Data Entry (Disbursements)</p>
        </div>
        <div onClick={() => onLogin('engineer')} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all text-center group">
          <div className="bg-emerald-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-emerald-600 transition-colors"><BarChart3 className="text-emerald-600 group-hover:text-white" size={28} /></div>
          <h3 className="font-bold text-lg text-slate-800">Project Engineer</h3><p className="text-xs text-slate-500 mt-2">Read-only Monitoring</p>
        </div>
        <div onClick={() => onLogin('ceo')} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-200 cursor-pointer hover:border-indigo-500 hover:shadow-md transition-all text-center group">
          <div className="bg-indigo-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-indigo-600 transition-colors"><LayoutDashboard className="text-indigo-600 group-hover:text-white" size={28} /></div>
          <h3 className="font-bold text-lg text-slate-800">CEO / Admin</h3><p className="text-xs text-slate-500 mt-2">Financial Health View</p>
        </div>
      </div>
    </div>
  );
}
