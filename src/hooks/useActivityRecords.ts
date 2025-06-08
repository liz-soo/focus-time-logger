
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ActivityRecord } from '@/components/ActivityLog';

export const useActivityRecords = () => {
  const [records, setRecords] = useState<ActivityRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // DB에서 기록 가져오기
  const fetchRecords = async () => {
    try {
      const { data, error } = await supabase
        .from('activity_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching records:', error);
        return;
      }

      // DB 데이터를 ActivityRecord 형식으로 변환
      const formattedRecords: ActivityRecord[] = data.map(record => ({
        id: record.id,
        activity: record.activity,
        plannedMinutes: record.planned_minutes,
        actualMinutes: record.actual_minutes,
        startTime: new Date(record.start_time).toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        endTime: new Date(record.end_time).toLocaleTimeString('ko-KR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }));

      setRecords(formattedRecords);
    } catch (error) {
      console.error('Error in fetchRecords:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // DB에 기록 저장
  const saveRecord = async (record: Omit<ActivityRecord, 'id' | 'startTime' | 'endTime'> & {
    startTime: Date;
    endTime: Date;
  }) => {
    try {
      const { error } = await supabase
        .from('activity_records')
        .insert({
          activity: record.activity,
          planned_minutes: record.plannedMinutes,
          actual_minutes: record.actualMinutes,
          start_time: record.startTime.toISOString(),
          end_time: record.endTime.toISOString()
        });

      if (error) {
        console.error('Error saving record:', error);
        return false;
      }

      // 저장 후 다시 가져오기
      await fetchRecords();
      return true;
    } catch (error) {
      console.error('Error in saveRecord:', error);
      return false;
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return {
    records,
    isLoading,
    saveRecord,
    refetch: fetchRecords
  };
};
