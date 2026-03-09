import { supabase } from '../../lib/supabase';
import type { HomeworkCreateInput, HomeworkRecordView } from '../models/homeworkModel';

export const homeworkService = {
  async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('id, name, level')
      .order('name');

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getAll(): Promise<HomeworkRecordView[]> {
    const { data, error } = await supabase
      .from('homework')
      .select('id, title, description, course_id, due_date, assigned_date, status, max_points, courses(name)')
      .order('assigned_date', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((row: any) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      course_id: row.course_id,
      course_name: row.courses?.name || 'Unknown Course',
      due_date: row.due_date,
      assigned_date: row.assigned_date,
      status: row.status,
      max_points: Number(row.max_points || 100),
    }));
  },

  async create(input: HomeworkCreateInput): Promise<void> {
    const payload = {
      ...input,
      assigned_date: new Date().toISOString().split('T')[0],
      status: 'assigned',
      max_points: input.max_points || 100,
    };

    const { error } = await supabase.from('homework').insert([payload]);
    if (error) throw new Error(error.message);
  },
};
