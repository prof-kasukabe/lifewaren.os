import { useState } from 'react';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { Menu, X } from 'lucide-react';
import { FinanceTracker } from './components/FinanceTracker';
import { HabitTracker } from './components/HabitTracker';
import { LearningJournal } from './components/LearningJournal';
import { IslamicKnowledge } from './components/IslamicKnowledge';
import { DecisionMatrix } from './components/DecisionMatrix';
import { DailyAnalysis } from './components/DailyAnalysis';
import { useLocalStorage } from './hooks/useLocalStorage';
import { cn } from './lib/utils';
import randyProfile from './assets/RandyWa.png';

import { Habit, LearningLog, FinancialGoal, IslamicLog, DailyPrayers, IncomeLog } from './types';

const TABS = [
  { id: 'analysis', label: 'Analysis' },
  { id: 'finance', label: 'Finance' },
  { id: 'habits', label: 'Habits' },
  { id: 'knowledge', label: 'Knowledge' },
  { id: 'islamic', label: 'Islamic' },
  { id: 'matrix', label: 'Matrix' }
] as const;

export default function App() {
  const [activeTab, setActiveTab] = useState<typeof TABS[number]['id']>('analysis');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const [habits, setHabits] = useLocalStorage<Habit[]>('habits', []);
  const [goal, setGoal] = useLocalStorage<FinancialGoal>('goal', { totalAmount: 12000000, paidAmount: 0, monthsRemaining: 4, monthlyTarget: 3000000 });
  const [financeLogs, setFinanceLogs] = useLocalStorage<IncomeLog[]>('finance-logs', []);
  const [learningLogs, setLearningLogs] = useLocalStorage<LearningLog[]>('learning-logs', []);
  const [islamicLogs, setIslamicLogs] = useLocalStorage<IslamicLog[]>('islamic-logs', []);
  const [prayers, setPrayers] = useLocalStorage<DailyPrayers>('prayers', { fajr: false, dhuhr: false, asr: false, maghrib: false, isha: false });
  const [selectedDate, setSelectedDate] = useState(new Date());

  return (
    <div className="min-h-screen bg-white text-black font-sans flex flex-col lg:flex-row overflow-hidden">
      
      {/* Mobile Header */}
      <div className="lg:hidden p-6 border-b border-gray-100 flex justify-between items-center z-50 bg-white">
        <span className="font-bold text-lg">System.OS</span>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-20 left-0 w-full bg-white border-b border-gray-100 p-6 flex flex-col gap-4 z-40">
          {TABS.map(tab => (
            <button key={tab.id} className="uppercase font-bold text-left hover:text-gray-500" onClick={() => { setActiveTab(tab.id); setIsMobileMenuOpen(false); }}>
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Sidebar Desktop */}
      <div className="hidden lg:flex w-5/12 flex-col justify-between p-12 border-r border-gray-100 h-screen sticky top-0">
        <header className="font-bold text-xl tracking-tight">System.OS</header>
        <div className="flex-1 flex items-center justify-center">
          <img src={randyProfile} alt="Profile" className="w-80 h-80 rounded-full object-cover shadow-2xl border-4 border-white grayscale hover:grayscale-0 transition-all duration-500" />
        </div>
        <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
          {format(new Date(), 'dd MMMM yyyy', { locale: localeId })}
        </div>
      </div>

      {/* Desktop Vertical Nav */}
      <nav className="hidden lg:flex w-20 border-r border-gray-100 flex-col items-center py-12 justify-center gap-10 text-[10px] font-bold tracking-[0.3em] uppercase bg-gray-50/50">
        {TABS.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} 
            className={cn("[writing-mode:vertical-lr] rotate-180 transition-colors py-2", activeTab === tab.id ? "text-black" : "text-gray-300 hover:text-black")}>
            {tab.label}
          </button>
        ))}
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-12 overflow-y-auto h-[calc(100vh-80px)] lg:h-screen">
        <div className="max-w-5xl mx-auto">
          {activeTab === 'analysis' && <DailyAnalysis selectedDate={selectedDate} setSelectedDate={setSelectedDate} habits={habits} learningLogs={learningLogs} islamicLogs={islamicLogs} prayers={prayers} financeLogs={financeLogs} />}
          {activeTab === 'finance' && <FinanceTracker goal={goal} setGoal={setGoal} financeLogs={financeLogs} setFinanceLogs={setFinanceLogs} />}
          {activeTab === 'habits' && <HabitTracker habits={habits} setHabits={setHabits} />}
          {activeTab === 'knowledge' && <LearningJournal logs={learningLogs} setLogs={setLearningLogs} />}
          {activeTab === 'islamic' && <IslamicKnowledge logs={islamicLogs} setLogs={setIslamicLogs} prayers={prayers} setPrayers={setPrayers} />}
          {activeTab === 'matrix' && <DecisionMatrix habits={habits} logs={learningLogs} />}
        </div>
      </main>
    </div>
  );
}