import type { ScheduleItemView } from '../models/scheduleModel';
import { scheduleService } from '../services/scheduleService';

export const scheduleController = {
  async listSchedule(): Promise<ScheduleItemView[]> {
    return scheduleService.getSchedule();
  },
};
