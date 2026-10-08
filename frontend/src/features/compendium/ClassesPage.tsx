import { useClasses } from '../../api/useClasses';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router-dom';
import { Skeleton } from '../../components/ui/skeleton';
import { QueryError } from '@/components/common/QueryError';

export default function ClassesPage() {
  const { data: classes, isLoading, isError, refetch } = useClasses();

  return (
    <div className="p-6 bg-zinc-950 text-zinc-100 min-h-screen">
      <h1 className="text-4xl font-serif text-red-700 mb-6 border-b border-red-900 pb-2">Classes</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({length: 6}).map((_, i) => <Skeleton key={i} className="h-48 bg-zinc-900 rounded-lg" />)
        ) : isError ? (
          <QueryError message="Could not load classes." onRetry={() => void refetch()} />
        ) : !classes?.length ? (
          <p className="text-zinc-400">No classes found. Load the sample compendium to get started.</p>
        ) : classes.map(cls => (
          <Link key={cls.id} to={`/classes/${cls.id}`}>
            <Card className="bg-zinc-900 border-zinc-800 hover:border-red-900 transition-colors h-full flex flex-col cursor-pointer">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-serif text-red-500 flex justify-between items-center">
                  {cls.name}
                  <span className="text-sm font-sans text-zinc-400">{cls.hit_die}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-grow flex flex-col justify-between">
                <p className="text-zinc-400 text-sm line-clamp-3 mb-4">
                  {cls.description}
                </p>
                <div>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2">Saving Throws</p>
                  <div className="flex gap-2">
                    {cls.saving_throws.map(st => (
                      <Badge key={st} variant="secondary" className="bg-zinc-800">{st}</Badge>
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
