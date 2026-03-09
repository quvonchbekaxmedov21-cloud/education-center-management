import type { AttendanceCreateInput, AttendanceRecordView } from '../models/attendanceModel';
import { attendanceService } from '../services/attendanceService';

export const attendanceController = {
  async listCourses() {
    return attendanceService.getCourses();
  },

  async listStudentsForCourse(courseId: string) {
    if (!courseId) throw new Error('Course is required');
    return attendanceService.getStudentsByCourse(courseId);
  },

  async listRecords(courseId: string, date: string): Promise<AttendanceRecordView[]> {
    if (!courseId) throw new Error('Course is required');
    if (!date) throw new Error('Date is required');
    return attendanceService.getByDateAndCourse(courseId, date);
  },

  async mark(input: AttendanceCreateInput): Promise<void> {
    if (!input.student_id) throw new Error('Student is required');
    if (!input.course_id) throw new Error('Course is required');
    if (!input.date) throw new Error('Date is required');
    return attendanceService.upsert(input);
  },
};
