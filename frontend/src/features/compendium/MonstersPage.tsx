import { useState } from 'react';
import { useMonsters } from '../../api/useMonsters';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Skeleton } from '../../components/ui/skeleton';
import { Link } from 'react-router-dom';
import { QueryError } from '@/components/common/QueryError';

export default function MonstersPage() {
  const [nameFilter, setNameFilter] = useState('');
  const [crFilter, setCrFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [sizeFilter, setSizeFilter] = useState('all');

  const { data: monsters, isLoading, isError, refetch } = useMonsters({
    name: nameFilter || undefined,
    challenge_rating: crFilter !== 'all' ? parseFloat(crFilter) : undefined,
    type: typeFilter !== 'all' ? typeFilter : undefined,
    size: sizeFilter !== 'all' ? sizeFilter : undefined,
  });

  return (
    <div className="p-6 bg-zinc-950 text-zinc-100 min-h-screen">
      <h1 className="text-4xl font-serif text-red-700 mb-6 border-b border-red-900 pb-2">Monsters</h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <Input 
          placeholder="Search monsters..." 
          value={nameFilter} 
          onChange={(e) => setNameFilter(e.target.value)} 
          className="bg-zinc-900 border-zinc-700 text-white md:w-1/4"
        />
        <Select value={crFilter} onValueChange={setCrFilter}>
          <SelectTrigger className="w-full md:w-[150px] bg-zinc-900 border-zinc-700">
            <SelectValue placeholder="CR" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
            <SelectItem value="all">All CRs</SelectItem>
            <SelectItem value="0">0</SelectItem>
            <SelectItem value="0.125">1/8</SelectItem>
            <SelectItem value="0.25">1/4</SelectItem>
            <SelectItem value="0.5">1/2</SelectItem>
            {[1,2,3,4,5,6,7,8,9,10,15,20,30].map(cr => (
              <SelectItem key={cr} value={cr.toString()}>{cr}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-zinc-900 border-zinc-700">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
            <SelectItem value="all">All Types</SelectItem>
            {['Aberration','Beast','Celestial','Construct','Dragon','Elemental','Fey','Fiend','Giant','Humanoid','Monstrosity','Ooze','Plant','Undead'].map(t => (
              <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={sizeFilter} onValueChange={setSizeFilter}>
          <SelectTrigger className="w-full md:w-[180px] bg-zinc-900 border-zinc-700">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
            <SelectItem value="all">All Sizes</SelectItem>
            {['Tiny','Small','Medium','Large','Huge','Gargantuan'].map(s => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="border border-zinc-800 rounded-md overflow-hidden bg-zinc-900">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-800 hover:bg-zinc-800">
              <TableHead className="text-zinc-400">Name</TableHead>
              <TableHead className="text-zinc-400">Type</TableHead>
              <TableHead className="text-zinc-400">Size</TableHead>
              <TableHead className="text-zinc-400">CR</TableHead>
              <TableHead className="text-zinc-400">HP</TableHead>
              <TableHead className="text-zinc-400">AC</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({length: 5}).map((_, i) => (
                <TableRow key={i} className="border-zinc-800">
                  <TableCell><Skeleton className="h-4 w-32 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-20 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-16 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-8 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 bg-zinc-800" /></TableCell>
                  <TableCell><Skeleton className="h-4 w-12 bg-zinc-800" /></TableCell>
                </TableRow>
              ))
            ) : isError ? (
              <TableRow><TableCell colSpan={6}><QueryError message="Could not load monsters." onRetry={() => void refetch()} /></TableCell></TableRow>
            ) : !monsters?.length ? (
              <TableRow><TableCell colSpan={6} className="text-zinc-400">No monsters found.</TableCell></TableRow>
            ) : monsters.map(monster => (
              <TableRow key={monster.id} className="border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                <TableCell>
                  <Link to={`/monsters/${monster.id}`} className="text-red-400 hover:text-red-300 font-medium">
                    {monster.name}
                  </Link>
                </TableCell>
                <TableCell className="capitalize">{monster.type}</TableCell>
                <TableCell>{monster.size}</TableCell>
                <TableCell>{monster.challenge_rating}</TableCell>
                <TableCell>{monster.hit_points}</TableCell>
                <TableCell>{monster.armor_class}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
