export type StudentStatus = 'active' | 'inactive' | 'graduated';

export interface StudentModel {
  id: string;
  name: string;
  surname: string;
  email: string;
  phone: string;
  parent_name?: string | null;
  parent_phone?: string | null;
  enrolled_courses: string[];
  status: StudentStatus;
  join_date: string;
  created_at?: string;
}

export interface StudentCreateInput {
  name: string;
  surname: string;
  email: string;
  phone: string;
  parent_name?: string | null;
  parent_phone?: string | null;
  status: StudentStatus;
  join_date: string;
}

export interface StudentUpdateInput extends StudentCreateInput {
  id: string;
}
