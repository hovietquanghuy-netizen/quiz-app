import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore, useHistoryStore, useDeckStore } from '../store';
import { MotionWrapper } from '../components/MotionWrapper';
import { ResultsChart } from '../components/ResultsChart';
import { calculateScore } from '../utils/scorer';
import { Trophy, Clock, Target, ArrowRight, RotateCcw } from 'lucide-react';

export const ResultsScreen = () => {
  const navigate = useNavigate();
  const session = useSessionStore();
  const { addResult } = useHistoryStore();
  const { decks } = useDeckStore();
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (!session.isConfigured || session.questions.length === 0) {
      navigate('/');
      return;
    }

    if (!hasSaved && session.mode === 'exam') {
      const { score, total, wrongIds } = calculateScore(session.questions, session.answers, session.confidence);
      const timeTaken = Math.floor((Date.now() - session.startedAt) / 1000); // seconds
      const deckName = decks.find(d => d.id === session.deckId)?.name || 'Bài thi không tên';

      addResult({
        deckId: session.deckId,
        deckName: deckName,
        score,
        total,
        timeTaken,
        date: Date.now(),
        wrongIds
      });

      setHasSaved(true);
    }
  }, [session, addResult, hasSaved, navigate, decks]);

  if (!session.isConfigured || session.questions.length === 0) return null;

  const { score, total, wrongIds } = calculateScore(session.questions, session.answers, session.confidence);
  const correctPercent = Math.round((score / total) * 100) || 0;
  
  let timeStr = '--:--';
  if (session.startedAt) {
      const timeTaken = Math.floor((Date.now() - session.startedAt) / 1000);
      const m = Math.floor(timeTaken / 60);
      const s = timeTaken % 60;
      timeStr = `${m}p ${s}s`;
  }

  return (
    <MotionWrapper>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold dark:text-white mb-2">Kết quả bài thi</h1>
        <p className="text-gray-500 dark:text-gray-400">Hoàn thành xuất sắc! Dưới đây là thống kê chi tiết của bạn.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center">
          <ResultsChart correct={score} wrong={total - score} />
          <div className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">{correctPercent}%</div>
          <div className="text-sm font-medium text-gray-500 dark:text-gray-400">Tỷ lệ chính xác</div>
        </div>

        <div className="md:col-span-2 grid grid-cols-2 gap-4">
           {/* Stat cards */}
           <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400 rounded-xl"><Target className="w-6 h-6" /></div>
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">Điểm số</div>
             </div>
             <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{score} / {total}</div>
           </div>

           <div className="bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-center">
             <div className="flex items-center gap-3 mb-2">
                <div className="p-3 bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-xl"><Clock className="w-6 h-6" /></div>
                <div className="text-sm font-semibold text-gray-500 dark:text-gray-400">Thời gian</div>
             </div>
             <div className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{timeStr}</div>
           </div>

           <div className="col-span-2 bg-gradient-to-r from-primary-500 to-indigo-600 p-6 rounded-3xl shadow-lg shadow-primary-500/20 text-white flex items-center justify-between">
              <div>
                <div className="font-semibold opacity-90 mb-1 flex items-center gap-2"><Trophy className="w-5 h-5" /> Trạng thái</div>
                <div className="text-2xl font-bold">{correctPercent >= 80 ? 'Xuất sắc!' : correctPercent >= 50 ? 'Khá tốt!' : 'Cần cố gắng!'}</div>
              </div>
              <div className="text-5xl opacity-20 font-black">
                {score}
              </div>
           </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {wrongIds.length > 0 && (
           <button
             onClick={() => {
               const deck = decks.find(d => d.id === session.deckId);
               if (deck) {
                 const wrongQs: typeof session.questions = [];
                 const wrongAns: typeof session.answers = [];
                 const wrongConf: typeof session.confidence = [];

                 session.questions.forEach((q, idx) => {
                   if (wrongIds.includes(q.id)) {
                      wrongQs.push(q);
                      wrongAns.push(session.answers[idx]);
                      wrongConf.push(session.confidence[idx]);
                   }
                 });

                 session.clearSession();
                 session.startSession(deck.id, wrongQs, {
                   mode: 'review',
                   shuffleQuestions: false,
                   shuffleOptions: false,
                   timeLimit: null
                 }, wrongAns, wrongConf);
                 navigate('/quiz');
               }
             }}
             className="flex-1 bg-orange-100 hover:bg-orange-200 text-orange-700 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 dark:text-orange-400 py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
           >
             <Target className="w-5 h-5" /> Ôn lại {wrongIds.length} câu sai
           </button>
        )}
        <button
          onClick={() => {
            session.clearSession();
            navigate(`/config/${session.deckId}`);
          }}
          className="flex-1 bg-white border-2 border-primary-100 text-primary-600 hover:bg-primary-50 dark:bg-gray-800 dark:border-primary-900/50 dark:text-primary-400 dark:hover:bg-primary-900/20 py-4 rounded-2xl font-bold text-lg transition-colors flex items-center justify-center gap-2"
        >
          <RotateCcw className="w-5 h-5" /> Làm lại từ đầu
        </button>
        <button
          onClick={() => {
             session.clearSession();
             navigate('/');
          }}
          className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-4 rounded-2xl font-bold text-lg shadow-lg shadow-primary-600/30 transition-transform active:scale-[0.98] flex items-center justify-center gap-2"
        >
          Về trang chủ <ArrowRight className="w-5 h-5" />
        </button>
      </div>

    </MotionWrapper>
  );
};
