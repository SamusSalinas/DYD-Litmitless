import { useState, useId } from 'react';
import { useNavigate } from 'react-router-dom';
import { useClasses } from '@/api/useClasses';
import { useRaces } from '@/api/useRaces';
import { useCreateCharacter } from '@/api/useCharacters';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QueryError } from '@/components/common/QueryError';
import type { CharacterClass } from '@/types/class';
import type { Race } from '@/types/race';

export function CharacterBuilderPage() {
  const navigate = useNavigate();
  const createMutation = useCreateCharacter();
  const nameInputId = useId();

  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [race, setRace] = useState<Race | null>(null);
  const [charClass, setCharClass] = useState<CharacterClass | null>(null);
  const [stats, setStats] = useState<Record<string, number>>({
    STR: 10, DEX: 10, CON: 10, INT: 10, WIS: 10, CHA: 10
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [backstory, setBackstory] = useState('');

  const racesQuery = useRaces();
  const classesQuery = useClasses();

  const races = racesQuery.data || [];
  const classes = classesQuery.data || [];
  const compendiumError = racesQuery.isError || classesQuery.isError;

  const retryCompendium = () => {
    if (racesQuery.isError) void racesQuery.refetch();
    if (classesQuery.isError) void classesQuery.refetch();
  };

  const handleStatChange = (stat: string, val: number) => {
    setStats(prev => ({ ...prev, [stat]: Math.max(1, Math.min(30, val)) }));
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      const maxSkills = charClass?.skill_choices?.choose || 2;
      if (selectedSkills.length < maxSkills) {
        setSelectedSkills([...selectedSkills, skill]);
      }
    }
  };

  const handleFinish = () => {
    if (!race || !charClass || !name.trim()) return;

    const conScore = stats.CON || 10;
    const conMod = Math.floor((conScore - 10) / 2);
    const hitDieMatch = charClass.hit_die.match(/\d+/);
    const baseHp = hitDieMatch ? parseInt(hitDieMatch[0], 10) : 8;
    const hp = Math.max(1, baseHp + conMod);

    const characterData = {
      name: name.trim(),
      level: 1,
      race: race.name,
      character_class: charClass.name,
      ability_scores: stats,
      hit_points: hp,
      max_hit_points: hp,
      armor_class: 10 + Math.floor(((stats.DEX || 10) - 10) / 2),
      speed: race.speed,
      proficiency_bonus: 2,
      proficiencies: {
        skills: selectedSkills,
        tools: [],
        languages: race.languages || ["Common"]
      },
      equipment: selectedEquipment,
      features: charClass.features_by_level?.["1"] || [],
      spell_ids: null,
      background: "Adventurer",
      alignment: null,
      backstory: backstory.trim() || null,
      is_homebrew: false
    };

    createMutation.mutate(characterData, {
      onSuccess: () => navigate('/characters')
    });
  };

  return (
    <div className="space-y-6 text-[#26342e]">
      <header className="cabecera">
        <div className="cabecera-contenido">
          <div className="marca-emblema">⚒️</div>
          <div>
            <p className="marca-kicker">Creación de Personaje</p>
            <h1>Creador de Héroes</h1>
            <p className="marca-descripcion">
              Sigue los pasos guiados para forjar tu nuevo personaje de nivel 1 compatible con D&amp;D 5e.
            </p>
          </div>
        </div>
      </header>

      <div className="contenido-panel">
        {compendiumError && (
          <QueryError
            message="No se pudieron cargar las opciones del compendio."
            onRetry={retryCompendium}
          />
        )}

        <div className="flex justify-between items-center bg-[#f8f5ed] p-3 rounded-lg border border-[#e7e0d1] mb-6 overflow-x-auto gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map(s => (
            <div
              key={s}
              className={`flex-1 text-center font-bold text-xs py-1 px-2 rounded transition-colors whitespace-nowrap ${
                step === s
                  ? 'bg-[#19352b] text-[#fffaf0]'
                  : step > s
                  ? 'bg-[#f3efe4] text-[#bd7446] border border-[#e7e0d1]'
                  : 'text-[#68756c]'
              }`}
            >
              Paso {s}
            </div>
          ))}
        </div>

        <div className="min-h-[50vh] mb-6">
          {step === 1 && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#19352b] mb-4">1. Elige una Raza</h2>
              {!races.length && !racesQuery.isLoading && (
                <p className="mb-4 text-[#68756c] italic">No hay razas en el compendio.</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {races.map((r) => (
                  <div 
                    key={r.id} 
                    onClick={() => setRace(r)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      race?.id === r.id
                        ? 'border-[#19352b] bg-[#f8f5ed] shadow-md ring-2 ring-[#19352b]/20'
                        : 'border-[#e7e0d1] bg-[#fffdf8] hover:border-[#bd7446]'
                    }`}
                  >
                    <h3 className="text-lg font-serif font-bold text-[#19352b]">{r.name}</h3>
                    <p className="text-xs text-[#68756c] mt-1">Velocidad: {r.speed} pies | Tamaño: {r.size}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#19352b] mb-4">2. Elige una Clase</h2>
              {!classes.length && !classesQuery.isLoading && (
                <p className="mb-4 text-[#68756c] italic">No hay clases en el compendio.</p>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {classes.map((c) => (
                  <div 
                    key={c.id} 
                    onClick={() => setCharClass(c)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      charClass?.id === c.id
                        ? 'border-[#19352b] bg-[#f8f5ed] shadow-md ring-2 ring-[#19352b]/20'
                        : 'border-[#e7e0d1] bg-[#fffdf8] hover:border-[#bd7446]'
                    }`}
                  >
                    <h3 className="text-lg font-serif font-bold text-[#19352b]">{c.name}</h3>
                    <p className="text-xs text-[#68756c] mt-1">Dado de Golpe: {c.hit_die}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#19352b] mb-4">3. Puntuaciones de Característica</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'].map(s => (
                  <div key={s} className="bg-[#f8f5ed] p-4 rounded-xl border border-[#e7e0d1] text-center">
                    <label className="text-sm font-bold text-[#19352b] block mb-2">{s}</label>
                    <Input 
                      type="number" 
                      min={1} 
                      max={20}
                      value={stats[s] || 10} 
                      onChange={(e) => handleStatChange(s, parseInt(e.target.value) || 10)}
                      className="text-center font-bold font-serif text-xl w-24 mx-auto bg-white border-[#e7e0d1] text-[#19352b]"
                    />
                    <span className="text-xs text-[#bd7446] font-bold block mt-1">
                      Modificador: {Math.floor(((stats[s] || 10) - 10) / 2) >= 0 ? `+${Math.floor(((stats[s] || 10) - 10) / 2)}` : Math.floor(((stats[s] || 10) - 10) / 2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#19352b] mb-2">4. Competencias en Habilidades</h2>
              <p className="text-xs text-[#68756c] mb-4">
                Selecciona hasta {charClass?.skill_choices?.choose || 2} habilidades de tu clase ({selectedSkills.length}/{charClass?.skill_choices?.choose || 2}):
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {(charClass?.skill_choices?.from || [
                  "Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", 
                  "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", 
                  "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"
                ]).map((skill: string) => (
                  <Button
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    onClick={() => toggleSkill(skill)}
                    className={`justify-start text-xs font-semibold ${
                      selectedSkills.includes(skill)
                        ? "bg-[#19352b] text-[#fffaf0]"
                        : "border-[#e7e0d1] text-[#26342e] bg-white hover:bg-[#f3efe4]"
                    }`}
                  >
                    {skill}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#19352b] mb-4">5. Equipamiento Inicial</h2>
              <div className="space-y-2">
                {["Arma Marcial / Simple", "Armadura Inicial", "Paquete de Aventurero", "Símbolo Sagrado / Foco Arcano"].map(eq => (
                  <label key={eq} className="flex items-center gap-3 p-3 bg-[#f8f5ed] border border-[#e7e0d1] rounded-lg cursor-pointer hover:bg-[#f3efe4]">
                    <input 
                      type="checkbox" 
                      checked={selectedEquipment.includes(eq)}
                      onChange={(e) => {
                        if (e.target.checked) setSelectedEquipment([...selectedEquipment, eq]);
                        else setSelectedEquipment(selectedEquipment.filter(x => x !== eq));
                      }}
                      className="size-4 accent-[#19352b]"
                    />
                    <span className="text-sm font-medium text-[#26342e]">{eq}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#19352b] mb-4">6. Datos Personales</h2>
              <div className="space-y-4 max-w-md">
                <div>
                  <label htmlFor={nameInputId} className="block text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1">
                    Nombre del Personaje *
                  </label>
                  <Input 
                    id={nameInputId}
                    placeholder="Ej: Thorin Escudo de Roble..." 
                    value={name} 
                    onChange={e => setName(e.target.value)}
                    className="bg-white border-[#e7e0d1] text-[#26342e] font-medium"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#68756c] mb-1">
                    Historia / Trasfondo (Opcional)
                  </label>
                  <textarea 
                    placeholder="Breve historia de los orígenes de tu héroe..."
                    value={backstory}
                    onChange={e => setBackstory(e.target.value)}
                    className="w-full bg-white border border-[#e7e0d1] rounded-lg p-3 text-sm text-[#26342e] min-h-[120px] focus:outline-none focus:border-[#19352b]"
                  />
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <div>
              <h2 className="text-2xl font-serif font-bold text-[#19352b] mb-4">7. Resumen de la Ficha</h2>
              <div className="bg-[#f8f5ed] p-6 rounded-xl border border-[#e7e0d1] space-y-4 text-sm">
                <p><strong className="text-[#19352b]">Nombre:</strong> {name || <span className="text-red-600 font-bold">Falta ingresar el nombre</span>}</p>
                <p><strong className="text-[#19352b]">Raza:</strong> {race?.name || 'No seleccionada'}</p>
                <p><strong className="text-[#19352b]">Clase:</strong> {charClass?.name || 'No seleccionada'}</p>
                <p><strong className="text-[#19352b]">Puntos de Golpe estimados:</strong> {charClass ? (parseInt(charClass.hit_die.replace('d', ''), 10) + Math.floor(((stats.CON || 10) - 10) / 2)) : '-'}</p>
                <div>
                  <strong className="text-[#19352b]">Habilidades:</strong> {selectedSkills.join(', ') || 'Ninguna'}
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between border-t border-[#e7e0d1] pt-4">
          <Button 
            variant="outline" 
            disabled={step === 1} 
            onClick={() => setStep(step - 1)}
            className="border-[#e7e0d1] text-[#19352b] bg-white hover:bg-[#f3efe4]"
          >
            &larr; Anterior
          </Button>

          {step < 7 ? (
            <Button 
              onClick={() => setStep(step + 1)}
              disabled={(step === 1 && !race) || (step === 2 && !charClass)}
              className="bg-[#19352b] hover:bg-[#315746] text-[#fffaf0] font-bold"
            >
              Siguiente &rarr;
            </Button>
          ) : (
            <Button 
              onClick={handleFinish} 
              disabled={createMutation.isPending || !name.trim()}
              className="bg-[#bd7446] hover:bg-[#86502f] text-white font-bold shadow"
            >
              {createMutation.isPending ? 'Guardando...' : 'Crear y Guardar Personaje'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
