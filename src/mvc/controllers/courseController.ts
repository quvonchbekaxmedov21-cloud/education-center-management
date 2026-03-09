import type {
  CourseCreateInput,
  CourseRecordView,
  CourseUpdateInput,
} from '../models/courseModel';
import { courseService } from '../services/courseService';

function validate(input: CourseCreateInput): void {
  if (!input.name?.trim()) throw new Error('Course name is required');
  if (!input.code?.trim()) throw new Error('Course code is required');
  if (!input.capacity || input.capacity <= 0) throw new Error('Capacity must be greater than zero');
  if (input.price < 0) throw new Error('Price cannot be negative');
}

export const courseController = {
  async listInstructors() {
    return courseService.getInstructors();
  },

  async listCourses(): Promise<CourseRecordView[]> {
    return courseService.getAll();
  },

  async createCourse(input: CourseCreateInput): Promise<void> {
    validate(input);
    return courseService.create(input);
  },

  async updateCourse(input: CourseUpdateInput): Promise<void> {
    if (!input.id) throw new Error('Course id is required');
    validate(input);
    return courseService.update(input);
  },

  async deleteCourse(id: string): Promise<void> {
    if (!id) throw new Error('Course id is required');
    return courseService.remove(id);
  },
};
