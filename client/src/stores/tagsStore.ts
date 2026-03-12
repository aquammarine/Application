import { create } from 'zustand';
import { tagsApi } from '../api/tags';
import type { Tag } from '../types/tag';

interface TagsState {
  tags: Tag[];
  isLoading: boolean;
  error: string | null;
  fetchTags: () => Promise<void>;
  getTagById: (id: string) => Tag | undefined;
  getTagByName: (name: string) => Tag | undefined;
}

export const useTagsStore = create<TagsState>((set, get) => ({
  tags: [],
  isLoading: false,
  error: null,
  fetchTags: async () => {
    if (get().tags.length > 0) return;
    set({ isLoading: true, error: null });
    try {
      const tags = await tagsApi.getAll();
      set({ tags, isLoading: false });
    } catch {
      set({ error: 'Failed to load tags', isLoading: false });
    }
  },
  getTagById: (id) => get().tags.find((t) => t.id === id),
  getTagByName: (name) => get().tags.find((t) => t.nameLower === name.toLowerCase()),
}));
