import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import client from './client';
import type { Character } from '../types/character';

export const useCharacters = () => {
  return useQuery({
    queryKey: ['characters'],
    queryFn: async () => {
      const { data } = await client.get<Character[]>('/characters');
      return data;
    },
  });
};

export const useCharacter = (id: string | undefined) => {
  return useQuery({
    queryKey: ['characters', id],
    queryFn: async () => {
      const { data } = await client.get<Character>(`/characters/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateCharacter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (newChar: Partial<Character>) => {
      const { data } = await client.post<Character>('/characters', newChar);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
    },
  });
};

export const useUpdateCharacter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updateData }: Partial<Character> & { id: string }) => {
      const { data } = await client.put<Character>(`/characters/${id}`, updateData);
      return data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['characters'] });
      queryClient.invalidateQueries({ queryKey: ['characters', variables.id] });
    },
  });
};

export const useDeleteCharacter = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      await client.delete(`/characters/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['characters'], exact: true });
    },
  });
};
