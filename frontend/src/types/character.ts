export interface Character {
  id: string;
  name: string;
  level: number;
  race: string;
  character_class: string;
  ability_scores: Record<string, number>;
  hit_points: number;
  max_hit_points: number;
  armor_class: number;
  speed: number;
  proficiency_bonus: number;
  proficiencies: {skills: string[]; tools: string[]; languages: string[]};
  equipment: string[];
  features: Array<{name: string; description: string}>;
  spell_ids: string[] | null;
  background: string | null;
  alignment: string | null;
  backstory: string | null;
  is_homebrew: boolean;
}
