import { useCharacters, useDeleteCharacter } from '@/api/useCharacters';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QueryError } from '@/components/common/QueryError';

export function CharacterListPage() {
  const { data: characters, isLoading, isError, refetch } = useCharacters();
  const deleteMutation = useDeleteCharacter();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-serif text-[#19352b] font-bold">Tus Personajes</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-[#f8f5ed] animate-pulse rounded-xl border border-[#e7e0d1]" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <QueryError message="No se pudieron cargar tus personajes." onRetry={() => void refetch()} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="cabecera">
        <div className="cabecera-contenido">
          <div className="marca-emblema">👤</div>
          <div>
            <p className="marca-kicker">Salón de Aventureros</p>
            <h1>Tus Personajes</h1>
            <p className="marca-descripcion">
              Consulta, edita, sube de nivel y gestiona las fichas interactivas de tus héroes.
            </p>
          </div>
        </div>
      </header>

      <div className="flex justify-between items-center mb-6">
        <p className="text-sm font-semibold text-[#68756c]">
          {characters?.length || 0} {characters?.length === 1 ? 'personaje registrado' : 'personajes registrados'}
        </p>
        <Link to="/characters/new">
          <Button className="bg-[#19352b] hover:bg-[#315746] text-[#fffaf0] font-bold shadow">
            + Crear Nuevo Personaje
          </Button>
        </Link>
      </div>

      {deleteMutation.isError && (
        <p className="mb-6 text-sm text-red-600" role="alert">
          No se pudo eliminar el personaje. Inténtalo de nuevo.
        </p>
      )}

      {!characters?.length ? (
        <div className="text-center py-16 bg-[#fffdf8] rounded-xl border border-[#e7e0d1] shadow-sm">
          <p className="text-[#68756c] mb-4">Aún no has creado ningún personaje.</p>
          <Link to="/characters/new">
            <Button variant="outline" className="text-[#19352b] border-[#19352b] hover:bg-[#19352b] hover:text-[#fffaf0] font-bold transition-colors">
              Comenzar creación asistida
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => (
            <div
              key={char.id}
              className="bg-[#fffdf8] p-6 rounded-xl border border-[#e7e0d1] hover:border-[#19352b] transition-all duration-300 relative group shadow-sm hover:shadow-md hover:-translate-y-0.5 flex flex-col justify-between"
            >
              <Link to={`/characters/${char.id}`} className="block h-full no-underline">
                <div>
                  <h2 className="text-2xl font-serif font-bold text-[#19352b] group-hover:text-[#bd7446] transition-colors mb-1">
                    {char.name}
                  </h2>
                  <p className="text-[#68756c] text-sm mb-4">
                    Nivel {char.level} {char.race} {char.character_class}
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center pt-3 border-t border-[#e7e0d1] text-xs">
                  <div className="bg-[#f8f5ed] p-2 rounded border border-[#e7e0d1]">
                    <span className="text-[#68756c] block">CA</span>
                    <span className="font-bold text-[#19352b] text-sm">{char.armor_class}</span>
                  </div>
                  <div className="bg-[#f8f5ed] p-2 rounded border border-[#e7e0d1]">
                    <span className="text-[#68756c] block">PG</span>
                    <span className="font-bold text-[#bd7446] text-sm">{char.hit_points}</span>
                  </div>
                  <div className="bg-[#f8f5ed] p-2 rounded border border-[#e7e0d1]">
                    <span className="text-[#68756c] block">Velocidad</span>
                    <span className="font-bold text-[#19352b] text-sm">{char.speed}</span>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
