import { useEffect, useState } from 'react';
import { DollarSign, Search, Plus, CreditCard, Banknote, ArrowRightLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { paymentController } from '../../mvc/controllers/paymentController';
import type { PaymentCreateInput, PaymentRecordView } from '../../mvc/models/paymentModel';
import { toast } from 'sonner';

export function Payments() {
  const [payments, setPayments] = useState<PaymentRecordView[]>([]);
  const [students, setStudents] = useState<Array<{ id: string; name: string; surname: string; email: string }>>([]);
  const [courses, setCourses] = useState<Array<{ id: string; name: string; code?: string }>>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      const [paymentData, studentData, courseData] = await Promise.all([
        paymentController.listPayments(),
        paymentController.listStudents(),
        paymentController.listCourses(),
      ]);
      setPayments(paymentData);
      setStudents(studentData as Array<{ id: string; name: string; surname: string; email: string }>);
      setCourses(courseData as Array<{ id: string; name: string; code?: string }>);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const filteredPayments = payments.filter(payment =>
    payment.student_name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const paymentData: PaymentCreateInput = {
      student_id: formData.get('studentId') as string,
      course_id: (formData.get('courseId') as string) || null,
      amount: Number(formData.get('amount')),
      due_date: formData.get('dueDate') as string,
      paid_date: (formData.get('paidDate') as string) || null,
      status: formData.get('status') as 'pending' | 'paid' | 'overdue' | 'cancelled',
      payment_method: formData.get('method') as string,
      notes: formData.get('notes') as string
    };

    try {
      await paymentController.createPayment(paymentData);
      toast.success('Payment recorded successfully');
      await loadData();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to record payment');
    }
  };

  const stats = {
    total: payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').length,
    thisMonth: payments.filter(p => {
      const paymentDate = new Date(p.paid_date || p.due_date);
      const now = new Date();
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
    }).reduce((sum, p) => sum + p.amount, 0)
  };

  const studentBalanceMap = new Map<string, { studentName: string; email: string; amount: number; status: string }>();
  payments
    .filter((p) => p.status === 'pending' || p.status === 'overdue')
    .forEach((p) => {
      const existing = studentBalanceMap.get(p.student_id);
      const amount = (existing?.amount || 0) + p.amount;
      const status = existing?.status === 'overdue' || p.status === 'overdue' ? 'overdue' : 'pending';
      const student = students.find((s) => s.id === p.student_id);
      studentBalanceMap.set(p.student_id, {
        studentName: p.student_name,
        email: student?.email || '',
        amount,
        status,
      });
    });
  const studentsWithBalance = Array.from(studentBalanceMap.entries()).map(([id, value]) => ({ id, ...value }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Payments</h2>
          <p className="text-slate-600 mt-1">Manage student payments and balances</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Record Payment
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record New Payment</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="studentId">Student</Label>
                <Select name="studentId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} {student.surname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="courseId">Course (Optional)</Label>
                <Select name="courseId">
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map(course => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">Amount ($)</Label>
                <Input id="amount" name="amount" type="number" required />
              </div>
              <div>
                <Label htmlFor="dueDate">Due Date</Label>
                <Input id="dueDate" name="dueDate" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
              </div>
              <div>
                <Label htmlFor="paidDate">Paid Date (Optional)</Label>
                <Input id="paidDate" name="paidDate" type="date" />
              </div>
              <div>
                <Label htmlFor="method">Payment Method</Label>
                <Select name="method" defaultValue="cash">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="card">Card</SelectItem>
                    <SelectItem value="transfer">Bank Transfer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue="paid">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paid">Paid</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="overdue">Overdue</SelectItem>
                    <SelectItem value="cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea id="notes" name="notes" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Record Payment</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Total Revenue</p>
                <p className="text-2xl font-semibold mt-1">${stats.total.toLocaleString()}</p>
              </div>
              <DollarSign className="size-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">This Month</p>
                <p className="text-2xl font-semibold mt-1">${stats.thisMonth.toLocaleString()}</p>
              </div>
              <ArrowRightLeft className="size-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Pending</p>
                <p className="text-2xl font-semibold mt-1">{stats.pending}</p>
              </div>
              <CreditCard className="size-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students with Outstanding Balance</CardTitle>
        </CardHeader>
        <CardContent>
          {studentsWithBalance.length > 0 ? (
            <div className="space-y-3">
              {studentsWithBalance.map(student => (
                <div key={student.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <div className="font-medium">{student.studentName}</div>
                    <div className="text-sm text-slate-600">{student.email}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded text-sm ${
                      student.status === 'overdue' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      ${student.amount.toFixed(2)} due
                    </span>
                    <span className={`px-3 py-1 rounded text-sm ${
                      student.status === 'overdue' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {student.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-600">
              No outstanding balances
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <CardTitle>Payment History</CardTitle>
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                placeholder="Search by student name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="py-12 text-center text-slate-500">Loading payment records...</div>
          ) : (
          <div className="space-y-2">
            {filteredPayments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    payment.payment_method === 'cash' ? 'bg-green-100' :
                    payment.payment_method === 'card' ? 'bg-blue-100' :
                    'bg-purple-100'
                  }`}>
                    {payment.payment_method === 'cash' ? <Banknote className="size-5" /> :
                     payment.payment_method === 'card' ? <CreditCard className="size-5" /> :
                     <ArrowRightLeft className="size-5" />}
                  </div>
                  <div>
                    <div className="font-medium">{payment.student_name}</div>
                    <div className="text-sm text-slate-600">Due: {payment.due_date} • {payment.payment_method || 'N/A'}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${payment.amount}</div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    payment.status === 'paid' ? 'bg-green-100 text-green-700' :
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
