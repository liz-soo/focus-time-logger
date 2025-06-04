
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

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
  const exportCsv = () => {
    const header = ['무엇을', '계획시간', '실제시간', '시작시간', '종료시간'];
    const rows = records.map(r => [r.activity, r.plannedMinutes, r.actualMinutes.toFixed(2), r.startTime, r.endTime]);
    const csv = [header.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'records.csv';
    link.click();
    URL.revokeObjectURL(url);
  };
  const formatMinutesToMMSS = (minutes: number) => {
    const mins = Math.floor(minutes);
    const secs = Math.round((minutes - mins) * 60);
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  if (records.length === 0) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>활동 기록</CardTitle>
            <Button size="sm" variant="outline" onClick={exportCsv}>CSV 다운로드</Button>
          </div>
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
        <div className="flex items-center justify-between">
          <CardTitle>활동 기록</CardTitle>
          <Button size="sm" variant="outline" onClick={exportCsv}>CSV 다운로드</Button>
        </div>
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
