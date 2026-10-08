import { useState } from 'react';
import { useHomebrewList, useCreateHomebrew, useDeleteHomebrew } from '../../api/useHomebrew';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '../../components/ui/dialog';
import { Skeleton } from '../../components/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';

export default function HomebrewPage() {
  const [filterType, setFilterType] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [contentType, setContentType] = useState('spell');
  const [description, setDescription] = useState('');
  const [jsonData, setJsonData] = useState('{}');

  const { data: homebrewList, isLoading } = useHomebrewList({
    content_type: filterType !== 'all' ? filterType : undefined
  });
  
  const createMutation = useCreateHomebrew();
  const deleteMutation = useDeleteHomebrew();

  const handleCreate = () => {
    try {
      const parsedData = JSON.parse(jsonData);
      createMutation.mutate({
        name,
        content_type: contentType,
        description,
        data: parsedData
      }, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setName('');
          setDescription('');
          setJsonData('{}');
        }
      });
    } catch (e) {
      alert("Invalid JSON data");
    }
  };

  return (
    <div className="p-6 bg-zinc-950 text-zinc-100 min-h-screen">
      <div className="flex justify-between items-center mb-6 border-b border-red-900 pb-2">
        <h1 className="text-4xl font-serif text-red-700">Homebrew Collection</h1>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-red-800 hover:bg-red-700 text-white">Create New</Button>
          </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-white sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle className="text-2xl font-serif text-red-500">Create Homebrew</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Name</label>
                <Input value={name} onChange={e => setName(e.target.value)} className="bg-zinc-800 border-zinc-700" />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Type</label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger className="bg-zinc-800 border-zinc-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                    <SelectItem value="spell">Spell</SelectItem>
                    <SelectItem value="monster">Monster</SelectItem>
                    <SelectItem value="race">Race</SelectItem>
                    <SelectItem value="class">Class</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Description</label>
                <textarea 
                  value={description} 
                  onChange={e => setDescription(e.target.value)}
                  className="w-full bg-zinc-800 border-zinc-700 rounded-md p-2 text-sm min-h-[80px]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-zinc-400">Data (JSON)</label>
                <textarea 
                  value={jsonData} 
                  onChange={e => setJsonData(e.target.value)}
                  className="w-full bg-zinc-800 border-zinc-700 rounded-md p-2 font-mono text-xs min-h-[120px]"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" className="border-zinc-700 hover:bg-zinc-800 text-white" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
              <Button className="bg-red-800 hover:bg-red-700 text-white" onClick={handleCreate} disabled={createMutation.isPending}>
                Save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="mb-6">
        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger className="w-[200px] bg-zinc-900 border-zinc-700">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="spell">Spells</SelectItem>
            <SelectItem value="monster">Monsters</SelectItem>
            <SelectItem value="race">Races</SelectItem>
            <SelectItem value="class">Classes</SelectItem>
            <SelectItem value="equipment">Equipment</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({length: 3}).map((_, i) => <Skeleton key={i} className="h-48 bg-zinc-900 rounded-lg" />)
        ) : homebrewList?.map(item => (
          <Card key={item.id} className="bg-zinc-900 border-zinc-800 flex flex-col">
            <CardHeader>
              <CardTitle className="text-xl font-serif text-red-400 flex justify-between items-start">
                {item.name}
                <span className="text-xs font-sans bg-zinc-800 px-2 py-1 rounded text-zinc-400 capitalize">{item.content_type}</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-grow">
              <p className="text-zinc-400 text-sm line-clamp-3">{item.description || 'No description provided.'}</p>
            </CardContent>
            <CardFooter className="pt-4 border-t border-zinc-800">
              <Button 
                variant="destructive" 
                size="sm" 
                className="w-full bg-red-950 hover:bg-red-900 text-red-200 border border-red-900"
                onClick={() => deleteMutation.mutate(item.id)}
                disabled={deleteMutation.isPending}
              >
                Delete
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
      {homebrewList?.length === 0 && (
        <div className="text-center py-12 text-zinc-500 italic">No homebrew content found.</div>
      )}
    </div>
  );
}
