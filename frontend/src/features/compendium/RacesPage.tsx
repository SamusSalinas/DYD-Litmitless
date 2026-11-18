import { useRaces } from '../../api/useRaces';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router-dom';
import { Skeleton } from '../../components/ui/skeleton';
import { QueryError } from '@/components/common/QueryError';

export default function RacesPage() {
  const { data: races, isLoading, isError, refetch } = useRaces();

  return (
    <div className="space-y-6">
      <header className="cabecera">
        <div className="cabecera-contenido">
          <div className="marca-emblema">🧝</div>
          <div>
            <p className="marca-kicker">Linajes Fantásticos</p>
            <h1>Razas de Personaje</h1>
            <p className="marca-descripcion">
              Explora las razas jugables del SRD 5.1, sus rasgos culturales, velocidad y bonificadores de característica.
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 bg-[#f8f5ed] rounded-lg" />)
        ) : isError ? (
          <QueryError message="No se pudieron cargar las razas." onRetry={() => void refetch()} />
        ) : !races?.length ? (
          <p className="text-[#68756c] italic col-span-3 text-center py-8">
            No se encontraron razas en el compendio.
          </p>
        ) : (
          races.map((race) => (
            <Link key={race.id} to={`/races/${race.id}`} className="no-underline block">
              <Card className="bg-[#fffdf8] border-[#e7e0d1] hover:border-[#19352b] transition-all duration-300 h-full flex flex-col cursor-pointer group hover:shadow-md hover:-translate-y-0.5">
                <CardHeader className="pb-2 border-b border-[#e7e0d1]">
                  <CardTitle className="text-2xl font-serif text-[#19352b] group-hover:text-[#bd7446] transition-colors flex justify-between items-center">
                    {race.name}
                    <span className="text-xs font-bold font-sans px-2.5 py-1 rounded bg-[#f3efe4] text-[#19352b] border border-[#e7e0d1]">
                      {race.size}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between pt-4">
                  <div className="mb-4">
                    <p className="text-[#68756c] text-sm">Velocidad: <span className="font-bold text-[#19352b]">{race.speed} pies</span></p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-[#68756c] uppercase tracking-wider mb-2">Bonificadores de Atributo</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(race.ability_bonuses).map(([ab, val]) => (
                        <Badge key={ab} variant="secondary" className="bg-[#f3efe4] text-[#19352b] border border-[#e7e0d1] font-bold">
                          {ab.toUpperCase()} +{val}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
