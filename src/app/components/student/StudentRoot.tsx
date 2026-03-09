import { Outlet, Link, useNavigate, useLocation } from 'react-router';
import { useAuth } from '../../../lib/AuthContext';
import { signOut } from '../../../lib/auth';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import {
  BookOpen,
  Calendar,
  FileText,
  GraduationCap,
  Home,
  LogOut,
  MessageSquare,
  TrendingUp,
  User,
  DollarSign,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/student', icon: Home },
  { name: 'My Courses', path: '/student/courses', icon: BookOpen },
  { name: 'My Grades', path: '/student/grades', icon: TrendingUp },
  { name: 'Homework', path: '/student/homework', icon: FileText },
  { name: 'Attendance', path: '/student/attendance', icon: Calendar },
  { name: 'Payments', path: '/student/payments', icon: DollarSign },
  { name: 'Messages', path: '/student/messages', icon: MessageSquare },
  { name: 'Profile', path: '/student/profile', icon: User },
];

export function StudentRoot() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    const result = await signOut();
    if (result.success) {
      toast.success('Signed out successfully');
      navigate('/login');
    } else {
      toast.error(result.error || 'Failed to sign out');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-lg">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Student Portal</h1>
              <p className="text-sm text-gray-500">{user?.full_name}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut}>
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-white min-h-[calc(100vh-73px)] border-r border-gray-200">
          <nav className="p-4 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
