import { useParams, Link } from 'react-router-dom';
import { useSpell } from '../../api/useSpells';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { QueryError } from '@/components/common/QueryError';

export default function SpellDetailPage() {
  const { id } = useParams();
  const { data: spell, isLoading, isError, refetch } = useSpell(id ?? '');

  if (isLoading) return <div className="p-6"><Skeleton className="h-64 w-full bg-[#f8f5ed]" /></div>;
  if (isError) return <div className="p-6"><QueryError message="No se pudo cargar este hechizo." onRetry={() => void refetch()} /></div>;
  if (!spell) return <div className="p-6 text-[#26342e]">Hechizo no encontrado.</div>;

  return (
    <div className="space-y-6">
      <Link to="/spells">
        <Button variant="outline" className="border-[#e7e0d1] text-[#19352b] bg-[#fffdf8] hover:bg-[#f3efe4] transition-colors">
          &larr; Volver a las listas de hechizos
        </Button>
      </Link>

      <div className="contenido-panel space-y-6">
        <div className="border-b border-[#e7e0d1] pb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#bd7446]">Ficha Técnica del Hechizo</p>
          <h1 className="text-3xl font-serif font-bold text-[#19352b] mt-1">{spell.name}</h1>
        </div>

        {/* Tabla de metadatos (Estilo ver_hechizo.php) */}
        <div className="overflow-x-auto rounded-lg border border-[#e7e0d1]">
          <table className="tabla-objetos-magicos">
            <tbody>
              <tr>
                <th scope="row" className="w-1/3 bg-[#f8f5ed] text-[#19352b]">Nivel</th>
                <td className="text-[#26342e]">
                  {spell.level === 0 ? 'Truco / Nivel 0' : `Nivel ${spell.level}`}
                </td>
              </tr>
              <tr>
                <th scope="row" className="bg-[#f8f5ed] text-[#19352b]">Escuela de Magia</th>
                <td className="text-[#26342e]">{spell.school}</td>
              </tr>
              <tr>
                <th scope="row" className="bg-[#f8f5ed] text-[#19352b]">Tiempo de lanzamiento</th>
                <td className="text-[#26342e]">{spell.casting_time}</td>
              </tr>
              <tr>
                <th scope="row" className="bg-[#f8f5ed] text-[#19352b]">Alcance</th>
                <td className="text-[#26342e]">{spell.range}</td>
              </tr>
              <tr>
                <th scope="row" className="bg-[#f8f5ed] text-[#19352b]">Componentes</th>
                <td className="text-[#26342e]">
                  {spell.components} {spell.material && <span className="text-[#68756c]">({spell.material})</span>}
                </td>
              </tr>
              <tr>
                <th scope="row" className="bg-[#f8f5ed] text-[#19352b]">Duración</th>
                <td className="text-[#26342e]">
                  {spell.duration} {spell.concentration && <span className="ml-2 font-bold text-[#bd7446]">(Concentración)</span>}
                  {spell.ritual && <span className="ml-2 font-bold text-[#19352b]">(Ritual)</span>}
                </td>
              </tr>
              <tr>
                <th scope="row" className="bg-[#f8f5ed] text-[#19352b]">Clases permitidas</th>
                <td className="text-[#26342e]">
                  {spell.classes?.length ? spell.classes.join(', ') : 'Cualquiera'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Sección de Descripción */}
        <div>
          <h2 className="text-xl font-serif font-bold text-[#19352b] mb-3">Descripción</h2>
          <div className="bg-[#f8f5ed] p-5 rounded-lg border border-[#e7e0d1] text-[#26342e] leading-relaxed whitespace-pre-wrap">
            {spell.description}
          </div>
        </div>

        {spell.higher_levels && (
          <div>
            <h2 className="text-lg font-serif font-bold text-[#19352b] mb-2">A Niveles Superiores</h2>
            <div className="bg-[#fffefa] p-4 rounded-lg border border-[#e7e0d1] text-[#26342e] space-y-2">
              {Object.entries(spell.higher_levels).map(([lvl, desc]) => (
                <p key={lvl}><strong className="text-[#19352b]">Nivel {lvl}:</strong> {desc}</p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
