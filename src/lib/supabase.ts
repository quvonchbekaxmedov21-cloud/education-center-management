import { createClient } from '@supabase/supabase-js';

// Supabase configuration
const supabaseUrl = 'https://qwmflgaoxlwverxrxmim.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF3bWZsZ2FveGx3dmVyeHJ4bWltIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMwMjcyNjEsImV4cCI6MjA4ODYwMzI2MX0.DLXuLNrgmAGwiYG44c7MYvm6mgdzLJyZnYNuj0GtR40';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Student {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  parent_name?: string;
  parent_phone?: string;
  enrolled_courses: string[];
  status: 'active' | 'inactive' | 'graduated';
  join_date: string;
  created_at?: string;
}

export interface Course {
  id: string;
  name: string;
  code: string;
  description: string;
  instructor_id: string;
  schedule: string;
  duration: string;
  capacity: number;
  enrolled: number;
  status: 'active' | 'full' | 'upcoming';
  start_date: string;
  end_date: string;
  created_at?: string;
}

export interface Instructor {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  specialization: string[];
  courses: string[];
  status: 'active' | 'on_leave' | 'inactive';
  join_date: string;
  created_at?: string;
}

export interface Group {
  id: string;
  name: string;
  course_id: string;
  instructor_id: string;
  students: string[];
  schedule: string;
  room: string;
  capacity: number;
  status: 'active' | 'completed' | 'upcoming';
  created_at?: string;
}

export interface Attendance {
  id: string;
  student_id: string;
  course_id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  notes?: string;
  created_at?: string;
}

export interface Payment {
  id: string;
  student_id: string;
  course_id: string;
  amount: number;
  due_date: string;
  paid_date?: string;
  status: 'paid' | 'pending' | 'overdue';
  payment_method?: string;
  created_at?: string;
}

export interface TestResult {
  id: string;
  student_id: string;
  course_id: string;
  test_name: string;
  score: number;
  max_score: number;
  date: string;
  remarks?: string;
  created_at?: string;
}

export interface Homework {
  id: string;
  course_id: string;
  title: string;
  description: string;
  due_date: string;
  assigned_date: string;
  status: 'assigned' | 'submitted' | 'graded';
  student_id?: string;
  grade?: number;
  submission_date?: string;
  created_at?: string;
}

export interface Material {
  id: string;
  course_id: string;
  title: string;
  description: string;
  file_url: string;
  file_type: string;
  uploaded_by: string;
  uploaded_date: string;
  created_at?: string;
}

export interface Message {
  id: string;
  student_id: string;
  parent_phone: string;
  message: string;
  sent_date: string;
  status: 'sent' | 'delivered' | 'failed';
  created_at?: string;
}

export interface PlacementTest {
  id: string;
  student_name: string;
  test_date: string;
  level: string;
  score: number;
  recommended_course: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  notes?: string;
  created_at?: string;
}
