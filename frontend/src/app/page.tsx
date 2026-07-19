'use client';

import { useState } from 'react';
import { TaskForm, TaskFilters, TaskList } from '@/features/tasks/components';
import { useTasks } from '@/features/tasks/hooks';
import type { TaskQueryParams } from '@/features/tasks/types/task.types';

export default function Home() {
    const [filters, setFilters] = useState<TaskQueryParams>({
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const { data: tasks, isLoading, isError } = useTasks(filters);

    return (
        <main className="mx-auto max-w-2xl px-4 py-10">
            <h1 className="text-2xl font-semibold mb-1">Todo</h1>
            <p className="text-sm text-muted-foreground mb-6">
                Test task submission — task management application
            </p>

            <div className="space-y-6">
                <TaskForm />
                <TaskFilters filters={filters} onChange={setFilters} />
                <TaskList tasks={tasks} isLoading={isLoading} isError={isError} />
            </div>
        </main>
    );
}