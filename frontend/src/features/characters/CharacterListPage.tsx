import { useCharacters, useDeleteCharacter } from '@/api/useCharacters';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { QueryError } from '@/components/common/QueryError';

export function CharacterListPage() {
  const { data: characters, isLoading, isError, refetch } = useCharacters();
  const deleteMutation = useDeleteCharacter();

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 text-zinc-200">
        <h1 className="text-3xl font-serif text-[#8B0000] mb-6">Your Characters</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 bg-zinc-900 animate-pulse rounded-lg border border-zinc-800" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <QueryError message="Could not load your characters." onRetry={() => void refetch()} />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 text-zinc-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-serif text-[#8B0000]">Your Characters</h1>
        <Link to="/characters/new">
          <Button className="bg-[#8B0000] text-white hover:bg-[#6b0000]">Create New Character</Button>
        </Link>
      </div>

      {deleteMutation.isError && (
        <p className="mb-6 text-sm text-red-400" role="alert">
          Could not delete this character. Please try again.
        </p>
      )}

      {!characters?.length ? (
        <div className="text-center py-12 bg-zinc-900 rounded-lg border border-zinc-800">
          <p className="text-zinc-400 mb-4">You haven't created any characters yet.</p>
          <Link to="/characters/new">
            <Button variant="outline" className="text-[#8B0000] border-[#8B0000] hover:bg-[#8B0000] hover:text-white">
              Start your journey
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {characters.map((char) => (
            <div key={char.id} className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 hover:border-[#8B0000] transition-colors relative">
              <Link to={`/characters/${char.id}`} className="block h-full">
                <h2 className="text-xl font-serif font-bold mb-2">{char.name}</h2>
                <div className="text-sm text-zinc-400 space-y-1">
                  <p>Level {char.level} {char.race} {char.character_class}</p>
                </div>
              </Link>
              <div className="absolute top-4 right-4 flex gap-2">
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={(e) => {
                    e.preventDefault();
                    if (window.confirm('Are you sure you want to delete this character?')) {
                      deleteMutation.mutate(char.id);
                    }
                  }}
                >
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
