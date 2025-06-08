
import { useState, useEffect, useRef } from 'react';

export const useEnhancedTimer = (onSaveRecord: (record: any) => Promise<boolean>) => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [currentActivity, setCurrentActivity] = useState('');
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [pausedTime, setPausedTime] = useState(0); // 일시정지된 총 시간
  const [isCompleted, setIsCompleted] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);
  const pauseStartTimeRef = useRef<Date | null>(null);

  const playNotificationSound = () => {
    if (!alarmRef.current) {
      const audio = new Audio(
        'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+LyvmMeAzuF0vLNeSUGJoTM8NiKOAckccXv4o9EBxhl'
      );
      audio.loop = true;
      audio.play().catch(console.error);
      alarmRef.current = audio;
    }
  };

  const stopNotificationSound = () => {
    if (alarmRef.current) {
      alarmRef.current.pause();
      alarmRef.current.currentTime = 0;
      alarmRef.current = null;
    }
  };

  const handleTimerComplete = async () => {
    if (!startTime) return;
    
    playNotificationSound();
    
    const endTime = new Date();
    await onSaveRecord({
      activity: currentActivity,
      plannedMinutes: totalMinutes,
      actualMinutes: totalMinutes, // 완료 시에는 계획 시간과 동일
      startTime,
      endTime
    });

    setIsRunning(false);
    setIsPaused(false);
    setIsCompleted(true);
    setRemainingSeconds(0);
    setPausedTime(0);
    setStartTime(null);
  };

  const startTimer = (activity: string, minutes: number) => {
    stopNotificationSound();
    setIsCompleted(false);
    setCurrentActivity(activity);
    setTotalMinutes(minutes);
    setRemainingSeconds(minutes * 60);
    setIsRunning(true);
    setIsPaused(false);
    setPausedTime(0);
    setStartTime(new Date());
  };

  const pauseTimer = () => {
    setIsPaused(true);
    pauseStartTimeRef.current = new Date();
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  const resumeTimer = () => {
    if (pauseStartTimeRef.current) {
      const pauseDuration = Math.floor((new Date().getTime() - pauseStartTimeRef.current.getTime()) / 1000);
      setPausedTime(prev => prev + pauseDuration);
      pauseStartTimeRef.current = null;
    }
    setIsPaused(false);
  };

  const stopTimer = async () => {
    stopNotificationSound();
    setIsCompleted(false);
    
    if (startTime) {
      const endTime = new Date();
      let actualElapsed = Math.floor((endTime.getTime() - startTime.getTime()) / 1000) - pausedTime;
      
      // 일시정지 중이었다면 현재까지의 일시정지 시간도 추가
      if (isPaused && pauseStartTimeRef.current) {
        const currentPauseDuration = Math.floor((endTime.getTime() - pauseStartTimeRef.current.getTime()) / 1000);
        actualElapsed -= currentPauseDuration;
      }
      
      await onSaveRecord({
        activity: currentActivity,
        plannedMinutes: totalMinutes,
        actualMinutes: Math.max(0, actualElapsed / 60), // 분 단위로 변환
        startTime,
        endTime
      });
    }
    
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(0);
    setPausedTime(0);
    setCurrentActivity('');
    setTotalMinutes(0);
    setStartTime(null);
    pauseStartTimeRef.current = null;
    
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  // 메인 타이머 interval 효과
  useEffect(() => {
    if (isRunning && !isPaused && startTime) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000) - pausedTime;
        const remaining = totalMinutes * 60 - elapsed;

        if (remaining <= 0) {
          handleTimerComplete();
        } else {
          setRemainingSeconds(remaining);
        }
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
  }, [isRunning, isPaused, startTime, totalMinutes, pausedTime]);

  // visibilitychange 이벤트 처리 (별도 useEffect)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // 탭이 숨겨질 때
        console.log('Tab hidden - timer running in background');
      } else {
        // 탭이 다시 보일 때
        if (isRunning && !isPaused && startTime) {
          console.log('Tab visible - syncing timer');
          // 실제 경과 시간을 다시 계산
          const now = new Date();
          const actualElapsed = Math.floor((now.getTime() - startTime.getTime()) / 1000) - pausedTime;
          const remaining = totalMinutes * 60 - actualElapsed;
          
          if (remaining <= 0) {
            // 백그라운드에서 완료된 경우
            handleTimerComplete();
          } else {
            setRemainingSeconds(remaining);
          }
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning, isPaused, startTime, totalMinutes, pausedTime]);

  return {
    isRunning,
    isPaused,
    isCompleted,
    remainingSeconds,
    currentActivity,
    totalMinutes,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer
  };
};
