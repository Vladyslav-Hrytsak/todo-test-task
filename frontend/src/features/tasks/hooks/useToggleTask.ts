import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { taskApi } from '../api/task.api';
import { taskKeys } from '../api/query-keys';
import type { Task } from '../types/task.types';

export function useToggleTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: taskApi.toggleDone,
        onMutate: async (id: string) => {
            await queryClient.cancelQueries({ queryKey: taskKeys.lists() });

            const previousQueries = queryClient.getQueriesData<Task[]>({
                queryKey: taskKeys.lists(),
            });

            previousQueries.forEach(([queryKey, tasks]) => {
                if (!tasks) return;
                queryClient.setQueryData<Task[]>(
                    queryKey,
                    tasks.map((task) => (task.id === id ? { ...task, done: !task.done } : task)),
                );
            });

            return { previousQueries };
        },
        onError: (_err, _id, context) => {
            context?.previousQueries.forEach(([queryKey, tasks]) => {
                queryClient.setQueryData(queryKey, tasks);
            });
            toast.error('Failed to update task status');
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
        },
    });
}