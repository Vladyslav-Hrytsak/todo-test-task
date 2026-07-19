import { Task } from '@prisma/client';

export type { Task };

export type TaskStatus = 'all' | 'done' | 'undone';
export type SortField = 'priority' | 'createdAt' | 'dueDate';
export type SortOrder = 'asc' | 'desc';

export interface CreateTaskDTO {
    title: string;
    description?: string;
    priority?: number;
    category?: string;
    dueDate?: string;
}

export interface UpdateTaskDTO {
    title?: string;
    description?: string;
    done?: boolean;
    priority?: number;
    category?: string;
    dueDate?: string | null;
}

export interface TaskQueryOptions {
    search?: string;
    status?: TaskStatus;
    sortBy?: SortField;
    sortOrder?: SortOrder;
}