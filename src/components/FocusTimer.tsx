import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';
import { cn } from '../lib/utils';

export function FocusTimer() {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(time => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  const toggle = () => setIsActive(!isActive);
  const reset = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = () => {
    const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
    const s = (timeLeft % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div className="flex flex-col items-end mt-4 sm:mt-0">
      <div className="flex items-center gap-3 mb-1">
        <button 
          onClick={toggle} 
          className="text-zinc-500 hover:text-zinc-100 transition-colors"
        >
          {isActive ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>
        <button 
          onClick={reset} 
          className="text-zinc-500 hover:text-zinc-100 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
        <div className={cn(
          "text-3xl font-light tracking-tight font-mono ml-2",
          isActive ? "text-zinc-100" : "text-zinc-500"
        )}>
          {formatTime()}
        </div>
      </div>
      <div className="text-xs text-zinc-600">Focus Session</div>
    </div>
  );
}
