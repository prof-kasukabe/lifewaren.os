import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Package, Code, Book, Plus, GraduationCap, Sparkles, Loader2, X, Pencil, Trash2 } from 'lucide-react';
import { LearningLog } from '../types';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { cn } from '../lib/utils';

interface LearningJournalProps {
  logs: LearningLog[];
  setLogs: (logs: LearningLog[]) => void;
}

export function LearningJournal({ logs, setLogs }: LearningJournalProps) {
  const [newEntry, setNewEntry] = useState('');
  const [selectedSource, setSelectedSource] = useState<LearningLog['source']>('kurir');
  const [reflection, setReflection] = useState<string | null>(null);
  const [isReflecting, setIsReflecting] = useState(false);

  // State untuk mode Edit
  const [editingLogId, setEditingLogId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');

  const getSourceConfig = (source: LearningLog['source']) => {
    switch (source) {
      case 'kurir': return { icon: <Package className="w-3 h-3" />, label: 'Kurir' };
      case 'joki': return { icon: <GraduationCap className="w-3 h-3" />, label: 'Joki Skripsi' };
      case 'buku': return { icon: <Book className="w-3 h-3" />, label: 'Membaca' };
      case 'coding': return { icon: <Code className="w-3 h-3" />, label: 'Coding' };
    }
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;
    
    const newLog: LearningLog = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      source: selectedSource,
      content: newEntry
    };
    
    setLogs([newLog, ...logs]);
    setNewEntry('');
  };

  const deleteLog = (id: string) => {
    setLogs(logs.filter(l => l.id !== id));
  };

  const saveLogEdit = (id: string) => {
    if (editContent.trim()) {
      setLogs(logs.map(l => l.id === id ? { ...l, content: editContent.trim() } : l));
    }
    setEditingLogId(null);
  };

  const generateReflection = async () => {
    if (logs.length === 0) return;
    
    setIsReflecting(true);
    setReflection(null);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const recentSources = Array.from(new Set(logs.slice(0, 3).map(l => l.source)));
    const hasCodingOrBook = recentSources.includes('coding') || recentSources.includes('buku');
    const hasHustle = recentSources.includes('kurir') || recentSources.includes('joki');

    let mockAiText = "Menganalisis pola belajarmu akhir-akhir ini... ";
    
    if (hasCodingOrBook && hasHustle) {
      mockAiText = "Sangat solid! Kamu berhasil menyeimbangkan antara income aktif (Kurir/Joki) dengan investasi leher ke atas. Pertahankan momentum ini, evaluasi rute atau caramu bekerja agar ada lebih banyak waktu untuk *deep work*.";
    } else if (hasCodingOrBook) {
      mockAiText = "Fokus belajarmu sedang sangat bagus. Pastikan kamu langsung mempraktikkan apa yang kamu baca atau kodekan hari ini agar ilmunya menempel jadi *muscle memory*.";
    } else if (hasHustle) {
      mockAiText = "Kerja kerasmu untuk melunasi target finansial sangat terlihat. Jangan lupa luangkan waktu minimal 30 menit malam ini untuk *skill-up* atau membaca agar pertumbuhan jangka panjang tetap aman.";
    } else {
      mockAiText = "Kamu terus mencatat progres dengan konsisten. Perbaikan 1% setiap harinya akan menjadi *compound effect* yang luar biasa dalam beberapa bulan ke depan!";
    }

    setReflection(mockAiText);
    setIsReflecting(false);
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 sm:p-8 rounded-2xl flex flex-col h-full min-h-[500px]">
      <div className="flex flex-col h-full">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-medium text-zinc-100 mb-1">Knowledge Base</h2>
            <p className="text-sm text-zinc-500">Learning & insights log</p>
          </div>
          <button 
            onClick={generateReflection}
            disabled={isReflecting || logs.length === 0}
            className={cn(
              "flex items-center gap-2 text-xs font-medium px-3 py-2 rounded-lg transition-colors border",
              isReflecting || reflection
                ? "bg-zinc-100 text-zinc-900 border-zinc-100 opacity-100" 
                : "bg-zinc-900 border-zinc-800 text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 disabled:opacity-50"
            )}
          >
            {isReflecting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Sparkles className="w-3.5 h-3.5" />
            )}
            <span>{isReflecting ? 'Analyzing...' : 'AI Reflect'}</span>
          </button>
        </div>

        <AnimatePresence>
          {reflection && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto', marginBottom: 24 }}
              exit={{ opacity: 0, y: -10, height: 0, marginBottom: 0 }}
              className="overflow-hidden"
            >
              <div className="bg-zinc-900/80 border border-zinc-700/80 p-4 rounded-xl relative group">
                <button 
                  onClick={() => setReflection(null)}
                  className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-4 h-4" />
                </button>
                <h5 className="text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-zinc-100" /> 
                  AI Synthesis
                </h5>
                <p className="text-sm text-zinc-300 leading-relaxed pr-6">
                  {reflection}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleAdd} className="mb-6 flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={newEntry}
              onChange={(e) => setNewEntry(e.target.value)}
              placeholder="What did you learn today?"
              className="flex-1 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-600 focus:ring-1 focus:ring-zinc-600"
            />
            <button 
              type="submit"
              disabled={!newEntry.trim()}
              className="bg-zinc-100 text-zinc-900 px-4 rounded-xl flex items-center justify-center font-medium text-sm hover:bg-zinc-200 transition-colors disabled:opacity-50"
            >
              <Plus className="w-4 h-4 sm:hidden" />
              <span className="hidden sm:inline">Log</span>
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(['kurir', 'joki', 'buku', 'coding'] as const).map(source => {
              const config = getSourceConfig(source);
              return (
                <button
                  key={source}
                  type="button"
                  onClick={() => setSelectedSource(source)}
                  className={cn(
                    "px-3 py-1.5 text-xs font-medium capitalize rounded-lg transition-colors border flex items-center gap-1.5",
                    selectedSource === source 
                      ? "bg-zinc-800 text-zinc-100 border-zinc-700" 
                      : "bg-transparent text-zinc-500 border-transparent hover:bg-zinc-900"
                  )}
                >
                  {config.icon}
                  {config.label}
                </button>
              )
            })}
          </div>
        </form>

        <div className="space-y-4 flex-1 overflow-y-auto pr-2">
          <AnimatePresence>
            {logs.map((log) => {
              const config = getSourceConfig(log.source);
              const isEditing = editingLogId === log.id;
              
              return (
                <motion.div
                  key={log.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-zinc-900/50 border border-zinc-800/50 flex flex-col gap-2 hover:bg-zinc-900/80 transition-colors group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-medium text-zinc-400 flex items-center gap-1.5">
                      {config.icon}
                      {config.label}
                      <span className="text-[10px] text-zinc-500 font-medium tracking-wide ml-2 border-l border-zinc-700 pl-2">
                        {format(new Date(log.date), 'MMM dd, HH:mm', { locale: id })}
                      </span>
                    </span>
                    
                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => {
                          setEditingLogId(log.id);
                          setEditContent(log.content);
                        }}
                        className="text-zinc-500 hover:text-zinc-300 p-1 transition-colors"
                        title="Edit Log"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button 
                        onClick={() => deleteLog(log.id)}
                        className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                        title="Delete Log"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Konten Log (Teks atau Form Edit) */}
                  {isEditing ? (
                    <div className="mt-2 space-y-3">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-100 focus:outline-none focus:border-zinc-500 min-h-[80px]"
                        autoFocus
                      />
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => setEditingLogId(null)}
                          className="px-3 py-1.5 text-xs text-zinc-400 hover:text-zinc-200 border border-zinc-700 rounded-lg"
                        >
                          Cancel
                        </button>
                        <button 
                          onClick={() => saveLogEdit(log.id)}
                          className="px-3 py-1.5 text-xs font-medium bg-zinc-100 text-zinc-900 rounded-lg"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-zinc-300 leading-relaxed mt-1">
                      {log.content}
                    </p>
                  )}
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}