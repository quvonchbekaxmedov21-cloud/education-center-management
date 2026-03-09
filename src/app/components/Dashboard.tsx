import { useEffect, useMemo, useState } from 'react';
import {
  Users,
  BookOpen,
  UserCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { adminDashboardController } from '../../mvc/controllers/adminDashboardController';
import type { AdminDashboardData } from '../../mvc/models/adminDashboardModel';
import { toast } from 'sonner';

const COLORS = ['#3b82f6', '#94a3b8'];

export function Dashboard() {
  const [data, setData] = useState<AdminDashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadDashboard();
  }, []);

  const loadDashboard = async () => {
    try {
      const dashboardData = await adminDashboardController.getDashboard();
      setData(dashboardData);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    if (!data) return [];

    const paidRevenue = data.stats.revenuePaid;

    return [
      {
        title: 'Total Students',
        value: data.stats.totalStudents,
        icon: Users,
        trend: 'up' as const,
        change: `${data.studentStatus[0]?.value || 0} active`,
        iconClass: 'text-blue-600',
        badgeClass: 'text-green-600',
        boxClass: 'bg-blue-50',
      },
      {
        title: 'Active Courses',
        value: data.stats.activeCourses,
        icon: BookOpen,
        trend: 'up' as const,
        change: `${data.courseEnrollment.length} total`,
        iconClass: 'text-green-600',
        badgeClass: 'text-green-600',
        boxClass: 'bg-green-50',
      },
      {
        title: 'Instructors',
        value: data.stats.instructors,
        icon: UserCircle,
        trend: 'neutral' as const,
        change: 'Live count',
        iconClass: 'text-purple-600',
        badgeClass: 'text-slate-500',
        boxClass: 'bg-purple-50',
      },
      {
        title: 'Revenue',
        value: `$${paidRevenue.toLocaleString()}`,
        icon: DollarSign,
        trend: 'up' as const,
        change: `${data.stats.pendingPayments} pending`,
        iconClass: 'text-orange-600',
        badgeClass: 'text-orange-600',
        boxClass: 'bg-orange-50',
      },
    ];
  }, [data]);

  if (loading) {
    return <div className="py-16 text-center text-slate-500">Loading dashboard...</div>;
  }

  if (!data) {
    return <div className="py-16 text-center text-slate-500">No dashboard data available.</div>;
  }

  return (
    <div className="space-y-6">
      {(data.stats.overduePayments > 0 || data.stats.pendingPayments > 0) && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-yellow-700 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-2">Payment Alerts</h3>
                {data.stats.overduePayments > 0 && (
                  <p className="text-sm text-yellow-800 mb-1">
                    <strong>{data.stats.overduePayments}</strong> overdue payment record(s)
                  </p>
                )}
                {data.stats.pendingPayments > 0 && (
                  <p className="text-sm text-yellow-800">
                    <strong>{data.stats.pendingPayments}</strong> pending payment record(s)
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon = stat.trend === 'up' ? TrendingUp : TrendingDown;

          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className={`p-3 rounded-lg ${stat.boxClass}`}>
                    <Icon className={`size-6 ${stat.iconClass}`} />
                  </div>
                  <div className={`flex items-center gap-1 text-sm ${stat.badgeClass}`}>
                    {stat.trend !== 'neutral' && <TrendIcon className="size-4" />}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-semibold">{stat.value}</div>
                  <div className="text-sm text-slate-600 mt-1">{stat.title}</div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.enrollmentTrend}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="students" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Student Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data.studentStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={100}
                  dataKey="value"
                >
                  {data.studentStatus.map((entry, index) => (
                    <Cell key={`cell-${entry.name}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Enrollment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.courseEnrollment}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="enrolled" fill="#3b82f6" name="Enrolled" />
              <Bar dataKey="capacity" fill="#94a3b8" name="Capacity" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.recentStudents.map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                    {(student.name[0] + student.surname[0]).toUpperCase()}
                  </div>
                  <div>
                    <div>
                      {student.name} {student.surname}
                    </div>
                    <div className="text-sm text-slate-600">{student.email}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex px-2 py-1 rounded text-sm ${
                      student.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {student.status}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">{student.courses_count} courses</div>
                </div>
              </div>
            ))}
            {data.recentStudents.length === 0 && (
              <div className="text-center py-8 text-slate-500">No recent students found.</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
