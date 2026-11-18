import { useParams, Link } from 'react-router-dom';
import { useMonster } from '../../api/useMonsters';
import { StatBlock } from '../../components/common/StatBlock';
import { Button } from '../../components/ui/button';
import { Skeleton } from '../../components/ui/skeleton';
import { QueryError } from '@/components/common/QueryError';

export default function MonsterDetailPage() {
  const { id } = useParams();
  const { data: monster, isLoading, isError, refetch } = useMonster(id ?? '');

  if (isLoading) return <div className="p-6"><Skeleton className="h-96 w-full max-w-md bg-[#f8f5ed]" /></div>;
  if (isError) return <div className="p-6"><QueryError message="No se pudo cargar la criatura." onRetry={() => void refetch()} /></div>;
  if (!monster) return <div className="p-6 text-[#26342e]">Monstruo no encontrado.</div>;

  return (
    <div className="space-y-6">
      <Link to="/monsters">
        <Button variant="outline" className="border-[#e7e0d1] text-[#19352b] bg-[#fffdf8] hover:bg-[#f3efe4] transition-colors">
          &larr; Volver al Bestiario
        </Button>
      </Link>
      
      <div className="flex justify-center">
        <StatBlock monster={monster} />
      </div>
    </div>
  );
}
