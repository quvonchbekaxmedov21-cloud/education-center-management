import { supabase } from '../../lib/supabase';
import type { StudentCreateInput, StudentModel, StudentUpdateInput } from '../models/studentModel';

const TABLE = 'students';

export const studentService = {
  async getAll(): Promise<StudentModel[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as StudentModel[]) || [];
  },

  async create(input: StudentCreateInput): Promise<void> {
    const payload = {
      ...input,
      enrolled_courses: [],
    };

    const { error } = await supabase.from(TABLE).insert([payload]);
    if (error) throw new Error(error.message);
  },

  async update(input: StudentUpdateInput): Promise<void> {
    const { id, ...payload } = input;

    const { error } = await supabase
      .from(TABLE)
      .update(payload)
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
