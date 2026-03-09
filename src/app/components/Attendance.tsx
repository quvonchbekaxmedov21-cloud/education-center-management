import { useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockAttendance, mockGroups, mockStudents, type AttendanceRecord } from '../lib/mockData';
import { toast } from 'sonner';

export function Attendance() {
  const [attendance, setAttendance] = useState<AttendanceRecord[]>(mockAttendance);
  const [selectedGroup, setSelectedGroup] = useState<string>('all');
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);

  const filteredAttendance = selectedGroup === 'all'
    ? attendance
    : attendance.filter(a => a.groupId === selectedGroup);

  const group = selectedGroup !== 'all' ? mockGroups.find(g => g.id === selectedGroup) : null;
  const studentsInGroup = group ? mockStudents.filter(s => group.students.includes(s.id)) : [];

  const markAttendance = (studentId: string, status: 'present' | 'absent' | 'late') => {
    const existing = attendance.find(a => a.studentId === studentId && a.date === selectedDate);
    
    if (existing) {
      setAttendance(attendance.map(a => 
        a.id === existing.id ? { ...a, status } : a
      ));
    } else {
      const student = mockStudents.find(s => s.id === studentId);
      const newRecord: AttendanceRecord = {
        id: String(Date.now()),
        studentId,
        studentName: `${student?.name} ${student?.surname}`,
        groupId: selectedGroup,
        date: selectedDate,
        status
      };
      setAttendance([...attendance, newRecord]);
    }
    toast.success('Attendance marked');
  };

  const getAttendanceStatus = (studentId: string) => {
    return attendance.find(a => a.studentId === studentId && a.date === selectedDate);
  };

  const stats = {
    present: attendance.filter(a => a.status === 'present' && a.date === selectedDate).length,
    absent: attendance.filter(a => a.status === 'absent' && a.date === selectedDate).length,
    late: attendance.filter(a => a.status === 'late' && a.date === selectedDate).length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Attendance</h2>
          <p className="text-slate-600 mt-1">Track student attendance</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Present</p>
                <p className="text-2xl font-semibold mt-1">{stats.present}</p>
              </div>
              <CheckCircle className="size-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Absent</p>
                <p className="text-2xl font-semibold mt-1">{stats.absent}</p>
              </div>
              <XCircle className="size-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Late</p>
                <p className="text-2xl font-semibold mt-1">{stats.late}</p>
              </div>
              <Clock className="size-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Mark Attendance</CardTitle>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <CalendarIcon className="size-4 text-slate-600" />
                <span className="text-sm text-slate-600">{selectedDate}</span>
              </div>
              <Select value={selectedGroup} onValueChange={setSelectedGroup}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select group" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Groups</SelectItem>
                  {mockGroups.map(group => (
                    <SelectItem key={group.id} value={group.id}>
                      {group.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {selectedGroup !== 'all' && studentsInGroup.length > 0 ? (
            <div className="space-y-3">
              {studentsInGroup.map(student => {
                const attendanceRecord = getAttendanceStatus(student.id);
                return (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {(student.name[0] + student.surname[0]).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{student.name} {student.surname}</div>
                        <div className="text-sm text-slate-600">{student.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        variant={attendanceRecord?.status === 'present' ? 'default' : 'outline'}
                        onClick={() => markAttendance(student.id, 'present')}
                      >
                        <CheckCircle className="size-4 mr-2" />
                        Present
                      </Button>
                      <Button
                        size="sm"
                        variant={attendanceRecord?.status === 'late' ? 'default' : 'outline'}
                        onClick={() => markAttendance(student.id, 'late')}
                      >
                        <Clock className="size-4 mr-2" />
                        Late
                      </Button>
                      <Button
                        size="sm"
                        variant={attendanceRecord?.status === 'absent' ? 'destructive' : 'outline'}
                        onClick={() => markAttendance(student.id, 'absent')}
                      >
                        <XCircle className="size-4 mr-2" />
                        Absent
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-600">
              {selectedGroup === 'all' ? 'Select a group to mark attendance' : 'No students in this group'}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {filteredAttendance.slice(0, 10).map(record => (
              <div key={record.id} className="flex items-center justify-between p-3 border rounded hover:bg-slate-50">
                <div>
                  <div className="font-medium">{record.studentName}</div>
                  <div className="text-sm text-slate-600">{record.date}</div>
                </div>
                <span className={`px-3 py-1 rounded text-sm ${
                  record.status === 'present' ? 'bg-green-100 text-green-700' :
                  record.status === 'late' ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {record.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
