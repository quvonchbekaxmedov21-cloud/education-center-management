import { supabase } from '../../lib/supabase';
import type { ScheduleItemView } from '../models/scheduleModel';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

function parseDays(schedule?: string | null): string[] {
  if (!schedule) return ['Monday'];
  const normalized = schedule.toLowerCase();

  const matches = DAYS.filter((day) => normalized.includes(day.toLowerCase()));
  if (matches.length > 0) return matches;

  if (normalized.includes('mon')) return ['Monday'];
  if (normalized.includes('tue')) return ['Tuesday'];
  if (normalized.includes('wed')) return ['Wednesday'];
  if (normalized.includes('thu')) return ['Thursday'];
  if (normalized.includes('fri')) return ['Friday'];
  if (normalized.includes('sat')) return ['Saturday'];
  if (normalized.includes('sun')) return ['Sunday'];

  return ['Monday'];
}

function parseTime(schedule?: string | null): string {
  if (!schedule) return 'Time TBA';
  const timeMatch = schedule.match(/(\d{1,2}:\d{2}\s?(?:AM|PM|am|pm)?(?:\s?-\s?\d{1,2}:\d{2}\s?(?:AM|PM|am|pm)?)?)/);
  return timeMatch ? timeMatch[1] : schedule;
}

export const scheduleService = {
  async getSchedule(): Promise<ScheduleItemView[]> {
    const { data, error } = await supabase
      .from('courses')
      .select('id, name, schedule, duration, room, instructors(name, surname)')
      .eq('status', 'active')
      .order('name');

    if (error) throw new Error(error.message);

    const items: ScheduleItemView[] = [];

    for (const row of data || []) {
      const days = parseDays(row.schedule);
      const time = parseTime(row.schedule);

      for (const day of days) {
        items.push({
          id: `${row.id}-${day}`,
          course_name: row.name,
          instructor_name: row.instructors
            ? `${(row.instructors as any).name} ${(row.instructors as any).surname}`
            : 'Unassigned',
          day,
          time,
          room: row.room || 'Room TBA',
          duration: row.duration || 'N/A',
        });
      }
    }

    return items;
  },
};
