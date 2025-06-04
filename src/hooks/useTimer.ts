import { useState, useEffect, useRef } from 'react';
import { ActivityRecord } from '@/components/ActivityLog';

export const useTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [currentActivity, setCurrentActivity] = useState('');
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const playNotificationSound = () => {
    // 더 긴 알림음을 위한 반복 재생
    const beep = () => {
      const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LyvmMeAzuF0vLNeSUGJoTM8NiKOAckccXv4o9EBxhl');
      audio.play().catch(console.error);
    };
    
    // 3번 반복하여 더 긴 알림음 효과
    beep();
    setTimeout(beep, 300);
    setTimeout(beep, 600);
  };

  const startTimer = (activity: string, minutes: number) => {
    setCurrentActivity(activity);
    setTotalMinutes(minutes);
    setRemainingSeconds(minutes * 60);
    setIsRunning(true);
    setIsPaused(false);
    setStartTime(new Date());
  };

  const pauseTimer = () => {
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resumeTimer = () => {
    setIsPaused(false);
  };

  const stopTimer = () => {
    if (startTime) {
      const endTime = new Date();
      const actualMinutes = Math.ceil((endTime.getTime() - startTime.getTime()) / 60000);
      
      const newRecord: ActivityRecord = {
        id: Date.now().toString(),
        activity: currentActivity,
        plannedMinutes: totalMinutes,
        startTime: startTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        endTime: endTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        actualMinutes
      };
      
      setRecords(prev => [newRecord, ...prev]);
    }
    
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(0);
    setCurrentActivity('');
    setTotalMinutes(0);
    setStartTime(null);
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => {
    if (isRunning && !isPaused) {
      intervalRef.current = setInterval(() => {
        setRemainingSeconds(prev => {
          if (prev <= 1) {
            // 타이머 완료 시 더 긴 알림음 재생
            playNotificationSound();
            
            if (startTime) {
              const endTime = new Date();
              const newRecord: ActivityRecord = {
                id: Date.now().toString(),
                activity: currentActivity,
                plannedMinutes: totalMinutes,
                startTime: startTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
                endTime: endTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
                actualMinutes: totalMinutes
              };
              
              setRecords(prevRecords => [newRecord, ...prevRecords]);
            }
            
            setIsRunning(false);
            setIsPaused(false);
            setCurrentActivity('');
            setTotalMinutes(0);
            setStartTime(null);
            
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isPaused, currentActivity, totalMinutes, startTime]);

  return {
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
  };
};
