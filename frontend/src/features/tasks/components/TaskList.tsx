'use client';

import { TaskItem } from './TaskItem';
import type { Task } from '../types/task.types';

interface TaskListProps {
    tasks: Task[] | undefined;
    isLoading: boolean;
    isError: boolean;
}

export function TaskList({ tasks, isLoading, isError }: TaskListProps) {
    if (isLoading) {
        return <p className="text-sm text-muted-foreground py-8 text-center">Loading tasks...</p>;
    }

    if (isError) {
        return (
            <p className="text-sm text-destructive py-8 text-center">
                Failed to load tasks. Please check your connection and try again.
            </p>
        );
    }

    if (!tasks || tasks.length === 0) {
        return (
            <p className="text-sm text-muted-foreground py-8 text-center">
                No tasks found. Add one above to get started.
            </p>
        );
    }

    return (
        <div className="space-y-2">
            {tasks.map((task) => (
                <TaskItem key={task.id} task={task} />
            ))}
        </div>
    );
}