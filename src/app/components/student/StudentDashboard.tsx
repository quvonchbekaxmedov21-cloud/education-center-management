import { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { supabase } from '../../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, Calendar, CheckCircle, DollarSign, FileText, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
  totalCourses: number;
  attendancePercentage: number;
  averageGrade: number;
  pendingHomework: number;
  pendingPayments: number;
  upcomingTests: number;
}

export function StudentDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    attendancePercentage: 0,
    averageGrade: 0,
    pendingHomework: 0,
    pendingPayments: 0,
    upcomingTests: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentGrades, setRecentGrades] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Get student record
      const { data: studentData } = await supabase
        .from('students')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!studentData) {
        toast.error('Student record not found');
        return;
      }

      const studentId = studentData.id;

      // Get enrolled courses
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('*, courses(*)')
        .eq('student_id', studentId)
        .eq('status', 'active');

      // Get attendance
      const { data: attendance } = await supabase
        .from('attendance')
        .select('status')
        .eq('student_id', studentId);

      const presentCount = attendance?.filter(a => a.status === 'present').length || 0;
      const totalAttendance = attendance?.length || 1;
      const attendancePercentage = Math.round((presentCount / totalAttendance) * 100);

      // Get test results
      const { data: testResults } = await supabase
        .from('test_results')
        .select('*, courses(name)')
        .eq('student_id', studentId)
        .order('date', { ascending: false })
        .limit(5);

      const averageGrade = testResults && testResults.length > 0
        ? Math.round(testResults.reduce((sum, test) => sum + ((test.score / test.max_score) * 100), 0) / testResults.length)
        : 0;

      setRecentGrades(testResults || []);

      // Get pending homework
      const { data: homeworkSubmissions } = await supabase
        .from('homework_submissions')
        .select('status')
        .eq('student_id', studentId)
        .in('status', ['pending', 'submitted']);

      // Get pending payments
      const { data: payments } = await supabase
        .from('payments')
        .select('id')
        .eq('student_id', studentId)
        .eq('status', 'pending');

      setStats({
        totalCourses: enrollments?.length || 0,
        attendancePercentage,
        averageGrade,
        pendingHomework: homeworkSubmissions?.length || 0,
        pendingPayments: payments?.length || 0,
        upcomingTests: 0, // Would need a tests table
      });
    } catch (error: any) {
      console.error('Error loading dashboard:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user?.full_name}!</h1>
        <p className="text-gray-600">Here's what's happening with your studies</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enrolled Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Active enrollments</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.attendancePercentage}%</div>
            <p className="text-xs text-muted-foreground">Overall attendance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Grade</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageGrade}%</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Homework</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingHomework}</div>
            <p className="text-xs text-muted-foreground">Assignments to complete</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Payments</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPayments}</div>
            <p className="text-xs text-muted-foreground">Unpaid invoices</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Tests</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingTests}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Grades */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          {recentGrades.length > 0 ? (
            <div className="space-y-4">
              {recentGrades.map((grade) => {
                const percentage = ((grade.score / grade.max_score) * 100).toFixed(1);
                const getGradeColor = (pct: number) => {
                  if (pct >= 90) return 'text-green-600';
                  if (pct >= 80) return 'text-blue-600';
                  if (pct >= 70) return 'text-yellow-600';
                  return 'text-red-600';
                };

                return (
                  <div key={grade.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium">{grade.test_name}</p>
                      <p className="text-sm text-gray-500">{grade.courses?.name || 'Unknown Course'}</p>
                      <p className="text-xs text-gray-400">{new Date(grade.date).toLocaleDateString()}</p>
                    </div>
                    <div className="text-right">
                      <p className={`text-2xl font-bold ${getGradeColor(parseFloat(percentage))}`}>
                        {percentage}%
                      </p>
                      <p className="text-sm text-gray-500">
                        {grade.score}/{grade.max_score}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No test results yet</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
