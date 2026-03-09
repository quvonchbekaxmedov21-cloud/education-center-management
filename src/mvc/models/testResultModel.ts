export type TestType = 'weekly' | 'monthly' | 'mock' | 'placement';

export interface TestResultRecordView {
  id: string;
  student_id: string;
  student_name: string;
  course_id: string;
  course_name: string;
  test_name: string;
  test_type: TestType;
  score: number;
  max_score: number;
  date: string;
  remarks?: string | null;
}

export interface TestResultCreateInput {
  student_id: string;
  course_id: string;
  test_name: string;
  test_type: TestType;
  score: number;
  max_score: number;
  date: string;
  remarks?: string | null;
}
