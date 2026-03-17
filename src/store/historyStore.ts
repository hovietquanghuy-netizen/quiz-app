import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Result } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface HistoryState {
  results: Result[];
  addResult: (result: Result) => void;
  clearHistory: () => void;
  removeResult: (id: string) => void;
}

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      results: [],
      addResult: (result) => set((state) => ({ 
        results: [{ ...result, id: uuidv4() }, ...state.results] 
      })),
      removeResult: (id) => set((state) => ({ 
        results: state.results.filter(r => r.id !== id) 
      })),
      clearHistory: () => set({ results: [] }),
    }),
    {
      name: 'quiz-history-storage',
    }
  )
);
