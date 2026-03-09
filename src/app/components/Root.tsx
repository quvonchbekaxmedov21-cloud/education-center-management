import { Outlet, Link, useLocation } from 'react-router';
import { GraduationCap, LayoutDashboard, Users, BookOpen, UserCircle, Calendar, CheckSquare, UsersRound, DollarSign, ClipboardCheck, FileText, PenTool, BarChart, ExternalLink, MessageSquare } from 'lucide-react';

export function Root() {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Students', href: '/students', icon: Users },
    { name: 'Courses', href: '/courses', icon: BookOpen },
    { name: 'Instructors', href: '/instructors', icon: UserCircle },
    { name: 'Groups', href: '/groups', icon: UsersRound },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Attendance', href: '/attendance', icon: CheckSquare },
    { name: 'Test Results', href: '/test-results', icon: BarChart },
    { name: 'Homework', href: '/homework', icon: PenTool },
    { name: 'Materials', href: '/materials', icon: FileText },
    { name: 'Payments', href: '/payments', icon: DollarSign },
    { name: 'Placement Tests', href: '/placement-tests', icon: ClipboardCheck },
    { name: 'Messaging', href: '/messaging', icon: MessageSquare },
    { name: 'Quick Links', href: '/quick-links', icon: ExternalLink },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-slate-200 overflow-y-auto">
        <div className="flex items-center gap-2 p-6 border-b border-slate-200">
          <GraduationCap className="size-8 text-blue-600" />
          <span className="font-semibold text-lg">EduCenter</span>
        </div>
        <nav className="p-4 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-colors text-sm ${
                  active
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="size-4" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content */}
      <div className="ml-64">
        <header className="bg-white border-b border-slate-200 px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl">Education Center Management</h1>
            <div className="flex items-center gap-3">
              <span className="text-sm text-slate-600">Admin User</span>
              <div className="size-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                AU
              </div>
            </div>
          </div>
        </header>
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}