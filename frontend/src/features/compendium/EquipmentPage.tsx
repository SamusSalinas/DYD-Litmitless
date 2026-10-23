import { Fragment, useState } from 'react';
import { useEquipment } from '../../api/useEquipment';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Skeleton } from '../../components/ui/skeleton';
import { QueryError } from '@/components/common/QueryError';

export default function EquipmentPage() {
  const [nameFilter, setNameFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const { data: equipmentList, isLoading, isError, refetch } = useEquipment({
    name: nameFilter || undefined,
    category: categoryFilter !== 'all' ? categoryFilter : undefined,
  });

  return (
    <div className="p-6 text-zinc-100">
      <h1 className="text-4xl font-serif text-dnd-gold mb-6 border-b border-dnd-teal/30 pb-2">Equipment</h1>
      
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input 
          placeholder="Search equipment..." 
          value={nameFilter} 
          onChange={(e) => setNameFilter(e.target.value)} 
          className="bg-dnd-card border-dnd-border text-white w-full md:w-1/3 focus:border-dnd-teal"
        />
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-full md:w-[220px] bg-dnd-card border-dnd-border">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent className="bg-dnd-surface border-dnd-border text-white">
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="Weapon">Weapon</SelectItem>
            <SelectItem value="Armor">Armor</SelectItem>
            <SelectItem value="Adventuring Gear">Adventuring Gear</SelectItem>
            <SelectItem value="Tools">Tools</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="border border-dnd-border rounded-md overflow-hidden bg-dnd-card">
        <Table>
          <TableHeader>
            <TableRow className="border-dnd-border hover:bg-dnd-surface">
              <TableHead className="text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">Category</TableHead>
              <TableHead className="text-zinc-400">Cost</TableHead>
              <TableHead className="text-zinc-400">Weight (lbs)</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({length: 5}).map((_, i) => (
                <TableRow key={i} className="border-dnd-border">
                  <TableCell><Skeleton className="h-4 w-32 bg-dnd-surface" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24 bg-dnd-surface" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 bg-dnd-surface" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8 bg-dnd-surface" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow><TableCell colSpan={4}><QueryError message="Could not load equipment." onRetry={() => void refetch()} /></TableCell></TableRow>
            ) : !equipmentList?.length ? (
              <TableRow><TableCell colSpan={4} className="text-zinc-400">No equipment found.</TableCell></TableRow>
            ) : equipmentList.map(item => (
              <Fragment key={item.id}>
                <TableRow 
                  className="border-dnd-border hover:bg-dnd-surface/50 transition-colors cursor-pointer"
                  onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                >
                  <TableCell className="text-dnd-teal font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}{item.subcategory ? ` (${item.subcategory})` : ''}</TableCell>
                  <TableCell>{item.cost}</TableCell>
                  <TableCell>{item.weight ?? '-'}</TableCell>
                </TableRow>
                {expandedId === item.id && (
                  <TableRow className="border-dnd-border bg-dnd-bg/50">
                    <TableCell colSpan={4} className="p-4">
                      <div className="text-zinc-300 space-y-2">
                        {item.properties && Object.keys(item.properties).length > 0 && (
                          <div className="flex gap-2 flex-wrap text-sm mb-2">
                            {Object.entries(item.properties).map(([k, v]) => (
                              <span key={k} className="bg-dnd-surface px-2 py-1 rounded text-zinc-400">
                                {k}: {JSON.stringify(v)}
                              </span>
                            ))}
                          </div>
                        )}
                        {item.description ? (
                          <p className="whitespace-pre-wrap">{item.description}</p>
                        ) : (
                          <p className="italic text-zinc-500">No description available.</p>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
