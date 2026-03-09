import { useState } from 'react';
import { Plus, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockPlacementTests, type PlacementTest } from '../lib/mockData';
import { toast } from 'sonner';

export function PlacementTests() {
  const [tests, setTests] = useState<PlacementTest[]>(mockPlacementTests);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    const score = Number(formData.get('score'));
    let recommendedLevel: 'elementary' | 'intermediate' | 'advanced';
    
    if (score < 50) recommendedLevel = 'elementary';
    else if (score < 75) recommendedLevel = 'intermediate';
    else recommendedLevel = 'advanced';

    const testData: PlacementTest = {
      id: String(Date.now()),
      studentName: formData.get('studentName') as string,
      email: formData.get('email') as string,
      phone: formData.get('phone') as string,
      subject: formData.get('subject') as string,
      score,
      recommendedLevel,
      date: formData.get('date') as string,
      status: 'completed'
    };

    setTests([...tests, testData]);
    toast.success(`Placement test completed. Recommended level: ${recommendedLevel}`);
    setIsAddDialogOpen(false);
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
                <Label htmlFor="studentName">Student Name</Label>
                <Input id="studentName" name="studentName" required />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" required />
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" required />
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
                <Label htmlFor="date">Test Date</Label>
                <Input id="date" name="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} required />
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
                {tests.filter(t => t.recommendedLevel === 'elementary').length}
              </div>
              <div className="text-sm text-slate-600 mt-1">Elementary</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-semibold text-yellow-700">
                {tests.filter(t => t.recommendedLevel === 'intermediate').length}
              </div>
              <div className="text-sm text-slate-600 mt-1">Intermediate</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-semibold text-red-700">
                {tests.filter(t => t.recommendedLevel === 'advanced').length}
              </div>
              <div className="text-sm text-slate-600 mt-1">Advanced</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {tests.map(test => (
          <Card key={test.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{test.studentName}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                    <span>{test.email}</span>
                    <span>{test.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium">Subject:</span>
                    <span className="text-sm text-slate-600">{test.subject}</span>
                  </div>
                </div>
                <div className="text-right ml-4">
                  <div className="text-3xl font-semibold text-blue-600 mb-2">
                    {test.score}
                  </div>
                  <span className={`px-3 py-1 rounded text-sm ${getLevelColor(test.recommendedLevel)}`}>
                    {test.recommendedLevel}
                  </span>
                  <div className="text-xs text-slate-500 mt-2">{test.date}</div>
                </div>
              </div>
              <div className="mt-4 p-3 bg-blue-50 rounded flex items-start gap-2">
                <ClipboardCheck className="size-4 text-blue-600 mt-0.5" />
                <p className="text-sm text-blue-900">
                  Recommended for <strong>{test.recommendedLevel}</strong> level {test.subject} group
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
