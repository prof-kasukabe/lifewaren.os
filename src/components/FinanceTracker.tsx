import { useState } from 'react';
import { Pencil, Check } from 'lucide-react';
import { FinancialGoal, IncomeLog } from '../types';


interface FinanceTrackerProps {
  goal: FinancialGoal;
  setGoal: React.Dispatch<React.SetStateAction<FinancialGoal>>;
  financeLogs: IncomeLog[];
  setFinanceLogs: React.Dispatch<React.SetStateAction<IncomeLog[]>>;
}

export function FinanceTracker({ goal, setGoal, financeLogs, setFinanceLogs }: FinanceTrackerProps) {
  const [amountInput, setAmountInput] = useState('');
  
  // State untuk mode edit
  const [editingField, setEditingField] = useState<'none' | 'target' | 'paid' | 'time'>('none');
  const [tempValue, setTempValue] = useState('');

  const startEdit = (field: 'target' | 'paid' | 'time', value: number) => {
    setEditingField(field);
    setTempValue(value.toString());
  };

  const handleSave = () => {
    const val = parseInt(tempValue) || 0;
    if (editingField === 'target') setGoal(prev => ({ ...prev, totalAmount: val }));
    if (editingField === 'paid') setGoal(prev => ({ ...prev, paidAmount: val }));
    if (editingField === 'time') setGoal(prev => ({ ...prev, monthsRemaining: val }));
    setEditingField('none');
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(amountInput.replace(/\D/g, ''), 10);
    if (isNaN(amount) || amount <= 0) return;
    setGoal(prev => ({ ...prev, paidAmount: prev.paidAmount + amount }));
    setFinanceLogs([{ id: Date.now().toString(), amount, source: 'kurir', timestamp: Date.now() }, ...financeLogs]);
    setAmountInput('');
  };

  const progress = Math.min((goal.paidAmount / goal.totalAmount) * 100, 100);
  const formatRupiah = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-2 gap-y-10 gap-x-8 mb-12">
        
        {/* Target Dana */}
        <div>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Target Dana</h4>
          {editingField === 'target' ? (
            <div className="flex items-center gap-2">
              <input type="number" value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="w-full text-2xl font-light border-b border-black outline-none" />
              <button onClick={handleSave}><Check className="w-5 h-5" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => startEdit('target', goal.totalAmount)}>
              <div className="text-2xl sm:text-3xl font-light">{formatRupiah(goal.totalAmount)}</div>
              <Pencil className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </div>

        {/* Terkumpul */}
        <div>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Terkumpul</h4>
          {editingField === 'paid' ? (
            <div className="flex items-center gap-2">
              <input type="number" value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="w-full text-2xl font-light border-b border-black outline-none" />
              <button onClick={handleSave}><Check className="w-5 h-5" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => startEdit('paid', goal.paidAmount)}>
              <div className="text-2xl sm:text-3xl font-light">{formatRupiah(goal.paidAmount)}</div>
              <Pencil className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </div>

        {/* Progress (Read Only) */}
        <div>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Progress</h4>
          <div className="text-2xl sm:text-3xl font-light">{progress.toFixed(1)} %</div>
        </div>
        
        {/* Sisa Waktu */}
        <div>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Sisa Waktu</h4>
          {editingField === 'time' ? (
            <div className="flex items-center gap-2">
              <input type="number" value={tempValue} onChange={(e) => setTempValue(e.target.value)} className="w-full text-2xl font-light border-b border-black outline-none" />
              <button onClick={handleSave}><Check className="w-5 h-5" /></button>
            </div>
          ) : (
            <div className="flex items-center gap-2 group cursor-pointer" onClick={() => startEdit('time', goal.monthsRemaining)}>
              <div className="text-2xl sm:text-3xl font-light">{goal.monthsRemaining} <span className="text-lg">bln</span></div>
              <Pencil className="w-4 h-4 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          )}
        </div>
      </div>

      {/* Input Pemasukan */}
      <form onSubmit={handleAddLog} className="flex flex-col sm:flex-row items-end justify-between border-t border-gray-200 pt-8 mt-auto gap-6">
        <div className="w-full sm:w-auto flex-1">
          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">Input Pemasukan Harian</label>
          <div className="flex items-center text-3xl font-light">
            <span className="text-gray-400 mr-2">Rp</span>
            <input 
              type="text" 
              value={amountInput} 
              onChange={(e) => setAmountInput(e.target.value.replace(/\D/g, ''))} 
              placeholder="0" 
              className="w-full bg-transparent border-none focus:outline-none" 
            />
          </div>
        </div>
        <button type="submit" className="bg-black text-white px-8 py-4 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase">LOG INCOME</button>
      </form>
    </div>
  );
}