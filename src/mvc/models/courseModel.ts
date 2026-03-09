export type CourseStatus = 'active' | 'completed' | 'upcoming';

export interface CourseRecordView {
  id: string;
  name: string;
  code: string;
  description?: string | null;
  instructor_id?: string | null;
  instructor_name: string;
  schedule?: string | null;
  duration?: string | null;
  capacity: number;
  enrolled: number;
  price?: number;
  status: CourseStatus;
  level?: string | null;
  start_date?: string | null;
  end_date?: string | null;
}

export interface CourseCreateInput {
  name: string;
  code: string;
  instructor_id?: string | null;
  schedule?: string | null;
  duration?: string | null;
  capacity: number;
  price?: number;
  status: CourseStatus;
  level?: string | null;
}

export interface CourseUpdateInput extends CourseCreateInput {
  id: string;
}
