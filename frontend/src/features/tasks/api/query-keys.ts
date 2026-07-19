import type { TaskQueryParams } from '../types/task.types';


export const taskKeys = {
    all: ['tasks'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
    list: (params: TaskQueryParams) => [...taskKeys.lists(), params] as const,
    details: () => [...taskKeys.all, 'detail'] as const,
    detail: (id: string) => [...taskKeys.details(), id] as const,
};