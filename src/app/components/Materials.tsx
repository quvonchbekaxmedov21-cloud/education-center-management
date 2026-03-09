import { useState } from 'react';
import { Plus, Download, FileText, Video, File, Link as LinkIcon } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockMaterials, mockGroups, type Material } from '../lib/mockData';
import { toast } from 'sonner';

export function Materials() {
  const [materials, setMaterials] = useState<Material[]>(mockMaterials);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const filteredMaterials = selectedSubject === 'all'
    ? materials
    : materials.filter(m => m.subject === selectedSubject);

  const handleSave = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    const materialData: Material = {
      id: String(Date.now()),
      title: formData.get('title') as string,
      description: formData.get('description') as string,
      type: formData.get('type') as 'pdf' | 'video' | 'document' | 'link',
      subject: formData.get('subject') as string,
      groupId: formData.get('groupId') as string,
      uploadDate: new Date().toISOString().split('T')[0],
      fileUrl: '#'  // In real app, this would be uploaded file URL
    };

    setMaterials([...materials, materialData]);
    toast.success('Material added successfully');
    setIsAddDialogOpen(false);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'pdf': return <FileText className="size-5 text-red-600" />;
      case 'video': return <Video className="size-5 text-blue-600" />;
      case 'link': return <LinkIcon className="size-5 text-green-600" />;
      default: return <File className="size-5 text-slate-600" />;
    }
  };

  const subjects = Array.from(new Set(materials.map(m => m.subject)));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Learning Materials</h2>
          <p className="text-slate-600 mt-1">Course materials and resources</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="size-4 mr-2" />
              Upload Material
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Material</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" required />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required />
              </div>
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" name="subject" required />
              </div>
              <div>
                <Label htmlFor="groupId">Group</Label>
                <Select name="groupId" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select group" />
                  </SelectTrigger>
                  <SelectContent>
                    {mockGroups.map(group => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="type">Type</Label>
                <Select name="type" defaultValue="pdf">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pdf">PDF Document</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="link">External Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="file">File</Label>
                <Input id="file" name="file" type="file" />
                <p className="text-sm text-slate-600 mt-1">Upload file or provide link in description</p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Upload Material</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex gap-2">
        <Button
          variant={selectedSubject === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedSubject('all')}
        >
          All Subjects
        </Button>
        {subjects.map(subject => (
          <Button
            key={subject}
            variant={selectedSubject === subject ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSubject(subject)}
          >
            {subject}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMaterials.map(material => (
          <Card key={material.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 bg-slate-100 rounded-lg">
                  {getTypeIcon(material.type)}
                </div>
                <Button size="sm" variant="ghost">
                  <Download className="size-4" />
                </Button>
              </div>
              <h3 className="font-semibold mb-2">{material.title}</h3>
              <p className="text-sm text-slate-600 mb-4">{material.description}</p>
              <div className="flex items-center justify-between pt-4 border-t">
                <span className="text-sm text-slate-600">{material.subject}</span>
                <span className="text-xs text-slate-500">{material.uploadDate}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMaterials.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <FileText className="size-12 text-slate-400 mx-auto mb-4" />
            <p className="text-slate-600">No materials found for this subject</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
