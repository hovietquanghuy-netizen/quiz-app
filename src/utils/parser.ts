import type { Question, Deck } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const parseDeck = (jsonData: any): Deck => {
  if (!jsonData || typeof jsonData !== 'object') {
    throw new Error('Định dạng JSON không hợp lệ');
  }

  if (!jsonData.name || typeof jsonData.name !== 'string') {
    throw new Error('Bài thi (Deck) cần phải có thuộc tính "name"');
  }

  if (!Array.isArray(jsonData.questions)) {
    throw new Error('Bài thi cần phải có một mảng "questions"');
  }

  const parsedQuestions: Question[] = jsonData.questions.map((q: any, index: number) => {
    if (!q.text || typeof q.text !== 'string') {
      throw new Error(`Câu hỏi ở vị trí ${index + 1} thiếu nội dung "text"`);
    }

    if (!Array.isArray(q.options) || q.options.length < 2) {
      throw new Error(`Câu hỏi ở vị trí ${index + 1} phải có ít nhất 2 đáp án (options)`);
    }

    if (q.correctIndex === undefined || typeof q.correctIndex !== 'number' || q.correctIndex < 0 || q.correctIndex >= q.options.length) {
      throw new Error(`Câu hỏi ở vị trí ${index + 1} có "correctIndex" không hợp lệ`);
    }

    const A_CHAR_CODE = 65;
    return {
      id: uuidv4(),
      text: q.text,
      options: q.options.map((opt: any, optIdx: number) => ({
        label: String.fromCharCode(A_CHAR_CODE + optIdx), // Tạo label dạng A, B, C, D...
        text: typeof opt === 'string' ? opt : String(opt)
      })),
      correctIndex: q.correctIndex
    };
  });

  return {
    id: uuidv4(),
    name: jsonData.name,
    questions: parsedQuestions,
    createdAt: Date.now()
  };
};

export const parseTextToDeck = (text: string, title: string): Deck => {
  const lines = text.split('\n').filter(line => line.trim() !== '');
  if (lines.length === 0) throw new Error('Văn bản trống');

  const parsedQuestions: Question[] = lines.map((line, index) => {
    const aIdx = line.indexOf('A.');
    if (aIdx === -1) throw new Error(`Dòng ${index + 1} không thấy đáp án "A." (Vui lòng tuân thủ định dạng A. B. C.)`);
    
    // Tìm vị trí các đáp án
    const bIdx = line.indexOf('B.', aIdx);
    const cIdx = line.indexOf('C.', bIdx !== -1 ? bIdx : aIdx);
    const dIdx = line.indexOf('D.', cIdx !== -1 ? cIdx : (bIdx !== -1 ? bIdx : aIdx));

    const qText = line.substring(0, aIdx).trim();
    
    const optA = line.substring(aIdx + 2, bIdx !== -1 ? bIdx : line.length).trim();
    const optB = bIdx !== -1 ? line.substring(bIdx + 2, cIdx !== -1 ? cIdx : line.length).trim() : null;
    const optC = cIdx !== -1 ? line.substring(cIdx + 2, dIdx !== -1 ? dIdx : line.length).trim() : null;
    const optD = dIdx !== -1 ? line.substring(dIdx + 2, line.length).trim() : null;

    const rawOptions = [optA, optB, optC, optD].filter(Boolean) as string[];

    if (rawOptions.length < 2) {
       throw new Error(`Dòng ${index + 1} bị lỗi format (Phải có ít nhất 2 đáp án A. và B.)`);
    }

    let correctIndex = -1;
    const finalOptions = rawOptions.map((opt, i) => {
      // Check for (Correct) or (correct)
      if (opt.toLowerCase().includes('(correct)')) {
        correctIndex = i;
        return opt.replace(/\(?correct\)?/gi, '').trim();
      }
      return opt;
    });

    if (correctIndex === -1) {
      throw new Error(`Dòng ${index + 1} chưa đánh dấu "(Correct)" ở bất kì đáp án nào.`);
    }

    const A_CHAR_CODE = 65;
    return {
      id: uuidv4(),
      text: qText,
      options: finalOptions.map((optText, i) => ({
        label: String.fromCharCode(A_CHAR_CODE + i),
        text: optText
      })),
      correctIndex
    };
  });

  return {
    id: uuidv4(),
    name: title || 'Bài thi từ văn bản',
    questions: parsedQuestions,
    createdAt: Date.now()
  };
};
