import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CalendarDays, Activity, Flame, ChevronRight, Zap } from 'lucide-react';
import { Habit, LearningLog, IslamicLog, DailyPrayers, IncomeLog } from '../types';
import { format, subDays, isSameDay, isToday } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { cn } from '../lib/utils';

interface DailyAnalysisProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  habits: Habit[];
  learningLogs: LearningLog[];
  islamicLogs: IslamicLog[];
  prayers: DailyPrayers;
  financeLogs: IncomeLog[];
}

export function DailyAnalysis({
  selectedDate,
  setSelectedDate,
  habits,
  learningLogs,
  islamicLogs,
  prayers,
  financeLogs
}: DailyAnalysisProps) {
  const [directive, setDirective] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const last7Days = Array.from({ length: 7 }).map((_, i) => subDays(new Date(), 6 - i));

  useEffect(() => {
    setDirective(null);
  }, [selectedDate]);

  const generateDirective = async () => {
    setIsAnalyzing(true);
    setDirective(null);
    
    await new Promise(resolve => setTimeout(resolve, 1500));

    const dayFinanceLogs = financeLogs.filter(l => isSameDay(new Date(l.timestamp), selectedDate));
    const dayLearningLogs = learningLogs.filter(l => isSameDay(new Date(l.date), selectedDate));
    const dayIslamicLogs = islamicLogs.filter(l => isSameDay(new Date(l.date), selectedDate));
    
    const totalIncome = dayFinanceLogs.reduce((sum, log) => sum + log.amount, 0);
    const completedHabits = habits.filter(h => h.completed).length;
    const prayerCount = Object.values(prayers).filter(Boolean).length;

    let analysis = "";

    if (isToday(selectedDate)) {
      if (totalIncome === 0 && dayLearningLogs.length === 0 && prayerCount < 5) {
        analysis = "⚠️ **WARNING**: Hari ini berjalan tanpa progres signifikan. Tidak ada pemasukan, tidak ada log belajar, dan ibadah wajib belum sempurna. Segera ambil kendali. Kerjakan 1 habit fisik sekarang, dan selesaikan kewajibanmu.";
      } else if (totalIncome > 0 && dayLearningLogs.length > 0 && prayerCount === 5) {
        analysis = "🔥 **OPTIMAL STATE**: Kinerja hari ini luar biasa. Anda mencetak pemasukan Rp " + totalIncome.toLocaleString('id-ID') + ", menambah knowledge base, dan menjaga 5 waktu. Eksekusi yang sempurna. Gunakan sisa hari untuk recovery total.";
      } else {
        analysis = `📊 **STATUS REPORT**: \n- Pemasukan: Rp ${totalIncome.toLocaleString('id-ID')}.\n- Habit selesai: ${completedHabits}/${habits.length}.\n- Shalat terjaga: ${prayerCount}/5.\n\n**Directive**: Keseimbangan Anda cukup baik, namun masih ada ruang kosong. Pastikan target finansial tidak membuat Anda mengorbankan waktu deep work atau ibadah. Eksekusi sisa target Anda.`;
      }
    } else {
      if (totalIncome > 0 || dayLearningLogs.length > 0 || dayIslamicLogs.length > 0) {
        analysis = `Berdasarkan data historis tanggal ${format(selectedDate, 'dd MMM')}, Anda mencatat pemasukan Rp ${totalIncome.toLocaleString('id-ID')} dengan ${dayLearningLogs.length} log pembelajaran dan ${dayIslamicLogs.length} log spiritual. Jadikan ritme positif ini sebagai baseline.`;
      } else {
        analysis = `Tidak ada data aktivitas yang tercatat untuk tanggal ${format(selectedDate, 'dd MMM')}. Jika ini adalah hari istirahat, pastikan Anda benar-benar memulihkan energi. Jika ini hari terbuang, jadikan bahan evaluasi keras.`;
      }
    }

    setDirective(analysis);
    setIsAnalyzing(false);
  };

  return (
    <div className="bg-zinc-900/30 border border-zinc-800/50 p-6 sm:p-8 rounded-2xl flex flex-col w-full relative overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-medium text-zinc-100 mb-1 flex items-center gap-2">
            <Activity className="w-5 h-5 text-indigo-400" />
            Executive Summary
          </h2>
          <p className="text-sm text-zinc-500">Daily analysis & performance directive</p>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
          {last7Days.map((date) => {
            const isSelected = isSameDay(date, selectedDate);
            const isTodayDate = isToday(date);
            
            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[54px] h-14 rounded-xl border transition-all",
                  isSelected 
                    ? "bg-zinc-100 border-zinc-100 text-zinc-900 shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                    : "bg-zinc-950/50 border-zinc-800 text-zinc-500 hover:border-zinc-700 hover:bg-zinc-900"
                )}
              >
                <span className="text-[10px] uppercase font-semibold tracking-wider">
                  {format(date, 'EEE', { locale: localeId })}
                </span>
                <span className={cn(
                  "text-lg font-bold leading-none mt-1",
                  isSelected ? "text-zinc-900" : isTodayDate ? "text-indigo-400" : "text-zinc-300"
                )}>
                  {format(date, 'dd')}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="bg-zinc-950/50 border border-zinc-800/80 rounded-xl p-6 relative">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-2 text-zinc-400">
            <CalendarDays className="w-4 h-4" />
            <span className="text-sm font-medium">
              Data Tanggal: <span className="text-zinc-200">{format(selectedDate, 'dd MMMM yyyy', { locale: localeId })}</span>
            </span>
          </div>
          <button
            onClick={generateDirective}
            disabled={isAnalyzing}
            className="flex items-center gap-2 text-xs font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 hover:bg-indigo-500/20 px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {isAnalyzing ? <Zap className="w-3.5 h-3.5 animate-pulse" /> : <Flame className="w-3.5 h-3.5" />}
            Generate Directive
          </button>
        </div>

        <AnimatePresence mode="wait">
          {directive ? (
            <motion.div
              key="directive"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap"
            >
              {directive}
            </motion.div>
          ) : (
            <motion.div
              key="placeholder"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-sm text-zinc-600 flex items-center gap-2 h-10"
            >
              <ChevronRight className="w-4 h-4" />
              Menunggu inisiasi analisis dari sistem...
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}