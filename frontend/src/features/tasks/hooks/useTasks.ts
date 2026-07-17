import { useQuery } from '@tanstack/react-query';
import { taskApi } from '../api/task.api';
import { taskKeys } from '../api/query-keys';
import type { TaskQueryParams } from '../types/task.types';

export function useTasks(params: TaskQueryParams) {
    return useQuery({
        queryKey: taskKeys.list(params),
        queryFn: () => taskApi.getAll(params),
    });
}