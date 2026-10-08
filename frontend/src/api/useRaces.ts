import { useQuery } from '@tanstack/react-query';
import client from './client';
import type { Race } from '../types/race';

export const useRaces = () => {
  return useQuery({
    queryKey: ['races'],
    queryFn: async () => {
      const { data } = await client.get<Race[]>('/races');
      return data;
    },
  });
};

export const useRace = (id: string | undefined) => {
  return useQuery({
    queryKey: ['races', id],
    queryFn: async () => {
      const { data } = await client.get<Race>(`/races/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
