export interface Monster {
  id: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armor_class: number;
  armor_type: string | null;
  hit_points: number;
  hit_dice: string;
  speeds: Record<string, number>;
  ability_scores: Record<string, number>;
  saving_throws: Record<string, number> | null;
  skills: Record<string, number> | null;
  damage_resistances: string[] | null;
  damage_immunities: string[] | null;
  condition_immunities: string[] | null;
  senses: Record<string, string>;
  languages: string;
  challenge_rating: number;
  xp: number;
  special_abilities: Array<{name: string; desc: string}> | null;
  actions: Array<{name: string; desc: string; attack_bonus?: number; damage?: string}>;
  legendary_actions: Array<{name: string; desc: string}> | null;
  description: string | null;
}
