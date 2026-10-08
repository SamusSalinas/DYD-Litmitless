import { useParams, Link } from 'react-router-dom';
import { useMonster } from '../../api/useMonsters';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { StatBlock } from '../../components/common/StatBlock';
import { QueryError } from '@/components/common/QueryError';

export default function MonsterDetailPage() {
  const { id } = useParams();
  const { data: monster, isLoading, isError, refetch } = useMonster(id);

  if (isLoading) return <div className="p-6 bg-zinc-950 min-h-screen"><Skeleton className="h-64 max-w-md bg-zinc-800" /></div>;
  if (isError) return <div className="p-6 bg-zinc-950 min-h-screen"><QueryError message="Could not load this monster." onRetry={() => void refetch()} /></div>;
  if (!monster) return <div className="p-6 bg-zinc-950 text-white min-h-screen">Monster not found</div>;

  return (
    <div className="p-6 bg-zinc-950 text-zinc-100 min-h-screen flex flex-col items-center">
      <div className="w-full max-w-4xl mb-6">
        <Link to="/monsters">
          <Button variant="outline" className="border-zinc-700 text-zinc-300 hover:bg-zinc-800">
            &larr; Back to Monsters
          </Button>
        </Link>
      </div>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-4xl justify-center">
        <StatBlock monster={monster} />
        
        {monster.description && (
          <div className="flex-1 text-zinc-300 bg-zinc-900 p-6 rounded border border-zinc-800">
            <h2 className="text-2xl font-serif text-red-500 mb-4">Lore</h2>
            <p className="whitespace-pre-wrap leading-relaxed">{monster.description}</p>
          </div>
        )}
      </div>
    </div>
  );
}
