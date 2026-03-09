import { supabase } from '../../lib/supabase';
import type {
  AttendanceCreateInput,
  AttendanceRecordView,
  AttendanceStatus,
} from '../models/attendanceModel';

export const attendanceService = {
  async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('id, name, level')
      .eq('status', 'active')
      .order('name');

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getStudentsByCourse(courseId: string) {
    const { data, error } = await supabase
      .from('course_enrollments')
      .select('students(id, name, surname, email)')
      .eq('course_id', courseId)
      .eq('status', 'active');

    if (error) throw new Error(error.message);

    return (data || [])
      .map((row: any) => row.students)
      .filter(Boolean);
  },

  async getByDateAndCourse(courseId: string, date: string): Promise<AttendanceRecordView[]> {
    const { data, error } = await supabase
      .from('attendance')
      .select(`
        id,
        student_id,
        course_id,
        date,
        status,
        students (name, surname),
        courses (name)
      `)
      .eq('course_id', courseId)
      .eq('date', date)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((row: any) => ({
      id: row.id,
      student_id: row.student_id,
      student_name: `${row.students?.name || ''} ${row.students?.surname || ''}`.trim(),
      course_id: row.course_id,
      course_name: row.courses?.name || 'Unknown Course',
      date: row.date,
      status: row.status as AttendanceStatus,
    }));
  },

  async upsert(input: AttendanceCreateInput): Promise<void> {
    const { data: existing, error: readError } = await supabase
      .from('attendance')
      .select('id')
      .eq('student_id', input.student_id)
      .eq('course_id', input.course_id)
      .eq('date', input.date)
      .maybeSingle();

    if (readError) throw new Error(readError.message);

    if (existing?.id) {
      const { error: updateError } = await supabase
        .from('attendance')
        .update({ status: input.status, notes: input.notes || null })
        .eq('id', existing.id);
      if (updateError) throw new Error(updateError.message);
      return;
    }

    const { error } = await supabase.from('attendance').insert([{ ...input }]);
    if (error) throw new Error(error.message);
  },
};
