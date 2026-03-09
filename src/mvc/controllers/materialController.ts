import type { MaterialCreateInput, MaterialRecordView } from '../models/materialModel';
import { materialService } from '../services/materialService';

export const materialController = {
  async listCourses() {
    return materialService.getCourses();
  },

  async listMaterials(): Promise<MaterialRecordView[]> {
    return materialService.getAll();
  },

  async createMaterial(input: MaterialCreateInput): Promise<void> {
    if (!input.course_id) throw new Error('Course is required');
    if (!input.title?.trim()) throw new Error('Title is required');
    if (!input.file_url?.trim()) throw new Error('File URL is required');
    return materialService.create(input);
  },
};
