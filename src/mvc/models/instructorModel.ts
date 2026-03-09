export interface InstructorModel {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string | null;
  specialization: string[];
  courses: string[];
  status: 'active' | 'inactive' | 'on_leave';
  join_date: string;
  hourly_rate: number;
  created_at?: string;
}

export interface InstructorCreateInput {
  name: string;
  surname: string;
  email: string;
  phone?: string | null;
  specialization?: string[];
  status: 'active' | 'inactive' | 'on_leave';
  join_date: string;
  hourly_rate?: number;
}

export interface InstructorUpdateInput extends InstructorCreateInput {
  id: string;
}
