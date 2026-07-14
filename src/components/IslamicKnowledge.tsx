import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Moon, BookOpen, Mic, Heart, Plus, Sparkles, Loader2, X, Pencil, Trash2, CheckCircle2, Circle } from 'lucide-react';
import { IslamicLog, DailyPrayers } from '../types';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { cn } from '../lib/utils';

interface IslamicKnowledgeProps { logs: IslamicLog[]; setLogs: (logs: IslamicLog[]) => void; prayers: DailyPrayers; setPrayers: (prayers: DailyPrayers) => void; }

export function IslamicKnowledge({ logs, setLogs, prayers, setPrayers }: IslamicKnowledgeProps) {
  const [newEntry, setNewEntry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<IslamicLog['category']>('quran');
  const [reflection, setReflection] = useState<string | null>(null);
  const [isReflecting, setIsReflecting] = useState(false);
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const getCategoryConfig = (category: IslamicLog['category']) => {
    switch (category) {
      case 'quran': return { icon: <BookOpen className="w-3 h-3" />, label: 'Al-Quran' };
      case 'hadith': return { icon: <Moon className="w-3 h-3" />, label: 'Hadits' };
      case 'kajian': return { icon: <Mic className="w-3 h-3" />, label: 'Kajian' };
      case 'reflection': return { icon: <Heart className="w-3 h-3" />, label: 'Muhasabah' };
    }
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;
    setLogs([{ id: Date.now().toString(), date: new Date().toISOString(), category: selectedCategory, content: newEntry }, ...logs]);
    setNewEntry('');
  };

  const deleteLog = (id: string) => setLogs(logs.filter(l => l.id !== id));
  const saveLogEdit = (id: string) => {
    if (editContent.trim()) setLogs(logs.map(l => l.id === id ? { ...l, content: editContent.trim() } : l));
    setEditingLogId(null);
  };
  const togglePrayer = (prayer: keyof DailyPrayers) => setPrayers({ ...prayers, [prayer]: !prayers[prayer] });

  const generateReflection = async () => {
    if (logs.length === 0) return;
    setIsReflecting(true); setReflection(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setReflection("Alhamdulillah, terus istiqomah dalam ibadah dan belajarmu hari ini.");
    setIsReflecting(false);
  };

  const prayerItems: { key: keyof DailyPrayers; label: string }[] = [
    { key: 'fajr', label: 'Subuh' }, { key: 'dhuhr', label: 'Dzuhur' }, { key: 'asr', label: 'Ashar' }, { key: 'maghrib', label: 'Maghrib' }, { key: 'isha', label: 'Isya' },
  ];

  return (
    // GLASSMORPHISM WRAPPER
    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/[0.05] shadow-2xl shadow-black/40 p-6 sm:p-8 rounded-3xl flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:border-white/[0.08] hover:bg-zinc-900/50">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-medium text-zinc-100 mb-1 flex items-center gap-2"><Moon className="w-5 h-5 text-emerald-400" /> Spiritual Center</h2>
          <p className="text-sm text-zinc-500">Prayer tracker & insights</p>
        </div>
        <button onClick={generateReflection} disabled={isReflecting || logs.length === 0}
          className={cn("flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full transition-colors border",
            isReflecting || reflection ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" : "bg-white/[0.02] border-white/[0.05] text-zinc-300 hover:bg-white/[0.05]"
          )}>
          {isReflecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">Insight</span>
        </button>
      </div>

      <div className="mb-8">
        <h3 className="text-[10px] font-semibold text-zinc-500 uppercase tracking-wider mb-3">Shalat Wajib</h3>
        <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.05] rounded-2xl p-2">
          {prayerItems.map(({ key, label }) => (
            <button key={key} onClick={() => togglePrayer(key)} className="flex flex-col items-center gap-1.5 p-2 rounded-xl transition-colors hover:bg-white/[0.05] flex-1">
              {prayers[key] ? <CheckCircle2 className="w-5 h-5 text-emerald-400" /> : <Circle className="w-5 h-5 text-zinc-600" />}
              <span className={cn("text-[10px] font-medium", prayers[key] ? "text-emerald-400" : "text-zinc-500")}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {reflection && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto', marginBottom: 24 }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="bg-emerald-500/5 border border-emerald-500/10 p-4 rounded-3xl relative group">
              <button onClick={() => setReflection(null)} className="absolute top-3 right-3 text-emerald-600 hover:text-emerald-400 opacity-0 group-hover:opacity-100"><X className="w-4 h-4" /></button>
              <h5 className="text-xs font-semibold text-emerald-400 mb-2 flex items-center gap-2"><Sparkles className="w-3.5 h-3.5" /> Nasihat AI</h5>
              <p className="text-sm text-emerald-100/70 leading-relaxed pr-6">{reflection}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleAddLog} className="mb-6 flex flex-col gap-4 border-t border-white/[0.05] pt-6">
        <div className="flex gap-2">
          <input type="text" value={newEntry} onChange={(e) => setNewEntry(e.target.value)} placeholder="Apa insight spiritualmu?" className="flex-1 bg-white/[0.02] border border-white/[0.05] rounded-2xl px-4 py-3 text-sm text-zinc-100 focus:outline-none focus:border-emerald-900/50" />
          <button type="submit" disabled={!newEntry.trim()} className="bg-zinc-100 text-zinc-900 px-5 rounded-2xl flex items-center justify-center font-medium text-sm hover:bg-zinc-300 disabled:opacity-50"><Plus className="w-4 h-4 sm:hidden" /><span className="hidden sm:inline">Simpan</span></button>
        </div>
        <div className="flex flex-wrap gap-2">
          {(['quran', 'hadith', 'kajian', 'reflection'] as const).map(cat => (
            <button key={cat} type="button" onClick={() => setSelectedCategory(cat)} className={cn("px-3 py-1.5 text-xs font-medium capitalize rounded-full transition-colors border flex items-center gap-1.5", selectedCategory === cat ? "bg-zinc-800 text-zinc-100 border-zinc-700" : "bg-transparent text-zinc-500 border-white/[0.05] hover:bg-white/[0.05]")}>
              {getCategoryConfig(cat).icon}{getCategoryConfig(cat).label}
            </button>
          ))}
        </div>
      </form>

      <div className="space-y-3 flex-1 overflow-y-auto pr-2">
        <AnimatePresence>
          {logs.map((log) => {
            const config = getCategoryConfig(log.category);
            const isEditing = editingLogId === log.id;
            return (
              <motion.div key={log.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-3xl bg-white/[0.02] border border-white/[0.02] flex flex-col gap-2 hover:bg-white/[0.05] group">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-medium text-emerald-500/80 flex items-center gap-1.5">{config.icon}{config.label}<span className="text-[10px] text-zinc-600 ml-2 border-l border-zinc-800 pl-2">{format(new Date(log.date), 'MMM dd', { locale: localeId })}</span></span>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => { setEditingLogId(log.id); setEditContent(log.content); }} className="text-zinc-500 hover:text-zinc-300 p-1"><Pencil className="w-3.5 h-3.5" /></button>
                    <button onClick={() => deleteLog(log.id)} className="text-zinc-500 hover:text-red-400 p-1"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                {isEditing ? (
                  <div className="mt-2 space-y-3">
                    <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} className="w-full bg-black/20 border border-white/[0.1] rounded-xl p-3 text-sm text-zinc-100 focus:outline-none min-h-[80px]" autoFocus />
                    <div className="flex justify-end gap-2">
                      <button onClick={() => setEditingLogId(null)} className="px-3 py-1.5 text-xs text-zinc-400 border border-white/[0.1] rounded-full">Batal</button>
                      <button onClick={() => saveLogEdit(log.id)} className="px-3 py-1.5 text-xs font-medium bg-zinc-100 text-zinc-900 rounded-full">Simpan</button>
                    </div>
                  </div>
                ) : (<p className="text-sm text-zinc-300 leading-relaxed mt-1">{log.content}</p>)}
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}