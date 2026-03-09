import { useEffect, useState } from 'react';
import { Plus, Award } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { testResultController } from '../../mvc/controllers/testResultController';
import type { TestResultCreateInput, TestResultRecordView } from '../../mvc/models/testResultModel';
import { toast } from 'sonner';

export function TestResults() {
  const [results, setResults] = useState<TestResultRecordView[]>([]);
  const [students, setStudents] = useState<Array<{ id: string; name: string; surname: string }>>([]);
  const [courses, setCourses] = useState<Array<{ id: string; name: string; code?: string }>>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      const [resultData, studentData, courseData] = await Promise.all([
        testResultController.listTestResults(),
        testResultController.listStudents(),
        testResultController.listCourses(),
      ]);
      setResults(resultData);
      setStudents(studentData as Array<{ id: string; name: string; surname: string }>);
      setCourses(courseData as Array<{ id: string; name: string; code?: string }>);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load test results');
    } finally {
      setLoading(false);
    }
  };

  const filteredResults = selectedStudent === 'all'
    ? results
    : results.filter((r) => r.student_id === selectedStudent);

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const resultData: TestResultCreateInput = {
      student_id: formData.get('student_id') as string,
      course_id: formData.get('course_id') as string,
      test_name: formData.get('test_name') as string,
      test_type: formData.get('test_type') as 'weekly' | 'monthly' | 'mock' | 'placement',
      score: Number(formData.get('score')),
      max_score: Number(formData.get('max_score')),
      date: formData.get('date') as string,
      remarks: (formData.get('remarks') as string) || null,
    };

    try {
      await testResultController.createTestResult(resultData);
      toast.success('Test result added successfully');
      await loadData();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to add test result');
    }
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
    ? filteredResults.slice().reverse().map((r) => ({
        date: r.date,
        percentage: Math.round((r.score / r.max_score) * 100),
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
                <Label htmlFor="student_id">Student</Label>
                <Select name="student_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select student" />
                  </SelectTrigger>
                  <SelectContent>
                    {students.map((student) => (
                      <SelectItem key={student.id} value={student.id}>
                        {student.name} {student.surname}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="course_id">Course</Label>
                <Select name="course_id" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select course" />
                  </SelectTrigger>
                  <SelectContent>
                    {courses.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        {course.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="test_name">Test Name</Label>
                <Input id="test_name" name="test_name" placeholder="Midterm 1" required />
              </div>
              <div>
                <Label htmlFor="test_type">Test Type</Label>
                <Select name="test_type" defaultValue="weekly">
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="score">Score</Label>
                  <Input id="score" name="score" type="number" required />
                </div>
                <div>
                  <Label htmlFor="max_score">Max Score</Label>
                  <Input id="max_score" name="max_score" type="number" defaultValue="100" required />
                </div>
              </div>
              <div>
                <Label htmlFor="date">Date</Label>
                <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
              </div>
              <div>
                <Label htmlFor="remarks">Feedback (Optional)</Label>
                <Textarea id="remarks" name="remarks" />
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

      <div className="flex gap-2 flex-wrap">
        <Button
          variant={selectedStudent === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedStudent('all')}
        >
          All Students
        </Button>
        {students.slice(0, 6).map((student) => (
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
        {loading && <Card><CardContent className="p-8 text-center text-slate-500">Loading test results...</CardContent></Card>}
        {!loading && filteredResults.map((result) => {
          const percentage = Math.round((result.score / result.max_score) * 100);
          return (
            <Card key={result.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{result.student_name}</h3>
                      <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                        {result.test_type}
                      </span>
                    </div>
                    <p className="text-slate-600 mb-1">{result.course_name}</p>
                    <p className="text-sm font-medium mb-2">{result.test_name}</p>
                    {result.remarks && (
                      <div className="flex items-start gap-2 mt-3 p-3 bg-slate-50 rounded">
                        <Award className="size-4 text-slate-600 mt-0.5" />
                        <p className="text-sm text-slate-600">{result.remarks}</p>
                      </div>
                    )}
                  </div>
                  <div className="text-right ml-4">
                    <div className={`text-3xl font-semibold ${getScoreColor(percentage)}`}>
                      {percentage}%
                    </div>
                    <div className="text-sm text-slate-600 mt-1">
                      {result.score} / {result.max_score}
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

      {!loading && filteredResults.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-slate-600">No test results found for this filter.</CardContent>
        </Card>
      )}
    </div>
  );
}
