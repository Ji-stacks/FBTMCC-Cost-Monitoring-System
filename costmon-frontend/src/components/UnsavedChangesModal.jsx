import { AlertTriangle, Save, Trash2, X } from 'lucide-react';

export default function UnsavedChangesModal({ isOpen, onClose, onSaveDraft, onDiscard }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md border border-slate-100 animate-in zoom-in-95 duration-200">
        
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-4 rounded-full mb-4 bg-amber-50 text-amber-600">
            <AlertTriangle size={32} strokeWidth={2} />
          </div>
          <h3 className="text-2xl font-black text-slate-800 tracking-tight">
            Unsaved Changes
          </h3>
          <p className="text-sm text-slate-500 font-medium mt-2">
            You have unsaved changes in your disbursement entry. What would you like to do?
          </p>
        </div>

        <div className="space-y-3">
          <button 
            onClick={onSaveDraft}
            className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-200 flex items-center justify-center gap-2"
          >
            <Save size={18} /> Save as Draft
          </button>
          
          <button 
            onClick={onDiscard}
            className="w-full py-3.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <Trash2 size={18} /> Discard Changes
          </button>

          <button 
            onClick={onClose}
            className="w-full py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            <X size={18} /> Cancel (Stay Here)
          </button>
        </div>

      </div>
    </div>
  );
}