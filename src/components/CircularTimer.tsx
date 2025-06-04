
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';

interface CircularTimerProps {
  activity: string;
  totalMinutes: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  onPlay: () => void;
  onPause: () => void;
  onStop: () => void;
}

const CircularTimer = ({
  activity,
  totalMinutes,
  remainingSeconds,
  isRunning,
  isPaused,
  onPlay,
  onPause,
  onStop
}: CircularTimerProps) => {
  const totalSeconds = totalMinutes * 60;
  const elapsedSeconds = totalSeconds - remainingSeconds;
  const progress = (elapsedSeconds / totalSeconds) * 100;
  
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  
  const circumference = 2 * Math.PI * 90;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  if (!isRunning && !isPaused) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 text-center">{activity}</h2>
      
      <div className="relative">
        <svg width="200" height="200" className="transform -rotate-90">
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="rgb(229, 231, 235)"
            strokeWidth="8"
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="rgb(59, 130, 246)"
            strokeWidth="8"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-in-out"
          />
        </svg>
        
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="text-3xl font-bold text-gray-800">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-sm text-gray-500 mt-1">
            {totalMinutes}분 중
          </div>
        </div>
      </div>
      
      <div className="flex space-x-4">
        {isPaused ? (
          <Button onClick={onPlay} className="bg-green-600 hover:bg-green-700">
            <Play size={20} />
            재시작
          </Button>
        ) : (
          <Button onClick={onPause} className="bg-yellow-600 hover:bg-yellow-700">
            <Pause size={20} />
            일시정지
          </Button>
        )}
        
        <Button onClick={onStop} variant="destructive">
          <Square size={20} />
          정지
        </Button>
      </div>
    </div>
  );
};

export default CircularTimer;
