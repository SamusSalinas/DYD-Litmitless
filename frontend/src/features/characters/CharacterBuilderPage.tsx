import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRaces } from '@/api/useRaces';
import { useClasses } from '@/api/useClasses';
import { useEquipment } from '@/api/useEquipment';
import { useCreateCharacter } from '@/api/useCharacters';
import { Button } from '@/components/ui/button';
import { QueryError } from '@/components/common/QueryError';
import type { CharacterClass } from '@/types/class';
import type { Race } from '@/types/race';

// Helper for abilities
const ABILITIES = ['STR', 'DEX', 'CON', 'INT', 'WIS', 'CHA'];
const POINT_BUY_COSTS: Record<number, number> = { 8:0, 9:1, 10:2, 11:3, 12:4, 13:5, 14:7, 15:9 };
const ALIGNMENTS = [
  'Lawful Good', 'Neutral Good', 'Chaotic Good',
  'Lawful Neutral', 'True Neutral', 'Chaotic Neutral',
  'Lawful Evil', 'Neutral Evil', 'Chaotic Evil'
];

export function CharacterBuilderPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);

  // Queries
  const racesQuery = useRaces();
  const classesQuery = useClasses();
  const equipmentQuery = useEquipment();
  const { data: races = [] } = racesQuery;
  const { data: classes = [] } = classesQuery;
  const { data: equipmentList = [] } = equipmentQuery;
  const createMutation = useCreateCharacter();
  const compendiumError = racesQuery.isError || classesQuery.isError || equipmentQuery.isError;
  const retryCompendium = () => {
    void Promise.all([
      racesQuery.refetch(),
      classesQuery.refetch(),
      equipmentQuery.refetch(),
    ]);
  };

  // Builder State
  const [race, setRace] = useState<Race | null>(null);
  const [charClass, setCharClass] = useState<CharacterClass | null>(null);
  const [abilities, setAbilities] = useState<Record<string, number>>({
    STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8
  });
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [details, setDetails] = useState({
    name: '', alignment: '', background: '', backstory: ''
  });

  const getMod = (score: number) => Math.floor((score - 10) / 2);

  // Step 3 Logic
  const usedPoints = Object.values(abilities).reduce((acc, score) => acc + (POINT_BUY_COSTS[score] || 0), 0);
  const remainingPoints = 27 - usedPoints;

  const handleAbilityChange = (stat: string, delta: number) => {
    const newVal = abilities[stat] + delta;
    if (newVal < 8 || newVal > 15) return;
    const costDiff = POINT_BUY_COSTS[newVal] - POINT_BUY_COSTS[abilities[stat]];
    if (remainingPoints - costDiff >= 0) {
      setAbilities(prev => ({ ...prev, [stat]: newVal }));
    }
  };

  const applyStandardArray = () => {
    setAbilities({ STR: 15, DEX: 14, CON: 13, INT: 12, WIS: 10, CHA: 8 });
  };

  // Build character object
  const handleSave = () => {
    if (!details.name || !race || !charClass) return;
    
    // Compute total abilities (with racial bonuses if any, assuming standard +2/+1 or specific for now we just use base)
    // To simplify, we'll just use the raw abilities.
    const conMod = getMod(abilities.CON);
    const dexMod = getMod(abilities.DEX);
    const hitDieValue = charClass.hit_die ? parseInt(charClass.hit_die.replace('d', '')) : 8;
    const hp = hitDieValue + conMod;

    const payload = {
      name: details.name,
      level: 1,
      race: race.name,
      character_class: charClass.name,
      ability_scores: abilities,
      hit_points: hp > 0 ? hp : 1,
      max_hit_points: hp > 0 ? hp : 1,
      armor_class: 10 + dexMod,
      speed: race.speed || 30,
      proficiency_bonus: 2,
      proficiencies: {
        skills: selectedSkills,
        tools: [],
        languages: race.languages || []
      },
      equipment: selectedEquipment,
      features: charClass.features_by_level?.['1'] || [],
      spell_ids: null,
      background: details.background || null,
      alignment: details.alignment || null,
      backstory: details.backstory || null,
      is_homebrew: false
    };

    createMutation.mutate(payload, {
      onSuccess: (newChar) => navigate(`/characters/${newChar.id}`)
    });
  };

  return (
    <div className="container mx-auto py-8 text-zinc-200">
      <div className="mb-8">
        <h1 className="text-3xl font-serif text-[#8B0000] mb-4">Character Builder</h1>
        {compendiumError && (
          <QueryError
            message="Could not load the character options. Check the API connection and try again."
            onRetry={retryCompendium}
          />
        )}
        <div className="flex justify-between items-center bg-zinc-900 p-4 rounded-lg border border-zinc-800">
          {[1, 2, 3, 4, 5, 6, 7].map(s => (
            <div key={s} className={`flex-1 text-center font-bold ${step === s ? 'text-[#8B0000]' : 'text-zinc-500'}`}>
              Step {s}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-zinc-900 p-6 rounded-lg border border-zinc-800 min-h-[60vh] mb-8">
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-serif mb-4">Choose a Race</h2>
            {!races.length && !racesQuery.isLoading && (
              <p className="mb-4 text-zinc-400">No races found. Load the sample compendium to continue.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {races.map((r) => (
                <div 
                  key={r.id} 
                  onClick={() => setRace(r)}
                  className={`p-4 rounded border cursor-pointer ${race?.id === r.id ? 'border-[#8B0000] bg-zinc-800' : 'border-zinc-700 hover:border-zinc-500'}`}
                >
                  <h3 className="text-xl font-bold">{r.name}</h3>
                  <p className="text-sm text-zinc-400 mt-2">Speed: {r.speed}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-2xl font-serif mb-4">Choose a Class</h2>
            {!classes.length && !classesQuery.isLoading && (
              <p className="mb-4 text-zinc-400">No classes found. Load the sample compendium to continue.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {classes.map((c) => (
                <div 
                  key={c.id} 
                  onClick={() => setCharClass(c)}
                  className={`p-4 rounded border cursor-pointer ${charClass?.id === c.id ? 'border-[#8B0000] bg-zinc-800' : 'border-zinc-700 hover:border-zinc-500'}`}
                >
                  <h3 className="text-xl font-bold">{c.name}</h3>
                  <p className="text-sm text-zinc-400 mt-2">Hit Die: {c.hit_die}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-serif">Ability Scores</h2>
              <div className="space-x-4">
                <Button variant="outline" onClick={applyStandardArray}>Standard Array</Button>
                <span className="font-bold text-lg text-[#8B0000]">Points: {remainingPoints}/27</span>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {ABILITIES.map(stat => (
                <div key={stat} className="bg-zinc-950 p-4 rounded border border-zinc-800 text-center">
                  <div className="font-bold text-xl mb-2">{stat}</div>
                  <div className="flex items-center justify-center space-x-4 mb-2">
                    <Button variant="outline" size="sm" onClick={() => handleAbilityChange(stat, -1)}>-</Button>
                    <span className="text-2xl w-8">{abilities[stat]}</span>
                    <Button variant="outline" size="sm" onClick={() => handleAbilityChange(stat, 1)}>+</Button>
                  </div>
                  <div className="text-zinc-400">Modifier: {getMod(abilities[stat]) >= 0 ? '+' : ''}{getMod(abilities[stat])}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 4 && (
          <div>
            <h2 className="text-2xl font-serif mb-4">Skills</h2>
            {charClass?.skill_choices ? (
              <div>
                <p className="mb-4 text-zinc-400">Choose {charClass.skill_choices.choose} skills from the list below:</p>
                <div className="grid grid-cols-2 gap-4">
                  {charClass.skill_choices.from.map((skill: string) => {
                    const isSelected = selectedSkills.includes(skill);
                    const canSelect = isSelected || selectedSkills.length < charClass.skill_choices.choose;
                    return (
                      <label key={skill} className={`flex items-center space-x-2 p-2 rounded border ${isSelected ? 'border-[#8B0000] bg-zinc-800' : 'border-zinc-800'} ${!canSelect && !isSelected ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                        <input 
                          type="checkbox"
                          disabled={!canSelect && !isSelected}
                          checked={isSelected}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedSkills([...selectedSkills, skill]);
                            } else {
                              setSelectedSkills(selectedSkills.filter(s => s !== skill));
                            }
                          }}
                          className="w-4 h-4"
                        />
                        <span>{skill}</span>
                      </label>
                    );
                  })}
                </div>
              </div>
            ) : (
              <p className="text-zinc-400">Please select a class first.</p>
            )}
          </div>
        )}

        {step === 5 && (
          <div>
            <h2 className="text-2xl font-serif mb-4">Equipment</h2>
            {!equipmentList.length && !equipmentQuery.isLoading && (
              <p className="mb-4 text-zinc-400">No equipment found. Load the sample compendium to continue.</p>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[50vh] overflow-y-auto">
              {equipmentList.map((eq) => (
                <label key={eq.id} className="flex items-start space-x-3 p-3 border border-zinc-800 rounded bg-zinc-950 cursor-pointer">
                  <input 
                    type="checkbox"
                    checked={selectedEquipment.includes(eq.name)}
                    onChange={(e) => {
                      if (e.target.checked) setSelectedEquipment([...selectedEquipment, eq.name]);
                      else setSelectedEquipment(selectedEquipment.filter(n => n !== eq.name));
                    }}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-bold">{eq.name}</div>
                    <div className="text-sm text-zinc-400">{eq.category} • {eq.cost}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>
        )}

        {step === 6 && (
          <div className="max-w-xl mx-auto space-y-6">
            <h2 className="text-2xl font-serif mb-4">Character Details</h2>
            <div>
              <label className="block mb-2 font-bold">Character Name *</label>
              <input 
                type="text" 
                value={details.name}
                onChange={e => setDetails({...details, name: e.target.value})}
                className="w-full p-2 rounded bg-zinc-950 border border-zinc-700 text-white"
                placeholder="Enter name"
              />
            </div>
            <div>
              <label className="block mb-2 font-bold">Alignment</label>
              <select 
                value={details.alignment}
                onChange={e => setDetails({...details, alignment: e.target.value})}
                className="w-full p-2 rounded bg-zinc-950 border border-zinc-700 text-white"
              >
                <option value="">Select Alignment</option>
                {ALIGNMENTS.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div>
              <label className="block mb-2 font-bold">Background</label>
              <input 
                type="text" 
                value={details.background}
                onChange={e => setDetails({...details, background: e.target.value})}
                className="w-full p-2 rounded bg-zinc-950 border border-zinc-700 text-white"
                placeholder="e.g. Acolyte, Criminal, Folk Hero"
              />
            </div>
            <div>
              <label className="block mb-2 font-bold">Backstory</label>
              <textarea 
                value={details.backstory}
                onChange={e => setDetails({...details, backstory: e.target.value})}
                className="w-full p-2 rounded bg-zinc-950 border border-zinc-700 text-white h-32"
                placeholder="Your character's history..."
              />
            </div>
          </div>
        )}

        {step === 7 && (
          <div>
            <h2 className="text-2xl font-serif mb-6 text-center">Review & Create</h2>
            <div className="max-w-2xl mx-auto bg-zinc-950 p-6 rounded border border-[#8B0000]">
              <h3 className="text-3xl font-serif text-center mb-2">{details.name || 'Unnamed'}</h3>
              <p className="text-center text-zinc-400 mb-6">Level 1 {race?.name} {charClass?.name}</p>
              
              <div className="grid grid-cols-3 gap-4 mb-6 text-center">
                <div className="p-3 bg-zinc-900 rounded border border-zinc-800">
                  <div className="text-sm text-zinc-400">AC</div>
                  <div className="text-xl font-bold">{10 + getMod(abilities.DEX)}</div>
                </div>
                <div className="p-3 bg-zinc-900 rounded border border-zinc-800">
                  <div className="text-sm text-zinc-400">HP</div>
                  <div className="text-xl font-bold">
                    {(charClass?.hit_die ? parseInt(charClass.hit_die.replace('d', '')) : 8) + getMod(abilities.CON)}
                  </div>
                </div>
                <div className="p-3 bg-zinc-900 rounded border border-zinc-800">
                  <div className="text-sm text-zinc-400">Speed</div>
                  <div className="text-xl font-bold">{race?.speed || 30}</div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-2 mb-6">
                {ABILITIES.map(stat => (
                  <div key={stat} className="text-center p-2 bg-zinc-900 rounded border border-zinc-800">
                    <div className="text-xs text-zinc-500">{stat}</div>
                    <div className="font-bold">{abilities[stat]}</div>
                  </div>
                ))}
              </div>

              {createMutation.isError && (
                <div className="text-red-500 text-center mb-4">Error creating character.</div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={() => setStep(s => Math.max(1, s - 1))}
          disabled={step === 1}
        >
          Previous
        </Button>
        
        {step < 7 ? (
          <Button 
            className="bg-[#8B0000] text-white hover:bg-[#6b0000]"
            onClick={() => setStep(s => Math.min(7, s + 1))}
            disabled={
              (step === 1 && !race) ||
              (step === 2 && !charClass) ||
              (step === 4 && charClass?.skill_choices && selectedSkills.length !== charClass.skill_choices.choose) ||
              (step === 6 && !details.name)
            }
          >
            Next
          </Button>
        ) : (
          <Button 
            className="bg-[#8B0000] text-white hover:bg-[#6b0000]"
            onClick={handleSave}
            disabled={createMutation.isPending || !details.name}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Character'}
          </Button>
        )}
      </div>
    </div>
  );
}
