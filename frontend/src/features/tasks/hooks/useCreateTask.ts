import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { taskApi } from '../api/task.api';
import { taskKeys } from '../api/query-keys';

export function useCreateTask() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: taskApi.create,
        onSuccess: () => {
            // Инвалидируем все списки задач — простая и надёжная стратегия
            // для CRUD-приложения такого масштаба (альтернатива — optimistic update,
            // избыточна для scope теста, но упомянуть в Loom стоит как trade-off)
            queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
            toast.success('Task created');
        },
        onError: () => {
            toast.error('Failed to create task');
        },
    });
}