import type {
  GroupCreateInput,
  GroupUpdateInput,
  GroupWithRelations,
} from '../models/groupModel';
import { groupService } from '../services/groupService';

function validateRequired(input: GroupCreateInput): void {
  if (!input.name?.trim()) throw new Error('Group name is required');
  if (!input.course_id?.trim()) throw new Error('Course is required');
  if (!input.instructor_id?.trim()) throw new Error('Instructor is required');
}

export const groupController = {
  async listCourseOptions() {
    return groupService.getCourseOptions();
  },

  async listInstructorOptions() {
    return groupService.getInstructorOptions();
  },

  async listGroups(): Promise<GroupWithRelations[]> {
    return groupService.getAll();
  },

  async createGroup(input: GroupCreateInput): Promise<void> {
    validateRequired(input);
    return groupService.create(input);
  },

  async updateGroup(input: GroupUpdateInput): Promise<void> {
    if (!input.id) throw new Error('Group id is required');
    validateRequired(input);
    return groupService.update(input);
  },

  async deleteGroup(id: string): Promise<void> {
    if (!id) throw new Error('Group id is required');
    return groupService.remove(id);
  },
};
