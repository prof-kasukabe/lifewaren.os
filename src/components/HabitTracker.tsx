import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Check, X, Sparkles, Loader2, Plus, Trash2, Pencil } from 'lucide-react';
import { Habit } from '../types';
import { cn } from '../lib/utils';

interface HabitTrackerProps {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
}

export function HabitTracker({ habits, setHabits }: HabitTrackerProps) {
  const [newHabitName, setNewHabitName] = useState('');
  const [actionPlan, setActionPlan] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const toggleHabit = (id: string) => {
    setHabits(habits.map(habit => habit.id === id ? { ...habit, completed: !habit.completed } : habit));
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    setHabits([{ id: Date.now().toString(), name: newHabitName.trim(), category: 'mental', completed: false }, ...habits]);
    setNewHabitName('');
    setIsAdding(false);
  };

  const deleteHabit = (id: string) => setHabits(habits.filter(h => h.id !== id));

  const generateActionPlan = async () => {
    setIsGenerating(true);
    setActionPlan(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const pending = habits.filter(h => !h.completed);
    setActionPlan(pending.length === 0 ? "Semua habit beres. Waktunya istirahat." : `Prioritas: Lakukan "${pending[0].name}" sekarang.`);
    setIsGenerating(false);
  };

  const completedCount = habits.filter(h => h.completed).length;

  return (
    <div className="flex flex-col mt-16 pt-12 border-t border-gray-200">
      
      <div className="flex justify-between items-end mb-8">
        <div>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Consistency</h4>
          <h2 className="text-3xl font-light tracking-tight">Habit Tracker</h2>
        </div>
        <div className="text-right">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Completed</h4>
          <span className="text-3xl font-light tracking-tight">{completedCount}/{habits.length}</span>
        </div>
      </div>

      <AnimatePresence>
        {actionPlan && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden mb-8">
            <div className="bg-gray-50 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4 relative">
              <button onClick={() => setActionPlan(null)} className="absolute top-4 right-4 text-gray-400 hover:text-black"><X className="w-4 h-4" /></button>
              <div className="flex items-center gap-2 text-black"><Sparkles className="w-4 h-4" /><span className="text-[10px] font-bold tracking-[0.2em] uppercase">AI Insight</span></div>
              <p className="text-sm font-light text-gray-600 sm:border-l sm:border-gray-200 sm:pl-4">{actionPlan}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="flex flex-col mb-8 border-t border-gray-200">
        <AnimatePresence>
          {habits.map((habit) => (
            <motion.li key={habit.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="group flex items-center justify-between py-5 border-b border-gray-200 hover:bg-gray-50 transition-colors px-2 -mx-2"
            >
              <div className="flex items-center gap-6 flex-1 cursor-pointer" onClick={() => toggleHabit(habit.id)}>
                <div className={cn("flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors",
                  habit.completed ? "bg-black border-black text-white" : "border-gray-300 group-hover:border-black"
                )}>
                  {habit.completed && <Check className="w-3 h-3" />}
                </div>
                <span className={cn("text-lg font-light transition-all", habit.completed ? "line-through text-gray-400" : "text-black")}>
                  {habit.name}
                </span>
              </div>
              <button onClick={() => deleteHabit(habit.id)} className="text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {isAdding ? (
        <form onSubmit={handleAddHabit} className="flex gap-4">
          <input type="text" value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} placeholder="Habit baru..." autoFocus
            className="flex-1 bg-transparent border-b border-black pb-2 text-lg font-light focus:outline-none placeholder:text-gray-300" />
          <button type="submit" disabled={!newHabitName.trim()} className="bg-black text-white px-6 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase disabled:opacity-30">Save</button>
          <button type="button" onClick={() => setIsAdding(false)} className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-black">Cancel</button>
        </form>
      ) : (
        <div className="flex flex-col sm:flex-row gap-4 mt-auto">
          <button onClick={() => setIsAdding(true)} className="flex-1 border border-black text-black px-8 py-4 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-50 flex items-center justify-center gap-2">
            <Plus className="w-4 h-4" /> Add Habit
          </button>
          <button onClick={generateActionPlan} disabled={isGenerating} className="flex-1 bg-black text-white px-8 py-4 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-800 flex items-center justify-center gap-2 disabled:opacity-50">
            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />} AI ACTION
          </button>
        </div>
      )}
    </div>
  );
}