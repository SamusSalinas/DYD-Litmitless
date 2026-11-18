import { useState, useMemo } from 'react';
import { Sparkles } from 'lucide-react';
import { useSpells } from '../../api/useSpells';
import { Input } from '../../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Skeleton } from '../../components/ui/skeleton';
import { Link } from 'react-router-dom';
import { QueryError } from '@/components/common/QueryError';
import type { Spell } from '../../types/spell';

const CLASES_MAGICAS = [
  { slug: 'all', nombre: 'Todas las clases' },
  { slug: 'Bard', nombre: 'Bard' },
  { slug: 'Cleric', nombre: 'Cleric' },
  { slug: 'Druid', nombre: 'Druid' },
  { slug: 'Paladin', nombre: 'Paladin' },
  { slug: 'Ranger', nombre: 'Ranger' },
  { slug: 'Sorcerer', nombre: 'Sorcerer' },
  { slug: 'Warlock', nombre: 'Warlock' },
  { slug: 'Wizard', nombre: 'Wizard' },
];

const ESCUELAS = [
  'Abjuration',
  'Conjuration',
  'Divination',
  'Enchantment',
  'Evocation',
  'Illusion',
  'Necromancy',
  'Transmutation',
];

export default function SpellsPage() {
  const [nameFilter, setNameFilter] = useState('');
  const [classFilter, setClassFilter] = useState('all');
  const [schoolFilter, setSchoolFilter] = useState('all');

  const { data: spells, isLoading, isError, refetch } = useSpells();

  const filteredSpells = useMemo(() => {
    if (!spells) return [];
    return spells.filter((spell) => {
      const matchName = !nameFilter || spell.name.toLowerCase().includes(nameFilter.toLowerCase());
      const matchSchool = schoolFilter === 'all' || spell.school.toLowerCase() === schoolFilter.toLowerCase();
      const matchClass =
        classFilter === 'all' ||
        (spell.classes && spell.classes.some((c) => c.toLowerCase() === classFilter.toLowerCase()));
      return matchName && matchSchool && matchClass;
    });
  }, [spells, nameFilter, classFilter, schoolFilter]);

  // Agrupar hechizos por nivel
  const spellsByLevel = useMemo(() => {
    const grouped: Record<number, Spell[]> = {};
    filteredSpells.forEach((spell) => {
      const lvl = spell.level ?? 0;
      if (!grouped[lvl]) grouped[lvl] = [];
      grouped[lvl].push(spell);
    });
    // Ordenar alfabéticamente dentro de cada nivel
    Object.keys(grouped).forEach((k) => {
      grouped[Number(k)].sort((a, b) => a.name.localeCompare(b.name));
    });
    return grouped;
  }, [filteredSpells]);

  const sortedLevels = useMemo(() => {
    return Object.keys(spellsByLevel)
      .map(Number)
      .sort((a, b) => a - b);
  }, [spellsByLevel]);

  return (
    <div className="space-y-6">
      {/* Cabecera estilo compendio Proyecto */}
      <header className="cabecera">
        <div className="cabecera-contenido">
          <div className="marca-emblema">
            <Sparkles className="size-8 text-[#19352b]" />
          </div>
          <div>
            <p className="marca-kicker">Compendio de Magia</p>
            <h1>Hechizos y Conjuros</h1>
            <p className="marca-descripcion">
              Listas de hechizos organizadas por nivel y en orden alfabético según el SRD 5.1.
            </p>
          </div>
        </div>
      </header>

      {/* Panel principal de contenido */}
      <div className="contenido-panel">
        {/* Barra de filtros */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6 p-4 bg-[#f8f5ed] border border-[#e7e0d1] rounded-lg">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1">
              Buscar por nombre
            </label>
            <Input
              placeholder="Ej: Fireball, Cure Wounds..."
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
              className="bg-white border-[#e7e0d1] text-[#26342e] focus:border-[#19352b]"
            />
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1">
              Clase Mágica
            </label>
            <Select value={classFilter} onValueChange={setClassFilter}>
              <SelectTrigger className="bg-white border-[#e7e0d1] text-[#26342e]">
                <SelectValue placeholder="Clase" />
              </SelectTrigger>
              <SelectContent className="bg-[#fffdf8] border-[#e7e0d1] text-[#26342e]">
                {CLASES_MAGICAS.map((c) => (
                  <SelectItem key={c.slug} value={c.slug}>
                    {c.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1">
              Escuela de Magia
            </label>
            <Select value={schoolFilter} onValueChange={setSchoolFilter}>
              <SelectTrigger className="bg-white border-[#e7e0d1] text-[#26342e]">
                <SelectValue placeholder="Escuela" />
              </SelectTrigger>
              <SelectContent className="bg-[#fffdf8] border-[#e7e0d1] text-[#26342e]">
                <SelectItem value="all">Todas las escuelas</SelectItem>
                {ESCUELAS.map((s) => (
                  <SelectItem key={s} value={s}>
                    {s}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Estado de carga y errores */}
        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-8 w-48 bg-[#e7e0d1]" />
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <Skeleton key={i} className="h-20 bg-[#f8f5ed] rounded-lg" />
              ))}
            </div>
          </div>
        )}

        {isError && (
          <QueryError message="No se pudo cargar el catálogo de hechizos." onRetry={() => void refetch()} />
        )}

        {!isLoading && !isError && sortedLevels.length === 0 && (
          <p className="p-8 text-center text-[#68756c] italic">
            No se encontraron hechizos que coincidan con los filtros seleccionados.
          </p>
        )}

        {/* Lista de hechizos agrupados por nivel */}
        {!isLoading &&
          !isError &&
          sortedLevels.map((lvl) => {
            const list = spellsByLevel[lvl];
            return (
              <section key={lvl} className="hechizos-nivel">
                <h3>
                  <span>{lvl === 0 ? 'Trucos (nivel 0)' : `Nivel ${lvl}`}</span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#f3efe4] text-[#68756c] border border-[#e7e0d1]">
                    {list.length} {list.length === 1 ? 'hechizo' : 'hechizos'}
                  </span>
                </h3>

                <ul className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2.5 mt-3 list-none p-0">
                  {list.map((spell) => (
                    <li key={spell.id} className="min-w-0">
                      <details className="hechizo-detalle group">
                        <summary className="hechizo-item">
                          <span className="font-semibold text-[#19352b]">{spell.name}</span>
                          <span className="hechizo-indicacion">Ver detalles ›</span>
                        </summary>

                        <div className="hechizo-informacion">
                          <dl className="hechizo-metadatos">
                            <div>
                              <dt>Nivel</dt>
                              <dd>{spell.level === 0 ? 'Truco (nivel 0)' : `Nivel ${spell.level}`}</dd>
                            </div>
                            {spell.school && (
                              <div>
                                <dt>Escuela</dt>
                                <dd>{spell.school}</dd>
                              </div>
                            )}
                            {spell.casting_time && (
                              <div>
                                <dt>Lanzamiento</dt>
                                <dd>{spell.casting_time}</dd>
                              </div>
                            )}
                            {spell.range && (
                              <div>
                                <dt>Alcance</dt>
                                <dd>{spell.range}</dd>
                              </div>
                            )}
                            {spell.duration && (
                              <div>
                                <dt>Duración</dt>
                                <dd>{spell.duration}</dd>
                              </div>
                            )}
                          </dl>

                          <div className="text-xs text-[#26342e] line-clamp-4 leading-relaxed mb-3 whitespace-pre-line">
                            {spell.description || 'Descripción no disponible.'}
                          </div>

                          <div className="pt-2 border-t border-[#e7e0d1] flex justify-between items-center text-xs">
                            <span className="text-[#68756c] italic">
                              {spell.classes?.length ? spell.classes.join(', ') : 'SRD 5.1'}
                            </span>
                            <Link
                              to={`/spells/${spell.id}`}
                              className="font-bold text-[#bd7446] hover:text-[#19352b] transition-colors"
                            >
                              Ficha completa &rarr;
                            </Link>
                          </div>
                        </div>
                      </details>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
      </div>
    </div>
  );
}
