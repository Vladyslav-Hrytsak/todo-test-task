import type { TaskQueryParams } from '../types/task.types';

/**
 * Централизованные query-keys для React Query.
 * Без этого легко опечататься в ключе кэша в разных хуках ("tasks" vs "task"),
 * что сломает инвалидацию кэша после мутаций — частая скрытая причина багов
 * "данные не обновляются после создания/удаления".
 */
export const taskKeys = {
    all: ['tasks'] as const,
    lists: () => [...taskKeys.all, 'list'] as const,
    list: (params: TaskQueryParams) => [...taskKeys.lists(), params] as const,
    details: () => [...taskKeys.all, 'detail'] as const,
    detail: (id: string) => [...taskKeys.details(), id] as const,
};