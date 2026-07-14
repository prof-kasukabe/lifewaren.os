import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { Habit, LearningLog } from '../types';

export function DecisionMatrix({ habits, logs }: { habits: Habit[]; logs: LearningLog[] }) {
  const [effort, setEffort] = useState<number>(5);
  const [reward, setReward] = useState<number>(5);
  const [insight, setInsight] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  let quadrant = 'drop';
  if (reward >= 5 && effort < 5) quadrant = 'do';
  else if (reward >= 5 && effort >= 5) quadrant = 'schedule';
  else if (reward < 5 && effort < 5) quadrant = 'delegate';

  const generateInsight = async () => {
    setIsGenerating(true); setInsight(null);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setInsight(
      quadrant === 'do' ? "Eksekusi sekarang. Jangan ditunda." :
      quadrant === 'schedule' ? "Jadwalkan Deep Work untuk ini." :
      quadrant === 'delegate' ? "Delegasikan atau otomatisasi." : "Tinggalkan. Tidak sepadan."
    );
    setIsGenerating(false);
  };

  return (
    <div className="flex flex-col mt-16 pt-12 border-t border-gray-200">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Matrix</h4>
          <h2 className="text-3xl font-light tracking-tight">Decision</h2>
        </div>
        <button onClick={generateInsight} disabled={isGenerating} className="bg-black text-white px-6 py-3 rounded-full text-[10px] font-bold tracking-[0.2em] uppercase disabled:opacity-50 flex items-center gap-2">
          {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} Assess
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="space-y-12">
          <div>
            <div className="flex justify-between text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-4">
              <span>Effort</span><span>{effort}/10</span>
            </div>
            <input type="range" min="0" max="10" value={effort} onChange={(e) => setEffort(parseInt(e.target.value))} className="w-full h-px bg-gray-200 appearance-none cursor-pointer accent-black" />
          </div>
          <div>
            <div className="flex justify-between text-[10px] font-bold text-black uppercase tracking-[0.2em] mb-4">
              <span>Reward</span><span>{reward}/10</span>
            </div>
            <input type="range" min="0" max="10" value={reward} onChange={(e) => setReward(parseInt(e.target.value))} className="w-full h-px bg-gray-200 appearance-none cursor-pointer accent-black" />
          </div>
        </div>

        <div className="border-t md:border-t-0 md:border-l border-gray-200 pt-8 md:pt-0 md:pl-12 flex flex-col justify-center">
          <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-4">Result</h4>
          <div className="text-4xl font-light tracking-tight mb-4">
            {quadrant === 'do' && "Do it now"}
            {quadrant === 'schedule' && "Schedule"}
            {quadrant === 'delegate' && "Delegate"}
            {quadrant === 'drop' && "Drop it"}
          </div>
          {insight && <p className="text-sm font-light leading-relaxed text-gray-600">{insight}</p>}
        </div>
      </div>
    </div>
  );
}