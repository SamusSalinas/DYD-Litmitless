import { useQuery } from '@tanstack/react-query';
import client from './client';
import type { CharacterClass } from '../types/class';

export const useClasses = () => {
  return useQuery({
    queryKey: ['classes'],
    queryFn: async () => {
      const { data } = await client.get<CharacterClass[]>('/classes');
      return data;
    },
  });
};

export const useClass = (id: string | undefined) => {
  return useQuery({
    queryKey: ['classes', id],
    queryFn: async () => {
      const { data } = await client.get<CharacterClass>(`/classes/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
