import { supabase } from '../../lib/supabase';
import type {
  GroupCreateInput,
  GroupModel,
  GroupUpdateInput,
  GroupWithRelations,
} from '../models/groupModel';

const TABLE = 'groups';

export const groupService = {
  async getCourseOptions() {
    const { data, error } = await supabase
      .from('courses')
      .select('id, name, level')
      .order('name');

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getInstructorOptions() {
    const { data, error } = await supabase
      .from('instructors')
      .select('id, name, surname')
      .eq('status', 'active')
      .order('name');

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getAll(): Promise<GroupWithRelations[]> {
    const { data, error } = await supabase
      .from(TABLE)
      .select(`
        *,
        courses (name, level),
        instructors (name, surname)
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((item: any) => ({
      ...(item as GroupModel),
      course_name: item.courses?.name,
      course_level: item.courses?.level,
      instructor_name: item.instructors
        ? `${item.instructors.name} ${item.instructors.surname}`
        : undefined,
    }));
  },

  async create(input: GroupCreateInput): Promise<void> {
    const payload = {
      ...input,
      students: [],
      capacity: input.capacity || 0,
    };

    const { error } = await supabase.from(TABLE).insert([payload]);
    if (error) throw new Error(error.message);
  },

  async update(input: GroupUpdateInput): Promise<void> {
    const { id, ...payload } = input;

    const { error } = await supabase
      .from(TABLE)
      .update({
        ...payload,
        capacity: payload.capacity || 0,
      })
      .eq('id', id);

    if (error) throw new Error(error.message);
  },

  async remove(id: string): Promise<void> {
    const { error } = await supabase.from(TABLE).delete().eq('id', id);
    if (error) throw new Error(error.message);
  },
};
