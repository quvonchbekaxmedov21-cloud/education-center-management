import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { signIn, getRoleHomePath } from '../../../lib/auth';
import { useAuth } from '../../../lib/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';
import { CheckCircle2, GraduationCap, Loader2, Sparkles } from 'lucide-react';

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
      const result = await signIn(email, password);
      if (result.success && result.user) {
        await refreshUser();
        toast.success(`Welcome back, ${result.user.full_name}!`);
        navigate(getRoleHomePath(result.user.role));
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error: any) {
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
      const result = await signIn(demoEmail, demoPassword);
      if (result.success && result.user) {
        await refreshUser();
        toast.success(`Welcome back, ${result.user.full_name}!`);
        navigate(getRoleHomePath(result.user.role));
      } else {
        toast.error(result.error || 'Login failed');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_10%_15%,#bae6fd_0%,transparent_26%),radial-gradient(circle_at_92%_6%,#fde68a_0%,transparent_24%),linear-gradient(140deg,#f8fbff_0%,#e6f1ff_50%,#fef3c7_100%)] p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-xl shadow-lg shadow-cyan-700/30">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Education Center</h1>
                <p className="text-slate-700">Smart Learning Command Deck</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-cyan-200/70 bg-white/80 backdrop-blur p-6 shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(6,182,212,0.15),transparent_35%),radial-gradient(circle_at_85%_78%,rgba(249,115,22,0.16),transparent_38%)]" />
              <div className="relative space-y-5">
                <div className="flex items-center gap-2 text-cyan-800 font-semibold">
                  <Sparkles className="size-4" />
                  Live Journey Animation
                </div>

                <div className="rounded-xl bg-slate-900 px-4 py-5 overflow-hidden">
                  <div className="relative h-24">
                    <div className="absolute bottom-7 left-0 right-0 h-1 bg-gradient-to-r from-cyan-300 via-cyan-400 to-blue-400" />
                    <motion.div
                      className="absolute bottom-9 left-0 h-10 w-20 rounded-md bg-gradient-to-r from-cyan-400 to-blue-500 shadow-lg"
                      animate={{ x: ['-5%', '95%'] }}
                      transition={{ duration: 5, ease: 'linear', repeat: Infinity }}
                    >
                      <div className="absolute inset-1 rounded bg-slate-950/40" />
                    </motion.div>
                    <motion.div
                      className="absolute right-4 top-2 rounded-full bg-emerald-400/25 p-3"
                      animate={{ scale: [0.9, 1.15, 0.9], opacity: [0.4, 1, 0.4] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <CheckCircle2 className="size-6 text-emerald-200" />
                    </motion.div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                  <div className="rounded-xl bg-cyan-50 p-3 border border-cyan-100">Role-based portals</div>
                  <div className="rounded-xl bg-amber-50 p-3 border border-amber-100">Progress tracking</div>
                  <div className="rounded-xl bg-blue-50 p-3 border border-blue-100">Parent insights</div>
                  <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-100">Realtime updates</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Card className="w-full shadow-2xl border-white/70 bg-white/88 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">Sign In</CardTitle>
              <CardDescription className="text-slate-700">Enter your credentials to access your account</CardDescription>
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
                    <span className="bg-white px-2 text-slate-500">Demo Accounts</span>
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
                  className="text-cyan-700 hover:underline"
                  onClick={() => navigate('/signup')}
                >
                  Don't have an account? Sign up
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
