export interface CharacterClass {
  id: string;
  name: string;
  hit_die: string;
  primary_ability: Record<string, string>;
  saving_throws: string[];
  armor_proficiencies: string[];
  weapon_proficiencies: string[];
  skill_choices: {choose: number; from: string[]};
  features_by_level: Record<string, Array<{name: string; description: string}>>;
  spellcasting: Record<string, any> | null;
  description: string;
}
