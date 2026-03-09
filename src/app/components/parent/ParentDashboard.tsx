import { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { supabase } from '../../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { BookOpen, Calendar, TrendingUp, DollarSign, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface ChildInfo {
  id: string;
  name: string;
  surname: string;
  email: string;
  totalCourses: number;
  attendancePercentage: number;
  averageGrade: number;
  pendingPayments: number;
}

export function ParentDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState<ChildInfo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChildrenData();
  }, [user]);

  const loadChildrenData = async () => {
    if (!user) return;

    try {
      // For this demo, we'll find students that have the parent's email in parent_email field
      // In production, you'd use the parent_student relationship table
      const { data: studentsData, error: studentsError } = await supabase
        .from('students')
        .select('*')
        .eq('parent_email', user.email);

      if (studentsError) throw studentsError;

      if (!studentsData || studentsData.length === 0) {
        // If no children found, show message
        setLoading(false);
        return;
      }

      const childrenInfo: ChildInfo[] = [];

      for (const student of studentsData) {
        // Get courses count
        const { count: coursesCount } = await supabase
          .from('course_enrollments')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', student.id)
          .eq('status', 'active');

        // Get attendance
        const { data: attendance } = await supabase
          .from('attendance')
          .select('status')
          .eq('student_id', student.id);

        const presentCount = attendance?.filter(a => a.status === 'present').length || 0;
        const totalAttendance = attendance?.length || 1;
        const attendancePercentage = Math.round((presentCount / totalAttendance) * 100);

        // Get test results
        const { data: testResults } = await supabase
          .from('test_results')
          .select('score, max_score')
          .eq('student_id', student.id);

        const averageGrade = testResults && testResults.length > 0
          ? Math.round(testResults.reduce((sum, test) => sum + ((test.score / test.max_score) * 100), 0) / testResults.length)
          : 0;

        // Get pending payments
        const { count: paymentsCount } = await supabase
          .from('payments')
          .select('*', { count: 'exact', head: true })
          .eq('student_id', student.id)
          .eq('status', 'pending');

        childrenInfo.push({
          id: student.id,
          name: student.name,
          surname: student.surname,
          email: student.email,
          totalCourses: coursesCount || 0,
          attendancePercentage,
          averageGrade,
          pendingPayments: paymentsCount || 0,
        });
      }

      setChildren(childrenInfo);
    } catch (error: any) {
      console.error('Error loading children data:', error);
      toast.error('Failed to load children data');
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

  if (children.length === 0) {
    return (
      <div className="space-y-6">
        <div className="rounded-2xl border border-white/15 bg-slate-900/45 backdrop-blur px-5 py-4">
          <h1 className="text-3xl font-bold text-white">Welcome, {user?.full_name}!</h1>
          <p className="text-slate-200">Parent Portal Dashboard</p>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Children Found</h3>
            <p className="text-gray-500 text-center max-w-md">
              No student records are linked to your account yet. Please contact the school administration
              to link your child's account to your parent account.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/15 bg-slate-900/45 backdrop-blur px-5 py-4">
        <h1 className="text-3xl font-bold text-white">Welcome, {user?.full_name}!</h1>
        <p className="text-slate-200">Monitor your {children.length === 1 ? "child's" : "children's"} academic progress</p>
      </div>

      {children.map((child) => (
        <Card key={child.id} className="overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-purple-50 to-pink-50 border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl">{child.name} {child.surname}</CardTitle>
                <p className="text-sm text-gray-600 mt-1">{child.email}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">{child.totalCourses}</p>
                  <p className="text-sm text-gray-600">Enrolled Courses</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{child.attendancePercentage}%</p>
                  <p className="text-sm text-gray-600">Attendance</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-purple-50 rounded-lg">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">{child.averageGrade}%</p>
                  <p className="text-sm text-gray-600">Average Grade</p>
                </div>
              </div>

              <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <DollarSign className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-orange-600">{child.pendingPayments}</p>
                  <p className="text-sm text-gray-600">Pending Payments</p>
                </div>
              </div>
            </div>

            {/* Alerts */}
            {(child.attendancePercentage < 80 || child.averageGrade < 70 || child.pendingPayments > 0) && (
              <div className="mt-4 space-y-2">
                {child.attendancePercentage < 80 && (
                  <div className="flex items-center p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-yellow-600 mr-2" />
                    <p className="text-sm text-yellow-800">
                      Low attendance: {child.attendancePercentage}% - Please ensure regular class attendance
                    </p>
                  </div>
                )}
                {child.averageGrade < 70 && (
                  <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                    <p className="text-sm text-red-800">
                      Below average grades: {child.averageGrade}% - Consider additional tutoring support
                    </p>
                  </div>
                )}
                {child.pendingPayments > 0 && (
                  <div className="flex items-center p-3 bg-orange-50 border border-orange-200 rounded-lg">
                    <AlertCircle className="w-5 h-5 text-orange-600 mr-2" />
                    <p className="text-sm text-orange-800">
                      {child.pendingPayments} pending payment{child.pendingPayments > 1 ? 's' : ''} - Please settle outstanding fees
                    </p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
