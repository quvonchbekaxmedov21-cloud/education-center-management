import type {
  InstructorCreateInput,
  InstructorModel,
  InstructorUpdateInput,
} from '../models/instructorModel';
import { instructorService } from '../services/instructorService';

function validateRequired(input: InstructorCreateInput): void {
  if (!input.name?.trim()) throw new Error('First name is required');
  if (!input.surname?.trim()) throw new Error('Surname is required');
  if (!input.email?.trim()) throw new Error('Email is required');
  if (!input.join_date?.trim()) throw new Error('Join date is required');
}

export const instructorController = {
  async listInstructors(): Promise<InstructorModel[]> {
    return instructorService.getAll();
  },

  async createInstructor(input: InstructorCreateInput): Promise<void> {
    validateRequired(input);
    return instructorService.create(input);
  },

  async updateInstructor(input: InstructorUpdateInput): Promise<void> {
    if (!input.id) throw new Error('Instructor id is required');
    validateRequired(input);
    return instructorService.update(input);
  },

  async deleteInstructor(id: string): Promise<void> {
    if (!id) throw new Error('Instructor id is required');
    return instructorService.remove(id);
  },
};
