import { useState } from 'react';
import { CheckCircle2, Circle, Sparkles, Loader2, Trash2 } from 'lucide-react';
import { IslamicLog, DailyPrayers } from '../types';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

interface IslamicKnowledgeProps { logs: IslamicLog[]; setLogs: (logs: IslamicLog[]) => void; prayers: DailyPrayers; setPrayers: (prayers: DailyPrayers) => void; }

export function IslamicKnowledge({ logs, setLogs, prayers, setPrayers }: IslamicKnowledgeProps) {
  const [newEntry, setNewEntry] = useState('');
  const [reflection, setReflection] = useState<string | null>(null);
  const [isReflecting, setIsReflecting] = useState(false);

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntry.trim()) return;
    setLogs([{ id: Date.now().toString(), date: new Date().toISOString(), category: 'reflection', content: newEntry }, ...logs]);
    setNewEntry('');
  };

  const togglePrayer = (prayer: keyof DailyPrayers) => setPrayers({ ...prayers, [prayer]: !prayers[prayer] });

  const generateReflection = async () => {
    if (logs.length === 0) return;
    setIsReflecting(true); setReflection(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setReflection("Istiqomah adalah kunci. Jagalah shalatmu seperti kamu menjaga urusan duniamu.");
    setIsReflecting(false);
  };

  const prayerItems: { key: keyof DailyPrayers; label: string }[] = [
    { key: 'fajr', label: 'Subuh' }, { key: 'dhuhr', label: 'Dzuhur' }, { key: 'asr', label: 'Ashar' }, { key: 'maghrib', label: 'Maghrib' }, { key: 'isha', label: 'Isya' },
  ];

  return (
    <div className="flex flex-col mt-16 pt-12 border-t border-gray-200">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Spiritual</h4>
          <h2 className="text-3xl font-light tracking-tight">Center</h2>
        </div>
        <button onClick={generateReflection} disabled={isReflecting || logs.length === 0} className="border border-black px-6 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase hover:bg-gray-50 flex items-center gap-2">
          {isReflecting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Insight
        </button>
      </div>

      <div className="mb-12">
        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Shalat Wajib</h4>
        <div className="flex justify-between items-center pb-4 border-b border-gray-200">
          {prayerItems.map(({ key, label }) => (
            <button key={key} onClick={() => togglePrayer(key)} className="flex flex-col items-center gap-2 flex-1 group">
              {prayers[key] ? <CheckCircle2 className="w-6 h-6 text-black" /> : <Circle className="w-6 h-6 text-gray-300 group-hover:text-gray-400" />}
              <span className={`text-[10px] font-bold tracking-widest uppercase ${prayers[key] ? "text-black" : "text-gray-400"}`}>{label}</span>
            </button>
          ))}
        </div>
      </div>

      {reflection && (
        <div className="mb-12 bg-gray-50 border-l-2 border-black p-6">
          <p className="text-sm font-light leading-relaxed text-black italic">"{reflection}"</p>
        </div>
      )}

      <form onSubmit={handleAddLog} className="mb-12">
        <input type="text" value={newEntry} onChange={(e) => setNewEntry(e.target.value)} placeholder="Tulis muhasabah hari ini..." className="w-full bg-transparent border-b border-gray-300 focus:border-black pb-4 text-xl font-light focus:outline-none placeholder:text-gray-300 mb-4" />
        <div className="flex justify-end">
          <button type="submit" disabled={!newEntry.trim()} className="bg-black text-white px-8 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase disabled:opacity-30">Simpan</button>
        </div>
      </form>

      <div className="space-y-6">
        {logs.map((log) => (
          <div key={log.id} className="group relative border-l border-gray-200 pl-6 py-2">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest block mb-2">{format(new Date(log.date), 'dd MMM yyyy', { locale: localeId })}</span>
            <p className="text-lg font-light text-black leading-relaxed">{log.content}</p>
            <button onClick={() => setLogs(logs.filter(l => l.id !== log.id))} className="absolute -left-[9px] top-4 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 bg-white"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    </div>
  );
}