import { motion, AnimatePresence } from 'motion/react';
import { Scale, CheckCircle2, XCircle, HelpCircle, Sparkles, Loader2 } from 'lucide-react';
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

  const getQuadrantName = () => {
    switch (quadrant) {
      case 'do': return 'Execute Fast (High Reward, Low Effort)';
      case 'schedule': return 'Schedule (High Reward, High Effort)';
      case 'delegate': return 'Delegate (Low Reward, Low Effort)';
      case 'drop': return 'Hard Reject (Low Reward, High Effort)';
      default: return 'Unknown';
    }
  };

  const generateInsight = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/decision-insight', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          quadrant: getQuadrantName(),
          effort,
          reward,
          habits: habits.slice(0, 5),
          logs: logs.slice(0, 5)
        })
      });
      const data = await response.json();
      if (data.insight) {
        setInsight(data.insight);
      }
    } catch (error) {
      console.error('Failed to generate insight:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="bg-zinc-900/30 p-6 sm:p-8 border border-zinc-800/50 rounded-2xl flex flex-col h-full">
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-2xl font-medium text-zinc-100 mb-1">Decision Matrix</h2>
          <p className="text-sm text-zinc-500">Evaluate tasks & projects</p>
        </div>
        <button 
          onClick={generateInsight}
          disabled={isGenerating}
          className="flex items-center gap-2 text-xs font-medium bg-zinc-900 hover:bg-zinc-800 text-zinc-300 px-3 py-2 rounded-lg transition-colors disabled:opacity-50 border border-zinc-800/80"
        >
          {isGenerating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-zinc-400" />}
          AI Insight
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
            <div className="bg-zinc-900 text-zinc-200 p-4 rounded-xl border border-zinc-800 relative">
              <h5 className="text-xs font-medium text-zinc-400 mb-2 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> AI Insight
              </h5>
              <p className="text-sm leading-relaxed">
                {insight}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-1">
        <div className="space-y-8 flex flex-col justify-center">
          <div>
            <div className="flex justify-between text-sm font-medium mb-3 text-zinc-400">
              <span>Effort</span>
              <span className="text-zinc-100">{effort}/10</span>
            </div>
            <input 
              type="range" 
              min="0" max="10" 
              value={effort}
              onChange={(e) => setEffort(parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-zinc-300"
            />
          </div>
          
          <div>
            <div className="flex justify-between text-sm font-medium mb-3 text-zinc-400">
              <span>Reward</span>
              <span className="text-zinc-100">{reward}/10</span>
            </div>
            <input 
              type="range" 
              min="0" max="10" 
              value={reward}
              onChange={(e) => setReward(parseInt(e.target.value))}
              className="w-full h-1.5 bg-zinc-800 rounded-full appearance-none cursor-pointer accent-zinc-300"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-zinc-800/50 pt-6 md:pt-0 md:pl-8">
          <div className="text-xs font-medium text-zinc-500 mb-4">Recommendation</div>
          <motion.div 
            key={quadrant}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-3"
          >
            <div className="flex items-center gap-3 text-zinc-100">
              {quadrant === 'do' && <CheckCircle2 className="w-6 h-6 shrink-0 text-zinc-300" />}
              {quadrant === 'schedule' && <HelpCircle className="w-6 h-6 shrink-0 text-zinc-400" />}
              {quadrant === 'delegate' && <HelpCircle className="w-6 h-6 shrink-0 text-zinc-500" />}
              {quadrant === 'drop' && <XCircle className="w-6 h-6 shrink-0 text-zinc-600" />}
              
              <div className="font-medium text-lg tracking-tight">
                {quadrant === 'do' && "Do it now"}
                {quadrant === 'schedule' && "Schedule"}
                {quadrant === 'delegate' && "Delegate"}
                {quadrant === 'drop' && "Drop it"}
              </div>
            </div>
            
            <div className="text-sm text-zinc-500 pl-9">
              {quadrant === 'do' && "High reward for low effort. Clear priority."}
              {quadrant === 'schedule' && "Worth doing but takes time. Plan it."}
              {quadrant === 'delegate' && "Not worth your time. Hand it off."}
              {quadrant === 'drop' && "High effort, low reward. Say no."}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
