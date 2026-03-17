import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSessionStore } from '../store';
import { MotionWrapper } from '../components/MotionWrapper';
import { QuestionCard } from '../components/QuestionCard';
import { Timer } from '../components/Timer';
import { ChevronLeft, ChevronRight, Check } from 'lucide-react';

export const QuizScreen = () => {
  const navigate = useNavigate();
  const session = useSessionStore();
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!session.isConfigured || session.questions.length === 0) {
      navigate('/');
    }
  }, [session.isConfigured, session.questions.length, navigate]);

  if (!session.isConfigured || session.questions.length === 0) return null;

  const question = session.questions[currentIndex];
  const isLast = currentIndex === session.questions.length - 1;
  const isFirst = currentIndex === 0;

  const handleNext = () => !isLast && setCurrentIndex(curr => curr + 1);
  const handlePrev = () => !isFirst && setCurrentIndex(curr => curr - 1);

  const handleSubmit = () => {
    if (window.confirm('Bạn có chắc chắn muốn nộp bài?')) {
      navigate(`/results/${session.deckId}`);
    }
  };

  const handleTimeUp = () => {
    alert('Đã hết thời gian làm bài!');
    navigate(`/results/${session.deckId}`);
  };

  const renderNavDots = () => {
    return (
      <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 p-4 bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 mt-6 overflow-hidden">
        {session.questions.map((_, idx) => {
          const isAns = session.answers[idx] !== null;
          const isFlag = session.flagged[idx];
          const isCurr = currentIndex === idx;

          let colorClass = 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400';
          if (isCurr) colorClass = 'ring-2 ring-primary-500 bg-primary-100 text-primary-700 dark:bg-primary-900/50';
          else if (isFlag) colorClass = 'bg-orange-100 text-orange-600 dark:bg-orange-900/30';
          else if (isAns) colorClass = 'bg-primary-500 text-white dark:bg-primary-600';

          return (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`w-full aspect-square flex items-center justify-center rounded-lg text-xs font-bold transition-all hover:scale-105 ${colorClass}`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>
    );
  };

  return (
    <MotionWrapper className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <button onClick={() => {
            if(window.confirm('Bạn muốn huỷ phiên thi này?')) {
                session.clearSession();
                navigate('/');
            }
        }} className="text-gray-500 hover:text-gray-900 dark:hover:text-gray-100 text-sm font-medium">
          Huỷ thi
        </button>
        {session.timeLimit !== null && (
          <Timer limitInSeconds={session.timeLimit} onTimeUp={handleTimeUp} />
        )}
      </div>

      <QuestionCard 
        question={question} 
        currentIndex={currentIndex} 
        total={session.questions.length} 
        mode={session.mode}
        selectedAnswer={session.answers[currentIndex]}
        onSelectAnswer={(optIdx) => session.setAnswer(currentIndex, optIdx)}
        isFlagged={session.flagged[currentIndex]}
        onToggleFlag={() => session.toggleFlag(currentIndex)}
      />

      <div className="flex items-center justify-between mt-8">
        <button 
          onClick={handlePrev} 
          disabled={isFirst}
          className="flex items-center gap-2 px-5 py-3 rounded-xl font-medium text-gray-700 bg-white border border-gray-200 shadow-sm disabled:opacity-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" /> Trước
        </button>

        {isLast ? (
          <button 
            onClick={handleSubmit} 
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-green-500 hover:bg-green-600 shadow-sm shadow-green-500/30 transition-colors"
          >
            Nộp bài <Check className="w-5 h-5" />
          </button>
        ) : (
          <button 
            onClick={handleNext} 
            className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white bg-primary-600 hover:bg-primary-700 shadow-sm shadow-primary-600/30 transition-colors"
          >
            Tiếp <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {renderNavDots()}

    </MotionWrapper>
  );
};
