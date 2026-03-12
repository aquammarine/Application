import client from './auth-client';
import type { Tag } from '../types/tag';

export const tagsApi = {
  getAll: async (): Promise<Tag[]> => {
    const { data } = await client.get<Tag[]>('/tags');
    return data;
  },

  updateEventTags: async (eventId: string, tagIds: string[]): Promise<void> => {
    await client.patch(`/events/${eventId}/tags`, { tagIds });
  },
};
