import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

// Thời gian còn lại được suy ra từ startedAt thay vì đếm lùi bằng state,
// nên reload trang giữa giờ thi không thể reset đồng hồ.
export const Timer = ({ startedAt, limitInSeconds, onTimeUp }: { startedAt: number, limitInSeconds: number, onTimeUp: () => void }) => {
  const getRemaining = () => Math.max(0, limitInSeconds - Math.floor((Date.now() - startedAt) / 1000));
  const [timeLeft, setTimeLeft] = useState(getRemaining);

  useEffect(() => {
    if (getRemaining() <= 0) {
      onTimeUp();
      return;
    }
    const timer = setInterval(() => {
      const remaining = getRemaining();
      setTimeLeft(remaining);
      if (remaining <= 0) onTimeUp();
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startedAt, limitInSeconds, onTimeUp]);

  const m = Math.floor(timeLeft / 60);
  const s = timeLeft % 60;
  const isWarning = timeLeft < 60;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold ${isWarning ? 'bg-red-100 text-red-700 dark:bg-red-900/30' : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}`}>
      <Clock className="w-4 h-4" />
      {m.toString().padStart(2, '0')}:{s.toString().padStart(2, '0')}
    </div>
  );
}
