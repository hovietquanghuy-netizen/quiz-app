import { useState, useEffect } from 'react';
import { Clock } from 'lucide-react';

export const Timer = ({ limitInSeconds, onTimeUp }: { limitInSeconds: number, onTimeUp: () => void }) => {
  const [timeLeft, setTimeLeft] = useState(limitInSeconds);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onTimeUp]);

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
