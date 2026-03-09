import { useState } from 'react';
import { Plus, TrendingUp, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { mockTestResults, mockStudents, type TestResult } from '../lib/mockData';
import { toast } from 'sonner';

export function TestResults() {
  const [results, setResults] = useState<TestResult[]>(mockTestResults);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('all');

  const filteredResults = selectedStudent === 'all'
    ? results
    : results.filter(r => r.studentId === selectedStudent);

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const studentId = formData.get('studentId') as string;
    const student = mockStudents.find(s => s.id === studentId);

    const resultData: TestResult = {
      id: String(Date.now()),
      studentId,
      studentName: `${student?.name} ${student?.surname}`,
      testType: formData.get('testType') as 'weekly' | 'monthly' | 'mock' | 'placement',
      subject: formData.get('subject') as string,
      score: Number(formData.get('score')),
      maxScore: Number(formData.get('maxScore')),
      date: formData.get('date') as string,
      feedback: formData.get('feedback') as string
    };

    setResults([...results, resultData]);
    toast.success('Test result added successfully');
    setIsAddDialogOpen(false);
  };

  const getScoreColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 70) return 'text-blue-600';
    if (percentage >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-green-100';
    if (percentage >= 70) return 'bg-blue-100';
    if (percentage >= 50) return 'bg-yellow-100';
    return 'bg-red-100';
  };

  const studentPerformance = selectedStudent !== 'all' 
    ? filteredResults.map(r => ({
        date: r.date,
        percentage: Math.round((r.score / r.maxScore) * 100)
      }))
    : [];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Test Results</h2>
          <p className="text-slate-600 mt-1">Track student performance and progress</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Add Test Result
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Test Result</DialogTitle>
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
                        {student.name} {student.surname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="testType">Test Type</Label>
                <Select name="testType" defaultValue="weekly">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weekly">Weekly Test</SelectItem>
                    <SelectItem value="monthly">Monthly Test</SelectItem>
                    <SelectItem value="mock">Mock Exam</SelectItem>
                    <SelectItem value="placement">Placement Test</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="score">Score</Label>
                  <Input id="score" name="score" type="number" required />
                </div>
                <div>
                  <Label htmlFor="maxScore">Max Score</Label>
                  <Input id="maxScore" name="maxScore" type="number" defaultValue="100" required />
                </div>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
              </div>
              <div>
                <Label htmlFor="feedback">Feedback (Optional)</Label>
                <Textarea id="feedback" name="feedback" />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Add Result</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <Button
          variant={selectedStudent === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStudent('all')}
        >
          All Students
        </Button>
        {mockStudents.slice(0, 5).map(student => (
          <Button
            key={student.id}
            variant={selectedStudent === student.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedStudent(student.id)}
          >
            {student.name}
          </Button>
        ))}
      </div>

      {selectedStudent !== 'all' && studentPerformance.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={studentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Line type="monotone" dataKey="percentage" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {filteredResults.map(result => {
          const percentage = Math.round((result.score / result.maxScore) * 100);
          return (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{result.studentName}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {result.testType}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-2">{result.subject}</p>
                    {result.feedback && (
                      <div className="flex items-start gap-2 mt-3 p-3 bg-slate-50 rounded">
                        <Award className="size-4 text-slate-600 mt-0.5" />
                        <p className="text-sm text-slate-600">{result.feedback}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className={`text-3xl font-semibold ${getScoreColor(percentage)}`}>
                      {percentage}%
                    </div>
                    <div className="text-sm text-slate-600 mt-1">
                      {result.score} / {result.maxScore}
                    </div>
                    <div className={`mt-2 px-3 py-1 rounded text-sm ${getScoreBgColor(percentage)} ${getScoreColor(percentage)}`}>
                      {percentage >= 90 ? 'Excellent' :
                       percentage >= 70 ? 'Good' :
                       percentage >= 50 ? 'Average' :
                       'Needs Improvement'}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">{result.date}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
