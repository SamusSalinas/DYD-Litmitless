import { useParams, Link } from 'react-router-dom';
import { useRace } from '../../api/useRaces';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { Badge } from '../../components/ui/badge';
import { QueryError } from '@/components/common/QueryError';

export default function RaceDetailPage() {
  const { id } = useParams();
  const { data: race, isLoading, isError, refetch } = useRace(id);

  if (isLoading) return <div className="p-6 bg-zinc-950 min-h-screen"><Skeleton className="h-64 w-full bg-zinc-800" /></div>;
  if (isError) return <div className="p-6 bg-zinc-950 min-h-screen"><QueryError message="Could not load this race." onRetry={() => void refetch()} /></div>;
  if (!race) return <div className="p-6 bg-zinc-950 text-white min-h-screen">Race not found</div>;

  return (
    <div className="p-6 bg-zinc-950 text-zinc-100 min-h-screen max-w-4xl mx-auto">
      <Link to="/races">
        <Button variant="outline" className="mb-6 border-zinc-700 text-zinc-300 hover:bg-zinc-800">
          &larr; Back to Races
        </Button>
      </Link>

      <div className="mb-8 border-b border-zinc-800 pb-6">
        <h1 className="text-5xl font-serif text-red-600 mb-4">{race.name}</h1>
        <p className="text-zinc-300 leading-relaxed text-lg">{race.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <div className="bg-zinc-900 p-6 rounded-md border border-zinc-800">
          <h3 className="text-xl font-serif text-red-400 mb-4">Traits</h3>
          <div className="space-y-4">
            <div>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-1">Speed</p>
              <p className="text-zinc-300">{race.speed} ft.</p>
            </div>
            <div>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-1">Size</p>
              <p className="text-zinc-300">{race.size}</p>
            </div>
            <div>
              <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider mb-1">Languages</p>
              <p className="text-zinc-300">{race.languages.join(', ')}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-zinc-900 p-6 rounded-md border border-zinc-800 md:col-span-2">
          <h3 className="text-xl font-serif text-red-400 mb-4">Ability Score Increase</h3>
          <div className="flex gap-3 flex-wrap mb-6">
            {Object.entries(race.ability_bonuses).map(([ab, val]) => (
              <Badge key={ab} className="bg-zinc-800 text-zinc-200 px-3 py-1 text-sm">
                {ab.toUpperCase()} +{val}
              </Badge>
            ))}
          </div>

          <h3 className="text-xl font-serif text-red-400 mb-4">Special Traits</h3>
          <div className="space-y-4">
            {race.traits.map(trait => (
              <div key={trait.name}>
                <h4 className="font-bold text-zinc-200">{trait.name}</h4>
                <p className="text-zinc-400">{trait.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {race.subraces && race.subraces.length > 0 && (
        <div className="bg-zinc-900 p-6 rounded-md border border-zinc-800">
          <h3 className="text-2xl font-serif text-red-400 mb-4">Subraces</h3>
          <div className="space-y-6">
            {race.subraces.map(sub => (
              <div key={sub.name} className="border-l-2 border-red-900 pl-4">
                <h4 className="text-xl font-bold text-zinc-200 mb-2">{sub.name}</h4>
                <p className="text-zinc-400">{sub.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
