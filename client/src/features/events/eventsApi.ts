import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL,
    prepareHeaders: (headers) => {
        const token = localStorage.getItem('access_token');
        if (token) {
            headers.set('authorization', `Bearer ${token}`);
        }
        return headers;
    },
});

const baseQueryWithReauth: BaseQueryFn<
    string | FetchArgs,
    unknown,
    FetchBaseQueryError
> = async (args, api, extraOptions) => {
    let result = await baseQuery(args, api, extraOptions);

    if (result.error && result.error.status === 401) {
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
            const refreshResult: any = await baseQuery(
                {
                    url: '/auth/refresh',
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${refreshToken}` }
                },
                api,
                extraOptions
            );

            if (refreshResult.data) {
                const { access_token, refresh_token } = refreshResult.data;
                localStorage.setItem('access_token', access_token);
                localStorage.setItem('refresh_token', refresh_token);

                result = await baseQuery(args, api, extraOptions);
            } else {
                localStorage.removeItem('access_token');
                localStorage.removeItem('refresh_token');
                localStorage.removeItem('user');
                window.location.href = '/login';
            }
        }
    }
    return result;
};

export const eventsApi = createApi({
    reducerPath: 'eventsApi',
    baseQuery: baseQueryWithReauth,
    tagTypes: ['Event'],
    endpoints: (builder) => ({
        createEvent: builder.mutation({
            query: (newEvent) => ({
                url: '/events',
                method: 'POST',
                body: newEvent,
            }),
            invalidatesTags: ['Event'],
        }),
        getPublicEvents: builder.query<any, void>({
            query: () => '/events/public',
            providesTags: ['Event'],
        }),
        getMyEvents: builder.query<any, void>({
            query: () => '/events/my',
            providesTags: ['Event'],
        }),
        getEventById: builder.query({
            query: (id) => `/events/${id}`,
            providesTags: (_result, _error, id) => [{ type: 'Event', id }],
        }),
        joinEvent: builder.mutation({
            query: (id) => ({
                url: `/events/${id}/join`,
                method: 'POST',
            }),
            invalidatesTags: (_result, _error, id) => ['Event', { type: 'Event', id }],
        }),
        leaveEvent: builder.mutation({
            query: (id) => ({
                url: `/events/${id}/leave`,
                method: 'POST',
            }),
            invalidatesTags: (_result, _error, id) => ['Event', { type: 'Event', id }],
        }),
        updateEvent: builder.mutation({
            query: ({ id, ...patch }) => ({
                url: `/events/${id}`,
                method: 'PATCH',
                body: patch,
            }),
            invalidatesTags: (_result, _error, { id }) => ['Event', { type: 'Event', id }],
        }),
        deleteEvent: builder.mutation({
            query: (id) => ({
                url: `/events/${id}`,
                method: 'DELETE',
            }),
            invalidatesTags: ['Event'],
        }),
    }),
});

export const {
    useCreateEventMutation,
    useGetPublicEventsQuery,
    useGetMyEventsQuery,
    useGetEventByIdQuery,
    useJoinEventMutation,
    useLeaveEventMutation,
    useUpdateEventMutation,
    useDeleteEventMutation
} = eventsApi;
