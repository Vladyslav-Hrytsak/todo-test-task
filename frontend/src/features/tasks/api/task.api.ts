import { apiClient } from '@/lib/axios';
import type {
    Task,
    CreateTaskPayload,
    UpdateTaskPayload,
    TaskQueryParams,
} from '../types/task.types';

/**
 * Тонкий слой над axios: каждая функция — один HTTP-запрос, один тип ответа.
 * Ничего не знает о React/React Query — переиспользуем эти функции
 * и в хуках, и потенциально в server actions/SSR при необходимости.
 */
export const taskApi = {
    getAll: async (params: TaskQueryParams = {}): Promise<Task[]> => {
        const { data } = await apiClient.get<Task[]>('/tasks', { params });
        return data;
    },

    getById: async (id: string): Promise<Task> => {
        const { data } = await apiClient.get<Task>(`/tasks/${id}`);
        return data;
    },

    create: async (payload: CreateTaskPayload): Promise<Task> => {
        const { data } = await apiClient.post<Task>('/tasks', payload);
        return data;
    },

    update: async (id: string, payload: UpdateTaskPayload): Promise<Task> => {
        const { data } = await apiClient.patch<Task>(`/tasks/${id}`, payload);
        return data;
    },

    toggleDone: async (id: string): Promise<Task> => {
        const { data } = await apiClient.patch<Task>(`/tasks/${id}/toggle`);
        return data;
    },

    delete: async (id: string): Promise<void> => {
        await apiClient.delete(`/tasks/${id}`);
    },
};