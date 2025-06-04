
import { useState, useEffect, useRef } from 'react';
import { ActivityRecord } from '@/components/ActivityLog';

export const useTimer = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [currentActivity, setCurrentActivity] = useState('');
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [prevElapsed, setPrevElapsed] = useState(0);
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [isCompleted, setIsCompleted] = useState(false);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const alarmRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem('activity_records');
    if (stored) {
      try {
        setRecords(JSON.parse(stored));
      } catch {
        // ignore
      }
    }
  }, []);

  useEffect(() => {
    if (records.length > 0) {
      localStorage.setItem('activity_records', JSON.stringify(records));
    }
  }, [records]);

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

  const startTimer = (activity: string, minutes: number) => {
    stopNotificationSound();
    setIsCompleted(false);
    setCurrentActivity(activity);
    setTotalMinutes(minutes);
    setRemainingSeconds(minutes * 60);
    setElapsedSeconds(0);
    setPrevElapsed(0);
    setIsRunning(true);
    setIsPaused(false);
    setStartTime(new Date());
  };

  const pauseTimer = () => {
    if (startTime) {
      setPrevElapsed(prev => prev + Math.floor((Date.now() - startTime.getTime()) / 1000));
    }
    setIsPaused(true);
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    setStartTime(null);
  };

  const resumeTimer = () => {
    setStartTime(new Date());
    setIsPaused(false);
  };

  const stopTimer = () => {
    stopNotificationSound();
    setIsCompleted(false);
    if (startTime || prevElapsed > 0) {
      const endTime = new Date();
      const elapsed = prevElapsed + (startTime ? Math.floor((Date.now() - startTime.getTime()) / 1000) : 0);
      const newRecord: ActivityRecord = {
        id: Date.now().toString(),
        activity: currentActivity,
        plannedMinutes: totalMinutes,
        startTime: (startTime ?? endTime).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        endTime: endTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
        actualMinutes: elapsed / 60
      };

      setRecords(prev => [newRecord, ...prev]);
    }
    
    setIsRunning(false);
    setIsPaused(false);
    setRemainingSeconds(0);
    setElapsedSeconds(0);
    setPrevElapsed(0);
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
        if (!startTime) return;
        const elapsed = prevElapsed + Math.floor((Date.now() - startTime.getTime()) / 1000);
        const remaining = totalMinutes * 60 - elapsed;

        if (remaining <= 0) {
          playNotificationSound();

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

          setIsRunning(false);
          setIsPaused(false);
          setIsCompleted(true);
          setElapsedSeconds(0);
          setPrevElapsed(0);
          setStartTime(null);
          setRemainingSeconds(0);
        } else {
          setElapsedSeconds(elapsed);
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
  }, [isRunning, isPaused, currentActivity, totalMinutes, startTime, prevElapsed]);

  return {
    isRunning,
    isPaused,
    isCompleted,
    remainingSeconds,
    elapsedSeconds,
    currentActivity,
    totalMinutes,
    records,
    startTimer,
    pauseTimer,
    resumeTimer,
    stopTimer
  };
};
