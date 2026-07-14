import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { motion } from 'motion/react';
import { Habit, LearningLog, IslamicLog, DailyPrayers, IncomeLog } from '../types';

interface AnalysisProps {
  selectedDate: Date;
  setSelectedDate: (date: Date) => void;
  habits: Habit[];
  learningLogs: LearningLog[];
  islamicLogs: IslamicLog[];
  prayers: DailyPrayers;
  financeLogs: IncomeLog[];
}

export function DailyAnalysis({ 
  habits = [], 
  learningLogs = [], 
  islamicLogs = [], 
  prayers = {fajr:false, dhuhr:false, asr:false, maghrib:false, isha:false}, 
  financeLogs = [] 
}: any) {
  // Hitung metrik ringkasan
  const completedHabits = habits.filter(h => h.completed).length;
  const totalFinance = financeLogs.reduce((acc, curr) => acc + curr.amount, 0);
  const totalPrayers = Object.values(prayers).filter(Boolean).length;

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      {/* Header Section */}
      <div className="flex justify-between items-end border-b border-gray-100 pb-8">
        <div>
          <h2 className="text-sm font-bold tracking-[0.2em] uppercase text-gray-400">Executive Summary</h2>
          <p className="text-4xl font-light tracking-tight mt-2">Performance Overview</p>
        </div>
        <div className="text-right">
          <p className="text-sm font-bold">{format(new Date(), 'EEEE', { locale: localeId })}</p>
          <p className="text-xs text-gray-500">{format(new Date(), 'dd MMMM yyyy', { locale: localeId })}</p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatCard label="Habits Done" value={`${completedHabits}/${habits.length}`} />
        <StatCard label="Prayer Status" value={`${totalPrayers}/5`} />
        <StatCard label="Knowledge Log" value={`${learningLogs.length} Entries`} />
        <StatCard label="Total Income" value={`Rp ${(totalFinance / 1000).toFixed(1)}k`} />
      </div>

      {/* Insight Box */}
      <div className="bg-gray-50 p-8 rounded-2xl border border-gray-100">
        <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Strategic Insight</h3>
        <p className="text-lg leading-relaxed max-w-2xl font-light italic">
          {completedHabits > 0 
            ? "Fokus harian Anda menunjukkan tren positif. Pertahankan momentum pada kategori produktivitas untuk mencapai target akhir pekan."
            : "Data menunjukkan aktivitas rendah hari ini. Mulai dengan satu habit sederhana untuk mengaktifkan sistem operasional Anda kembali."}
        </p>
      </div>
    </motion.div>
  );
}

// Komponen Pembantu (Stat Card)
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="p-6 bg-white border border-gray-100 rounded-xl hover:border-black transition-colors">
      <p className="text-[10px] uppercase tracking-widest font-bold text-gray-400">{label}</p>
      <p className="text-2xl font-bold mt-2">{value}</p>
    </div>
  );
}