import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Pencil, Plus } from 'lucide-react';
import { FinancialGoal, IncomeLog } from '../types';
import { cn } from '../lib/utils';

interface FinanceTrackerProps {
  goal: FinancialGoal;
  setGoal: React.Dispatch<React.SetStateAction<FinancialGoal>>;
  financeLogs: IncomeLog[];
  setFinanceLogs: React.Dispatch<React.SetStateAction<IncomeLog[]>>;
}

export function FinanceTracker({ goal, setGoal, financeLogs, setFinanceLogs }: FinanceTrackerProps) {
  const [amountInput, setAmountInput] = useState('');
  const [isEditingGoal, setIsEditingGoal] = useState(false);
  const [targetInput, setTargetInput] = useState(goal.totalAmount.toString());
  const [paidInput, setPaidInput] = useState(goal.paidAmount.toString());
  const [source, setSource] = useState<'kurir' | 'joki'>('kurir');
  const [isLogging, setIsLogging] = useState(false);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseInt(amountInput.replace(/\D/g, ''), 10);
    if (isNaN(amount) || amount <= 0) return;
    setGoal(prev => ({ ...prev, paidAmount: prev.paidAmount + amount, monthlyTarget: prev.monthsRemaining > 0 ? Math.ceil((prev.totalAmount - (prev.paidAmount + amount)) / prev.monthsRemaining) : 0 }));
    setFinanceLogs([{ id: Date.now().toString(), amount, source, timestamp: Date.now() }, ...financeLogs]);
    setAmountInput('');
    setIsLogging(false);
  };

  const progress = Math.min((goal.paidAmount / goal.totalAmount) * 100, 100);
  const formatRupiah = (amount: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);
  
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    setAmountInput(raw ? parseInt(raw, 10).toLocaleString('id-ID') : '');
  };

  return (
    // GLASSMORPHISM WRAPPER
    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/[0.05] shadow-2xl shadow-black/40 rounded-3xl p-6 sm:p-8 flex flex-col justify-between h-full relative overflow-hidden transition-all duration-300 hover:border-white/[0.08] hover:bg-zinc-900/50">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-medium mb-1 text-zinc-100">Financial Target</h2>
            <p className="text-sm text-zinc-500">6 Month Debt Liquidation</p>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { setTargetInput(goal.totalAmount.toString()); setPaidInput(goal.paidAmount.toString()); setIsEditingGoal(true); }} className="text-zinc-400 hover:text-zinc-100 transition-colors p-2 rounded-full hover:bg-white/[0.05]"><Pencil className="w-4 h-4"/></button>
            <button onClick={() => setIsLogging(!isLogging)} className="text-zinc-400 hover:text-zinc-100 transition-colors p-2 rounded-full hover:bg-white/[0.05]"><Plus className={cn("w-4 h-4 transition-transform", isLogging && "rotate-45")} /></button>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div className="flex justify-between text-sm"><span className="text-zinc-400">Progress</span><span className="text-zinc-200 font-medium">{progress.toFixed(1)}%</span></div>
          <div className="w-full bg-white/[0.05] rounded-full h-2 overflow-hidden">
            <div className="bg-zinc-200 h-full rounded-full transition-all duration-500" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div><p className="text-xs text-zinc-500">Terkumpul</p><p className="text-lg font-semibold text-zinc-200">{formatRupiah(goal.paidAmount)}</p></div>
            <div><p className="text-xs text-zinc-500">Target Total</p><p className="text-lg font-semibold text-zinc-400">{formatRupiah(goal.totalAmount)}</p></div>
          </div>
          <div className="bg-white/[0.02] border border-white/[0.05] p-3 rounded-2xl text-xs flex justify-between items-center">
            <span className="text-zinc-500">Target / Bulan ({goal.monthsRemaining} bln sisa):</span>
            <span className="text-zinc-200 font-medium">{formatRupiah(goal.monthlyTarget)}</span>
          </div>
        </div>

        <AnimatePresence>
          {isLogging && (
            <motion.form initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} onSubmit={handleAddLog} className="space-y-3 overflow-hidden border-t border-white/[0.05] pt-4">
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Jumlah Pemasukan (Rp)</label>
                <input type="text" value={amountInput} onChange={handleAmountChange} placeholder="50.000" className="w-full bg-white/[0.02] border border-white/[0.05] rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-white/[0.2]" />
              </div>
              <div>
                <label className="text-xs text-zinc-500 block mb-1">Sumber</label>
                <div className="grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => setSource('kurir')} className={cn("py-2 text-xs rounded-xl border transition-all", source === 'kurir' ? "bg-zinc-100 text-zinc-900 border-zinc-100" : "bg-transparent text-zinc-400 border-white/[0.05] hover:border-white/[0.1]")}>Kurir</button>
                  <button type="button" onClick={() => setSource('joki')} className={cn("py-2 text-xs rounded-xl border transition-all", source === 'joki' ? "bg-zinc-100 text-zinc-900 border-zinc-100" : "bg-transparent text-zinc-400 border-white/[0.05] hover:border-white/[0.1]")}>Joki</button>
                </div>
              </div>
              <button type="submit" className="w-full bg-zinc-100 hover:bg-zinc-300 text-zinc-900 font-medium text-xs py-2.5 rounded-xl transition-colors mt-2">Log Pemasukan</button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {isEditingGoal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <motion.div initial={{ scale: 0.95 }} animate={{ scale: 1 }} exit={{ scale: 0.95 }} className="bg-zinc-900/90 backdrop-blur-xl border border-white/[0.1] rounded-3xl p-6 w-full max-w-[380px] shadow-2xl">
              <h3 className="text-lg font-semibold mb-5 text-zinc-100">Edit Financial Target</h3>
              <div className="space-y-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Target Total (Rp)</label>
                  <input type="number" value={targetInput} onChange={(e) => setTargetInput(e.target.value)} className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-white/[0.3]" />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1">Sudah Terkumpul (Rp)</label>
                  <input type="number" value={paidInput} onChange={(e) => setPaidInput(e.target.value)} className="w-full bg-black/50 border border-white/[0.1] rounded-xl px-3 py-2.5 text-sm text-zinc-100 focus:outline-none focus:border-white/[0.3]" />
                </div>
                <div className="flex justify-end gap-2 pt-4">
                  <button type="button" onClick={() => setIsEditingGoal(false)} className="px-4 py-2 text-xs rounded-full border border-white/[0.1] text-zinc-300 hover:bg-white/[0.05]">Cancel</button>
                  <button type="button" onClick={() => {
                      const total = parseInt(targetInput, 10) || 0;
                      const paid = parseInt(paidInput, 10) || 0;
                      setGoal(prev => ({ ...prev, totalAmount: total, paidAmount: paid, monthlyTarget: prev.monthsRemaining > 0 ? Math.ceil((total - paid) / prev.monthsRemaining) : 0 }));
                      setIsEditingGoal(false);
                    }} className="bg-zinc-100 text-zinc-900 font-medium text-xs rounded-full px-5 py-2 hover:bg-zinc-300">Save</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}