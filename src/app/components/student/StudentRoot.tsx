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
  FolderOpen,
  Link2,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/student', icon: Home },
  { name: 'My Courses', path: '/student/courses', icon: BookOpen },
  { name: 'My Grades', path: '/student/grades', icon: TrendingUp },
  { name: 'Materials', path: '/student/materials', icon: FolderOpen },
  { name: 'Quick Links', path: '/student/quick-links', icon: Link2 },
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
    <div className="relative min-h-screen bg-[#08142b] text-slate-100 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-indigo-500/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-9rem] -left-20 h-[27rem] w-[27rem] rounded-full bg-sky-500/20 blur-3xl" />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-900/70 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-sky-400 to-indigo-500 p-2 rounded-xl shadow-lg shadow-indigo-900/35">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Student Journey</h1>
              <p className="text-sm text-slate-300">{user?.full_name}</p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={handleSignOut} className="border-white/20 bg-white/5 text-slate-100 hover:bg-white/10">
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-72 min-h-[calc(100vh-73px)] border-r border-white/10 bg-slate-900/55 backdrop-blur-xl">
          <nav className="p-4 space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`group flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 ${
                    isActive
                      ? 'bg-gradient-to-r from-sky-500/35 to-indigo-500/35 text-white shadow-lg shadow-indigo-950/35'
                      : 'text-slate-300 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <span className="h-2 w-2 rounded-full bg-sky-200" />}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gradient-to-b from-slate-900/35 to-slate-900/10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
