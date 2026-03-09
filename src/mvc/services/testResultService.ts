import { supabase } from '../../lib/supabase';
import type { TestResultCreateInput, TestResultRecordView } from '../models/testResultModel';

export const testResultService = {
  async getStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('id, name, surname')
      .order('name');

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('id, name, code')
      .order('name');

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getAll(): Promise<TestResultRecordView[]> {
    const { data, error } = await supabase
      .from('test_results')
      .select('id, student_id, course_id, test_name, score, max_score, date, remarks, students(name, surname), courses(name)')
      .order('date', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((row: any) => {
      const name = (row.test_name || '').toLowerCase();
      const testType = name.includes('weekly')
        ? 'weekly'
        : name.includes('monthly')
          ? 'monthly'
          : name.includes('placement')
            ? 'placement'
            : 'mock';

      return {
        id: row.id,
        student_id: row.student_id,
        student_name: `${row.students?.name || ''} ${row.students?.surname || ''}`.trim(),
        course_id: row.course_id,
        course_name: row.courses?.name || 'Unknown Course',
        test_name: row.test_name,
        test_type: testType,
        score: Number(row.score || 0),
        max_score: Number(row.max_score || 100),
        date: row.date,
        remarks: row.remarks,
      } as TestResultRecordView;
    });
  },

  async create(input: TestResultCreateInput): Promise<void> {
    const { test_type, ...rest } = input;
    const payload = {
      ...rest,
      test_name: `${test_type.toUpperCase()} - ${rest.test_name}`,
    };

    const { error } = await supabase.from('test_results').insert([payload]);
    if (error) throw new Error(error.message);
  },
};
