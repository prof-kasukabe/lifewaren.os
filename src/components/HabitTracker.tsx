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
  
  // State untuk AI Action Plan
  const [actionPlan, setActionPlan] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  // State untuk mode Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');

  const toggleHabit = (id: string) => {
    // Jangan toggle kalau sedang mode edit
    if (editingId) return;
    setHabits(habits.map(habit => 
      habit.id === id ? { ...habit, completed: !habit.completed } : habit
    ));
  };

  const handleAddHabit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    const newHabit: Habit = {
      id: Date.now().toString(),
      name: newHabitName.trim(),
      category: selectedCategory,
      completed: false,
    };

    setHabits([newHabit, ...habits]);
    setNewHabitName('');
    setIsAdding(false);
  };

  const deleteHabit = (id: string) => {
    setHabits(habits.filter(h => h.id !== id));
  };

  const saveEdit = (id: string) => {
    if (editName.trim()) {
      setHabits(habits.map(h => h.id === id ? { ...h, name: editName.trim() } : h));
    }
    setEditingId(null);
  };

  const generateActionPlan = async () => {
    setIsGenerating(true);
    setActionPlan(null);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const pendingHabits = habits.filter(h => !h.completed);
    let plan = "";

    if (pendingHabits.length === 0) {
      plan = "Semua habit harianmu sudah beres! 🔥 Bagus sekali. Sekarang kamu bisa fokus pada deep work atau gunakan waktu sisa untuk istirahat total dan recovery.";
    } else {
      const physical = pendingHabits.find(h => h.category === 'physical');
      const mental = pendingHabits.find(h => h.category === 'mental' || h.category === 'career');

      if (physical && mental) {
        plan = `Kamu butuh momentum. Segera lakukan habit fisikmu: "${physical.name}" sekarang juga. Begitu darah mengalir dan detak jantung naik, langsung manfaatkan fokus tersebut untuk menyelesaikan "${mental.name}".`;
      } else if (physical) {
        plan = `Tubuhmu butuh bergerak. Sisa target fisikmu: "${physical.name}". Jangan tunggu nanti malam, lakukan sekarang juga!`;
      } else if (mental) {
        plan = `Habit fisikmu sudah aman, tapi otakmu masih punya hutang: "${mental.name}". Jauhkan HP, pasang timer fokus selama 30 menit, dan mulai kerjakan.`;
      } else {
        plan = `Prioritasmu saat ini adalah: "${pendingHabits[0].name}". Jangan biarkan ini tertunda sampai besok. Lakukan sekarang biar malammu lebih tenang.`;
      }
    }

    setActionPlan(plan);
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
    <div className="bg-zinc-900/30 border border-zinc-800/50 rounded-2xl p-6 sm:p-8 flex flex-col h-full relative overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-medium mb-1 text-zinc-100">Habits</h3>
          <p className="text-sm text-zinc-500">Physical & Mental Consistency</p>
        </div>
        
        <div className="flex items-center gap-4">
          <span className="text-sm text-zinc-500 font-medium">{completedCount}/{habits.length}</span>
          
          <button 
            onClick={generateActionPlan}
            disabled={isGenerating}
            className={cn(
              "flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg border transition-colors",
              isGenerating || actionPlan 
                ? "bg-zinc-100 text-zinc-900 border-zinc-100 opacity-100" 
                : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-50"
            )}
          >
            {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            <span>{isGenerating ? 'Analyzing...' : 'AI Action'}</span>
          </button>

          <button 
            onClick={() => setIsAdding(!isAdding)}
            className="text-zinc-400 hover:text-zinc-100 transition-colors p-2 rounded-full hover:bg-zinc-800/50"
          >
            <Plus className={cn("w-4 h-4 transition-transform", isAdding && "rotate-45")} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <form onSubmit={handleAddHabit} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800/50 flex flex-col gap-4">
              <input
                type="text"
                value={newHabitName}
                onChange={(e) => setNewHabitName(e.target.value)}
                placeholder="New habit..."
                className="w-full bg-transparent border-b border-zinc-800 pb-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-zinc-500"
                autoFocus
              />
              <div className="flex flex-wrap gap-2">
                {(['physical', 'mental', 'career'] as const).map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={cn(
                      "px-3 py-1.5 text-xs font-medium capitalize rounded-lg border flex items-center gap-1.5 transition-colors",
                      selectedCategory === cat 
                        ? "bg-zinc-100 text-zinc-900 border-zinc-100" 
                        : "bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-700"
                    )}
                  >
                    {getIcon(cat)}
                    {cat}
                  </button>
                ))}
              </div>
              <button 
                type="submit"
                disabled={!newHabitName.trim()}
                className="bg-zinc-100 text-zinc-900 rounded-lg py-2 text-sm font-medium mt-2 disabled:opacity-50 transition-opacity"
              >
                Add Habit
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      <ul className="space-y-2 flex-1 overflow-y-auto pr-2">
        <AnimatePresence>
          {habits.map((habit) => (
            <motion.li 
              key={habit.id} 
              layout
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="group p-3 rounded-xl hover:bg-zinc-900/50 transition-colors flex items-center justify-between gap-4"
            >
              <div 
                className="flex items-center gap-4 flex-1 cursor-pointer min-w-0"
                onClick={() => toggleHabit(habit.id)}
              >
                <div className={cn(
                  "flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-colors",
                  habit.completed ? "bg-zinc-100 border-zinc-100 text-zinc-900" : "border-zinc-700 group-hover:border-zinc-500"
                )}>
                  {habit.completed && <Check className="w-3 h-3" />}
                </div>
                
                <div className="flex-1 min-w-0">
                  {editingId === habit.id ? (
                    <input
                      type="text"
                      autoFocus
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      onBlur={() => saveEdit(habit.id)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEdit(habit.id)}
                      className="w-full bg-transparent border-b border-zinc-600 text-sm font-medium text-zinc-100 focus:outline-none focus:border-zinc-400"
                    />
                  ) : (
                    <span className={cn(
                      "text-sm font-medium transition-all block truncate",
                      habit.completed ? "line-through text-zinc-500" : "text-zinc-200"
                    )}>
                      {habit.name}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="opacity-40 group-hover:opacity-100 transition-opacity">
                  {getIcon(habit.category)}
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity border-l border-zinc-800 pl-3">
                  <button 
                    onClick={() => {
                      setEditingId(habit.id);
                      setEditName(habit.name);
                    }}
                    className="text-zinc-500 hover:text-zinc-300 transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                  <button 
                    onClick={() => deleteHabit(habit.id)}
                    className="text-zinc-500 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      <AnimatePresence>
        {actionPlan && (
          <motion.div
            initial={{ opacity: 0, y: 10, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto', marginTop: 16 }}
            exit={{ opacity: 0, y: 10, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-zinc-900 border border-zinc-700/80 rounded-xl p-4 relative group">
              <button 
                onClick={() => setActionPlan(null)}
                className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex items-center gap-2 text-zinc-300 mb-2">
                <Sparkles className="w-4 h-4 text-zinc-100" />
                <span className="text-xs font-semibold">AI Action Plan</span>
              </div>
              <p className="text-sm text-zinc-300 leading-relaxed pr-6">
                {actionPlan}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}