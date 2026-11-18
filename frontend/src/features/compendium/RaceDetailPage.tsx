import { useParams, Link } from 'react-router-dom';
import { useRace } from '../../api/useRaces';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../../components/ui/badge';
import { QueryError } from '@/components/common/QueryError';

export default function RaceDetailPage() {
  const { id } = useParams();
  const { data: race, isLoading, isError, refetch } = useRace(id);

  if (isLoading) return <div className="p-6"><Skeleton className="h-64 w-full bg-[#f8f5ed]" /></div>;
  if (isError) return <div className="p-6"><QueryError message="No se pudo cargar la raza." onRetry={() => void refetch()} /></div>;
  if (!race) return <div className="p-6 text-[#26342e]">Raza no encontrada.</div>;

  return (
    <div className="space-y-6">
      <Link to="/races">
        <Button variant="outline" className="border-[#e7e0d1] text-[#19352b] bg-[#fffdf8] hover:bg-[#f3efe4] transition-colors">
          &larr; Volver a Razas
        </Button>
      </Link>

      <div className="contenido-panel space-y-6">
        <div className="border-b border-[#e7e0d1] pb-4">
          <p className="text-xs font-bold uppercase tracking-widest text-[#bd7446]">Ficha de Raza</p>
          <h1 className="text-4xl font-serif font-bold text-[#19352b] mt-1">{race.name}</h1>
          <p className="text-[#68756c] text-sm mt-1">
            Tamaño: <span className="font-bold text-[#19352b]">{race.size}</span> | Velocidad: <span className="font-bold text-[#19352b]">{race.speed} pies</span>
          </p>
        </div>

        <div className="bg-[#fffdf8] p-6 rounded-lg border border-[#e7e0d1] space-y-4">
          <h2 className="text-xl font-serif font-bold text-[#19352b]">Descripción</h2>
          <p className="text-[#26342e] leading-relaxed whitespace-pre-wrap">{race.description}</p>

          <h3 className="text-lg font-serif font-bold text-[#19352b] mt-6">Bonificadores de Atributo</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(race.ability_bonuses).map(([ab, val]) => (
              <Badge key={ab} className="bg-[#f3efe4] text-[#19352b] border border-[#e7e0d1] font-bold text-sm px-3 py-1">
                {ab.toUpperCase()} +{val}
              </Badge>
            ))}
          </div>

          <h3 className="text-lg font-serif font-bold text-[#19352b] mt-6">Idiomas Conocidos</h3>
          <div className="flex flex-wrap gap-2">
            {race.languages.map((lang) => (
              <Badge key={lang} variant="outline" className="border-[#e7e0d1] text-[#26342e] bg-[#f8f5ed]">
                {lang}
              </Badge>
            ))}
          </div>

          {race.traits && race.traits.length > 0 && (
            <div className="mt-8 border-t border-[#e7e0d1] pt-6">
              <h3 className="text-xl font-serif font-bold text-[#19352b] mb-4">Rasgos Raciales</h3>
              <div className="space-y-4">
                {race.traits.map((trait, idx) => (
                  <div key={idx} className="bg-[#f8f5ed] p-4 rounded-lg border border-[#e7e0d1]">
                    <h4 className="font-bold text-[#bd7446]">{trait.name}</h4>
                    <p className="text-xs text-[#26342e] leading-relaxed mt-1">{trait.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
