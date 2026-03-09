import { supabase } from '../../lib/supabase';
import type {
  AdminDashboardData,
  CourseEnrollmentPoint,
  EnrollmentTrendPoint,
  RecentStudentItem,
} from '../models/adminDashboardModel';

function formatMonth(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short' });
}

export const adminDashboardService = {
  async getDashboardData(): Promise<AdminDashboardData> {
    const [
      studentsResult,
      activeCoursesResult,
      instructorsResult,
      paymentsResult,
      coursesResult,
      recentStudentsResult,
      enrollmentsResult,
    ] = await Promise.all([
      supabase.from('students').select('id, status, join_date', { count: 'exact' }),
      supabase.from('courses').select('id', { count: 'exact' }).eq('status', 'active'),
      supabase.from('instructors').select('id', { count: 'exact' }),
      supabase.from('payments').select('amount, status'),
      supabase.from('courses').select('id, code, enrolled, capacity').order('created_at', { ascending: false }),
      supabase
        .from('students')
        .select('id, name, surname, email, status, enrolled_courses')
        .order('created_at', { ascending: false })
        .limit(5),
      supabase.from('course_enrollments').select('enrollment_date'),
    ]);

    if (studentsResult.error) throw new Error(studentsResult.error.message);
    if (activeCoursesResult.error) throw new Error(activeCoursesResult.error.message);
    if (instructorsResult.error) throw new Error(instructorsResult.error.message);
    if (paymentsResult.error) throw new Error(paymentsResult.error.message);
    if (coursesResult.error) throw new Error(coursesResult.error.message);
    if (recentStudentsResult.error) throw new Error(recentStudentsResult.error.message);
    if (enrollmentsResult.error) throw new Error(enrollmentsResult.error.message);

    const students = studentsResult.data || [];
    const payments = paymentsResult.data || [];

    const revenuePaid = payments
      .filter((p: any) => p.status === 'paid')
      .reduce((sum: number, p: any) => sum + Number(p.amount || 0), 0);

    const overduePayments = payments.filter((p: any) => p.status === 'overdue').length;
    const pendingPayments = payments.filter((p: any) => p.status === 'pending').length;

    const now = new Date();
    const lastSixMonths: EnrollmentTrendPoint[] = Array.from({ length: 6 }).map((_, index) => {
      const monthDate = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1);
      return { month: formatMonth(monthDate), students: 0 };
    });

    const monthIndexMap = new Map(lastSixMonths.map((point, index) => [point.month, index]));

    for (const row of enrollmentsResult.data || []) {
      const date = row.enrollment_date ? new Date(row.enrollment_date) : null;
      if (!date || Number.isNaN(date.getTime())) continue;
      const month = formatMonth(date);
      const index = monthIndexMap.get(month);
      if (index != null) lastSixMonths[index].students += 1;
    }

    const courseEnrollment: CourseEnrollmentPoint[] = (coursesResult.data || []).map((course: any) => ({
      id: course.id,
      name: course.code,
      enrolled: Number(course.enrolled || 0),
      capacity: Number(course.capacity || 0),
    }));

    const recentStudents: RecentStudentItem[] = (recentStudentsResult.data || []).map((student: any) => ({
      id: student.id,
      name: student.name,
      surname: student.surname,
      email: student.email,
      status: student.status || 'inactive',
      courses_count: Array.isArray(student.enrolled_courses) ? student.enrolled_courses.length : 0,
    }));

    return {
      stats: {
        totalStudents: studentsResult.count || 0,
        activeCourses: activeCoursesResult.count || 0,
        instructors: instructorsResult.count || 0,
        revenuePaid,
        overduePayments,
        pendingPayments,
      },
      enrollmentTrend: lastSixMonths,
      courseEnrollment,
      studentStatus: [
        { name: 'Active', value: students.filter((s: any) => s.status === 'active').length },
        { name: 'Inactive', value: students.filter((s: any) => s.status !== 'active').length },
      ],
      recentStudents,
    };
  },
};
