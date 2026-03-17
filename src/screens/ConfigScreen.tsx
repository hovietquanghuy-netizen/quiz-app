import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDeckStore, useSessionStore } from '../store';
import { MotionWrapper } from '../components/MotionWrapper';
import { Play, Settings2, Clock, Shuffle } from 'lucide-react';

export const ConfigScreen = () => {
  const { deckId } = useParams();
  const navigate = useNavigate();
  const deck = useDeckStore(state => state.decks.find(d => d.id === deckId));
  const startSession = useSessionStore(state => state.startSession);

  const [mode, setMode] = useState<'exam' | 'review'>('exam');
  const [shuffleQuestions, setShuffleQuestions] = useState(true);
  const [shuffleOptions, setShuffleOptions] = useState(true);
  
  // Smart timing: 30 seconds per question, convert to minutes and ceil
  const calculateSmartTime = () => Math.ceil((deck?.questions.length || 0) * 30 / 60);
  const [timeLimit, setTimeLimit] = useState<number | ''>(calculateSmartTime());

  if (!deck) {
    return (
      <MotionWrapper>
        <div className="text-center py-20 px-4">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Không tìm thấy bài thi!</h2>
          <button onClick={() => navigate('/')} className="text-primary-600 underline">Quay về trang chủ</button>
        </div>
      </MotionWrapper>
    );
  }

  const handleStart = () => {
    let limitInSeconds = null;
    if (mode === 'exam' && typeof timeLimit === 'number' && timeLimit > 0) {
      limitInSeconds = timeLimit * 60; // phút sang giây
    }

    startSession(deck.id, deck.questions, {
      mode,
      shuffleQuestions,
      shuffleOptions,
      timeLimit: limitInSeconds
    });

    navigate('/quiz');
  };

  return (
    <MotionWrapper>
      <div className="mb-6">
        <button onClick={() => navigate('/')} className="text-sm font-medium text-gray-500 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-200 mb-4 inline-block">
          ← Quay lại
        </button>
        <h1 className="text-2xl font-bold dark:text-white mb-2">{deck.name}</h1>
        <p className="text-gray-500 dark:text-gray-400">{deck.questions.length} câu hỏi trắc nghiệm</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex items-center gap-2 text-gray-700 dark:text-gray-300 font-semibold">
          <Settings2 className="w-5 h-5" />
          Cấu hình phiên làm bài
        </div>
        
        <div className="p-4 sm:p-6 space-y-6">
          {/* Mode */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">Chế độ</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setMode('exam')}
                className={`p-4 rounded-xl border-2 transition-all text-left ${mode === 'exam' ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary-300'}`}
              >
                <div className="font-semibold mb-1">Thi cử (Exam)</div>
                <div className="text-xs opacity-80">Tính điểm, giới hạn thời gian</div>
              </button>
              <button
                onClick={() => setMode('review')}
                className={`p-4 rounded-xl border-2 transition-all text-left ${mode === 'review' ? 'border-primary-500 bg-primary-50 text-primary-700 dark:bg-primary-900/20 dark:text-primary-400' : 'border-gray-200 dark:border-gray-700 text-gray-500 hover:border-primary-300'}`}
              >
                <div className="font-semibold mb-1">Ôn tập (Review)</div>
                <div className="text-xs opacity-80">Thể hiện đáp án tức thì</div>
              </button>
            </div>
          </div>

          {/* Time Limit */}
          {mode === 'exam' && (
            <div>
              <div className="flex items-center justify-between mb-2">
                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                   <Clock className="w-4 h-4" /> Thời gian (phút)
                 </label>
                 <button 
                   onClick={() => setTimeLimit(calculateSmartTime())}
                   className="text-xs font-semibold text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded hover:bg-primary-100 transition-colors"
                 >
                   Gợi ý tự động (30s/câu)
                 </button>
              </div>
              <input
                type="number"
                min="0"
                value={timeLimit}
                onChange={(e) => setTimeLimit(e.target.value ? Number(e.target.value) : '')}
                placeholder="Để trống nếu không giới hạn"
                className="w-full sm:w-1/2 p-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 outline-none block"
              />
            </div>
          )}

          {/* Shuffle */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3 flex items-center gap-2">
              <Shuffle className="w-4 h-4" /> Xáo trộn (Shuffle)
            </label>
            <div className="space-y-4 bg-gray-50 p-4 rounded-xl dark:bg-gray-900/50">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleQuestions}
                  onChange={(e) => setShuffleQuestions(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Xáo trộn vị trí câu hỏi</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={shuffleOptions}
                  onChange={(e) => setShuffleOptions(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-gray-700 dark:text-gray-300">Xáo trộn vị trí các đáp án (A,B,C,D)</span>
              </label>
            </div>
          </div>

        </div>
        
        <div className="p-4 sm:p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <button
            onClick={handleStart}
            className="w-full bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg shadow-primary-600/30 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
            <Play className="w-6 h-6 fill-current" />
            BẮT ĐẦU LÀM BÀI
          </button>
        </div>
      </div>
    </MotionWrapper>
  );
};
