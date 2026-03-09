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
  DollarSign,
  Link2,
} from 'lucide-react';

const navigationItems = [
  { name: 'Dashboard', path: '/parent', icon: Home },
  { name: 'Courses', path: '/parent/courses', icon: BookOpen },
  { name: 'Grades', path: '/parent/grades', icon: TrendingUp },
  { name: 'Homework', path: '/parent/homework', icon: FileText },
  { name: 'Attendance', path: '/parent/attendance', icon: Calendar },
  { name: 'Payments', path: '/parent/payments', icon: DollarSign },
  { name: 'Quick Links', path: '/parent/quick-links', icon: Link2 },
  { name: 'Messages', path: '/parent/messages', icon: MessageSquare },
];

export function ParentRoot() {
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
    <div className="relative min-h-screen bg-[#23112f] text-slate-100 overflow-hidden">
      <div className="pointer-events-none absolute -top-24 -left-16 h-96 w-96 rounded-full bg-fuchsia-500/25 blur-3xl" />
      <div className="pointer-events-none absolute bottom-[-9rem] right-[-6rem] h-[28rem] w-[28rem] rounded-full bg-violet-500/20 blur-3xl" />

      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-white/10 bg-slate-900/65 backdrop-blur-xl">
        <div className="flex items-center justify-between px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-fuchsia-400 to-violet-500 p-2 rounded-xl shadow-lg shadow-violet-900/35">
              <GraduationCap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Parent Insight Hub</h1>
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
                      ? 'bg-gradient-to-r from-fuchsia-500/35 to-violet-500/35 text-white shadow-lg shadow-violet-950/35'
                      : 'text-slate-300 hover:bg-white/8 hover:text-white'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <Icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </div>
                  {isActive && <span className="h-2 w-2 rounded-full bg-fuchsia-200" />}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8 bg-gradient-to-b from-slate-900/30 to-slate-900/10">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
