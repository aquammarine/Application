import client from './auth-client';

export const assistantApi = {
  ask: async (question: string): Promise<string> => {
    const { data } = await client.post<{ answer: string }>('/assistant', { question });
    return data.answer;
  },
};
