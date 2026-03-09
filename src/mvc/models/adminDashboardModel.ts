export interface AdminDashboardStats {
  totalStudents: number;
  activeCourses: number;
  instructors: number;
  revenuePaid: number;
  overduePayments: number;
  pendingPayments: number;
}

export interface EnrollmentTrendPoint {
  month: string;
  students: number;
}

export interface CourseEnrollmentPoint {
  id: string;
  name: string;
  enrolled: number;
  capacity: number;
}

export interface StudentStatusPoint {
  name: 'Active' | 'Inactive';
  value: number;
}

export interface RecentStudentItem {
  id: string;
  name: string;
  surname: string;
  email: string;
  status: string;
  courses_count: number;
}

export interface AdminDashboardData {
  stats: AdminDashboardStats;
  enrollmentTrend: EnrollmentTrendPoint[];
  courseEnrollment: CourseEnrollmentPoint[];
  studentStatus: StudentStatusPoint[];
  recentStudents: RecentStudentItem[];
}
