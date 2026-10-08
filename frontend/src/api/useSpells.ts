import { useQuery } from '@tanstack/react-query';
import api from './client';
import type { Spell } from '@/types/spell';

interface SpellFilters {
  level?: number;
  school?: string;
  class_name?: string;
  name?: string;
}

export function useSpells(filters?: SpellFilters) {
  return useQuery({
    queryKey: ['spells', filters],
    queryFn: async () => {
      const { data } = await api.get<Spell[]>('/spells', { params: filters });
      return data;
    },
  });
}

export function useSpell(id: string) {
  return useQuery({
    queryKey: ['spell', id],
    queryFn: async () => {
      const { data } = await api.get<Spell>(`/spells/${id}`);
      return data;
    },
    enabled: !!id,
  });
}
