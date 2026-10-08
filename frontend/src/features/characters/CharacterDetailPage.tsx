import { useState } from 'react';
import type { FormEvent } from 'react';
import { useCharacter, useDeleteCharacter, useUpdateCharacter } from '@/api/useCharacters';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QueryError } from '@/components/common/QueryError';

export function CharacterDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: char, isLoading, isError, refetch } = useCharacter(id || '');
  const deleteMutation = useDeleteCharacter();
  const updateMutation = useUpdateCharacter();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState('');
  const [level, setLevel] = useState('1');
  const [backstory, setBackstory] = useState('');

  if (isLoading) {
    return <div className="p-8 text-center text-zinc-400">Loading character...</div>;
  }

  if (isError) {
    return (
      <div className="container mx-auto py-8">
        <QueryError message="Could not load this character." onRetry={() => void refetch()} />
      </div>
    );
  }

  if (!char) {
    return <div className="p-8 text-center text-zinc-400">Character not found.</div>;
  }

  const beginEditing = () => {
    updateMutation.reset();
    setName(char.name);
    setLevel(String(char.level));
    setBackstory(char.backstory ?? '');
    setIsEditing(true);
  };

  const handleUpdate = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    updateMutation.mutate(
      {
        id: char.id,
        name: name.trim(),
        level: Number(level),
        backstory: backstory || null,
      },
      { onSuccess: () => setIsEditing(false) },
    );
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this character?')) {
      deleteMutation.mutate(char.id, {
        onSuccess: () => navigate('/characters')
      });
    }
  };

  const getMod = (score: number) => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : mod;
  };

  return (
    <div className="container mx-auto py-8 text-zinc-200">
      <div className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-serif text-[#8B0000] mb-2">{char.name}</h1>
          <p className="text-xl text-zinc-400">Level {char.level} {char.race} {char.character_class}</p>
        </div>
        <div className="flex gap-3">
          <Link to="/characters">
            <Button variant="outline" className="border-zinc-700 text-zinc-300">Back</Button>
          </Link>
          <Button variant="outline" onClick={beginEditing}>Edit</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </div>
      </div>

      {isEditing && (
        <form
          onSubmit={handleUpdate}
          className="mb-8 grid gap-4 rounded-lg border border-zinc-800 bg-zinc-900 p-6 md:grid-cols-3"
        >
          <label className="space-y-2 text-sm text-zinc-300">
            Name
            <Input
              required
              maxLength={120}
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm text-zinc-300">
            Level
            <Input
              required
              type="number"
              min={1}
              max={20}
              value={level}
              onChange={(event) => setLevel(event.target.value)}
            />
          </label>
          <label className="space-y-2 text-sm text-zinc-300 md:col-span-3">
            Backstory
            <textarea
              value={backstory}
              onChange={(event) => setBackstory(event.target.value)}
              className="min-h-24 w-full rounded-md border border-zinc-700 bg-zinc-950 p-3 text-zinc-100"
            />
          </label>
          {updateMutation.isError && (
            <p className="text-sm text-red-400 md:col-span-3" role="alert">
              Could not save changes. Check the values and try again.
            </p>
          )}
          <div className="flex gap-3 md:col-span-3">
            <Button type="submit" disabled={updateMutation.isPending || !name.trim()}>
              {updateMutation.isPending ? 'Saving...' : 'Save changes'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsEditing(false)}
              disabled={updateMutation.isPending}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {deleteMutation.isError && (
        <p className="mb-6 text-sm text-red-400" role="alert">
          Could not delete this character. Please try again.
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="p-4 bg-zinc-950 rounded border border-zinc-800">
                <div className="text-sm text-zinc-400">Armor Class</div>
                <div className="text-2xl font-bold">{char.armor_class}</div>
              </div>
              <div className="p-4 bg-zinc-950 rounded border border-zinc-800">
                <div className="text-sm text-zinc-400">Hit Points</div>
                <div className="text-2xl font-bold">{char.hit_points} / {char.max_hit_points}</div>
              </div>
              <div className="p-4 bg-zinc-950 rounded border border-zinc-800">
                <div className="text-sm text-zinc-400">Speed</div>
                <div className="text-2xl font-bold">{char.speed}</div>
              </div>
            </div>

            <div className="text-center mb-6">
              <span className="text-zinc-400">Proficiency Bonus:</span> <span className="font-bold">+{char.proficiency_bonus}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(stat => (
                <div key={stat} className="bg-zinc-950 p-4 rounded text-center border border-zinc-800">
                  <div className="text-sm font-bold text-zinc-500 mb-1">{stat}</div>
                  <div className="text-3xl font-serif">{char.ability_scores[stat] || 10}</div>
                  <div className="text-sm text-zinc-400 mt-1">{getMod(char.ability_scores[stat] || 10)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-xl font-serif text-[#8B0000] mb-4">Proficiencies</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm text-zinc-400 mb-1">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {char.proficiencies?.skills?.map(s => <span key={s} className="bg-zinc-800 px-2 py-1 rounded text-sm">{s}</span>)}
                </div>
              </div>
              <div>
                <h4 className="text-sm text-zinc-400 mb-1">Languages</h4>
                <div className="flex flex-wrap gap-2">
                  {char.proficiencies?.languages?.map(l => <span key={l} className="bg-zinc-800 px-2 py-1 rounded text-sm">{l}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-xl font-serif text-[#8B0000] mb-4">Features & Traits</h3>
            <div className="space-y-4">
              {char.features?.map((f, i) => (
                <div key={i} className="bg-zinc-950 p-4 rounded border border-zinc-800">
                  <h4 className="font-bold mb-2">{f.name}</h4>
                  <p className="text-zinc-400 text-sm whitespace-pre-line">{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
            <h3 className="text-xl font-serif text-[#8B0000] mb-4">Equipment</h3>
            <ul className="list-disc list-inside text-zinc-400">
              {char.equipment?.map((eq, i) => (
                <li key={i}>{eq}</li>
              ))}
            </ul>
          </div>

          {(char.background || char.alignment || char.backstory) && (
            <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800">
              <h3 className="text-xl font-serif text-[#8B0000] mb-4">Details</h3>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div><span className="text-zinc-500">Alignment:</span> {char.alignment}</div>
                <div><span className="text-zinc-500">Background:</span> {char.background}</div>
              </div>
              {char.backstory && (
                <div>
                  <span className="text-zinc-500 block mb-2">Backstory:</span>
                  <p className="text-zinc-400 text-sm whitespace-pre-line">{char.backstory}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
