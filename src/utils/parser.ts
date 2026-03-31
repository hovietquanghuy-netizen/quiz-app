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
  // Chuẩn hoá khoảng trắng thừa, giữ lại xuống dòng, loại bỏ ký tự rỗng của Word
  const normalizedText = text.replace(/\r\n/g, '\n').replace(/\t/g, ' ').replace(/\u00A0/g, ' ').trim();
  if (!normalizedText) throw new Error('Văn bản trống');

  let blocks: string[] = [];
  
  // 1. Phân tách câu hỏi cực kỳ ưu tiên các keyword bắt đầu câu
  const questionPattern = /(?:^|\n)(Câu\s*\d+[\.\:\-\)]?\s*|Bài\s*\d+[\.\:\-\)]?\s*|\d+[\.\:\-\)]\s+)/i;
  
  if (questionPattern.test(normalizedText)) {
      const parts = normalizedText.split(questionPattern);
      let currentBlock = parts[0].trim();
      // Nếu phần đầu tiên chứa đáp án, thì giữ lại
      if (currentBlock && /(?:^|\s|\n)[A-H][\.\)]/i.test(currentBlock)) {
          blocks.push(currentBlock);
      }
      for (let i = 1; i < parts.length; i += 2) {
          const prefix = parts[i];
          const content = parts[i+1] || "";
          blocks.push((prefix + content).trim());
      }
  } else if (/\n\s*\n/.test(normalizedText)) {
      // Nếu phân tách rõ ràng bằng dòng trống kép
      blocks = normalizedText.split(/\n\s*\n/).filter(b => b.trim() !== '');
  } else {
      // Trường hợp vỡ format hoàn toàn (không có Câu 1, không có dòng trắng kép)
      const lines = normalizedText.split('\n').map(l => l.trim()).filter(l => l !== '');
      let currentBlock = "";
      for (const line of lines) {
          const isOptionLine = /^[A-H][.\)]/i.test(line);
          const hasOptionB = /(?:^|\s|\n)[B-H][\.\)]/i.test(currentBlock);
          
          if (!isOptionLine && currentBlock && hasOptionB && line.length > 5) {
              // Sang câu mới nếu dòng này không giống 1 lựa chọn và mảng câu cũ đã ít nhất có B trở đi.
              blocks.push(currentBlock.trim());
              currentBlock = line;
          } else {
              currentBlock += (currentBlock ? "\n" : "") + line;
          }
      }
      if (currentBlock) blocks.push(currentBlock.trim());
  }

  const parsedQuestions: Question[] = [];
  let errorMessages: string[] = [];

  blocks.forEach((block, index) => {
    // Ép cục text về 1 dòng dài dồi dào khoảng trắng chuẩn
    let processedBlock = block.replace(/\n/g, '  ').replace(/\s+/g, ' ');
    
    // Tìm vị trí các đáp án (ví dụ A. B. C. hoặc A) B) C) ) 
    // FIXED: Bỏ (?:\s+|$) ở cuối để hỗ trợ A.2% hoặc A.Phía trước, B.Benzocaine...
    const optionFormatRegex = /(?:^|\s)([A-H])[\.\)]/gi;
    
    const matches = [...processedBlock.matchAll(optionFormatRegex)];
    let optIndices: Record<string, { start: number, length: number }> = {};
    
    // Đè ghi đè ở cuối: Để chống lỗi "Vitamin A. " (sẽ match A lần đầu), ưu tiên lấy pattern A cuối cùng
    for (const match of matches) {
       const letter = match[1].toUpperCase();
       optIndices[letter] = {
           start: match.index !== undefined ? match.index + (match[0].startsWith(' ') ? 1 : 0) : 0,
           length: match[0].trim().length
       };
    }
    
    if (!optIndices['A']) {
         errorMessages.push(`Bỏ qua câu ${index + 1} vì không tìm thấy đáp án phân cách A.`);
         return; 
    }
    
    const qText = processedBlock.substring(0, optIndices['A'].start).trim();
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const rawOptions = [];
    
    for (let i = 0; i < letters.length; i++) {
        const currentLetter = letters[i];
        if (optIndices[currentLetter]) {
            const startStr = optIndices[currentLetter].start + optIndices[currentLetter].length;
            
            let endStr = processedBlock.length;
            for (let j = i + 1; j < letters.length; j++) {
                if (optIndices[letters[j]]) {
                    endStr = optIndices[letters[j]].start;
                    if (processedBlock[endStr - 1] === ' ') endStr--;
                    break;
                }
            }
            rawOptions.push(processedBlock.substring(startStr, endStr).trim());
        }
    }

    if (rawOptions.length < 2) {
       errorMessages.push(`Bỏ qua câu bị thiếu đáp án: "${qText.substring(0, 30)}..."`);
       return;
    }

    let correctIndex = -1;
    const finalOptions = rawOptions.map((opt, i) => {
       // Bắt cụm từ đánh dấu đáp án đúng phổ biến từ word
       if (/\((correct|đáp án|đúng|v|x|_)\)/i.test(opt) || /\[(correct|đáp án|đúng|v|x|_)\]/i.test(opt)) {
          correctIndex = i;
          return opt.replace(/\(?(correct|đáp án|đúng|v|x|_)\)?/gi, '').replace(/\[?(correct|đáp án|đúng|v|x|_)\]?/gi, '').trim();
       }
       if (/\*$/.test(opt.trim()) || /^\*/.test(opt.trim())) {
           correctIndex = i;
           return opt.trim().replace(/^\*/, '').replace(/\*$/, '').trim();
       }
       return opt.trim();
    });

    if (correctIndex === -1) {
      // Word mất highlight -> AI parser mặc định đáp án đầu tiên thay vì bỏ rơi
      correctIndex = 0; 
    }

    const A_CHAR_CODE = 65;
    parsedQuestions.push({
      id: uuidv4(),
      text: qText,
      options: finalOptions.map((optText, i) => ({
        label: String.fromCharCode(A_CHAR_CODE + i),
        text: optText
      })),
      correctIndex
    });
  });

  if (parsedQuestions.length === 0) {
      throw new Error(errorMessages.join('\n') || 'Hoàn toàn không tìm thấy câu hỏi hợp lệ. Đảm bảo bạn có định dạng A. B. C. D.');
  }

  return {
    id: uuidv4(),
    name: title || 'Bài thi tổng hợp',
    questions: parsedQuestions,
    createdAt: Date.now()
  };
};
