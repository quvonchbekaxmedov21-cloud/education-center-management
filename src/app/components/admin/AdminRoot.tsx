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
  Users,
  DollarSign,
  UserCog,
  ClipboardList,
  FolderOpen,
  Settings,
  Link2,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/admin', icon: Home },
  { name: 'Students', path: '/admin/students', icon: Users },
  { name: 'Instructors', path: '/admin/instructors', icon: UserCog },
  { name: 'Courses', path: '/admin/courses', icon: BookOpen },
  { name: 'Attendance', path: '/admin/attendance', icon: Calendar },
  { name: 'Payments', path: '/admin/payments', icon: DollarSign },
  { name: 'Test Results', path: '/admin/test-results', icon: ClipboardList },
  { name: 'Homework', path: '/admin/homework', icon: FileText },
  { name: 'Materials', path: '/admin/materials', icon: FolderOpen },
  { name: 'Quick Links', path: '/admin/quick-links', icon: Link2 },
  { name: 'Messaging', path: '/admin/messaging', icon: MessageSquare },
  { name: 'User Management', path: '/admin/users', icon: Settings },
];

export function AdminRoot() {
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
    <div className="relative min-h-screen bg-slate-950 text-slate-100 overflow-hidden">
      <div className="pointer-events-none absolute -top-28 -left-24 h-96 w-96 rounded-full bg-cyan-500/25 blur-3xl" />
      <div className="pointer-events-none absolute top-1/3 -right-32 h-[28rem] w-[28rem] rounded-full bg-blue-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-8rem] left-1/3 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl" />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-900/75 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-cyan-400 to-blue-500 p-2 rounded-xl shadow-lg shadow-cyan-900/40">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Admin Command Center</h1>
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
                      ? 'bg-gradient-to-r from-cyan-500/35 to-blue-500/30 text-white shadow-lg shadow-cyan-950/30'
                      : 'text-slate-300 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <span className="h-2 w-2 rounded-full bg-cyan-200" />}
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
