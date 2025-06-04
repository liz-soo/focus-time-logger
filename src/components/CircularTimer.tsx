
import React from 'react';
import { Button } from '@/components/ui/button';
import { Play, Pause, Square } from 'lucide-react';

interface CircularTimerProps {
  activity: string;
  totalMinutes: number;
  remainingSeconds: number;
  isRunning: boolean;
  isPaused: boolean;
  isCompleted?: boolean;
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
  isCompleted = false,
  onPlay,
  onPause,
  onStop
}: CircularTimerProps) => {
  const totalSeconds = totalMinutes * 60;
  const progress = (remainingSeconds / totalSeconds) * 100;
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // 파이 차트의 각도 계산 (12시 방향에서 시작)
  const angle = (progress / 100) * 360;

  if (!isRunning && !isPaused && !isCompleted) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-8 bg-white rounded-2xl shadow-2xl border border-gray-100">
      <h2 className="text-2xl font-bold text-gray-800 text-center">{activity}</h2>
      
      <div className="relative">
        <svg width="240" height="240" className="transform -rotate-90 drop-shadow-lg">
          {/* 배경 원 */}
          <circle
            cx="120"
            cy="120"
            r="100"
            stroke="rgb(243, 244, 246)"
            strokeWidth="12"
            fill="none"
          />
          
          {/* 파이 차트 형태의 남은 시간 표시 (12시 방향에서 시작) */}
          <path
            d={`M 120 120 L 120 20 A 100 100 0 ${angle > 180 ? 1 : 0} 1 ${
              120 + 100 * Math.sin((angle * Math.PI) / 180)
            } ${
              120 - 100 * Math.cos((angle * Math.PI) / 180)
            } Z`}
            fill="url(#gradient)"
            className="transition-all duration-1000 ease-in-out"
          />
          
          {/* 그라디언트 정의 */}
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="rgb(59, 130, 246)" />
              <stop offset="100%" stopColor="rgb(37, 99, 235)" />
            </linearGradient>
          </defs>
          
          {/* 외곽선 */}
          <circle
            cx="120"
            cy="120"
            r="100"
            stroke="rgb(59, 130, 246)"
            strokeWidth="3"
            fill="none"
          />
        </svg>
      </div>
      
      <div className="text-center space-y-2">
        <div className="text-sm text-gray-500 font-medium">
          전체 {totalMinutes}분
        </div>
        <div className="text-lg font-mono text-gray-700">
          남은 시간: {formatTime(remainingSeconds)}
        </div>
      </div>
      
      <div className="flex space-x-4">
        {isCompleted ? (
          <div className="flex items-center text-green-700 font-semibold text-lg">완료!</div>
        ) : isPaused ? (
          <Button onClick={onPlay} className="bg-green-600 hover:bg-green-700 px-6 py-3 text-lg">
            <Play size={24} className="mr-2" />
            재시작
          </Button>
        ) : (
          <Button onClick={onPause} className="bg-yellow-600 hover:bg-yellow-700 px-6 py-3 text-lg">
            <Pause size={24} className="mr-2" />
            일시정지
          </Button>
        )}
        
        <Button onClick={onStop} variant="destructive" className="px-6 py-3 text-lg">
          <Square size={24} className="mr-2" />
          정지
        </Button>
      </div>
    </div>
  );
};

export default CircularTimer;
