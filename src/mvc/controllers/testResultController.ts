import type { TestResultCreateInput, TestResultRecordView } from '../models/testResultModel';
import { testResultService } from '../services/testResultService';

export const testResultController = {
  async listStudents() {
    return testResultService.getStudents();
  },

  async listCourses() {
    return testResultService.getCourses();
  },

  async listTestResults(): Promise<TestResultRecordView[]> {
    return testResultService.getAll();
  },

  async createTestResult(input: TestResultCreateInput): Promise<void> {
    if (!input.student_id) throw new Error('Student is required');
    if (!input.course_id) throw new Error('Course is required');
    if (!input.test_name?.trim()) throw new Error('Test name is required');
    if (input.max_score <= 0) throw new Error('Max score must be greater than zero');
    return testResultService.create(input);
  },
};
