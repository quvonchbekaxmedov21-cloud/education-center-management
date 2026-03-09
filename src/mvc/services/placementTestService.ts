import { supabase } from '../../lib/supabase';
import type { PlacementTestCreateInput, PlacementTestRecordView } from '../models/placementTestModel';

export const placementTestService = {
  async getAll(): Promise<PlacementTestRecordView[]> {
    const { data, error } = await supabase
      .from('placement_tests')
      .select('*')
      .order('test_date', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((row: any) => ({
      id: row.id,
      student_name: row.student_name,
      student_email: row.student_email,
      test_date: row.test_date,
      level: row.level,
      score: row.score != null ? Number(row.score) : null,
      recommended_course: row.recommended_course,
      status: row.status,
      notes: row.notes,
    }));
  },

  async create(input: PlacementTestCreateInput): Promise<void> {
    const { error } = await supabase.from('placement_tests').insert([input]);
    if (error) throw new Error(error.message);
  },
};
