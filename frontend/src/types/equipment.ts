export interface Equipment {
  id: string;
  name: string;
  category: string;
  subcategory: string | null;
  cost: string;
  weight: number | null;
  properties: Record<string, any> | null;
  description: string | null;
}
