import {
  Users,
  BookOpen,
  UserCircle,
  DollarSign,
  TrendingUp,
  TrendingDown,
  CheckSquare,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "./ui/card";
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
} from "recharts";
import {
  mockStudents,
  mockCourses,
  mockInstructors,
  mockPayments,
} from "../lib/mockData";

export function Dashboard() {
  const stats = [
    {
      title: "Total Students",
      value: mockStudents.length,
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "blue",
    },
    {
      title: "Active Courses",
      value: mockCourses.filter((c) => c.status === "active")
        .length,
      change: "+3%",
      trend: "up",
      icon: BookOpen,
      color: "green",
    },
    {
      title: "Instructors",
      value: mockInstructors.length,
      change: "0%",
      trend: "neutral",
      icon: UserCircle,
      color: "purple",
    },
    {
      title: "Revenue",
      value: "$24,580",
      change: "+18%",
      trend: "up",
      icon: DollarSign,
      color: "orange",
    },
  ];

  const enrollmentData = [
    { month: "Jan", students: 45 },
    { month: "Feb", students: 52 },
    { month: "Mar", students: 48 },
    { month: "Apr", students: 61 },
    { month: "May", students: 58 },
    { month: "Jun", students: 65 },
  ];

  const courseEnrollment = mockCourses.map((course) => ({
    id: course.id,
    name: course.code,
    enrolled: course.enrolled,
    capacity: course.capacity,
  }));

  const statusData = [
    {
      name: "Active",
      value: mockStudents.filter((s) => s.status === "active")
        .length,
    },
    {
      name: "Inactive",
      value: mockStudents.filter((s) => s.status === "inactive")
        .length,
    },
  ];

  const COLORS = ["#3b82f6", "#94a3b8"];

  const overduePayments = mockStudents.filter(
    (s) => s.paymentStatus === "overdue",
  );
  const pendingPayments = mockStudents.filter(
    (s) => s.paymentStatus === "pending",
  );

  return (
    <div className="space-y-6">
      {/* Payment Alerts */}
      {(overduePayments.length > 0 ||
        pendingPayments.length > 0) && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-6">
            <div className="flex items-start gap-3">
              <AlertCircle className="size-5 text-yellow-700 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-yellow-900 mb-2">
                  Payment Alerts
                </h3>
                {overduePayments.length > 0 && (
                  <p className="text-sm text-yellow-800 mb-1">
                    <strong>{overduePayments.length}</strong>{" "}
                    student(s) with overdue payments
                  </p>
                )}
                {pendingPayments.length > 0 && (
                  <p className="text-sm text-yellow-800">
                    <strong>{pendingPayments.length}</strong>{" "}
                    student(s) with pending payments
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const TrendIcon =
            stat.trend === "up" ? TrendingUp : TrendingDown;
          return (
            <Card key={stat.title}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div
                    className={`p-3 rounded-lg bg-${stat.color}-50`}
                  >
                    <Icon
                      className={`size-6 text-${stat.color}-600`}
                    />
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      stat.trend === "up"
                        ? "text-green-600"
                        : "text-slate-500"
                    }`}
                  >
                    {stat.trend !== "neutral" && (
                      <TrendIcon className="size-4" />
                    )}
                    <span>{stat.change}</span>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="text-2xl font-semibold">
                    {stat.value}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {stat.title}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Enrollment Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={enrollmentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="students"
                  stroke="#3b82f6"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Student Status */}
        <Card>
          <CardHeader>
            <CardTitle>Student Status</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) =>
                    `${name}: ${value}`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Course Enrollment Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Course Enrollment Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={courseEnrollment}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey="enrolled"
                fill="#3b82f6"
                name="Enrolled"
              />
              <Bar
                dataKey="capacity"
                fill="#94a3b8"
                name="Capacity"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Students</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockStudents.slice(0, 5).map((student) => (
              <div
                key={student.id}
                className="flex items-center justify-between py-3 border-b last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-medium">
                    {(
                      student.name[0] + student.surname[0]
                    ).toUpperCase()}
                  </div>
                  <div>
                    <div>
                      {student.name} {student.surname}
                    </div>
                    <div className="text-sm text-slate-600">
                      {student.email}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div
                    className={`inline-flex px-2 py-1 rounded text-sm ${
                      student.status === "active"
                        ? "bg-green-100 text-green-700"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {student.status}
                  </div>
                  <div className="text-sm text-slate-600 mt-1">
                    {student.courses.length} courses
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}