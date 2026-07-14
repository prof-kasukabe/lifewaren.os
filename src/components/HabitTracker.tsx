import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Dumbbell, Brain, Briefcase, Plus, Sparkles, Loader2, X, Pencil, Trash2 } from 'lucide-react';
import { Habit } from '../types';
import { cn } from '../lib/utils';

interface HabitTrackerProps {
  habits: Habit[];
  setHabits: (habits: Habit[]) => void;
}

export function HabitTracker({ habits, setHabits }: HabitTrackerProps) {
  const [newHabitName, setNewHabitName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Habit['category']>('physical');
  const [isAdding, setIsAdding] = useState(false);
  const [actionPlan, setActionPlan] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const toggleHabit = (id: string) => {
    if (editingId) return;
    setHabits(habits.map(habit => habit.id === id ? { ...habit, completed: !habit.completed } : habit));
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;
    setHabits([{ id: Date.now().toString(), name: newHabitName.trim(), category: selectedCategory, completed: false }, ...habits]);
    setNewHabitName('');
    setIsAdding(false);
  };

  const deleteHabit = (id: string) => setHabits(habits.filter(h => h.id !== id));
  const saveEdit = (id: string) => {
    if (editName.trim()) setHabits(habits.map(h => h.id === id ? { ...h, name: editName.trim() } : h));
    setEditingId(null);
  };

  const generateActionPlan = async () => {
    setIsGenerating(true);
    setActionPlan(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    const pending = habits.filter(h => !h.completed);
    setActionPlan(pending.length === 0 ? "Semua habit beres! Saatnya deep work atau istirahat." : `Prioritas: Lakukan "${pending[0].name}" sekarang juga.`);
    setIsGenerating(false);
  };

  const getIcon = (category: Habit['category']) => {
    switch (category) {
      case 'physical': return <Dumbbell className="w-4 h-4 shrink-0" />;
      case 'mental': return <Brain className="w-4 h-4 shrink-0" />;
      case 'career': return <Briefcase className="w-4 h-4 shrink-0" />;
    }
  };

  const completedCount = habits.filter(h => h.completed).length;

  return (
    // GLASSMORPHISM WRAPPER
    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/[0.05] shadow-2xl shadow-black/40 rounded-3xl p-6 sm:p-8 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:border-white/[0.08] hover:bg-zinc-900/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-medium mb-1 text-zinc-100">Habits</h3>
          <p className="text-sm text-zinc-500">Physical & Mental Consistency</p>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500 font-medium">{completedCount}/{habits.length}</span>
          <button 
            onClick={generateActionPlan} disabled={isGenerating}
            className={cn("flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full border transition-colors",
              isGenerating || actionPlan ? "bg-zinc-100 text-zinc-900 border-zinc-100" : "bg-white/[0.02] border-white/[0.05] text-zinc-300 hover:bg-white/[0.05]"
            )}
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>Action</span>
          </button>
          <button onClick={() => setIsAdding(!isAdding)} className="text-zinc-400 hover:text-zinc-100 transition-colors p-2 rounded-full hover:bg-white/[0.05]">
            <Plus className={cn("w-4 h-4 transition-transform", isAdding && "rotate-45")} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div initial={{ opacity: 0, height: 0, marginBottom: 0 }} animate={{ opacity: 1, height: 'auto', marginBottom: 24 }} exit={{ opacity: 0, height: 0, marginBottom: 0 }} className="overflow-hidden">
            <form onSubmit={handleAddHabit} className="bg-white/[0.02] rounded-3xl p-4 border border-white/[0.05] flex flex-col gap-4">
              <input type="text" value={newHabitName} onChange={(e) => setNewHabitName(e.target.value)} placeholder="New habit..." autoFocus
                className="w-full bg-transparent border-b border-white/[0.05] pb-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-white/[0.2]" />
              <div className="flex flex-wrap gap-2">
                {(['physical', 'mental', 'career'] as const).map(cat => (
                  <button key={cat} type="button" onClick={() => setSelectedCategory(cat)}
                    className={cn("px-3 py-1.5 text-xs font-medium capitalize rounded-full border flex items-center gap-1.5 transition-colors",
                      selectedCategory === cat ? "bg-zinc-100 text-zinc-900 border-zinc-100" : "bg-transparent text-zinc-400 border-white/[0.05] hover:border-white/[0.1]"
                    )}
                  >
                    {getIcon(cat)}{cat}
                  </button>
                ))}
              </div>
              <button type="submit" disabled={!newHabitName.trim()} className="bg-zinc-100 text-zinc-900 rounded-full py-2 text-sm font-medium mt-2 disabled:opacity-50">
                Add Habit
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="space-y-1 flex-1 overflow-y-auto pr-2">
        <AnimatePresence>
          {habits.map((habit) => (
            <motion.li key={habit.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, scale: 0.9 }}
              className="group p-3 rounded-2xl hover:bg-white/[0.03] transition-colors flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 flex-1 cursor-pointer min-w-0" onClick={() => toggleHabit(habit.id)}>
                <div className={cn("flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                  habit.completed ? "bg-zinc-100 border-zinc-100 text-zinc-900" : "border-white/[0.1] group-hover:border-white/[0.2]"
                )}>
                  {habit.completed && <Check className="w-3 h-3" />}
                </div>
                <div className="flex-1 min-w-0">
                  {editingId === habit.id ? (
                    <input type="text" autoFocus value={editName} onChange={(e) => setEditName(e.target.value)} onBlur={() => saveEdit(habit.id)} onKeyDown={(e) => e.key === 'Enter' && saveEdit(habit.id)}
                      className="w-full bg-transparent border-b border-white/[0.1] text-sm font-medium text-zinc-100 focus:outline-none" />
                  ) : (
                    <span className={cn("text-sm font-medium transition-all block truncate", habit.completed ? "line-through text-zinc-600" : "text-zinc-200")}>{habit.name}</span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="opacity-40 group-hover:opacity-100 transition-opacity">{getIcon(habit.category)}</div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity border-l border-white/[0.05] pl-3">
                  <button onClick={() => { setEditingId(habit.id); setEditName(habit.name); }} className="text-zinc-500 hover:text-zinc-300 p-1"><Pencil className="w-3.5 h-3.5" /></button>
                  <button onClick={() => deleteHabit(habit.id)} className="text-zinc-500 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <AnimatePresence>
        {actionPlan && (
          <motion.div initial={{ opacity: 0, y: 10, height: 0 }} animate={{ opacity: 1, y: 0, height: 'auto', marginTop: 16 }} exit={{ opacity: 0, y: 10, height: 0 }} className="overflow-hidden">
            <div className="bg-white/[0.02] border border-white/[0.05] rounded-3xl p-4 relative group">
              <button onClick={() => setActionPlan(null)} className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-300 opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button>
              <div className="flex items-center gap-2 text-zinc-300 mb-2"><Sparkles className="w-4 h-4 text-zinc-100" /><span className="text-xs font-semibold">AI Action Plan</span></div>
              <p className="text-sm text-zinc-300 leading-relaxed pr-6">{actionPlan}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}