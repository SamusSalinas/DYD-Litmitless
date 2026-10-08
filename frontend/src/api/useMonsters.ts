import { useQuery } from '@tanstack/react-query';
import client from './client';
import type { Monster } from '../types/monster';

export const useMonsters = (filters?: { challenge_rating?: number; type?: string; size?: string; name?: string }) => {
  return useQuery({
    queryKey: ['monsters', filters],
    queryFn: async () => {
      const { data } = await client.get<Monster[]>('/monsters', { params: filters });
      return data;
    },
  });
};

export const useMonster = (id: string | undefined) => {
  return useQuery({
    queryKey: ['monsters', id],
    queryFn: async () => {
      const { data } = await client.get<Monster>(`/monsters/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
