import { supabase } from '../../lib/supabase';
import type {
  CourseCreateInput,
  CourseRecordView,
  CourseUpdateInput,
} from '../models/courseModel';

const TABLE = 'courses';

export const courseService = {
  async getInstructors() {
    const { data, error } = await supabase
      .from('instructors')
      .select('id, name, surname')
      .eq('status', 'active')
      .order('name');

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getAll(): Promise<CourseRecordView[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select('*, instructors(name, surname)')
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((row: any) => ({
      id: row.id,
      name: row.name,
      code: row.code,
      description: row.description,
      instructor_id: row.instructor_id,
      instructor_name: row.instructors
        ? `${row.instructors.name} ${row.instructors.surname}`
        : 'Unassigned',
      schedule: row.schedule,
      duration: row.duration,
      capacity: Number(row.capacity || 0),
      enrolled: Number(row.enrolled || 0),
      price: Number(row.price || 0),
      status: row.status,
      level: row.level,
      start_date: row.start_date,
      end_date: row.end_date,
    }));
  },

  async create(input: CourseCreateInput): Promise<void> {
    const { error } = await supabase.from(TABLE).insert([
      {
        ...input,
        instructor_id: input.instructor_id || null,
        enrolled: 0,
      },
    ]);

    if (error) throw new Error(error.message);
  },

  async update(input: CourseUpdateInput): Promise<void> {
    const { id, ...payload } = input;

    const { data: existing, error: readError } = await supabase
      .from(TABLE)
      .select('enrolled')
      .eq('id', id)
      .single();

    if (readError) throw new Error(readError.message);

    const { error } = await supabase
      .from(TABLE)
      .update({
        ...payload,
        instructor_id: payload.instructor_id || null,
        enrolled: Number(existing?.enrolled || 0),
      })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
