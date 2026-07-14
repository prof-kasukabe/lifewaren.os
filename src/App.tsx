import { useState } from 'react';
import { HabitTracker } from './components/HabitTracker';
import { FinanceTracker } from './components/FinanceTracker';
import { DecisionMatrix } from './components/DecisionMatrix';
import { LearningJournal } from './components/LearningJournal';
import { IslamicKnowledge } from './components/IslamicKnowledge';
import { DailyAnalysis } from './components/DailyAnalysis';
import { FocusTimer } from './components/FocusTimer';
import { QuickNote } from './components/QuickNote';
import { Habit, LearningLog, FinancialGoal, IslamicLog, DailyPrayers, IncomeLog } from './types';
import { useLocalStorage } from './hooks/useLocalStorage'; // Pastikan Anda sudah membuat file ini

const INITIAL_HABITS: Habit[] = [
  { id: '1', name: 'Membaca 10 halaman buku', category: 'mental', completed: true },
  { id: '2', name: 'Workout / Push up 30x', category: 'physical', completed: false },
  { id: '3', name: 'Coding algoritma / belajar stack baru', category: 'career', completed: false },
  { id: '4', name: 'Evaluasi pemasukan harian', category: 'career', completed: true },
  { id: '5', name: 'Tidur sebelum jam 11 malam', category: 'physical', completed: false },
];

const INITIAL_LOGS: LearningLog[] = [
  { id: '1', date: new Date().toISOString(), source: 'buku', content: 'Atomic Habits: Perbaikan 1% setiap hari' }
];

const INITIAL_GOAL: FinancialGoal = {
  totalAmount: 12000000,
  paidAmount: 4500000,
  monthsRemaining: 4,
  monthlyTarget: 1875000
};

const INITIAL_ISLAMIC_LOGS: IslamicLog[] = [];
const INITIAL_PRAYERS: DailyPrayers = { fajr: true, dhuhr: false, asr: false, maghrib: false, isha: false };
const INITIAL_FINANCE_LOGS: IncomeLog[] = [];

export default function App() {
  const [habits, setHabits] = useLocalStorage<Habit[]>('system-os-habits', INITIAL_HABITS);
  const [learningLogs, setLearningLogs] = useLocalStorage<LearningLog[]>('system-os-learning', INITIAL_LOGS);
  const [goal, setGoal] = useLocalStorage<FinancialGoal>('system-os-goal', INITIAL_GOAL);
  const [islamicLogs, setIslamicLogs] = useLocalStorage<IslamicLog[]>('system-os-islamic', INITIAL_ISLAMIC_LOGS);
  const [prayers, setPrayers] = useLocalStorage<DailyPrayers>('system-os-prayers', INITIAL_PRAYERS);
  const [financeLogs, setFinanceLogs] = useLocalStorage<IncomeLog[]>('system-os-finance', INITIAL_FINANCE_LOGS);
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  return (
    // Latar belakang diubah dengan sentuhan radial-gradient super tipis agar card kaca terlihat elegan
    <div className="min-h-screen bg-[#09090b] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.1),rgba(255,255,255,0))] text-zinc-100 p-6 sm:p-12 font-sans flex flex-col overflow-x-hidden selection:bg-zinc-800">
      <div className="max-w-[1200px] mx-auto w-full flex-grow flex flex-col gap-8">
        
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-8 border-b border-white/[0.05]">
          <div className="flex flex-col">
            <h1 className="text-2xl font-medium tracking-tight text-zinc-100">
              System<span className="text-zinc-500">.OS</span>
            </h1>
            <p className="text-sm text-zinc-500 mt-2">
              Performance & Income Matrix
            </p>
          </div>
          <FocusTimer />
        </header>

        <div className="w-full">
          <DailyAnalysis 
            selectedDate={selectedDate}
            setSelectedDate={setSelectedDate}
            habits={habits}
            learningLogs={learningLogs}
            islamicLogs={islamicLogs}
            prayers={prayers}
            financeLogs={financeLogs}
          />
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-grow">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex-1 min-h-[300px]">
              <FinanceTracker 
                goal={goal} 
                setGoal={setGoal} 
                financeLogs={financeLogs} 
                setFinanceLogs={setFinanceLogs} 
              />
            </div>
            <div className="flex-1 min-h-[400px]">
              <HabitTracker habits={habits} setHabits={setHabits} />
            </div>
          </div>

          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="min-h-[400px]">
                <IslamicKnowledge 
                  logs={islamicLogs} 
                  setLogs={setIslamicLogs} 
                  prayers={prayers} 
                  setPrayers={setPrayers} 
                />
              </div>
              <div className="min-h-[400px]">
                <DecisionMatrix habits={habits} logs={learningLogs} />
              </div>
            </div>
            <div className="min-h-[400px]">
              <LearningJournal logs={learningLogs} setLogs={setLearningLogs} />
            </div>
          </div>
        </main>
        
        <footer className="mt-4 flex flex-col sm:flex-row justify-between items-center text-xs text-zinc-500 border-t border-white/[0.05] pt-6 pb-4 gap-4 sm:gap-0">
          <div>System Status: Nominal</div>
          <div className="flex items-center gap-6">
            <div className="hidden md:block">Location: Dev Environment</div>
            <QuickNote />
          </div>
        </footer>
      </div>
    </div>
  );
}