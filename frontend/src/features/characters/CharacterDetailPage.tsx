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

  const handleLevelUp = () => {
    // Increment level by 1, up to max 20
    const newLevel = Math.min(char.level + 1, 20);
    updateMutation.mutate(
      {
        id: char.id,
        name: char.name,
        level: newLevel,
        backstory: char.backstory ?? null,
      },
      { onSuccess: () => { refetch(); } }
    );
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
    <div className="container mx-auto py-8 text-[#26342e]">
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-[#fffdf8] p-6 rounded-xl border border-[#e7e0d1] shadow-sm">
        <div>
          <h1 className="text-4xl font-serif font-bold text-[#19352b] mb-1">{char.name}</h1>
          <div className="flex items-center gap-3">
            <p className="text-lg text-[#68756c]">Nivel {char.level} {char.race} {char.character_class}</p>
            <Button
              variant="outline"
              onClick={handleLevelUp}
              disabled={updateMutation.isPending || char.level >= 20}
              className="bg-[#19352b] text-[#fffaf0] hover:bg-[#315746] border-none font-bold text-xs px-3 py-1.5 h-auto shadow transition-colors"
            >
              {updateMutation.isPending ? 'Subiendo...' : '⚡ Subir de Nivel (+1)'}
            </Button>
          </div>
        </div>
        <div className="flex gap-2">
          <Link to="/characters">
            <Button variant="outline" className="border-[#e7e0d1] text-[#19352b] hover:bg-[#f3efe4]">Volver</Button>
          </Link>
          <Button variant="outline" onClick={beginEditing} className="border-[#e7e0d1] text-[#19352b] hover:bg-[#f3efe4]">Editar</Button>
          <Button variant="destructive" onClick={handleDelete} className="bg-[#bd7446] hover:bg-[#86502f] text-white">Eliminar</Button>
        </div>
      </div>

      {isEditing && (
        <form
          onSubmit={handleUpdate}
          className="mb-8 grid gap-4 rounded-lg border border-dnd-border bg-dnd-card p-6 md:grid-cols-3"
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
              className="min-h-24 w-full rounded-md border border-dnd-border bg-dnd-bg p-3 text-zinc-100"
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
          <div className="bg-[#fffdf8] p-6 rounded-xl border border-[#e7e0d1] shadow-sm">
            <div className="grid grid-cols-3 gap-4 text-center mb-6">
              <div className="p-4 bg-[#f8f5ed] rounded-lg border border-[#e7e0d1]">
                <div className="text-xs uppercase font-bold text-[#68756c]">Clase Armadura</div>
                <div className="text-2xl font-bold font-serif text-[#19352b]">{char.armor_class}</div>
              </div>
              <div className="p-4 bg-[#f8f5ed] rounded-lg border border-[#e7e0d1]">
                <div className="text-xs uppercase font-bold text-[#68756c]">Puntos de Golpe</div>
                <div className="text-2xl font-bold font-serif text-[#bd7446]">{char.hit_points} / {char.max_hit_points}</div>
              </div>
              <div className="p-4 bg-[#f8f5ed] rounded-lg border border-[#e7e0d1]">
                <div className="text-xs uppercase font-bold text-[#68756c]">Velocidad</div>
                <div className="text-2xl font-bold font-serif text-[#19352b]">{char.speed} pies</div>
              </div>
            </div>

            <div className="text-center mb-6 pb-4 border-b border-[#e7e0d1]">
              <span className="text-[#68756c] font-medium text-sm">Bonificador de Competencia:</span> <span className="font-bold text-[#19352b]">+{char.proficiency_bonus}</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(stat => (
                <div key={stat} className="bg-[#f8f5ed] p-3 rounded-lg text-center border border-[#e7e0d1]">
                  <div className="text-xs font-bold text-[#68756c] mb-1">{stat}</div>
                  <div className="text-2xl font-serif font-bold text-[#19352b]">{char.ability_scores[stat] || 10}</div>
                  <div className="text-xs font-semibold text-[#bd7446] mt-0.5">{getMod(char.ability_scores[stat] || 10)}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#fffdf8] p-6 rounded-xl border border-[#e7e0d1] shadow-sm">
            <h3 className="text-lg font-serif font-bold text-[#19352b] mb-4 pb-2 border-b border-[#e7e0d1]">Competencias</h3>
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1.5">Habilidades</h4>
                <div className="flex flex-wrap gap-1.5">
                  {char.proficiencies?.skills?.map(s => <span key={s} className="bg-[#f3efe4] text-[#19352b] border border-[#e7e0d1] px-2 py-0.5 rounded text-xs font-medium">{s}</span>)}
                </div>
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1.5">Idiomas</h4>
                <div className="flex flex-wrap gap-1.5">
                  {char.proficiencies?.languages?.map(l => <span key={l} className="bg-[#f3efe4] text-[#19352b] border border-[#e7e0d1] px-2 py-0.5 rounded text-xs font-medium">{l}</span>)}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="bg-[#fffdf8] p-6 rounded-xl border border-[#e7e0d1] shadow-sm">
            <h3 className="text-lg font-serif font-bold text-[#19352b] mb-4 pb-2 border-b border-[#e7e0d1]">Rasgos y Características</h3>
            <div className="space-y-4">
              {char.features?.map((f, i) => (
                <div key={i} className="bg-[#f8f5ed] p-4 rounded-lg border border-[#e7e0d1]">
                  <h4 className="font-bold text-[#19352b] mb-1">{f.name}</h4>
                  <p className="text-[#46534b] text-xs leading-relaxed whitespace-pre-line">{f.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-dnd-card p-6 rounded-lg border border-dnd-border">
            <h3 className="text-xl font-serif text-dnd-gold mb-4">Equipment</h3>
            <ul className="list-disc list-inside text-zinc-400">
              {char.equipment?.map((eq, i) => (
                <li key={i}>{eq}</li>
              ))}
            </ul>
          </div>

          {(char.background || char.alignment || char.backstory) && (
            <div className="bg-dnd-card p-6 rounded-lg border border-dnd-border">
              <h3 className="text-xl font-serif text-dnd-gold mb-4">Details</h3>
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
