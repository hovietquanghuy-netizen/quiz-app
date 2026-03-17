import type { Question } from '../types';

export const calculateScore = (questions: Question[], answers: (number | null)[], confidence?: ('sure' | 'guess' | null)[]) => {
  let score = 0;
  const wrongIds: string[] = [];

  questions.forEach((q, index) => {
    if (answers[index] === q.correctIndex) {
      score++;
      // Nếu đúng nhưng là "đoán" thì vẫn cho vào danh sách ôn tập
      if (confidence && confidence[index] === 'guess') {
        if (!wrongIds.includes(q.id)) wrongIds.push(q.id);
      }
    } else {
      if (!wrongIds.includes(q.id)) wrongIds.push(q.id);
    }
  });

  return {
    score,
    total: questions.length,
    wrongIds
  };
};
