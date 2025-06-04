
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface ActivityRecord {
  id: string;
  activity: string;
  plannedMinutes: number;
  startTime: string;
  endTime: string;
  actualMinutes: number;
}

interface ActivityLogProps {
  records: ActivityRecord[];
}

const ActivityLog = ({ records }: ActivityLogProps) => {
  const formatMinutesToMMSS = (minutes: number) => {
    const totalSeconds = Math.round(minutes * 60);
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>활동 기록</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500 text-center py-8">아직 기록된 활동이 없습니다.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>활동 기록</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-2 font-medium text-gray-700">무엇을</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">계획시간</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">실제시간</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">시작시간</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">종료시간</th>
              </tr>
            </thead>
            <tbody>
              {records.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-2">{record.activity}</td>
                  <td className="py-3 px-2">{formatMinutesToMMSS(record.plannedMinutes)}</td>
                  <td className="py-3 px-2">
                    <span className={record.actualMinutes < record.plannedMinutes ? 'text-orange-600' : 'text-green-600'}>
                      {formatMinutesToMMSS(record.actualMinutes)}
                    </span>
                  </td>
                  <td className="py-3 px-2">{record.startTime}</td>
                  <td className="py-3 px-2">{record.endTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLog;
