
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
  const progress = (remainingSeconds / totalSeconds) * 100;
  
  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  
  // 파이 차트의 각도 계산 (360도에서 남은 시간 비율만큼)
  const angle = (progress / 100) * 360;

  if (!isRunning && !isPaused) {
    return null;
  }

  return (
    <div className="flex flex-col items-center space-y-6 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 text-center">{activity}</h2>
      
      <div className="relative">
        <svg width="200" height="200" className="transform -rotate-90">
          {/* 배경 원 */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="rgb(229, 231, 235)"
            strokeWidth="8"
            fill="none"
          />
          
          {/* 파이 차트 형태의 남은 시간 표시 */}
          <path
            d={`M 100 100 L 100 10 A 90 90 0 ${angle > 180 ? 1 : 0} 1 ${
              100 + 90 * Math.sin((angle * Math.PI) / 180)
            } ${
              100 - 90 * Math.cos((angle * Math.PI) / 180)
            } Z`}
            fill="rgb(59, 130, 246)"
            opacity="0.8"
            className="transition-all duration-1000 ease-in-out"
          />
          
          {/* 외곽선 */}
          <circle
            cx="100"
            cy="100"
            r="90"
            stroke="rgb(59, 130, 246)"
            strokeWidth="2"
            fill="none"
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
