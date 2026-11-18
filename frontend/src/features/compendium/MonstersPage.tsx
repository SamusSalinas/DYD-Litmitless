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
    <div className="space-y-6">
      <header className="cabecera">
        <div className="cabecera-contenido">
          <div className="marca-emblema">🐉</div>
          <div>
            <p className="marca-kicker">Bestiario Oficial</p>
            <h1>Monstruos y Criaturas</h1>
            <p className="marca-descripcion">
              Estadísticas, valor de desafío (CR), puntos de golpe y acciones de combate del SRD 5.1.
            </p>
          </div>
        </div>
      </header>

      <div className="contenido-panel">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6 p-4 bg-[#f8f5ed] border border-[#e7e0d1] rounded-lg">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1">Nombre</label>
            <Input
              placeholder="Buscar criatura..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="bg-white border-[#e7e0d1] text-[#26342e] focus:border-[#19352b]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1">Desafío (CR)</label>
            <Select value={crFilter} onValueChange={setCrFilter}>
              <SelectTrigger className="bg-white border-[#e7e0d1] text-[#26342e]">
                <SelectValue placeholder="CR" />
              </SelectTrigger>
              <SelectContent className="bg-[#fffdf8] border-[#e7e0d1] text-[#26342e]">
                <SelectItem value="all">Todos los CR</SelectItem>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="0.125">1/8</SelectItem>
                <SelectItem value="0.25">1/4</SelectItem>
                <SelectItem value="0.5">1/2</SelectItem>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 15, 20, 30].map((cr) => (
                  <SelectItem key={cr} value={cr.toString()}>{cr}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1">Tipo</label>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="bg-white border-[#e7e0d1] text-[#26342e]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent className="bg-[#fffdf8] border-[#e7e0d1] text-[#26342e]">
                <SelectItem value="all">Todos los tipos</SelectItem>
                {['Aberration', 'Beast', 'Celestial', 'Construct', 'Dragon', 'Elemental', 'Fey', 'Fiend', 'Giant', 'Humanoid', 'Monstrosity', 'Ooze', 'Plant', 'Undead'].map((t) => (
                  <SelectItem key={t} value={t.toLowerCase()}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1">Tamaño</label>
            <Select value={sizeFilter} onValueChange={setSizeFilter}>
              <SelectTrigger className="bg-white border-[#e7e0d1] text-[#26342e]">
                <SelectValue placeholder="Tamaño" />
              </SelectTrigger>
              <SelectContent className="bg-[#fffdf8] border-[#e7e0d1] text-[#26342e]">
                <SelectItem value="all">Todos los tamaños</SelectItem>
                {['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan'].map((s) => (
                  <SelectItem key={s} value={s.toLowerCase()}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border border-[#e7e0d1] rounded-lg overflow-hidden">
          <Table>
            <TableHeader className="bg-[#f8f5ed]">
              <TableRow className="border-[#e7e0d1]">
                <TableHead className="text-[#19352b] font-bold">Criatura</TableHead>
                <TableHead className="text-[#19352b] font-bold">Tipo</TableHead>
                <TableHead className="text-[#19352b] font-bold">CR</TableHead>
                <TableHead className="text-[#19352b] font-bold">CA</TableHead>
                <TableHead className="text-[#19352b] font-bold">Puntos de Golpe</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i} className="border-[#e7e0d1]">
                    <TableCell><Skeleton className="h-4 w-32 bg-[#f8f5ed]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-24 bg-[#f8f5ed]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 bg-[#f8f5ed]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-12 bg-[#f8f5ed]" /></TableCell>
                    <TableCell><Skeleton className="h-4 w-16 bg-[#f8f5ed]" /></TableCell>
                  </TableRow>
                ))
              ) : isError ? (
                <TableRow>
                  <TableCell colSpan={5}>
                    <QueryError message="No se pudieron cargar los monstruos." onRetry={() => void refetch()} />
                  </TableCell>
                </TableRow>
              ) : !monsters?.length ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-[#68756c] text-center py-6 italic">
                    No se encontraron monstruos con los filtros seleccionados.
                  </TableCell>
                </TableRow>
              ) : (
                monsters.map((monster) => (
                  <TableRow key={monster.id} className="border-[#e7e0d1] hover:bg-[#f8f5ed] transition-colors">
                    <TableCell>
                      <Link to={`/monsters/${monster.id}`} className="font-bold text-[#86502f] hover:text-[#19352b] transition-colors underline">
                        {monster.name}
                      </Link>
                      <div className="text-xs text-[#68756c] mt-0.5">
                        {monster.size} {monster.alignment}
                      </div>
                    </TableCell>
                    <TableCell className="text-[#26342e]">{monster.type}</TableCell>
                    <TableCell className="font-bold text-[#19352b]">{monster.challenge_rating}</TableCell>
                    <TableCell className="text-[#26342e]">{monster.armor_class}</TableCell>
                    <TableCell className="text-[#26342e]">{monster.hit_points} ({monster.hit_dice})</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
