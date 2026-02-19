import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { UserProfile, BusinessCard, SavedContent, Idea, Reminder, ContentType } from '../backend';
import { Principal } from '@dfinity/principal';
import { toast } from 'sonner';

// User Profile Queries
export function useGetCallerUserProfile() {
  const { actor, isFetching: actorFetching } = useActor();

  const query = useQuery<UserProfile | null>({
    queryKey: ['currentUserProfile'],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getCallerUserProfile();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });

  return {
    ...query,
    isLoading: actorFetching || query.isLoading,
    isFetched: !!actor && query.isFetched,
  };
}

export function useSaveCallerUserProfile() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: UserProfile) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveCallerUserProfile(profile);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['currentUserProfile'] });
      toast.success('Profile saved successfully');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save profile: ${error.message}`);
    },
  });
}

// Business Card Queries
export function useGetBusinessCard() {
  const { actor, isFetching } = useActor();

  return useQuery<BusinessCard | null>({
    queryKey: ['businessCard'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBusinessCard();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetBusinessCardByPrincipal(principal: Principal | null) {
  const { actor } = useActor();

  return useQuery<BusinessCard | null>({
    queryKey: ['businessCard', principal?.toString()],
    queryFn: async () => {
      if (!actor || !principal) return null;
      return actor.getBusinessCardByPrincipal(principal);
    },
    enabled: !!actor && !!principal,
    retry: false,
  });
}

export function useSaveBusinessCard() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (card: BusinessCard) => {
      if (!actor) throw new Error('Actor not available');
      await actor.saveBusinessCard(card);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['businessCard'] });
      toast.success('Business card saved');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });
}

// Saved Content Queries
export function useListSavedContent(filterType?: ContentType) {
  const { actor, isFetching } = useActor();

  return useQuery<SavedContent[]>({
    queryKey: ['savedContent', filterType],
    queryFn: async () => {
      if (!actor) return [];
      const allContent = await actor.listSavedContent();
      if (filterType) {
        return allContent.filter(item => item.contentType === filterType);
      }
      return allContent;
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateSavedContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (content: SavedContent) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createSavedContent(content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedContent'] });
      toast.success('Content saved');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });
}

export function useUpdateSavedContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: SavedContent }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateSavedContent(id, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedContent'] });
      toast.success('Content updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
}

export function useDeleteSavedContent() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteSavedContent(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savedContent'] });
      toast.success('Content deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });
}

// Ideas Queries
export function useListIdeas() {
  const { actor, isFetching } = useActor();

  return useQuery<Idea[]>({
    queryKey: ['ideas'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.listIdeas();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateIdea() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createIdea(id, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      toast.success('Idea saved');
    },
    onError: (error: Error) => {
      toast.error(`Failed to save: ${error.message}`);
    },
  });
}

export function useUpdateIdea() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateIdea(id, content);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      toast.success('Idea updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
}

export function useDeleteIdea() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteIdea(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['ideas'] });
      toast.success('Idea deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });
}

// Reminders Queries
export function useGetReminders() {
  const { actor, isFetching } = useActor();

  return useQuery<Reminder[]>({
    queryKey: ['reminders'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getUpcomingReminders();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (reminder: Reminder) => {
      if (!actor) throw new Error('Actor not available');
      await actor.createReminder(reminder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      toast.success('Reminder created');
    },
    onError: (error: Error) => {
      toast.error(`Failed to create: ${error.message}`);
    },
  });
}

export function useUpdateReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, reminder }: { id: string; reminder: Reminder }) => {
      if (!actor) throw new Error('Actor not available');
      await actor.updateReminder(id, reminder);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      toast.success('Reminder updated');
    },
    onError: (error: Error) => {
      toast.error(`Failed to update: ${error.message}`);
    },
  });
}

export function useDeleteReminder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      if (!actor) throw new Error('Actor not available');
      await actor.deleteReminder(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reminders'] });
      toast.success('Reminder deleted');
    },
    onError: (error: Error) => {
      toast.error(`Failed to delete: ${error.message}`);
    },
  });
}
