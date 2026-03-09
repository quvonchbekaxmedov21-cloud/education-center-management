import type { PlacementTestCreateInput, PlacementTestRecordView } from '../models/placementTestModel';
import { placementTestService } from '../services/placementTestService';

export const placementTestController = {
  async listPlacementTests(): Promise<PlacementTestRecordView[]> {
    return placementTestService.getAll();
  },

  async createPlacementTest(input: PlacementTestCreateInput): Promise<void> {
    if (!input.student_name?.trim()) throw new Error('Student name is required');
    if (!input.test_date) throw new Error('Test date is required');
    return placementTestService.create(input);
  },
};
