export default function HealthCard({ title, amount, colorClass, textClass }) {
  return (
    <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-200 relative overflow-hidden flex flex-col justify-between">
      <div className={`absolute top-0 left-0 w-1 h-full ${colorClass}`}></div>
      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">{title}</h3>
      <div className={`text-2xl font-black ${textClass}`}>
        ₱{amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
      </div>
    </div>
  );
}