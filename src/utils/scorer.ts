import type { Question } from '../types';

export const calculateScore = (questions: Question[], answers: (number | null)[]) => {
  let score = 0;
  const wrongIds: string[] = [];

  questions.forEach((q, index) => {
    if (answers[index] === q.correctIndex) {
      score++;
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
