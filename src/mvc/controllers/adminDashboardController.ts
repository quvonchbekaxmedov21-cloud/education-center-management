import type { AdminDashboardData } from '../models/adminDashboardModel';
import { adminDashboardService } from '../services/adminDashboardService';

export const adminDashboardController = {
  async getDashboard(): Promise<AdminDashboardData> {
    return adminDashboardService.getDashboardData();
  },
};
