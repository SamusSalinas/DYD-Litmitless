import { useState } from 'react';
import { useSpells } from '../../api/useSpells';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Skeleton } from '../../components/ui/skeleton';
import { Link } from 'react-router-dom';
import { QueryError } from '@/components/common/QueryError';

export default function SpellsPage() {
  const [nameFilter, setNameFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');

  const { data: spells, isLoading, isError, refetch } = useSpells({
    name: nameFilter || undefined,
    level: levelFilter !== 'all' ? parseInt(levelFilter) : undefined,
    school: schoolFilter !== 'all' ? schoolFilter : undefined
  });

  return (
    <div className="p-6 text-zinc-100">
      <h1 className="text-4xl font-serif text-dnd-gold mb-6 border-b border-dnd-teal/30 pb-2">Spells</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input 
          placeholder="Search spells..." 
          value={nameFilter} 
          onChange={(e) => setNameFilter(e.target.value)} 
          className="bg-dnd-card border-dnd-border text-white w-full md:w-1/3 focus:border-dnd-teal"
        />
        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-dnd-card border-dnd-border">
            <SelectValue placeholder="Level" />
          </SelectTrigger>
          <SelectContent className="bg-dnd-surface border-dnd-border text-white">
            <SelectItem value="all">All Levels</SelectItem>
            {[0,1,2,3,4,5,6,7,8,9].map(l => (
              <SelectItem key={l} value={l.toString()}>{l === 0 ? 'Cantrip' : `Level ${l}`}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={schoolFilter} onValueChange={setSchoolFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-dnd-card border-dnd-border">
            <SelectValue placeholder="School" />
          </SelectTrigger>
          <SelectContent className="bg-dnd-surface border-dnd-border text-white">
            <SelectItem value="all">All Schools</SelectItem>
            {['Abjuration','Conjuration','Divination','Enchantment','Evocation','Illusion','Necromancy','Transmutation'].map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border border-dnd-border rounded-md overflow-hidden bg-dnd-card">
        <Table>
          <TableHeader>
            <TableRow className="border-dnd-border hover:bg-dnd-surface">
              <TableHead className="text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">Level</TableHead>
              <TableHead className="text-zinc-400">School</TableHead>
              <TableHead className="text-zinc-400">Casting Time</TableHead>
              <TableHead className="text-zinc-400">Range</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({length: 5}).map((_, i) => (
                <TableRow key={i} className="border-dnd-border">
                  <TableCell><Skeleton className="h-4 w-32 bg-dnd-surface" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 bg-dnd-surface" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24 bg-dnd-surface" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24 bg-dnd-surface" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-24 bg-dnd-surface" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow><TableCell colSpan={5}><QueryError message="Could not load spells." onRetry={() => void refetch()} /></TableCell></TableRow>
            ) : !spells?.length ? (
              <TableRow><TableCell colSpan={5} className="text-zinc-400">No spells found.</TableCell></TableRow>
            ) : spells.map(spell => (
              <TableRow key={spell.id} className="border-dnd-border hover:bg-dnd-surface/50 transition-colors">
                <TableCell>
                  <Link to={`/spells/${spell.id}`} className="text-dnd-teal hover:text-dnd-gold font-medium transition-colors">
                    {spell.name}
                  </Link>
                  <div className="flex gap-2 mt-1 text-xs text-zinc-500">
                    {spell.ritual && <span className="bg-dnd-surface px-1 rounded">Ritual</span>}
                    {spell.concentration && <span className="bg-dnd-surface px-1 rounded">Conc</span>}
                  </div>
                </TableCell>
                <TableCell>{spell.level === 0 ? 'Cantrip' : spell.level}</TableCell>
                <TableCell>{spell.school}</TableCell>
                <TableCell>{spell.casting_time}</TableCell>
                <TableCell>{spell.range}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
