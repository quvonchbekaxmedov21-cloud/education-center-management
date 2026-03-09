import type { HomeworkCreateInput, HomeworkRecordView } from '../models/homeworkModel';
import { homeworkService } from '../services/homeworkService';

export const homeworkController = {
  async listCourses() {
    return homeworkService.getCourses();
  },

  async listHomework(): Promise<HomeworkRecordView[]> {
    return homeworkService.getAll();
  },

  async createHomework(input: HomeworkCreateInput): Promise<void> {
    if (!input.course_id) throw new Error('Course is required');
    if (!input.title?.trim()) throw new Error('Title is required');
    if (!input.due_date) throw new Error('Due date is required');
    return homeworkService.create(input);
  },
};
