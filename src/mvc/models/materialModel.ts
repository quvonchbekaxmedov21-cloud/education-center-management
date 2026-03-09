export interface MaterialRecordView {
  id: string;
  course_id: string;
  course_name: string;
  title: string;
  description?: string | null;
  file_url: string;
  file_type?: string | null;
  uploaded_date: string;
}

export interface MaterialCreateInput {
  course_id: string;
  title: string;
  description?: string | null;
  file_url: string;
  file_type?: string | null;
}
