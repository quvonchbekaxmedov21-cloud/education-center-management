import { supabase } from '../../lib/supabase';
import type { PaymentCreateInput, PaymentRecordView } from '../models/paymentModel';

export const paymentService = {
  async getStudents() {
    const { data, error } = await supabase
      .from('students')
      .select('id, name, surname, email')
      .order('name');

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getCourses() {
    const { data, error } = await supabase
      .from('courses')
      .select('id, name, code')
      .order('name');

    if (error) throw new Error(error.message);
    return data || [];
  },

  async getAll(): Promise<PaymentRecordView[]> {
    const { data, error } = await supabase
      .from('payments')
      .select(`
        id,
        student_id,
        amount,
        due_date,
        paid_date,
        status,
        payment_method,
        notes,
        students (name, surname),
        courses (name)
      `)
      .order('created_at', { ascending: false });

    if (error) throw new Error(error.message);

    return (data || []).map((row: any) => ({
      id: row.id,
      student_id: row.student_id,
      student_name: `${row.students?.name || ''} ${row.students?.surname || ''}`.trim(),
      course_name: row.courses?.name,
      amount: Number(row.amount || 0),
      due_date: row.due_date,
      paid_date: row.paid_date,
      status: row.status,
      payment_method: row.payment_method,
      notes: row.notes,
    }));
  },

  async create(input: PaymentCreateInput): Promise<void> {
    const { error } = await supabase.from('payments').insert([input]);
    if (error) throw new Error(error.message);
  },
};
