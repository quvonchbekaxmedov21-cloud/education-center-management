export interface HomeworkRecordView {
  id: string;
  title: string;
  description?: string | null;
  course_id: string;
  course_name: string;
  due_date: string;
  assigned_date: string;
  status: string;
  max_points: number;
}

export interface HomeworkCreateInput {
  course_id: string;
  title: string;
  description?: string | null;
  due_date: string;
  max_points?: number;
}
