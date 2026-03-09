import type { StudentCreateInput, StudentModel, StudentUpdateInput } from '../models/studentModel';
import { studentService } from '../services/studentService';

function validateRequired(input: StudentCreateInput): void {
  if (!input.name?.trim()) throw new Error('First name is required');
  if (!input.surname?.trim()) throw new Error('Surname is required');
  if (!input.email?.trim()) throw new Error('Email is required');
  if (!input.phone?.trim()) throw new Error('Phone is required');
  if (!input.join_date?.trim()) throw new Error('Enrollment date is required');
}

export const studentController = {
  async listStudents(): Promise<StudentModel[]> {
    return studentService.getAll();
  },

  async createStudent(input: StudentCreateInput): Promise<void> {
    validateRequired(input);
    return studentService.create(input);
  },

  async updateStudent(input: StudentUpdateInput): Promise<void> {
    if (!input.id) throw new Error('Student id is required');
    validateRequired(input);
    return studentService.update(input);
  },

  async deleteStudent(id: string): Promise<void> {
    if (!id) throw new Error('Student id is required');
    return studentService.remove(id);
  },
};
