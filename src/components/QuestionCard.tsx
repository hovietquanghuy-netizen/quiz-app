import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;
  currentIndex: number;
  total: number;
  mode: 'exam' | 'review';
  selectedAnswer: number | null;
  onSelectAnswer: (index: number) => void;
  isFlagged: boolean;
  onToggleFlag: () => void;
}

export const QuestionCard = ({
  question,
  currentIndex,
  total,
  mode,
  selectedAnswer,
  onSelectAnswer,
  isFlagged,
  onToggleFlag
}: QuestionCardProps) => {

  const getOptionClass = (index: number) => {
    if (mode === 'review' && selectedAnswer !== null) {
      if (index === question.correctIndex) return 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400';
      if (index === selectedAnswer && index !== question.correctIndex) return 'border-red-500 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400';
    }
    
    if (index === selectedAnswer) return 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400 ring-2 ring-primary-500/20';
    
    return 'border-gray-200 dark:border-gray-700 hover:border-primary-300 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300';
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex justify-between items-center">
        <span className="font-semibold text-gray-500 dark:text-gray-400">Câu {currentIndex + 1} / {total}</span>
        <button 
          onClick={onToggleFlag}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${isFlagged ? 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}
        >
          {isFlagged ? 'Đã gắn cờ' : 'Gắn cờ xem lại'}
        </button>
      </div>

      <div className="p-4 sm:p-6 sm:py-8">
        <h3 className="text-xl font-medium text-gray-900 dark:text-gray-100 mb-8 leading-relaxed">
          {question.text}
        </h3>

        <div className="space-y-3">
          {question.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => onSelectAnswer(idx)}
              className={`w-full text-left p-4 rounded-xl border-2 transition-all flex items-start gap-4 ${getOptionClass(idx)}`}
            >
              <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex items-start gap-4">
                  <span className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-bold flex-shrink-0 ${selectedAnswer === idx ? 'bg-primary-600 text-white dark:bg-primary-500' : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'}`}>
                    {opt.label}
                  </span>
                  <span className="mt-1 leading-normal">{opt.text}</span>
                </div>
                
                {/* Labels for Review mode */}
                {mode === 'review' && selectedAnswer !== null && (
                  <div className="ml-0 sm:ml-auto mt-2 sm:mt-0 flex gap-2 flex-wrap">
                    {idx === question.correctIndex && (
                      <span className="text-xs font-bold text-green-700 bg-green-200 dark:text-green-300 dark:bg-green-900/60 px-2.5 py-1 rounded-md">
                        ✓ Đáp án đúng
                      </span>
                    )}
                    {idx === selectedAnswer && idx !== question.correctIndex && (
                      <span className="text-xs font-bold text-red-700 bg-red-200 dark:text-red-300 dark:bg-red-900/60 px-2.5 py-1 rounded-md">
                        ✗ Lựa chọn của bạn
                      </span>
                    )}
                  </div>
                )}
              </div>
            </button>
          ))}
        </div>
        
        {mode === 'review' && selectedAnswer !== null && (
           <div className={`mt-6 p-5 rounded-2xl border-2 flex items-center gap-4 transition-all ${selectedAnswer === question.correctIndex ? 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800/50 dark:text-green-400' : 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800/50 dark:text-red-400'}`}>
             <span className="text-3xl">{selectedAnswer === question.correctIndex ? '🎉' : '💡'}</span>
             <div>
               <p className="font-bold text-lg mb-0.5">{selectedAnswer === question.correctIndex ? 'Chính xác!' : 'Chưa chính xác!'}</p>
               <p className="text-sm opacity-90">{selectedAnswer === question.correctIndex ? 'Tuyệt vời, bạn có trí nhớ rất tốt ở câu hỏi này.' : `Đừng buồn, hãy ghi nhớ thật kỹ lại đáp án đúng phía trên nhé.`}</p>
             </div>
           </div>
        )}
      </div>
    </div>
  );
};
