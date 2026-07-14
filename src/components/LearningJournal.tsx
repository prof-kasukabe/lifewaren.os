import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Sparkles, Loader2, Plus, Trash2 } from 'lucide-react';
import { LearningLog } from '../types';

interface LearningJournalProps { logs: LearningLog[]; setLogs: (logs: LearningLog[]) => void; }

export function LearningJournal({ logs, setLogs }: LearningJournalProps) {
  const [newEntry, setNewEntry] = useState('');
  const [reflection, setReflection] = useState<string | null>(null);
  const [isReflecting, setIsReflecting] = useState(false);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;
    setLogs([{ id: Date.now().toString(), date: new Date().toISOString(), source: 'buku', content: newEntry }, ...logs]);
    setNewEntry('');
  };

  const deleteLog = (id: string) => setLogs(logs.filter(l => l.id !== id));

  const generateReflection = async () => {
    if (logs.length === 0) return;
    setIsReflecting(true); setReflection(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setReflection("Analisis AI: Pola belajarmu sangat terstruktur. Terus kembangkan pemahaman konseptual ini ke level implementasi.");
    setIsReflecting(false);
  };

  return (
    <div className="flex flex-col mt-16 pt-12 border-t border-gray-200">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Knowledge Base</h4>
          <h2 className="text-3xl font-light tracking-tight">Journal</h2>
        </div>
        <button onClick={generateReflection} disabled={isReflecting || logs.length === 0} className="border border-black px-6 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-50 flex items-center gap-2">
          {isReflecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Reflect
        </button>
      </div>

      {reflection && (
        <div className="mb-8 bg-black text-white p-6 rounded-lg">
          <h5 className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-2">AI Synthesis</h5>
          <p className="text-sm font-light leading-relaxed">{reflection}</p>
        </div>
      )}

      <form onSubmit={handleAdd} className="mb-12">
        <textarea value={newEntry} onChange={(e) => setNewEntry(e.target.value)} placeholder="Tulis insight hari ini..."
          className="w-full bg-transparent border-none text-2xl font-light focus:outline-none placeholder:text-gray-200 resize-none h-24" />
        <div className="flex justify-end">
          <button type="submit" disabled={!newEntry.trim()} className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase disabled:opacity-30">
            Log Record
          </button>
        </div>
      </form>

      <div className="space-y-8 border-t border-gray-200 pt-8">
        <AnimatePresence>
          {logs.map((log) => (
            <motion.div key={log.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col sm:flex-row gap-4 sm:gap-12 group relative border-b border-gray-100 pb-8">
              <div className="sm:w-32 flex-shrink-0">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block">{format(new Date(log.date), 'dd MMM yyyy', { locale: id })}</span>
                <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest block mt-1">{format(new Date(log.date), 'HH:mm')}</span>
              </div>
              <p className="text-lg font-light text-black flex-1 leading-relaxed">{log.content}</p>
              <button onClick={() => deleteLog(log.id)} className="absolute right-0 top-0 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <Trash2 className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}