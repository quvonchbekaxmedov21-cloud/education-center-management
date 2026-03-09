export type AttendanceStatus = 'present' | 'absent' | 'late' | 'excused';

export interface AttendanceModel {
  id: string;
  student_id: string;
  course_id: string;
  date: string;
  status: AttendanceStatus;
  notes?: string | null;
  created_at?: string;
}

export interface AttendanceCreateInput {
  student_id: string;
  course_id: string;
  date: string;
  status: AttendanceStatus;
  notes?: string | null;
}

export interface AttendanceRecordView {
  id: string;
  student_id: string;
  student_name: string;
  course_id: string;
  course_name: string;
  date: string;
  status: AttendanceStatus;
}
