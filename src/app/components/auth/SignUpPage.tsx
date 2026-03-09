import { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { signUp, UserRole, getRoleHomePath } from '../../../lib/auth';
import { useAuth } from '../../../lib/AuthContext';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { CheckCircle2, GraduationCap, Loader2, Sparkles } from 'lucide-react';

export function SignUpPage() {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    role: 'student' as UserRole,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const result = await signUp(
        formData.email,
        formData.password,
        formData.fullName,
        formData.role,
        formData.phone
      );

      if (result.success && result.user) {
        await refreshUser();
        toast.success(`Welcome, ${result.user.full_name}!`);
        navigate(getRoleHomePath(result.user.role));
      } else {
        toast.error(result.error || 'Failed to create account');
      }
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[radial-gradient(circle_at_8%_12%,#d9f99d_0%,transparent_28%),radial-gradient(circle_at_88%_10%,#a7f3d0_0%,transparent_24%),linear-gradient(140deg,#f3fff8_0%,#dcfce7_48%,#ecfeff_100%)] p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <motion.div
          className="hidden lg:block"
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-3 rounded-xl shadow-lg shadow-emerald-700/30">
                <GraduationCap className="w-10 h-10 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-slate-900">Join Education Center</h1>
                <p className="text-slate-700">Create your learning identity</p>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-2xl border border-emerald-200/70 bg-white/85 backdrop-blur p-6 shadow-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(34,197,94,0.18),transparent_36%),radial-gradient(circle_at_85%_80%,rgba(20,184,166,0.18),transparent_40%)]" />
              <div className="relative space-y-5">
                <div className="flex items-center gap-2 text-emerald-800 font-semibold">
                  <Sparkles className="size-4" />
                  Account Approval Animation
                </div>

                <div className="rounded-xl bg-slate-900 px-4 py-5 overflow-hidden">
                  <div className="relative h-24">
                    <motion.div
                      className="absolute left-2 top-6 h-12 w-12 rounded-full bg-gradient-to-br from-amber-300 to-orange-400"
                      animate={{ y: [0, -6, 0], rotate: [0, 3, 0, -3, 0] }}
                      transition={{ duration: 2.2, repeat: Infinity }}
                    />
                    <motion.div
                      className="absolute right-4 top-3 rounded-full bg-emerald-400/25 p-3"
                      animate={{ scale: [0.8, 1.15, 0.8], opacity: [0.45, 1, 0.45] }}
                      transition={{ duration: 1.8, repeat: Infinity }}
                    >
                      <CheckCircle2 className="size-7 text-emerald-200" />
                    </motion.div>
                    <div className="absolute bottom-6 left-0 right-0 h-1 bg-gradient-to-r from-emerald-300 to-cyan-400" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm text-slate-700">
                  <div className="rounded-xl bg-emerald-50 p-3 border border-emerald-100">Secure onboarding</div>
                  <div className="rounded-xl bg-cyan-50 p-3 border border-cyan-100">Role-specific access</div>
                  <div className="rounded-xl bg-lime-50 p-3 border border-lime-100">Realtime data sync</div>
                  <div className="rounded-xl bg-teal-50 p-3 border border-teal-100">Fast support flow</div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
          <Card className="w-full shadow-2xl border-white/70 bg-white/90 backdrop-blur">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900">Create Account</CardTitle>
              <CardDescription className="text-slate-700">Sign up to get started with your learning journey</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="your.email@example.com"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number (Optional)</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role">I am a...</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value) => setFormData({ ...formData, role: value as UserRole })}
                    disabled={loading}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select your role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="student">Student</SelectItem>
                      <SelectItem value="teacher">Teacher</SelectItem>
                      <SelectItem value="parent">Parent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                    required
                    disabled={loading}
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center text-sm">
                <button
                  type="button"
                  className="text-emerald-700 hover:underline"
                  onClick={() => navigate('/login')}
                >
                  Already have an account? Sign in
                </button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
