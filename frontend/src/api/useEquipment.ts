import { useQuery } from '@tanstack/react-query';
import client from './client';
import type { Equipment } from '../types/equipment';

export const useEquipment = (filters?: { category?: string; name?: string }) => {
  return useQuery({
    queryKey: ['equipment', filters],
    queryFn: async () => {
      const { data } = await client.get<Equipment[]>('/equipment', { params: filters });
      return data;
    },
  });
};

export const useEquipmentItem = (id: string | undefined) => {
  return useQuery({
    queryKey: ['equipment', id],
    queryFn: async () => {
      const { data } = await client.get<Equipment>(`/equipment/${id}`);
      return data;
    },
    enabled: !!id,
  });
};
