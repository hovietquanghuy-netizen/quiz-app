import { describe, it, expect } from 'vitest';
import { calculateScore } from './scorer';
import type { Question } from '../types';

const makeQuestion = (id: string, correctIndex: number): Question => ({
  id,
  text: `Câu ${id}`,
  options: [
    { label: 'A', text: 'a' },
    { label: 'B', text: 'b' },
    { label: 'C', text: 'c' },
    { label: 'D', text: 'd' },
  ],
  correctIndex,
});

describe('calculateScore', () => {
  const questions = [makeQuestion('q1', 0), makeQuestion('q2', 1), makeQuestion('q3', 2)];

  it('đếm đúng số câu chính xác và liệt kê câu sai', () => {
    const { score, total, wrongIds } = calculateScore(questions, [0, 1, 0]);
    expect(score).toBe(2);
    expect(total).toBe(3);
    expect(wrongIds).toEqual(['q3']);
  });

  it('câu chưa trả lời (null) tính là sai', () => {
    const { score, wrongIds } = calculateScore(questions, [0, null, null]);
    expect(score).toBe(1);
    expect(wrongIds).toEqual(['q2', 'q3']);
  });

  it('điểm tuyệt đối khi đúng hết', () => {
    const { score, wrongIds } = calculateScore(questions, [0, 1, 2]);
    expect(score).toBe(3);
    expect(wrongIds).toHaveLength(0);
  });
});
