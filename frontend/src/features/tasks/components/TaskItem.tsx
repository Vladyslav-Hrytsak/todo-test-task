'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useToggleTask } from '../hooks/useToggleTask';
import { useDeleteTask } from '../hooks/useDeleteTask';
import type { Task } from '../types/task.types';

interface TaskItemProps {
    task: Task;
}

function getPriorityVariant(priority: number): 'secondary' | 'default' | 'destructive' {
    if (priority >= 8) return 'destructive';
    if (priority >= 4) return 'default';
    return 'secondary';
}

function formatDueDate(dueDate: string): string {
    return new Date(dueDate).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
    });
}

function isOverdue(dueDate: string, done: boolean): boolean {
    // Просроченной задача считается только если она ещё не выполнена —
    // выполненная задача с прошедшим due date не должна пугать пользователя красным
    return !done && new Date(dueDate) < new Date();
}

export function TaskItem({ task }: TaskItemProps) {
    const toggleTask = useToggleTask();
    const deleteTask = useDeleteTask();

    const overdue = task.dueDate ? isOverdue(task.dueDate, task.done) : false;

    return (
        <div className="flex items-center gap-3 rounded-lg border p-3">
            <Checkbox
                checked={task.done}
                onCheckedChange={() => toggleTask.mutate(task.id)}
                aria-label={`Mark "${task.title}" as ${task.done ? 'undone' : 'done'}`}
            />

            <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${task.done ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                </p>
                {task.description && (
                    <p className="text-xs text-muted-foreground truncate">{task.description}</p>
                )}
            </div>

            {task.dueDate && (
                <Badge variant={overdue ? 'destructive' : 'outline'} className="shrink-0">
                    {overdue ? 'Overdue: ' : 'Due '}
                    {formatDueDate(task.dueDate)}
                </Badge>
            )}

            {task.category && (
                <Badge variant="outline" className="shrink-0">
                    {task.category}
                </Badge>
            )}

            <Badge variant={getPriorityVariant(task.priority)} className="shrink-0">
                P{task.priority}
            </Badge>

            <Button
                variant="ghost"
                size="sm"
                onClick={() => deleteTask.mutate(task.id)}
                disabled={deleteTask.isPending}
                aria-label={`Delete "${task.title}"`}
            >
                Delete
            </Button>
        </div>
    );
}