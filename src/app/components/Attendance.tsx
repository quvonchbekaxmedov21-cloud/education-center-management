import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, CheckCircle, XCircle, Clock } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { attendanceController } from '../../mvc/controllers/attendanceController';
import type { AttendanceRecordView, AttendanceStatus } from '../../mvc/models/attendanceModel';
import { toast } from 'sonner';

export function Attendance() {
  const [courses, setCourses] = useState<Array<{ id: string; name: string; level?: string }>>([]);
  const [studentsInCourse, setStudentsInCourse] = useState<Array<{ id: string; name: string; surname: string; email?: string }>>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecordView[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>('');
  const [selectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadCourses();
  }, []);

  useEffect(() => {
    if (!selectedCourse) {
      setStudentsInCourse([]);
      setAttendanceRecords([]);
      return;
    }
    void loadCourseData(selectedCourse);
  }, [selectedCourse]);

  const loadCourses = async () => {
    try {
      const data = await attendanceController.listCourses();
      setCourses(data as Array<{ id: string; name: string; level?: string }>);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load courses');
    } finally {
      setLoading(false);
    }
  };

  const loadCourseData = async (courseId: string) => {
    try {
      const [students, records] = await Promise.all([
        attendanceController.listStudentsForCourse(courseId),
        attendanceController.listRecords(courseId, selectedDate),
      ]);
      setStudentsInCourse(students as Array<{ id: string; name: string; surname: string; email?: string }>);
      setAttendanceRecords(records);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load attendance data');
    }
  };

  const markAttendance = async (studentId: string, status: AttendanceStatus) => {
    if (!selectedCourse) return;

    try {
      await attendanceController.mark({
        student_id: studentId,
        course_id: selectedCourse,
        date: selectedDate,
        status,
      });
      toast.success('Attendance marked');
      await loadCourseData(selectedCourse);
    } catch (error: any) {
      toast.error(error.message || 'Failed to mark attendance');
    }
  };

  const getAttendanceStatus = (studentId: string) => {
    return attendanceRecords.find(a => a.student_id === studentId && a.date === selectedDate);
  };

  const stats = {
    present: attendanceRecords.filter(a => a.status === 'present' && a.date === selectedDate).length,
    absent: attendanceRecords.filter(a => a.status === 'absent' && a.date === selectedDate).length,
    late: attendanceRecords.filter(a => a.status === 'late' && a.date === selectedDate).length,
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
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id}>
                      {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-12 text-slate-600">Loading attendance...</div>
          ) : selectedCourse && studentsInCourse.length > 0 ? (
            <div className="space-y-3">
              {studentsInCourse.map(student => {
                const attendanceRecord = getAttendanceStatus(student.id);
                return (
                  <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                        {(student.name[0] + student.surname[0]).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{student.name} {student.surname}</div>
                        <div className="text-sm text-slate-600">{student.email || 'No email'}</div>
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
              {!selectedCourse ? 'Select a course to mark attendance' : 'No active students in this course'}
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
            {attendanceRecords.slice(0, 10).map(record => (
              <div key={record.id} className="flex items-center justify-between p-3 border rounded hover:bg-slate-50">
                <div>
                  <div className="font-medium">{record.student_name}</div>
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
