
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
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">포모도로 타이머</h1>
          <p className="text-gray-600">집중력을 높이고 생산성을 향상시켜보세요</p>
        </div>
        
        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-6">
            <TimerForm 
              onStartTimer={startTimer}
              isTimerRunning={isRunning}
            />
            
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
          </div>
          
          <div>
            <ActivityLog records={records} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
