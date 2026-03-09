export interface PlacementTestRecordView {
  id: string;
  student_name: string;
  student_email?: string | null;
  test_date: string;
  level?: string | null;
  score?: number | null;
  recommended_course?: string | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string | null;
}

export interface PlacementTestCreateInput {
  student_name: string;
  student_email?: string | null;
  test_date: string;
  level?: string | null;
  score?: number | null;
  recommended_course?: string | null;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string | null;
}
