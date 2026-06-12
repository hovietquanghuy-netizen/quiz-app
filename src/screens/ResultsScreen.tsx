import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore, useHistoryStore, useDeckStore } from '../store';
import { MotionWrapper } from '../components/MotionWrapper';
import { ResultsChart } from '../components/ResultsChart';
import { calculateScore } from '../utils/scorer';
import { Trophy, Clock, Target, ArrowRight, RotateCcw, ListChecks, ChevronDown, ChevronUp } from 'lucide-react';

export const ResultsScreen = () => {
  const navigate = useNavigate();
  const session = useSessionStore();
  const { addResult } = useHistoryStore();
  const { decks } = useDeckStore();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (!session.isConfigured || session.questions.length === 0) {
      navigate('/');
      return;
    }
    // Chốt thời điểm nộp nếu chưa có (vào thẳng /results không qua nút Nộp bài)
    if (!session.finishedAt) {
      session.finishSession();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.isConfigured, session.questions.length, session.finishedAt, navigate]);

  useEffect(() => {
    // resultSaved được persist cùng session nên reload trang không tạo bản ghi trùng
    if (!session.isConfigured || session.questions.length === 0 || !session.finishedAt) return;
    if (session.mode !== 'exam' || session.resultSaved) return;

    const { score, total, wrongIds } = calculateScore(session.questions, session.answers);
    const timeTaken = Math.floor((session.finishedAt - session.startedAt) / 1000);
    const deckName = decks.find(d => d.id === session.deckId)?.name || 'Bài thi không tên';

    addResult({
      deckId: session.deckId,
      deckName: deckName,
      score,
      total,
      timeTaken,
      date: session.finishedAt,
      wrongIds
    });
    session.markResultSaved();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.finishedAt, session.resultSaved, session.isConfigured, addResult, decks]);

  if (!session.isConfigured || session.questions.length === 0) return null;

  const { score, total, wrongIds } = calculateScore(session.questions, session.answers);
  const correctPercent = Math.round((score / total) * 100) || 0;

  let timeStr = '--:--';
  if (session.startedAt && session.finishedAt) {
      const timeTaken = Math.floor((session.finishedAt - session.startedAt) / 1000);
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

      {/* Xem lại chi tiết từng câu */}
      <div className="mb-8">
        <button
          onClick={() => setShowDetails(v => !v)}
          className="w-full bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-sm p-4 flex items-center justify-center gap-2 font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
          <ListChecks className="w-5 h-5 text-primary-500" />
          {showDetails ? 'Ẩn chi tiết bài làm' : `Xem lại chi tiết ${total} câu`}
          {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showDetails && (
          <div className="space-y-4 mt-4">
            {session.questions.map((q, idx) => {
              const ans = session.answers[idx];
              const isCorrect = ans === q.correctIndex;
              return (
                <div key={q.id} className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    <span className="text-xs font-bold bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md">Câu {idx + 1}</span>
                    {isCorrect ? (
                      <span className="text-xs font-bold text-green-700 bg-green-100 dark:text-green-300 dark:bg-green-900/40 px-2.5 py-1 rounded-md">✓ Đúng</span>
                    ) : ans === null ? (
                      <span className="text-xs font-bold text-gray-600 bg-gray-200 dark:text-gray-300 dark:bg-gray-600 px-2.5 py-1 rounded-md">— Chưa trả lời</span>
                    ) : (
                      <span className="text-xs font-bold text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40 px-2.5 py-1 rounded-md">✗ Sai</span>
                    )}
                  </div>
                  <p className="font-medium text-gray-900 dark:text-gray-100 mb-3 leading-relaxed">{q.text}</p>
                  <div className="space-y-2">
                    {q.options.map((opt, optIdx) => {
                      let cls = 'border-gray-100 dark:border-gray-700 text-gray-500 dark:text-gray-400';
                      if (optIdx === q.correctIndex) cls = 'border-green-300 bg-green-50 text-green-800 dark:border-green-800/60 dark:bg-green-900/20 dark:text-green-300 font-medium';
                      else if (optIdx === ans) cls = 'border-red-300 bg-red-50 text-red-800 dark:border-red-800/60 dark:bg-red-900/20 dark:text-red-300 font-medium';
                      return (
                        <div key={optIdx} className={`flex items-start gap-3 p-3 rounded-xl border text-sm ${cls}`}>
                          <span className="font-bold flex-shrink-0">{String.fromCharCode(65 + optIdx)}.</span>
                          <span className="flex-1">{opt.text}</span>
                          {optIdx === q.correctIndex && <span className="text-xs font-bold flex-shrink-0">✓ Đáp án đúng</span>}
                          {optIdx === ans && optIdx !== q.correctIndex && <span className="text-xs font-bold flex-shrink-0">✗ Bạn chọn</span>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        {wrongIds.length > 0 && (
           <button
             onClick={() => {
               const deck = decks.find(d => d.id === session.deckId);
               if (deck) {
                 const wrongQs: typeof session.questions = [];
                 const wrongAns: typeof session.answers = [];

                 session.questions.forEach((q, idx) => {
                   if (wrongIds.includes(q.id)) {
                      wrongQs.push(q);
                      wrongAns.push(session.answers[idx]);
                   }
                 });

                 session.clearSession();
                 session.startSession(deck.id, wrongQs, {
                   mode: 'review',
                   shuffleQuestions: false,
                   shuffleOptions: false,
                   timeLimit: null
                 }, wrongAns);
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
