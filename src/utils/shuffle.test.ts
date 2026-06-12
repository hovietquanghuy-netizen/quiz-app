import { describe, it, expect } from 'vitest';
import { shuffleArray } from './shuffle';

describe('shuffleArray', () => {
  it('giữ nguyên đủ phần tử, không làm mất hay nhân bản', () => {
    const input = [1, 2, 3, 4, 5, 6, 7, 8];
    const result = shuffleArray(input);
    expect(result).toHaveLength(input.length);
    expect([...result].sort((a, b) => a - b)).toEqual(input);
  });

  it('không thay đổi mảng gốc', () => {
    const input = [1, 2, 3];
    const snapshot = [...input];
    shuffleArray(input);
    expect(input).toEqual(snapshot);
  });

  it('ánh xạ lại correctIndex chính xác khi trộn options theo index', () => {
    // Mô phỏng logic trộn đáp án trong sessionStore, kể cả khi có 2 đáp án trùng text
    const options = [
      { label: 'A', text: 'trùng nhau' },
      { label: 'B', text: 'trùng nhau' },
      { label: 'C', text: 'đáp án đúng' },
      { label: 'D', text: 'khác' },
    ];
    const correctIndex = 2;
    for (let run = 0; run < 50; run++) {
      const order = shuffleArray(options.map((_, i) => i));
      const shuffled = order.map(i => options[i]);
      const newCorrectIndex = order.indexOf(correctIndex);
      expect(shuffled[newCorrectIndex].text).toBe('đáp án đúng');
    }
  });
});
