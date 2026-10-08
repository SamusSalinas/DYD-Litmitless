import type { Monster } from '../../types/monster';
import { Separator } from '../ui/separator';

export function StatBlock({ monster }: { monster: Monster }) {
  const getModifier = (score: number) => {
    const mod = Math.floor((score - 10) / 2);
    return mod >= 0 ? `+${mod}` : `${mod}`;
  };

  return (
    <div className="bg-[#fdf1dc] text-amber-950 border-4 border-amber-500 p-4 font-serif shadow-lg max-w-md w-full">
      <div className="border-b-2 border-amber-700 pb-2 mb-2">
        <h2 className="text-3xl font-bold text-red-900">{monster.name}</h2>
        <p className="italic text-sm">
          {monster.size} {monster.type}, {monster.alignment}
        </p>
      </div>

      <div className="text-red-900 mb-2 space-y-1">
        <p><span className="font-bold">Armor Class</span> {monster.armor_class} {monster.armor_type && `(${monster.armor_type})`}</p>
        <p><span className="font-bold">Hit Points</span> {monster.hit_points} ({monster.hit_dice})</p>
        <p>
          <span className="font-bold">Speed</span>{' '}
          {Object.entries(monster.speeds).map(([type, speed]) => `${type} ${speed}ft.`).join(', ')}
        </p>
      </div>

      <Separator className="bg-amber-700 h-[2px] my-2" />

      <div className="grid grid-cols-6 gap-2 text-center text-red-900 font-bold mb-2">
        {Object.entries(monster.ability_scores).map(([ability, score]) => (
          <div key={ability} className="flex flex-col">
            <span className="uppercase text-xs">{ability.substring(0, 3)}</span>
            <span>{score} ({getModifier(score)})</span>
          </div>
        ))}
      </div>

      <Separator className="bg-amber-700 h-[2px] my-2" />

      <div className="text-red-900 mb-4 space-y-1">
        {monster.saving_throws && (
          <p><span className="font-bold">Saving Throws</span> {Object.entries(monster.saving_throws).map(([k, v]) => `${k} +${v}`).join(', ')}</p>
        )}
        {monster.skills && (
          <p><span className="font-bold">Skills</span> {Object.entries(monster.skills).map(([k, v]) => `${k} +${v}`).join(', ')}</p>
        )}
        {monster.damage_resistances && monster.damage_resistances.length > 0 && (
          <p><span className="font-bold">Damage Resistances</span> {monster.damage_resistances.join(', ')}</p>
        )}
        {monster.damage_immunities && monster.damage_immunities.length > 0 && (
          <p><span className="font-bold">Damage Immunities</span> {monster.damage_immunities.join(', ')}</p>
        )}
        {monster.condition_immunities && monster.condition_immunities.length > 0 && (
          <p><span className="font-bold">Condition Immunities</span> {monster.condition_immunities.join(', ')}</p>
        )}
        <p><span className="font-bold">Senses</span> {Object.entries(monster.senses).map(([k, v]) => `${k} ${v}`).join(', ')}</p>
        <p><span className="font-bold">Languages</span> {monster.languages}</p>
        <p><span className="font-bold">Challenge</span> {monster.challenge_rating} ({monster.xp} XP)</p>
      </div>

      <Separator className="bg-amber-700 h-[2px] my-2" />

      {monster.special_abilities && monster.special_abilities.map(ability => (
        <p className="mb-2 text-red-900" key={ability.name}>
          <span className="font-bold italic">{ability.name}.</span> {ability.desc}
        </p>
      ))}

      {monster.actions && monster.actions.length > 0 && (
        <>
          <h3 className="text-2xl border-b border-amber-700 text-red-900 mb-2 mt-4">Actions</h3>
          {monster.actions.map(action => (
            <p className="mb-2 text-red-900" key={action.name}>
              <span className="font-bold italic">{action.name}.</span> {action.desc}
            </p>
          ))}
        </>
      )}

      {monster.legendary_actions && monster.legendary_actions.length > 0 && (
        <>
          <h3 className="text-2xl border-b border-amber-700 text-red-900 mb-2 mt-4">Legendary Actions</h3>
          {monster.legendary_actions.map(action => (
            <p className="mb-2 text-red-900" key={action.name}>
              <span className="font-bold italic">{action.name}.</span> {action.desc}
            </p>
          ))}
        </>
      )}
    </div>
  );
}
