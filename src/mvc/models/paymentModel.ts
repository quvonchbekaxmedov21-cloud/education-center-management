export type PaymentStatus = 'pending' | 'paid' | 'overdue' | 'cancelled';

export interface PaymentCreateInput {
  student_id: string;
  course_id?: string | null;
  amount: number;
  due_date: string;
  paid_date?: string | null;
  status: PaymentStatus;
  payment_method?: string | null;
  notes?: string | null;
}

export interface PaymentRecordView {
  id: string;
  student_id: string;
  student_name: string;
  course_name?: string;
  amount: number;
  due_date: string;
  paid_date?: string | null;
  status: PaymentStatus;
  payment_method?: string | null;
  notes?: string | null;
}
