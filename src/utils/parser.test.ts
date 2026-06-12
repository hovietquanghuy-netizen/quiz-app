import { describe, it, expect } from 'vitest';
import { parseDeck, parseTextToDeck, extractJsonFromText } from './parser';

const validJson = {
  name: 'Đề mẫu',
  questions: [
    { text: 'Câu hỏi 1?', options: ['a', 'b', 'c', 'd'], correctIndex: 2 },
    { text: 'Câu hỏi 2?', options: ['x', 'y'], correctIndex: 0 },
  ],
};

describe('parseDeck', () => {
  it('parse JSON hợp lệ, gán label A/B/C/D theo thứ tự', () => {
    const deck = parseDeck(validJson);
    expect(deck.name).toBe('Đề mẫu');
    expect(deck.questions).toHaveLength(2);
    expect(deck.questions[0].options.map(o => o.label)).toEqual(['A', 'B', 'C', 'D']);
    expect(deck.questions[0].correctIndex).toBe(2);
  });

  it('báo lỗi khi thiếu name', () => {
    expect(() => parseDeck({ questions: [] })).toThrow('"name"');
  });

  it('báo lỗi khi questions không phải mảng', () => {
    expect(() => parseDeck({ name: 'x', questions: 'abc' })).toThrow('"questions"');
  });

  it('báo lỗi khi correctIndex vượt ngoài options', () => {
    expect(() =>
      parseDeck({ name: 'x', questions: [{ text: 'q', options: ['a', 'b'], correctIndex: 5 }] })
    ).toThrow('correctIndex');
  });
});

describe('extractJsonFromText', () => {
  const json = JSON.stringify(validJson);

  it('nhận JSON thuần', () => {
    const result = extractJsonFromText(json) as typeof validJson;
    expect(result.questions).toHaveLength(2);
  });

  it('nhận JSON bọc trong fence ```json kèm lời dẫn của AI', () => {
    const input = 'Đây là bộ đề:\n```json\n' + json + '\n```\nChúc ôn tập tốt!';
    const result = extractJsonFromText(input) as typeof validJson;
    expect(result.name).toBe('Đề mẫu');
  });

  it('nhận JSON có lời dẫn nhưng không có fence', () => {
    const input = 'Dưới đây là 2 câu hỏi:\n\n' + json;
    const result = extractJsonFromText(input) as typeof validJson;
    expect(result.questions).toHaveLength(2);
  });

  it('trả null với văn bản thường', () => {
    expect(extractJsonFromText('Câu 1: Hỏi gì? A. một B. hai C. ba D. bốn')).toBeNull();
  });
});

describe('parseTextToDeck', () => {
  it('parse đề chuẩn "Câu N:" với marker (correct)', () => {
    const text = `Câu 1: Thủ đô Việt Nam? A. Huế B. Hà Nội (correct) C. Đà Nẵng D. Sài Gòn
Câu 2: 1+1 bằng mấy? A. 1 B. 3 C. 2 (đúng) D. 4`;
    const { deck, warnings } = parseTextToDeck(text, 'Test');
    expect(deck.questions).toHaveLength(2);
    expect(deck.questions[0].correctIndex).toBe(1);
    expect(deck.questions[0].options[1].text).toBe('Hà Nội');
    expect(deck.questions[1].correctIndex).toBe(2);
    expect(warnings).toHaveLength(0);
  });

  it('nhận marker dấu * ở đầu/cuối đáp án', () => {
    const text = 'Câu 1: Hỏi? A. sai B. đúng* C. sai D. sai';
    const { deck } = parseTextToDeck(text, 'Test');
    expect(deck.questions[0].correctIndex).toBe(1);
    expect(deck.questions[0].options[1].text).toBe('đúng');
  });

  it('hỗ trợ định dạng A) B) C)', () => {
    const text = 'Câu 1: Hỏi? A) một B) hai (correct) C) ba D) bốn';
    const { deck } = parseTextToDeck(text, 'Test');
    expect(deck.questions[0].options).toHaveLength(4);
    expect(deck.questions[0].correctIndex).toBe(1);
  });

  it('hỗ trợ đáp án dính liền kiểu A.2%', () => {
    const text = 'Câu 1: Tỷ lệ bao nhiêu? A.2% (correct) B.5% C.10% D.20%';
    const { deck } = parseTextToDeck(text, 'Test');
    expect(deck.questions[0].options[0].text).toBe('2%');
    expect(deck.questions[0].correctIndex).toBe(0);
  });

  it('cảnh báo khi không có marker đáp án đúng (gán mặc định A)', () => {
    const text = 'Câu 1: Hỏi? A. một B. hai C. ba D. bốn';
    const { deck, warnings } = parseTextToDeck(text, 'Test');
    expect(deck.questions[0].correctIndex).toBe(0);
    expect(warnings.length).toBeGreaterThan(0);
    expect(warnings[0]).toContain('tạm gán đáp án A');
  });

  it('tách câu theo dòng trống kép khi không có "Câu N"', () => {
    const text = `Thủ đô Pháp? A. Paris (correct) B. Lyon C. Nice D. Marseille

Thủ đô Đức? A. Munich B. Berlin (correct) C. Hamburg D. Köln`;
    const { deck } = parseTextToDeck(text, 'Test');
    expect(deck.questions).toHaveLength(2);
    expect(deck.questions[1].correctIndex).toBe(1);
  });

  it('throw khi văn bản trống hoặc không có câu hợp lệ', () => {
    expect(() => parseTextToDeck('   ', 'Test')).toThrow();
    expect(() => parseTextToDeck('chỉ là một đoạn văn không có đáp án nào cả', 'Test')).toThrow();
  });

  it('dùng tên mặc định khi không nhập title', () => {
    const { deck } = parseTextToDeck('Câu 1: Hỏi? A. x (correct) B. y', '');
    expect(deck.name).toBe('Bài thi tổng hợp');
  });
});
