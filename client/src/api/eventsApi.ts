import api from './auth-client';
import type { Event, CreateEventDto, UpdateEventDto } from '../types/events.type';

export const eventsApi = {
    create: async (dto: CreateEventDto): Promise<Event> => {
        const { data } = await api.post<Event>('/events', dto);
        return data;
    },

    getAllPublic: async (): Promise<Event[]> => {
        const { data } = await api.get<Event[]>('/events/public');
        return data;
    },

    getMyEvents: async (): Promise<Event[]> => {
        const { data } = await api.get<Event[]>('/events/my');
        return data;
    },

    getById: async (id: string): Promise<Event> => {
        const { data } = await api.get<Event>(`/events/${id}`);
        return data;
    },

    update: async (id: string, dto: UpdateEventDto): Promise<Event> => {
        const { data } = await api.patch<Event>(`/events/${id}`, dto);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await api.delete(`/events/${id}`);
    },

    join: async (id: string): Promise<void> => {
        await api.post(`/events/${id}/join`);
    },

    leave: async (id: string): Promise<void> => {
        await api.post(`/events/${id}/leave`);
    },
};
