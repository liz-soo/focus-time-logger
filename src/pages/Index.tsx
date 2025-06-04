
import React from 'react';
import TimerForm from '@/components/TimerForm';
import CircularTimer from '@/components/CircularTimer';
import ActivityLog from '@/components/ActivityLog';
import { useTimer } from '@/hooks/useTimer';

const Index = () => {
  const {
    isRunning,
    isPaused,
    remainingSeconds,
    currentActivity,
    totalMinutes,
    records,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer
  } = useTimer();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">포모도로 타이머</h1>
          <p className="text-gray-600">집중력을 높이고 생산성을 향상시켜보세요</p>
        </div>
        
        {/* 상단 2단 구조: 타이머 설정 폼(좌측)과 원형 타이머(우측) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="flex justify-center">
            <div className="w-full max-w-md">
              <TimerForm 
                onStartTimer={startTimer}
                isTimerRunning={isRunning}
              />
            </div>
          </div>
          
          <div className="flex justify-center">
            {/* 타이머가 실행 중일 때만 표시 */}
            {(isRunning || isPaused) && (
              <CircularTimer
                activity={currentActivity}
                totalMinutes={totalMinutes}
                remainingSeconds={remainingSeconds}
                isRunning={isRunning}
                isPaused={isPaused}
                onPlay={resumeTimer}
                onPause={pauseTimer}
                onStop={stopTimer}
              />
            )}
          </div>
        </div>
        
        {/* 활동 기록을 하단에 배치 */}
        <div className="w-full">
          <ActivityLog records={records} />
        </div>
      </div>
    </div>
  );
};

export default Index;
