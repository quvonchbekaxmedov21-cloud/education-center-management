import { useEffect, useState } from 'react';
import { useAuth } from '../../../lib/AuthContext';
import { supabase } from '../../../lib/supabase';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { toast } from 'sonner';

interface TestResult {
  id: string;
  test_name: string;
  score: number;
  max_score: number;
  percentage: number;
  date: string;
  course_name: string;
  remarks: string;
}

export function MyGrades() {
  const { user } = useAuth();
  const [grades, setGrades] = useState<TestResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    average: 0,
    highest: 0,
    lowest: 0,
    total: 0,
  });

  useEffect(() => {
    loadGrades();
  }, [user]);

  const loadGrades = async () => {
    if (!user) return;

    try {
      // Get student record
      const { data: studentData } = await supabase
        .from('students')
        .select('id')
        .eq('email', user.email)
        .single();

      if (!studentData) {
        toast.error('Student record not found');
        return;
      }

      // Get test results
      const { data, error } = await supabase
        .from('test_results')
        .select(`
          id,
          test_name,
          score,
          max_score,
          date,
          remarks,
          courses (name)
        `)
        .eq('student_id', studentData.id)
        .order('date', { ascending: false });

      if (error) throw error;

      const formattedGrades: TestResult[] = data?.map((test: any) => ({
        id: test.id,
        test_name: test.test_name,
        score: test.score,
        max_score: test.max_score,
        percentage: ((test.score / test.max_score) * 100).toFixed(1),
        date: test.date,
        course_name: test.courses?.name || 'Unknown',
        remarks: test.remarks || '',
      })) || [];

      setGrades(formattedGrades);

      // Calculate stats
      if (formattedGrades.length > 0) {
        const percentages = formattedGrades.map(g => parseFloat(g.percentage.toString()));
        const avg = percentages.reduce((a, b) => a + b, 0) / percentages.length;
        const highest = Math.max(...percentages);
        const lowest = Math.min(...percentages);

        setStats({
          average: Math.round(avg * 10) / 10,
          highest,
          lowest,
          total: formattedGrades.length,
        });
      }
    } catch (error: any) {
      console.error('Error loading grades:', error);
      toast.error('Failed to load grades');
    } finally {
      setLoading(false);
    }
  };

  const getGradeColor = (percentage: number) => {
    if (percentage >= 90) return 'text-green-600';
    if (percentage >= 80) return 'text-blue-600';
    if (percentage >= 70) return 'text-yellow-600';
    if (percentage >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getGradeBadge = (percentage: number) => {
    if (percentage >= 90) return <Badge className="bg-green-100 text-green-800">Excellent</Badge>;
    if (percentage >= 80) return <Badge className="bg-blue-100 text-blue-800">Good</Badge>;
    if (percentage >= 70) return <Badge className="bg-yellow-100 text-yellow-800">Average</Badge>;
    if (percentage >= 60) return <Badge className="bg-orange-100 text-orange-800">Below Average</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Improvement</Badge>;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">Loading grades...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">My Grades</h1>
        <p className="text-gray-600">Track your academic performance</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-3xl font-bold ${getGradeColor(stats.average)}`}>
              {stats.average}%
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Highest Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600 flex items-center">
              {stats.highest}%
              <TrendingUp className="w-5 h-5 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Lowest Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600 flex items-center">
              {stats.lowest}%
              <TrendingDown className="w-5 h-5 ml-2" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Tests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          </CardContent>
        </Card>
      </div>

      {/* Grades Table */}
      <Card>
        <CardHeader>
          <CardTitle>Test Results</CardTitle>
        </CardHeader>
        <CardContent>
          {grades.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No test results yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Test Name</TableHead>
                    <TableHead>Score</TableHead>
                    <TableHead>Percentage</TableHead>
                    <TableHead>Performance</TableHead>
                    <TableHead>Remarks</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((grade) => (
                    <TableRow key={grade.id}>
                      <TableCell className="font-medium">
                        {new Date(grade.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{grade.course_name}</TableCell>
                      <TableCell>{grade.test_name}</TableCell>
                      <TableCell>
                        {grade.score}/{grade.max_score}
                      </TableCell>
                      <TableCell>
                        <span className={`font-bold ${getGradeColor(parseFloat(grade.percentage.toString()))}`}>
                          {grade.percentage}%
                        </span>
                      </TableCell>
                      <TableCell>{getGradeBadge(parseFloat(grade.percentage.toString()))}</TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {grade.remarks || '-'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
