import { create } from 'zustand';
import { eventsApi } from '../api/eventsApi';
import { useAuthStore } from './auth.store';
import type { CreateEventDto, Event, UpdateEventDto } from '../types/events.type';

interface EventsState {
    events: Event[];
    myEvents: Event[];
    currentEvent: Event | null;
    isLoading: boolean;
    error: string | null;

    fetchPublicEvents: () => Promise<void>;
    fetchAllEvents: (tagIds?: string[]) => Promise<void>;
    fetchMyEvents: () => Promise<void>;
    fetchEventById: (id: string) => Promise<void>;
    createEvent: (dto: CreateEventDto) => Promise<void>;
    updateEvent: (id: string, dto: UpdateEventDto) => Promise<void>;
    deleteEvent: (id: string) => Promise<void>;
    joinEvent: (id: string) => Promise<void>;
    leaveEvent: (id: string) => Promise<void>;
}

export const useEventsStore = create<EventsState>((set, get) => ({
    events: [],
    myEvents: [],
    currentEvent: null,
    isLoading: false,
    error: null,

    fetchPublicEvents: async () => {
        set({ isLoading: true, error: null });
        try {
            const [events, myEvents] = await Promise.all([
                eventsApi.getAllPublic(),
                useAuthStore.getState().user ? eventsApi.getMyEvents() : Promise.resolve([])
            ]);
            set({ events, myEvents, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to fetch events', isLoading: false });
        }
    },

    fetchAllEvents: async (tagIds?: string[]) => {
        set({ isLoading: true, error: null });
        try {
            const [events, myEvents] = await Promise.all([
                tagIds && tagIds.length > 0
                    ? eventsApi.getAll(tagIds)
                    : eventsApi.getAllPublic(),
                useAuthStore.getState().user ? eventsApi.getMyEvents() : Promise.resolve([])
            ]);
            set({ events, myEvents, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to fetch events', isLoading: false });
        }
    },

    fetchMyEvents: async () => {
        set({ isLoading: true, error: null });
        try {
            const myEvents = await eventsApi.getMyEvents();
            set({ myEvents, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to fetch your events', isLoading: false });
        }
    },

    fetchEventById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            const event = await eventsApi.getById(id);
            set({ currentEvent: event, isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Event not found', isLoading: false });
        }
    },

    createEvent: async (dto: CreateEventDto) => {
        set({ isLoading: true, error: null });
        try {
            await eventsApi.create(dto);
            await get().fetchPublicEvents();
            set({ isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to create event', isLoading: false });
            throw err;
        }
    },

    updateEvent: async (id: string, dto: UpdateEventDto) => {
        set({ isLoading: true, error: null });
        try {
            await eventsApi.update(id, dto);
            await get().fetchEventById(id);
            set({ isLoading: false });
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to update event', isLoading: false });
            throw err;
        }
    },

    deleteEvent: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
            await eventsApi.delete(id);
            set((state) => ({
                events: state.events.filter(e => e.id !== id),
                myEvents: state.myEvents.filter(e => e.id !== id),
                isLoading: false
            }));
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to delete event', isLoading: false });
        }
    },

    joinEvent: async (id: string) => {
        try {
            await eventsApi.join(id);
            const [updatedEvent, myEvents] = await Promise.all([
                eventsApi.getById(id),
                eventsApi.getMyEvents()
            ]);
            set((state) => ({
                events: state.events.map(e => e.id === id ? updatedEvent : e),
                myEvents,
                currentEvent: state.currentEvent?.id === id ? updatedEvent : state.currentEvent
            }));
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to join event' });
        }
    },

    leaveEvent: async (id: string) => {
        try {
            await eventsApi.leave(id);
            const [updatedEvent, myEvents] = await Promise.all([
                eventsApi.getById(id),
                eventsApi.getMyEvents()
            ]);
            set((state) => ({
                events: state.events.map(e => e.id === id ? updatedEvent : e),
                myEvents,
                currentEvent: state.currentEvent?.id === id ? updatedEvent : state.currentEvent
            }));
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Failed to leave event' });
        }
    },
}));
