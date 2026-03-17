export interface Question {
  id: string;
  text: string;
  options: { label: string; text: string }[];
  correctIndex: number;
}

export interface Deck {
  id: string;
  name: string;
  questions: Question[];
  createdAt: number;
}

export interface Session {
  deckId: string;
  questions: Question[];
  answers: (number | null)[];
  flagged: boolean[];
  startedAt: number;
  timeLimit: number | null;
  mode: 'exam' | 'review';
}

export interface Result {
  id?: string;
  deckId: string;
  deckName?: string;
  score: number;
  total: number;
  timeTaken: number;
  date: number;
  wrongIds: string[];
}
