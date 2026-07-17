import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { taskApi } from '../api/task.api';
import { taskKeys } from '../api/query-keys';
import type { UpdateTaskPayload } from '../types/task.types';

interface UpdateTaskArgs {
    id: string;
    payload: UpdateTaskPayload;
}

export function useUpdateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, payload }: UpdateTaskArgs) => taskApi.update(id, payload),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            toast.success('Task updated');
        },
        onError: () => {
            toast.error('Failed to update task');
        },
    });
}