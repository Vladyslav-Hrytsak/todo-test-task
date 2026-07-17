import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { taskApi } from '../api/task.api';
import { taskKeys } from '../api/query-keys';

export function useDeleteTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: taskApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            toast.success('Task deleted');
        },
        onError: () => {
            toast.error('Failed to delete task');
        },
    });
}