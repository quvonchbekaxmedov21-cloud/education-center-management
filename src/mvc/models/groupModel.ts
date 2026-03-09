export interface GroupModel {
  id: string;
  name: string;
  course_id: string | null;
  instructor_id: string | null;
  students: string[];
  schedule: string | null;
  room: string | null;
  capacity: number;
  status: 'active' | 'completed' | 'upcoming';
  created_at?: string;
}

export interface GroupWithRelations extends GroupModel {
  course_name?: string;
  course_level?: string;
  instructor_name?: string;
}

export interface GroupCreateInput {
  name: string;
  course_id: string;
  instructor_id: string;
  schedule?: string | null;
  room?: string | null;
  capacity?: number;
  status: 'active' | 'completed' | 'upcoming';
}

export interface GroupUpdateInput extends GroupCreateInput {
  id: string;
}
