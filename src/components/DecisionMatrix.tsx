import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, XCircle, HelpCircle, Sparkles, Loader2, X, Scale } from 'lucide-react';
import { cn } from '../lib/utils';
import { useState } from 'react';
import { Habit, LearningLog } from '../types';

type Quadrant = 'do' | 'schedule' | 'delegate' | 'drop' | null;

interface DecisionMatrixProps {
  habits: Habit[];
  logs: LearningLog[];
}

export function DecisionMatrix({ habits, logs }: DecisionMatrixProps) {
  const [effort, setEffort] = useState<number>(5);
  const [reward, setReward] = useState<number>(5);
  const [insight, setInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  let quadrant: Quadrant = null;
  if (reward >= 5 && effort < 5) quadrant = 'do';
  else if (reward >= 5 && effort >= 5) quadrant = 'schedule';
  else if (reward < 5 && effort < 5) quadrant = 'delegate';
  else if (reward < 5 && effort >= 5) quadrant = 'drop';

  const generateInsight = async () => {
    setIsGenerating(true);
    setInsight(null);
    
    // Simulasi delay AI (1.5 detik)
    await new Promise(resolve => setTimeout(resolve, 1500));

    let aiAdvice = "";
    
    if (quadrant === 'do') {
      aiAdvice = "Tugas ini adalah 'Quick Win' (Kemenangan Cepat). Jangan ditunda. Eksekusi dalam 1-2 jam ke depan untuk mendapatkan momentum positif di sisa hari Anda.";
    } else if (quadrant === 'schedule') {
      aiAdvice = "Ini adalah tugas penting namun menguras energi. Blokir waktu khusus (Deep Work) di kalender Anda. Jauhkan distraksi dan kerjakan saat energi Anda sedang di puncak (misal: pagi hari setelah habit fisik).";
    } else if (quadrant === 'delegate') {
      aiAdvice = "Tugas ini tidak sepadan dengan waktu Anda. Bisakah ini diotomatisasi dengan script/tools? Atau delegasikan ke orang lain agar fokus Anda tetap pada hal-hal yang menghasilkan income besar.";
    } else if (quadrant === 'drop') {
      aiAdvice = "Hapus tugas ini dari pikiran Anda. Waktu dan energi Anda terlalu berharga untuk dihabiskan pada hal yang menguras tenaga tanpa memberikan hasil (reward) yang berarti.";
    }

    setInsight(aiAdvice);
    setIsGenerating(false);
  };

  return (
    // GLASSMORPHISM WRAPPER
    <div className="bg-zinc-950/40 backdrop-blur-md border border-white/[0.05] shadow-2xl shadow-black/40 rounded-3xl p-6 sm:p-8 flex flex-col h-full relative overflow-hidden transition-all duration-300 hover:border-white/[0.08] hover:bg-zinc-900/50">
      
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-medium text-zinc-100 mb-1 flex items-center gap-2">
            <Scale className="w-5 h-5 text-blue-400" />
            Decision Matrix
          </h2>
          <p className="text-sm text-zinc-500">Evaluate tasks & projects</p>
        </div>
        <button 
          onClick={generateInsight}
          disabled={isGenerating}
          className={cn(
            "flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full transition-colors border",
            isGenerating || insight 
              ? "bg-zinc-100 text-zinc-900 border-zinc-100" 
              : "bg-white/[0.02] border-white/[0.05] text-zinc-300 hover:bg-white/[0.05]"
          )}
        >
          {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
          <span>{isGenerating ? 'Analyzing...' : 'AI Insight'}</span>
        </button>
      </div>

      <AnimatePresence>
        {insight && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="overflow-hidden"
          >
            <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-3xl relative group">
              <button 
                onClick={() => setInsight(null)}
                className="absolute top-3 right-3 text-zinc-500 hover:text-zinc-300 transition-colors opacity-0 group-hover:opacity-100"
              >
                <X className="w-4 h-4" />
              </button>
              <h5 className="text-xs font-semibold text-zinc-300 mb-2 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-zinc-100" /> AI Insight
              </h5>
              <p className="text-sm text-zinc-300 leading-relaxed pr-6">
                {insight}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        
        {/* Sliders Area */}
        <div className="space-y-8 flex flex-col justify-center">
          <div>
            <div className="flex justify-between text-sm font-medium mb-3 text-zinc-400">
              <span>Effort (Usaha)</span>
              <span className="text-zinc-100 bg-white/[0.05] px-2 py-0.5 rounded-full">{effort}/10</span>
            </div>
            <input 
              type="range" 
              min="0" max="10" 
              value={effort}
              onChange={(e) => setEffort(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/[0.1] rounded-full appearance-none cursor-pointer accent-zinc-100 hover:accent-white transition-all"
            />
          </div>
          
          <div>
            <div className="flex justify-between text-sm font-medium mb-3 text-zinc-400">
              <span>Reward (Hasil)</span>
              <span className="text-zinc-100 bg-white/[0.05] px-2 py-0.5 rounded-full">{reward}/10</span>
            </div>
            <input 
              type="range" 
              min="0" max="10" 
              value={reward}
              onChange={(e) => setReward(parseInt(e.target.value))}
              className="w-full h-1.5 bg-white/[0.1] rounded-full appearance-none cursor-pointer accent-zinc-100 hover:accent-white transition-all"
            />
          </div>
        </div>

        {/* Recommendation Area */}
        <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-white/[0.05] pt-6 md:pt-0 md:pl-8">
          <div className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4">Recommendation</div>
          <motion.div 
            key={quadrant}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-3 text-zinc-100">
              {quadrant === 'do' && <CheckCircle2 className="w-6 h-6 shrink-0 text-emerald-400" />}
              {quadrant === 'schedule' && <HelpCircle className="w-6 h-6 shrink-0 text-blue-400" />}
              {quadrant === 'delegate' && <HelpCircle className="w-6 h-6 shrink-0 text-orange-400" />}
              {quadrant === 'drop' && <XCircle className="w-6 h-6 shrink-0 text-red-400" />}
              
              <div className="font-medium text-lg tracking-tight">
                {quadrant === 'do' && "Do it now"}
                {quadrant === 'schedule' && "Schedule"}
                {quadrant === 'delegate' && "Delegate"}
                {quadrant === 'drop' && "Drop it"}
              </div>
            </div>
            
            <div className="text-sm text-zinc-400 pl-9">
              {quadrant === 'do' && "Reward tinggi dengan usaha minim. Selesaikan secepatnya."}
              {quadrant === 'schedule' && "Sangat bernilai namun butuh waktu. Rencanakan dengan matang."}
              {quadrant === 'delegate' && "Tidak sepadan dengan waktumu. Berikan ke orang/sistem lain."}
              {quadrant === 'drop' && "Menghabiskan tenaga tanpa hasil jelas. Katakan TIDAK."}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}