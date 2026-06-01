import { useState, useEffect, useRef } from 'react';
import { Search, ChevronDown } from 'lucide-react';

export default function SearchableDropdown({ options, value, onChange, placeholder, hasError }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Dito natin babaguhin ang kulay kapag may error
  const borderClass = hasError
    ? 'border-red-500 ring-2 ring-red-500/20 bg-red-50 text-red-700'
    : isOpen
      ? 'border-blue-500 ring-2 ring-blue-500/20'
      : 'border-slate-300 hover:border-slate-400';

  return (
    <div ref={wrapperRef} className="relative w-full">
      <input type="text" required value={value} readOnly className="absolute w-0 h-0 opacity-0 pointer-events-none" />
      
      <div
        className={`w-full p-2 border rounded-md text-sm flex justify-between items-center cursor-pointer transition-colors ${borderClass} ${hasError ? '' : 'bg-white'}`}
        onClick={() => { setIsOpen(!isOpen); setSearchTerm(''); }}
      >
        <span className={value ? (hasError ? 'font-bold' : 'text-slate-800 font-medium') : (hasError ? 'text-red-500 font-medium' : 'text-slate-500')}>
          {value || placeholder}
        </span>
        <ChevronDown size={16} className={`${hasError ? 'text-red-500' : 'text-slate-400'} transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-xl max-h-60 flex flex-col overflow-hidden">
          <div className="p-2 border-b border-slate-100 bg-slate-50">
            <div className="relative">
              <Search size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
              <input
                type="text"
                className="w-full pl-8 p-1.5 text-sm border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                placeholder="Mag-type para maghanap..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={(e) => e.stopPropagation()}
                autoFocus
              />
            </div>
          </div>
          <div className="overflow-y-auto custom-scrollbar">
            {filteredOptions.length === 0 ? (
              <div className="p-3 text-sm text-slate-500 text-center">Walang nahanap na kategorya.</div>
            ) : (
              filteredOptions.map((option) => (
                <div
                  key={option}
                  className={`p-2.5 text-sm cursor-pointer transition-colors ${value === option ? 'bg-blue-50 text-blue-700 font-semibold' : 'text-slate-700 hover:bg-slate-100'}`}
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                >
                  {option}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}