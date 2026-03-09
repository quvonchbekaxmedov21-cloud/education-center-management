import { createBrowserRouter, Navigate } from "react-router";

// Auth components
import { LoginPage } from "./components/auth/LoginPage";
import { SignUpPage } from "./components/auth/SignUpPage";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Admin Portal
import { AdminRoot } from "./components/admin/AdminRoot";
import { Dashboard } from "./components/Dashboard";
import { Students } from "./components/StudentsSupabase";
import { Courses } from "./components/Courses";
import { Instructors } from "./components/Instructors";
import { Schedule } from "./components/Schedule";
import { Attendance } from "./components/Attendance";
import { Payments } from "./components/Payments";
import { PlacementTests } from "./components/PlacementTests";
import { Groups } from "./components/Groups";
import { Materials } from "./components/Materials";
import { HomeworkPage } from "./components/HomeworkPage";
import { TestResults } from "./components/TestResults";
import { QuickLinks } from "./components/QuickLinks";
import { ParentMessaging } from "./components/ParentMessaging";

// Student Portal
import { StudentRoot } from "./components/student/StudentRoot";
import { StudentDashboard } from "./components/student/StudentDashboard";
import { MyCourses } from "./components/student/MyCourses";
import { MyGrades } from "./components/student/MyGrades";

// Teacher Portal
import { TeacherRoot } from "./components/teacher/TeacherRoot";
import { TeacherDashboard } from "./components/teacher/TeacherDashboard";

// Parent Portal
import { ParentRoot } from "./components/parent/ParentRoot";
import { ParentDashboard } from "./components/parent/ParentDashboard";

// Error pages
import { NotFound } from "./components/NotFound";

export const router = createBrowserRouter([
  // Public routes
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/signup",
    Component: SignUpPage,
  },

  // Admin Portal - Protected
  {
    path: "/admin",
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminRoot />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: Dashboard },
      { path: "students", Component: Students },
      { path: "courses", Component: Courses },
      { path: "instructors", Component: Instructors },
      { path: "schedule", Component: Schedule },
      { path: "attendance", Component: Attendance },
      { path: "groups", Component: Groups },
      { path: "payments", Component: Payments },
      { path: "placement-tests", Component: PlacementTests },
      { path: "materials", Component: Materials },
      { path: "homework", Component: HomeworkPage },
      { path: "test-results", Component: TestResults },
      { path: "quick-links", Component: QuickLinks },
      { path: "messaging", Component: ParentMessaging },
      // Add placeholder for user management
      { 
        path: "users", 
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">User Management</h2><p className="text-gray-600 mt-2">Coming soon - Manage all system users</p></div>
      },
    ],
  },

  // Student Portal - Protected
  {
    path: "/student",
    element: (
      <ProtectedRoute allowedRoles={['student']}>
        <StudentRoot />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: StudentDashboard },
      { path: "courses", Component: MyCourses },
      { path: "grades", Component: MyGrades },
      { path: "materials", Component: Materials },
      { path: "quick-links", Component: QuickLinks },
      // Placeholders for other student pages
      { 
        path: "homework", 
        Component: HomeworkPage,
      },
      { 
        path: "attendance", 
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">My Attendance</h2><p className="text-gray-600 mt-2">Track your class attendance</p></div>
      },
      { 
        path: "payments", 
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">My Payments</h2><p className="text-gray-600 mt-2">View payment history and pending fees</p></div>
      },
      { 
        path: "messages", 
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Messages</h2><p className="text-gray-600 mt-2">Communicate with teachers</p></div>
      },
      { 
        path: "profile", 
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">My Profile</h2><p className="text-gray-600 mt-2">Update your profile information</p></div>
      },
    ],
  },

  // Teacher Portal - Protected
  {
    path: "/teacher",
    element: (
      <ProtectedRoute allowedRoles={['teacher']}>
        <TeacherRoot />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: TeacherDashboard },
      // Placeholders for teacher pages
      { 
        path: "courses", 
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">My Courses</h2><p className="text-gray-600 mt-2">Manage your assigned courses</p></div>
      },
      { 
        path: "students", 
        Component: Students,
      },
      { 
        path: "attendance", 
        Component: Attendance,
      },
      { 
        path: "grading", 
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Grade Students</h2><p className="text-gray-600 mt-2">Enter and manage student grades</p></div>
      },
      { 
        path: "homework", 
        Component: HomeworkPage,
      },
      {
        path: "quick-links",
        Component: QuickLinks,
      },
      { 
        path: "salary", 
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">My Salary</h2><p className="text-gray-600 mt-2">View salary history and payments</p></div>
      },
      { 
        path: "messages", 
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Messages</h2><p className="text-gray-600 mt-2">Communicate with students and parents</p></div>
      },
    ],
  },

  // Parent Portal - Protected
  {
    path: "/parent",
    element: (
      <ProtectedRoute allowedRoles={['parent']}>
        <ParentRoot />
      </ProtectedRoute>
    ),
    children: [
      { index: true, Component: ParentDashboard },
      // Placeholders for parent pages
      { 
        path: "courses", 
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Child's Courses</h2><p className="text-gray-600 mt-2">View your child's enrolled courses</p></div>
      },
      { 
        path: "grades", 
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Child's Grades</h2><p className="text-gray-600 mt-2">Track your child's academic performance</p></div>
      },
      { 
        path: "homework", 
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Child's Homework</h2><p className="text-gray-600 mt-2">Monitor homework assignments and submissions</p></div>
      },
      { 
        path: "attendance", 
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Child's Attendance</h2><p className="text-gray-600 mt-2">View attendance records</p></div>
      },
      { 
        path: "payments", 
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Payments</h2><p className="text-gray-600 mt-2">Manage fee payments</p></div>
      },
      {
        path: "quick-links",
        Component: QuickLinks,
      },
      { 
        path: "messages", 
        element: <div className="text-center py-12"><h2 className="text-2xl font-bold">Messages</h2><p className="text-gray-600 mt-2">Communicate with teachers</p></div>
      },
    ],
  },

  // Root redirect
  {
    path: "/",
    element: <Navigate to="/login" replace />,
  },

  // 404 catch-all
  {
    path: "*",
    Component: NotFound,
  },
]);
