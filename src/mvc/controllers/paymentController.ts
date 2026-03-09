import type { PaymentCreateInput, PaymentRecordView } from '../models/paymentModel';
import { paymentService } from '../services/paymentService';

export const paymentController = {
  async listStudents() {
    return paymentService.getStudents();
  },

  async listCourses() {
    return paymentService.getCourses();
  },

  async listPayments(): Promise<PaymentRecordView[]> {
    return paymentService.getAll();
  },

  async createPayment(input: PaymentCreateInput): Promise<void> {
    if (!input.student_id) throw new Error('Student is required');
    if (!input.amount || input.amount <= 0) throw new Error('Amount must be greater than zero');
    if (!input.due_date) throw new Error('Due date is required');
    return paymentService.create(input);
  },
};
