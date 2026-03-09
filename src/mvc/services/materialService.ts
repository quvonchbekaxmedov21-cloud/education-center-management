import { supabase } from '../../lib/supabase';
import type { MaterialCreateInput, MaterialRecordView } from '../models/materialModel';

export const materialService = {
  async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('id, name, level')
      .order('name');

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getAll(): Promise<MaterialRecordView[]> {
    const { data, error } = await supabase
      .from('materials')
      .select('id, course_id, title, description, file_url, file_type, uploaded_date, courses(name)')
      .order('uploaded_date', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((row: any) => ({
      id: row.id,
      course_id: row.course_id,
      course_name: row.courses?.name || 'Unknown Course',
      title: row.title,
      description: row.description,
      file_url: row.file_url,
      file_type: row.file_type,
      uploaded_date: row.uploaded_date,
    }));
  },

  async create(input: MaterialCreateInput): Promise<void> {
    const { error } = await supabase.from('materials').insert([
      {
        ...input,
        uploaded_date: new Date().toISOString().split('T')[0],
      },
    ]);

    if (error) throw new Error(error.message);
  },
};
