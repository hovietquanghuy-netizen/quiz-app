import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Deck } from '../types';

interface DeckState {
  decks: Deck[];
  addDeck: (deck: Deck) => void;
  removeDeck: (id: string) => void;
  clearDecks: () => void;
}

export const useDeckStore = create<DeckState>()(
  persist(
    (set) => ({
      decks: [],
      addDeck: (deck) => set((state) => ({ decks: [...state.decks, deck] })),
      removeDeck: (id) => set((state) => ({ decks: state.decks.filter((d) => d.id !== id) })),
      clearDecks: () => set({ decks: [] }),
    }),
    {
      name: 'quiz-decks-storage',
    }
  )
);
