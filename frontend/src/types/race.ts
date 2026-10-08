export interface Race {
  id: string;
  name: string;
  ability_bonuses: Record<string, number>;
  speed: number;
  size: string;
  traits: Array<{name: string; description: string}>;
  languages: string[];
  subraces: Array<{name: string; description: string}> | null;
  description: string;
}
