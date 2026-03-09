import { supabase } from '../../lib/supabase';
import type {
  InstructorCreateInput,
  InstructorModel,
  InstructorUpdateInput,
} from '../models/instructorModel';

const TABLE = 'instructors';

export const instructorService = {
  async getAll(): Promise<InstructorModel[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);
    return (data as InstructorModel[]) || [];
  },

  async create(input: InstructorCreateInput): Promise<void> {
    const { hourly_rate: _hourlyRate, ...safeInput } = input;
    const payload = {
      ...safeInput,
      specialization: safeInput.specialization || [],
      courses: [],
    };

    const { error } = await supabase.from(TABLE).insert([payload]);
    if (error) throw new Error(error.message);
  },

  async update(input: InstructorUpdateInput): Promise<void> {
    const { id, ...payload } = input;
    const { hourly_rate: _hourlyRate, ...safePayload } = payload;

    const { error } = await supabase
      .from(TABLE)
      .update({
        ...safePayload,
        specialization: safePayload.specialization || [],
      })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
