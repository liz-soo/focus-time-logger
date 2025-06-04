
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface TimerFormProps {
  onStartTimer: (activity: string, minutes: number) => void;
  isTimerRunning: boolean;
}

const TimerForm = ({ onStartTimer, isTimerRunning }: TimerFormProps) => {
  const [activity, setActivity] = useState('');
  const [minutes, setMinutes] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activity.trim() && minutes && parseInt(minutes) > 0) {
      onStartTimer(activity.trim(), parseInt(minutes));
      setActivity('');
      setMinutes('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-lg">
      <div className="space-y-2">
        <Label htmlFor="activity">무엇을 하시겠습니까?</Label>
        <Input
          id="activity"
          type="text"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          placeholder="예: 논문 편집하기"
          disabled={isTimerRunning}
          className="w-full"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="minutes">몇 분 동안 하시겠습니까?</Label>
        <Input
          id="minutes"
          type="number"
          min="1"
          max="180"
          value={minutes}
          onChange={(e) => setMinutes(e.target.value)}
          placeholder="예: 25"
          disabled={isTimerRunning}
          className="w-full"
        />
      </div>
      
      <Button 
        type="submit" 
        disabled={!activity.trim() || !minutes || parseInt(minutes) <= 0 || isTimerRunning}
        className="w-full bg-blue-600 hover:bg-blue-700"
      >
        타이머 시작
      </Button>
    </form>
  );
};

export default TimerForm;
