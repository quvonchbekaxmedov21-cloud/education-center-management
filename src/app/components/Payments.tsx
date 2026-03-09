import { useState } from 'react';
import { DollarSign, Search, Plus, CreditCard, Banknote, ArrowRightLeft } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { mockPayments, mockStudents, type Payment } from '../lib/mockData';
import { toast } from 'sonner';

export function Payments() {
  const [payments, setPayments] = useState<Payment[]>(mockPayments);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const filteredPayments = payments.filter(payment =>
    payment.studentName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const studentId = formData.get('studentId') as string;
    const student = mockStudents.find(s => s.id === studentId);

    const paymentData: Payment = {
      id: String(Date.now()),
      studentId,
      studentName: `${student?.name} ${student?.surname}`,
      amount: Number(formData.get('amount')),
      date: formData.get('date') as string,
      status: formData.get('status') as 'completed' | 'pending' | 'failed',
      method: formData.get('method') as 'cash' | 'card' | 'transfer',
      notes: formData.get('notes') as string
    };

    setPayments([...payments, paymentData]);
    toast.success('Payment recorded successfully');
    setIsAddDialogOpen(false);
  };

  const stats = {
    total: payments.filter(p => p.status === 'completed').reduce((sum, p) => sum + p.amount, 0),
    pending: payments.filter(p => p.status === 'pending').length,
    thisMonth: payments.filter(p => {
      const paymentDate = new Date(p.date);
      const now = new Date();
      return paymentDate.getMonth() === now.getMonth() && paymentDate.getFullYear() === now.getFullYear();
    }).reduce((sum, p) => sum + p.amount, 0)
  };

  const studentsWithBalance = mockStudents.filter(s => s.balance > 0);

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
                    {mockStudents.map(student => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} {student.surname} {student.balance > 0 && `(${student.balance} due)`}
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
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
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
                <Select name="status" defaultValue="completed">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="completed">Completed</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="failed">Failed</SelectItem>
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
                    <div className="font-medium">{student.name} {student.surname}</div>
                    <div className="text-sm text-slate-600">{student.email}</div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`px-3 py-1 rounded text-sm ${
                      student.paymentStatus === 'overdue' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      ${student.balance} due
                    </span>
                    <span className={`px-3 py-1 rounded text-sm ${
                      student.paymentStatus === 'overdue' 
                        ? 'bg-red-100 text-red-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {student.paymentStatus}
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
          <div className="space-y-2">
            {filteredPayments.map(payment => (
              <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-slate-50">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-lg ${
                    payment.method === 'cash' ? 'bg-green-100' :
                    payment.method === 'card' ? 'bg-blue-100' :
                    'bg-purple-100'
                  }`}>
                    {payment.method === 'cash' ? <Banknote className="size-5" /> :
                     payment.method === 'card' ? <CreditCard className="size-5" /> :
                     <ArrowRightLeft className="size-5" />}
                  </div>
                  <div>
                    <div className="font-medium">{payment.studentName}</div>
                    <div className="text-sm text-slate-600">{payment.date} • {payment.method}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-semibold">${payment.amount}</div>
                  <span className={`text-sm px-2 py-1 rounded ${
                    payment.status === 'completed' ? 'bg-green-100 text-green-700' :
                    payment.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {payment.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
