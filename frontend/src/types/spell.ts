export interface Spell {
  id: string;
  name: string;
  level: number;
  school: string;
  casting_time: string;
  range: string;
  components: string;
  material: string | null;
  duration: string;
  description: string;
  higher_levels: Record<string, string> | null;
  classes: string[];
  ritual: boolean;
  concentration: boolean;
}
