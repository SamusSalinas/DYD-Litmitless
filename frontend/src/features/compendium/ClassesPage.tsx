import { useClasses } from '../../api/useClasses';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Link } from 'react-router-dom';
import { Skeleton } from '../../components/ui/skeleton';
import { QueryError } from '@/components/common/QueryError';

export default function ClassesPage() {
  const { data: classes, isLoading, isError, refetch } = useClasses();

  return (
    <div className="space-y-6">
      <header className="cabecera">
        <div className="cabecera-contenido">
          <div className="marca-emblema">⚔️</div>
          <div>
            <p className="marca-kicker">Compendio de Héroes</p>
            <h1>Clases de Personaje</h1>
            <p className="marca-descripcion">
              Descubre las clases oficiales de D&amp;D 5e, dados de golpe, salvaciones y características esenciales.
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-48 bg-[#f8f5ed] rounded-lg" />)
        ) : isError ? (
          <QueryError message="No se pudieron cargar las clases." onRetry={() => void refetch()} />
        ) : !classes?.length ? (
          <p className="text-[#68756c] italic col-span-3 text-center py-8">
            No se encontraron clases en el compendio.
          </p>
        ) : (
          classes.map((cls) => (
            <Link key={cls.id} to={`/classes/${cls.id}`} className="no-underline block">
              <Card className="bg-[#fffdf8] border-[#e7e0d1] hover:border-[#19352b] transition-all duration-300 h-full flex flex-col cursor-pointer group hover:shadow-md hover:-translate-y-0.5">
                <CardHeader className="pb-2 border-b border-[#e7e0d1]">
                  <CardTitle className="text-2xl font-serif text-[#19352b] group-hover:text-[#bd7446] transition-colors flex justify-between items-center">
                    {cls.name}
                    <span className="text-xs font-bold font-sans px-2.5 py-1 rounded bg-[#f3efe4] text-[#19352b] border border-[#e7e0d1]">
                      {cls.hit_die}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col justify-between pt-4">
                  <p className="text-[#68756c] text-sm line-clamp-3 mb-4 leading-relaxed">
                    {cls.description}
                  </p>
                  <div>
                    <p className="text-xs font-bold text-[#68756c] uppercase tracking-wider mb-2">Tiradas de Salvación</p>
                    <div className="flex gap-2">
                      {cls.saving_throws.map((st) => (
                        <Badge key={st} variant="secondary" className="bg-[#f3efe4] text-[#19352b] border border-[#e7e0d1] font-bold">
                          {st}
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
