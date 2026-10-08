import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from './client';
import type { Homebrew } from '../types/homebrew';

export const useHomebrewList = (filters?: { content_type?: string }) => {
  return useQuery({
    queryKey: ['homebrew', filters],
    queryFn: async () => {
      const { data } = await client.get<Homebrew[]>('/homebrew', { params: filters });
      return data;
    },
  });
};

export const useCreateHomebrew = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newItem: Partial<Homebrew>) => {
      const { data } = await client.post<Homebrew>('/homebrew', newItem);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homebrew'] });
    },
  });
};

export const useDeleteHomebrew = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/homebrew/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['homebrew'] });
    },
  });
};
