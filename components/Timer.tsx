
import React, { useState, useEffect } from 'react';

interface TimerProps {
  initialTime: number;
  onTimeUp: () => void;
  isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ initialTime, onTimeUp, isActive }) => {
  const [timeLeft, setTimeLeft] = useState(initialTime);

  useEffect(() => {
    if (!isActive) return;
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timeLeft, isActive, onTimeUp]);

  const percentage = (timeLeft / initialTime) * 100;
  const colorClass = timeLeft < 15 ? 'bg-red-500' : 'bg-green-500';

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between items-center mb-1 text-sm font-medium">
        <span className="text-slate-600">Tempo restante</span>
        <span className={timeLeft < 15 ? 'text-red-500 font-bold' : 'text-slate-700'}>
          {timeLeft}s
        </span>
      </div>
      <div className="w-full bg-slate-200 rounded-full h-2">
        <div 
          className={`h-2 rounded-full transition-all duration-1000 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default Timer;
