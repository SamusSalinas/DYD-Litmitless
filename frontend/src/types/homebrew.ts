export interface Homebrew {
  id: string;
  name: string;
  content_type: string;
  data: Record<string, any>;
  description: string | null;
}
