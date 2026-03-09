import { useEffect, useState } from 'react';
import { Plus, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { placementTestController } from '../../mvc/controllers/placementTestController';
import type { PlacementTestCreateInput, PlacementTestRecordView } from '../../mvc/models/placementTestModel';
import { toast } from 'sonner';

export function PlacementTests() {
  const [tests, setTests] = useState<PlacementTestRecordView[]>([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void loadData();
  }, []);

  const loadData = async () => {
    try {
      const data = await placementTestController.listPlacementTests();
      setTests(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load placement tests');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const score = Number(formData.get('score'));
    const subject = formData.get('subject') as string;
    let level = 'elementary';

    if (score >= 75) level = 'advanced';
    else if (score >= 50) level = 'intermediate';

    const testData: PlacementTestCreateInput = {
      student_name: formData.get('student_name') as string,
      student_email: (formData.get('student_email') as string) || null,
      test_date: formData.get('test_date') as string,
      level,
      score,
      recommended_course: `${subject} - ${level}`,
      status: 'completed',
      notes: (formData.get('notes') as string) || null,
    };

    try {
      await placementTestController.createPlacementTest(testData);
      toast.success(`Placement test completed. Recommended level: ${level}`);
      await loadData();
      setIsAddDialogOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to save placement test');
    }
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case 'elementary': return 'bg-green-100 text-green-700';
      case 'intermediate': return 'bg-yellow-100 text-yellow-700';
      case 'advanced': return 'bg-red-100 text-red-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Placement Tests</h2>
          <p className="text-slate-600 mt-1">Assess and place new students in appropriate groups</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              New Placement Test
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Record Placement Test</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="student_name">Student Name</Label>
                <Input id="student_name" name="student_name" required />
              </div>
              <div>
                <Label htmlFor="student_email">Email (Optional)</Label>
                <Input id="student_email" name="student_email" type="email" />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select name="subject" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="English">English</SelectItem>
                    <SelectItem value="Mathematics">Mathematics</SelectItem>
                    <SelectItem value="Computer Science">Computer Science</SelectItem>
                    <SelectItem value="Physics">Physics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="score">Test Score (0-100)</Label>
                <Input id="score" name="score" type="number" min="0" max="100" required />
                <p className="text-sm text-slate-600 mt-1">
                  0-49: Elementary | 50-74: Intermediate | 75-100: Advanced
                </p>
              </div>
              <div>
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea id="notes" name="notes" />
              </div>
              <div>
                <Label htmlFor="test_date">Test Date</Label>
                <Input id="test_date" name="test_date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Submit Result</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Level Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-semibold text-green-700">
                {tests.filter(t => t.level === 'elementary').length}
              </div>
              <div className="text-sm text-slate-600 mt-1">Elementary</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-semibold text-yellow-700">
                {tests.filter(t => t.level === 'intermediate').length}
              </div>
              <div className="text-sm text-slate-600 mt-1">Intermediate</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-semibold text-red-700">
                {tests.filter(t => t.level === 'advanced').length}
              </div>
              <div className="text-sm text-slate-600 mt-1">Advanced</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {loading && <Card><CardContent className="p-8 text-center text-slate-500">Loading placement tests...</CardContent></Card>}
        {!loading && tests.map(test => (
          <Card key={test.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{test.student_name}</h3>
                  <div className="text-sm text-slate-600 mb-3">{test.student_email || 'No email provided'}</div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Recommended Course:</span>
                    <span className="text-sm text-slate-600">{test.recommended_course || 'TBD'}</span>
                  </div>
                  {test.notes && <p className="mt-3 text-sm text-slate-600">{test.notes}</p>}
                </div>
                <div className="text-right ml-4">
                  <div className="text-3xl font-semibold text-blue-600 mb-2">
                    {test.score ?? '-'}
                  </div>
                  <span className={`px-3 py-1 rounded text-sm ${getLevelColor(test.level || 'unknown')}`}>
                    {test.level || 'unassigned'}
                  </span>
                  <div className="text-xs text-slate-500 mt-2">{test.test_date}</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded flex items-start gap-2">
                <ClipboardCheck className="size-4 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-900">
                  Recommended for <strong>{test.level || 'pending'}</strong> level placement
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {!loading && tests.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center text-slate-600">No placement tests recorded yet.</CardContent>
        </Card>
      )}
    </div>
  );
}
