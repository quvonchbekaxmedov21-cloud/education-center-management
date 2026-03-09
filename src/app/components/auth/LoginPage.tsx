import { useState } from 'react';
import { useNavigate } from 'react-router';
import { signIn, getRoleHomePath } from '../../../lib/auth';
import { useAuth } from '../../../lib/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { GraduationCap, Loader2, Info } from 'lucide-react';

export function LoginPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log('🔐 Attempting login with:', email);
      const result = await signIn(email, password);
      console.log('📥 Login result:', result);

      if (result.success && result.user) {
        // Refresh the auth context
        await refreshUser();
        
        toast.success(`Welcome back, ${result.user.full_name}!`);
        const homePath = getRoleHomePath(result.user.role);
        console.log('🏠 Navigating to:', homePath);
        navigate(homePath);
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoading(true);

    try {
      console.log('🔐 Quick login with:', demoEmail);
      const result = await signIn(demoEmail, demoPassword);
      console.log('📥 Login result:', result);

      if (result.success && result.user) {
        // Refresh the auth context
        await refreshUser();
        
        toast.success(`Welcome back, ${result.user.full_name}!`);
        const homePath = getRoleHomePath(result.user.role);
        console.log('🏠 Navigating to:', homePath);
        navigate(homePath);
      } else {
        console.error('❌ Login failed:', result.error);
        toast.error(result.error || 'Login failed');
      }
    } catch (error: any) {
      console.error('❌ Login error:', error);
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      {/* Demo Mode Banner */}
      <div className="fixed top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2 px-4 text-center text-sm font-medium shadow-lg z-50">
        🎭 Demo Mode - All data is stored locally in your browser
      </div>
      
      <div className="w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center mt-12">
        {/* Left side - Branding */}
        <div className="hidden md:block">
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-blue-600 p-3 rounded-lg">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Education Center</h1>
                <p className="text-gray-600">Management System</p>
              </div>
            </div>
            <div className="space-y-4 bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold text-gray-800">Complete Learning Platform</h2>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Student & Course Management
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Attendance & Grade Tracking
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Payment Management
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Homework & Test Results
                </li>
                <li className="flex items-center">
                  <span className="w-2 h-2 bg-blue-600 rounded-full mr-3"></span>
                  Parent Communication
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Right side - Login Form */}
        <Card className="w-full shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@school.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={loading}
                />
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Demo Accounts</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 mt-4">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin('admin@school.com', 'admin123')}
                  disabled={loading}
                  className="text-xs"
                >
                  Admin
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin('teacher1@school.com', 'teacher123')}
                  disabled={loading}
                  className="text-xs"
                >
                  Teacher
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin('student1@school.com', 'student123')}
                  disabled={loading}
                  className="text-xs"
                >
                  Student
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleQuickLogin('parent1@school.com', 'parent123')}
                  disabled={loading}
                  className="text-xs"
                >
                  Parent
                </Button>
              </div>
            </div>

            <div className="mt-6 text-center text-sm">
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => navigate('/signup')}
              >
                Don't have an account? Sign up
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}