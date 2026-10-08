import { useQuery } from '@tanstack/react-query';
import api from './client';

export interface Manual {
  id: string;
  title: string;
  available: boolean;
  url: string;
}

export function useManuals() {
  return useQuery({
    queryKey: ['manuals'],
    queryFn: async () => {
      const { data } = await api.get<Manual[]>('/manuals');
      return data;
    },
  });
}
