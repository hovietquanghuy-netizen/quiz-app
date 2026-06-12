import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Session, Question } from '../types';
import { shuffleArray } from '../utils/shuffle';

interface SessionState extends Session {
  isConfigured: boolean;
  resultSaved: boolean;
  shuffleSettings: {
    shuffleQuestions: boolean;
    shuffleOptions: boolean;
  };
  startSession: (
    deckId: string, 
    questions: Question[], 
    config: { mode: 'exam' | 'review', shuffleQuestions: boolean, shuffleOptions: boolean, timeLimit?: number | null },
    initialAnswers?: (number | null)[]
  ) => void;
  setAnswer: (index: number, answerIndex: number | null) => void;
  toggleFlag: (index: number) => void;
  finishSession: () => void;
  markResultSaved: () => void;
  clearSession: () => void;
}

const initialState = {
  deckId: '',
  questions: [],
  answers: [],
  flagged: [],
  startedAt: 0,
  finishedAt: null,
  timeLimit: null,
  mode: 'review' as 'exam' | 'review',
  isConfigured: false,
  resultSaved: false,
  shuffleSettings: {
    shuffleQuestions: false,
    shuffleOptions: false,
  }
};

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      ...initialState,
      startSession: (deckId, questions, config, initialAnswers) => {
        let qsToUse = [...questions];
        
        if (config.shuffleQuestions) {
          qsToUse = shuffleArray(qsToUse);
          // Tự động xóa Số thứ tự/chữ "Câu X:" ở đầu câu hỏi nếu đang xáo trộn
          qsToUse = qsToUse.map(q => ({
             ...q,
             text: q.text.replace(/^(Câu\s*\d+[.:\-)]\s*|\d+[.:\-)]\s*)/i, '').trim()
          }));
        }

        if (config.shuffleOptions) {
          qsToUse = qsToUse.map(q => {
             // Kiểm tra xem câu hỏi có chứa đáp án mang tính chất "giữ vị trí" không
             // Tránh đảo lộn "A và C đúng", "Tất cả đều sai", "Đáp án trên" v.v.
             const hasFixedOption = q.options.some(opt => {
                 const t = opt.text.toLowerCase();
                 const hasReference = /\b([a-d])\s*(và|hoặc|hay|,)\s*([a-d])\b/.test(t);
                 const hasKeywords = /(tất cả|cả (hai|ba|2|3|a|b|c|d)\b|đáp án|phương án|câu (trên|dưới|khác|a|b|c|d)\b|ý (trên|dưới|khác|a|b|c|d)\b)/.test(t);
                 return hasReference || hasKeywords;
             });

             if (hasFixedOption) {
                 return q; // Giữ nguyên vị trí các lựa chọn
             }

             // Trộn theo index để không nhầm khi hai đáp án trùng nội dung
             const order = shuffleArray(q.options.map((_, i) => i));
             const shuffledOptions = order.map(i => q.options[i]);
             const newCorrectIndex = order.indexOf(q.correctIndex);

             return {
                ...q,
                options: shuffledOptions,
                correctIndex: newCorrectIndex
             };
          });
        }

        set({
          deckId,
          questions: qsToUse,
          answers: initialAnswers ? [...initialAnswers] : new Array(qsToUse.length).fill(null),
          flagged: new Array(qsToUse.length).fill(false),
          startedAt: Date.now(),
          finishedAt: null,
          timeLimit: config.timeLimit || null,
          mode: config.mode,
          isConfigured: true,
          resultSaved: false,
          shuffleSettings: {
            shuffleQuestions: config.shuffleQuestions,
            shuffleOptions: config.shuffleOptions
          }
        });
      },
      setAnswer: (index, answerIndex) => set((state) => {
        const newAnswers = [...state.answers];
        newAnswers[index] = answerIndex;
        return { answers: newAnswers };
      }),
      toggleFlag: (index) => set((state) => {
        const newFlagged = [...state.flagged];
        newFlagged[index] = !newFlagged[index];
        return { flagged: newFlagged };
      }),
      // Chốt thời điểm nộp bài một lần duy nhất (idempotent, sống sót qua reload)
      finishSession: () => set((state) => state.finishedAt ? {} : { finishedAt: Date.now() }),
      markResultSaved: () => set({ resultSaved: true }),
      clearSession: () => set(initialState),
    }),
    {
      name: 'quiz-session-storage', // Lưu liên tục vào local storage giúp reload trang không bay mất bài
      storage: createJSONStorage(() => localStorage),
    }
  )
);
