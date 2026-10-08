import { useRaces } from '../../api/useRaces';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router-dom';
import { Skeleton } from '../../components/ui/skeleton';
import { QueryError } from '@/components/common/QueryError';

export default function RacesPage() {
  const { data: races, isLoading, isError, refetch } = useRaces();

  return (
    <div className="p-6 bg-zinc-950 text-zinc-100 min-h-screen">
      <h1 className="text-4xl font-serif text-red-700 mb-6 border-b border-red-900 pb-2">Races</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-48 bg-zinc-900 rounded-lg" />)
        ) : isError ? (
          <QueryError message="Could not load races." onRetry={() => void refetch()} />
        ) : !races?.length ? (
          <p className="text-zinc-400">No races found. Load the sample compendium to get started.</p>
        ) : races.map(race => (
          <Link key={race.id} to={`/races/${race.id}`}>
            <Card className="bg-zinc-900 border-zinc-800 hover:border-red-900 transition-colors h-full flex flex-col cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-serif text-red-500 flex justify-between items-center">
                  {race.name}
                  <span className="text-sm font-sans text-zinc-400">{race.size}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <div className="mb-4">
                  <p className="text-zinc-400 text-sm">Speed: {race.speed} ft.</p>
                </div>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Ability Bonuses</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(race.ability_bonuses).map(([ab, val]) => (
                      <Badge key={ab} variant="secondary" className="bg-zinc-800">
                        {ab.toUpperCase()} +{val}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
