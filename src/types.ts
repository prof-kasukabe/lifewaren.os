export interface Habit {
  id: string;
  name: string;
  category: 'physical' | 'mental' | 'career';
  completed: boolean;
}

export interface LearningLog {
  id: string;
  date: string;
  source: 'kurir' | 'joki' | 'buku' | 'coding';
  content: string;
}

export interface FinancialGoal {
  totalAmount: number;
  paidAmount: number;
  monthsRemaining: number;
  monthlyTarget: number;
}

export interface IncomeLog {
  id: string;
  amount: number;
  source: 'kurir' | 'joki';
  timestamp: number;
}

export interface IslamicLog {
  id: string;
  date: string;
  category: 'quran' | 'hadith' | 'kajian' | 'reflection';
  content: string;
}

export interface DailyPrayers {
  fajr: boolean;
  dhuhr: boolean;
  asr: boolean;
  maghrib: boolean;
  isha: boolean;
}