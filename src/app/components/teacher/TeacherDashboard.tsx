import { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { supabase } from '../../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, Users, DollarSign, Calendar, FileText, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface DashboardStats {
  totalCourses: number;
  totalStudents: number;
  pendingGrading: number;
  upcomingClasses: number;
  monthlyEarnings: number;
  totalEarned: number;
}

export function TeacherDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalCourses: 0,
    totalStudents: 0,
    pendingGrading: 0,
    upcomingClasses: 0,
    monthlyEarnings: 0,
    totalEarned: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentClasses, setRecentClasses] = useState<any[]>([]);

  useEffect(() => {
    loadDashboardData();
  }, [user]);

  const loadDashboardData = async () => {
    if (!user) return;

    try {
      // Get instructor record
      const { data: instructorData } = await supabase
        .from('instructors')
        .select('id, hourly_rate')
        .eq('email', user.email)
        .single();

      if (!instructorData) {
        toast.error('Instructor record not found');
        return;
      }

      const instructorId = instructorData.id;

      // Get assigned courses
      const { data: courses } = await supabase
        .from('courses')
        .select('id, name, schedule, enrolled')
        .eq('instructor_id', instructorId)
        .eq('status', 'active');

      setRecentClasses(courses?.slice(0, 5) || []);

      // Count total students across all courses
      let totalStudents = 0;
      if (courses) {
        for (const course of courses) {
          const { count } = await supabase
            .from('course_enrollments')
            .select('*', { count: 'exact', head: true })
            .eq('course_id', course.id)
            .eq('status', 'active');
          
          totalStudents += count || 0;
        }
      }

      // Get pending homework grading
      const { count: pendingCount } = await supabase
        .from('homework_submissions')
        .select('*', { count: 'exact', head: true })
        .in('status', ['submitted', 'pending'])
        .in('homework_id', 
          await supabase
            .from('homework')
            .select('id')
            .eq('assigned_by', instructorId)
            .then(res => res.data?.map(h => h.id) || [])
        );

      // Get salary information
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const { data: monthlySalary } = await supabase
        .from('salaries')
        .select('total')
        .eq('instructor_id', instructorId)
        .eq('month', currentMonth)
        .eq('year', currentYear)
        .single();

      const { data: totalEarnings } = await supabase
        .from('salaries')
        .select('total')
        .eq('instructor_id', instructorId)
        .eq('status', 'paid');

      const totalEarned = totalEarnings?.reduce((sum, s) => sum + (parseFloat(s.total) || 0), 0) || 0;

      setStats({
        totalCourses: courses?.length || 0,
        totalStudents,
        pendingGrading: pendingCount || 0,
        upcomingClasses: 0, // Would need a schedule table
        monthlyEarnings: parseFloat(monthlySalary?.total || '0'),
        totalEarned,
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
        <p className="text-gray-600">Here's an overview of your teaching activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCourses}</div>
            <p className="text-xs text-muted-foreground">Active courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStudents}</div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Grading</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingGrading}</div>
            <p className="text-xs text-muted-foreground">Submissions to grade</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Classes</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingClasses}</div>
            <p className="text-xs text-muted-foreground">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Month</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.monthlyEarnings.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">Current month earnings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalEarned.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">All-time earnings</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Classes */}
      <Card>
        <CardHeader>
          <CardTitle>My Active Courses</CardTitle>
        </CardHeader>
        <CardContent>
          {recentClasses.length > 0 ? (
            <div className="space-y-4">
              {recentClasses.map((course) => (
                <div key={course.id} className="flex items-center justify-between border-b pb-3 last:border-0">
                  <div>
                    <p className="font-medium">{course.name}</p>
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Clock className="w-3 h-3 mr-1" />
                      {course.schedule || 'Schedule TBA'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">{course.enrolled || 0}</p>
                    <p className="text-sm text-gray-500">Students</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500 py-8">No active courses assigned</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
